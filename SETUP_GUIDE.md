# Pro Builder - Setup Guide

A complete AI-powered app building platform with real-time chat, Google authentication, and admin panel.

## Features

- **Splash Screen**: Beautiful neon holographic animated splash screen
- **Google Authentication**: Simple one-click sign-in with Google
- **Unique User IDs**: Each user gets a unique 4-digit ID (e.g., 8383, 5938)
- **AI Chat Interface**: Interactive bot that guides users through app description
- **Smart Progress Tracking**: AI analyzes user input and tracks completion percentage
- **Build Management**: Users can start builds when description is complete
- **Admin Panel**: Full admin interface for managing all conversations
- **Real-time Updates**: Live updates using Supabase real-time subscriptions
- **File Upload**: Admins can upload APK files to users
- **Build Progress**: Admins can update build percentage in real-time

## Prerequisites

1. Node.js 18+ installed
2. A Supabase account
3. Google Cloud Console project for OAuth

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Configure Google OAuth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Go to [Google Cloud Console](https://console.cloud.google.com/)
5. Create a new project or select an existing one
6. Enable Google+ API
7. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
8. Set application type to **Web application**
9. Add authorized redirect URIs:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`
   - `http://localhost:8080` (for development)
10. Copy the Client ID and Client Secret
11. Paste them into Supabase Google provider settings
12. Save the configuration

### 3. Enable Storage

1. In Supabase dashboard, go to **Storage**
2. The `app-files` bucket will be created automatically by the migration
3. Ensure it's set to public

### 4. Run Migrations

The migrations have already been applied through the MCP tool. You can verify by checking:
- Supabase dashboard > **Database** > **Tables**
- You should see: `users`, `conversations`, `messages`

## Environment Setup

1. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your Supabase project credentials

## Installation

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Application Flow

### For Regular Users

1. **Splash Screen** (3 seconds)
   - Beautiful animated neon holographic design
   - Auto-redirects to auth page

2. **Authentication**
   - Click "Continue with Google"
   - Sign in with your Google account
   - Automatically assigned a unique 4-digit ID

3. **Chat Interface**
   - Bot greets you after 3 seconds: "Hey! I'm your app builder"
   - After 5 seconds: "Please start describing your app"
   - Start describing your app idea

4. **Description Phase**
   - Progress bar shows completion percentage
   - Bot analyzes your messages and updates progress
   - Bot asks follow-up questions to gather more details
   - When you provide insufficient details, bot asks for more
   - Progress increases based on detail level and relevance

5. **Build Phase**
   - Once description reaches 100%, "Build Now" button appears
   - Click to start building
   - Conversation is pinned (red dot) in admin panel
   - Build progress bar shows 1%
   - Wait for admin to build your app

6. **Receive App**
   - Admin updates build progress
   - Admin can send messages and upload APK file
   - Download your app when ready

### For Admin (anshforgame4@gmail.com)

1. **Sign in** with the admin Google account

2. **Admin Panel**
   - Left sidebar shows all user conversations
   - Pinned conversations (red dot) appear at top
   - Each conversation shows:
     - User's unique ID
     - Email address
     - Current status (Describing/Building/Completed)
     - Progress percentage

3. **Managing Conversations**
   - Click any conversation to open chat
   - View full message history
   - Update build percentage using the input field
   - Click "Update %" to save changes

4. **Sending Messages**
   - Type message in textarea
   - Press Enter or click Send button
   - Messages appear in purple for admin

5. **Upload Files**
   - Click upload button (📎 icon)
   - Select APK or other files
   - File automatically uploads and sends to user
   - User can download from their chat

6. **Pin/Unpin Conversations**
   - Click the message icon on conversation card
   - Pinned conversations show red dot
   - Stay at top of list

## User Flow Chart

```
Splash (3s) → Auth → Google OAuth → Assign Unique ID
                                    ↓
Regular User Path:                 Admin Path:
Chat Interface                     Admin Panel
  ↓                                  ↓
Describe App                       View All Users
  ↓                                  ↓
Bot Analyzes                       Select User
  ↓                                  ↓
Progress Updates                   Update Build %
  ↓                                  ↓
100% Complete                      Send Messages
  ↓                                  ↓
Click "Build Now"                  Upload APK
  ↓                                  ↓
Building Phase                     Mark Complete
  ↓
Receive APK
```

## Database Schema

### users
- `id`: UUID (primary key)
- `email`: Text (unique)
- `google_id`: Text (unique)
- `unique_user_id`: Integer (unique, 4-digit display ID)
- `is_admin`: Boolean (true for anshforgame4@gmail.com)
- `created_at`: Timestamp

### conversations
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key)
- `app_description`: Text (accumulated description)
- `completion_percentage`: Integer (0-100)
- `build_percentage`: Integer (0-100)
- `status`: Text (describing/building/completed)
- `is_pinned`: Boolean (for admin view)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### messages
- `id`: UUID (primary key)
- `conversation_id`: UUID (foreign key)
- `sender_type`: Text (user/bot/admin)
- `content`: Text
- `file_url`: Text (optional)
- `file_name`: Text (optional)
- `is_read`: Boolean
- `created_at`: Timestamp

## Features in Detail

### Smart AI Bot

The bot analyzes messages based on:
- Word count (more words = higher score)
- Relevant keywords (app, feature, user, button, screen, etc.)
- Numbers and specifics
- Proper punctuation

Each message can increase progress by 1-15% based on detail level.

### Real-time Updates

- All changes sync instantly across devices
- New messages appear without refresh
- Build progress updates live
- Pinned status updates immediately

### File Upload

- Supports APK, ZIP, and PDF files
- Stored in Supabase Storage
- Unique URLs generated automatically
- Users can download directly from chat

### Security

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Admin can access all data
- Google OAuth for authentication
- Secure file storage with user-specific folders

## Troubleshooting

### Google OAuth not working
- Check redirect URIs in Google Console
- Verify Client ID and Secret in Supabase
- Ensure Google provider is enabled

### Messages not updating
- Check Supabase real-time is enabled
- Verify RLS policies are correct
- Check browser console for errors

### File upload failing
- Verify storage bucket exists
- Check storage policies
- Ensure admin is logged in

### Build errors
- Run `npm install` again
- Clear node_modules and reinstall
- Check environment variables

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Storage + Real-time)
- **Authentication**: Google OAuth via Supabase Auth
- **Animations**: Custom CSS animations + Framer Motion principles

## Design Philosophy

The app uses a consistent neon holographic theme with:
- Deep space gradient backgrounds
- Neon cyan, blue, purple accent colors
- Smooth animations and transitions
- Glassmorphism effects
- Matrix rain and particle effects
- Professional, futuristic aesthetic

## Support

For issues or questions:
1. Check this guide
2. Review Supabase dashboard for errors
3. Check browser console
4. Verify environment variables
