# 🪢 LastLimb — Complete Deployment Guide
## From Zero to Live in ~45 Minutes

---

## OVERVIEW

You'll set up 3 free/cheap services:
1. **Supabase** (free) — Database, Auth, Real-time
2. **Railway** (free tier / ~$5/mo) — Backend server + WebSockets
3. **Vercel** (free) — Frontend hosting

---

## STEP 1: SUPABASE SETUP (~10 min)

### 1.1 Create Account
1. Go to **https://supabase.com**
2. Click "Start your project" → Sign up with GitHub
3. Click "New Project"
   - Name: `lastlimb`
   - Database Password: create a strong one (save it!)
   - Region: choose closest to you
4. Wait ~2 minutes for project to spin up

### 1.2 Run the Database Schema
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. **Copy the entire contents** and paste it into the SQL editor
5. Click **"Run"** (the green button)
6. You should see "Success. No rows returned" — that's correct!

### 1.3 Get Your API Keys
1. Click **Settings** (gear icon) → **API**
2. Copy these two values — you'll need them:
   - **Project URL**: looks like `https://abcdefgh.supabase.co`
   - **anon / public key**: long string starting with `eyJ...`
   - **service_role key**: another long string (keep this SECRET — never put in frontend!)

### 1.4 Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it is by default)
3. For production: go to **Authentication** → **Email Templates** and customize them

### 1.5 Enable Realtime
1. Go to **Database** → **Replication**
2. Under "Source", enable these tables:
   - `profiles`
   - `game_sessions`
   - `game_rounds`
   - `matchmaking_queue`
   - `friendships`

---

## STEP 2: STRIPE SETUP (~10 min)

### 2.1 Create Account
1. Go to **https://stripe.com** → Click "Start now"
2. Complete account creation (you'll need business info for real payments)
3. For testing, you can use **Test Mode** (toggle in dashboard top right)

### 2.2 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key**: starts with `pk_test_...`
   - **Secret key**: starts with `sk_test_...`

### 2.3 Set Up Webhook (after deploying backend)
*Come back to this after Step 3*
1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-railway-backend.railway.app/api/stripe/webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing secret** (starts with `whsec_...`)

### 2.4 Test Cards (for testing)
- Success: `4242 4242 4242 4242` (any future date, any CVC)
- Decline: `4000 0000 0000 0002`

---

## STEP 3: DEPLOY BACKEND TO RAILWAY (~10 min)

### 3.1 Create Railway Account
1. Go to **https://railway.app**
2. Sign up with GitHub

### 3.2 Deploy the Backend
1. Go to your LastLimb project folder
2. Push to GitHub:
   ```bash
   cd lastlimb
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on github.com first, then:
   git remote add origin https://github.com/YOUR_USERNAME/lastlimb.git
   git push -u origin main
   ```
3. In Railway dashboard: **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `lastlimb` repo
5. Railway will ask which folder — select **`backend`**

### 3.3 Set Environment Variables in Railway
Click your service → **Variables** → Add these one by one:

```
PORT=3001
FRONTEND_URL=https://lastlimb.vercel.app   ← (your Vercel URL, update after Step 4)
SUPABASE_URL=https://YOUR_ID.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### 3.4 Get Your Backend URL
After deploy, Railway gives you a URL like:
`https://lastlimb-production-abcd.railway.app`

**Save this URL** — you need it for the frontend.

---

## STEP 4: DEPLOY FRONTEND TO VERCEL (~10 min)

### 4.1 Create Vercel Account
1. Go to **https://vercel.com**
2. Sign up with GitHub

### 4.2 Deploy
1. In Vercel dashboard: **"Add New"** → **"Project"**
2. Import your `lastlimb` GitHub repo
3. **Important settings:**
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Set Environment Variables in Vercel
Go to your project → **Settings** → **Environment Variables**:

```
VITE_SUPABASE_URL=https://YOUR_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-railway-url.railway.app
```

Click **Deploy**!

### 4.4 Update CORS in Railway
Go back to Railway → update `FRONTEND_URL` to your actual Vercel URL:
`https://lastlimb.vercel.app`

---

## STEP 5: FINISH STRIPE WEBHOOK

1. Go back to **Stripe** → **Developers** → **Webhooks**
2. Add endpoint: `https://your-railway-url.railway.app/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Railway

---

## STEP 6: TEST EVERYTHING

### Checklist:
- [ ] Go to your Vercel URL
- [ ] Create an account — you should get 100 starting gems
- [ ] Check Supabase → `profiles` table to see your new user
- [ ] Try buying gems with test card `4242 4242 4242 4242`
- [ ] Open two browser tabs, log in as two different accounts
- [ ] Both click "Find Match" — they should be matched together!
- [ ] Play a round of hangman
- [ ] Check the leaderboard

---

## CUSTOM DOMAIN (Optional)
1. In Vercel: **Settings** → **Domains** → Add your domain
2. Update DNS records as shown
3. Update `FRONTEND_URL` in Railway to your custom domain

---

## CREATING TOURNAMENTS
Tournaments must be created via API (or you can build an admin UI):
```bash
curl -X POST https://your-backend.railway.app/api/tournaments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Weekend Warriors", "maxPlayers": 8, "prizeGems": 500, "entryFee": 50}'
```

---

## TROUBLESHOOTING

**Multiplayer not connecting:**
- Check Railway logs for socket errors
- Make sure CORS `FRONTEND_URL` matches exactly (no trailing slash)
- Verify Supabase URL and service key are correct

**Stripe payments failing:**
- Make sure you're in test mode for testing
- Check the webhook is pointing to the right URL
- Verify `STRIPE_WEBHOOK_SECRET` is correct

**Auth not working:**
- Check Supabase anon key is in Vercel env vars
- Check Supabase project URL is correct

**Database errors:**
- Re-run the schema.sql in Supabase SQL editor
- Check Row Level Security policies are enabled

---

## COSTS

| Service  | Free Tier                        | Paid if needed |
|----------|----------------------------------|----------------|
| Supabase | 500MB DB, 50k users, 2M API req  | $25/mo         |
| Railway  | $5 credit/mo (enough for hobby)  | ~$5-20/mo      |
| Vercel   | Unlimited for personal projects  | $20/mo pro     |
| Stripe   | Free — takes 2.9% + $0.30/txn   | No monthly fee |

**For a small game, total cost = $0-5/month until you get significant traffic.**

---

## QUESTIONS?

If you get stuck on any step, the most common issues are:
1. Wrong env variable names (copy-paste exactly)
2. CORS mismatch between frontend/backend URLs
3. Stripe webhook not pointed to correct URL

Good luck with LastLimb! 🪢
