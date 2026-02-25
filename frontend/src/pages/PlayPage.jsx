import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from '../lib/store'
import HangmanPixel from '../components/HangmanPixel'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { supabase } from '../lib/supabase'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function PlayPage() {
  const { user, profile, socket, setSocket, currentGame, setCurrentGame, matchmakingStatus, setMatchmakingStatus } = useStore()

  const [gamePhase, setGamePhase] = useState('lobby') // lobby, searching, game, result
  const [gameMode, setGameMode] = useState('ranked')
  const [word, setWord] = useState('')
  const [category, setCategory] = useState('')
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [myRole, setMyRole] = useState('guesser') // guesser | setter
  const [roundScores, setRoundScores] = useState({})
  const [currentRound, setCurrentRound] = useState(1)
  const [opponent, setOpponent] = useState(null)
  const [roomCode, setRoomCode] = useState('')
  const [privateRoomInput, setPrivateRoomInput] = useState('')
  const [matchResult, setMatchResult] = useState(null)
  const [roundResult, setRoundResult] = useState(null)
  const [chat, setChat] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [queueTime, setQueueTime] = useState(0)
  const [gameInfo, setGameInfo] = useState(null)

  // Init socket
  useEffect(() => {
    const initSocket = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const s = io(API, { auth: { token: session.access_token } })

      s.on('connect', () => console.log('Socket connected'))
      s.on('connect_error', err => console.error('Socket error', err.message))

      s.on('queue_status', ({ status }) => setMatchmakingStatus(status))

      s.on('match_found', ({ roomCode, opponent: opp, guesser, wordLength, category: cat, sessionId }) => {
        setRoomCode(roomCode)
        setOpponent(opp)
        setMyRole(guserId => guserId === user.id ? 'guesser' : 'setter')
        setCategory(cat)
        setWord('_'.repeat(wordLength))
        setCurrentRound(1)
        setGuessedLetters([])
        setWrongGuesses(0)
        setRoundResult(null)
        setMatchResult(null)
        setGamePhase('game')
        setMatchmakingStatus('found')
        setGameInfo({ sessionId, guesser })
        toast.success('Match found! Game starting!')
      })

      s.on('round_word', ({ word: w, category: cat }) => {
        setWord(w)
        setCategory(cat)
      })

      s.on('letter_guessed', ({ letter, isCorrect, guessedLetters: gl, wrongGuesses: wg }) => {
        setGuessedLetters(gl)
        setWrongGuesses(wg)
        if (!isCorrect) {
          toast.error(`Wrong! "${letter}"`)
        }
      })

      s.on('round_end', ({ winner, word: revealedWord, scores, guessedLetters: gl, wrongGuesses: wg }) => {
        setGuessedLetters(gl)
        setWrongGuesses(wg)
        setWord(revealedWord)
        setRoundScores(scores)
        setRoundResult({ winner, word: revealedWord })
      })

      s.on('round_start', ({ round, category: cat, guesser, wordLength }) => {
        setCurrentRound(round)
        setCategory(cat)
        setGuessedLetters([])
        setWrongGuesses(0)
        setRoundResult(null)
        setWord('_'.repeat(wordLength))
        setGameInfo(g => ({ ...g, guesser }))
        setMyRole(guesser === user.id ? 'guesser' : 'setter')
      })

      s.on('match_end', ({ winner, scores }) => {
        setRoundScores(scores)
        setMatchResult({ winner, isWin: winner === user.id })
        setGamePhase('result')
        useStore.getState().loadProfile(user.id)
      })

      s.on('private_room_created', ({ roomCode: rc }) => {
        setRoomCode(rc)
        toast.success(`Room created! Code: ${rc}`)
      })

      s.on('private_match_start', ({ players, category: cat, guesser, wordLength }) => {
        setCategory(cat)
        setWord('_'.repeat(wordLength))
        setMyRole(guesser === user.id ? 'guesser' : 'setter')
        setGuessedLetters([])
        setWrongGuesses(0)
        setGamePhase('game')
        toast.success('Match starting!')
      })

      s.on('chat_message', ({ userId: uid, message, timestamp }) => {
        setChat(c => [...c.slice(-50), { userId: uid, message, timestamp }])
      })

      s.on('game_invite', ({ fromUsername, roomCode: rc }) => {
        toast(`${fromUsername} invited you to a match!`, {
          duration: 8000,
          action: { label: 'Join', onClick: () => s.emit('join_private_room', { roomCode: rc }) }
        })
      })

      s.on('room_error', ({ message }) => toast.error(message))

      setSocket(s)
      return s
    }

    let s
    initSocket().then(sock => { s = sock })
    return () => s?.disconnect()
  }, [user?.id])

  // Queue timer
  useEffect(() => {
    if (matchmakingStatus !== 'searching') { setQueueTime(0); return }
    const interval = setInterval(() => setQueueTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [matchmakingStatus])

  const startMatchmaking = () => {
    if (!socket) return toast.error('Not connected')
    socket.emit('join_queue', { mode: gameMode })
    setMatchmakingStatus('searching')
    setGamePhase('searching')
  }

  const cancelSearch = () => {
    socket?.emit('leave_queue')
    setMatchmakingStatus('idle')
    setGamePhase('lobby')
  }

  const createPrivateRoom = () => {
    socket?.emit('create_private_room')
  }

  const joinPrivateRoom = () => {
    if (!privateRoomInput.trim()) return
    socket?.emit('join_private_room', { roomCode: privateRoomInput.trim().toUpperCase() })
  }

  const guessLetter = (letter) => {
    if (myRole !== 'guesser' || guessedLetters.includes(letter.toLowerCase())) return
    socket?.emit('guess_letter', { roomCode, letter: letter.toLowerCase() })
    setGuessedLetters(g => [...g, letter.toLowerCase()])
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    socket?.emit('send_chat', { roomCode, message: chatInput })
    setChatInput('')
  }

  const returnToLobby = () => {
    setGamePhase('lobby')
    setMatchResult(null)
    setRoundResult(null)
    setMatchmakingStatus('idle')
    setCurrentGame(null)
  }

  // Render word
  const displayWord = word ? word.split('').map(l => guessedLetters.includes(l) || l === ' ' ? l : '_').join(' ') : ''

  if (gamePhase === 'lobby') return <LobbyView
    gameMode={gameMode} setGameMode={setGameMode}
    startMatchmaking={startMatchmaking}
    createPrivateRoom={createPrivateRoom}
    joinPrivateRoom={joinPrivateRoom}
    privateRoomInput={privateRoomInput}
    setPrivateRoomInput={setPrivateRoomInput}
    roomCode={roomCode}
    profile={profile}
    socket={socket}
  />

  if (gamePhase === 'searching') return <SearchingView queueTime={queueTime} cancelSearch={cancelSearch} />

  if (gamePhase === 'result') return <ResultView result={matchResult} scores={roundScores} opponent={opponent} returnToLobby={returnToLobby} />

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="arcade-card px-4 py-2 flex items-center gap-3">
          <span className="font-pixel text-xs" style={{ color: '#00fff5' }}>VS</span>
          <span className="font-mono text-sm">{opponent?.username || 'Opponent'}</span>
        </div>
        <div className="arcade-card px-4 py-2 text-center">
          <div className="font-pixel text-xs text-gray-400">ROUND</div>
          <div className="font-pixel text-lg" style={{ color: '#ffbe0b' }}>{currentRound}/3</div>
        </div>
        <div className="arcade-card px-4 py-2 text-right">
          <div className="font-pixel text-xs text-gray-400">SCORE</div>
          <div className="font-pixel text-xs">
            <span style={{ color: '#00fff5' }}>{roundScores[user?.id] || 0}</span>
            {' - '}
            <span style={{ color: '#ff006e' }}>{roundScores[opponent?.id] || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hangman */}
        <div className="arcade-card p-4 flex flex-col items-center">
          <HangmanPixel
            wrongGuesses={wrongGuesses}
            equippedHat={profile?.equipped_hat}
            equippedColor={profile?.equipped_color}
            equippedAccessory={profile?.equipped_accessory}
            equippedGallows={profile?.equipped_gallows}
          />
          <div className="mt-2 text-center">
            <div className="font-pixel text-xs text-gray-500 mb-1">CATEGORY</div>
            <div className="font-mono text-sm uppercase" style={{ color: '#ffbe0b' }}>{category}</div>
          </div>
        </div>

        {/* Game area */}
        <div className="md:col-span-2 space-y-4">
          {/* Role indicator */}
          <div className="arcade-card p-3 text-center">
            <span className="font-pixel text-xs" style={{ color: myRole === 'guesser' ? '#00fff5' : '#ff006e' }}>
              {myRole === 'guesser' ? '🔍 YOU ARE GUESSING' : '👁️ YOU ARE WATCHING'}
            </span>
          </div>

          {/* Word display */}
          <div className="arcade-card p-6 text-center">
            <div className="font-pixel text-2xl tracking-widest" style={{
              color: '#ffffff',
              textShadow: '0 0 10px #00fff5',
              letterSpacing: '0.3em',
              wordBreak: 'break-all'
            }}>
              {displayWord || '_ _ _ _ _'}
            </div>
            <div className="mt-3 text-xs text-gray-500 font-mono">
              {word ? `${word.length} letters` : ''}
            </div>
          </div>

          {/* Round result banner */}
          {roundResult && (
            <div className="arcade-card p-4 text-center" style={{
              borderColor: roundResult.winner === user?.id ? '#06d6a0' : '#ff4444',
              boxShadow: `0 0 15px ${roundResult.winner === user?.id ? '#06d6a0' : '#ff4444'}`
            }}>
              <div className="font-pixel text-sm" style={{ color: roundResult.winner === user?.id ? '#06d6a0' : '#ff4444' }}>
                {roundResult.winner === user?.id ? '🎉 ROUND WIN!' : '💀 ROUND LOST'}
              </div>
              <div className="font-mono text-xs text-gray-400 mt-1">WORD: {roundResult.word.toUpperCase()}</div>
              <div className="text-xs text-gray-600 mt-1">Next round starting...</div>
            </div>
          )}

          {/* Keyboard */}
          {myRole === 'guesser' && !roundResult && (
            <div className="arcade-card p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {LETTERS.map(l => {
                  const lower = l.toLowerCase()
                  const guessed = guessedLetters.includes(lower)
                  const correct = guessed && word.includes(lower)
                  const wrong = guessed && !word.includes(lower)
                  return (
                    <button key={l} onClick={() => guessLetter(l)}
                      disabled={guessed}
                      className={`letter-btn ${correct ? 'correct' : wrong ? 'wrong' : ''}`}>
                      {l}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="arcade-card p-3">
            <div className="text-xs font-pixel text-gray-500 mb-2" style={{ fontSize: 8 }}>CHAT</div>
            <div className="h-20 overflow-y-auto space-y-1 mb-2">
              {chat.map((m, i) => (
                <div key={i} className="text-xs font-mono">
                  <span style={{ color: m.userId === user?.id ? '#00fff5' : '#ff006e' }}>
                    {m.userId === user?.id ? 'You' : opponent?.username}:
                  </span>{' '}
                  <span className="text-gray-300">{m.message}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Type..." maxLength={100}
                className="flex-1 bg-black border text-white text-xs p-2 outline-none font-mono"
                style={{ borderColor: 'rgba(0,255,245,0.2)' }} />
              <button onClick={sendChat} className="btn-pixel btn-cyan text-xs px-3 py-1">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LobbyView({ gameMode, setGameMode, startMatchmaking, createPrivateRoom, joinPrivateRoom, privateRoomInput, setPrivateRoomInput, roomCode, profile, socket }) {
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h2 className="font-pixel text-xl mb-6 text-center" style={{ color: '#00fff5' }}>🎮 PLAY</h2>

      {/* Quick Play */}
      <div className="arcade-card p-6 mb-4">
        <h3 className="font-pixel text-xs mb-4 text-gray-400">QUICK MATCH</h3>
        <div className="flex gap-3 mb-4">
          {['ranked', 'casual'].map(m => (
            <button key={m} onClick={() => setGameMode(m)}
              className={`btn-pixel flex-1 capitalize ${gameMode === m ? 'btn-cyan' : 'btn-yellow'}`}
              style={{ fontSize: 9 }}>
              {m}
            </button>
          ))}
        </div>
        <button onClick={startMatchmaking} className="btn-pixel btn-green w-full" style={{ padding: 16, fontSize: 12 }}>
          ▶ FIND MATCH
        </button>
      </div>

      {/* Private Room */}
      <div className="arcade-card p-6 mb-4">
        <h3 className="font-pixel text-xs mb-4 text-gray-400">PRIVATE MATCH</h3>
        <button onClick={createPrivateRoom} className="btn-pixel btn-pink w-full mb-4" style={{ fontSize: 9 }}>
          CREATE ROOM
        </button>
        {roomCode && (
          <div className="text-center mb-4 p-3 border" style={{ borderColor: '#ff006e' }}>
            <div className="text-xs text-gray-400 font-mono mb-1">ROOM CODE</div>
            <div className="font-pixel text-xl" style={{ color: '#ff006e' }}>{roomCode}</div>
            <div className="text-xs text-gray-600 mt-1">Share with a friend</div>
          </div>
        )}
        <div className="flex gap-2">
          <input value={privateRoomInput} onChange={e => setPrivateRoomInput(e.target.value)}
            placeholder="ENTER CODE..."
            className="flex-1 bg-black border text-white p-2 outline-none font-pixel uppercase"
            style={{ borderColor: 'rgba(255,0,110,0.3)', fontSize: 11 }} />
          <button onClick={joinPrivateRoom} className="btn-pixel btn-pink px-4" style={{ fontSize: 9 }}>JOIN</button>
        </div>
      </div>

      {/* Invite Friend */}
      <FriendInvitePanel socket={socket} profile={profile} />
    </div>
  )
}

function FriendInvitePanel({ socket, profile }) {
  const [friends, setFriends] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    if (!profile) return
    supabase.from('friendships')
      .select('*, requester:requester_id(id,username,status), addressee:addressee_id(id,username,status)')
      .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`)
      .eq('status', 'accepted')
      .then(({ data }) => setFriends(data || []))
  }, [profile])

  const inviteFriend = (friendId) => {
    socket?.emit('create_private_room')
    setTimeout(() => {
      // Will emit once room code is received
    }, 100)
    toast.success('Invite sent!')
  }

  return (
    <div className="arcade-card p-4">
      <button onClick={() => setShowPanel(!showPanel)} className="w-full text-left font-pixel text-xs text-gray-400" style={{ fontSize: 8 }}>
        FRIENDS ONLINE {showPanel ? '▲' : '▼'}
      </button>
      {showPanel && (
        <div className="mt-3 space-y-2">
          {friends.length === 0 && <p className="text-xs text-gray-600 font-mono">No friends yet. Add some!</p>}
          {friends.map(f => {
            const friend = f.requester_id === profile?.id ? f.addressee : f.requester
            return (
              <div key={f.id} className="flex items-center justify-between p-2 border border-gray-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${friend?.status === 'online' ? 'bg-green-400' : 'bg-gray-600'}`} />
                  <span className="font-mono text-sm">{friend?.username}</span>
                </div>
                {friend?.status === 'online' && (
                  <button onClick={() => inviteFriend(friend.id)} className="btn-pixel btn-cyan" style={{ fontSize: 8, padding: '6px 10px' }}>
                    INVITE
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SearchingView({ queueTime, cancelSearch }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="arcade-card p-12 text-center max-w-sm w-full">
        <div className="text-5xl mb-6 animate-float">🔍</div>
        <h2 className="font-pixel text-sm mb-2" style={{ color: '#00fff5' }}>SEARCHING...</h2>
        <p className="font-mono text-gray-400 text-sm mb-6">Looking for an opponent</p>
        <div className="font-pixel text-2xl mb-8" style={{ color: '#ffbe0b' }}>
          {String(Math.floor(queueTime / 60)).padStart(2, '0')}:{String(queueTime % 60).padStart(2, '0')}
        </div>
        {/* Animated dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-3 h-3 bg-cyan-400" style={{
              animation: `glow 1s ${i * 0.3}s ease-in-out infinite alternate`
            }} />
          ))}
        </div>
        <button onClick={cancelSearch} className="btn-pixel btn-pink" style={{ fontSize: 9 }}>
          CANCEL
        </button>
      </div>
    </div>
  )
}

function ResultView({ result, scores, opponent, returnToLobby }) {
  const { user } = useStore()
  const isWin = result?.winner === user?.id

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="arcade-card p-10 text-center max-w-sm w-full" style={{
        borderColor: isWin ? '#06d6a0' : '#ff4444',
        boxShadow: `0 0 30px ${isWin ? '#06d6a0' : '#ff4444'}`
      }}>
        <div className="text-6xl mb-4">{isWin ? '🏆' : '💀'}</div>
        <h2 className="font-pixel text-xl mb-2" style={{ color: isWin ? '#06d6a0' : '#ff4444' }}>
          {isWin ? 'VICTORY!' : 'DEFEATED'}
        </h2>
        <div className="font-pixel text-xs text-gray-400 mb-6">
          {isWin ? '+100 XP · +25 💎' : '+20 XP'}
        </div>
        <div className="font-pixel text-sm mb-6">
          <span style={{ color: '#00fff5' }}>{scores[user?.id] || 0}</span>
          {' — '}
          <span style={{ color: '#ff006e' }}>{scores[opponent?.id] || 0}</span>
        </div>
        <button onClick={returnToLobby} className="btn-pixel btn-cyan w-full" style={{ fontSize: 10 }}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  )
}
