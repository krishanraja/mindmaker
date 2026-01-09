# Deploy Edge Function Fix

The edge function has been fixed to handle undefined values properly. You need to deploy it to Supabase for the fixes to take effect.

## Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref bkyuxvschuwngtcdhsyg

# Deploy the edge function
supabase functions deploy send-lead-email
```

## Option 2: Using Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/bkyuxvschuwngtcdhsyg
2. Navigate to Edge Functions
3. Find `send-lead-email`
4. Click "Deploy" or "Update"
5. Upload the contents of `supabase/functions/send-lead-email/index.ts`

## What Was Fixed

- `escapeHtml` function now handles `undefined` and `null` values safely
- `sessionTypeLabel` is now guaranteed to never be undefined
- `name.split()` is now safely handled with null checks
- LinkedIn search URL encoding is now safe with null checks

## After Deployment

Once deployed, run the test script again:

```bash
SUPABASE_URL=https://bkyuxvschuwngtcdhsyg.supabase.co SUPABASE_ANON_KEY=your-key node scripts/send-test-emails-node.js
```

All 16 emails should now send successfully.
