const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
}

// List open tournaments
router.get('/', async (req, res) => {
  const { data } = await supabase.from('tournaments').select('*, winner:winner_id(username)').in('status', ['open', 'active']).order('starts_at', { ascending: true });
  res.json(data || []);
});

// Join tournament
router.post('/:id/join', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { data: tournament } = await supabase.from('tournaments').select('*').eq('id', id).single();
  
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  if (tournament.status !== 'open') return res.status(400).json({ error: 'Tournament not open' });
  if (tournament.current_players >= tournament.max_players) return res.status(400).json({ error: 'Tournament full' });

  const { data: profile } = await supabase.from('profiles').select('gems').eq('id', req.user.id).single();
  if (profile.gems < tournament.entry_fee) return res.status(400).json({ error: 'Not enough gems' });

  await supabase.from('profiles').update({ gems: supabase.raw(`gems - ${tournament.entry_fee}`) }).eq('id', req.user.id);
  
  await supabase.from('tournament_entries').insert({ tournament_id: id, user_id: req.user.id });
  await supabase.from('tournaments').update({ current_players: supabase.raw('current_players + 1') }).eq('id', id);

  // Grant achievement for first tournament
  await supabase.from('user_achievements').upsert({
    user_id: req.user.id, achievement_id: 'tournament_enter'
  }, { onConflict: 'user_id,achievement_id' });

  res.json({ success: true });
});

// Create tournament (admin)
router.post('/create', authMiddleware, async (req, res) => {
  const { name, maxPlayers, prizeGems, entryFee, startsAt } = req.body;
  const { data } = await supabase.from('tournaments').insert({
    name, max_players: maxPlayers || 8, prize_gems: prizeGems || 500,
    entry_fee: entryFee || 50, starts_at: startsAt || new Date(Date.now() + 3600000)
  }).select().single();
  res.json(data);
});

module.exports = router;
