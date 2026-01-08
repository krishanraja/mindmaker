# Decisions Log

**Last Updated:** 2026-01-08

---

## Architecture Decisions

### 2026-01-06: Navbar-Aware Sheet Positioning System

**Decision:** Create CSS variables for navbar height and `.sheet-navbar-aware` class for side drawers

**Context:**
- ActionsHub side drawer content was cut off behind the fixed navbar
- Sheet component used `inset-y-0` from viewport edge (top: 0)
- Navbar is fixed at z-100 covering top 64-80px depending on screen size

**Rationale:**
- CSS-first solution is simpler than JavaScript-based positioning
- CSS variables allow responsive adjustment across breakpoints
- Single class application keeps component code clean

**Implementation:**
```css
--navbar-height: 4rem;      /* 64px - mobile */
--navbar-height-sm: 4.5rem; /* 72px - small screens */
--navbar-height-md: 5rem;   /* 80px - medium+ screens */

.sheet-navbar-aware {
  top: var(--navbar-height) !important;
  height: calc(100dvh - var(--navbar-height)) !important;
}
```

**Alternatives Considered:**
- JavaScript positioning based on navbar ref → More complex, potential timing issues
- Fixed pixel values → Not responsive to navbar height changes
- Removing fixed navbar → Would break navigation UX

**Impact:**
- Side drawers now position correctly below navbar
- Works across all screen sizes
- No JavaScript complexity

**Files Affected:**
- `src/index.css` (lines 93-96, 647-670)
- `src/components/ActionsHub.tsx`

---

### 2026-01-06: Hero Text Size in CSS Layer

**Decision:** Move hero text sizing from inline styles to CSS `@layer components`

**Context:**
- Horizontal scrollbar briefly flashed during page load
- Global CSS h1 styles (clamp 40-72px) applied before component's inline `<style>` tag
- Caused oversized text (~72px) for ~1 second before component styles loaded

**Rationale:**
- CSS in `@layer components` is parsed earlier than inline `<style>` tags
- Eliminates race condition between global and component styles
- Layout containment prevents layout recalculation

**Implementation:**
```css
/* In @layer components */
.hero-text-size {
  font-size: 1.5rem !important;
  line-height: 1.2 !important;
}

#hero h1 { font-size: inherit; }
#hero .hero-content-wrapper { contain: layout style; }
```

**Alternatives Considered:**
- Remove global h1 clamp() sizing → Would affect all h1 elements site-wide
- Use JavaScript to detect and fix → Adds complexity, might still flash
- Add `overflow-x: hidden` to body → Hides symptom, not root cause

**Impact:**
- No scrollbar flash on page load
- Hero text renders at correct size immediately
- Global h1 styles still work elsewhere

**Files Affected:**
- `src/index.css`
- `src/components/NewHero.tsx` (removed inline styles)

---

### 2026-01-05: Dark Card Text Contrast System

**Decision:** Create dedicated design tokens and utilities for text on dark backgrounds

**Context:**
- `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements
- Contrast ratio was below 4.5:1 required for body text
- Text was unreadable on mobile devices

**Rationale:**
- WCAG AA compliance is a legal and ethical requirement
- Design tokens ensure consistent usage across codebase
- Component class (`.dark-cta-card`) makes correct pattern easy to apply

**Implementation:**
```css
--dark-card-heading: 0 0% 100%;  /* Pure white */
--dark-card-body: 0 0% 93%;      /* Off-white for body */
--dark-card-muted: 0 0% 75%;     /* Softer for metadata */
```

**Alternatives Considered:**
- Use `text-white` everywhere → Harsh on eyes, doesn't solve hierarchy
- Lighten dark backgrounds → Breaks design system consistency
- Add opacity inline → No enforcement, easy to forget

**Impact:**
- All dark backgrounds now have readable text
- WCAG AA compliant across site
- Design system enforces correct usage

**Files Affected:**
- `src/index.css`, `tailwind.config.ts`
- `src/pages/FAQ.tsx`, `src/pages/BlogPost.tsx`, `src/pages/Contact.tsx`, `src/pages/Blog.tsx`
- `src/components/SimpleCTA.tsx`

---

### 2026-01-XX: Builder Profile Mode Detection - Fix widgetMode Bug

**Decision:** Detect Builder Profile mode from message content patterns instead of widgetMode parameter

**Context:**
- Builder Profile was sending `widgetMode: 'tryit'` which triggered Try It Widget system prompt
- Result: Generic outputs ("Open mindset", "Willingness to learn") instead of CEO-grade profiles
- User complaint: Profiles were not specific to their answers

**Rationale:**
- System prompt takes precedence over user message content
- TRYIT_SYSTEM_PROMPT is designed for general AI decision questions, not structured JSON output
- Builder Profile needs minimal system prompt that defers to detailed user instructions

**Implementation:**
```typescript
const isBuilderProfile = mode === 'builder-profile' || 
  (messages[0]?.content?.includes('AI readiness assessment') || 
   messages[0]?.content?.includes('Builder Profile') ||
   messages[0]?.content?.includes('CEO/COO/CPO\'s AI readiness'));
```

**Token Allocation:**
- Builder Profile: 4096 tokens (for detailed CEO-grade responses)
- Try It Widget: 1024 tokens (unchanged)
- Chat: 2048 tokens (unchanged)

**Alternatives Considered:**
- Add explicit `mode: 'builder-profile'` param (requires frontend changes)
- Keep widgetMode but add special handling (confusing)
- Create separate edge function (unnecessary duplication)

**Impact:**
- Builder Profile now receives correct system prompt
- Outputs are CEO-grade, specific to user answers
- No changes to other tools (Try It Widget, Portfolio Builder)

**Files Affected:**
- `src/hooks/useAssessment.ts` (removed widgetMode)
- `supabase/functions/chat-with-krish/index.ts` (added mode detection)

---

### 2025-01-25: Switch Chatbot to Vertex AI RAG

**Decision:** Migrate `chat-with-krish` edge function to Vertex AI RAG with Gemini 2.5 Flash

**Context:**
- Original implementation used OpenAI GPT-4o-mini for all AI features
- Client has custom Vertex AI RAG corpus trained on business materials
- Need business-specific knowledge in chatbot responses

**Rationale:**
- Custom RAG corpus provides business-specific knowledge
- Gemini 2.5 Flash offers comparable performance to GPT-4o-mini
- Separation of concerns: chatbot uses custom knowledge, news uses general knowledge
- Anti-fragile design ensures UI never breaks on API failures

**Implementation Details:**
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime) to reduce auth overhead
- RAG corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`
- Fallback message provides actionable alternatives on any failure

**Alternatives Considered:**
1. Switch all AI features to Vertex AI: Rejected (news ticker doesn't need custom knowledge)
2. Keep OpenAI for everything: Rejected (client has existing investment in RAG)
3. No error fallbacks: Rejected (breaks user experience on API failures)

**Impact:**
- Frontend: Bug fixes only (response path corrections)
- Backend: Complete edge function rewrite
- UX: More relevant, business-specific responses from chatbot
- Reliability: Graceful degradation on all failure modes

---

### 2025-12-14: AI Leadership Benchmark - Self-Serve Diagnostic Lead Gen

**Decision:** Create `/leaders` page with 6-question AI readiness diagnostic

**Rationale:**
- Self-serve lead qualification reduces friction vs booking calls
- Provides immediate value (score, insights, prompts) before asking for contact
- Captures qualified leads through optional unlock form
- Builds email list with engaged prospects

**UX Decisions:**
- No toasts - all feedback inline (reduces mobile friction)
- Progress bars never regress (avoids user anxiety)
- Everything fits in viewport on mobile (no scrolling during inputs)
- Use `100dvh` for proper mobile browser chrome handling
- Collapsible unlock form (reduces perceived commitment)

**Technical Implementation:**
- `useLeadershipInsights.ts` hook manages all state and logic
- `LeadershipInsights.tsx` page with 6 diagnostic phases
- `send-leadership-insights-email` edge function for dual email delivery
- Client-side score calculation (no AI API calls for results)
- Framer Motion for smooth phase transitions

**Alternatives Considered:**
- Full AI-generated results (unnecessary API costs, latency)
- Mandatory unlock form (friction reduces completions)
- Toast notifications for status (poor mobile UX)
- Traditional contact form gate (no value before ask)

**Impact:**
- New lead generation channel with low friction
- Higher quality leads (self-qualified via assessment)
- Email list building with engaged audience
- Professional UX without distracting feedback patterns

**Files Created:**
- `src/pages/LeadershipInsights.tsx`
- `src/hooks/useLeadershipInsights.ts`
- `supabase/functions/send-leadership-insights-email/index.ts`

**Routes Added:**
- `/leaders` (primary)
- `/leadership-insights` (alias)

---

### 2025-12-01: Pause Stripe $50 Hold - Direct Calendly Booking

**Decision:** Remove $50 authorization hold requirement, enable direct Calendly booking

**Rationale:**
- Remove friction in early customer acquisition phase
- Validate demand without payment barrier
- Stripe integration remains live but dormant (easy to re-enable)
- Focus on lead quality via email intelligence instead

**Alternatives Considered:**
- Keep $50 hold (too much friction for initial validation)
- Free with no commitment (risk of no-shows, but acceptable for now)
- Lower hold amount (still friction, not solving core issue)

**Implementation Changes:**
- `InitialConsultModal`: Add conditional pricing text by program
- `ConsultationBooking`: Bypass Stripe, direct Calendly redirect
- `send-lead-email`: New function to capture + enrich lead data
- Stripe code kept commented out for future re-enablement

**Impact:**
- Lower booking friction: Expected higher conversion
- Lead enrichment via company research + session data
- Stripe integration dormant but ready to reactivate
- Risk of no-shows acceptable during validation phase

**When to Revisit:**
- After 50+ bookings to assess no-show rate
- When demand validated and can justify payment requirement
- When building client portal with payment integration

**Files Affected:**
- `src/components/InitialConsultModal.tsx`
- `src/components/ConsultationBooking.tsx`
- `supabase/functions/send-lead-email/index.ts` (new)

---

### 2025-11-25: Single Modal Entry Point for All CTAs

**Decision:** All CTAs route through `InitialConsultModal` with program selection

**Rationale:**
- Simplified user journey (one consistent experience)
- Better qualification (know user interest upfront)
- Improved tracking (program selection in metadata)
- Reduced confusion (single conversion path)

**Alternatives Considered:**
- Direct Calendly links (no qualification, no tracking)
- Separate forms per program (fragmented UX)
- Multi-step wizard (too complex for entry point)

**Impact:**
- Increased conversion tracking capability
- Better data for program recommendations
- Unified booking experience
- Easier to iterate on booking flow

**Files Affected:**
- All CTA components (Hero, ProductLadder, SimpleCTA)
- Edge function (program metadata)
- Calendly integration (custom parameters)

---

### 2025-11-24: Stripe Authorization Holds vs Charges

**Decision:** Use authorization holds ($50) instead of immediate charges

**Rationale:**
- Lower barrier to entry (fully refundable)
- Reduces perceived risk
- Professional approach (standard in consulting)
- Manual capture allows flexibility

**Alternatives Considered:**
- Free consultations (high no-show rate)
- Full payment upfront (too much friction)
- Invoicing after consult (payment delays)

**Implementation Details:**
```typescript
payment_intent_data: {
  capture_method: 'manual', // Authorization hold
}
```

**Impact:**
- Lower booking friction
- Higher trust
- Manual capture workflow (requires Stripe Dashboard access)
- Higher conversion expected

**Current Status:** PAUSED (as of 2025-12-01) - Direct Calendly booking without payment

---

### 2025-11-24: Ink + Mint Two-Color System

**Decision:** Use only two colors: Ink (#0e1a2b) + Mint (#7ef4c2)

**Rationale:**
- Simplicity = memorability
- Bold, not busy
- Fast design decisions
- Professional without being corporate

**Alternatives Considered:**
- Multi-color palette (too complex)
- Purple gradient (common in AI space)
- Blue/orange (traditional corporate)

**Color Roles:**
```
Ink:  Structure, typography, primary elements
Mint: Highlights, CTAs, accents (sparingly)
```

**Impact:**
- Faster design iteration
- Consistent brand identity
- Unique in AI consulting space
- Easy to maintain

---

### 2025-11-23: No User Authentication (Yet)

**Decision:** Defer user authentication implementation

**Rationale:**
- All bookings via Calendly (external identity)
- No user-generated content yet
- No dashboard/portal needed yet
- Simpler MVP, faster launch

**Alternatives Considered:**
- Supabase Auth immediately (premature)
- Social login (OAuth complexity)
- Magic links (extra friction)

**When to Revisit:**
- When building client portal
- When tracking session history
- When adding community features
- When user-generated content needed

**Impact:**
- Faster MVP development
- Simpler architecture
- No auth-related bugs
- Calendly handles identity/scheduling

---

### 2025-11-23: Supabase Edge Functions Over API Routes

**Decision:** Use Supabase Edge Functions (Deno) for backend

**Rationale:**
- Serverless (zero server management)
- Auto-scaling
- Integrated with Lovable Cloud
- Fast deployment (30-60 seconds)
- Global edge network

**Alternatives Considered:**
- Express API server (infrastructure overhead)
- AWS Lambda (more complex setup)
- Vercel Functions (switching platforms)

**Implementation Pattern:**
```typescript
// All functions follow template:
- CORS headers
- Error handling
- Logging
- JSON responses
```

**Impact:**
- Zero DevOps overhead
- Fast iteration
- Global performance
- Cost-effective (pay-per-use)

---

## AI and Backend Decisions

### 2026-01-XX: Fallback Quality Improvement

**Decision:** Replace hardcoded fallback templates with LLM-generated fallback

**Context:**
- Score-based fallback profiles were generic ("Curious Explorer", "Open mindset")
- User complaint: Even fallback outputs were not specific to their answers

**Implementation:**
1. First tries LLM-generated fallback with simplified CEO-grade prompt
2. If that fails, uses improved score-based fallback that references user's actual answers
3. All fallbacks now include timelines and reference specific answer choices

**Impact:**
- Even fallback profiles are CEO-grade and specific to user's answers
- No generic "Curious Explorer" templates
- Better user experience on failures

**Files Affected:**
- `src/hooks/useAssessment.ts` (lines 275-319)

---

## Product Decisions

### 2025-11-25: Holiday Urgency Messaging

**Decision:** Add "Holiday rates available through December" messaging

**Rationale:**
- 35% discount is significant value
- Creates healthy urgency (not FOMO)
- End-of-year is natural decision point
- Professional, not manipulative

**Implementation:**
```typescript
<p className="text-sm text-muted-foreground">
  Lightning bolt <span className="font-semibold">Holiday rates</span> available through December
</p>
```

**Impact:**
- Expected to increase Q4 bookings
- Clear value proposition
- Time-bound (Dec 31 deadline)

---

### 2025-11-24: $50 Hold Amount

**Decision:** Set refundable hold at $50 (not $25, $100, or free)

**Rationale:**
- High enough to reduce no-shows
- Low enough to not be barrier
- Standard in consulting industry
- Psychological commitment

**Alternatives Considered:**
- $25 (too low, high no-show risk)
- $100 (too high, friction)
- Free (no commitment signal)

**Impact:**
- Expected 70-80% reduction in no-shows
- Professional positioning
- Creates seriousness signal

**Current Status:** PAUSED - Direct booking without payment hold

---

### 2025-11-23: Start with 1:1 Programs (Not Courses)

**Decision:** Focus on live sessions (Session, Sprint, Lab) not self-serve courses

**Rationale:**
- Higher quality outcomes
- Better for ICP (senior leaders)
- Differentiation from training companies
- Allows iteration based on feedback

**Alternatives Considered:**
- Online courses (scalable but commoditized)
- Group cohorts (coordination overhead)
- Async-only (less engagement)

**When to Revisit:**
- After 50+ successful sprints
- When frameworks stabilized
- When creating partner program
- When scaling beyond 1:1

---

## Technical Decisions

### 2025-11-24: Manual Stripe Capture

**Decision:** Use manual capture for authorization holds

**Rationale:**
- Flexibility to release holds if needed
- Time to verify consultation happened
- Control over when to charge
- Standard practice for deposits

**Alternatives Considered:**
- Auto-capture after 7 days (too rigid)
- Immediate charge (defeats purpose of hold)
- Webhook automation (added complexity)

**Process:**
```
1. Hold authorized at booking
2. Consultation happens
3. If user proceeds: Capture hold + charge remaining
4. If user doesn't proceed: Release hold (refund)
```

**Impact:**
- Manual workflow (requires discipline)
- Better control over customer experience
- Requires Stripe Dashboard monitoring

**Current Status:** PAUSED - Stripe integration dormant

---

### 2025-11-23: React Router (Not Next.js)

**Decision:** Use React Router instead of Next.js

**Rationale:**
- Lovable Cloud optimized for SPA
- No SSR needed (marketing site)
- Simpler deployment
- Faster development

**Alternatives Considered:**
- Next.js (overkill for SPA)
- Gatsby (static site limitations)
- Vue/Nuxt (outside expertise)

**Impact:**
- Client-side routing
- No SEO concerns (B2B sales-driven)
- Fast iteration
- Simple deployment

---

### 2025-11-23: Calendly Integration (Not Custom Scheduler)

**Decision:** Use Calendly for scheduling, not build custom

**Rationale:**
- Calendly is industry standard
- Handles timezones, conflicts, reminders
- Email confirmations automated
- Integrates with Google Calendar
- Not core differentiation

**Alternatives Considered:**
- Build custom scheduler (reinventing wheel)
- Cal.com (less mature, similar anyway)
- Manual scheduling (doesn't scale)

**Impact:**
- Faster launch
- Professional experience
- One less thing to maintain
- Calendly subscription cost ($12-16/mo)

---

## Design Decisions

### 2026-01-08: Space Grotesk Variable for Display Typography

**Decision:** Use Space Grotesk Variable for all headings instead of Gobold

**Rationale:**
- Variable fonts offer better performance (single file, multiple weights)
- Space Grotesk is modern, distinctive yet readable
- Better font loading with variable axis support
- Pairs well with Inter Variable for body text

**Font Stack:**
```css
font-family: 'Space Grotesk Variable', 'Space Grotesk', 'Inter Variable', system-ui, sans-serif;
```

**Impact:**
- Improved typography performance
- Consistent heading hierarchy
- Modern, professional appearance

---

### 2025-11-24: Animations Sparingly

**Decision:** Use animations for scroll reveals and hover states only

**Rationale:**
- Motion can be distracting
- Prefer reduced motion (accessibility)
- Performance considerations
- Professional context

**Where Used:**
- Scroll reveals (fade-in-up)
- Hover states (scale, shadow)
- Hero effects (particle, pulse)

**Where Not Used:**
- Page transitions
- Content changes
- Form interactions
- Navigation

---

## Business Decisions

### 2025-11-23: Start with Founder-Led Sales

**Decision:** Krish personally delivers all sessions initially

**Rationale:**
- Establish quality baseline
- Gather feedback directly
- Refine frameworks through practice
- Build case studies
- No delegation until proven

**When to Scale:**
- After 50+ successful sessions
- When frameworks documented
- When ready to train others
- When demand exceeds capacity

---

**End of DECISIONS_LOG**
