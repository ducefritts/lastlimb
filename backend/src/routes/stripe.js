const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// ============================================
// STORE ITEMS CATALOG
// ============================================
const STORE_ITEMS = {
  // Gem Packs (real money)
  gems_100:     { name: '100 Gems',      price_cents: 99,   gems: 100,  type: 'gem_pack' },
  gems_500:     { name: '500 Gems',      price_cents: 399,  gems: 500,  type: 'gem_pack' },
  gems_1200:    { name: '1200 Gems',     price_cents: 799,  gems: 1200, type: 'gem_pack' },
  gems_2500:    { name: '2500 Gems',     price_cents: 1499, gems: 2500, type: 'gem_pack' },
  // Season Pass (real money)
  season_pass:  { name: 'Season Pass',   price_cents: 499,  type: 'season_pass', duration_days: 15 },
  // Fonts (gems)
  font_neon:    { name: 'Neon Font',     gem_price: 200,    type: 'font',    id: 'font_neon' },
  font_gothic:  { name: 'Gothic Font',   gem_price: 200,    type: 'font',    id: 'font_gothic' },
  font_bubbly:  { name: 'Bubbly Font',   gem_price: 200,    type: 'font',    id: 'font_bubbly' },
  font_pixel:   { name: 'Pixel Pro',     gem_price: 300,    type: 'font',    id: 'font_pixel' },
  font_horror:  { name: 'Horror Font',   gem_price: 350,    type: 'font',    id: 'font_horror' },
};

// Auth middleware
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
}

// Create Stripe checkout session for real-money items
router.post('/create-checkout', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  const item = STORE_ITEMS[itemId];

  if (!item || (!item.price_cents)) {
    return res.status(400).json({ error: 'Invalid item or not a purchasable item' });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `LastLimb - ${item.name}` },
        unit_amount: item.price_cents
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/store?success=true&item=${itemId}`,
    cancel_url: `${process.env.FRONTEND_URL}/store?cancelled=true`,
    metadata: { userId: req.user.id, itemId }
  });

  res.json({ url: session.url });
});

// Stripe webhook - fulfill purchases
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, itemId } = session.metadata;
    const item = STORE_ITEMS[itemId];

    if (item.type === 'gem_pack') {
      await supabase.from('profiles').update({
        gems: supabase.raw(`gems + ${item.gems}`)
      }).eq('id', userId);
    } else if (item.type === 'season_pass') {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);
      await supabase.from('profiles').update({
        season_pass_active: true,
        season_pass_expires_at: expiresAt,
        season_pass_tier: supabase.raw('GREATEST(season_pass_tier, 1)')
      }).eq('id', userId);

      // Grant achievement
      await supabase.from('user_achievements').upsert({
        user_id: userId,
        achievement_id: 'season_pass'
      }, { onConflict: 'user_id,achievement_id' });
    }

    await supabase.from('store_transactions').insert({
      user_id: userId,
      item_id: itemId,
      item_type: item.type,
      real_money_cents: item.price_cents,
      stripe_payment_id: session.payment_intent
    });
  }

  res.json({ received: true });
});

// Buy with gems (cosmetics, fonts)
router.post('/buy-with-gems', authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  const item = STORE_ITEMS[itemId];

  if (!item || !item.gem_price) {
    return res.status(400).json({ error: 'Invalid item' });
  }

  const { data: profile } = await supabase.from('profiles').select('gems').eq('id', req.user.id).single();

  if (profile.gems < item.gem_price) {
    return res.status(400).json({ error: 'Not enough gems' });
  }

  // Check not already owned
  const { data: existing } = await supabase.from('unlocked_items')
    .select('id').eq('user_id', req.user.id).eq('item_id', itemId).single();

  if (existing) return res.status(400).json({ error: 'Already owned' });

  await supabase.from('profiles').update({ gems: supabase.raw(`gems - ${item.gem_price}`) }).eq('id', req.user.id);
  await supabase.from('unlocked_items').insert({ user_id: req.user.id, item_id: itemId });
  await supabase.from('store_transactions').insert({
    user_id: req.user.id, item_id: itemId, item_type: item.type, gems_spent: item.gem_price
  });

  res.json({ success: true, newGems: profile.gems - item.gem_price });
});

// Get store catalog
router.get('/catalog', (req, res) => res.json(STORE_ITEMS));

module.exports = router;
