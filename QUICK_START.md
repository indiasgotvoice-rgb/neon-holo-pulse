# Quick Start Checklist

Follow these steps to get Pro Builder running:

## ☐ 1. Supabase Setup (10 minutes)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project (wait for initialization)
3. Copy your project URL and anon key
4. Database migrations are already applied ✅

## ☐ 2. Google OAuth (15 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase Dashboard → Authentication → Providers → Enable Google
8. Paste Client ID and Secret
9. Save

## ☐ 3. Environment Variables (2 minutes)

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Supabase dashboard.

## ☐ 4. Install & Run (3 minutes)

```bash
npm install
npm run dev
```

Open http://localhost:8080

## ☐ 5. Test User Flow (5 minutes)

1. Wait for splash screen
2. Click "Continue with Google"
3. Sign in with any Google account
4. See chat interface with bot greeting
5. Type a message about an app idea
6. Watch progress bar increase
7. Continue until 100%
8. Click "Build Now"

## ☐ 6. Test Admin Flow (5 minutes)

1. Sign out from user account
2. Sign in with: `anshforgame4@gmail.com`
3. See admin panel with conversation list
4. Click on user conversation (with red dot)
5. View messages
6. Send a test message
7. Update build percentage
8. Try uploading a file

## ☐ 7. Verify Real-time (2 minutes)

1. Open app in two browser windows
2. Sign in as user in window 1
3. Sign in as admin in window 2
4. Send message from admin
5. See it appear instantly in user window
6. Update build percentage
7. See it update in user window

## ✅ Complete!

Your Pro Builder app is now running!

## Common Issues

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify values are correct
- Restart dev server after adding `.env`

### Google OAuth not working
- Verify redirect URI in Google Console
- Check Client ID/Secret in Supabase
- Ensure Google provider is enabled

### Build fails
```bash
rm -rf node_modules
npm install
npm run build
```

### Messages not updating
- Check browser console for errors
- Verify Supabase real-time is enabled
- Check RLS policies in Supabase dashboard

## Next Steps

- Read `SETUP_GUIDE.md` for detailed documentation
- Read `ADMIN_GUIDE.md` for admin panel usage
- Deploy to production (see deployment section below)

## Deployment (Optional)

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel settings
4. Update Google OAuth redirect URI with production URL
5. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Update Google OAuth redirect URI
7. Deploy

---

**Need Help?** Check the troubleshooting sections in SETUP_GUIDE.md
