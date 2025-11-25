# Decisions Log

**Last Updated:** 2025-11-25

---

## Architecture Decisions

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

## AI & Backend Decisions

### Decision: Switch Chatbot to Vertex AI RAG (2025-01-25)

**Context:** Original implementation used OpenAI GPT-4o-mini for all AI features. Client has custom Vertex AI RAG corpus trained on business materials.

**Decision:** 
- Migrate `chat-with-krish` edge function to Vertex AI RAG with Gemini 2.5 Flash
- Keep news ticker (`get-ai-news`, `get-market-sentiment`) on OpenAI
- Implement anti-fragile error handling with graceful fallbacks

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
1. Switch all AI features to Vertex AI → Rejected (news ticker doesn't need custom knowledge)
2. Keep OpenAI for everything → Rejected (client has existing investment in RAG)
3. No error fallbacks → Rejected (breaks user experience on API failures)

**Impact:**
- Frontend: Bug fixes only (response path corrections)
- Backend: Complete edge function rewrite
- UX: More relevant, business-specific responses from chatbot
- Reliability: Graceful degradation on all failure modes

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
  ⚡ <span className="font-semibold">Holiday rates</span> available through December
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

### 2025-11-24: Gobold Font for Headlines Only
**Decision:** Use Gobold for hero headlines only, Inter for everything else  
**Rationale:**
- Gobold is distinctive but not readable at small sizes
- Inter is professional, readable
- Clear hierarchy (display vs body)
- Performance (minimal custom font usage)

**Alternatives Considered:**
- Gobold everywhere (poor readability)
- Inter everywhere (less distinctive)
- Multiple fonts (inconsistent)

**Usage Rules:**
```
Gobold: Hero h1 only
Inter:  Everything else (h2-h6, body, UI)
```

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
