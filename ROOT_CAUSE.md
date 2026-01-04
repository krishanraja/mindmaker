# ROOT CAUSE ANALYSIS

**Date:** 2026-01-03  
**Related:** DIAGNOSIS.md, MOBILE_HERO_OVERFLOW_DIAGNOSIS.md

---

## Issue 1: ICP Cards - Missing Heading

**Root Cause:** 
The ICPSlider component was added without a contextual heading. The section header "Boss the boardroom confidently" is too generic and doesn't explain what the ICP cards represent.

**Evidence:**
- Line 551 in TheProblem.tsx: `<ICPSlider />` called without heading
- User expectation: "Who does Mindmaker help?" should appear above cards
- Current header (Line 542-543) is about outcome, not audience

**Fix Required:**
Add heading "Who does Mindmaker help?" above ICPSlider component.

---

## Issue 2: ICP Cards - Aggressive Shimmer

**Root Cause:**
Three simultaneous infinite animations create visual overload:
1. Background gradient position (3s infinite reverse)
2. Shimmer line sweep (2s infinite linear) 
3. Box shadow pulse (2s infinite easeInOut)

**Evidence:**
- Lines 234-246: Background gradient animation
- Lines 249-264: Shimmer line animation (only when selected)
- Lines 277-290: Box shadow pulse animation
- All three run simultaneously on selected card

**Performance Impact:**
- Multiple GPU-accelerated animations per card
- Continuous repaints
- Battery drain on mobile devices

**Fix Required:**
- Reduce to single, subtle shimmer effect
- Increase animation duration (slower = less aggressive)
- Reduce opacity/intensity of shimmer
- Consider disabling on mobile to save battery

---

## Issue 3: ICP Cards - Unequal Heights

**Root Cause:**
Cards use `flex-1` but have no height constraint. Content varies:
- Icon + title: Fixed height (~80px)
- Description: Variable length (1-2 lines)
- Total: Varies from ~120px to ~160px

**Evidence:**
- Line 224: Card container has no `min-height` or fixed `height`
- Line 307: Description text has `leading-relaxed` but no height constraint
- Desktop layout (Line 203): `flex items-center` but cards can grow independently

**Fix Required:**
- Set `min-height` on card container to accommodate longest content
- OR use CSS Grid with equal row heights
- OR set fixed height and handle text overflow with ellipsis

---

## Issue 4: Mobile Hero Text - Text Truncation (P0)

**Root Cause:**
The combination of:
1. `clamp(1.875rem, 5vw, 3.75rem)` font sizing
2. Fixed `height: 1.2em` container
3. `whiteSpace: 'nowrap'` on static text
4. No overflow handling

Creates a scenario where on small mobile screens, the text "AI literacy for commercial leaders" (37 characters) cannot fit within the 1.2em height constraint at the calculated font size.

**Mathematical Analysis:**
- Mobile viewport: 375px width
- clamp(30px, 18.75px, 60px) = 30px (min wins)
- Container: max-w-4xl = 896px, but on mobile it's viewport width minus padding
- Actual container width: ~375px - 32px (padding) = ~343px
- Text "AI literacy for commercial leaders": ~37 chars × 18px avg char width = ~666px at 30px font
- **Problem**: Text width (666px) > Container width (343px)
- With `whiteSpace: 'nowrap'`, text overflows and gets cut off

**Evidence from Screenshot:**
- Line 1 shows: "Activate your best dormant ideas"
- Line 2 shows: "literacy for commercial lead" (missing "AI" at start, "ers" at end)
- This confirms text is being truncated/overflowing

**Additional Issues:**
- The invisible spacer (Line 78-88) uses the longest variant for height calculation, but doesn't account for the static text width
- The absolute positioning (Line 91) means text can overflow container boundaries
- No `overflow: hidden` or `text-overflow: ellipsis` on static text container

**Fix Required:**
1. **Option A**: Make static text responsive - allow it to scale down further on mobile
2. **Option B**: Use smaller text on mobile for static line, or break it differently
3. **Option C**: Use `text-overflow: ellipsis` with `overflow: hidden` (not ideal - loses text)
4. **Option D**: Adjust clamp() calculation to account for text width
5. **Option E**: Use viewport-based font sizing that ensures text fits (vw units for static text)

**Recommended Fix:**
- Use separate, more aggressive clamp() for mobile static text
- OR use `font-size: clamp(1rem, 4vw, 1.5rem)` for static text on mobile
- Add `overflow: hidden` and `text-overflow: ellipsis` as fallback
- Test on actual mobile devices (375px, 390px, 428px widths)

---

## Issue 5: Mobile Hero Text - Layout Architecture

**Root Cause:**
The two-line layout uses absolute positioning with fixed heights, but doesn't account for:
- Actual text rendering differences across browsers
- Font metrics (ascenders/descenders) affecting line-height
- Viewport width variations (375px, 390px, 428px, etc.)

**Evidence:**
- Line 76: `minHeight: 'calc(2 * 1.2em)'` - assumes 1.2em per line
- Line 102: `height: '1.2em'` - fixed height for rotating text
- Line 126: `height: '1.2em'` - fixed height for static text
- But 1.2em at 30px = 36px, which may not accommodate actual text rendering

**Fix Required:**
- Use more generous line-height calculation
- OR use `min-height` instead of fixed `height` to allow growth
- OR measure actual text height and use that
- Test across multiple mobile viewport sizes

---

## Issue 6: Dark Mode Text Contrast (TheProblem Section)

**Root Cause:**
Text in "Boss the boardroom" section may not have sufficient contrast in dark mode. Current text colors:
- Heading (Line 542): Uses default `text-foreground` (no explicit class)
- Subheading (Line 546): Uses `text-muted-foreground`
- ICP card text (Lines 304, 307): Uses `text-mint-dark` and `text-muted-foreground`

In dark mode:
- `--foreground: var(--graphite)` = `0 0% 95%` (very light, should be fine)
- `--muted-foreground: var(--mid-grey)` = `210 7% 62%` (medium grey, may need lightening)
- `--mint-dark: 158 60% 35%` (dark mint, may need lightening for contrast)

**Evidence:**
- Section background: `bg-muted/30` which in dark mode is darker
- Text may not have sufficient contrast against dark background
- User reports text needs to be "lightened" in dark mode

**Fix Required:**
- Ensure heading uses `text-foreground` explicitly (or lighter variant in dark mode)
- Lighten `text-muted-foreground` in dark mode for better contrast
- Lighten ICP card text (`text-mint-dark` and `text-muted-foreground`) in dark mode
- Consider using `text-foreground` or lighter variant for all text in dark mode

---

## Summary of Root Causes

| # | Issue | Root Cause | Fix |
|---|-------|------------|-----|
| 1 | ICP Heading | Missing contextual heading | Add heading |
| 2 | Shimmer Aggression | 3 simultaneous infinite animations | Reduce to 1, slower |
| 3 | Card Heights | No height constraint | Add min-height or grid |
| 4 | Mobile Text Truncation | clamp() + fixed height + nowrap conflict | Adjust sizing strategy |
| 5 | Layout Architecture | Fixed heights don't account for actual text | Use flexible approach |
| 6 | Dark Mode Contrast | Insufficient contrast in dark theme | Lighten text colors |

---

## Priority

| Issue | Priority | Impact |
|-------|----------|--------|
| Mobile hero text truncation | P0 | Breaks core messaging |
| Dark mode text contrast | P1 | Readability in dark theme |
| ICP cards heading | P1 | UX clarity |
| Shimmer aggression | P2 | Visual comfort |
| Card heights | P2 | Visual consistency |

---

**See Also:**
- `DIAGNOSIS.md` - Problem summary and architecture
- `MOBILE_HERO_OVERFLOW_DIAGNOSIS.md` - Detailed mobile hero analysis