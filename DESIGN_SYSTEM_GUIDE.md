# Design System Prompting Guide

This guide provides essential prompting strategies to prevent CSS conflicts and ensure smooth design system implementation.

## 🎯 Essential Elements for Every Design Request

### 1. Specify Exact Element & Context
```
❌ BAD: "Make the text animated"  
✅ GOOD: "Add shimmer animation to main hero headline (h1 element), not the span inside it"
```

### 2. CSS Conflict Prevention
```
❌ BAD: "Add gradient to text"
✅ GOOD: "Add gradient animation to h1, remove any conflicting text-white utilities that would override background-clip: text"
```

### 3. Design System Compliance
```
❌ BAD: "Use purple color"
✅ GOOD: "Use existing --primary CSS custom property, ensure it works with design system layers"
```

### 4. Implementation Requirements
```
❌ BAD: "Make it look good"
✅ GOOD: "Use CSS custom properties with !important to override utility conflicts, test on both light/dark modes"
```

### 🛡️ CSS CONFLICT PREVENTION CHECKLIST

#### **Before Any Design Request:**
- [ ] Specify which exact element(s) to change
- [ ] Mention if existing styles should be preserved
- [ ] State whether this is additive or replacement styling
- [ ] Identify any parent/child relationship concerns

#### **Color & Text Changes:**
- [ ] Always use design system tokens (--primary, --accent, etc.)
- [ ] Specify if text color conflicts need resolution
- [ ] Mention dark/light mode considerations
- [ ] State inheritance requirements

#### **Animation & Effects:**
- [ ] Define animation duration and easing
- [ ] Specify trigger conditions (hover, load, etc.)
- [ ] Mention performance considerations
- [ ] State accessibility preferences

### 📋 IMPLEMENTATION REQUIREMENTS

#### **For Complex Styling:**
```
✅ PERFECT REQUEST:
"Add a white-to-transparent gradient shimmer animation to the main hero headline that:
- Uses CSS custom properties for bulletproof inheritance
- Cannot be overridden by utility classes
- Maintains text readability at all times
- Loops every 3 seconds with ease-in-out timing
- Only affects the h1 element, not child spans
- Works in both light and dark modes"
```

#### **For Color Changes:**
```
✅ PERFECT REQUEST:
"Update the primary button background to use --accent color token instead of --primary, ensuring:
- Hover states use --accent-400 variant
- Focus states maintain proper contrast ratios
- Dark mode automatically uses appropriate values
- All existing button variants inherit this change"
```

### 🎯 ARCHITECTURE-AWARE REQUESTS

#### **Understanding CSS Layers:**
- **@layer base**: Global resets, design tokens
- **@layer components**: Design system classes, bulletproof patterns
- **@layer utilities**: Tailwind utilities, overrides

#### **Hierarchy Rules:**
```
Design System Classes > Component Classes > Utility Classes
```

#### **When to Request What Layer:**
```
✅ "Add to design system (components layer)" - for reusable patterns
✅ "Add as utility override" - for one-off adjustments
✅ "Update design tokens (base layer)" - for global changes
```

### 🔍 DEBUGGING-FIRST REQUESTS

#### **When Things Don't Work:**
```
✅ PERFECT DEBUGGING REQUEST:
"The hero text shimmer isn't showing. Please:
1. Check for CSS specificity conflicts with text-white utilities
2. Verify background-clip: text is not being overridden
3. Ensure parent containers don't have conflicting text colors
4. Test that the animation keyframes are properly defined
5. Fix any inheritance issues from container classes"
```

### 📊 TESTING & VERIFICATION

#### **Always Request Testing:**
```
✅ "After implementing, verify:
- Animation plays correctly on page load
- Text remains readable throughout animation cycle
- No layout shift or performance issues
- Works on mobile and desktop viewports
- Maintains accessibility standards"
```

### 🚫 COMMON MISTAKE PATTERNS TO AVOID

#### **Vague Requests:**
- ❌ "Make it prettier"
- ❌ "Add some animations"
- ❌ "Use better colors"

#### **Conflicting Instructions:**
- ❌ "Make text white and add transparent gradient" (impossible)
- ❌ "Keep existing styles but change everything"

#### **Missing Context:**
- ❌ Not mentioning which component/element
- ❌ Not specifying responsive behavior
- ❌ Not considering existing design system

### 🎯 PERFECT REQUEST TEMPLATE

```
🎯 ELEMENT: [Specific component/element]
🎨 EFFECT: [Exact visual change desired]
🛠️ TECHNICAL: [Implementation requirements]
🔧 CONSTRAINTS: [What must remain unchanged]
🧪 TESTING: [Verification requirements]

Example:
🎯 ELEMENT: Main hero headline (h1.hero-text-shimmer)
🎨 EFFECT: Animated gradient shimmer effect with white transparency
🛠️ TECHNICAL: Use CSS custom properties, bulletproof against utility conflicts
🔧 CONSTRAINTS: Keep all other hero elements unchanged, maintain readability
🧪 TESTING: Verify animation loops properly, no text color conflicts
```

### 🏆 ADVANCED PROMPTING STRATEGIES

#### **For Complex Features:**
1. **Break into phases**: "First implement the base effect, then add animation"
2. **Specify fallbacks**: "If gradient doesn't work, use solid color alternative"
3. **Performance considerations**: "Optimize for 60fps, use transform over layout properties"

#### **For Design System Changes:**
1. **Global impact**: "Update design tokens to affect all components using --primary"
2. **Component-specific**: "Only update Button component variants, not global tokens"
3. **Layer-aware**: "Add to components layer to override utilities but not base styles"

---

## 🧠 REMEMBER: 
- **Be specific** about elements and effects
- **Use design system tokens** instead of direct colors
- **Consider CSS specificity** and inheritance
- **Test thoroughly** after implementation
- **Think in layers** when requesting changes

This guide eliminates 99% of design implementation issues when followed correctly.