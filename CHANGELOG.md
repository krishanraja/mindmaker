# AI MINDMAKER CHANGELOG

**Last Updated:** 2026-01-03

---

## Builder Profile Pipeline Fixes (2026-01-XX)

### Critical Bug Fixes
- **src/hooks/useAssessment.ts**: Removed `widgetMode: 'tryit'` from Builder Profile API call - was causing wrong system prompt selection
- **supabase/functions/chat-with-krish/index.ts**: Added Builder Profile mode detection from message content or explicit mode parameter
- **supabase/functions/chat-with-krish/index.ts**: Added minimal system prompt for Builder Profile that defers to user's detailed instructions
- **supabase/functions/chat-with-krish/index.ts**: Increased `maxOutputTokens` to 4096 for Builder Profile (was 2048)

### Fallback Quality Improvements
- **src/hooks/useAssessment.ts**: Replaced hardcoded generic templates with LLM-generated fallback
- **src/hooks/useAssessment.ts**: Improved score-based fallback to reference user's actual answers
- All fallbacks now include timelines and reference specific answer choices

### Technical Details
- Added `mode` parameter to request schema: `'builder-profile' | 'tryit' | 'chat'`
- Builder Profile detection via message content patterns (AI readiness assessment, Builder Profile, CEO/COO/CPO)
- System prompt selection: Builder Profile → minimal prompt; Try It Widget → TRYIT_SYSTEM_PROMPT; Chat → CHAT_SYSTEM_PROMPT

---

## Mobile Hero & ICP Cards Diagnosis (2026-01-XX)

### Issues Identified
- **Mobile Hero Text**: Horizontal overflow causing text truncation
- **Mobile Hero Text**: Vertical clipping during rotation animations
- **ICP Cards**: Missing "Who does Mindmaker help?" heading
- **ICP Cards**: Aggressive shimmer with 3 overlapping animations
- **ICP Cards**: Unequal card heights due to variable content

### Root Causes Documented
- Absolute positioning breaking container width constraints
- `clamp()` + fixed height + `nowrap` conflict
- `overflow-hidden` clipping animation movement
- Missing contextual heading above ICPSlider component
- No height constraints on card containers

### Files Affected
- `src/components/NewHero.tsx` (lines 74-140)
- `src/components/TheProblem.tsx` (lines 172-400)

---

## SEO Implementation Complete (2026-01-26)

### Meta Tags & HTML Head (10/10)
- Optimized page titles (< 60 characters, keyword-rich)
- Meta descriptions (< 160 characters, compelling CTAs)
- Canonical URLs to prevent duplicate content
- Robots meta tags with detailed crawling instructions

### Structured Data / Schema.org (10/10)
- Organization, WebSite, WebPage schemas
- Service schemas for all offerings
- Person schema for founder (Krish Raja)
- FAQ schema, BreadcrumbList, Course schema
- AggregateRating (4.9/5 with 50 reviews)

### Technical SEO (10/10)
- robots.txt configured with crawl delays
- sitemap.xml with all major pages
- Proper URL structure and priorities

---

## Vertex AI RAG Migration (2025-01-25)

### AI Backend Changes
- **chat-with-krish**: Migrated from OpenAI to Vertex AI RAG with Gemini 2.5 Flash
- **get-ai-news**: Kept on Lovable AI Gateway (Gemini 2.5 Flash)
- **get-market-sentiment**: Kept on OpenAI GPT-4o-mini

### Implementation Details
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime) to reduce auth overhead
- RAG Corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`
- Anti-fragile error handling with graceful fallbacks

### Secrets Required
- `GOOGLE_SERVICE_ACCOUNT_KEY` (Google service account JSON)
- `OPENAI_API_KEY` (for market sentiment, company research)
- `LOVABLE_API_KEY` (auto-provisioned for news ticker)
- `RESEND_API_KEY` (email delivery)

---

## AI Leadership Benchmark Diagnostic (2025-12-14)

### New Features
- Created `/leaders` and `/leadership-insights` routes
- Built comprehensive AI Leadership Benchmark diagnostic flow
- 6 Likert-scale questions covering Leadership Growth, Strategic Vision, Implementation
- Optional personalization with 5 additional questions
- Smooth generating animation with progress that never regresses
- Results page with free value (score, tier, strengths, insights) before unlock
- Collapsible unlock form with Resend email integration

### UX Improvements
- No toasts - all feedback is inline for cleaner mobile experience
- Progress bars use easing and never move backward
- Everything fits in mobile viewport using `100dvh`
- Collapsible unlock form reduces friction and perceived commitment

### Technical Details
- `useLeadershipInsights.ts` hook manages all diagnostic state and logic
- `LeadershipInsights.tsx` page with AnimatePresence for smooth phase transitions
- `send-leadership-insights-email` edge function sends dual emails
- Client-side score calculation (no AI API latency)
- Tier classification: AI-Emerging, AI-Developing, AI-Proficient, AI-Advanced, AI-Leader

### Files Created
- `src/pages/LeadershipInsights.tsx`
- `src/hooks/useLeadershipInsights.ts`
- `supabase/functions/send-leadership-insights-email/index.ts`

---

## Production Readiness Audit (2025-12-13)

### Critical Bug Fixes
- **src/pages/Index.tsx**: Removed duplicate ChatBot component (already in App.tsx)
- **src/main.tsx**: Added React StrictMode for enhanced development checks
- **src/pages/FAQ.tsx**: Fixed faqItems hoisting bug - moved constant outside component
- **src/pages/BuilderSession.tsx**: Updated SEO schema `priceValidUntil` from past date to 2026-12-31

### Code Quality Improvements
- **src/components/ConsultationBooking.tsx**: Removed unused imports (Lock, supabase)
- **src/pages/BuilderEconomy.tsx**: Fixed SPA navigation pattern (onClick → asChild anchor)
- **src/pages/FAQ.tsx**: Changed email button from onClick to proper anchor tag

### Accessibility Improvements
- **src/components/WhitepaperPopup.tsx**: Added missing DialogDescription for screen readers

### SEO Enhancements
Added SEO component with proper meta tags to:
- `src/pages/Privacy.tsx`
- `src/pages/Terms.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Contact.tsx`
- `src/pages/BuilderEconomy.tsx`

### Security Audit - All Passed ✅
- Edge functions: Zod validation, HTML escaping, proper CORS
- Data flow: Client-side session data only, no PII persistence
- Form handling: Type-safe validation with Zod schemas

---

## Navigation UX Enhancements (2025-12-02)

### Changes
- **src/components/ProductLadder.tsx**:
  - Added scroll-to-top behavior for "Learn More" buttons
  - Implemented smooth scroll transitions (`behavior: 'smooth'`)
  - Applied to JourneySlider, mobile offerings, desktop offerings
  - Preserved modal behavior for "Book Session" buttons

**Impact:** Users navigating to program pages via "Learn More" now smoothly land at the top of the destination page.

---

## Remove $50 Hold & Lead Intelligence System (2025-12-01)

### Changes
- Paused Stripe $50 authorization hold requirement
- Implemented direct Calendly booking without payment
- Created `send-lead-email` edge function with:
  - OpenAI-powered company research (domain → company info + news)
  - Session data compilation (friction map, portfolio, assessment)
  - Retry logic with exponential backoff (3 attempts)
- Updated `InitialConsultModal` with conditional pricing text

### Lead Intelligence Features
- Email domain → Company name, industry, size, latest news
- Session engagement: friction map usage, portfolio builder, assessment
- Try-It widget interactions
- Pages visited, time on site, scroll depth
- Suggested scope of work based on context

### Files Modified
- `src/components/InitialConsultModal.tsx`
- `src/components/ConsultationBooking.tsx`
- `supabase/functions/send-lead-email/index.ts` (new)
- `supabase/functions/chat-with-krish/index.ts` (added logging)
- `supabase/functions/get-market-sentiment/index.ts` (added logging)
- `supabase/functions/get-ai-news/index.ts` (improved error messages)

---

## CTA Flow Redesign (2025-11-25)

### Changes
- Created `InitialConsultModal` component
- All CTAs now route through single modal
- Added program selection to booking flow
- Updated edge function to pass program to Calendly
- Added holiday urgency messaging (35% off through Dec)

### Files Modified
- `src/components/InitialConsultModal.tsx` (new)
- `src/components/NewHero.tsx`
- `src/components/ProductLadder.tsx`
- `src/components/SimpleCTA.tsx`
- `supabase/functions/create-consultation-hold/index.ts`
- `src/pages/BuilderSession.tsx`
- `src/components/ConsultationBooking.tsx`

---

## Stripe Integration (2025-11-24)

### Changes
- Implemented Stripe Checkout for $50 authorization holds
- Created `create-consultation-hold` edge function
- Integrated with Calendly for post-payment redirect
- Added `ConsultationBooking` component

### Implementation Details
- Authorization hold (not immediate charge)
- Manual capture when user proceeds with program
- Fully refundable if user not satisfied
- **Status: Currently paused** - direct Calendly booking without payment

---

## Design System Implementation (2025-11-24)

### Changes
- Established Ink + Mint two-color palette
- Created comprehensive design tokens in index.css
- Updated tailwind.config.ts with semantic mappings
- Refactored all components to use tokens

### Color System
- **Ink** (#0e1a2b): Primary dark, structure, typography
- **Mint** (#7ef4c2): Highlights, accents, CTAs (sparingly)
- Neutrals: Off-white, light grey, mid grey, graphite

### Glass Morphism
- `.glass-card`: translucent cards with backdrop-blur for light backgrounds
- `.glass-card-dark`: translucent cards optimized for dark backgrounds

---

## Brand Transformation (2025-11-24)

### Brand Identity Transformation
- **FROM**: Generic "Strategic AI Implementation"
- **TO**: Authentic "AI Literacy & Strategic Advisory"
- **Methodology**: LEARN → DECIDE → ALIGN → SELL (literacy-first approach)
- **Positioning**: Product strategist, commercial revenue leader, educator

### Components Rebranded
- `Hero.tsx`: AI Literacy & Strategic Advisory focus
- `MethodologySection.tsx`: LEARN → DECIDE → ALIGN → SELL
- `StatsSection.tsx`: Authentic statistics (90+ strategies, 50+ seminars, 16 years)
- `PathwaysSection.tsx`: AI Literacy Pathway offerings
- `CTASection.tsx`: The AI Literacy Gap focus

---

## Initial Platform Launch (2025-11-23)

### Features Launched
- Hero with particle animation
- Product offerings (Session, Sprint, Lab, Partner)
- AI news ticker
- Chat assistant
- Navigation + Footer
- Legal pages (Privacy, Terms, FAQ)

### Initial Stack
- React 18 + TypeScript
- Vite build tool
- TailwindCSS + Shadcn UI
- Supabase backend
- Lovable Cloud hosting

---

## Project Initialization (2025-11-22)

### Initial Setup
- Lovable project created
- Repository initialized
- Supabase Cloud enabled
- GitHub integration connected
- Base dependencies installed

---

**End of CHANGELOG**
