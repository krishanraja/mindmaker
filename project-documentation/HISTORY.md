# History

**Last Updated:** 2025-11-25

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

---

## Major Decisions

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

### What Changed
🔄 Initial multi-CTA approach → Single modal entry  
🔄 Direct Calendly links → Stripe-first flow  
🔄 Complex color system → Two-color simplicity  
🔄 Generic CTAs → Program-specific qualification

### What to Avoid
❌ Hardcoding colors (use tokens)  
❌ Over-engineering booking flow  
❌ Multiple entry points (confusing)  
❌ Building features before needed  
❌ Skipping mobile testing

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

---

## Metrics Evolution

### Week 1
- Landing page live
- 0 bookings (no booking flow)

### Week 2
- Booking flow live
- First consultation booked
- Chatbot conversations starting

### Week 3
- Stripe integration live
- CTA conversion improving
- Program qualification working

### Week 4 (Current)
- CTA flow redesigned
- Tracking program interests
- Holiday campaign live

---

**End of HISTORY**
