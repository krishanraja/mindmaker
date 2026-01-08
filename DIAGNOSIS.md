# DIAGNOSIS: ICP Cards & Mobile Hero Text Issues

**Date:** 2026-01-03 (Updated 2026-01-08)  
**Status:** RESOLVED - Hero Scrollbar PERMANENTLY Fixed via Defense-in-Depth Architecture

---

## Update 2026-01-08: PERMANENT Hero Scrollbar Fix (17 Root Causes Addressed)

### Problem
The 2026-01-06 fix addressed only ONE cause (CSS layer ordering). The scrollbar still appeared for ~2 seconds because there were **17 contributing factors** that were never addressed.

### Root Causes Identified

**Category A: CSS Loading Race Conditions**
- A1: Font Loading Flash (async fonts with different metrics)
- A2: Global h1 override racing with hero-specific styles
- A3: Inline `<style>` tag in component applied after React hydration

**Category B: Layout Containment Gaps**
- B1: Overflow containers applied to wrong elements (content wrapper, not decorative elements)
- B2: Large orbs (384px) with blur-3xl extending beyond viewport
- B3: Measurement element with `whiteSpace: nowrap` and no width constraint

**Category C: JavaScript/Animation Timing**
- C1: Framer Motion `y: 10` transforms causing vertical overflow
- C2: useEffect headline validation triggering reflow after first paint

**Category D: External Resources**
- D1: GIF background not preloaded

**Category E: Viewport/Safe Area**
- E1: `min-h-screen` (100vh) exceeds viewport on iOS Safari
- E2: Safe area inset delay

**Category F: GPU Compositing**
- F1: blur-3xl GPU layer initialization

### Architectural Solution: Defense-in-Depth

Instead of fixing individual causes, implemented **7 overlapping prevention layers**:

**Layer 1: HTML-Level Prevention** (`index.html`)
- Critical inline CSS that loads BEFORE any other styles
- Forces `overflow-x: hidden` on html, body, #root, and #hero

**Layer 2: CSS Layer Priority** (`index.css`)
- New `@layer hero` that loads BEFORE base layer
- Hero containment rules guaranteed to apply from first paint

**Layer 3: No Inline Styles** (`NewHero.tsx`)
- Removed all inline `<style>` tags
- Responsive padding moved to CSS file

**Layer 4: Decorative Element Containment** (`NewHero.tsx`)
- Added `hero-decoration` class to all background elements (orbs, GIF, grid)
- CSS rule forces `overflow: hidden; max-width: 100%` on all decorations

**Layer 5: Animation Overflow Prevention** (`NewHero.tsx`)
- Removed `y` transforms from Framer Motion animations
- Now uses opacity-only transitions

**Layer 6: Viewport Unit Fix** (`NewHero.tsx`)
- Replaced `min-h-screen` (100vh) with `min-h-[100dvh]`
- Dynamic viewport height accounts for mobile browser toolbars

**Layer 7: Fallback Support** (`index.css`)
- `@supports not (100dvh)` fallback for older browsers

### Files Modified
- `index.html`: Added critical inline CSS before any stylesheets
- `src/index.css`: Added `@layer hero` with comprehensive containment rules
- `src/components/NewHero.tsx`: Removed inline styles, added hero-decoration classes, fixed animations

### Prevention Guardrails
1. Hero styles in separate CSS layer with highest priority
2. No inline `<style>` tags allowed in hero components
3. All decorative elements must use `hero-decoration` class
4. Animation transforms must not cause overflow

---

## Previous Fix (2026-01-06) - INCOMPLETE

The previous fix only addressed CSS layer ordering:
- Moved `.hero-text-size` to `src/index.css` under `@layer components`
- Added `#hero h1 { font-size: inherit; }` override

**Why it failed**: `@layer components` still loads AFTER `@layer base`, allowing a race condition window.

---

## Update 2026-01-06: Side Drawer Positioning

### Resolved Issues

#### Side Drawer Top Cutoff
- **Cause**: Sheet component positioned from viewport top (0px) while navbar covers top 64-80px
- **Fix**: Added `--navbar-height` CSS variables and `.sheet-navbar-aware` class with responsive offsets
- **Prevention**: Centralized navbar-aware positioning in index.css for reuse

### Files Modified
- `src/index.css`: Added navbar height variables, sheet-navbar-aware class
- `src/components/ActionsHub.tsx`: Applied sheet-navbar-aware class

---

## Original Issues (2026-01-03)

---

## Problem Summary

### Issue 1: ICP Cards (TheProblem Section)
- **Missing heading**: No "Who does Mindmaker help?" text above ICP slider
- **Aggressive shimmer**: Multiple overlapping animations causing visual noise
- **Unequal heights**: Cards have different heights due to varying content lengths

### Issue 2: Mobile Hero Text (P0 Critical)
- **Text truncation**: Static text "AI literacy for commercial leaders" is being cut off on mobile
- **Layout breakage**: Two-line layout implementation is failing on mobile viewports
- **Responsive sizing issue**: clamp() calculation may be too aggressive for small screens

---

## Architecture Map

### File Structure
```
src/components/
  ├── NewHero.tsx (Lines 74-140) - Hero text layout
  └── TheProblem.tsx (Lines 172-400) - ICP Slider component
```

### Component Call Graph
```
Index.tsx
  └── NewHero.tsx
      └── Hero text (two-line layout with clamp())
  └── TheProblem.tsx
      └── ICPSlider (Lines 172-400)
          ├── Desktop: Horizontal slider with shimmer
          └── Mobile: Carousel with shimmer
```

---

## Root Cause Analysis

### Issue 1: ICP Cards

**Location:** `src/components/TheProblem.tsx:172-400`

**Problems:**
1. **Missing heading** (Line 551): ICPSlider is called without any heading above it
   - Current: `<ICPSlider />`
   - Expected: Heading "Who does Mindmaker help?" before slider

2. **Aggressive shimmer** (Lines 227-290):
   - Three simultaneous animations:
     a. Background gradient position animation (3s, infinite, reverse)
     b. Shimmer line animation (2s, infinite, linear) - only when selected
     c. Box shadow pulse animation (2s, infinite, easeInOut)
   - All three run simultaneously on selected card
   - Creates visual overload

3. **Unequal heights** (Line 224):
   - Cards use `flex-1` but content varies:
     - Icon + title row: fixed height
     - Description: variable length text
   - No `min-height` or `height` constraint on card container
   - Result: Cards have different heights

### Issue 2: Mobile Hero Text (P0)

**Location:** `src/components/NewHero.tsx:74-140`

**Problems:**
1. **Clamp() sizing issue** (Line 94):
   ```css
   fontSize: 'clamp(1.875rem, 5vw, 3.75rem)'
   ```
   - On mobile (375px width): 5vw = 18.75px
   - clamp(30px, 18.75px, 60px) = 30px (min wins)
   - But container constraints may cause overflow

2. **Fixed height containers** (Lines 99-105, 123-130):
   - Both lines use `height: '1.2em'`
   - Static text uses `whiteSpace: 'nowrap'`
   - On mobile, "AI literacy for commercial leaders" (37 characters) may not fit in 1.2em at 30px font size
   - Result: Text gets cut off or overflows

3. **Container width** (Line 92):
   - `max-w-4xl` = 896px max width
   - On mobile, this is fine, but the clamp() + fixed height + nowrap creates conflict

4. **No overflow handling** (Line 132-138):
   - Static text span has `whiteSpace: 'nowrap'` but no `overflow: hidden` or text scaling
   - Text can overflow container boundaries

---

## Observed Errors

### From Screenshots:
1. **Mobile Hero**: Text shows "Activate your best dormant ideas" on line 1, "literacy for commercial lead" on line 2
   - Indicates: Static text is being truncated or wrapped incorrectly
   - "AI" is missing from line 2
   - "leaders" is cut off

2. **ICP Cards**: 
   - No heading visible above cards
   - Cards appear to have shimmer effect (visible in description)
   - Cards may have different heights (not visible but reported)

---

## Conditional Rendering Branches

### NewHero.tsx
- Single render path (no conditionals affecting hero text)
- All variants rotate through same layout structure

### TheProblem.tsx ICPSlider
- Desktop vs Mobile: `hidden md:block` vs `md:hidden`
- Selected card: `isSelected` determines animation intensity
- Shimmer animations: Only active when `isSelected === true`

---

## Related Files & Dependencies

### CSS/Design System
- `src/index.css`: Base typography, line-height defaults
- Tailwind config: Responsive breakpoints, spacing system
- Design system: Mint color variables, card styles

### Components
- `useIsMobile` hook: Determines mobile vs desktop rendering
- `Carousel` component: Used for mobile ICP slider
- `motion` from framer-motion: All animations

---

## Environment Considerations

- Mobile viewport: ~375px-428px typical
- Font rendering: System fonts (Inter)
- Browser: Mobile Safari, Chrome Mobile
- Touch interactions: Swipe gestures for carousel

---

## Required Fixes

### Fix 1: ICP Heading
- Add heading "Who does Mindmaker help?" above ICPSlider component
- Location: TheProblem.tsx, above line 551

### Fix 2: Shimmer Intensity
- Reduce to single, subtle shimmer effect
- Increase animation duration (slower = less aggressive)
- Reduce opacity/intensity of shimmer
- Consider disabling on mobile to save battery

### Fix 3: Card Heights
- Set `min-height` on card container to accommodate longest content
- OR use CSS Grid with equal row heights

### Fix 4: Mobile Hero Horizontal Overflow
- Remove absolute positioning or constrain it properly
- Ensure width constraints propagate through container chain
- Add `overflow-x: hidden` to intermediate containers
- Adjust font size calculation for mobile

### Fix 5: Mobile Hero Vertical Clipping
- Increase container height to accommodate animation movement
- Adjust `overflow-hidden` to allow animation space
- Adjust animation values or container height calculation

---

## Priority

| Issue | Priority | Impact |
|-------|----------|--------|
| Mobile hero horizontal overflow | P0 | Breaks core messaging |
| Mobile hero vertical clipping | P0 | Animation looks broken |
| ICP heading missing | P1 | UX clarity |
| Shimmer aggression | P2 | Visual comfort |
| Card heights | P2 | Visual consistency |

---

**See Also:**
- `ROOT_CAUSE.md` - Detailed root cause analysis
- `MOBILE_HERO_OVERFLOW_DIAGNOSIS.md` - Technical mobile hero diagnosis
- `project-documentation/COMMON_ISSUES.md` - Full issues list
