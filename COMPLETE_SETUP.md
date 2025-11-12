# Pro Builder - Complete Setup Guide

Complete step-by-step guide to get everything working with your own Supabase account and GitHub Actions.

## Quick Overview

```
Your Supabase Account
        ↓
    (Add Credentials)
        ↓
GitHub Repository → Add Secrets → GitHub Actions → Build APK
        ↓                                              ↓
   .env file                                      Downloads APK
```

## Phase 1: Supabase Setup (20 minutes)

### 1.1 Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Sign up or log in
- Create a new project

### 1.2 Get Your Credentials
1. Open your Supabase project
2. Click **Settings** (left sidebar, bottom)
3. Click **API** tab
4. **Copy these two values**:
   - `Project URL` (example: `https://xyzabc.supabase.co`)
   - `Anon public key` (long string starting with `eyJ...`)

### 1.3 Run SQL Setup
1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Go to file: `SUPABASE_SQL_SETUP.md` in your project
4. Copy the SQL from **Step 2: Create Tables and Policies**
5. Paste into SQL Editor
6. Click **Run** ✅
7. Repeat for Steps 3-9 in that file (one at a time)

### 1.4 Enable Replication
1. Go to **Replication** (left sidebar)
2. Click **Replication** tab
3. Find and toggle ON:
   - `users`
   - `conversations`
   - `messages`

### 1.5 Configure Google OAuth
1. In Supabase, go to **Authentication** → **Providers**
2. Click **Google**
3. You need to set up Google Cloud OAuth:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret
4. Paste into Supabase Google provider settings
5. Save

✅ **Supabase is now ready!**

---

## Phase 2: Local Development Setup (10 minutes)

### 2.1 Create .env File
1. In your project root, create a file named `.env`
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Supabase.

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Run Locally
```bash
npm run dev
```

Open http://localhost:8080 in your browser.

### 2.4 Test Authentication
1. Wait for splash screen
2. Click "Continue with Google"
3. You should be redirected to Google login
4. Sign in with any Google account
5. You should see the chat interface

✅ **Local development is working!**

---

## Phase 3: GitHub Setup (15 minutes)

### 3.1 Create GitHub Repository
1. If not done already, push your code to GitHub
2. Make sure `main` branch exists
3. Confirm `.github/workflows/build.yml` is in repo

### 3.2 Add Secrets to GitHub
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

**Add First Secret:**
- Name: `VITE_SUPABASE_URL`
- Secret: Paste your Supabase URL (from 1.2)
- Click **Add secret**

**Add Second Secret:**
- Click **New repository secret** again
- Name: `VITE_SUPABASE_ANON_KEY`
- Secret: Paste your Anon key (from 1.2)
- Click **Add secret**

### 3.3 Verify Secrets Added
You should see both listed (showing as dots):
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

### 3.4 Test GitHub Actions Build
1. Make a small commit and push to `main` branch:
```bash
git add .
git commit -m "Setup: Add Supabase secrets"
git push origin main
```

2. Go to **Actions** tab in GitHub
3. Click on **Build Android APK** workflow
4. Watch the build process
5. Should take 5-10 minutes

### 3.5 Monitor Build Steps
Watch for these steps:
```
✅ Checkout code
✅ Setup Node.js
✅ Setup JDK
✅ Setup Android SDK
✅ Install dependencies
✅ Create environment file ← Secrets used here
✅ Build web app
✅ Add Android platform
✅ Sync Capacitor
✅ Build APK
✅ Upload APK
```

### 3.6 Download APK
When build completes:
1. Click on the completed workflow
2. Scroll to **Artifacts** section
3. Click **app-debug** to download APK

✅ **GitHub Actions is building successfully!**

---

## Phase 4: Verify Everything Works (5 minutes)

### 4.1 Test Supabase Connection
1. Go to http://localhost:8080 (local)
2. Sign in with Google
3. Type a message in chat
4. In Supabase dashboard:
   - Go to **Table Editor**
   - Click `messages` table
   - Your message should appear there ✅

### 4.2 Test Admin Panel
1. Sign out from user
2. Sign in with: `anshforgame4@gmail.com` (if you have this email, use any Google account)
3. You should see admin panel ✅

### 4.3 Test File Upload
1. In admin panel, select a conversation
2. Click upload button (📎)
3. Upload a test file
4. Should appear in chat ✅

### 4.4 Test Real-time
1. Open app in two browser windows
2. Window 1: As user
3. Window 2: As admin
4. Send message from admin
5. Should appear instantly in user window ✅

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
npm run dev
```

### "Missing environment variables"
- Create `.env` file with credentials
- Restart dev server
- For GitHub: Add secrets to repository

### "Google OAuth not working"
- Verify redirect URI in Google Console
- Check Client ID/Secret in Supabase
- Ensure provider is enabled

### "Build failed in GitHub Actions"
- Check secrets are correctly added
- Verify secret names are exact:
  - `VITE_SUPABASE_URL` (not URL)
  - `VITE_SUPABASE_ANON_KEY` (not KEY)
- Try running locally first

### "Can't connect to Supabase"
- Check if Supabase project is active
- Verify credentials are correct
- Check network connection
- Try different Google account

### "APK downloads but doesn't work"
- Verify all SQL was run in Supabase
- Check RLS policies exist
- Ensure Google OAuth is configured
- Try signing in with different account

---

## File Reference

| File | Purpose |
|------|---------|
| `.env` | Local Supabase credentials (not committed) |
| `.env.example` | Template for .env |
| `SUPABASE_SQL_SETUP.md` | All SQL commands to run |
| `GITHUB_SECRETS_SETUP.md` | How to add secrets to GitHub |
| `.github/workflows/build.yml` | GitHub Actions workflow |
| `src/lib/supabase.ts` | Supabase client config |

---

## Complete Checklist

- [ ] Supabase project created
- [ ] Credentials copied
- [ ] SQL migrations run (all 9 steps)
- [ ] Replication enabled
- [ ] Google OAuth configured
- [ ] `.env` file created locally
- [ ] `npm install` completed
- [ ] `npm run dev` works locally
- [ ] Google sign-in works
- [ ] Chat interface appears
- [ ] GitHub repository set up
- [ ] GitHub secrets added (2 secrets)
- [ ] GitHub Actions workflow runs
- [ ] APK builds successfully
- [ ] APK downloads
- [ ] APK runs and connects to Supabase

---

## What's Next?

Once everything is working:

### Local Development
```bash
npm run dev
```
- Make changes
- Test locally
- Push to GitHub

### GitHub Actions
- Every push to `main` automatically builds APK
- Download APK from Actions artifacts
- Test on Android device

### Admin Management
- Use admin panel to manage builds
- Send messages and files to users
- Update build progress

---

## Security Notes

⚠️ **Important**:
- Never commit `.env` to GitHub
- Secrets are encrypted on GitHub
- Each team member should have their own `.env` locally
- Rotate keys if compromised
- Keep Supabase project secure

---

## Performance Tips

- Build locally first before pushing to GitHub
- Don't build on every tiny change (costs CI/CD minutes)
- Test APK on real device before releasing
- Monitor Supabase dashboard for errors
- Keep dependencies updated

---

## Support

If you get stuck:

1. Check Supabase dashboard for errors
2. Review browser console (F12)
3. Check GitHub Actions logs
4. Read the troubleshooting section above
5. Verify all setup steps were completed

---

**You're all set! Your Pro Builder app is ready to build!** 🚀
