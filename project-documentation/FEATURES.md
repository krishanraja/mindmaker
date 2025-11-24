# Core Features

**Last Updated:** 2025-11-24

---

## Feature Map

Mindmaker provides three core pathways, each with distinct features:

1. **AI Literacy Diagnostic (Individual Leaders)**
2. **Team Alignment Assessment (Executive Teams)**
3. **Portfolio Benchmarking Tool (Investment Firms)**

Plus supporting infrastructure:
- AI Chatbot (Krish Persona)
- Content Hub (Mental Models Library)
- Live Stats Tracking

---

## Feature #1: AI Literacy Diagnostic (For Individual Leaders)

**Purpose:** Map how a leader currently thinks about AI—surface gaps, blind spots, and leverage points in 2-5 minutes.

### User Flow
1. Leader lands on `/leaders` page from CTA
2. Fills out 6-question diagnostic form
3. Receives instant baseline report showing:
   - Where they think they stand vs where they actually stand
   - Key cognitive tensions identified
   - Recommended next actions

### Form Fields
1. **Name** (text input)
2. **Email** (email input)
3. **Company** (text input)
4. **Role** (text input)
5. **AI Engagement Level** (dropdown)
   - Observing - Following trends, not yet hands-on
   - Experimenting - Using tools occasionally
   - Practicing - Regular use for specific tasks
   - Integrating - AI is part of my decision-making process
6. **Primary Challenge** (dropdown)
   - Can't separate hype from real value
   - Lack vocabulary to challenge vendor claims
   - Unsure how AI will impact my role long-term
   - Don't know how to evaluate AI pilots
   - Worried about outsourcing judgment to AI
7. **Confidence Level** (dropdown)
   - Low - I often defer to others
   - Moderate - I contribute but not confidently
   - High - I can challenge assumptions and ask sharp questions

### Scoring Logic
```
Base Score Calculation:
- Observing: +20 points
- Experimenting: +40 points
- Practicing: +60 points
- Integrating: +80 points

Confidence Modifier:
- Low: +10 points
- Moderate: +20 points
- High: +30 points

Final Score: 0-100 (capped at 100)
```

### Baseline Report Output
Shows three cognitive tension areas:
1. **Cognitive Scaffolding** - Operating from hype vs building mental models
2. **Decision Infrastructure** - Vocabulary to challenge AI claims
3. **Mental Models** - Understanding how to work alongside AI

Conditional messaging based on score ranges:
- **<40:** Operating from vendor claims and media hype
- **40-69:** Baseline awareness but need sharper frameworks
- **70+:** Thinking clearly but need structured practice

### CTAs After Diagnostic
1. **Primary:** "Book Strategy Call" (links to Calendly)
2. **Secondary:** "Return to Homepage"

### Technical Implementation
- **Frontend:** React form with `react-hook-form` + `zod` validation
- **Validation:** Client-side validation (no backend submission yet)
- **Storage:** Results stored in browser localStorage
- **File:** `src/pages/Leaders.tsx`

---

## Feature #2: Team Alignment Assessment (For Executive Teams)

**Purpose:** Surface where a leadership team's mental models diverge before spending on AI pilots.

### User Flow
1. Decision-maker (CEO/COO/Chief of Staff) lands on `/exec-teams`
2. Fills out team diagnostic request form
3. Receives confirmation: "We'll reach out in 24 hours with pre-work"
4. Team members complete individual diagnostics (sent via email)
5. Mindmaker team compiles alignment report
6. 90-minute facilitated session surfaces tensions and builds shared literacy

### Form Fields
1. **Contact Name** (text input)
2. **Email** (email input)
3. **Company Name** (text input)
4. **Executive Team Size** (dropdown)
   - 3-5 executives
   - 6-10 executives
   - 11-20 executives
   - 20+ executives
5. **Team AI Literacy Level** (dropdown)
   - Fragmented - Everyone has different mental models
   - Emerging - Some shared language but gaps remain
   - Aligned - Common frameworks for AI decisions
   - Fluent - Team can challenge assumptions confidently
6. **Biggest Thinking Gap** (textarea, 10-500 characters)

### Submission Outcome
- Displays success message with next steps
- No backend integration yet (logs to console for now)
- Future: Email notification + CRM entry + pre-work email automation

### Technical Implementation
- **Frontend:** React form with `react-hook-form` + `zod` validation
- **Validation:** Client-side validation (no backend submission yet)
- **Storage:** Results logged to console (placeholder)
- **File:** `src/pages/ExecTeams.tsx`

---

## Feature #3: Portfolio Benchmarking Tool (For Investment Firms)

**Purpose:** Benchmark AI literacy across 10+ portfolio companies in minutes, spot cognitive gaps early.

### User Flow
1. Partner/GP lands on `/partners-interest`
2. Fills out partner interest form
3. Receives access to portfolio benchmarking tool
4. Sends diagnostic link to portfolio CEOs
5. Reviews aggregate report showing which companies are at risk

### Form Fields
1. **Name** (text input)
2. **Email** (email input)
3. **Firm Name** (text input)
4. **Role** (text input)
5. **Portfolio Size** (dropdown)
   - 1-5 companies
   - 6-15 companies
   - 16-30 companies
   - 30+ companies
6. **Primary Goal** (dropdown)
   - Benchmark AI maturity across portfolio
   - Add value beyond capital with AI literacy
   - Spot portfolio companies at risk of bad AI bets
   - Build operational expertise for LPs
7. **Biggest Portfolio Challenge** (textarea, 10-500 characters)

### Submission Outcome
- Displays success message: "We'll be in touch within 48 hours"
- No backend integration yet (logs to console for now)
- Future: Send partner onboarding email + access to portfolio dashboard

### Technical Implementation
- **Frontend:** React form with `react-hook-form` + `zod` validation
- **Validation:** Client-side validation (no backend submission yet)
- **Storage:** Results logged to console (placeholder)
- **File:** `src/pages/PartnersInterest.tsx`

---

## Feature #4: AI Chatbot (Krish Persona)

**Purpose:** Provide conversational AI literacy guidance in Krish's voice—direct, empathetic, anti-hype.

### Functionality
- **Sticky Chat Button:** Bottom-right corner, always accessible
- **Panel Interface:** Opens right-side panel with chat history
- **Persona:** Krish (founder) - skeptical, plain-English, real-world focused
- **Context Awareness:** Knows about Mindmaker pathways, pricing, positioning

### Chatbot Capabilities
1. Answer questions about Mindmaker services
2. Recommend which pathway fits user's needs
3. Provide AI literacy guidance (anti-hype, practical)
4. Explain diagnostic results
5. Handle pricing and booking inquiries

### Technical Implementation
- **Frontend:** Custom React chatbot component
- **Backend:** Supabase Edge Function `chat-with-krish`
- **AI:** OpenAI API via Supabase function invocation
- **Storage:** Chat history stored in browser localStorage
- **Context:** System prompt defines Krish persona and knowledge base
- **Files:**
  - `src/components/ChatBot/` (frontend components)
  - `supabase/functions/chat-with-krish/index.ts` (backend)

### System Prompt (Krish Persona)
See `supabase/functions/chat-with-krish/index.ts` for full prompt. Key traits:
- **Tone:** Direct, empathetic, no-bullshit
- **Language:** Plain English, real-world examples
- **Anti-Hype:** Skeptical of vendor claims, cuts through theatre
- **Practical:** Focuses on outcomes, not jargon

---

## Feature #5: Content Hub (Mental Models Library)

**Purpose:** Showcase the mental models and frameworks that power Mindmaker's system.

### Content Sections
1. **The AI Readiness Canvas** - Framework for evaluating AI opportunities
2. **SEAL Framework** - Sense → Evaluate → Act → Learn loop
3. **Decision Rehearsal Lab** - Practice space for AI decisions
4. **Vendor Evaluation Scorecard** - Framework to spot theatre vs substance

### Display Format
- Cards with expandable content (using `ExpandableProofCard` component)
- Gradient backgrounds for visual hierarchy
- Hover effects and animations
- Mobile-responsive grid layout

### Technical Implementation
- **File:** `src/components/ContentHubSection.tsx`
- **Component:** `ExpandableProofCard` for each content item
- **Lazy Loading:** Component is lazy-loaded in `Index.tsx`

---

## Feature #6: Live Stats Tracking

**Purpose:** Display Mindmaker's credibility through authentic track record and real-time engagement.

### Stats Displayed
1. **Strategies Delivered:** 90+ product strategies
2. **Seminars Conducted:** 50+ executive seminars
3. **Years of Experience:** 16 years
4. **Leaders with Upgraded Mental Models:** Dynamic counter

### Technical Implementation
- **Realistic Counters:** Uses custom hook `useRealisticCounters` for animated stats
- **Live Updates:** Stats animate when section enters viewport
- **Popup Notifications:** Occasional "live" activity popups for engagement
- **Files:**
  - `src/components/StatsSection.tsx`
  - `src/hooks/useRealisticCounters.ts`
  - `src/components/LiveStatsPopup.tsx`

---

## Feature #7: Navigation & Footer

### Navigation Features
- **Logo:** Mindmaker brand (links to homepage)
- **Menu Items:**
  - About (scrolls to system section)
  - Diagnostic (links to `/leaders`)
  - For Teams (links to `/exec-teams`)
  - For Partners (links to `/partners-interest`)
  - Founder (scrolls to stats/credentials section)
- **CTA Button:** "Get Your Baseline" (primary action)
- **Mobile Menu:** Hamburger menu for responsive design
- **Sticky Header:** Fixed position on scroll

### Footer Features
- **Links:**
  - How It Works
  - For Leaders
  - For Teams
  - For Partners
  - FAQ
  - Privacy Policy
  - Terms of Service
- **Social Proof:** "Used by leaders who need to make real AI decisions"
- **Copyright:** Mindmaker branding

### Technical Implementation
- **Files:**
  - `src/components/Navigation.tsx`
  - `src/components/Footer.tsx`

---

## Feature Priority Matrix

| Feature | Status | Priority | User Impact | Technical Complexity |
|---------|--------|----------|-------------|---------------------|
| AI Literacy Diagnostic | ✅ Live | Critical | High | Low |
| Team Alignment Request | ✅ Live | Critical | High | Low |
| Portfolio Benchmarking Request | ✅ Live | High | Medium | Low |
| AI Chatbot (Krish) | ✅ Live | High | Medium | Medium |
| Content Hub | ✅ Live | Medium | Medium | Low |
| Live Stats Tracking | ✅ Live | Low | Low | Low |
| Backend Data Persistence | 🚧 Planned | Critical | High | High |
| Email Automation | 🚧 Planned | High | High | Medium |
| Payment Integration | 🚧 Planned | High | High | Medium |

---

## Planned Features (Roadmap)

### Phase 1: Backend Integration
- Supabase database schema for diagnostic submissions
- Email automation (SendGrid/Resend integration)
- CRM integration (HubSpot or custom)

### Phase 2: Enhanced Diagnostics
- Multi-page diagnostic with branching logic
- Personalized roadmap generation
- PDF report generation and email delivery

### Phase 3: Team Dashboard
- Portal for executive teams to view alignment reports
- Individual team member diagnostic tracking
- Facilitator notes and action items

### Phase 4: Portfolio Dashboard
- Partner portal to manage portfolio benchmarking
- Aggregate reporting across companies
- Risk scoring and alerts for cognitive gaps

### Phase 5: Payment & Subscriptions
- Stripe integration for paid pathways
- Subscription management for ongoing access
- Invoicing and billing automation

---

**End of FEATURES**