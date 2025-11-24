# Common Issues & Solutions

**Last Updated:** 2025-11-24

---

## Issue #1: Opaque Card Crisis

**Symptom:** Cards completely solid white, blocking all content visibility

**Root Cause:** Using standard `.card` class with solid backgrounds instead of glass morphism

**Solution:**
```css
/* Use glass-card classes */
.glass-card {
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
}
```

**Prevention:** Always use `.glass-card` or `.glass-card-dark` classes

---

## Issue #2: CSS Syntax Errors

**Symptom:** Entire stylesheet breaks, design system fails

**Root Cause:** Extra closing braces or malformed CSS

**Solution:** Validate CSS syntax before deploying
```css
/* ❌ WRONG - Extra brace */
.dark {
  --background: 222 47% 7%;
}
} /* ← Breaks everything */

/* ✅ CORRECT */
.dark {
  --background: 222 47% 7%;
}
```

---

## Issue #3: Color System Failures

**Symptom:** Yellow or broken colors

**Root Cause:** RGB colors wrapped in HSL functions

**Solution:** Use HSL format throughout
```css
/* ❌ WRONG */
--primary: rgb(102, 126, 234);
color: hsl(var(--primary));

/* ✅ CORRECT */
--primary: 248 73% 67%;
color: hsl(var(--primary));
```

---

## Issue #4: Animation Conflicts

**Symptom:** Text animations don't work

**Root Cause:** Utility classes (like `text-white`) blocking `background-clip: text`

**Solution:** Remove conflicting utilities from animated elements
```jsx
{/* ❌ WRONG */}
<h1 className="hero-text-shimmer text-white">

{/* ✅ CORRECT */}
<h1 className="hero-text-shimmer">
```

---

## Issue #5: Mobile Overflow

**Symptom:** Horizontal scroll on mobile

**Root Cause:** Fixed widths or missing container constraints

**Solution:**
- Use responsive utilities (`max-w-7xl`, `px-4 sm:px-6`)
- Test at 375px viewport width
- Add `overflow-x: hidden` to html/body if needed

---

**End of COMMON_ISSUES**