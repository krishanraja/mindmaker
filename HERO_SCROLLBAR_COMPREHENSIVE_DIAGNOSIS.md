# COMPREHENSIVE DIAGNOSIS: Hero Section Scrollbar Visibility Issues

**Date:** 2026-01-09  
**Status:** P0 Critical - Architectural Fix Required  
**Mode:** Strict Diagnostic - No Edits Before Scope  
**Context:** Continuation of ongoing scrollbar issues despite previous fixes

---

## Problem Statement

### Symptom 1: Scrollbar on Page Load (2 Sections)
Horizontal scrollbar appears briefly during initial page load, affecting 2 sections of the hero.

### Symptom 2: Scrollbar on "View Programs" Button Hover
Horizontal scrollbar appears when hovering over the "View Programs" button in the hero section.

### User Requirement
Fix permanently and architecturally. Ensure it never happens again. Find ALL possible reasons, not just the first one.

---

## Architecture Context

### Previous Fix Attempts (2026-01-08)
A "permanent fix" was implemented with 7 defense-in-depth layers:
1. HTML-level inline CSS
2. `@layer hero` loading before base layer
3. Removed inline `<style>` tags
4. `hero-decoration` class on background elements
5. Removed Framer Motion `y` transforms
6. Replaced `min-h-screen` with `min-h-[100dvh]`
7. CSS fallback for older browsers

**Status:** Issue persists, indicating incomplete root cause analysis or new contributing factors.

---

## COMPLETE ROOT CAUSE ANALYSIS

### CATEGORY 1: PAGE LOAD SCROLLBAR (2 SECTIONS)

#### 1.1 CSS Layer Loading Race Condition
**Location:** `src/index.css` lines 1-179, `index.html` lines 9-50  
**Problem:** Despite `@layer hero` ordering, there's still a window where:
- React components render before CSS layers fully cascade
- Tailwind utilities may override `@layer hero` rules
- Browser may apply default styles before custom layers load

**Evidence:**
- `@layer hero` uses `!important` flags (lines 104-105, 116) indicating specificity wars
- Multiple layers: `scroll-hijack, hero, base, components, utilities`
- Tailwind `@apply` in `.container-width` (line 538) may load after hero layer

**Impact:** Scrollbar appears during CSS cascade resolution (typically 50-200ms window)

---

#### 1.2 Font Loading Race Condition
**Location:** `index.html` lines 138-156, `src/components/NewHero.tsx` line 180  
**Problem:** 
- Google Fonts load asynchronously (`media="print"` with `onload`)
- During font loading, browser uses fallback fonts (system fonts)
- Fallback fonts may have different metrics (width, spacing)
- Text width calculation changes when real font loads

**Evidence:**
- Fonts: Inter Variable, Space Grotesk Variable
- `font-feature-settings` in body (line 368) may affect metrics
- Hero text uses `hero-text-size` class which depends on loaded font metrics

**Impact:** Text width changes from fallback → real font, triggering overflow recalculation

---

#### 1.3 Viewport Unit Calculation Timing
**Location:** `src/components/NewHero.tsx` line 91, `src/index.css` lines 173-178  
**Problem:**
- `min-h-[100dvh]` requires browser to calculate dynamic viewport height
- On mobile, browser chrome (address bar, toolbars) affects `100dvh` calculation
- Calculation happens after initial render
- `100vw` vs `100dvh` mismatch can cause horizontal overflow

**Evidence:**
- Section uses `min-h-[100dvh]` (line 91)
- CSS fallback uses `100vh` and `-webkit-fill-available` (lines 175-176)
- No explicit `width: 100vw` constraint on section itself

**Impact:** Viewport calculation delay causes temporary overflow

---

#### 1.4 Container Width Chain Breakdown
**Location:** `src/components/NewHero.tsx` lines 127-129, `src/index.css` line 538  
**Problem:** Container hierarchy has gaps in overflow containment:

```
<section id="hero"> (overflow: hidden ✓)
  └─ <div className="container-width"> (line 127)
      └─ className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      └─ NO explicit overflow-x: hidden
      └─ <div className="max-w-5xl"> (line 129)
          └─ NO explicit overflow-x: hidden
          └─ <div> (line 132) - relative positioning container
              └─ NO explicit overflow-x: hidden
              └─ <h1> (line 179) - absolute positioning
```

**Evidence:**
- `.hero-content-wrapper` has `overflow-x: hidden` (line 124) but only applies to direct children
- `.container-width` (line 538) has no overflow constraint
- Intermediate containers between `#hero` and content lack overflow protection

**Impact:** Overflow can propagate through container chain before being caught

---

#### 1.5 Absolute Positioning Breaking Constraints
**Location:** `src/components/NewHero.tsx` lines 132-248  
**Problem:** 
- H1 uses absolute positioning (`absolute top-0 left-0`) within relative container
- Absolute positioning removes element from normal flow
- `max-w-4xl` on h1 (line 180) may not constrain properly when absolutely positioned
- Width calculation happens before parent constraints are fully resolved

**Evidence:**
- Line 132: `<div className="relative w-full max-w-5xl">` - relative parent
- Line 179: `<h1 className="absolute top-0 left-0 ... max-w-4xl">` - absolute child
- Line 184: `width: '100%'` in inline style
- Absolute positioning breaks CSS containment chain

**Impact:** Text width exceeds container because absolute positioning ignores parent max-width

---

#### 1.6 Text Measurement Timing
**Location:** `src/components/NewHero.tsx` lines 32-80  
**Problem:**
- `useEffect` validates headlines with 100ms delay (line 73)
- Measurement happens AFTER initial render
- During measurement window, text may render at incorrect size
- Font loading + measurement delay = double timing issue

**Evidence:**
- `setTimeout(() => {...}, 100)` in `validateHeadlines`
- Measurement uses `offsetWidth` which requires layout to be complete
- Console warnings (lines 66-70) indicate measurement happens post-render

**Impact:** Text renders at wrong size before measurement completes

---

#### 1.7 CSS Containment Not Applied Consistently
**Location:** `src/index.css` lines 106, 123, 129  
**Problem:**
- `#hero` has `contain: layout style paint` (line 106)
- `.hero-content-wrapper` has `contain: layout style` (line 123) - MISSING `paint`
- `.hero-decoration` has no containment
- Inconsistent containment allows layout thrashing

**Evidence:**
- Containment levels vary across hero children
- Missing `paint` containment on content wrapper allows repaints
- Decorative elements (orbs, backgrounds) lack containment

**Impact:** Layout recalculations trigger overflow checks at wrong times

---

#### 1.8 Animation Initialization
**Location:** `src/components/NewHero.tsx` lines 199-220  
**Problem:**
- Framer Motion `AnimatePresence` initializes after mount
- Animation setup may trigger layout recalculation
- `opacity` transitions (lines 202-204) still cause repaint
- Animation container sizing happens post-mount

**Evidence:**
- `AnimatePresence mode="wait"` (line 199)
- `initial={{ opacity: 0 }}` (line 202)
- Animation timing: `duration: 0.5` (line 205)
- Container has fixed height (line 191-193) but animation may exceed it

**Impact:** Animation initialization causes layout shift → overflow check → scrollbar

---

#### 1.9 Blur Effects Causing Overflow
**Location:** `src/components/NewHero.tsx` lines 123-124  
**Problem:**
- `blur-3xl` on decorative orbs extends beyond element bounds
- Blur radius: `blur-3xl` = 64px (Tailwind default)
- Blur extends 64px in all directions beyond element
- No overflow containment on blur elements

**Evidence:**
- Line 123: `blur-3xl` on orb (w-96 h-96 = 384px × 384px)
- Blur extends to 384px + 128px = 512px total
- Orbs positioned with `absolute` (line 123-124)
- No `overflow: hidden` on orb containers

**Impact:** Blur extends beyond viewport, triggering horizontal scrollbar

---

#### 1.10 Background Image/GIF Loading
**Location:** `src/components/NewHero.tsx` lines 97-105  
**Problem:**
- Background GIF loads asynchronously
- GIF dimensions may exceed viewport
- `backgroundSize: 'cover'` (line 101) may not constrain properly during load
- Image loading triggers layout recalculation

**Evidence:**
- Line 100: `backgroundImage: 'url(/mindmaker-background-green.gif)'`
- `backgroundSize: 'cover'` (line 101)
- No explicit size constraints on background container
- GIF may have intrinsic dimensions larger than viewport

**Impact:** Background image overflow during load → scrollbar

---

#### 1.11 Padding Calculation Issues
**Location:** `src/components/NewHero.tsx` line 127, `src/index.css` lines 155-169  
**Problem:**
- `.container-width` has responsive padding: `px-4 sm:px-6 lg:px-8`
- Padding calculated as: viewport width - padding = content width
- During responsive breakpoint transitions, padding may miscalculate
- `calc()` in padding-top (lines 156, 161, 167) may cause timing issues

**Evidence:**
- Container padding: 16px (mobile), 24px (sm), 32px (lg)
- Padding-top uses `calc(5rem * 0.8 * 0.5)` with responsive multipliers
- No explicit `box-sizing: border-box` guarantee on all containers

**Impact:** Padding miscalculation → content width exceeds viewport → scrollbar

---

#### 1.12 Max-Width Constraint Conflicts
**Location:** `src/components/NewHero.tsx` lines 127, 129, 180  
**Problem:**
- Multiple max-width constraints in hierarchy:
  - `.container-width`: `max-w-7xl` (1280px)
  - Content div: `max-w-5xl` (1024px)
  - H1: `max-w-4xl` (896px)
- During CSS cascade, these may conflict
- Absolute positioning breaks max-width inheritance

**Evidence:**
- Line 127: `container-width` class
- Line 129: `max-w-5xl` explicit
- Line 180: `max-w-4xl` on h1
- Absolute h1 (line 179) ignores parent max-width

**Impact:** Constraint conflicts cause width miscalculation → overflow

---

### CATEGORY 2: HOVER STATE SCROLLBAR ("VIEW PROGRAMS" BUTTON)

#### 2.1 Shadow Expansion Beyond Container
**Location:** `src/components/NewHero.tsx` line 289, `src/components/ui/button.tsx` line 14  
**Problem:**
- Button has `hover:shadow-md` (line 289)
- Shadow expands beyond button bounds
- Shadow spread radius not contained
- Container doesn't account for shadow expansion

**Evidence:**
- Line 289: `shadow-sm hover:shadow-md`
- `shadow-md` = `0 4px 12px` (from design system)
- Shadow extends 12px beyond button in all directions
- Button container (line 278) has no padding to accommodate shadow
- `.hero-content-wrapper` has `overflow-x: hidden` (line 124) but shadow may exceed it

**Impact:** Shadow expansion → overflow → scrollbar on hover

---

#### 2.2 Border Width Change Causing Layout Shift
**Location:** `src/components/NewHero.tsx` line 289  
**Problem:**
- Button has `border-2` (2px border)
- Hover: `hover:border-mint/70` (border color changes, but width stays 2px)
- However, border rendering may cause 1px layout shift
- Border box model calculation during hover transition

**Evidence:**
- Line 289: `border-2 border-mint/50 hover:border-mint/70`
- Border width: 2px constant
- But border color opacity change may trigger repaint
- `transition-all duration-300` (line 289) animates all properties

**Impact:** Border repaint → layout recalculation → overflow check → scrollbar

---

#### 2.3 Backdrop Blur Rendering Issues
**Location:** `src/components/NewHero.tsx` line 289  
**Problem:**
- Button has `backdrop-blur-md` (line 289)
- Backdrop blur requires compositing layer
- Compositing may cause temporary overflow during layer creation
- Blur effect extends beyond element bounds

**Evidence:**
- `backdrop-blur-md` = 12px blur radius
- Blur extends 12px beyond button
- Compositing layer creation is asynchronous
- No containment for blur expansion

**Impact:** Blur layer creation → temporary overflow → scrollbar

---

#### 2.4 Transform/Transition Causing Layout Reflow
**Location:** `src/components/NewHero.tsx` line 281, 289  
**Problem:**
- First button: `hover:-translate-y-0.5` (line 281)
- Both buttons: `transition-all duration-300` (lines 281, 289)
- Transform triggers layout recalculation
- Reflow may temporarily exceed container bounds

**Evidence:**
- Line 281: `hover:-translate-y-0.5` (moves up 2px)
- Line 289: `transition-all` animates all properties
- Transform creates new stacking context
- Container doesn't account for transform space

**Impact:** Transform → layout reflow → overflow → scrollbar

---

#### 2.5 Button Container Not Containing Hover Effects
**Location:** `src/components/NewHero.tsx` lines 278-306  
**Problem:**
- Button container: `<div className="flex flex-col sm:flex-row ...">` (line 278)
- Container has no `overflow: hidden`
- Container has no padding to accommodate hover effects
- Hover effects (shadow, blur, transform) extend beyond button

**Evidence:**
- Line 278: Container div has no overflow constraint
- Buttons are direct children with hover effects
- No padding/margin to contain expanded effects
- `.hero-content-wrapper` overflow may not catch button hover expansion

**Impact:** Hover effects escape container → overflow → scrollbar

---

#### 2.6 Focus Ring Expansion
**Location:** `src/components/ui/button.tsx` line 8, `src/index.css` lines 990-993  
**Problem:**
- Button has `focus-visible:ring-2` (line 8)
- Focus ring extends beyond button bounds
- Ring offset: `ring-offset-2` (line 8) = 8px
- Ring may appear on hover in some browsers

**Evidence:**
- Button base: `ring-offset-background` (line 8)
- Focus ring: `focus-visible:ring-2` = 2px ring
- Ring offset: `focus-visible:ring-offset-2` = 8px
- Total expansion: 2px ring + 8px offset = 10px beyond button

**Impact:** Focus ring expansion → overflow → scrollbar

---

#### 2.7 Text Content Width Change
**Location:** `src/components/NewHero.tsx` line 304  
**Problem:**
- Button text: "View Programs"
- Hover may trigger font rendering changes
- Text metrics may change during hover transition
- Text width recalculation may exceed container

**Evidence:**
- Button text is static: "View Programs"
- But `transition-all` (line 289) may affect text rendering
- Font smoothing may change during transition
- Text width calculation may fluctuate

**Impact:** Text width change → overflow → scrollbar

---

#### 2.8 Z-Index/Stacking Context Changes
**Location:** `src/components/NewHero.tsx` line 289  
**Problem:**
- Hover effects may create new stacking context
- Stacking context changes trigger layout recalculation
- New context may have different overflow behavior
- Z-index changes may affect containment

**Evidence:**
- `backdrop-blur-md` creates new stacking context
- Shadow effects may create layers
- Transform creates new context (line 281)
- Stacking context changes trigger repaint

**Impact:** Stacking context change → layout recalculation → overflow → scrollbar

---

## ARCHITECTURAL ROOT CAUSES

### A1: Incomplete Overflow Containment Chain
**Problem:** Overflow protection exists at top level (`#hero`) but gaps in intermediate containers allow overflow to propagate.

**Evidence:**
- `#hero` has `overflow: hidden` ✓
- `.hero-content-wrapper` has `overflow-x: hidden` ✓
- `.container-width` has NO overflow constraint ✗
- Button container has NO overflow constraint ✗
- Intermediate divs have NO overflow constraint ✗

**Impact:** Any single gap allows overflow to escape

---

### A2: Shadow/Blur Effects Not Accounted in Layout
**Problem:** Visual effects (shadows, blurs) extend beyond element bounds but aren't included in layout calculations.

**Evidence:**
- `blur-3xl` extends 64px beyond elements
- `shadow-md` extends 12px beyond buttons
- `backdrop-blur-md` extends 12px beyond buttons
- No padding/margin to accommodate effects

**Impact:** Effects exceed container → overflow → scrollbar

---

### A3: Absolute Positioning Breaking CSS Containment
**Problem:** Absolute positioning removes elements from normal flow, breaking max-width inheritance and containment.

**Evidence:**
- H1 uses absolute positioning (line 179)
- Absolute elements ignore parent max-width
- Containment doesn't work on absolutely positioned children
- Width calculation happens independently

**Impact:** Absolute elements can exceed container → overflow

---

### A4: Timing Issues in CSS/JS/Font Loading
**Problem:** Multiple asynchronous loading processes (CSS, fonts, images, JS) cause timing windows where overflow can occur.

**Evidence:**
- CSS layers load asynchronously
- Fonts load asynchronously
- Images/GIFs load asynchronously
- React renders before all assets load
- Measurement happens post-render (100ms delay)

**Impact:** Race conditions create temporary overflow windows

---

### A5: Responsive Breakpoint Transitions
**Problem:** During viewport resize or breakpoint transitions, padding/width calculations may temporarily miscalculate.

**Evidence:**
- Responsive padding: `px-4 sm:px-6 lg:px-8`
- Responsive font sizing with `clamp()`
- Viewport unit calculations (`100dvh`, `100vw`)
- Breakpoint transitions trigger recalculation

**Impact:** Temporary miscalculation → overflow → scrollbar

---

## PREVENTION ARCHITECTURE REQUIREMENTS

### Requirement 1: Complete Overflow Containment Chain
Every container in the hierarchy must have overflow protection:
```
#hero (overflow: hidden) ✓
  └─ .container-width (overflow-x: hidden) ✗ ADD
      └─ .hero-content-wrapper (overflow-x: hidden) ✓
          └─ .max-w-5xl (overflow-x: hidden) ✗ ADD
              └─ Button container (overflow: hidden) ✗ ADD
```

### Requirement 2: Shadow/Blur Effect Containment
All visual effects must be contained within their parent:
- Add padding to containers to accommodate effects
- Use `clip-path` or `overflow: hidden` on effect containers
- Calculate effect expansion and add to container dimensions

### Requirement 3: Absolute Positioning Constraints
Absolute elements must respect container bounds:
- Use `left: 0; right: 0; max-width: 100%` instead of `left-0 right-0`
- Add explicit width constraints to absolutely positioned elements
- Use `contain: layout` on absolute containers

### Requirement 4: Timing-Safe Initialization
Eliminate race conditions:
- Preload critical fonts
- Use CSS `font-display: swap` for faster fallback
- Initialize measurements before render
- Use CSS containment to prevent layout thrashing

### Requirement 5: Hover Effect Containment
All hover effects must be contained:
- Add padding to button containers for shadow/blur expansion
- Use `overflow: hidden` on hover effect containers
- Calculate maximum effect expansion and reserve space

---

## VERIFICATION CHECKLIST

After implementing fixes, verify:

1. ✅ No scrollbar on page load (test 10+ times)
2. ✅ No scrollbar on "View Programs" button hover
3. ✅ No scrollbar on window resize
4. ✅ No scrollbar on font loading completion
5. ✅ No scrollbar on image/GIF loading
6. ✅ No scrollbar during animation transitions
7. ✅ No scrollbar at all responsive breakpoints (320px - 1920px)
8. ✅ No scrollbar with slow 3G connection (simulate)
9. ✅ No scrollbar with disabled JavaScript
10. ✅ No scrollbar with browser extensions disabled

---

## FILES REQUIRING CHANGES

1. `src/index.css` - Add overflow constraints to container chain
2. `src/components/NewHero.tsx` - Fix absolute positioning, add hover containment
3. `index.html` - Enhance inline CSS for faster protection
4. `src/components/ui/button.tsx` - Ensure hover effects are contained

---

## BROWSER DIAGNOSTIC RESULTS (2026-01-09)

### Live Testing Results

**Test:** Hover over "View Programs" button and check for overflow

**Findings:**

1. **Button Element Overflow:**
   - Button has `overflowX: "visible"` (default)
   - Button `offsetWidth: 217px` (includes border)
   - Button `scrollWidth: 213px` (content width)
   - Button `clientWidth: 213px` (visible width)
   - **No overflow detected on button itself when not hovered**

2. **Parent Container:**
   - Parent has `overflowX: "hidden"` ✓
   - Parent `clientWidth: 959px`
   - Parent `scrollWidth: 959px`
   - **Parent properly contains button**

3. **Root Elements:**
   - `html.scrollWidth: 1023px`, `html.clientWidth: 1023px` - No overflow
   - `body.scrollWidth: 1023px`, `body.clientWidth: 1023px` - No overflow
   - `#hero.scrollWidth: 1023px`, `#hero.clientWidth: 1023px` - No overflow

4. **Button Shadow:**
   - Current shadow: `rgba(12, 28, 44, 0.1) 0px 4px 12px 0px`
   - Shadow blur: 12px
   - Shadow extends 12px beyond button bounds in all directions
   - **Shadow expansion: 24px total (12px left + 12px right)**

5. **Critical Finding:**
   - Initial diagnostic showed a BUTTON with `overflow: 4px` (scrollWidth: 119, clientWidth: 115)
   - This was likely during hover state transition
   - Button has `overflow: visible` which allows shadow to extend beyond bounds
   - **Root cause: Shadow expansion on hover (`hover:shadow-md`) extends beyond button, and button's `overflow: visible` allows it to escape parent's `overflow: hidden`**

### Exact Root Cause

**The "View Programs" button has:**
- `overflow: visible` (default for buttons)
- `hover:shadow-md` which expands shadow to `0 4px 12px` (12px blur radius)
- Shadow extends 12px beyond button bounds
- Button is positioned near the right edge of its parent container
- When shadow expands on hover, it extends beyond the parent's right edge
- Parent has `overflow: hidden` but shadow rendering happens at a different layer
- **The shadow is rendered outside the button's box model, creating visual overflow that triggers scrollbar**

### Solution Required

The fix must:
1. **Contain the shadow within the button's bounds** - Use `overflow: hidden` on button OR
2. **Add padding to parent container** to accommodate shadow expansion OR
3. **Use `clip-path` or `contain: layout`** to clip shadow effects OR
4. **Reduce shadow blur radius** on hover to prevent overflow

**Recommended Fix:** Add `overflow: hidden` to the button element itself, or wrap button in a container with padding to accommodate shadow expansion.

---

## NEXT STEPS

1. **PHASE 1:** Complete problem scope (THIS DOCUMENT) ✅
2. **PHASE 2:** Root cause investigation (THIS DOCUMENT) ✅
3. **PHASE 3:** Implementation plan with checkpoints (PENDING USER APPROVAL)
4. **PHASE 4:** Implementation (PENDING)
5. **PHASE 5:** Handover documentation (PENDING)

---

**End of Comprehensive Diagnosis**
