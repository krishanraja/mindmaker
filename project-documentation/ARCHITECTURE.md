# Architecture

**Last Updated:** 2025-12-01

---

## Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript (strict mode)
- Vite 5.x (build tool)
- TailwindCSS 3.x + tailwindcss-animate
- Radix UI (headless components)
- Framer Motion (animations)
- React Router DOM 6.x
- TanStack Query (data fetching)

**Backend:**
- Supabase Edge Functions (Deno runtime)
- Deno std@0.190.0

**Third-Party Services:**
- Stripe (payments) - **Paused: $50 hold bypassed, direct Calendly booking**
- Calendly (scheduling)
- Vertex AI RAG (chatbot with custom business knowledge)
- Lovable AI Gateway (news ticker via Gemini 2.5 Flash)
- OpenAI API (market sentiment, company research in lead emails)
- Resend (email delivery)

**Hosting & Deployment:**
- Lovable Cloud (auto-deploy)
- GitHub integration (bidirectional sync)

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn base components
│   │   ├── ChatBot/         # AI chatbot system
│   │   ├── Animations/      # Visual effects
│   │   ├── Interactive/     # Interactive demos
│   │   ├── ShowDontTell/    # Content sections
│   │   ├── InitialConsultModal.tsx
│   │   ├── ConsultationBooking.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── BuilderSession.tsx
│   │   ├── BuilderSprint.tsx
│   │   ├── LeadershipLab.tsx
│   │   ├── PartnerProgram.tsx
│   │   ├── BuilderEconomy.tsx
│   │   ├── FAQ.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   ├── integrations/supabase/ # Supabase client
│   ├── index.css            # Design system tokens
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── create-consultation-hold/ (paused)
│   │   ├── chat-with-krish/
│   │   ├── get-ai-news/
│   │   ├── get-market-sentiment/
│   │   └── send-lead-email/
│   └── config.toml          # Supabase config
├── public/                  # Static assets
├── project-documentation/   # This documentation
├── tailwind.config.ts       # Tailwind config
├── vite.config.ts           # Vite config
└── package.json             # Dependencies
```

---

## Data Flow

### Booking Flow (Critical Path)
**Status:** Stripe hold paused as of 2025-12-01 - Direct Calendly booking

```
1. User clicks CTA
   └─> InitialConsultModal opens (React state)

2. User fills form + selects program
   └─> Form submission (React event)
   └─> Session data captured via SessionDataContext

3. Frontend calls edge function
   └─> supabase.functions.invoke('send-lead-email', {
         body: { name, email, jobTitle, selectedProgram, sessionData }
       })

4. Edge function enriches lead data
   └─> OpenAI research: domain → company info + latest news
   └─> Compiles engagement data (friction map, portfolio, assessment)

5. Edge function sends email (with retry)
   └─> Resend API with exponential backoff (3 attempts)
   └─> Email to krish@themindmaker.ai with full lead intelligence

6. User redirected to Calendly
   └─> URL pre-filled with: name, email, program
   └─> Direct booking, no payment hold

7. User books time on Calendly
   └─> Calendly sends confirmation email

**Previously (Stripe hold flow, paused):**
- Step 3 called create-consultation-hold
- Created $50 authorization hold via Stripe
- Redirected to Calendly after payment
- Manual capture when user proceeded
```

### Chatbot Flow
```
1. User clicks chat button
   └─> ChatPanel opens (slide-in animation)

2. User types message
   └─> Message added to conversation state

3. Frontend calls edge function
   └─> supabase.functions.invoke('chat-with-krish', {
         body: { messages: conversationHistory }
       })

4. Edge function authenticates with Google
   └─> JWT signed with service account → Access token

5. Edge function calls Vertex AI RAG
   └─> Gemini 2.5 Flash + custom RAG corpus

6. Response returned to frontend
   └─> Displayed in ChatPanel

7. Conversation persists in session
   └─> localStorage (client-side only)
```

---

## Edge Functions

### Location
`supabase/functions/[function-name]/index.ts`

### Configuration
`supabase/config.toml`:
```toml
project_id = "smvwbbilnsprexeuplex"

[functions.create-consultation-hold]
verify_jwt = false

[functions.chat-with-krish]
verify_jwt = false

[functions.get-ai-news]
verify_jwt = false

[functions.get-market-sentiment]
verify_jwt = false

[functions.send-lead-email]
verify_jwt = false
```

### Function Template
```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Function logic here
    
    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
```

### Deployment
- Auto-deploy on code push to GitHub
- Deploy time: 30-60 seconds
- Logs available in Lovable Cloud console

### Current Functions

#### `chat-with-krish`
**Purpose:** AI chatbot powered by Google Vertex AI RAG with Gemini 2.5 Flash

**Secrets Required:** `GOOGLE_SERVICE_ACCOUNT_KEY`

**Architecture:**
- Service account authentication (RS256 JWT signing)
- Token caching (50-minute lifetime)
- RAG corpus integration for business-specific knowledge
- Comprehensive error handling with graceful fallbacks
- Anti-fragile design: always returns usable content

**Request Format:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
```

**Response Format:**
```typescript
{
  message: string;
  metadata?: {
    model: string;
    cached: boolean;
    fallback: boolean;
  };
}
```

**Vertex AI Configuration:**
- Project: `gen-lang-client-0174430158`
- Region: `us-east1`
- Model: `gemini-2.5-flash`
- RAG Corpus: `6917529027641081856`

**Error Handling:**
- 429 Rate Limit → User-friendly message
- 402 Payment Required → Quota message
- 401 Unauthorized → Token refresh
- All other errors → Fallback message with CTAs

#### `get-ai-news`
**Purpose:** Fetches AI-related news for ticker using Lovable AI Gateway

**Secrets Required:** `LOVABLE_API_KEY` (auto-provisioned with Lovable Cloud)

**Request Format:** None (GET request)

**Response Format:**
```typescript
{
  headlines: Array<{ title: string; source: string; }>;
  timestamp: string;
  fallback?: boolean;
}
```

**AI Configuration:**
- Model: `google/gemini-2.5-flash` via Lovable AI Gateway
- Generates 20 AI intelligence briefings with operator perspective
- Categories: SIGNAL, HOT TAKE, OPERATOR INTEL, WATCH LIST
- Falls back to static headlines on error

#### `get-market-sentiment`
**Purpose:** Analyzes market sentiment using OpenAI

**Secrets Required:** `OPENAI_API_KEY`

**Request Format:** None (GET request)

**Response Format:**
```typescript
{
  aiAnxietyMultiplier: number; // 0.7-1.5
  trainingInterestMultiplier: number; // 0.8-1.4
  newsContext: string;
  timestamp: number;
}
```

#### `send-lead-email`
**Purpose:** Captures lead data, enriches with company research, sends detailed email

**Secrets Required:** `RESEND_API_KEY`, `OPENAI_API_KEY` (optional for research)

**Request Format:**
```typescript
{
  name: string;
  email: string;
  jobTitle: string;
  selectedProgram: string;
  sessionData: {
    frictionMap?: object;
    portfolioBuilder?: object;
    assessment?: object;
    tryItWidget?: object;
    pagesVisited: string[];
    timeOnSite: number;
    scrollDepth: number;
  };
}
```

**Features:**
- OpenAI-powered company research (domain → company info + news)
- Session engagement compilation (friction map, portfolio, assessment)
- Retry logic with exponential backoff (3 attempts, 1s/2s/4s delays)
- Comprehensive lead intelligence email to krish@themindmaker.ai

#### `create-consultation-hold` (PAUSED)
**Purpose:** Creates Stripe authorization hold for consultations

**Status:** Currently bypassed - direct Calendly booking without payment

**Secrets Required:** `STRIPE_SECRET_KEY`

---

## Authentication & Authorization

**Current:** None (public site, no user accounts)

**Future:** When implemented:
- Supabase Auth (email/password)
- JWT tokens for session management
- RLS policies for data access
- Protected routes in React Router

**Why Deferred:**
- All bookings via Calendly (external system)
- No user-generated content yet
- Simpler MVP without auth complexity

---

## Database

**Status:** Supabase connected, minimal usage

**Current Tables:** None (no data storage yet)

**Future Schema:**
```sql
-- When implemented
users (
  id uuid primary key,
  email text unique,
  name text,
  created_at timestamp
)

sessions (
  id uuid primary key,
  user_id uuid references users,
  program text,
  date timestamp,
  notes text,
  systems_built jsonb
)

portfolio_companies (
  id uuid primary key,
  partner_id uuid references users,
  name text,
  status text
)
```

---

## State Management

**Global State:** None (using React Router + TanStack Query)

**Local State:** React hooks (useState, useReducer)

**URL State:** React Router (route params, search params)

**Form State:** React Hook Form (validation, submission)

**Server State:** TanStack Query (caching, refetching)

---

## API Integration Patterns

### Supabase Edge Functions
```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { ...payload }
});
```

### Error Handling
```typescript
try {
  const { data, error } = await supabase.functions.invoke(...);
  if (error) throw error;
  // Handle success
} catch (error) {
  console.error('Error:', error);
  toast({
    title: "Error title",
    description: error.message,
    variant: "destructive",
  });
}
```

---

## Performance Considerations

### Code Splitting
- Route-based code splitting (React Router lazy)
- Component lazy loading for heavy components
- Vite automatic chunking

### Asset Optimization
- Images: WebP format preferred
- Fonts: Preloaded, font-display: optional
- Icons: SVG via Lucide React (tree-shakeable)

### Caching Strategy
- Static assets: Vite build hash (cache forever)
- API responses: TanStack Query (5min stale time)
- Edge function responses: No caching (always fresh)

---

## Security

### Environment Variables
**Secrets stored in Lovable Cloud:**
- `STRIPE_SECRET_KEY` (Stripe API key)
- `GOOGLE_SERVICE_ACCOUNT_KEY` (Google service account JSON for Vertex AI RAG)
- `OPENAI_API_KEY` (OpenAI API key for market sentiment, company research)
- `LOVABLE_API_KEY` (Lovable AI Gateway key - auto-provisioned)
- `RESEND_API_KEY` (Resend email delivery API key)
- `SUPABASE_URL` (auto-configured)
- `SUPABASE_ANON_KEY` (auto-configured - deprecated, use SUPABASE_PUBLISHABLE_KEY)
- `SUPABASE_PUBLISHABLE_KEY` (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-configured)

**Access Pattern:**
- Frontend: Public keys only (anon key)
- Edge Functions: Secret keys via `Deno.env.get()`

### CORS Policy
- Edge functions: Allow all origins (`*`)
- Production: Will restrict to domain

### Input Validation
- Frontend: React Hook Form + Zod schemas
- Backend: Manual validation in edge functions
- Stripe: Handled by Stripe Checkout

---

## Deployment Pipeline

### Development
```bash
npm run dev          # Start Vite dev server
```

### Build
```bash
npm run build        # Vite build → dist/
```

### Deploy
```
1. Push to GitHub (any branch)
   └─> Auto-sync to Lovable
   
2. Lovable builds frontend
   └─> Deploys to CDN
   
3. Edge functions auto-deploy
   └─> 30-60 second deployment time
   
4. Preview URL available immediately
   └─> Production URL updated on manual publish
```

---

## Monitoring & Debugging

### Frontend
- Browser DevTools (console, network, React DevTools)
- Lovable preview console (integrated)
- Error boundaries (React)

### Edge Functions
- Lovable Cloud logs (real-time)
- `console.log` statements (visible in logs)
- Error responses (returned to frontend)

### Stripe
- Stripe Dashboard (payments, customers, events)
- Webhooks (future implementation)

### Calendly
- Calendly Dashboard (bookings, confirmations)
- No API integration (redirect-only)

---

**End of ARCHITECTURE**
