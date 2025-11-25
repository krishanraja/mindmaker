# Replication Guide

**Last Updated:** 2025-11-25

---

## Overview

This guide provides step-by-step instructions to replicate the Mindmaker platform from scratch. Follow these steps in order for a complete working build.

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Lovable account (lovable.dev)
- Stripe account (stripe.com)
- Calendly account (calendly.com)

**Time to Complete:** 2-3 hours

---

## Phase 1: Environment Setup (15 min)

### Step 1: Create Lovable Project
```bash
1. Go to lovable.dev
2. Click "New Project"
3. Name: "mindmaker" (or your choice)
4. Click "Create"
```

### Step 2: Enable Lovable Cloud
```bash
1. In Lovable, click "Cloud" tab
2. Click "Enable Cloud"
3. Wait for Supabase project provisioning (2-3 min)
4. Note: project_id in supabase/config.toml
```

### Step 3: Connect GitHub (Optional but Recommended)
```bash
1. Click "GitHub" button in Lovable
2. Authorize Lovable GitHub App
3. Select account/org
4. Click "Create Repository"
5. Repository created with bidirectional sync
```

---

## Phase 2: Base Configuration (30 min)

### Step 4: Install Dependencies
```bash
# Lovable auto-installs these, but for reference:
npm install react@18.3.1 react-dom@18.3.1
npm install @tanstack/react-query@5.83.0
npm install react-router-dom@6.30.1
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install framer-motion@12.23.24
npm install lucide-react@0.462.0
npm install tailwindcss@3.4.1 tailwindcss-animate@1.0.7
npm install class-variance-authority@0.7.1 clsx@2.1.1 tailwind-merge@2.6.0
npm install @supabase/supabase-js@2.57.4
npm install zod@3.25.76 react-hook-form@7.61.1
npm install sonner@1.7.4
```

### Step 5: Configure Tailwind
**File:** `tailwind.config.ts`
```typescript
// Copy from project-documentation/DESIGN_SYSTEM.md
// Or use existing tailwind.config.ts from repo
```

### Step 6: Set Up Design System
**File:** `src/index.css`
```css
// Copy complete design tokens from repo
// Or follow DESIGN_SYSTEM.md
```

---

## Phase 3: Core Components (45 min)

### Step 7: Create Shadcn UI Components
```bash
# Lovable has these pre-installed, but for reference:
# Copy all files from src/components/ui/
- button.tsx
- dialog.tsx
- input.tsx
- label.tsx
- card.tsx
- radio-group.tsx
- toast.tsx
- etc.
```

### Step 8: Create Layout Components
**Files to create:**
```
src/components/Navigation.tsx
src/components/Footer.tsx
src/components/InitialConsultModal.tsx
src/components/ConsultationBooking.tsx
```

**Copy from repo or build following:**
- Navigation: Sticky header, logo, nav links, mobile menu
- Footer: Links, social, legal
- InitialConsultModal: Program selection, name/email form
- ConsultationBooking: Alternative booking form

### Step 9: Create Page Components
**Files to create:**
```
src/pages/Index.tsx              # Landing page
src/pages/BuilderSession.tsx
src/pages/BuilderSprint.tsx
src/pages/LeadershipLab.tsx
src/pages/PartnerProgram.tsx
src/pages/Privacy.tsx
src/pages/Terms.tsx
src/pages/FAQ.tsx
src/pages/NotFound.tsx
```

---

## Phase 4: Edge Functions (30 min)

### Step 10: Create Consultation Hold Function
**File:** `supabase/functions/create-consultation-hold/index.ts`
```typescript
// Copy complete function from repo
// Key elements:
- Stripe SDK import
- CORS headers
- Authorization hold creation
- Calendly redirect URL
- Error handling
```

### Step 11: Create Chatbot Function
**File:** `supabase/functions/chat-with-krish/index.ts`
```typescript
// Copy from repo
// Key elements:
- OpenAI SDK import
- Conversation context handling
- Streaming responses
- Error handling
```

### Step 12: Configure Functions
**File:** `supabase/config.toml`
```toml
project_id = "your-project-id"

[functions.create-consultation-hold]
verify_jwt = false

[functions.chat-with-krish]
verify_jwt = false
```

---

## Phase 5: Integrations (30 min)

### Step 13: Set Up Stripe
```bash
1. Go to stripe.com → Dashboard
2. Get your Secret Key:
   - Developers → API Keys
   - Copy "Secret key" (starts with sk_test_...)
   
3. In Lovable:
   - Cloud → Settings → Secrets
   - Add secret: STRIPE_SECRET_KEY
   - Paste your Stripe secret key
   - Save
```

### Step 14: Configure Stripe Products (Optional)
```bash
# For testing authorization holds:
1. No specific products needed
2. Edge function creates price_data dynamically
3. For production, consider creating products in Stripe Dashboard
```

### Step 15: Set Up Calendly
```bash
1. Go to calendly.com
2. Create event type:
   - Name: "Mindmaker Initial Consult"
   - Duration: 45 minutes
   - Add custom questions:
     * Program Interest
     * How did you hear about us?
   
3. Get your scheduling URL:
   - Example: https://calendly.com/your-name/mindmaker-meeting
   
4. Update in edge function:
   - supabase/functions/create-consultation-hold/index.ts
   - Line ~47: success_url with your Calendly URL
```

### Step 16: Set Up OpenAI (For Chatbot)
```bash
1. Go to platform.openai.com
2. Create API key
3. In Lovable:
   - Cloud → Settings → Secrets
   - Add secret: OPENAI_API_KEY
   - Paste your OpenAI key
   - Save
```

---

## Phase 6: Assets & Content (15 min)

### Step 17: Add Images
```bash
# Copy these files to public/:
public/mindmaker-background.gif
public/mindmaker-background-green.gif
public/mindmaker-favicon.png
public/fonts/Gobold_Bold.otf

# Copy these files to src/assets/:
src/assets/krish-headshot.png
src/assets/mindmaker-icon-dark.png
src/assets/mindmaker-icon-light.png
src/assets/mindmaker-logo-new.png
```

### Step 18: Update Content
**Files to customize:**
```
src/pages/Index.tsx          # Hero headline, CTAs
src/pages/BuilderSession.tsx # Session description
src/pages/BuilderSprint.tsx  # Sprint details
src/components/SimpleCTA.tsx # Founder quote
```

---

## Phase 7: Testing (20 min)

### Step 19: Test Locally
```bash
# In Lovable, preview should auto-update
# Test these flows:

1. Homepage loads
2. Navigation works
3. CTAs open modal
4. Modal form validates
5. Stripe checkout redirects (use test mode)
6. Calendly pre-fills data
7. Chatbot responds
8. Mobile view works
```

### Step 20: Test Edge Functions
```bash
# Check Lovable Cloud logs:
1. Cloud → Logs
2. Trigger booking flow
3. Verify function logs:
   - "Function invoked"
   - "Request body: ..."
   - "Checkout session created"
4. Check for errors
```

### Step 21: Test Stripe Integration
```bash
# Use Stripe test cards:
1. Open booking modal
2. Fill form
3. Click "Reserve My Spot"
4. On Stripe Checkout:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete payment
6. Verify redirect to Calendly
7. Check Stripe Dashboard:
   - Payment appears as "Uncaptured"
```

---

## Phase 8: Deployment (10 min)

### Step 22: Deploy Frontend
```bash
# In Lovable:
1. Click "Publish" button (top right)
2. Review changes
3. Click "Update" to deploy
4. Wait 2-3 minutes for CDN propagation
5. Test live URL
```

### Step 23: Verify Edge Functions
```bash
# Edge functions auto-deploy on code push
1. Check deployment timestamp
2. Test on live URL
3. Check logs for any errors
4. Verify Stripe integration on live site
```

### Step 24: Final Smoke Tests
```bash
Test on production URL:
1. ✓ Homepage loads
2. ✓ Navigation works
3. ✓ Modal opens
4. ✓ Stripe checkout works
5. ✓ Calendly redirect works
6. ✓ Chatbot responds
7. ✓ Mobile works
8. ✓ All pages accessible
```

---

## Phase 9: Documentation (5 min)

### Step 25: Copy Documentation
```bash
# Copy entire project-documentation/ folder
# Customize for your project:
1. Update PURPOSE.md with your mission
2. Update ICP.md with your target users
3. Update VALUE_PROP.md with your positioning
4. Keep technical docs (ARCHITECTURE, DESIGN_SYSTEM, etc.)
```

---

## Post-Launch Checklist

### Required for Production
- [ ] Custom domain connected
- [ ] SSL certificate verified
- [ ] Analytics installed (Google Analytics, Plausible, etc.)
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Stripe live keys configured
- [ ] Legal pages reviewed
- [ ] Privacy policy compliant (GDPR, CCPA)
- [ ] Terms of service reviewed
- [ ] Backup strategy in place

### Recommended
- [ ] Set up monitoring (uptime, performance)
- [ ] Configure email notifications (booking confirmations)
- [ ] Set up CRM integration (for lead tracking)
- [ ] Create operations runbook
- [ ] Document refund process
- [ ] Train team on Stripe Dashboard
- [ ] Set up customer support system

---

## Common Issues During Replication

### Issue: Edge Functions Not Found
**Solution:** Wait 60 seconds after pushing code, then refresh

### Issue: Stripe Key Not Working
**Solution:** Verify key starts with `sk_test_` or `sk_live_` and is copied completely

### Issue: CORS Errors
**Solution:** Verify CORS headers in edge functions, check OPTIONS handling

### Issue: Modal Not Opening
**Solution:** Check browser console for React errors, verify component imports

### Issue: Styles Not Applying
**Solution:** Verify Tailwind config includes all paths, check for CSS conflicts

---

## Verification Checklist

After completing all steps, verify:

- [ ] All pages load without errors
- [ ] Navigation works on all pages
- [ ] CTAs open modal correctly
- [ ] Modal form validates properly
- [ ] Stripe checkout redirects correctly
- [ ] Calendly pre-fills user data
- [ ] Chatbot responds to messages
- [ ] Mobile view works (test 375px width)
- [ ] All images load
- [ ] Fonts load correctly
- [ ] Design tokens applied consistently
- [ ] Edge functions respond correctly
- [ ] Stripe integration works end-to-end
- [ ] Legal pages accessible
- [ ] 404 page works

---

## Next Steps After Replication

1. **Customize Content:** Replace placeholder text with your content
2. **Add Analytics:** Install tracking to measure conversions
3. **Set Up Monitoring:** Track uptime and errors
4. **Create Operations Docs:** Document booking process, refund process
5. **Train Team:** If applicable, train on Stripe Dashboard, Calendly
6. **Launch Marketing:** Drive traffic to site
7. **Iterate Based on Feedback:** Continuously improve based on user behavior

---

## Support Resources

- **Lovable Docs:** https://docs.lovable.dev
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **TailwindCSS Docs:** https://tailwindcss.com/docs
- **React Docs:** https://react.dev

---

**End of REPLICATION_GUIDE**
