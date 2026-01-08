# SCROLL HIJACK DIAGNOSIS

**Date:** 2026-01-08
**Status:** IN PROGRESS - Defense-in-Depth Rebuild
**Related:** DIAGNOSIS.md, ROOT_CAUSE.md, CHANGELOG.md

---

## Executive Summary

The ChaosToClarity scroll hijack animation has been unreliable since implementation. Users can bypass it by scrolling fast enough. This document captures all 31 identified root causes and the architectural solution.

---

## Design Decisions (Clarified)

### 1. Skip Behavior
**Decision:** Option (b) - Fast-forward smoothly to completion when escape velocity detected

**Rationale:**
- Forcing slow scroll (option a) frustrates users who've seen the animation before
- Allowing full escape (option c) breaks the narrative flow
- Graceful fast-forward respects user intent while preserving story integrity

### 2. BeforeAfterSplit Section
**Decision:** Apply same defense-in-depth fix to both scroll hijack sections

**Rationale:**
- Consistency in behavior across the page
- Shared hook means shared vulnerabilities
- Users expect similar interactions to behave similarly

### 3. Mobile Priority
**Decision:** Mobile-first with iOS Safari momentum as primary concern

**Rationale:**
- Mobile Safari momentum scrolling is most problematic
- Desktop users have more control (mouse wheel vs finger swipe)
- Mobile is primary consumption device for executives

### 4. Performance Budget
**Decision:** Accept additional event listeners and IntersectionObservers

**Rationale:**
- Reliability > micro-optimization
- Modern browsers handle these efficiently
- Single IntersectionObserver per section is negligible cost

---

## Architecture Map

```
Index.tsx
  └── ChaosToClarity.tsx (id="problem")
      ├── useScrollLock hook
      │   ├── handleWheel (passive: false)
      │   ├── handleTouchStart (passive: true)
      │   ├── handleTouchMove (passive: false)
      │   └── handleScroll (passive: true) ← DETECTION
      ├── titleRef (trigger element)
      ├── sectionRef (scroll lock target)
      ├── containerRef (animation container)
      └── progressRef (0-1 animation state)
  
  └── BeforeAfterSplit.tsx (same useScrollLock hook)
```

---

## Root Causes: 31 Total

### CATEGORY A: Scroll Detection Race Conditions (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| A1 | Throttled detection (16ms) | useScrollLock.ts:114-116 | Fast scroll bypasses trigger |
| A2 | Single-point trigger (~20px window) | useScrollLock.ts:128-131 | Window can be skipped |
| A3 | No anticipatory locking | Missing | Purely reactive system |

### CATEGORY B: Browser Momentum/Inertia (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| B1 | iOS Safari momentum not cancelled | Native browser | Momentum continues after lock |
| B2 | Missing touch-action CSS | index.css:289-292 | No native touch prevention |
| B3 | scroll-behavior: smooth conflict | index.css:277 | Interferes with instant snap |

### CATEGORY C: Event Handling Gaps (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| C1 | Keyboard navigation not blocked | Missing | Arrow/Page keys bypass lock |
| C2 | Programmatic scroll not blocked | Missing | scrollIntoView bypasses |
| C3 | History navigation not handled | Missing | Back/Forward bypass |

### CATEGORY D: Position Maintenance Failures (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| D1 | RAF correction too late | useScrollLock.ts:160-175 | Visual jump before correction |
| D2 | Velocity threshold too lenient | useScrollLock.ts:169 | Accumulated drift escape |
| D3 | scrollTo 'auto' delays | useScrollLock.ts:173 | Browser-specific timing |

### CATEGORY E: State Management Race Conditions (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| E1 | isLocked state stale | useScrollLock.ts:17 | React async lag |
| E2 | Cooldown vulnerability | useScrollLock.ts:200 | 300ms re-lock prevention |
| E3 | isComplete timing | ChaosToClarity.tsx:302 | Premature release |

### CATEGORY F: Component Conflicts (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| F1 | BeforeAfterSplit same hook | BeforeAfterSplit.tsx:91-98 | Two sections compete |
| F2 | useScrollDirection conflicts | useScrollDirection.ts:38-41 | Nav visibility races |
| F3 | No mutual exclusion | Missing | Unpredictable behavior |

### CATEGORY G: CSS/Layout Issues (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| G1 | Concept labels overflow | ChaosToClarity.tsx:108-113 | Labels cut off right edge |
| G2 | overflow:hidden wrong container | Section vs canvas | 90%+ positions overflow |
| G3 | max-width edge cases | ChaosToClarity.tsx:461 | Specific viewport issues |

### CATEGORY H: Alternative Input Methods (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| H1 | No pointer device handling | Missing | Device-specific deltas |
| H2 | Trackpad gesture differences | Missing | Different event patterns |
| H3 | Touch inertia pre-calculated | useScrollLock.ts:87-91 | preventDefault too late |

### CATEGORY I: Missing Architectural Patterns (4)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| I1 | No sentinel element | Missing | No anticipatory detection |
| I2 | IntersectionObserver not used | Missing | Unreliable scroll detection |
| I3 | No progress capping | Missing | Choppy/skipped animation |
| I4 | No escape velocity detection | Missing | No graceful fast-forward |

### CATEGORY J: Testing/Edge Cases (3)

| ID | Cause | Location | Impact |
|----|-------|----------|--------|
| J1 | Mobile keyboard resize | Mobile browsers | Unexpected scroll events |
| J2 | DevTools layout shift | Development | Inconsistent testing |
| J3 | Pinch-to-zoom | Touch devices | Different trigger points |

---

## Defense-in-Depth Solution: 8 Layers

### Layer 1: HTML-Level CSS
- Critical inline CSS in index.html
- Loads BEFORE any React/JS
- Sets up containment immediately

### Layer 2: CSS Layer Priority
- New `@layer scroll-hijack` in index.css
- Higher priority than base layer
- touch-action, overflow, overscroll rules

### Layer 3: IntersectionObserver Detection
- Replace scroll event detection entirely
- Use rootMargin for anticipatory trigger
- More reliable than getBoundingClientRect

### Layer 4: Sentinel Element
- Invisible element 100px ABOVE target section
- Triggers lock preparation before section reaches viewport
- Allows time for momentum calculation

### Layer 5: Multi-Event Blocking
- wheel: preventDefault, stopPropagation
- touchmove: preventDefault, stopPropagation
- keydown: Block Arrow, Page, Space, Home, End
- popstate: Handle history navigation

### Layer 6: Instant Position Lock
- body position: fixed during lock
- Capture and restore scroll position
- No drift possible with fixed body

### Layer 7: Animation Progress Smoothing
- Velocity-based progress capping
- Maximum delta per frame
- Smooth interpolation

### Layer 8: Graceful Fast-Forward
- Detect escape velocity (>threshold)
- Smoothly animate to completion
- User intent respected

---

## Files Modified

- `index.html` - Layer 1: Critical inline CSS
- `src/index.css` - Layer 2: @layer scroll-hijack
- `src/hooks/useScrollHijack.ts` - NEW: Layers 3-8
- `src/components/ShowDontTell/ChaosToClarity.tsx` - Sentinel, overflow fix
- `src/components/ShowDontTell/BeforeAfterSplit.tsx` - Same fixes

---

## Verification Checklist

### Test Matrix

| Test | Chrome Desktop | Firefox | Safari | Chrome Mobile | iOS Safari | Status |
|------|---------------|---------|--------|---------------|------------|--------|
| Fast mouse wheel cannot escape | [ ] | [ ] | [ ] | N/A | N/A | |
| Fast trackpad cannot escape | [ ] | [ ] | [ ] | N/A | N/A | |
| Fast touch swipe cannot escape | N/A | N/A | N/A | [ ] | [ ] | |
| Arrow keys blocked during lock | [ ] | [ ] | [ ] | N/A | N/A | |
| Page Up/Down blocked | [ ] | [ ] | [ ] | N/A | N/A | |
| Space key blocked | [ ] | [ ] | [ ] | N/A | N/A | |
| Skip button works | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Escape velocity fast-forwards | [ ] | [ ] | [ ] | [ ] | [ ] | |
| No concept labels overflow | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Progress indicator accurate | [ ] | [ ] | [ ] | [ ] | [ ] | |
| No console errors | [ ] | [ ] | [ ] | [ ] | [ ] | |
| No layout shift on lock/unlock | [ ] | [ ] | [ ] | [ ] | [ ] | |
| BeforeAfterSplit works same | [ ] | [ ] | [ ] | [ ] | [ ] | |

### Regression Tests

- [ ] Hero section still works (no scrollbar flash)
- [ ] Side drawer positioning still works
- [ ] Navigation hide/show on scroll still works
- [ ] Other page sections scroll normally after completion
- [ ] Refresh mid-animation doesn't break page

### Manual Test Steps

1. **Fast Scroll Test (Desktop)**
   - Scroll page slowly to reach ChaosToClarity section
   - Once locked, try to scroll as fast as possible with mouse wheel
   - Expected: Animation progresses but cannot escape lock
   
2. **Keyboard Escape Test**
   - Once in scroll lock, press Arrow Down rapidly
   - Press Page Down
   - Press Space
   - Expected: All keys blocked, animation progresses

3. **Mobile Momentum Test (iOS Safari)**
   - Swipe quickly upward on the section
   - Expected: No escape, smooth animation

4. **Escape Velocity Test**
   - Scroll extremely fast (>12 pixels/ms)
   - Expected: Animation fast-forwards to completion

5. **Skip Button Test**
   - Start scrolling until Skip button appears
   - Click Skip
   - Expected: Instant completion, scroll released

### Automated Verification (Console)

```javascript
// Run in browser console to verify scroll lock state
const checkScrollLockState = () => {
  const isLocked = document.documentElement.classList.contains('scroll-hijack-locked');
  const bodyFixed = getComputedStyle(document.body).position === 'fixed';
  const touchAction = getComputedStyle(document.documentElement).touchAction;
  
  console.log('Scroll Lock State:', {
    cssClassPresent: isLocked,
    bodyFixed: bodyFixed,
    touchAction: touchAction,
    expected: isLocked ? { bodyFixed: true, touchAction: 'none' } : { bodyFixed: false }
  });
};

// Call during scroll hijack
checkScrollLockState();
```

---

**See Also:**
- `DIAGNOSIS.md` - Overall project diagnostics
- `ROOT_CAUSE.md` - Previous root cause analysis
- `CHANGELOG.md` - Change history
