# GitHub Secrets Setup Guide

Follow these steps to add Supabase credentials to GitHub so the CI/CD pipeline works.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard
2. Click **Settings** (bottom left)
3. Click **API** tab
4. Copy these values:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **Anon public key** → This is your `VITE_SUPABASE_ANON_KEY`

Example:
```
VITE_SUPABASE_URL: https://xyzabcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**
5. Click **New repository secret** (green button)

### Add First Secret: VITE_SUPABASE_URL

1. **Name**: `VITE_SUPABASE_URL`
2. **Secret**: Paste your Supabase Project URL
3. Click **Add secret**

### Add Second Secret: VITE_SUPABASE_ANON_KEY

1. Click **New repository secret** again
2. **Name**: `VITE_SUPABASE_ANON_KEY`
3. **Secret**: Paste your Anon public key
4. Click **Add secret**

## Step 3: Verify Secrets Added

You should see both secrets listed:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

They will show as dots (●●●●●) for security.

## Step 4: Test the Workflow

1. Go to **Actions** (top menu)
2. You should see **Build Android APK** workflow
3. Make a commit and push to main branch
4. Workflow should automatically run
5. Watch the build process

### Expected Workflow Steps

```
✅ Checkout code
✅ Setup Node.js
✅ Setup JDK
✅ Setup Android SDK
✅ Install dependencies
✅ Create environment file (uses secrets here)
✅ Build web app
✅ Add Android platform
✅ Sync Capacitor
✅ Build APK
✅ Upload APK
```

## Step 5: Monitor Build

1. Click on the workflow run
2. Watch the progress
3. If "Create environment file" step succeeds = secrets are working
4. When done, click **app-debug** to download APK

## Troubleshooting

### "Build failed - Missing environment variables"
- Check that both secrets are added
- Verify secret names are **exactly**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Secrets are case-sensitive!

### "Connection refused" during build
- Verify Supabase URL is correct
- Check that your Supabase project is active
- Make sure project hasn't been paused

### Workflow doesn't run
- Make sure you pushed to `main` branch
- Check that `.github/workflows/build.yml` exists
- Go to Actions tab to see if it appears

### APK uploaded but app doesn't connect
- Double-check the Supabase credentials are correct
- Verify Google OAuth is configured
- Check RLS policies aren't too restrictive

## How to Update Secrets

If you need to update a secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Find the secret and click **Update**
3. Paste new value
4. Click **Update secret**
5. Next workflow run will use new secret

## Security Best Practices

⚠️ **IMPORTANT**:
- Never commit `.env` file to GitHub
- Never paste secrets in code or comments
- Keep secrets confidential
- Rotate keys periodically
- Use different secrets for dev/prod

## What Secrets Do

When you add secrets to GitHub:

1. GitHub encrypts them securely
2. Only visible to workflow runs
3. Masked in logs (shown as `***`)
4. Used in `build.yml` workflow:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

5. Workflow creates `.env` file with these values
6. App builds with Supabase connected

## Environment Variables in .env

The workflow creates `.env` file like:

```
VITE_SUPABASE_URL=https://xyzabcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This file is only created during GitHub Actions build, **not committed** to repo.

## Local Development

For local development, you still need `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Never commit this file!** It's in `.gitignore` automatically.

## Verify Everything Works

After setup, run workflow to verify:

1. **Settings** → **Secrets and variables** → **Actions**
   - Should see 2 secrets ✅

2. **Actions** → Latest run
   - "Create environment file" step should pass ✅
   - Build should complete without env errors ✅

3. **Download APK**
   - Should work without errors ✅

4. **Run APK**
   - Should connect to your Supabase ✅

## Summary

- ✅ Supabase URL added to GitHub Secrets
- ✅ Supabase Anon Key added to GitHub Secrets
- ✅ Workflow uses secrets to build with Supabase
- ✅ `.env` created automatically during build
- ✅ APK downloads with working Supabase connection
- ✅ Local development still uses local `.env`

**Ready to deploy!** Push to main and watch GitHub Actions build your APK!
