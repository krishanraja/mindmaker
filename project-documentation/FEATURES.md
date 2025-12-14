# Features

**Last Updated:** 2025-12-14

---

## Product Offerings

### 1. Initial Consult (Entry Point)
**Status:** ✅ Live  
**Duration:** 45 minutes  
**Price:** Variable by program selection

**Purpose:** Understand user context, demonstrate AI-enabled building, recommend appropriate program

**Booking Flow (Current - As of 2025-12-01):**
1. User clicks CTA → Modal opens
2. Select program interest + enter name/email/job title
3. Lead email sent with enriched data (company research, session engagement)
4. Direct Calendly redirect for time booking
5. **$50 hold paused** - direct booking without payment

**Booking Flow (Previous - Paused):**
1. User clicks CTA → Modal opens
2. Select program interest + enter name/email
3. Stripe Checkout ($50 authorization hold)
4. Calendly redirect for time booking
5. Hold captured if user proceeds, refunded if not

**Implementation:** `InitialConsultModal`, `send-lead-email` edge function (was `create-consultation-hold`)

---

### 2. Builder Session
**Status:** ✅ Live  
**Duration:** 60 min + async follow-up  
**Price:** TBD (35% off through Dec 2025)

**Includes:**
- Intake form
- 60-min live session
- AI friction map
- 1-2 draft systems
- Written follow-up with prompts

**Target:** Leaders with 1 specific problem, need fast proof of concept

---

### 3. Builder Sprint
**Status:** ✅ Live  
**Duration:** 4 weeks intensive  
**Price:** TBD (35% off through Dec 2025)

**Includes:**
- 4 weekly sessions (90 min each)
- Async support
- 3-5 working AI systems
- Builder Dossier
- 90-day implementation plan

**Week Breakdown:**
- Week 1: Map (audit, identify friction)
- Week 2: Build (design systems)
- Week 3: Test (battle-test, refine)
- Week 4: Scale (document, plan)

**Target:** Senior leaders, 4-6 hrs/week available, ready for intensive work

---

### 4. AI Leadership Lab
**Status:** ✅ Live  
**Duration:** 2-8 hours  
**Price:** TBD (custom quote)

**Includes:**
- Pre-lab context gathering
- Facilitated session (6-12 executives)
- 2 decisions run through AI
- Shared framework
- 90-day pilot charter

**Target:** Executive teams needing alignment and shared language

---

### 5. Portfolio Partner Program
**Status:** ✅ Live  
**Duration:** 6-12 months  
**Price:** TBD (custom contract)

**Includes:**
- Portfolio-wide assessment
- Repeatable frameworks
- 10-20 company engagements
- Quarterly reporting
- Co-branded materials

**Target:** VC firms, advisory firms with 10+ portfolio companies

---

### 6. AI Leadership Benchmark (Lead Generation)
**Status:** ✅ Live  
**Duration:** 10 minutes  
**Price:** Free

**Purpose:** Self-serve diagnostic that helps leaders understand their AI readiness and generates qualified leads

**User Flow:**
1. User lands on `/leaders` or `/leadership-insights`
2. Intro screen explaining value proposition
3. 6-question benchmark (Likert scale 1-5) covering:
   - Leadership Growth (industry understanding, tool usage)
   - Strategic Vision (roadmap clarity, vendor evaluation)
   - Implementation (workflow adoption, transformation readiness)
4. Optional: Quick personalization (5 additional questions for tailored prompts)
5. Generating phase with smooth progress animation
6. Results page with:
   - Score out of 100 with tier classification
   - Percentile ranking vs 500+ executives
   - Strengths and growth areas (free)
   - Strategic insights (free preview)
   - Prompt Coach CTA
   - Collapsible form to unlock full results via email

**Tiers:**
- AI-Leader (80-100)
- AI-Advanced (65-79)
- AI-Proficient (50-64)
- AI-Developing (35-49)
- AI-Emerging (0-34)

**UX Principles:**
- No toasts - all feedback is inline
- Progress bars never regress
- Everything fits in mobile viewport (no scrolling during inputs)
- Uses `100dvh` for proper mobile browser chrome handling
- Collapsible unlock form reduces friction

**Implementation:** `LeadershipInsights.tsx`, `useLeadershipInsights.ts`, `send-leadership-insights-email` edge function

---

## Website Features

### Landing Page (/)
- Hero with particle animation
- Problem statement (chaos to clarity)
- Interactive command center demo
- Product ladder (3 tracks) with smooth scroll-to-top navigation
- Trust section with proof points
- Before/After comparison
- Final CTA with founder photo

**Navigation Behavior:**
- "Learn More" buttons: Navigate to program pages with smooth scroll to top
- "Book Session" buttons: Open booking modal without navigation

### Booking System
- `InitialConsultModal` with program selection
- Lead capture with session data context
- Company research enrichment (OpenAI)
- Email delivery with retry logic (Resend)
- Stripe integration (authorization holds) - **Currently paused**
- Calendly integration (pre-filled data)
- Conditional pricing display (per program)

### AI Chatbot
- Floating button (bottom right)
- Slide-out panel
- AI-powered responses (Vertex AI RAG with Gemini 2.5 Flash)
- Custom RAG corpus (business-specific knowledge)
- Context-aware with conversation history
- Persistent across navigation
- Anti-fragile error handling (graceful fallbacks)

### Supporting Pages
- `/builder-session` - Session details
- `/builder-sprint` - Sprint details
- `/leadership-lab` - Lab details
- `/partner-program` - Partnership details
- `/builder-economy` - Thought leadership
- `/leaders` or `/leadership-insights` - AI Leadership Benchmark diagnostic
- `/faq`, `/privacy`, `/terms`, `/contact`

---

## Technical Features

### Payment Processing
**Status:** ⚠️ Paused (Stripe integration exists but bypassed)
- Authorization holds ($50) - **Currently disabled**
- Manual capture on purchase - **N/A**
- Metadata tracking (customer info, program) - **N/A**
- **Current flow:** Direct Calendly booking without payment hold

### Edge Functions
**Status:** ✅ Live (Supabase/Deno)
- `chat-with-krish` - AI chatbot (Vertex AI RAG + Gemini 2.5 Flash)
- `get-ai-news` - News ticker (Lovable AI Gateway + Gemini 2.5 Flash)
- `get-market-sentiment` - Market analysis (OpenAI GPT-4o-mini)
- `send-lead-email` - Lead capture + company research (OpenAI + Resend)
- `send-contact-email` - Contact form submissions (Resend)
- `send-leadership-insights-email` - Leadership Benchmark results + lead notification (Resend)
- `create-consultation-hold` - Stripe checkout (**Paused, kept for future use**)
- All functions: CORS enabled, public access, comprehensive logging

### Authentication
**Status:** ❌ Not implemented
**Reason:** No user accounts needed (all via Calendly)
**Future:** Client portal, progress tracking

### Database
**Status:** ⚠️ Minimal (Supabase connected, unused)
**Future:** Session notes, progress tracking, community

---

## Feature Roadmap

### Q1 2026
- Client portal dashboard
- Progress tracking
- Template library
- Video testimonials

### Q2 2026
- Community forum
- Self-serve program (lower price)
- Partner dashboard
- Advanced analytics

### Q3 2026
- Certification program
- White-label platform
- Partner API

---

**End of FEATURES**
