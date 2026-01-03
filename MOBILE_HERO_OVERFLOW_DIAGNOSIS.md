# DIAGNOSIS: Mobile Hero Text Overflow Issues

**Date:** 2026-01-03  
**Status:** P0 Critical - Text falling off page edges + Rotating text clipped

---

## Problem Summary

### Issue 1: Text Falling Off Left and Right Sides (Horizontal Overflow)
- **Symptom**: Hero text "AI literacy for commercial leaders" and rotating text overflow beyond viewport edges on mobile
- **Impact**: Text is unreadable, breaks core messaging, poor mobile UX

### Issue 2: Rotating Hero Text Clipped at Top and Bottom (Vertical Overflow)
- **Symptom**: Rotating text in line 1 gets cut off at top and bottom during animation transitions
- **Impact**: Text appears truncated during rotation, animation looks broken

---

## Architecture Map

### Component Hierarchy
```
<section> (line 36)
  └─ className: "min-h-screen flex items-center justify-center bg-ink text-white relative overflow-hidden"
  └─ <div className="container-width"> (line 71)
      └─ className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" (16px padding on mobile)
      └─ <div className="max-w-5xl"> (line 73)
          └─ <div className="relative"> (line 76) ← Positioned parent for absolute h1
              └─ <h1 className="absolute top-0 left-0 right-0 max-w-4xl"> (line 91-92)
                  ├─ Line 1: Rotating text container (line 99-120)
                  └─ Line 2: Static text "AI literacy..." (line 123-156)
```

---

## Root Cause Analysis

### Issue 1: Horizontal Overflow - Exact Technical Causes

**Cause 1.1: Absolute Positioning Breaks Container Constraints**
- **Location**: Line 91-92
- **Problem**: `absolute top-0 left-0 right-0` makes h1 span full width of positioned parent (relative div at line 76), ignoring `max-w-5xl` constraint on grandparent (line 73)
- **Evidence**: 
  - Relative div (line 76) has no width constraint
  - Absolute h1 uses `left-0 right-0` = spans full viewport minus container-width padding
  - On 375px mobile: 375px - 32px (16px × 2) = 343px available width
  - But text is much wider than 343px

**Cause 1.2: Text Width Exceeds Container Width**
- **Location**: Lines 138, 146
- **Problem**: Font size calculation creates text wider than container
- **Mathematical Analysis**:
  - Mobile viewport: 375px
  - `clamp(2rem, 6vw, 4.5rem)` = clamp(32px, 22.5px, 72px) = **32px** (min wins)
  - Text: "AI literacy for commercial leaders" = 37 characters
  - Approximate width at 32px font: 37 chars × ~20px/char = **~740px**
  - Container width: ~343px (viewport - padding)
  - **Result**: Text (740px) >> Container (343px) = overflow

**Cause 1.3: max-w-4xl Doesn't Work with Absolute Positioning**
- **Location**: Line 92
- **Problem**: `max-w-4xl` class on absolutely positioned element doesn't constrain content properly
- **Why**: With `left-0 right-0`, element first spans full width, then max-width tries to constrain, but inner text can still overflow because:
  - Inner span (line 143) has `maxWidth: '100%'` 
  - Parent span (line 132) has `w-full` = 100% of absolutely positioned h1
  - The width calculation chain is broken

**Cause 1.4: Missing Overflow Constraints on Intermediate Containers**
- **Location**: Lines 71, 73, 76
- **Problem**: Container-width div and relative div don't have `overflow-x: hidden`
- **Evidence**: Section has `overflow-hidden` (line 36) but intermediate containers don't, allowing horizontal overflow to propagate

**Cause 1.5: overflow: hidden + textOverflow: ellipsis Not Working**
- **Location**: Lines 139-140
- **Problem**: `overflow: 'hidden'` and `textOverflow: 'ellipsis'` are set but text still overflows
- **Why**: The width constraint is calculated incorrectly due to absolute positioning, so the overflow handling never triggers properly

### Issue 2: Vertical Clipping - Exact Technical Causes

**Cause 2.1: Fixed Height Too Small for Animation**
- **Location**: Line 102
- **Problem**: `height: '1.2em'` is insufficient for animation that moves text vertically
- **Mathematical Analysis**:
  - Font size: `clamp(1.875rem, 5vw, 3.75rem)` = clamp(30px, 18.75px, 60px) = **30px** on mobile
  - Container height: `1.2em` = 1.2 × 30px = **36px**
  - Animation: `y: 10` (exit) and `y: -10` (initial) = text moves ±10px vertically
  - Required height: 36px (text) + 10px (up) + 10px (down) = **56px minimum**
  - **Result**: 36px container < 56px required = clipping

**Cause 2.2: overflow-hidden Clips Animation**
- **Location**: Line 100
- **Problem**: `overflow-hidden` on container clips text during `y: 10` and `y: -10` animation
- **Evidence**: 
  - Container has `overflow-hidden` (line 100)
  - Animation moves text with `y: 10` and `y: -10` (lines 110, 112)
  - Text gets clipped at top (when y: -10) and bottom (when y: 10)

**Cause 2.3: absolute inset-0 on motion.div Creates Positioning Conflict**
- **Location**: Line 114
- **Problem**: `absolute inset-0` positions motion.div to fill container, but y animation moves it outside bounds
- **Why**: `inset-0` = `top: 0, right: 0, bottom: 0, left: 0`, which constrains the element to container bounds, but y transform tries to move it outside

**Cause 2.4: flex items-center Doesn't Account for Animation**
- **Location**: Line 114
- **Problem**: `flex items-center` centers content, but doesn't provide extra space for animation movement
- **Why**: Centering assumes content fits within bounds, but animation needs buffer space

---

## Observed Errors (From Screenshot)

1. **Horizontal Overflow**:
   - Text "teracy for commercial leac" visible (truncated)
   - Text appears to extend beyond viewport edges
   - Missing "AI" at start and "ers" at end suggests left/right clipping

2. **Vertical Clipping**:
   - Rotating text appears cut off at top and bottom
   - Animation transitions show clipped text

---

## Related Issues from Previous Fixes

### What Broke It Initially (From ROOT_CAUSE.md)
- Original issue: Text truncation on mobile due to `clamp()` + fixed height + `nowrap` conflict
- Previous fix attempt: Added `overflow: hidden` and `textOverflow: ellipsis` (lines 139-140)
- **Why it didn't work**: The fix addressed overflow handling but didn't fix the root cause (absolute positioning breaking container constraints)

### Current State After Previous Fix
- Static text has overflow handling (lines 139-140) but still overflows due to width calculation issues
- Rotating text has `overflow-hidden` (line 100) which now clips animation
- Absolute positioning (line 91) still breaks container constraints

---

## Container Width Calculation Chain

```
Viewport: 375px (mobile)
  ↓
Section: overflow-hidden (line 36) ✓
  ↓
container-width div: px-4 = 16px padding each side (line 71)
  Available width: 375px - 32px = 343px
  ↓
max-w-5xl div: No constraint applied (line 73) - child is absolute
  ↓
relative div: No width constraint (line 76)
  ↓
absolute h1: left-0 right-0 = spans 343px (line 91-92)
  max-w-4xl: Tries to constrain but absolute positioning breaks it
  ↓
Static text span: w-full = 343px (line 132)
  Font: clamp(2rem, 6vw, 4.5rem) = 32px
  Text width: ~740px >> 343px = OVERFLOW
```

---

## Required Fixes

### Fix 1: Horizontal Overflow
1. Remove absolute positioning or constrain it properly
2. Ensure width constraints propagate correctly through container chain
3. Add `overflow-x: hidden` to intermediate containers
4. Fix font size calculation to ensure text fits within container width
5. Use proper responsive font sizing that accounts for container width, not just viewport

### Fix 2: Vertical Clipping
1. Increase container height to accommodate animation movement
2. Remove or adjust `overflow-hidden` to allow animation space
3. Adjust animation values or container height calculation
4. Ensure `flex items-center` accounts for animation buffer

### Fix 3: Preserve Original Intent
- Maintain two-line layout structure
- Keep rotating text animation working
- Ensure static text fits on mobile without truncation
- Preserve responsive font sizing

---

## Implementation Options

### Option A: Responsive Text Scaling
```css
/* Use container-aware font sizing */
font-size: clamp(1rem, 4vw, 2rem);
```

### Option B: Remove Absolute Positioning
```tsx
{/* Use flexbox instead of absolute */}
<div className="flex flex-col">
  <div className="line-1">...</div>
  <div className="line-2">...</div>
</div>
```

### Option C: Add Proper Width Constraints
```tsx
<div className="relative w-full max-w-4xl mx-auto overflow-x-hidden">
  {/* Content here */}
</div>
```

### Option D: Use CSS Container Queries (Modern)
```css
@container (max-width: 400px) {
  .hero-text { font-size: 1.5rem; }
}
```

---

**See Also:**
- `DIAGNOSIS.md` - Overview of all current issues
- `ROOT_CAUSE.md` - Root cause analysis
- `project-documentation/COMMON_ISSUES.md` - Full issues list
