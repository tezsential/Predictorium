# Predictorium Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)

---

## Part 1: Supabase Setup (Do This First)

### Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: `predictorium` (or any name you prefer)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you (or Europe for Prague timezone alignment)
4. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get API Credentials
1. In your project dashboard, click **Settings** (gear icon in sidebar)
2. Go to **API** section
3. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **publishable (public) key** (recommended; legacy anon key also works)

### Step 3: Configure Local Environment
1. Open `.env.local` in your project
2. Replace with your actual credentials (use the publishable/public key from Step 2):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-public-key-here
```
3. **Save the file**

### Step 4: Configure Auth URLs
1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Set these values:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: Add these (one per line):
     - `http://localhost:3000/app`
     - `http://localhost:3000/**` (wildcard for development)
3. Click **Save**

### Step 5: Run SQL Migrations
1. In Supabase Dashboard, go to **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Copy-paste the contents of `docs/sql-editor-migration.sql` (same as `supabase/migrations/20260114T000000_create_predictions.sql`)
4. Click **"Run"** or press **Cmd/Ctrl + Enter**
5. Verify: Go to **Table Editor** → you should see `predictions` and `prediction_items` tables

---

## Part 2: Local Development

### Start Dev Server
```bash
cd /Users/jirka/Library/CloudStorage/OneDrive-sangix.co.uk/PROJECTS/predictorium
npm run dev
```

### Test Authentication
1. Open http://localhost:3000
2. You'll be redirected to `/login`
3. Enter your email
4. Check your inbox for magic link
5. Click the link → should redirect to `/app` dashboard

---

## Part 3: Vercel Deployment (Do This Last)

### When to Deploy?
- **Now**: You can deploy anytime to get a live URL
- **Later**: Wait until all features are complete
- Vercel automatically redeploys on every git push

### Step 1: Push to GitHub (if not done)
```bash
git init
git add .
git commit -m "Initial Predictorium setup"
git remote add origin https://github.com/YOUR_USERNAME/predictorium.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (leave default)

### Step 3: Add Environment Variables in Vercel
1. During import or in **Settings** → **Environment Variables**
2. Add these variables (copy from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` → your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon key
3. Apply to: **Production, Preview, Development**

### Step 4: Update Supabase Redirect URLs
1. After deployment, Vercel gives you a URL like `https://predictorium.vercel.app`
2. Go back to Supabase Dashboard → **Authentication** → **URL Configuration**
3. Update:
   - **Site URL**: `https://predictorium.vercel.app`
   - **Redirect URLs**: Add these:
     - `https://predictorium.vercel.app/app`
     - `https://predictorium.vercel.app/**`
     - Keep localhost URLs for local development
4. Click **Save**

### Step 5: Deploy
- Click **"Deploy"** in Vercel
- Wait 2-3 minutes
- Visit your live site!

---

## Troubleshooting

### "Invalid Project Config" error
- Double-check `.env.local` has correct values
- Restart dev server after changing env vars

### Magic link not working
- Check spam folder
- Verify redirect URLs in Supabase include your domain
- Check Supabase logs: **Authentication** → **Logs**

### 404 on protected routes
- Ensure middleware.ts exists in project root
- Check middleware is running: add console.log to verify

### Database connection issues
- Verify anon key is correct (not service_role key)
- Check if RLS policies are enabled
- Test SQL queries in Supabase SQL Editor first

---

## Next Steps
1. ✅ Complete Supabase setup above
2. ⏳ Run SQL migrations (script coming next)
3. ⏳ Complete app features (editor, predictions, etc.)
4. ⏳ Deploy to Vercel when ready

## Quick Reference

**Local Dev:**
```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check code quality
```

**Supabase Dashboard:**
- Auth logs: Authentication → Logs
- Database: Table Editor
- SQL: SQL Editor
- API Docs: API Docs (generated automatically)

**Vercel Dashboard:**
- Deployments: See all builds
- Logs: Runtime logs
- Environment Variables: Settings → Environment Variables
