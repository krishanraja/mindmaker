# Architectural Decisions Log

**Last Updated:** 2025-11-24

---

## Decision #1: No Global State Management

**Date:** 2025-11-20
**Context:** Deciding on state management approach
**Decision:** Use React hooks only, no Redux/Zustand/Context
**Rationale:** App is simple, no complex shared state needs
**Consequences:** Less boilerplate, easier onboarding, sufficient for current scale

---

## Decision #2: Glass Morphism Design System

**Date:** 2025-11-22
**Context:** Opaque cards blocking content
**Decision:** Implement translucent glass-card system with backdrop-blur
**Rationale:** Modern aesthetic, better visual hierarchy, solves visibility issues
**Consequences:** Requires careful contrast management, but worth it for UX

---

## Decision #3: Client-Side Form Validation Only

**Date:** 2025-11-23
**Context:** Diagnostic forms need validation
**Decision:** Use Zod + react-hook-form for client-side validation, no backend yet
**Rationale:** Iterate quickly on form design before committing to backend schema
**Consequences:** Will need backend integration later, but allows fast prototyping

---

## Decision #4: localStorage for Chat History

**Date:** 2025-11-23
**Context:** Persist chat messages across sessions
**Decision:** Store in browser localStorage, no database
**Rationale:** Simple, fast, no backend overhead for non-critical data
**Consequences:** Not synced across devices, but acceptable for MVP

---

## Decision #5: Plain English Repositioning

**Date:** 2025-11-24
**Context:** Tone too academic and intellectual
**Decision:** Remove cognitive jargon, use conversational language
**Rationale:** Target audience (executives) values clarity over cleverness
**Consequences:** Massive content rewrite, but essential for market fit

---

## Decision #6: Delete Dead Code Components

**Date:** 2025-11-24
**Context:** Multiple conflicting architectures causing confusion
**Decision:** Delete 5 old components (PathwaysSection, CollapsibleMethodologySection, etc.)
**Rationale:** Single source of truth, prevent regression bugs
**Consequences:** Clean codebase, easier maintenance

---

**End of DECISIONS_LOG**