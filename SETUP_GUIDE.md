# Creator OS - Setup & Feature Guide

## ✅ Demo Account Setup

A demo account has been created for you to test all features immediately:

**Email:** `demo@creatorstudio.com`  
**Password:** `DemoCreator@2026`

### Getting Started

1. Go to http://localhost:8080/signup
2. Click **"Try Demo Account"** button
3. You'll be automatically logged in and redirected to the dashboard
4. If you have no videos, click **"Load Demo Data"** to populate the dashboard

---

## 🎯 Core Features

### 1. **Authentication** ✅
- Email signup/login
- Demo account for testing
- Session persistence with Supabase Auth
- Protected routes for authenticated users

### 2. **Video Management**
- **Upload Videos:** Upload MP4, MOV, WebM files to Supabase Storage
- **Link External Videos:** Add videos from:
  - YouTube
  - TikTok
  - Instagram
  - Direct video URLs
- **Auto-Metadata:** YouTube/social media titles and thumbnails are extracted automatically
- **Video Status:** Draft, Processing, Analyzing, Scheduled, Live

### 3. **AI Video Analysis**
- Automatic viral potential scoring (0-100)
- Identifies viral triggers (hooks, trends, patterns)
- Provides actionable improvement suggestions
- Analyzes for pacing, hook strength, trend alignment
- Uses Lovable AI with fallback analysis if key is unavailable

### 4. **Analytics Dashboard**
- Real-time view counts
- Engagement metrics
- Revenue tracking
- Subscriber growth
- Growth charts and trends
- 30-day historical data

### 5. **Director AI**
- AI assistant for content creators
- Contextual recommendations based on your videos
- Performance insights
- Command palette integration (Cmd+K / Ctrl+K)

### 6. **Content Management**
- **Content Feed:** Recent uploads with thumbnails and status
- **Content Page:** Full gallery of all your videos
- **Video Details:** Individual video stats and analysis results
- Real-time status updates

---

## 🚀 Feature Walkthrough

### `Dashboard` (`/dashboard`)
- KPI cards (Views, Engagement, Revenue, Subscribers)
- Growth chart with 30-day trends
- Recent content feed preview
- AI ideas card for content inspiration
- Audience insights

### `Upload` (`/dashboard/upload`)
**Two ways to add videos:**

1. **File Upload Tab**
   - Drag & drop or click to upload
   - Supported formats: MP4, MOV, WebM, M4V
   - Files stored in Supabase Storage
   - Auto-triggers AI analysis

2. **Link External Video Tab**
   - Paste YouTube, TikTok, Instagram links
   - Auto-detects platform
   - Extracts metadata (title, thumbnail, duration)
   - Creates linked video entry
   - Triggers analysis

### `Content` (`/dashboard/content`)
- Grid view of all uploaded videos
- Filter by status (Live, Draft, Scheduled, etc.)
- View video metrics at a glance
- Click any video to see details and analysis

### `Video Detail` (`/dashboard/video/:id`)
- Full video metadata
- AI analysis results:
  - Viral score
  - Predicted triggers
  - Specific suggestions
  - Quality ratings (hook, pacing, trend alignment)
- One-click analysis re-run
- View analytics for the video

---

## 📊 Database Schema

### `profiles`
```
- id (UUID, from auth.users)
- username (text, unique)
- avatar_url (text)
- timestamps (created_at, updated_at)
```

### `videos`
```
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (text)
- video_url (text) - for uploaded files
- external_url (text) - for linked videos
- thumbnail_url (text)
- source_type ('upload' | 'link')
- source_platform (youtube | tiktok | instagram | direct | null)
- status (draft | processing | analyzing | scheduled | live)
- viral_status (pending | analyzing | done)
- ai_score (0-100)
- ai_feedback (JSON with triggers, suggestions, ratings)
- views_count (integer)
- timestamps
```

### `analytics`
```
- id (UUID)
- video_id (UUID, foreign key)
- user_id (UUID, foreign key)
- date (date)
- views (integer)
- watch_time (integer)
- engagement (integer)
- revenue (numeric)
- timestamps
```

### `storage.videos` bucket
- Public bucket for video files
- Organized by user ID folders: `{user_id}/{filename}`
- RLS policies ensure users can only access their own files

---

## 🔧 Supabase Functions

### `analyze-video`
Analyzes a video for viral potential:
- Extracts title and metadata
- Calls Lovable AI (if available) or uses fallback analysis
- Returns: score, triggers, suggestions, ratings
- Updates video's `ai_feedback` and `ai_score`

### `process-external-video`
Handles pasted video URLs:
- Validates URL format
- Detects platform (YouTube, TikTok, Instagram, etc.)
- Fetches metadata via oEmbed
- Extracts video ID if applicable
- Creates video entry with status 'fetching'
- Triggers analysis

### `seed-demo-data`
Populates demo account with sample data:
- 6 sample videos with realistic metadata
- 30 days of analytics data
- Views, engagement, revenue metrics
- Growth data for charting

### `director-ai`
AI assistant for creators:
- Chat-based recommendations
- Analyzes your recent videos
- Contextual growth suggestions
- Uses Lovable AI (with graceful fallback)

---

## 🔑 Environment Variables

```env
# Required: Supabase Configuration
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=https://your-project.supabase.co

# Optional: AI Enhancement
LOVABLE_API_KEY=your_api_key_here
```

### Setting Lovable API Key (Optional)

1. Get API key from https://lovable.dev/
2. Add to `.env` or Supabase project settings
3. Supabase functions will automatically use it for enhanced analysis
4. Without it, fallback analysis is still provided

---

## 📝 Running Commands

### Development Server
```bash
npm run dev
# Navigate to http://localhost:8080
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
npm run test:watch
```

### Lint Code
```bash
npm lint
```

---

## 🛠️ Troubleshooting

### Demo Button Not Working?
- Ensure you're on the signup page
- Click "Try Demo Account"
- If it fails, allow public signups in Supabase Auth settings

### No Videos Showing?
- Click "Load Demo Data" button on dashboard
- Or manually upload a video to trigger demo data

### AI Analysis Not Running?
- Check that video has been successfully uploaded
- Wait 2-3 seconds for automatic analysis trigger
- Click "Re-analyze" button on video detail page
- Check browser console for errors

### Can't Upload Files?
- Check file size (Supabase default limit ~100MB)
- Verify file format (MP4, MOV, WebM, M4V)
- Check storage bucket permissions in Supabase Dashboard

### External Video Link Not Working?
- Verify URL is valid and publicly accessible
- YouTube must not be set to private
- Instagram/TikTok videos must have public metadata available

---

## 📱 Keyboard Shortcuts

- **Cmd+K** / **Ctrl+K:** Open command palette
  - Quick navigation to pages
  - Jump to videos
  - Settings access

---

## 🎨 UI Components

The app uses Shadcn/UI with custom theme:
- Glass morphism cards
- Gradient accents (primary, warning, success, accent)
- Responsive layout (mobile-first)
- Smooth animations with Framer Motion
- Toast notifications with Sonner

---

## 📞 Support Notes

- **Supabase Dashboard:** https://app.supabase.com/
- **Project ID:** `jtsfcywfubaagaqzzfsj`
- **Documentation:** Check individual feature pages

---

### Quick Start Checklist

- [x] Authentication set up (demo account ready)
- [x] Database schema created (migrations applied)
- [x] Storage configured (videos bucket ready)
- [x] Demo data seeding available
- [x] AI analysis configured (with fallback)
- [x] Analytics tracking ready
- [x] UI theme applied
- [x] All routes protected

**You're ready to go! Click "Try Demo Account" to get started.**
