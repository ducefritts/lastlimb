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

// Equip cosmetic
router.post('/equip', authMiddleware, async (req, res) => {
  const { slot, itemId } = req.body; // slot: hat, color, accessory, font, gallows
  
  const validSlots = ['equipped_hat', 'equipped_color', 'equipped_accessory', 'equipped_font', 'equipped_gallows'];
  if (!validSlots.includes(`equipped_${slot}`)) return res.status(400).json({ error: 'Invalid slot' });

  // Verify owned (except defaults)
  if (itemId !== 'none' && itemId !== 'default' && itemId !== 'white' && itemId !== 'pixel' && itemId !== 'classic') {
    const { data: owned } = await supabase.from('unlocked_items')
      .select('id').eq('user_id', req.user.id).eq('item_id', itemId).single();
    if (!owned) return res.status(403).json({ error: 'Item not owned' });
  }

  await supabase.from('profiles').update({ [`equipped_${slot}`]: itemId }).eq('id', req.user.id);
  
  // Grant customize achievement
  await supabase.from('user_achievements').upsert({
    user_id: req.user.id, achievement_id: 'customize_first'
  }, { onConflict: 'user_id,achievement_id' });

  res.json({ success: true });
});

// Season pass tier advance (called when user levels up or makes purchase)
router.post('/season-pass/advance', authMiddleware, async (req, res) => {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
  
  if (!profile.season_pass_active) return res.status(400).json({ error: 'No active season pass' });
  if (profile.season_pass_tier >= 30) return res.status(400).json({ error: 'Max tier reached' });

  const newTier = profile.season_pass_tier + 1;
  await supabase.from('profiles').update({ season_pass_tier: newTier }).eq('id', req.user.id);

  // Grant free tier reward
  const freeRewards = getSeasonPassFreeReward(newTier);
  if (freeRewards) {
    if (freeRewards.item_id) {
      await supabase.from('unlocked_items').upsert({ user_id: req.user.id, item_id: freeRewards.item_id });
    }
    if (freeRewards.gems) {
      await supabase.from('profiles').update({ gems: supabase.raw(`gems + ${freeRewards.gems}`) }).eq('id', req.user.id);
    }
  }

  res.json({ success: true, newTier, reward: freeRewards });
});

// Get full profile with achievements and items
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const [profileRes, achievementsRes, itemsRes, badgesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_achievements').select('*, achievement:achievement_id(*)').eq('user_id', userId),
    supabase.from('unlocked_items').select('*').eq('user_id', userId),
    supabase.from('user_badges').select('*, badge:badge_id(*)').eq('user_id', userId)
  ]);

  res.json({
    profile: profileRes.data,
    achievements: achievementsRes.data || [],
    unlockedItems: itemsRes.data || [],
    badges: badgesRes.data || []
  });
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
  const { data } = await supabase.from('leaderboard').select('*').limit(100);
  res.json(data || []);
});

// Search users
router.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const { data } = await supabase.from('profiles').select('id, username, display_name, status, level, equipped_hat, equipped_color').ilike('username', `%${q}%`).limit(10);
  res.json(data || []);
});

// Send friend request
router.post('/friends/request', authMiddleware, async (req, res) => {
  const { targetId } = req.body;
  if (targetId === req.user.id) return res.status(400).json({ error: "Can't friend yourself" });
  
  await supabase.from('friendships').upsert({
    requester_id: req.user.id, addressee_id: targetId, status: 'pending'
  }, { onConflict: 'requester_id,addressee_id' });

  res.json({ success: true });
});

// Accept friend request
router.post('/friends/accept', authMiddleware, async (req, res) => {
  const { requesterId } = req.body;
  await supabase.from('friendships').update({ status: 'accepted' })
    .eq('requester_id', requesterId).eq('addressee_id', req.user.id);

  // Check friend achievements
  const { count } = await supabase.from('friendships')
    .select('id', { count: 'exact' }).or(`requester_id.eq.${req.user.id},addressee_id.eq.${req.user.id}`).eq('status', 'accepted');
  
  if (count >= 1) await supabase.from('user_achievements').upsert({ user_id: req.user.id, achievement_id: 'friend_1' }, { onConflict: 'user_id,achievement_id' });
  if (count >= 5) await supabase.from('user_achievements').upsert({ user_id: req.user.id, achievement_id: 'friend_5' }, { onConflict: 'user_id,achievement_id' });

  res.json({ success: true });
});

// Get friends list
router.get('/friends', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('friendships')
    .select('*, requester:requester_id(id,username,display_name,status,level), addressee:addressee_id(id,username,display_name,status,level)')
    .or(`requester_id.eq.${req.user.id},addressee_id.eq.${req.user.id}`)
    .eq('status', 'accepted');
  res.json(data || []);
});

// Season pass free reward mapping
function getSeasonPassFreeReward(tier) {
  const freeRewards = {
    1:  { gems: 50 },
    2:  { item_id: 'color_blue' },
    3:  { gems: 75 },
    4:  { item_id: 'hat_cap' },
    5:  { gems: 100 },
    6:  { item_id: 'accessory_glasses' },
    7:  { gems: 100 },
    8:  { item_id: 'color_red' },
    9:  { gems: 150 },
    10: { item_id: 'hat_crown_bronze' },
    11: { gems: 150 },
    12: { item_id: 'gallows_haunted' },
    13: { gems: 200 },
    14: { item_id: 'accessory_scarf' },
    15: { gems: 200 },
    16: { item_id: 'color_gold' },
    // Tiers 17-30 = paid season pass only (handled by client check)
    17: { item_id: 'hat_wizard' },
    18: { gems: 250 },
    19: { item_id: 'color_rainbow' },
    20: { item_id: 'accessory_cape' },
    21: { gems: 300 },
    22: { item_id: 'hat_crown_silver' },
    23: { item_id: 'gallows_neon' },
    24: { gems: 350 },
    25: { item_id: 'accessory_wings' },
    26: { item_id: 'color_cosmic' },
    27: { gems: 400 },
    28: { item_id: 'hat_crown_gold' },
    29: { item_id: 'gallows_fire' },
    30: { item_id: 'skin_legendary', gems: 500 },
  };
  return freeRewards[tier] || null;
}

module.exports = router;
