# Replication Guide

**Last Updated:** 2025-11-24

---

## Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for backend features)
- OpenAI API key (for chatbot)

---

## Step 1: Initialize Project

```bash
npm create vite@latest mindmaker -- --template react-ts
cd mindmaker
npm install
```

---

## Step 2: Install Dependencies

```bash
npm install react-router-dom@6.30.1 \
  @tanstack/react-query@5.83.0 \
  @supabase/supabase-js@2.57.4 \
  tailwindcss@latest \
  tailwindcss-animate@1.0.7 \
  class-variance-authority@0.7.1 \
  clsx@2.1.1 \
  tailwind-merge@2.6.0 \
  lucide-react@0.462.0 \
  next-themes@0.4.6 \
  react-hook-form@7.61.1 \
  @hookform/resolvers@3.10.0 \
  zod@3.25.76
```

Install Shadcn UI components:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea
```

---

## Step 3: Configure Tailwind

Copy `tailwind.config.ts` from project
Copy `src/index.css` from project

---

## Step 4: Setup Supabase

1. Create Supabase project
2. Copy project credentials
3. Create `.env`:
```
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=your_project_url
```

---

## Step 5: Create Edge Function

```bash
supabase init
supabase functions new chat-with-krish
```

Copy `supabase/functions/chat-with-krish/index.ts` from project
Add OpenAI API key to Supabase secrets

---

## Step 6: Build Component Structure

Create folders:
```
src/components/
src/components/ui/
src/components/ChatBot/
src/pages/
src/hooks/
```

Copy all component files from project

---

## Step 7: Configure Routing

Copy `src/App.tsx` from project
Copy `src/main.tsx` from project

---

## Step 8: Add Assets

Create `public/fonts/` folder
Add Gobold_Bold.otf font
Add mindmaker logo and images

---

## Step 9: Deploy

```bash
npm run build
```

Deploy via Lovable Cloud or Vercel/Netlify

---

**Total Time:** 2-3 hours for experienced developer

---

**End of REPLICATION_GUIDE**