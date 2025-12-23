# Builder Profile Fixes Applied

## Date: 2025-01-XX

## Summary

Fixed the Builder Profile pipeline to address the root cause: `widgetMode: 'tryit'` was causing the edge function to use the wrong system prompt, resulting in generic outputs instead of CEO-grade professional profiles.

## Changes Applied

### 1. Frontend Fix: Removed widgetMode from Builder Profile Call
**File**: `src/hooks/useAssessment.ts:204`
- **Before**: Sent `widgetMode: 'tryit'` which triggered wrong system prompt
- **After**: Removed `widgetMode`, edge function detects Builder Profile from message content
- **Impact**: Builder Profile now gets appropriate system prompt

### 2. Edge Function Fix: Added Builder Profile Mode Detection
**File**: `supabase/functions/chat-with-krish/index.ts`
- **Added**: `mode` parameter to request schema (`'builder-profile' | 'tryit' | 'chat'`)
- **Added**: Builder Profile detection from message content or explicit mode param
- **Added**: Minimal system prompt for Builder Profile that defers to user's detailed instructions
- **Updated**: `maxOutputTokens` increased to 4096 for Builder Profile (was 2048)
- **Impact**: Builder Profile gets correct system prompt and sufficient token budget

### 3. Fallback Quality Improvement
**File**: `src/hooks/useAssessment.ts:275-319`
- **Before**: Hardcoded generic templates ("Curious Explorer", "Open mindset", "Willingness to learn")
- **After**: 
  1. First tries LLM-generated fallback with simplified CEO-grade prompt
  2. If that fails, uses improved score-based fallback that references user's actual answers
  3. All fallbacks now include timelines and reference specific answer choices
- **Impact**: Even fallback profiles are CEO-grade and specific to user's answers

## Technical Details

### Builder Profile Detection Logic
```typescript
const isBuilderProfile = mode === 'builder-profile' || 
  (messages[0]?.content?.includes('AI readiness assessment') || 
   messages[0]?.content?.includes('Builder Profile') ||
   messages[0]?.content?.includes('CEO/COO/CPO\'s AI readiness'));
```

### System Prompt Selection
- **Builder Profile**: Minimal prompt that defers to user's detailed instructions
- **Try It Widget**: `TRYIT_SYSTEM_PROMPT` (unchanged)
- **Chat**: `CHAT_SYSTEM_PROMPT` (unchanged)

### Token Allocation
- **Builder Profile**: 4096 tokens (for detailed CEO-grade responses)
- **Try It Widget**: 1024 tokens (unchanged)
- **Chat**: 2048 tokens (unchanged)

## Verification Required (Phase 0)

### CP0.1: Deployment Sync
- [ ] Check Vercel dashboard: What commit is deployed?
- [ ] Check Supabase dashboard: What version of edge function is deployed?
- [ ] Compare deployed code to repo
- [ ] Verify no cached builds

### CP0.2: Environment Variables
- [ ] Vercel has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Supabase has `GEMINI_SERVICE_ACCOUNT_KEY` secret
- [ ] Test API connectivity from deployed frontend

### CP0.3: RAG Corpus
- [ ] Corpus ID `6917529027641081856` exists in Vertex AI
- [ ] Corpus contains LLM Critical Thinking Training document
- [ ] Corpus contains Executive Summary document
- [ ] RAG retrieval is working (check groundingMetadata in responses)

### CP0.4: Production Evidence
- [ ] Capture network request payload from production
- [ ] Check edge function logs for system prompt selection
- [ ] Verify Builder Profile mode is detected correctly
- [ ] Check Vertex AI response quality

## Testing Checklist

### CP2: widgetMode Fix Applied
- [x] Removed `widgetMode: 'tryit'` from Builder Profile
- [x] Added mode detection in edge function
- [ ] Tested locally (needs verification)
- [ ] Verified network request doesn't include widgetMode (needs production test)

### CP3: System Prompt Fix Applied
- [x] Builder Profile mode detection added
- [x] Appropriate system prompt selected
- [ ] Tested with sample request (needs verification)
- [ ] Verified logs show correct prompt (needs production test)

### CP4: End-to-End Test
- [ ] Builder Profile generates CEO-grade output
- [ ] Response references specific answers
- [ ] No generic "Open mindset" language
- [ ] Framework explanation is sophisticated

### CP5: Fallback Quality Test
- [ ] Fallback triggered (simulate error)
- [ ] Fallback is CEO-grade, not generic
- [ ] Fallback references user answers
- [ ] No "Curious Explorer" templates

## Next Steps

1. **Deploy to Production**
   - Deploy frontend changes to Vercel
   - Deploy edge function changes to Supabase
   - Verify deployments are in sync

2. **Test in Production**
   - Run Builder Profile quiz
   - Verify CEO-grade output
   - Check edge function logs
   - Verify RAG is working

3. **Monitor**
   - Check for errors in logs
   - Verify response quality
   - Confirm no regressions in other tools

## Risk Mitigation

- **Backward Compatibility**: Other tools (Try It Widget, Portfolio Builder) still use `widgetMode: 'tryit'` and are unaffected
- **Fallback Safety**: Multiple fallback layers ensure UI never breaks
- **Logging**: Comprehensive logging added to diagnose issues

## Files Modified

1. `src/hooks/useAssessment.ts` - Removed widgetMode, improved fallback
2. `supabase/functions/chat-with-krish/index.ts` - Added Builder Profile detection, improved system prompt selection

## Known Limitations

- RAG corpus verification still needed (CP0.3)
- Production testing still needed (CP4, CP5)
- Data persistence not yet implemented (Phase 2)


