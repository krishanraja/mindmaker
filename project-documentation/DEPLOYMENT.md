# Deployment Checklist

This document outlines the pre-deploy and post-deploy verification steps for the Mindmaker project.

---

## Pre-Deploy Checklist

Run these checks before every deployment:

### 1. Build & Type Checks
- [ ] `npm run build` passes with no errors
- [ ] TypeScript compilation succeeds with no type errors
- [ ] ESLint passes with no warnings/errors

### 2. Environment Variables
- [ ] All required secrets are configured in Lovable Cloud:
  - `GOOGLE_SERVICE_ACCOUNT_KEY` (Vertex AI RAG)
  - `NEWSAPI_KEY` (AI news ticker)
  - `RESEND_API_KEY` (lead emails)
  - `OPENAI_API_KEY` (lead enrichment)
  - `LOVABLE_API_KEY` (AI gateway fallback)

### 3. Edge Functions
- [ ] All edge functions have CORS headers configured
- [ ] All edge functions handle OPTIONS preflight requests
- [ ] All edge functions return 200 on error with fallback data (anti-fragile design)
- [ ] Logging is present for all key branches

### 4. Database (if applicable)
- [ ] Migrations have been applied
- [ ] RLS policies are in place for all tables
- [ ] No breaking schema changes without migration

### 5. Frontend
- [ ] All routes are accessible
- [ ] Mobile responsive layouts verified
- [ ] No console errors on page load
- [ ] All external links working

---

## Post-Deploy Checklist

Run these checks after every deployment:

### 1. Health Check
- [ ] Homepage loads without errors
- [ ] Navigation works (all links functional)
- [ ] Chatbot responds to messages
- [ ] AI news ticker displays headlines

### 2. Regression Check
- [ ] Builder Assessment completes successfully
- [ ] Friction Map generates output
- [ ] Portfolio Builder calculates savings
- [ ] Try It Widget receives AI responses
- [ ] Calendly booking modal opens

### 3. Edge Function Verification
- [ ] `chat-with-krish`: Send test message, verify response
- [ ] `get-ai-news`: Check network tab for successful fetch
- [ ] `send-lead-email`: (test environment only) Submit test lead

### 4. Log Scan
- [ ] Check Lovable Cloud logs for any errors
- [ ] Verify no 500 errors in edge function logs
- [ ] Check for rate limiting issues

### 5. Performance
- [ ] Page load under 3s on desktop
- [ ] No layout shift during scroll
- [ ] Animations smooth (60fps)

---

## Rollback Procedure

If critical issues are found post-deploy:

1. **Identify the issue** via logs and console
2. **Revert to previous commit** in Lovable
3. **Verify rollback** by running post-deploy checklist
4. **Document the issue** in COMMON_ISSUES.md

---

## Deployment Schedule

- **Preview deployments**: Automatic on every code change
- **Production**: Manual review after preview verification

---

## Contact

For deployment issues, check:
- `project-documentation/COMMON_ISSUES.md`
- `project-documentation/ARCHITECTURE.md`
- Edge function logs in Lovable Cloud
