# GitHub Setup - Final Steps

Quick reference for adding secrets to GitHub and testing your build.

## What We Changed

✅ **GitHub Workflow Updated** (`.github/workflows/build.yml`)
- Now reads Supabase credentials from GitHub Secrets
- Creates `.env` file automatically during build
- No credentials hardcoded anywhere

✅ **Environment Files**
- `.env` - Empty (for local development, you fill it in)
- `.env.example` - Template with instructions
- `SQL_COMMANDS.txt` - All SQL to run in Supabase
- `COMPLETE_SETUP.md` - Full step-by-step guide

## Step-by-Step Setup

### 1️⃣ Get Your Supabase Credentials

From your Supabase Dashboard:
1. Click **Settings** (bottom left)
2. Click **API** tab
3. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public key** → `VITE_SUPABASE_ANON_KEY`

Example format:
```
URL: https://abc123defgh.supabase.co
KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### 2️⃣ Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **New repository secret** (green button)

**Create First Secret:**
```
Name:   VITE_SUPABASE_URL
Value:  https://abc123defgh.supabase.co
```
Click **Add secret**

**Create Second Secret:**
```
Name:   VITE_SUPABASE_ANON_KEY
Value:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```
Click **Add secret**

### 3️⃣ Verify Secrets

You should now see:
```
✓ VITE_SUPABASE_URL
✓ VITE_SUPABASE_ANON_KEY
```
(They show as dots ●●●●● for security)

### 4️⃣ Test the Build

Make a commit and push:
```bash
git add .
git commit -m "Add Supabase credentials to GitHub"
git push origin main
```

Go to **Actions** tab and watch the build:
1. **Checkout code** ✓
2. **Setup Node.js** ✓
3. **Setup JDK** ✓
4. **Setup Android SDK** ✓
5. **Install dependencies** ✓
6. **Create environment file** ← Secrets used here
7. **Build web app** ✓
8. **Add Android platform** ✓
9. **Sync Capacitor** ✓
10. **Build APK** ✓
11. **Upload APK** ✓

### 5️⃣ Download APK

When build completes:
1. Go to **Actions** → Latest run
2. Scroll down to **Artifacts** section
3. Click **app-debug** to download

## How It Works

```
Your Code (main branch)
    ↓
Push to GitHub
    ↓
GitHub Actions Triggered
    ↓
Read Secrets from GitHub
    ↓
Create .env file with secrets
    ↓
Run: npm install
Run: npm run build
    ↓
Build APK with Capacitor
    ↓
Upload APK to Artifacts
    ↓
You download APK
```

## What the Workflow Does

In `.github/workflows/build.yml`:

```yaml
- name: Create environment file
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  run: |
    echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" >> .env
    echo "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" >> .env
```

This creates `.env` with your secrets for the build.

## Local Development

For local development, you still need `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Run:
```bash
npm run dev
```

**Do NOT commit `.env`** (it's in `.gitignore`)

## Database Setup

Before testing the build, you need to:

1. Run all SQL commands from `SQL_COMMANDS.txt`
2. Enable Replication for tables
3. Configure Google OAuth
4. Enable storage bucket

See `COMPLETE_SETUP.md` for detailed steps.

## Troubleshooting

### Build fails with "Missing environment variables"

**Check:**
1. Are secrets added to GitHub? → Go to Settings → Secrets
2. Secret names exact? → `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Secret values correct? → Copy from Supabase API settings

**Fix:**
- Add secrets again with correct names
- Push new commit to trigger build

### "Connection refused" during build

**Check:**
1. Supabase project is running
2. URL is correct (no typos)
3. Anon key is correct (full value, not truncated)

### Build passes but APK doesn't connect

**Check:**
1. All SQL commands were run
2. Replication is enabled
3. Google OAuth is configured
4. RLS policies are in place

### Can't find APK artifact

**Check:**
1. Workflow completed successfully ✓
2. Scroll down in workflow view to find Artifacts
3. Artifact named "app-debug"

## Security Note

⚠️ **Your secrets are now safe:**
- Encrypted on GitHub servers
- Not visible in logs (shown as ***)
- Only used during Actions workflow
- Never committed to code

## Next Steps

1. ✅ Add secrets to GitHub
2. ✅ Run SQL in Supabase
3. ✅ Enable replication
4. ✅ Configure Google OAuth
5. ✅ Push code to main branch
6. ✅ Download APK from Actions
7. ✅ Test APK on device

## Quick Reference

| Need | Location |
|------|----------|
| SQL Commands | `SQL_COMMANDS.txt` |
| Complete Setup | `COMPLETE_SETUP.md` |
| GitHub Secrets | GitHub → Settings → Secrets |
| Supabase Credentials | Supabase → Settings → API |
| Workflow File | `.github/workflows/build.yml` |
| Local .env | `.env` (not in repo) |

---

**You're all set!** Your GitHub Actions will now automatically build APKs with your Supabase connection! 🚀
