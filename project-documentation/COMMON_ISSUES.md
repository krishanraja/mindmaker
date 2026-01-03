# Common Issues

**Last Updated:** 2026-01-03

---

## Builder Profile Issues

### Issue: Builder Profile Returns Generic Output
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

**Files Affected:**
- `src/hooks/useAssessment.ts`
- `supabase/functions/chat-with-krish/index.ts`

**Prevention:** Always verify which system prompt is being used for each tool

---

### Issue: Builder Profile Fallback Is Generic
**Symptom:** On error, profile shows generic "Curious Explorer" template  
**Cause:** Hardcoded fallback templates in useAssessment.ts  
**Solution:**
1. First try LLM-generated fallback with simplified CEO-grade prompt
2. If that fails, use improved score-based fallback referencing user answers
3. All fallbacks include timelines and reference specific answers

**Prevention:** Never use hardcoded templates - always try LLM first

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

## Mobile Issues (P0)

### Issue: Mobile Hero Text Falling Off Edges
**Symptom:** Text "AI literacy for commercial leaders" cut off on left/right on mobile  
**Cause:** Combination of absolute positioning, clamp() sizing, and container width conflicts  
**Root Causes:**
1. Absolute positioning (`left-0 right-0`) ignores `max-w-5xl` constraint
2. Text width (~740px at 32px font) exceeds container width (~343px on 375px viewport)
3. `max-w-4xl` on absolutely positioned element doesn't constrain content properly
4. Missing `overflow-x: hidden` on intermediate containers

**Status:** 🔴 P0 - Documented in DIAGNOSIS.md, fix pending

**Fix Required:**
- Remove absolute positioning or constrain it properly
- Ensure width constraints propagate through container chain
- Add `overflow-x: hidden` to intermediate containers
- Adjust font size calculation for mobile

---

### Issue: Mobile Hero Text Vertical Clipping
**Symptom:** Rotating text cut off at top and bottom during animation  
**Cause:** Fixed height too small for animation movement  
**Root Causes:**
1. `height: 1.2em` = 36px but animation needs ~56px (36px + 10px up + 10px down)
2. `overflow-hidden` clips text during `y: 10` and `y: -10` animation
3. `absolute inset-0` on motion.div creates positioning conflict

**Status:** 🔴 P0 - Documented in MOBILE_HERO_OVERFLOW_DIAGNOSIS.md, fix pending

**Fix Required:**
- Increase container height to accommodate animation movement
- Adjust `overflow-hidden` to allow animation space
- Adjust animation values or container height calculation

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

## Design System Issues

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

### Issue: Text Not Readable on Background
**Symptom:** Poor contrast, hard to read  
**Cause:** Not using semantic tokens correctly  
**Solution:**
```typescript
// ❌ Wrong - low contrast
<div className="bg-mint text-white">

// ✅ Correct - high contrast
<div className="bg-mint text-ink">
```

**Prevention:** Always test contrast with WebAIM Contrast Checker

---

## ICP Cards Issues

### Issue: Missing "Who does Mindmaker help?" Heading
**Symptom:** No contextual heading above ICP slider  
**Cause:** ICPSlider called without heading  
**Solution:** Add heading above ICPSlider component

**Status:** 🟡 P1 - Fix pending

---

### Issue: Aggressive Shimmer Animation
**Symptom:** Visual overload on selected card  
**Cause:** 3 simultaneous infinite animations:
1. Background gradient position (3s infinite reverse)
2. Shimmer line sweep (2s infinite linear)
3. Box shadow pulse (2s infinite easeInOut)

**Solution:**
- Reduce to single, subtle shimmer effect
- Increase animation duration (slower = less aggressive)
- Reduce opacity/intensity of shimmer
- Consider disabling on mobile to save battery

**Status:** 🟡 P2 - Fix pending

---

### Issue: Unequal Card Heights
**Symptom:** Cards have different heights  
**Cause:** `flex-1` but no height constraint, variable content length  
**Solution:**
- Set `min-height` on card container to accommodate longest content
- OR use CSS Grid with equal row heights
- OR set fixed height and handle text overflow with ellipsis

**Status:** 🟡 P2 - Needs investigation

---

## Production Audit Issues (Fixed 2025-12-13)

### Issue: Duplicate ChatBot Component ✅ FIXED
**Symptom:** Two chat buttons appearing, inconsistent state  
**Cause:** ChatBot rendered both in App.tsx and Index.tsx  
**Solution:** Remove duplicate from Index.tsx - App.tsx renders it globally

### Issue: FAQ Items Hoisting ✅ FIXED
**Symptom:** FAQ schema not loading, possible runtime errors  
**Cause:** `faqItems` used in useEffect before being defined in component  
**Solution:** Move `faqItems` constant outside component

### Issue: Outdated SEO Dates ✅ FIXED
**Symptom:** Schema.org pricing shows as expired  
**Cause:** `priceValidUntil` dates set in the past  
**Solution:** Update dates to future (e.g., 2026-12-31)

### Issue: Missing SEO on Pages ✅ FIXED
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

---

**End of COMMON_ISSUES**
