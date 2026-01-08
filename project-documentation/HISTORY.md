# History

**Last Updated:** 2026-01-08

---

## 2026-01-06: Hero Scrollbar Flash & Drawer Positioning Fix

**What Changed:**
- Fixed horizontal scrollbar flash on page load
- Fixed side drawer content cut off behind navbar
- Added navbar-aware sheet positioning system

**Why:**
- Hero scrollbar flash: Global CSS h1 styles (clamp 40-72px) applied before component's inline styles
- Drawer cut off: Sheet used `inset-y-0` from viewport edge while navbar covers 64-80px

**Technical Details:**
- Moved `.hero-text-size` to CSS `@layer components` for early parsing
- Added `#hero h1 { font-size: inherit; }` to prevent global override
- Created CSS variables: `--navbar-height`, `--navbar-height-sm`, `--navbar-height-md`
- Added `.sheet-navbar-aware` class with responsive positioning

**Files Modified:**
- `src/index.css`
- `src/components/NewHero.tsx`
- `src/components/ActionsHub.tsx`

---

## 2026-01-05: Text Contrast System Fix

**What Changed:**
- Fixed WCAG AA contrast failures on dark backgrounds
- Added `dark-cta-card` component class
- Added `dark-card-*` text color utilities

**Why:**
- `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements (4.5:1)
- Text was unreadable on mobile devices across FAQ, Blog, BlogPost, Contact, SimpleCTA

**Technical Details:**
- Added design tokens: `--dark-card-heading`, `--dark-card-body`, `--dark-card-muted`
- Created `.dark-cta-card` component class with enforced high-contrast text
- Added Tailwind utilities: `text-dark-card-heading`, `text-dark-card-body`, `text-dark-card-muted`

**Files Modified:**
- `src/index.css`, `tailwind.config.ts`
- `src/pages/FAQ.tsx`, `src/pages/BlogPost.tsx`, `src/pages/Contact.tsx`, `src/pages/Blog.tsx`
- `src/components/SimpleCTA.tsx`

---

## 2026-01-XX: Builder Profile Pipeline Fixes

**What Changed:**
- Fixed Builder Profile to use correct system prompt (removed `widgetMode: 'tryit'`)
- Added Builder Profile mode detection in chat-with-krish edge function
- Increased token allocation for Builder Profile (4096 tokens)
- Improved fallback quality with LLM-generated responses instead of hardcoded templates

**Why:**
- Builder Profile was receiving wrong system prompt (Try It Widget instead of CEO-grade)
- User complaint: outputs were generic ("Open mindset", "Willingness to learn")
- Root cause: `widgetMode: 'tryit'` triggered wrong prompt selection in edge function

**Technical Details:**
- Frontend: Removed `widgetMode` from Builder Profile API call
- Backend: Added mode detection from message content or explicit mode param
- Backend: Added minimal system prompt for Builder Profile that defers to user instructions
- Token allocation: Builder Profile 4096, Try It Widget 1024, Chat 2048

**Files Modified:**
- `src/hooks/useAssessment.ts`
- `supabase/functions/chat-with-krish/index.ts`

---

## 2026-01-XX: Mobile Hero & ICP Cards Diagnosis

**What Changed:**
- Documented mobile hero text overflow issues (horizontal and vertical)
- Documented ICP cards UX issues (missing heading, aggressive shimmer, unequal heights)
- Created comprehensive root cause analysis

**Issues Identified:**
1. **Mobile Hero Horizontal Overflow**: Text falling off left and right sides
2. **Mobile Hero Vertical Clipping**: Rotating text cut off during animation
3. **ICP Cards Missing Heading**: No "Who does Mindmaker help?" above slider
4. **ICP Cards Aggressive Shimmer**: 3 overlapping infinite animations
5. **ICP Cards Unequal Heights**: Variable content causing different card sizes

**Root Causes:**
- Absolute positioning breaking container constraints
- `clamp()` + fixed height + `nowrap` conflict
- `overflow-hidden` clipping animation movement
- No min-height on card containers

**Files Created:**
- `DIAGNOSIS.md`, `ROOT_CAUSE.md`, `MOBILE_HERO_OVERFLOW_DIAGNOSIS.md`

---

## 2026-01-26: SEO Implementation Complete

**What Changed:**
- Implemented comprehensive SEO (10/10 score)
- Added structured data / Schema.org markup
- Configured robots.txt and sitemap.xml
- Optimized meta tags for all pages

**SEO Elements Added:**
- Meta tags and HTML head optimization
- Open Graph and Twitter Card tags
- JSON-LD structured data (Organization, WebSite, Service, Person, FAQ)
- Geographic targeting
- Performance optimization (preconnect, prefetch)

**Target Keywords:**
- no-code AI, AI for non-technical leaders, AI literacy training
- executive AI training, AI strategy consultant
- hands-on AI learning, practical AI implementation

**Files Modified:**
- `index.html`, `public/robots.txt`, `public/sitemap.xml`
- SEO component added to all major pages

---

## 2025-01-25: Vertex AI RAG Migration

**What Changed:**
- Migrated `chat-with-krish` from OpenAI to Vertex AI RAG with Gemini 2.5 Flash
- Kept news ticker on Lovable AI Gateway
- Kept market sentiment on OpenAI
- Implemented anti-fragile error handling

**Why:**
- Custom RAG corpus provides business-specific knowledge
- Gemini 2.5 Flash offers comparable performance
- Separation of concerns: chatbot uses custom knowledge, news uses general knowledge

**Implementation Details:**
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime)
- RAG Corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`
- Fallback message provides actionable alternatives on any failure

**Files Modified:**
- `supabase/functions/chat-with-krish/index.ts` (complete rewrite)
- `supabase/functions/_shared/vertex-client.ts` (new)

---

## 2025-12-14: AI Leadership Benchmark Diagnostic

**What Changed:**
- Created new `/leaders` and `/leadership-insights` routes
- Built comprehensive AI Leadership Benchmark diagnostic flow
- 6 Likert-scale questions covering Leadership Growth, Strategic Vision, Implementation
- Optional personalization with 5 additional questions
- Smooth generating animation with progress that never regresses
- Results page with free value (score, tier, strengths, insights) before unlock
- Collapsible unlock form with Resend email integration
- Removed Toaster components from App.tsx (no toast notifications in Leadership flow)

**UX Improvements:**
- No toasts - all feedback is inline for cleaner mobile experience
- Progress bars use easing and never move backward
- Everything fits in mobile viewport using `100dvh` (no scrolling during inputs)
- Collapsible unlock form reduces friction and perceived commitment
- More free value shown before asking for contact info

**Technical Details:**
- `useLeadershipInsights.ts` hook manages all diagnostic state and logic
- `LeadershipInsights.tsx` page with AnimatePresence for smooth phase transitions
- `send-leadership-insights-email` edge function sends dual emails:
  - User receives full results with prompt templates and action plan
  - Krish receives lead notification with all diagnostic data
- Client-side score calculation (no AI API latency)
- Tier classification: AI-Emerging, AI-Developing, AI-Proficient, AI-Advanced, AI-Leader

**Files Created:**
- `src/pages/LeadershipInsights.tsx`
- `src/hooks/useLeadershipInsights.ts`
- `supabase/functions/send-leadership-insights-email/index.ts`

**Files Modified:**
- `src/App.tsx` (removed Toaster imports, added routes)
- `supabase/config.toml` (added new edge function config)

---

## 2025-12-13: Production Readiness Audit

**What Changed:**
- Removed duplicate ChatBot component from Index.tsx
- Added React StrictMode to main.tsx
- Fixed faqItems hoisting bug in FAQ.tsx
- Updated SEO schema dates to 2026-12-31
- Fixed unused imports and SPA navigation patterns
- Added DialogDescription for accessibility

**Files Modified:**
- `src/pages/Index.tsx`, `src/main.tsx`, `src/pages/FAQ.tsx`
- `src/pages/BuilderSession.tsx`, `src/components/ConsultationBooking.tsx`
- `src/pages/BuilderEconomy.tsx`, `src/components/WhitepaperPopup.tsx`

---

## 2025-12-02: Navigation UX Improvements

**What Changed:**
- Added scroll-to-top behavior for "Learn More" navigation buttons
- Implemented smooth scrolling for polished page transitions
- Preserved modal behavior for "Book Session" buttons

**Why:**
- Improve user experience when navigating between program pages
- Ensure users always see the top of destination pages
- Create polished, professional page transitions
- Reduce user confusion from mid-page landings

**Implementation Details:**
- Added `window.scrollTo({ top: 0, behavior: 'smooth' })` before navigation
- Applied to JourneySlider, mobile offerings, and desktop offerings in ProductLadder
- Conditional logic ensures "Book Session" modal behavior remains unchanged

**Files Modified:**
- `src/components/ProductLadder.tsx`

---

## 2025-12-01: Remove $50 Hold & Lead Intelligence System

**What Changed:**
- Paused Stripe $50 authorization hold requirement
- Implemented direct Calendly booking without payment
- Created `send-lead-email` edge function with:
  - OpenAI-powered company research (domain → company info + news)
  - Session data compilation (friction map, portfolio, assessment)
  - Retry logic with exponential backoff (3 attempts)
- Updated `InitialConsultModal` with conditional pricing text
- Added comprehensive diagnostic logging to all edge functions

**Why:**
- Lower booking friction during validation phase
- Validate demand without payment barrier
- Capture rich lead intelligence instead of payment signal
- Enable rapid iteration without payment complexity

**Lead Intelligence Features:**
- Email domain → Company name, industry, size, latest news
- Session engagement: friction map usage, portfolio builder, assessment
- Try-It widget interactions
- Pages visited, time on site, scroll depth
- Suggested scope of work based on context

**Files Modified:**
- `src/components/InitialConsultModal.tsx`
- `src/components/ConsultationBooking.tsx`
- `supabase/functions/send-lead-email/index.ts` (new)
- `supabase/functions/chat-with-krish/index.ts` (added logging)
- `supabase/functions/get-market-sentiment/index.ts` (added logging)
- `supabase/functions/get-ai-news/index.ts` (improved error messages)

**Stripe Integration Status:**
- Code kept but commented out
- Can be re-enabled quickly if needed
- `create-consultation-hold` function remains but unused

---

## 2025-11-25: CTA Flow Redesign

**What Changed:**
- Created `InitialConsultModal` component
- All CTAs now route through single modal
- Added program selection to booking flow
- Updated edge function to pass program to Calendly
- Added holiday urgency messaging (35% off through Dec)

**Why:**
- Simplified user journey (one entry point)
- Better program qualification
- Improved tracking of user interests
- Reduced friction in booking process

**Files Modified:**
- `src/components/InitialConsultModal.tsx` (new)
- `src/components/NewHero.tsx`
- `src/components/ProductLadder.tsx`
- `src/components/SimpleCTA.tsx`
- `supabase/functions/create-consultation-hold/index.ts`
- `src/pages/BuilderSession.tsx`
- `src/components/ConsultationBooking.tsx`

---

## 2025-11-24: Stripe Integration

**What Changed:**
- Implemented Stripe Checkout for $50 authorization holds
- Created `create-consultation-hold` edge function
- Integrated with Calendly for post-payment redirect
- Added `ConsultationBooking` component

**Why:**
- Reduce no-shows with refundable hold
- Create payment trail for tracking
- Professional booking experience
- Manual capture allows flexibility

**Implementation Details:**
- Authorization hold (not immediate charge)
- Manual capture when user proceeds with program
- Fully refundable if user not satisfied
- Deducted from final program price

**Files Created:**
- `supabase/functions/create-consultation-hold/index.ts`
- `src/components/ConsultationBooking.tsx`

**Files Modified:**
- `supabase/config.toml` (added function config)
- Service pages (Sprint, Lab, Partner)

---

## 2025-11-24: Design System Implementation

**What Changed:**
- Established Ink + Mint two-color palette
- Created comprehensive design tokens in index.css
- Updated tailwind.config.ts with semantic mappings
- Refactored all components to use tokens
- Removed hardcoded colors

**Why:**
- Consistent brand identity
- Fast design decisions
- Easy theme switching
- Maintainable codebase

**Color System:**
- **Ink** (#0e1a2b): Primary dark, structure, typography
- **Mint** (#7ef4c2): Highlights, accents, CTAs (sparingly)
- Neutrals: Off-white, light grey, mid grey, graphite

**Files Modified:**
- `src/index.css` (complete rewrite of tokens)
- `tailwind.config.ts` (added semantic colors)
- All component files (replaced hardcoded colors)

---

## 2025-11-23: Initial Platform Launch

**What Changed:**
- Built landing page with hero section
- Created product ladder with 3 tracks
- Implemented trust section with proof points
- Added AI chatbot (Krish)
- Created individual program pages
- Deployed on Lovable Cloud

**Features Launched:**
- Hero with particle background
- Product offerings (Session, Sprint, Lab, Partner)
- AI news ticker
- Chat assistant
- Navigation + Footer
- Legal pages (Privacy, Terms, FAQ)

**Files Created:**
- Complete `src/` directory structure
- All page components
- Navigation system
- ChatBot system
- Edge functions (chat, news)

---

## 2025-11-22: Project Initialization

**What Changed:**
- Lovable project created
- Repository initialized
- Supabase Cloud enabled
- GitHub integration connected
- Base dependencies installed

**Initial Stack:**
- React 18 + TypeScript
- Vite build tool
- TailwindCSS + Shadcn UI
- Supabase backend
- Lovable Cloud hosting

---

## Evolution Timeline

### Phase 1: Foundation (Week 1)
- Project setup
- Design system
- Core landing page
- Basic navigation

### Phase 2: Content (Week 1-2)
- Program pages
- Trust elements
- Social proof
- Legal pages

### Phase 3: Interactions (Week 2)
- AI chatbot
- Interactive demos
- Animations
- Mobile optimization

### Phase 4: Conversion (Week 2-3)
- Stripe integration
- Booking flow
- Calendly integration
- CTA optimization

### Phase 5: Refinement (Week 3-4)
- CTA flow redesign
- Program qualification
- Urgency messaging
- Analytics setup

### Phase 6: Lead Generation (Week 4+)
- AI Leadership Benchmark diagnostic
- Lead intelligence system
- Stripe hold paused for validation
- SEO implementation complete

### Phase 7: AI Backend Migration (2025-01-XX)
- Vertex AI RAG migration
- Custom business knowledge corpus
- Anti-fragile error handling
- Builder Profile pipeline fixes

### Phase 8: Polish & Accessibility (2026-01)
- Text contrast system fix (WCAG AA compliance)
- Hero scrollbar flash fix
- Drawer positioning fix
- Blog/content hub

---

## Major Decisions

### 2026-01-06: Navbar-Aware Sheet Positioning
**Decision:** Add CSS variables for navbar height and `.sheet-navbar-aware` class  
**Rationale:** Side drawer content was cut off behind fixed navbar  
**Result:** Drawers now position correctly below navbar on all screen sizes

### 2026-01-05: Dark Card Text Contrast System
**Decision:** Create dedicated tokens and utilities for text on dark backgrounds  
**Rationale:** `text-white/80` failed WCAG AA contrast requirements  
**Result:** All dark backgrounds now use high-contrast text utilities

### 2026-01-XX: Builder Profile Mode Detection
**Decision:** Detect Builder Profile mode from message content, not widgetMode  
**Rationale:** widgetMode: 'tryit' was causing wrong system prompt selection  
**Result:** CEO-grade Builder Profile outputs, not generic templates

### 2025-01-25: Vertex AI RAG for Chatbot
**Decision:** Use Vertex AI RAG with custom corpus instead of OpenAI  
**Rationale:** Business-specific knowledge, existing RAG investment  
**Result:** More relevant, contextual chatbot responses

### 2025-12-14: Self-Serve Lead Gen Diagnostic
**Decision:** Create AI Leadership Benchmark for self-serve lead qualification  
**Rationale:** Lower friction than booking calls, provides immediate value  
**Result:** New lead generation channel with engaged prospects

### 2025-12-01: Pause Stripe $50 Hold
**Decision:** Remove payment requirement for booking  
**Rationale:** Reduce friction during validation phase  
**Result:** More bookings, lead intelligence instead of payment signal

### 2025-11-24: Two-Color System
**Decision:** Use only Ink + Mint (no gradients, no multi-color)  
**Rationale:** Simplicity, boldness, memorability  
**Result:** Faster design, stronger brand identity

### 2025-11-24: Authorization Holds
**Decision:** Use Stripe authorization holds, not charges  
**Rationale:** Lower barrier, refundable, professional  
**Result:** Better conversion, lower risk perception

### 2025-11-23: No User Auth Yet
**Decision:** Defer authentication implementation  
**Rationale:** All bookings via Calendly, no user content yet  
**Result:** Faster MVP, simpler architecture

### 2025-11-23: Edge Functions Over API Routes
**Decision:** Use Supabase Edge Functions (Deno)  
**Rationale:** Serverless, auto-scaling, integrated with Lovable  
**Result:** Zero server management, fast deployment

---

## Lessons Learned

### What Worked
✅ Starting with clear design system  
✅ Component-first development  
✅ Deferring auth until needed  
✅ Using Calendly for scheduling  
✅ Authorization holds over charges  
✅ Self-serve diagnostic for lead gen  
✅ Vertex AI RAG for business-specific knowledge  
✅ Anti-fragile error handling  
✅ CSS-first solutions for positioning issues  
✅ Design tokens for contrast compliance

### What Changed
🔄 Initial multi-CTA approach → Single modal entry  
🔄 Direct Calendly links → Stripe-first flow → Stripe paused  
🔄 Complex color system → Two-color simplicity  
🔄 Generic CTAs → Program-specific qualification  
🔄 OpenAI chatbot → Vertex AI RAG chatbot  
🔄 widgetMode for Builder Profile → mode detection from content  
🔄 text-white/80 → dark-card-* utilities for contrast

### What to Avoid
❌ Hardcoding colors (use tokens)  
❌ Over-engineering booking flow  
❌ Multiple entry points (confusing)  
❌ Building features before needed  
❌ Skipping mobile testing  
❌ Using wrong widgetMode for different tools  
❌ Generic fallback templates (use LLM-generated)  
❌ Low-contrast text on dark backgrounds (use WCAG AA utilities)  
❌ Inline styles for critical CSS (use @layer components)

---

## Recurring Patterns

### Development Cycle
```
1. Design mockup/wireframe
2. Build component in isolation
3. Integrate with page
4. Test on mobile
5. Deploy + verify
6. Iterate based on feedback
```

### Decision Framework
```
1. What problem does this solve?
2. What's the simplest solution?
3. Can we defer complexity?
4. What are we learning?
5. Ship and iterate.
```

### Anti-Fragile Pattern
```
1. Always have fallback behavior
2. Log all failure points
3. Graceful degradation on errors
4. User never sees broken UI
5. Monitor and iterate
```

### CSS Architecture Pattern
```
1. Use CSS variables for dynamic values
2. Put critical styles in @layer components
3. Use design tokens, not hardcoded values
4. Test on mobile first
5. Respect reduced-motion preferences
```

---

**End of HISTORY**
