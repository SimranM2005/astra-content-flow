
**Creator OS** is a high-performance, cinematic dashboard designed for modern content creators. It doesn't just track your views; it uses AI to "watch" your Reels, predict their reach, and act as a virtual Creative Director.



## ✨ Core Features

* **🎬 Hybrid Content Input:** Upload local `.mp4` files or paste social media URLs (YouTube/Reels) for instant auditing.
* **🧠 AI Reach Predictor:** Automated analysis of pacing, hooks, and trend alignment with a 0-100 probability score.
* **📊 Cinematic Analytics:** Real-time growth tracking using dual-axis charts and bento-grid KPI cards.
* **🤖 Director AI Assistant:** A persistent AI companion that analyzes your content theme and suggests personalized strategies.
* **🌓 Dual-Mode Aesthetics:** Switch between "Midnight Obsidian" (Dark) and "Studio White" (Light) themes with 60fps transitions.
* **🔒 Secure Multi-Tenancy:** Full authentication and Row Level Security (RLS) so your data stays yours.

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), TypeScript |
| **Styling** | Tailwind CSS, Framer Motion, Shadcn/UI |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **AI Engine** | Gemini 1.5 Flash via Supabase Edge Functions |
| **Charts** | Recharts |

## 📁 Project Structure

```text
creator-os/
├── app/                    # Next.js App Router & Server Actions
│   ├── (auth)/             # Login & Signup flows
│   ├── (dashboard)/        # Main App, Analytics, & AI Reviewer
│   └── api/                # Backend API routes
├── components/             # UI Components (Dashboard, Upload, AI)
├── hooks/                  # Custom hooks (useAuth, useVideos)
├── lib/                    # Supabase Client & Utils
└── supabase/               # SQL Migrations & Edge Functions
```

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 20+ 
* A [Supabase](https://supabase.com) account

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Migration
Run the following SQL in your Supabase SQL Editor:
```sql
-- Profiles, Videos, and Analytics tables
-- (Refer to /supabase/migrations for the full schema)
```

### 4. Installation
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to see your dashboard live.

## 🎨 Design Philosophy
Creator OS uses **Glassmorphism** and **Bento-box** layouts to reduce cognitive load. The UI prioritizes high data density without feeling cluttered, using subtle indigo glows and frosted glass surfaces to maintain a premium "SaaS" feel.

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Developed with ❤️ for the Creator Economy.**
*Build, Analyze, and Scale.*
