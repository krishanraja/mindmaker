# Common Issues

**Last Updated:** 2025-11-25

---

## Edge Function Issues

### Issue: Edge Function Not Found (404)
**Symptom:** `Failed to send request to Edge Function`  
**Cause:** Function not deployed or deployment still in progress  
**Solution:**
1. Verify function exists in `supabase/functions/[name]/index.ts`
2. Check `supabase/config.toml` includes function config
3. Wait 30-60 seconds after code push for deployment
4. Check Lovable Cloud logs for deployment status

**Prevention:** Always wait 1 minute after pushing edge function changes

---

### Issue: Stripe Secret Key Not Available
**Symptom:** `STRIPE_SECRET_KEY is not set` error in logs  
**Cause:** Secret not configured in Lovable Cloud  
**Solution:**
1. Go to Lovable Cloud → Settings → Secrets
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

## Mobile Issues

### Issue: Touch Targets Too Small
**Symptom:** Hard to tap buttons on mobile  
**Cause:** Buttons smaller than 44px × 44px  
**Solution:**
```typescript
// ❌ Wrong - too small
<button className="px-2 py-1">

// ✅ Correct - adequate touch target
<button className="touch-target px-6 py-3">
```

**Prevention:** Always use `touch-target` class for mobile buttons

---

### Issue: Horizontal Scroll on Mobile
**Symptom:** Page scrolls horizontally  
**Cause:** Fixed width element wider than viewport  
**Solution:**
```typescript
// ❌ Wrong - fixed width
<div className="w-[1200px]">

// ✅ Correct - responsive width
<div className="max-w-7xl mx-auto px-4">
```

**Prevention:** Always test on mobile viewport (375px width)

---

## Stripe Issues

### Issue: Hold Not Captured
**Symptom:** Payment authorized but not captured  
**Cause:** Manual capture requires action in Stripe Dashboard  
**Solution:**
1. Go to Stripe Dashboard → Payments
2. Find payment with "Uncaptured" status
3. Click payment → Capture
4. Or set up webhook to auto-capture (future)

**Prevention:** Document capture process, consider automation

---

### Issue: Refund Process Unclear
**Symptom:** User requests refund, process unknown  
**Cause:** No documented refund workflow  
**Solution:**
1. Stripe Dashboard → Payments
2. Find payment → Refund
3. Enter amount (full or partial)
4. Add reason
5. Email user confirmation

**Prevention:** Document in operations manual

---

## Calendly Integration Issues

### Issue: Pre-fill Data Not Working
**Symptom:** Calendly doesn't show name/email  
**Cause:** URL parameters not correctly formatted  
**Solution:**
```typescript
// ✅ Correct format
const url = `https://calendly.com/.../meeting?` +
  `prefill_email=${encodeURIComponent(email)}&` +
  `prefill_name=${encodeURIComponent(name)}`;
```

**Prevention:** Always use `encodeURIComponent()` for URL params

---

## Deployment Issues

### Issue: Changes Not Visible After Deploy
**Symptom:** Code pushed but old version still showing  
**Cause:** Browser cache or deployment not complete  
**Solution:**
1. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. Check deployment timestamp in Lovable
3. Wait 2-3 minutes for CDN propagation
4. Clear browser cache if needed

**Prevention:** Use unique query params for testing (`?v=123`)

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

---

## Debugging Checklist

When investigating issues:

1. ✅ Check browser console for errors
2. ✅ Check network tab for failed requests
3. ✅ Check Lovable Cloud logs for edge function errors
4. ✅ Verify environment variables are set
5. ✅ Test on mobile viewport
6. ✅ Hard refresh to clear cache
7. ✅ Check Stripe Dashboard if payment-related
8. ✅ Verify edge functions deployed (check timestamp)
9. ✅ Test with different browsers
10. ✅ Check for TypeScript errors in build

---

**End of COMMON_ISSUES**
