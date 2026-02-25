const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Get current queue status
router.get('/status', async (req, res) => {
  const { count } = await supabase
    .from('matchmaking_queue')
    .select('*', { count: 'exact' });
  res.json({ playersInQueue: count || 0 });
});

// Clear stale queue entries older than 5 minutes
router.delete('/cleanup', async (req, res) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  await supabase
    .from('matchmaking_queue')
    .delete()
    .lt('joined_at', fiveMinutesAgo);
  res.json({ success: true });
});

module.exports = router;
