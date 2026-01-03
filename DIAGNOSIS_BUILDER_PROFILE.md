# Builder Profile Pipeline Diagnosis

**Date:** 2026-01-03  
**Status:** ✅ Fixed - See BUILDER_PROFILE_FIXES_APPLIED.md

---

## Problem Statement

Builder Profile changes made to `useAssessment.ts` were not appearing in deployed version. The prompt was rewritten to be CEO-grade professional, but outputs remained generic ("Open mindset", "Willingness to learn").

---

## Complete Pipeline Map

### 1. Frontend Flow (`src/hooks/useAssessment.ts`)

**Entry Point**: `generateProfile()` function (line 65)

**Data Flow**:
1. User answers 3 questions → stored in `answers` state
2. `answerSummary` created (lines 78-82): Formats answers as text
3. `totalScore` calculated (line 77): Sum of selected option scores
4. API call to `chat-with-krish` (line 89)

**Bug Identified**: `widgetMode: 'tryit'` was being sent, triggering wrong system prompt.

### 2. Edge Function Flow (`supabase/functions/chat-with-krish/index.ts`)

**Entry Point**: `serve()` handler (line 268)

**Processing Steps**:
1. Request validation (line 290): Validates `messages` array and optional `widgetMode`
2. **System Prompt Selection** (line 342): Binary choice based on widgetMode

**Bug Identified**: When `widgetMode === 'tryit'`, edge function used `TRYIT_SYSTEM_PROMPT` instead of a Builder Profile appropriate prompt.

### 3. Response Parsing Flow (`src/hooks/useAssessment.ts`)

**After API Response** (line 215):
1. Extract `data.message` (line 215)
2. Try multiple JSON extraction strategies (lines 224-246)
3. Validate parsed object (line 253)
4. **If parsing fails** → Fallback to score-based profile (line 270)

**Bug Identified**: Fallback profiles were generic hardcoded templates.

---

## Root Cause Analysis

### Primary Root Cause
**`widgetMode: 'tryit'` causes edge function to use wrong system prompt**

The Builder Profile should NOT use `widgetMode: 'tryit'` because:
- `TRYIT_SYSTEM_PROMPT` is designed for general AI decision questions
- It's not designed for structured JSON output (Builder Profile)
- It doesn't include instructions for CEO-grade analysis
- System instruction takes precedence over user message content

### Secondary Issues
1. **No dedicated Builder Profile mode**: Edge function had no mode for Builder Profile
2. **Fallback profiles were generic**: Should use LLM-generated fallback, not hardcoded templates
3. **No validation of system prompt match**: Edge function didn't check if system prompt matched user intent

---

## Failure Points Enumerated

### Branch 1: LLM Success Path
1. ✅ Frontend sends correct prompt → **WORKS**
2. ❌ Edge function selects wrong system prompt → **FIXED**
3. ❌ LLM receives conflicting instructions → **FIXED**
4. ❌ LLM generates generic response → **FIXED**
5. ✅ Response parsing works → **WORKS**
6. ✅ UI displays result → **WORKS**

### Branch 2: LLM Failure Path (Fallback)
1. ✅ Frontend sends correct prompt → **WORKS**
2. ❌ Edge function selects wrong system prompt → **FIXED**
3. ❌ LLM fails or returns invalid JSON → **HANDLED**
4. ✅ Fallback triggered → **WORKS**
5. ❌ Fallback uses generic templates → **FIXED**
6. ✅ UI displays fallback → **WORKS**

---

## Fixes Applied

1. **Removed widgetMode from Builder Profile call** - Frontend no longer sends `widgetMode: 'tryit'`
2. **Added Builder Profile mode detection** - Edge function detects from message content
3. **Created minimal system prompt** - Builder Profile uses prompt that defers to user instructions
4. **Increased token allocation** - 4096 tokens for Builder Profile (was 2048)
5. **Improved fallback quality** - LLM-generated fallback instead of hardcoded templates

---

## Verification Checklist

- [x] Removed `widgetMode: 'tryit'` from Builder Profile
- [x] Added mode detection in edge function
- [ ] Tested locally (needs verification)
- [ ] Verified network request doesn't include widgetMode (needs production test)
- [ ] Builder Profile generates CEO-grade output (needs production test)
- [ ] Response references specific answers (needs production test)
- [ ] Fallback is CEO-grade, not generic (needs production test)

---

**See Also:**
- `BUILDER_PROFILE_FIXES_APPLIED.md` - Detailed fix documentation
- `ROOT_CAUSE_BUILDER_PROFILE.md` - Complete failure point enumeration
- `project-documentation/COMMON_ISSUES.md` - Full issues list
