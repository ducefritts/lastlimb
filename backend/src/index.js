require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/game', require('./routes/game'));
app.use('/api/matchmaking', require('./routes/matchmaking'));
app.use('/api/tournaments', require('./routes/tournaments'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ============================================
// SOCKET.IO - Real-time game logic
// ============================================

// Track active rooms and players
const activeRooms = new Map(); // roomCode -> gameState
const playerSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

const WORDS_BY_CATEGORY = {
  animals: ['elephant', 'giraffe', 'penguin', 'crocodile', 'hippopotamus', 'chimpanzee', 'rhinoceros', 'flamingo'],
  movies: ['inception', 'interstellar', 'gladiator', 'terminator', 'avengers', 'jurassic', 'titanic', 'avatar'],
  food: ['spaghetti', 'quesadilla', 'guacamole', 'bruschetta', 'prosciutto', 'croissant', 'tiramisu', 'ceviche'],
  tech: ['javascript', 'algorithm', 'database', 'encryption', 'framework', 'bandwidth', 'cryptocurrency', 'interface'],
  sports: ['basketball', 'volleyball', 'gymnastics', 'wrestling', 'badminton', 'lacrosse', 'snowboarding', 'skateboarding'],
  places: ['amsterdam', 'barcelona', 'singapore', 'istanbul', 'stockholm', 'reykjavik', 'melbourne', 'nairobi'],
  random: ['xylophone', 'chameleon', 'labyrinth', 'phenomenon', 'juxtapose', 'kaleidoscope', 'silhouette', 'whimsical']
};

function getRandomWord() {
  const categories = Object.keys(WORDS_BY_CATEGORY);
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const words = WORDS_BY_CATEGORY[cat];
  return { word: words[Math.floor(Math.random() * words.length)], category: cat };
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return next(new Error('Invalid token'));
    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', async (socket) => {
  const userId = socket.userId;
  playerSockets.set(userId, socket.id);
  socketUsers.set(socket.id, userId);

  // Update user status to online
  await supabase.from('profiles').update({ status: 'online', last_seen: new Date() }).eq('id', userId);
  
  console.log(`User ${userId} connected`);

  // ---- MATCHMAKING ----
  socket.on('join_queue', async ({ mode }) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    await supabase.from('matchmaking_queue').upsert({ user_id: userId, game_mode: mode, rating: profile.xp });
    
    socket.emit('queue_status', { status: 'searching' });
    
    // Try to find a match
    const { data: queue } = await supabase
      .from('matchmaking_queue')
      .select('*, profiles(*)')
      .eq('game_mode', mode)
      .neq('user_id', userId)
      .order('joined_at', { ascending: true })
      .limit(1);

    if (queue && queue.length > 0) {
      const opponent = queue[0];
      const roomCode = generateRoomCode();
      
      // Remove both from queue
      await supabase.from('matchmaking_queue').delete().in('user_id', [userId, opponent.user_id]);
      
      // Create game session
      const { data: session } = await supabase.from('game_sessions').insert({
        player1_id: userId,
        player2_id: opponent.user_id,
        status: 'active',
        room_code: roomCode,
        game_mode: mode
      }).select().single();

      const { word, category } = getRandomWord();
      
      await supabase.from('game_rounds').insert({
        session_id: session.id,
        round_number: 1,
        word,
        category,
        guesser_id: userId,
        word_setter_id: opponent.user_id
      });

      const gameState = {
        sessionId: session.id,
        roomCode,
        players: { [userId]: profile, [opponent.user_id]: opponent.profiles },
        currentRound: 1,
        scores: { [userId]: 0, [opponent.user_id]: 0 },
        currentWord: word,
        category,
        guessedLetters: [],
        wrongGuesses: 0,
        guesser: userId,
        status: 'active'
      };
      
      activeRooms.set(roomCode, gameState);

      socket.join(roomCode);
      const opponentSocketId = playerSockets.get(opponent.user_id);
      if (opponentSocketId) {
        io.sockets.sockets.get(opponentSocketId)?.join(roomCode);
      }

      io.to(roomCode).emit('match_found', {
        roomCode,
        sessionId: session.id,
        opponent: opponent.user_id === userId ? profile : opponent.profiles,
        gameState: { ...gameState, currentWord: undefined }, // don't send word to guesser
        yourRole: 'guesser',
        word: word // will be filtered per player client-side... send to word_setter only
      });

      // Send word only to word setter
      const setterSocketId = playerSockets.get(opponent.user_id);
      if (setterSocketId) {
        io.to(setterSocketId).emit('round_word', { word, category });
      }
    }
  });

  socket.on('leave_queue', async () => {
    await supabase.from('matchmaking_queue').delete().eq('user_id', userId);
    socket.emit('queue_status', { status: 'idle' });
  });

  // ---- GAME ACTIONS ----
  socket.on('guess_letter', async ({ roomCode, letter }) => {
    const game = activeRooms.get(roomCode);
    if (!game || game.guesser !== userId) return;
    if (game.guessedLetters.includes(letter)) return;

    game.guessedLetters.push(letter);
    const isCorrect = game.currentWord.includes(letter);
    if (!isCorrect) game.wrongGuesses++;

    // Check win/lose
    const wordLetters = game.currentWord.split('');
    const allGuessed = wordLetters.every(l => game.guessedLetters.includes(l));
    const lost = game.wrongGuesses >= 6;

    if (allGuessed || lost) {
      const roundWinner = allGuessed ? userId : Object.keys(game.players).find(id => id !== userId);
      game.scores[roundWinner]++;

      // Update round in DB
      await supabase.from('game_rounds').update({
        guessed_letters: game.guessedLetters,
        wrong_guesses: game.wrongGuesses,
        status: allGuessed ? 'won' : 'lost',
        completed_at: new Date()
      }).eq('session_id', game.sessionId).eq('round_number', game.currentRound);

      io.to(roomCode).emit('round_end', {
        winner: roundWinner,
        word: game.currentWord,
        scores: game.scores,
        guessedLetters: game.guessedLetters,
        wrongGuesses: game.wrongGuesses
      });

      // Check if match over (best 2 of 3)
      const matchWinner = Object.entries(game.scores).find(([, wins]) => wins >= 2);
      
      if (matchWinner) {
        const [winnerId] = matchWinner;
        const loserId = Object.keys(game.players).find(id => id !== winnerId);
        
        // Update DB
        await supabase.from('game_sessions').update({
          winner_id: winnerId,
          status: 'finished',
          finished_at: new Date()
        }).eq('id', game.sessionId);

        // Award XP and gems
        const xpGain = 100;
        const gemGain = 25;
        await supabase.from('profiles').update({
          wins: supabase.raw('wins + 1'),
          xp: supabase.raw(`xp + ${xpGain}`),
          gems: supabase.raw(`gems + ${gemGain}`),
          total_games: supabase.raw('total_games + 1')
        }).eq('id', winnerId);

        await supabase.from('profiles').update({
          losses: supabase.raw('losses + 1'),
          xp: supabase.raw('xp + 20'),
          total_games: supabase.raw('total_games + 1')
        }).eq('id', loserId);

        io.to(roomCode).emit('match_end', { winner: winnerId, scores: game.scores });
        activeRooms.delete(roomCode);
      } else {
        // Start next round
        setTimeout(async () => {
          game.currentRound++;
          const { word: newWord, category: newCat } = getRandomWord();
          game.currentWord = newWord;
          game.category = newCat;
          game.guessedLetters = [];
          game.wrongGuesses = 0;
          // Swap guesser
          game.guesser = Object.keys(game.players).find(id => id !== game.guesser);

          await supabase.from('game_rounds').insert({
            session_id: game.sessionId,
            round_number: game.currentRound,
            word: newWord,
            category: newCat,
            guesser_id: game.guesser,
            word_setter_id: Object.keys(game.players).find(id => id !== game.guesser)
          });

          io.to(roomCode).emit('round_start', {
            round: game.currentRound,
            category: newCat,
            guesser: game.guesser,
            wordLength: newWord.length
          });

          // Send word to setter only
          const setterSocketId = playerSockets.get(Object.keys(game.players).find(id => id !== game.guesser));
          if (setterSocketId) {
            io.to(setterSocketId).emit('round_word', { word: newWord, category: newCat });
          }
        }, 3000);
      }
    } else {
      io.to(roomCode).emit('letter_guessed', {
        letter,
        isCorrect,
        guessedLetters: game.guessedLetters,
        wrongGuesses: game.wrongGuesses
      });
    }
  });

  // ---- PRIVATE MATCH ----
  socket.on('create_private_room', async () => {
    const roomCode = generateRoomCode();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    activeRooms.set(roomCode, {
      roomCode,
      players: { [userId]: profile },
      status: 'waiting',
      isPrivate: true,
      host: userId
    });
    
    socket.join(roomCode);
    socket.emit('private_room_created', { roomCode });
  });

  socket.on('join_private_room', async ({ roomCode }) => {
    const game = activeRooms.get(roomCode);
    if (!game || !game.isPrivate || game.status !== 'waiting') {
      return socket.emit('room_error', { message: 'Room not found or already started' });
    }
    if (Object.keys(game.players).length >= 2) {
      return socket.emit('room_error', { message: 'Room is full' });
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    game.players[userId] = profile;
    socket.join(roomCode);

    const { data: session } = await supabase.from('game_sessions').insert({
      player1_id: game.host,
      player2_id: userId,
      status: 'active',
      room_code: roomCode,
      game_mode: 'casual'
    }).select().single();

    const { word, category } = getRandomWord();
    game.sessionId = session.id;
    game.currentRound = 1;
    game.scores = {};
    Object.keys(game.players).forEach(id => game.scores[id] = 0);
    game.currentWord = word;
    game.category = category;
    game.guessedLetters = [];
    game.wrongGuesses = 0;
    game.guesser = game.host;
    game.status = 'active';

    io.to(roomCode).emit('private_match_start', {
      roomCode,
      players: game.players,
      category,
      guesser: game.host,
      wordLength: word.length
    });

    const setterSocketId = playerSockets.get(userId);
    if (setterSocketId) {
      io.to(setterSocketId).emit('round_word', { word, category });
    }
  });

  // ---- FRIEND INVITE ----
  socket.on('invite_friend', async ({ friendId, roomCode }) => {
    const friendSocketId = playerSockets.get(friendId);
    if (friendSocketId) {
      const { data: profile } = await supabase.from('profiles').select('username, display_name').eq('id', userId).single();
      io.to(friendSocketId).emit('game_invite', {
        fromUserId: userId,
        fromUsername: profile.username,
        roomCode
      });
    }
  });

  // ---- CHAT ----
  socket.on('send_chat', ({ roomCode, message }) => {
    // Basic profanity guard - in production add a proper filter
    const safe = message.substring(0, 100);
    io.to(roomCode).emit('chat_message', { userId, message: safe, timestamp: Date.now() });
  });

  // ---- DISCONNECT ----
  socket.on('disconnect', async () => {
    playerSockets.delete(userId);
    socketUsers.delete(socket.id);
    await supabase.from('profiles').update({ status: 'offline', last_seen: new Date() }).eq('id', userId);
    await supabase.from('matchmaking_queue').delete().eq('user_id', userId);
    console.log(`User ${userId} disconnected`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`LastLimb server running on port ${PORT}`));
