# Features

**Last Updated:** 2025-11-25

---

## Product Offerings

### 1. Initial Consult (Entry Point)
**Status:** ✅ Live  
**Duration:** 45 minutes  
**Price:** $50 refundable hold

**Purpose:** Understand user context, demonstrate AI-enabled building, recommend appropriate program

**Booking Flow:**
1. User clicks CTA → Modal opens
2. Select program interest + enter name/email
3. Stripe Checkout ($50 authorization hold)
4. Calendly redirect for time booking
5. Hold captured if user proceeds, refunded if not

**Implementation:** `InitialConsultModal`, `create-consultation-hold` edge function

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

## Website Features

### Landing Page (/)
- Hero with particle animation
- Problem statement (chaos to clarity)
- Interactive command center demo
- Product ladder (3 tracks)
- Trust section with proof points
- Before/After comparison
- Final CTA with founder photo

### Booking System
- `InitialConsultModal` with program selection
- Stripe integration (authorization holds)
- Calendly integration (pre-filled data)
- Email confirmations

### AI Chatbot
- Floating button (bottom right)
- Slide-out panel
- AI-powered responses (OpenAI)
- Context-aware
- Persistent across navigation

### Supporting Pages
- `/builder-session` - Session details
- `/builder-sprint` - Sprint details
- `/leadership-lab` - Lab details
- `/partner-program` - Partnership details
- `/builder-economy` - Thought leadership
- `/faq`, `/privacy`, `/terms`

---

## Technical Features

### Payment Processing
**Status:** ✅ Live (Stripe)
- Authorization holds ($50)
- Manual capture on purchase
- Metadata tracking (customer info, program)

### Edge Functions
**Status:** ✅ Live (Supabase/Deno)
- `create-consultation-hold` - Checkout creation
- `chat-with-krish` - AI chatbot
- `get-ai-news` - News ticker
- All functions: CORS enabled, public access

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
