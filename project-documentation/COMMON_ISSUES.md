# Common Issues

**Last Updated:** 2026-01-08

---

## Recently Fixed Issues

### ✅ FIXED: Hero Scrollbar Flash on Page Load (2026-01-08 - PERMANENT FIX)
**Symptom:** Horizontal scrollbar briefly appeared during first ~2 seconds of page load  
**Root Cause:** 17 contributing factors including CSS race conditions, font loading, animation overflow, and viewport units

**Previous Incomplete Fix (2026-01-06):** Only addressed CSS layer ordering - scrollbar still appeared

**Permanent Solution (2026-01-08):** Defense-in-depth architecture with 7 overlapping prevention layers:
1. HTML-level inline CSS preventing overflow before any stylesheets load
2. New `@layer hero` that loads BEFORE base layer
3. Removed all inline `<style>` tags from component
4. `hero-decoration` class on all background elements with overflow containment
5. Removed Framer Motion `y` transforms (opacity-only animations)
6. Replaced `min-h-screen` (100vh) with `min-h-[100dvh]` for mobile
7. CSS fallback for older browsers

**Files Fixed:**
- `index.html`: Critical inline overflow prevention
- `src/index.css`: `@layer hero` with comprehensive containment
- `src/components/NewHero.tsx`: Removed inline styles, added containment classes

**Prevention:** Any single layer failure won't cause scrollbar (defense-in-depth)

---

### ✅ FIXED: Side Drawer Content Cut Off (2026-01-06)
**Symptom:** "Actions" header and top content hidden behind navbar on desktop  
**Root Cause:** Sheet component used `inset-y-0` positioning from viewport edge (top: 0), while navbar is fixed at z-100 covering top 64-80px  
**Solution:**
1. Added CSS variables for navbar height: `--navbar-height`, `--navbar-height-sm`, `--navbar-height-md`
2. Created `.sheet-navbar-aware` class with responsive top offset and height calculation
3. Applied `sheet-navbar-aware` class to desktop SheetContent

**Files Fixed:**
- `src/index.css`
- `src/components/ActionsHub.tsx`

---

### ✅ FIXED: Text Contrast on Dark Backgrounds (2026-01-05)
**Symptom:** `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements  
**Root Cause:** Insufficient contrast ratio (< 4.5:1) for body text  
**Solution:**
1. Added WCAG-compliant design tokens for dark card text colors
2. Created `.dark-cta-card` component class with enforced high-contrast text
3. Added `dark-card-*` Tailwind utilities

**Files Fixed:**
- `src/index.css`
- `tailwind.config.ts`
- `src/pages/FAQ.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Blog.tsx`
- `src/components/SimpleCTA.tsx`

**Prevention:** Never use `text-white/80` on dark backgrounds. Use `.dark-cta-card` class or `text-dark-card-*` utilities.

---

### ✅ FIXED: Builder Profile Returns Generic Output
**Symptom:** Profile shows "Open mindset", "Willingness to learn" instead of CEO-grade insights  
**Cause:** `widgetMode: 'tryit'` was being sent, triggering wrong system prompt  
**Solution:**
1. Remove `widgetMode` from Builder Profile API call
2. Edge function now detects Builder Profile from message content
3. Uses minimal system prompt that defers to user instructions

**Root Cause Analysis:**
```typescript
// BEFORE (WRONG):
const { data } = await supabase.functions.invoke('chat-with-krish', {
  body: { messages, widgetMode: 'tryit' }
});

// AFTER (CORRECT):
const { data } = await supabase.functions.invoke('chat-with-krish', {
  body: { messages }  // No widgetMode
});
```

**Files Fixed:**
- `src/hooks/useAssessment.ts`
- `supabase/functions/chat-with-krish/index.ts`

**Prevention:** Always verify which system prompt is being used for each tool

---

### ✅ FIXED: Builder Profile Fallback Is Generic
**Symptom:** On error, profile shows generic "Curious Explorer" template  
**Cause:** Hardcoded fallback templates in useAssessment.ts  
**Solution:**
1. First try LLM-generated fallback with simplified CEO-grade prompt
2. If that fails, use improved score-based fallback referencing user answers
3. All fallbacks include timelines and reference specific answers

**Prevention:** Never use hardcoded templates - always try LLM first

---

## Active Issues

### Issue: Mobile Hero Text Overflow (Edge Cases Only)
**Status:** ✅ Resolved for standard viewports, monitoring edge cases  
**Symptom:** Text potentially cut off on very small mobile viewports (< 360px)  
**Cause:** Combination of absolute positioning, clamp() sizing, and container width conflicts  
**Resolution:** Current implementation works for standard mobile viewports (375px+)

**Note:** The scrollbar flash issue was PERMANENTLY fixed (2026-01-08) with defense-in-depth architecture. See DIAGNOSIS.md for full details.

---

### Issue: ICP Cards UX
**Status:** 🟡 P1 - Improvements planned  
**Symptoms:**
1. Missing "Who does Mindmaker help?" heading
2. Aggressive shimmer (3 overlapping animations)
3. Unequal card heights

**Planned Fixes:**
- Add contextual heading above ICPSlider component
- Reduce to single, subtle shimmer effect
- Set `min-height` on card containers

---

## Edge Function Issues

### Issue: GOOGLE_SERVICE_ACCOUNT_KEY Not Working
**Symptom:** AI chatbot returns fallback message, no Vertex AI response  
**Cause:** Service account key not configured or malformed JSON  
**Solution:**
1. Verify `GOOGLE_SERVICE_ACCOUNT_KEY` exists in Supabase secrets
2. Ensure value is valid JSON (not base64 encoded)
3. Check service account has Vertex AI permissions
4. Verify project ID matches: `gen-lang-client-0174430158`

**Logs to Check:**
```
"Error generating token"
"Failed to authenticate with Vertex AI"
```

**Prevention:** Test service account authentication in isolation before deploying

---

### Issue: LOVABLE_API_KEY Not Configured
**Symptom:** AI news ticker shows only fallback headlines, never real-time news  
**Cause:** `LOVABLE_API_KEY` secret not provisioned or Lovable Cloud not fully enabled  
**Solution:**
1. Verify Lovable Cloud is enabled: Settings → Cloud → Status
2. Check if `LOVABLE_API_KEY` exists: Settings → Cloud → Secrets
3. If missing, try disabling and re-enabling Lovable Cloud
4. Contact support@lovable.dev if auto-provisioning fails

**Logs to Check:**
```
"CRITICAL: LOVABLE_API_KEY not configured"
"AI features unavailable"
```

**Prevention:** Always verify all auto-provisioned secrets exist after enabling Lovable Cloud

---

### Issue: Email Send Failures (Resend)
**Symptom:** Leads not receiving confirmation, no email in inbox  
**Cause:** Resend API failure, rate limiting, or domain not verified  
**Solution:**
1. Check Resend dashboard for delivery status
2. Verify sending domain is verified (not using onboarding@resend.dev)
3. Check edge function logs for retry attempts
4. Look for "CRITICAL: Email failed after all retry attempts"

**Implementation Details:**
- send-lead-email has 3 retry attempts with exponential backoff (1s, 2s, 4s)
- Logs each attempt and final failure
- Throws error on complete failure (doesn't fail silently)

**Prevention:** 
- Use verified domain, not test domain
- Monitor Resend API quota
- Check logs for systematic failures

---

### Issue: Edge Function Not Found (404)
**Symptom:** `Failed to send request to Edge Function`  
**Cause:** Function not deployed or deployment still in progress  
**Solution:**
1. Verify function exists in `supabase/functions/[name]/index.ts`
2. Check `supabase/config.toml` includes function config
3. Wait 30-60 seconds after code push for deployment
4. Check Lovable Cloud/Supabase logs for deployment status

**Prevention:** Always wait 1 minute after pushing edge function changes

---

### Issue: Stripe Secret Key Not Available
**Symptom:** `STRIPE_SECRET_KEY is not set` error in logs  
**Cause:** Secret not configured in Lovable Cloud/Supabase  
**Solution:**
1. Go to Supabase Dashboard → Settings → Secrets
2. Add `STRIPE_SECRET_KEY` with your Stripe secret key
3. Redeploy edge functions (push any change)

**Prevention:** Always verify secrets exist before testing edge functions

---

### Issue: CORS Preflight Failure
**Symptom:** OPTIONS request returns error, followed by failed POST  
**Cause:** Missing or incorrect CORS headers  
**Solution:**
```typescript
// Always include at top of edge function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}

// Include in all responses
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
});
```

**Prevention:** Use edge function template that includes CORS boilerplate

---

## Frontend Issues

### Issue: Modal State Persists After Navigation
**Symptom:** Modal opens automatically on page load  
**Cause:** React state not cleaned up on unmount  
**Solution:**
```typescript
useEffect(() => {
  return () => {
    setModalOpen(false); // Cleanup on unmount
  };
}, []);
```

**Prevention:** Always add cleanup in useEffect for modal/overlay components

---

### Issue: Stripe Checkout Fails Silently
**Symptom:** Button click does nothing, no error shown  
**Cause:** Edge function returns error but frontend doesn't handle it  
**Solution:**
```typescript
const { data, error } = await supabase.functions.invoke('...');
console.log('Response:', { data, error }); // Always log

if (error) {
  console.error('Error:', error);
  throw error; // Propagate to catch block
}

if (!data?.url) {
  throw new Error('No checkout URL returned');
}
```

**Prevention:** Always log edge function responses during development

---

### Issue: Hardcoded Colors Break Theme
**Symptom:** Some elements don't respect theme/design system  
**Cause:** Using `bg-[#hexcode]` instead of semantic tokens  
**Solution:**
```typescript
// ❌ Wrong
<div className="bg-[#7ef4c2] text-[#0e1a2b]">

// ✅ Correct
<div className="bg-mint text-ink">
```

**Prevention:** Lint rule to catch hardcoded colors (future)

---

## Design System Issues

### Issue: Poor Text Contrast on Dark Backgrounds
**Symptom:** Text hard to read on dark ink backgrounds  
**Cause:** Using `text-white/80` which fails WCAG AA  
**Solution:**
```tsx
// ❌ NEVER DO THIS on dark backgrounds
<div className="bg-ink">
  <p className="text-white/80">Hard to read</p>
</div>

// ✅ DO THIS - Use dark-cta-card class
<div className="dark-cta-card">
  <h2>Heading is white</h2>
  <p>Body text is high-contrast off-white</p>
</div>

// ✅ OR USE - text-dark-card-* utilities
<div className="bg-ink">
  <h2 className="text-dark-card-heading">Clear heading</h2>
  <p className="text-dark-card-body">Readable body text</p>
</div>
```

**Design Tokens:**
```css
--dark-card-heading: 0 0% 100%;    /* Pure white - headings */
--dark-card-body: 0 0% 93%;        /* Off-white - body text */
--dark-card-muted: 0 0% 75%;       /* Softer white - metadata */
```

**Prevention:** Always use `.dark-cta-card` or `text-dark-card-*` utilities on dark backgrounds

---

### Issue: CSS Conflicts with Text Effects
**Symptom:** Shimmer/gradient effects don't work on text  
**Cause:** Utility classes like `text-white` block `background-clip: text`  
**Solution:**
```tsx
// ❌ Wrong - utility conflicts with animation:
<h1 className="hero-text-shimmer text-white">

// ✅ Correct - clean animation class:
<h1 className="hero-text-shimmer">
```

**Prevention:** Use dedicated CSS classes in @layer components with !important

---

### Issue: Inconsistent Spacing
**Symptom:** Spacing doesn't match other sections  
**Cause:** Not using standard spacing utilities  
**Solution:**
```typescript
// ❌ Wrong - random spacing
<div className="p-7 mb-13">

// ✅ Correct - standard scale
<div className="p-6 mb-12">
```

**Prevention:** Use spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80

---

## Build Issues

### Issue: Build Fails with TypeScript Error
**Symptom:** `npm run build` fails with type errors  
**Cause:** Missing type definitions or incorrect types  
**Solution:**
1. Check error message for specific file/line
2. Verify imports are correct
3. Check if types exist for third-party packages
4. Use `any` as last resort, add `// @ts-ignore` with comment

**Prevention:** Run `npm run build` locally before pushing

---

### Issue: Missing Dependency Error
**Symptom:** `Cannot find module` error  
**Cause:** Package installed locally but not in package.json  
**Solution:**
```bash
npm install [package-name] --save
```

**Prevention:** Always use `npm install` (not manual package.json edit)

---

## Production Audit Issues (Fixed 2025-12-13)

### ✅ FIXED: Duplicate ChatBot Component
**Symptom:** Two chat buttons appearing, inconsistent state  
**Cause:** ChatBot rendered both in App.tsx and Index.tsx  
**Solution:** Remove duplicate from Index.tsx - App.tsx renders it globally

### ✅ FIXED: FAQ Items Hoisting
**Symptom:** FAQ schema not loading, possible runtime errors  
**Cause:** `faqItems` used in useEffect before being defined in component  
**Solution:** Move `faqItems` constant outside component

### ✅ FIXED: Outdated SEO Dates
**Symptom:** Schema.org pricing shows as expired  
**Cause:** `priceValidUntil` dates set in the past  
**Solution:** Update dates to future (e.g., 2026-12-31)

### ✅ FIXED: Missing SEO on Pages
**Symptom:** Pages don't have proper meta tags in search results  
**Cause:** SEO component not added to all pages  
**Solution:** Add SEO component with title, description, canonical URL

---

## Known Limitations

### No User Authentication
**Impact:** Can't track user history, save preferences  
**Workaround:** Use Calendly for identity  
**Future:** Implement Supabase Auth when needed

### No Database Usage
**Impact:** Can't store user-generated content  
**Workaround:** All data in Calendly + Stripe  
**Future:** Add database tables as features require

### Manual Stripe Capture
**Impact:** Requires manual action to capture holds  
**Workaround:** Daily review of Stripe Dashboard  
**Future:** Automate with webhooks  
**Current Status:** Stripe integration paused

---

## Debugging Checklist

When investigating issues:

1. ✅ Check browser console for errors
2. ✅ Check network tab for failed requests
3. ✅ Check Supabase/Lovable Cloud logs for edge function errors
4. ✅ Verify environment variables are set
5. ✅ Test on mobile viewport (375px width)
6. ✅ Hard refresh to clear cache
7. ✅ Check Stripe Dashboard if payment-related
8. ✅ Verify edge functions deployed (check timestamp)
9. ✅ Test with different browsers
10. ✅ Check for TypeScript errors in build
11. ✅ Verify correct system prompt is being used (for AI features)
12. ✅ Check Vertex AI/OpenAI quota and limits
13. ✅ Verify WCAG contrast on dark backgrounds
14. ✅ Check for CSS layer/specificity conflicts

---

**End of COMMON_ISSUES**
