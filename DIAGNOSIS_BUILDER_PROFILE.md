# Builder Profile Pipeline Diagnosis

## Problem Statement
Builder Profile changes made to `useAssessment.ts` are not appearing in deployed version. The prompt was rewritten to be CEO-grade professional, but outputs remain generic.

## Complete Pipeline Map

### 1. Frontend Flow (`src/hooks/useAssessment.ts`)

**Entry Point**: `generateProfile()` function (line 65)

**Data Flow**:
1. User answers 3 questions → stored in `answers` state
2. `answerSummary` created (lines 78-82): Formats answers as text
3. `totalScore` calculated (line 77): Sum of selected option scores
4. API call to `chat-with-krish` (line 89):
   ```typescript
   {
     messages: [{
       role: 'user',
       content: `You are Krish, founder of Mindmaker... [NEW CEO-GRADE PROMPT - 200+ lines]`
     }],
     widgetMode: 'tryit'  // ⚠️ THIS IS THE PROBLEM
   }
   ```

**Key Observation**: Frontend sends the new CEO-grade prompt in the user message content.

### 2. Edge Function Flow (`supabase/functions/chat-with-krish/index.ts`)

**Entry Point**: `serve()` handler (line 268)

**Processing Steps**:
1. Request validation (line 290): Validates `messages` array and optional `widgetMode`
2. **System Prompt Selection** (line 342):
   ```typescript
   const systemPrompt = isTryItWidget ? TRYIT_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;
   ```
   - If `widgetMode === 'tryit'` → uses `TRYIT_SYSTEM_PROMPT`
   - Otherwise → uses `CHAT_SYSTEM_PROMPT`

3. **Vertex AI Call** (line 357):
   ```typescript
   result = await vertexClient.call({
     messages: messages.map(...),  // User's message with new prompt
     systemInstruction: systemPrompt,  // ⚠️ TRYIT_SYSTEM_PROMPT (generic)
     temperature: 0.8,
     maxOutputTokens: isTryItWidget ? 1024 : 2048,
     useRag: true,
     ...
   })
   ```

**CRITICAL ISSUE IDENTIFIED**:
- Frontend sends new CEO-grade prompt in user message
- Edge function sees `widgetMode: 'tryit'` and selects `TRYIT_SYSTEM_PROMPT`
- `TRYIT_SYSTEM_PROMPT` is a generic prompt for AI decision questions (lines 112-205)
- `TRYIT_SYSTEM_PROMPT` is NOT designed for Builder Profile generation
- System instruction takes precedence over user message content
- Result: LLM uses generic Try It Widget prompt, ignores the detailed Builder Profile prompt

### 3. Response Parsing Flow (`src/hooks/useAssessment.ts`)

**After API Response** (line 215):
1. Extract `data.message` (line 215)
2. Try multiple JSON extraction strategies (lines 224-246):
   - Strategy 1: Direct JSON parse
   - Strategy 2: Extract JSON from markdown
   - Strategy 3: Find outermost braces
3. Validate parsed object (line 253):
   - Must have `type` and (`strengths` OR `nextSteps`)
4. **If parsing fails** → Fallback to score-based profile (line 270):
   - `totalScore <= 4` → "Curious Explorer" (generic)
   - `totalScore <= 7` → "Strategic Builder" (generic)
   - `totalScore > 7` → "Transformation Leader" (generic)

**Fallback Profiles** (lines 276-320):
- All are generic templates
- "Open mindset", "Willingness to learn" (exactly what user complained about)
- No reference to specific answers
- No CEO-grade insights

## Failure Points Enumerated

### Branch 1: LLM Success Path
1. ✅ Frontend sends correct prompt → **WORKS**
2. ❌ Edge function selects wrong system prompt → **FAILS HERE**
3. ❌ LLM receives conflicting instructions → **FAILS**
4. ❌ LLM generates generic response → **FAILS**
5. ✅ Response parsing works → **WORKS** (but gets wrong data)
6. ✅ UI displays result → **WORKS** (but displays wrong content)

### Branch 2: LLM Failure Path (Fallback)
1. ✅ Frontend sends correct prompt → **WORKS**
2. ❌ Edge function selects wrong system prompt → **FAILS**
3. ❌ LLM fails or returns invalid JSON → **FAILS**
4. ✅ Fallback triggered → **WORKS**
5. ❌ Fallback uses generic templates → **FAILS** (user's complaint)
6. ✅ UI displays fallback → **WORKS** (but displays wrong content)

### Branch 3: Parsing Failure Path
1. ✅ Frontend sends correct prompt → **WORKS**
2. ❌ Edge function selects wrong system prompt → **FAILS**
3. ❌ LLM returns non-JSON or malformed JSON → **FAILS**
4. ✅ All 3 parsing strategies fail → **WORKS** (correctly identifies failure)
5. ❌ Fallback to generic profiles → **FAILS**
6. ✅ UI displays fallback → **WORKS** (but displays wrong content)

## Root Cause Analysis

### Primary Root Cause
**`widgetMode: 'tryit'` causes edge function to use wrong system prompt**

The Builder Profile should NOT use `widgetMode: 'tryit'` because:
- `TRYIT_SYSTEM_PROMPT` is designed for general AI decision questions
- It's not designed for structured JSON output (Builder Profile)
- It doesn't include instructions for CEO-grade analysis
- It doesn't include the cognitive frameworks in the right format

### Secondary Issues
1. **No dedicated Builder Profile mode**: Edge function has no mode for Builder Profile
2. **Fallback profiles are generic**: Should use LLM-generated fallback, not hardcoded templates
3. **No validation of system prompt match**: Edge function doesn't check if system prompt matches user intent

## Data Flow Issues

### Missing Context
- No profile_id tracking
- No session_id tracking
- No event storage (answers not persisted)
- No insights/scores table
- No question metadata storage

### Current State
- Answers stored only in React state (lost on refresh)
- No database persistence
- No audit trail
- No way to improve prompts based on historical data

## Anti-Fragile Design Requirements

### 1. System Prompt Selection
- **Current**: Binary choice based on `widgetMode`
- **Required**: Mode detection based on message content OR explicit mode parameter
- **Solution**: Add `mode: 'builder-profile' | 'tryit' | 'chat'` parameter

### 2. Fallback Strategy
- **Current**: Hardcoded generic templates
- **Required**: LLM-generated fallback with same quality standards
- **Solution**: Call LLM with simplified prompt if primary call fails

### 3. Response Validation
- **Current**: Basic field checks
- **Required**: Quality validation (specificity, CEO-grade standards)
- **Solution**: Add quality scoring before accepting response

### 4. Data Persistence
- **Current**: No persistence
- **Required**: Store answers, responses, insights
- **Solution**: Implement profile/event/insights tables

### 5. Error Handling
- **Current**: Silent fallback
- **Required**: Logged errors with context
- **Solution**: Comprehensive logging at each failure point

## Immediate Fix Required

**Change in `src/hooks/useAssessment.ts` line 204**:
```typescript
// BEFORE (WRONG):
widgetMode: 'tryit'

// AFTER (CORRECT):
// Remove widgetMode entirely, OR
// Add new mode: 'builder-profile'
```

**Change in `supabase/functions/chat-with-krish/index.ts` line 342**:
```typescript
// BEFORE (WRONG):
const systemPrompt = isTryItWidget ? TRYIT_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;

// AFTER (CORRECT):
// Check for builder-profile mode OR detect from message content
// Use appropriate system prompt for Builder Profile
```

## Verification Checklist

After fix:
- [ ] Builder Profile calls edge function WITHOUT `widgetMode: 'tryit'`
- [ ] Edge function uses appropriate system prompt for Builder Profile
- [ ] LLM receives clear, consistent instructions
- [ ] Response is CEO-grade, not generic
- [ ] Fallback (if needed) is also CEO-grade
- [ ] All failure paths are logged
- [ ] Response quality is validated before display


