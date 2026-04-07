# 🇧🇪 Belgium Events

A modern event listing website for Belgium. Only you (the admin) can create events — everyone else can browse them.

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — dark editorial design with gold accents
- **Supabase** — PostgreSQL database + authentication
- **Mapbox GL** — optional interactive event maps
- **TypeScript** throughout

---

## Features

- 🏠 Homepage with all events, category + date filters
- 📋 Event detail page with full info and map
- 🔐 Admin login (Supabase email/password auth)
- ✏️ Admin event creation form
- 🗺️ Mapbox map on event detail pages (optional)
- 🔒 Row Level Security — only your email can insert events

---

## Setup Guide

### 1. Clone & install dependencies

```bash
cd belgium-events
npm install
```

---

### 2. Create a Supabase project

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project
2. Wait for it to provision (~1 min)
3. Go to **Project Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 3. Run the database setup

1. In Supabase, go to **SQL Editor → New Query**
2. Paste the contents of `supabase-setup.sql`
3. Click **Run**

This creates:
- The `events` table with all required columns
- Row Level Security policies (public can read, only you can write)

---

### 4. Create your admin user in Supabase

1. Go to **Authentication → Users → Add user**
2. Enter your email: `bongartzmaurice24@gmail.com`
3. Set a strong password
4. Click **Create user**

---

### 5. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=bongartzmaurice24@gmail.com
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token   # optional
```

---

### 6. (Optional) Set up Mapbox

1. Create a free account at [account.mapbox.com](https://account.mapbox.com)
2. Go to **Tokens** and copy your **Default public token**
3. Add it as `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`

Maps will show on event detail pages when latitude/longitude are provided.

---

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage — all events with filters |
| `/event/[id]` | Event detail page |
| `/admin` | Admin login + event creation |

---

## How to create an event

1. Go to `/admin`
2. Sign in with your email and password
3. Fill in the event form
4. Hit **Publish Event**

For latitude/longitude: right-click any location on [Google Maps](https://maps.google.com) → "What's here?" to get exact coordinates.

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── not-found.tsx         # 404 page
│   ├── event/[id]/
│   │   └── page.tsx          # Event detail
│   └── admin/
│       └── page.tsx          # Admin panel
├── components/
│   ├── Navbar.tsx
│   ├── EventCard.tsx
│   ├── FilterBar.tsx
│   └── EventMap.tsx
├── lib/
│   ├── types.ts
│   └── supabase/
│       ├── client.ts         # Browser client
│       └── server.ts         # Server client
└── middleware.ts             # Session refresh
```
