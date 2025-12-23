# Builder Profile Root Cause Analysis - Complete Stack

## Context: Migration from Lovable to Vercel + Supabase + Cursor

This is NOT an isolated issue. This is part of a larger migration where:
- **Frontend**: Migrated from Lovable to Vercel
- **Backend**: Migrated to Supabase Edge Functions
- **AI**: Using Vertex AI with RAG (Retrieval Augmented Generation)
- **Development**: Using Cursor instead of Lovable IDE

**Critical Question**: Are the deployed versions in sync with the codebase?

## Complete Failure Point Enumeration

### Layer 1: Frontend (Vercel)

#### Failure Point 1.1: Deployment Desync
**Risk**: Code in repo ≠ Code deployed to Vercel
**Symptoms**: Changes made but not appearing in production
**Verification Needed**:
- [ ] Check Vercel deployment logs - what commit is deployed?
- [ ] Compare deployed bundle to local code
- [ ] Verify build process includes latest changes
- [ ] Check if Vercel is using cached builds

#### Failure Point 1.2: Environment Variables
**Risk**: Missing or incorrect env vars in Vercel
**Required Vars**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
**Verification Needed**:
- [ ] Check Vercel dashboard for env vars
- [ ] Verify values match Supabase project
- [ ] Test API calls from deployed frontend

#### Failure Point 1.3: Build Cache
**Risk**: Vercel using stale build cache
**Symptoms**: Old code still running despite new commits
**Verification Needed**:
- [ ] Force rebuild in Vercel
- [ ] Clear build cache
- [ ] Verify build output matches source

### Layer 2: API Call (Frontend → Supabase)

#### Failure Point 2.1: widgetMode Parameter (IDENTIFIED)
**Status**: ❌ CONFIRMED ISSUE
**Location**: `src/hooks/useAssessment.ts:204`
**Problem**: Sends `widgetMode: 'tryit'` which triggers wrong system prompt
**Impact**: High - causes wrong LLM behavior

#### Failure Point 2.2: Request Payload Structure
**Risk**: Payload format mismatch
**Verification Needed**:
- [ ] Log actual request payload in network tab
- [ ] Compare to edge function expected format
- [ ] Check for missing/extra fields

#### Failure Point 2.3: Network Errors
**Risk**: Request fails silently or times out
**Verification Needed**:
- [ ] Check network tab for failed requests
- [ ] Verify CORS headers
- [ ] Check request/response timing

### Layer 3: Edge Function (Supabase)

#### Failure Point 3.1: Deployment Desync
**Risk**: Edge function code ≠ Deployed function
**Verification Needed**:
- [ ] Check Supabase dashboard - what version is deployed?
- [ ] Compare deployed function to repo code
- [ ] Verify function was deployed after last change

#### Failure Point 3.2: System Prompt Selection (IDENTIFIED)
**Status**: ❌ CONFIRMED ISSUE
**Location**: `supabase/functions/chat-with-krish/index.ts:342`
**Problem**: Binary choice between TRYIT_SYSTEM_PROMPT and CHAT_SYSTEM_PROMPT
**Impact**: High - Builder Profile gets wrong prompt

#### Failure Point 3.3: Environment Variables
**Risk**: Missing GEMINI_SERVICE_ACCOUNT_KEY
**Location**: `supabase/functions/chat-with-krish/index.ts:304`
**Verification Needed**:
- [ ] Check Supabase secrets dashboard
- [ ] Verify key is valid JSON
- [ ] Test token generation

#### Failure Point 3.4: Request Validation
**Risk**: Invalid requests pass validation
**Location**: `supabase/functions/chat-with-krish/index.ts:290`
**Verification Needed**:
- [ ] Test with malformed payloads
- [ ] Verify error messages are clear
- [ ] Check validation schema matches frontend

### Layer 4: Vertex AI Client

#### Failure Point 4.1: RAG Corpus Configuration
**Risk**: Wrong corpus ID or corpus missing training materials
**Location**: `supabase/functions/_shared/vertex-client.ts:422`
**Current Config**:
- `ragCorpusId: '6917529027641081856'`
**Verification Needed**:
- [ ] Verify corpus exists in Vertex AI
- [ ] Check if corpus contains Builder Profile training materials
- [ ] Verify corpus has LLM Critical Thinking Training document
- [ ] Check RAG retrieval is working (groundingMetadata)

#### Failure Point 4.2: RAG Retrieval Parameters
**Risk**: Wrong similarity threshold or top-k
**Location**: `supabase/functions/_shared/vertex-client.ts:259-260`
**Current**:
- `similarityTopK: 8`
- `vectorDistanceThreshold: 0.4`
**Verification Needed**:
- [ ] Check if RAG is retrieving relevant chunks
- [ ] Verify chunks contain Builder Profile context
- [ ] Test with different thresholds

#### Failure Point 4.3: Model Configuration
**Risk**: Wrong model or parameters
**Location**: `supabase/functions/_shared/vertex-client.ts:421`
**Current**:
- `model: 'gemini-2.5-flash'`
- `temperature: 0.8`
- `maxOutputTokens: 1024` (for tryit) or `2048` (for chat)
**Verification Needed**:
- [ ] Verify model supports RAG
- [ ] Check if temperature is appropriate for structured output
- [ ] Verify token limit is sufficient for CEO-grade responses

#### Failure Point 4.4: Token Management
**Risk**: Auth failures or expired tokens
**Location**: `supabase/functions/_shared/vertex-client.ts:143-206`
**Verification Needed**:
- [ ] Check token generation works
- [ ] Verify token caching
- [ ] Test token refresh on 401

### Layer 5: LLM Response

#### Failure Point 5.1: System Prompt Override
**Risk**: System prompt conflicts with user message
**Status**: ❌ CONFIRMED ISSUE
**Problem**: System prompt takes precedence, user's detailed prompt ignored
**Impact**: High - LLM uses generic instructions

#### Failure Point 5.2: RAG Context Not Used
**Risk**: RAG retrieves chunks but LLM doesn't use them
**Verification Needed**:
- [ ] Check groundingMetadata in response
- [ ] Verify chunks are relevant to Builder Profile
- [ ] Test if removing RAG changes output quality

#### Failure Point 5.3: Response Format
**Risk**: LLM doesn't follow JSON format instructions
**Verification Needed**:
- [ ] Check if response is valid JSON
- [ ] Verify response matches expected schema
- [ ] Test with different temperature values

#### Failure Point 5.4: Response Quality
**Risk**: LLM generates generic content despite good prompt
**Verification Needed**:
- [ ] Compare response to prompt instructions
- [ ] Check if response references specific answers
- [ ] Verify CEO-grade language is present

### Layer 6: Response Parsing (Frontend)

#### Failure Point 6.1: JSON Extraction
**Risk**: Multiple extraction strategies all fail
**Location**: `src/hooks/useAssessment.ts:224-246`
**Verification Needed**:
- [ ] Test with various response formats
- [ ] Check if extraction handles markdown
- [ ] Verify extraction handles extra text

#### Failure Point 6.2: Validation Logic
**Risk**: Valid responses rejected
**Location**: `src/hooks/useAssessment.ts:253`
**Current Validation**:
- Must have `type`
- Must have `strengths` OR `nextSteps`
**Verification Needed**:
- [ ] Test with minimal valid responses
- [ ] Check if validation is too strict
- [ ] Verify all required fields are checked

#### Failure Point 6.3: Fallback Quality (IDENTIFIED)
**Status**: ❌ CONFIRMED ISSUE
**Location**: `src/hooks/useAssessment.ts:276-320`
**Problem**: Hardcoded generic templates ("Open mindset", "Willingness to learn")
**Impact**: High - User sees generic content even on failure

### Layer 7: Data Persistence (Missing)

#### Failure Point 7.1: No Database Storage
**Risk**: Answers lost on refresh, no audit trail
**Status**: ❌ CONFIRMED ISSUE
**Impact**: Medium - Can't improve prompts based on data

#### Failure Point 7.2: No Event Tracking
**Risk**: Can't debug what went wrong
**Status**: ❌ CONFIRMED ISSUE
**Impact**: Medium - Hard to diagnose issues

#### Failure Point 7.3: No Profile/Session Tracking
**Risk**: Can't link responses to users
**Status**: ❌ CONFIRMED ISSUE
**Impact**: Low - But needed for future improvements

## Complete Failure Matrix

| Layer | Failure Point | Status | Impact | Fix Priority |
|-------|--------------|--------|--------|--------------|
| Frontend | Deployment Desync | ⚠️ UNKNOWN | High | P0 |
| Frontend | Env Vars | ⚠️ UNKNOWN | High | P0 |
| API Call | widgetMode | ❌ CONFIRMED | High | P0 |
| Edge Function | Deployment Desync | ⚠️ UNKNOWN | High | P0 |
| Edge Function | System Prompt | ❌ CONFIRMED | High | P0 |
| Edge Function | Env Vars | ⚠️ UNKNOWN | High | P0 |
| Vertex AI | RAG Corpus | ⚠️ UNKNOWN | Medium | P1 |
| Vertex AI | RAG Params | ⚠️ UNKNOWN | Medium | P1 |
| LLM | System Override | ❌ CONFIRMED | High | P0 |
| LLM | RAG Not Used | ⚠️ UNKNOWN | Medium | P1 |
| Parsing | JSON Extraction | ⚠️ UNKNOWN | Low | P2 |
| Parsing | Fallback Quality | ❌ CONFIRMED | High | P1 |
| Data | No Persistence | ❌ CONFIRMED | Medium | P2 |

## Verification Protocol

### Step 1: Verify Deployment Sync
```bash
# Check Vercel deployment
# Check Supabase edge function deployment
# Compare commit hashes
```

### Step 2: Verify Environment Variables
```bash
# Check Vercel env vars
# Check Supabase secrets
# Test API connectivity
```

### Step 3: Test End-to-End Flow
```bash
# Run Builder Profile quiz
# Capture network requests
# Check edge function logs
# Verify Vertex AI response
# Check response parsing
```

### Step 4: Verify RAG Corpus
```bash
# Check corpus exists
# Verify training materials are uploaded
# Test RAG retrieval
# Check groundingMetadata
```

## Immediate Actions Required

### P0 (Critical - Fix Now)
1. **Remove widgetMode from Builder Profile call**
2. **Verify deployments are in sync**
3. **Verify environment variables**
4. **Fix system prompt selection in edge function**

### P1 (High - Fix Soon)
1. **Improve fallback quality** (use LLM, not templates)
2. **Verify RAG corpus configuration**
3. **Add deployment verification checks**

### P2 (Medium - Fix Later)
1. **Add data persistence**
2. **Improve JSON extraction robustness**
3. **Add comprehensive logging**

## Questions to Answer Before Fixing

1. **What commit is deployed to Vercel?**
2. **What version of edge function is deployed?**
3. **Are environment variables set correctly?**
4. **Does RAG corpus contain Builder Profile training materials?**
5. **Is RAG actually retrieving relevant chunks?**
6. **What does the actual LLM response look like?** (Need logs)
7. **Is the response parsing correctly?**
8. **Are we hitting the fallback path?** (Need logs)

## Next Steps

1. **Gather Evidence**: Get production logs, network traces, deployment info
2. **Verify Deployments**: Confirm code matches deployed version
3. **Test RAG**: Verify corpus and retrieval
4. **Fix Confirmed Issues**: widgetMode, system prompt, fallback
5. **Add Monitoring**: Log all failure points
6. **Implement Anti-Fragile Design**: Per user's requirements


