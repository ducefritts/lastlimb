-- ============================================
-- LASTLIMB - Full Supabase Schema
-- Run this entire file in your Supabase SQL editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  gems INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  -- Equipped cosmetics
  equipped_hat TEXT DEFAULT 'none',
  equipped_color TEXT DEFAULT 'white',
  equipped_accessory TEXT DEFAULT 'none',
  equipped_font TEXT DEFAULT 'pixel',
  equipped_gallows TEXT DEFAULT 'classic',
  -- Season pass
  season_pass_active BOOLEAN DEFAULT FALSE,
  season_pass_expires_at TIMESTAMPTZ,
  season_pass_tier INTEGER DEFAULT 0,
  -- Status
  status TEXT DEFAULT 'offline', -- online, offline, in_game
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UNLOCKED ITEMS TABLE
-- ============================================
CREATE TABLE unlocked_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  gem_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' -- common, rare, epic, legendary
);

CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition TEXT NOT NULL
);

CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- FRIENDS TABLE
-- ============================================
CREATE TABLE friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- ============================================
-- GAME SESSIONS TABLE
-- ============================================
CREATE TABLE game_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'waiting', -- waiting, active, finished, cancelled
  current_round INTEGER DEFAULT 1,
  player1_wins INTEGER DEFAULT 0,
  player2_wins INTEGER DEFAULT 0,
  winner_id UUID REFERENCES profiles(id),
  game_mode TEXT DEFAULT 'ranked', -- ranked, casual, tournament
  tournament_id UUID,
  room_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE game_rounds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  word TEXT NOT NULL,
  category TEXT,
  guesser_id UUID REFERENCES profiles(id),
  word_setter_id UUID REFERENCES profiles(id),
  guessed_letters TEXT[] DEFAULT '{}',
  wrong_guesses INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, won, lost
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TOURNAMENTS TABLE
-- ============================================
CREATE TABLE tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, active, finished
  max_players INTEGER DEFAULT 8,
  current_players INTEGER DEFAULT 0,
  prize_gems INTEGER DEFAULT 500,
  entry_fee INTEGER DEFAULT 50,
  starts_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  winner_id UUID REFERENCES profiles(id),
  bracket JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tournament_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  eliminated BOOLEAN DEFAULT FALSE,
  placement INTEGER,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- ============================================
-- LEADERBOARD VIEW
-- ============================================
CREATE VIEW leaderboard AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.level,
  p.xp,
  p.wins,
  p.losses,
  p.total_games,
  p.equipped_hat,
  p.equipped_color,
  CASE WHEN p.total_games > 0 THEN ROUND((p.wins::NUMERIC / p.total_games) * 100, 1) ELSE 0 END AS win_rate,
  ROW_NUMBER() OVER (ORDER BY p.xp DESC) AS rank
FROM profiles p
WHERE p.total_games > 0;

-- ============================================
-- STORE TRANSACTIONS
-- ============================================
CREATE TABLE store_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- gem_pack, cosmetic, season_pass, font
  gems_spent INTEGER DEFAULT 0,
  real_money_cents INTEGER DEFAULT 0,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MATCHMAKING QUEUE
-- ============================================
CREATE TABLE matchmaking_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  game_mode TEXT DEFAULT 'ranked',
  rating INTEGER DEFAULT 1000,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (id, name, description, icon, xp_reward, gem_reward, rarity) VALUES
('first_win', 'First Blood', 'Win your first game', '🏆', 100, 10, 'common'),
('win_streak_3', 'On Fire', 'Win 3 games in a row', '🔥', 200, 20, 'common'),
('win_streak_5', 'Unstoppable', 'Win 5 games in a row', '⚡', 400, 50, 'rare'),
('win_streak_10', 'Legendary Streak', 'Win 10 games in a row', '👑', 1000, 150, 'legendary'),
('win_10', 'Veteran', 'Win 10 total games', '🎖️', 300, 30, 'common'),
('win_50', 'Champion', 'Win 50 total games', '🥇', 750, 75, 'rare'),
('win_100', 'Master', 'Win 100 total games', '💎', 2000, 200, 'epic'),
('perfect_game', 'Untouchable', 'Win a round with 0 wrong guesses', '✨', 500, 50, 'rare'),
('close_call', 'Living Dangerously', 'Win a round with only 1 limb left', '😰', 300, 30, 'rare'),
('word_long', 'Big Brain', 'Guess a word with 12+ letters', '🧠', 400, 40, 'rare'),
('tournament_win', 'Tournament Champion', 'Win a tournament', '🏅', 1000, 100, 'epic'),
('tournament_enter', 'Competitor', 'Enter your first tournament', '🎯', 100, 10, 'common'),
('friend_1', 'Social Butterfly', 'Add your first friend', '🦋', 100, 10, 'common'),
('friend_5', 'Popular', 'Have 5 friends', '👥', 200, 20, 'common'),
('season_pass', 'Season Veteran', 'Purchase your first Season Pass', '🎫', 500, 0, 'rare'),
('level_10', 'Level 10', 'Reach level 10', '🌟', 500, 50, 'rare'),
('level_25', 'Level 25', 'Reach level 25', '💫', 1000, 100, 'epic'),
('gem_spend_100', 'Big Spender', 'Spend 100 gems in the store', '💎', 200, 0, 'common'),
('customize_first', 'Fashion Forward', 'Equip a cosmetic item', '👗', 100, 10, 'common'),
('daily_login_7', 'Dedicated', 'Log in 7 days in a row', '📅', 300, 30, 'rare');

-- ============================================
-- SEED BADGES
-- ============================================
INSERT INTO badges (id, name, description, icon, condition) VALUES
('newcomer', 'Newcomer', 'Just joined LastLimb', '🌱', 'Account created'),
('wordsmith', 'Wordsmith', '10 wins', '📝', 'wins >= 10'),
('veteran', 'Veteran', '50 wins', '⚔️', 'wins >= 50'),
('legend', 'Legend', '100 wins', '👑', 'wins >= 100'),
('streak_master', 'Streak Master', '5 win streak', '🔥', 'best_streak >= 5'),
('tournament_hero', 'Tournament Hero', 'Won a tournament', '🏆', 'tournament_wins >= 1'),
('gem_hoarder', 'Gem Hoarder', 'Collected 1000 gems', '💎', 'total_gems_earned >= 1000'),
('social_star', 'Social Star', '5+ friends', '⭐', 'friends >= 5');

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, write own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Unlocked items
CREATE POLICY "Users can view own items" ON unlocked_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON unlocked_items FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Friendships
CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can manage own friendships" ON friendships FOR ALL USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Game sessions: viewable by participants
CREATE POLICY "Game sessions viewable by participants" ON game_sessions FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Leaderboard is public
CREATE POLICY "Leaderboard is public" ON profiles FOR SELECT USING (true);

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime on these tables in Supabase dashboard:
-- profiles, game_sessions, game_rounds, matchmaking_queue, friendships
-- ============================================

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE game_rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE friendships;
