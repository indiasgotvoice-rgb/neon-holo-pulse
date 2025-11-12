# Pro Builder - Quick Reference Card

## What to Do Now

### 1. Supabase Setup (20 min)
```
1. supabase.com → Create Project
2. Settings → API → Copy URL and Anon Key
3. SQL Editor → Paste commands from SQL_COMMANDS.txt → Run
4. Replication → Enable users, conversations, messages
5. Auth → Google OAuth setup
```

### 2. GitHub Secrets (5 min)
```
1. GitHub → Settings → Secrets and variables → Actions
2. Add: VITE_SUPABASE_URL = https://your-project.supabase.co
3. Add: VITE_SUPABASE_ANON_KEY = your-anon-key
```

### 3. Local Development (5 min)
```
1. Create .env file with your Supabase credentials
2. npm install
3. npm run dev
4. http://localhost:8080
```

### 4. Build APK (5-10 min)
```
1. git add . && git commit -m "Setup" && git push origin main
2. GitHub → Actions → Watch build
3. Download "app-debug" artifact
```

---

## SQL Commands Order

Copy and paste from `SQL_COMMANDS.txt` to Supabase SQL Editor:

1. CREATE TABLES
2. CREATE FUNCTION
3. ENABLE RLS
4. USERS POLICIES
5. CONVERSATIONS POLICIES
6. MESSAGES POLICIES
7. CREATE STORAGE BUCKET
8. STORAGE POLICIES (4 commands)

---

## GitHub Secrets Names

⚠️ **Exact names required:**

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Not `URL` or `KEY`, but full names above!

---

## Local .env Format

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Do NOT commit to GitHub** (it's in .gitignore)

---

## File Locations

| File | Purpose |
|------|---------|
| `SQL_COMMANDS.txt` | Copy-paste SQL |
| `COMPLETE_SETUP.md` | Full detailed guide |
| `GITHUB_SETUP_FINAL.md` | GitHub secrets |
| `SETUP_SUMMARY.txt` | Quick summary |
| `.github/workflows/build.yml` | GitHub Actions |
| `src/pages/Auth.tsx` | Login page |
| `src/pages/Chat.tsx` | User chat |
| `src/pages/Admin.tsx` | Admin panel |

---

## Key Features

✅ Google OAuth authentication
✅ Unique 4-digit user IDs
✅ AI chat bot interface
✅ Smart progress tracking
✅ Admin panel for builds
✅ Real-time message sync
✅ File upload (APK)
✅ GitHub Actions APK build

---

## Admin Email

```
anshforgame4@gmail.com
```

Sign in with this to access admin panel.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Missing vars | Create .env with credentials |
| Build fails | Check GitHub secrets exact names |
| No messages | Run all SQL, enable replication |
| OAuth fails | Check Google OAuth config |
| Can't connect | Verify Supabase URL correct |

---

## Test Checklist

- [ ] Splash screen appears
- [ ] Google sign-in works
- [ ] Chat interface loads
- [ ] Bot messages appear
- [ ] Can type messages
- [ ] Messages appear in Supabase
- [ ] Admin sees conversations
- [ ] Admin can send messages
- [ ] File upload works
- [ ] APK builds in GitHub Actions

---

**Start with:** Open `SQL_COMMANDS.txt` and follow Phase 1 in `SETUP_SUMMARY.txt`
