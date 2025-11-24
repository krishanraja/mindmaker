# Design System

**Last Updated:** 2025-11-24

---

## Design Tokens (CSS Custom Properties)

### Color System (HSL Format)

**Primary Brand Colors:**
```css
--primary: 248 73% 67%;          /* #667eea - Main brand purple */
--primary-100: 248 73% 97%;      /* Very light variant */
--primary-200: 248 73% 90%;      /* Light variant */
--primary-400: 248 73% 75%;      /* Medium variant */
--primary-600: 248 73% 55%;      /* Dark variant */
```

**Accent Colors:**
```css
--accent: 264 35% 46%;           /* #764ba2 - Secondary brand purple */
--accent-400: 264 35% 56%;       /* Lighter accent */
```

**Surface Colors (Light Mode):**
```css
--background: 0 0% 100%;         /* Pure white */
--foreground: 222 47% 11%;       /* Dark text */
--card: 0 0% 100%;               /* Card backgrounds */
--muted: 210 40% 96%;            /* Subtle backgrounds */
--muted-foreground: 215 28% 25%; /* Muted text */
--border: 214 32% 91%;           /* Border color */
--secondary: 220 13% 91%;        /* Distinct gray background */
```

**Surface Colors (Dark Mode):**
```css
--background: 222 47% 7%;
--foreground: 210 40% 98%;
--card: 222 47% 9%;
--border: 222 28% 18%;
--secondary: 222 32% 15%;
```

---

## Typography System

### Font Families

**Primary Font (Body):**
```css
font-family: 'Inter', system-ui, sans-serif;
```

**Display Font (Headlines):**
```css
font-family: 'Gobold', 'Impact', 'Arial Black', sans-serif;
```

### Font Sizes (Mobile-First)

```css
.mobile-text-sm { @apply text-sm sm:text-base md:text-lg; }
.mobile-text-base { @apply text-base sm:text-lg md:text-xl; }
.mobile-text-lg { @apply text-lg sm:text-xl md:text-2xl; }
.mobile-text-xl { @apply text-xl sm:text-2xl md:text-3xl; }
```

### Heading Scale

```css
.hero-heading {
  @apply text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl;
  @apply font-bold tracking-[0.1em] sm:tracking-[0.15em];
  @apply leading-[1.1] sm:leading-tight;
}

.section-heading {
  @apply text-2xl sm:text-3xl md:text-4xl;
  @apply font-semibold tracking-tight;
}
```

---

## Spacing System

### Section Padding
```css
.section-padding { @apply py-8 sm:py-12 md:py-20 lg:py-24; }
```

### Container Width
```css
.container-width { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
```

### Mobile Spacing
```css
.mobile-spacing { @apply space-y-4 sm:space-y-6 md:space-y-8; }
.mobile-padding { @apply p-4 sm:p-6 md:p-8; }
```

---

## Component System

### Glass Morphism Cards

```css
.glass-card {
  background: hsl(var(--background) / 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.3);
  border-radius: 1rem;
  box-shadow: 0 8px 32px hsl(var(--foreground) / 0.08);
}

.glass-card-dark {
  background: hsl(var(--card) / 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.2);
  border-radius: 1rem;
  box-shadow: 0 8px 32px hsl(var(--primary) / 0.1);
}
```

### Button Variants

**Primary Button:**
```css
.btn-primary {
  background: hsl(var(--primary));
  color: white;
  @apply hover:bg-primary/90 shadow-md hover:shadow-lg;
}
```

**Hero Button:**
```css
.btn-hero-primary {
  background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)));
  @apply hover:from-primary/90 hover:to-accent/90;
  @apply shadow-lg hover:shadow-xl transform hover:scale-105;
}
```

---

## Animation System

### Text Shimmer Effect
```css
.hero-text-shimmer {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.4) 100%);
  background-size: 400% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hero-text-shimmer 10s linear 2s 1;
}
```

### Fade In Up
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Breakpoints

```
Base: 0px - 639px (mobile)
sm: 640px (small tablets and large phones)
md: 768px (tablets)
lg: 1024px (small desktop)
xl: 1280px (large desktop)
2xl: 1400px (extra large)
```

---

## Accessibility

- All text maintains WCAG AA contrast ratios
- Focus states use `--ring` color with 2px shadow
- Reduced motion support for animations
- Minimum touch target: 48px (mobile)
- Safe area support for mobile notches

---

**Files:**
- `src/index.css` - Core design system definitions
- `tailwind.config.ts` - Tailwind theme extensions