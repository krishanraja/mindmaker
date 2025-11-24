# Architecture

**Last Updated:** 2025-11-24

---

## Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript
- Vite (build tool)
- React Router DOM 6.30.1

**Styling:**
- Tailwind CSS
- Custom design system (index.css)
- Shadcn UI components

**Backend:**
- Supabase (Lovable Cloud)
- Edge Functions (Deno runtime)
- OpenAI API integration

**Deployment:**
- Lovable Cloud (auto-deploy)
- Connected to GitHub repository

---

## Frontend Architecture

### Page Structure
```
src/pages/
├── Index.tsx          # Homepage
├── Leaders.tsx        # Individual diagnostic
├── ExecTeams.tsx      # Team diagnostic
├── PartnersInterest.tsx  # Partner intake
├── FAQ.tsx            # Frequently asked questions
├── Privacy.tsx        # Privacy policy
├── Terms.tsx          # Terms of service
└── NotFound.tsx       # 404 page
```

### Component Organization
```
src/components/
├── Navigation.tsx     # Global header
├── Footer.tsx         # Global footer
├── Hero.tsx           # Hero section
├── [Feature]Section.tsx  # Section components
├── ChatBot/           # AI chatbot feature
│   ├── index.tsx
│   ├── ChatButton.tsx
│   ├── ChatPanel.tsx
│   ├── ChatMessage.tsx
│   └── useChatBot.ts
└── ui/                # Shadcn components
```

### State Management
- React hooks (useState, useEffect, useCallback)
- React Query for async state
- localStorage for chat history
- No global state management (intentional simplicity)

---

## Backend Architecture

### Supabase Configuration
- Project ID: ksyuwacuigshvcyptlhe
- Region: Auto-selected by Supabase
- Database: PostgreSQL (not yet utilized)
- Edge Functions: Deno runtime

### Edge Functions

**chat-with-krish:**
- **Purpose:** AI chatbot with Krish persona
- **Runtime:** Deno
- **AI Provider:** OpenAI API
- **Auth:** Public (verify_jwt = false)
- **Input:** Array of chat messages
- **Output:** AI response in Krish's voice
- **File:** `supabase/functions/chat-with-krish/index.ts`

---

## Data Flow

### Diagnostic Submissions (Current State)
1. User fills form on `/leaders`, `/exec-teams`, or `/partners-interest`
2. Frontend validates with Zod schema
3. Data logged to console (no backend persistence yet)
4. Success UI displayed to user

### Diagnostic Submissions (Planned)
1. User fills form
2. Frontend validation
3. POST to Supabase database
4. Trigger email automation
5. Update CRM/tracking system
6. Redirect to thank you page

### AI Chatbot Flow
1. User opens chat panel
2. Types message
3. Frontend invokes `chat-with-krish` edge function
4. Edge function calls OpenAI API with system prompt
5. AI response returned to frontend
6. Message history stored in localStorage

---

## Integration Points

### Current Integrations
- OpenAI API (via Supabase edge function)
- Supabase client SDK
- React Query

### Planned Integrations
- Email service (SendGrid/Resend)
- CRM (HubSpot or custom)
- Payment processor (Stripe)
- Analytics (Posthog/Mixpanel)

---

## Environment Variables

```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
```

Stored in `.env` file (not committed to git)

---

## Build & Deploy

**Development:**
```bash
npm run dev  # Vite dev server
```

**Production:**
```bash
npm run build  # TypeScript + Vite build
```

**Deployment:**
- Automatic via Lovable Cloud
- Triggered on code changes
- Edge functions auto-deploy

---

**End of ARCHITECTURE**