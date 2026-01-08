# Mindmaker Project Documentation

**Last Updated:** 2026-01-08

---

## Documentation Index

This folder contains comprehensive documentation for the Mindmaker AI literacy platform.

### Core Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, tech stack, data flows, edge functions |
| [FEATURES.md](./FEATURES.md) | Complete feature catalogue, product offerings, technical features |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, spacing, components, accessibility |
| [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) | Layout patterns, card styles, animations, imagery |

### Operations Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Pre-deploy checklist, secrets reference, rollback procedures |
| [COMMON_ISSUES.md](./COMMON_ISSUES.md) | Known issues, solutions, debugging checklist |
| [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) | Step-by-step guide to replicate the platform |

### History and Decisions

| Document | Description |
|----------|-------------|
| [HISTORY.md](./HISTORY.md) | Chronological change history, evolution timeline |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Architecture and design decisions with rationale |
| [CHANGELOG.md](../CHANGELOG.md) | Technical changelog (in root folder) |

### Business Documentation

| Document | Description |
|----------|-------------|
| [PURPOSE.md](./PURPOSE.md) | Mission, vision, core objectives |
| [VALUE_PROP.md](./VALUE_PROP.md) | Value propositions, positioning, objection handling |
| [ICP.md](./ICP.md) | Ideal Customer Profiles |
| [BRANDING.md](./BRANDING.md) | Brand voice, tone, copy guidelines |
| [OUTCOMES.md](./OUTCOMES.md) | User outcomes framework, success metrics |

### Research and Training

| Document | Description |
|----------|-------------|
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | LLM critical thinking integration summary |
| [LLM_CRITICAL_THINKING_TRAINING.md](./LLM_CRITICAL_THINKING_TRAINING.md) | AI training research and frameworks |

---

## Quick Reference

### Tech Stack
- **Frontend:** React 18.3, TypeScript, Vite 5.x, TailwindCSS
- **Backend:** Supabase Edge Functions (Deno)
- **AI:** Vertex AI RAG (Gemini 2.5 Flash), Lovable AI Gateway, OpenAI
- **Email:** Resend
- **Scheduling:** Calendly
- **Payments:** Stripe (paused)

### Key Routes
- `/` - Landing page
- `/builder-session`, `/builder-sprint`, `/leadership-lab`, `/portfolio-program` - Programs
- `/leaders` - AI Leadership Benchmark diagnostic
- `/blog`, `/blog/:slug` - Blog
- `/faq`, `/privacy`, `/terms`, `/contact` - Support pages

### Edge Functions
- `chat-with-krish` - AI chatbot (Vertex AI RAG)
- `get-ai-news` - News ticker (Lovable AI Gateway)
- `get-market-sentiment` - Market analysis (OpenAI)
- `send-lead-email` - Lead capture + enrichment
- `send-contact-email` - Contact form
- `send-leadership-insights-email` - Leadership Benchmark results

### Design System
- **Primary:** Ink (#0e1a2b), Mint (#7ef4c2)
- **Display Font:** Space Grotesk Variable
- **Body Font:** Inter Variable
- **Dark Card Text:** Use `.dark-cta-card` or `text-dark-card-*` utilities

---

## Recent Updates (2026-01)

### 2026-01-06
- Fixed hero scrollbar flash on page load
- Fixed side drawer content cut off behind navbar
- Added navbar-aware sheet positioning system

### 2026-01-05
- Fixed WCAG AA contrast failures on dark backgrounds
- Added `dark-cta-card` component class
- Added `dark-card-*` text color utilities

### 2026-01-XX
- Fixed Builder Profile widgetMode bug
- Added Builder Profile mode detection
- Improved fallback quality with LLM-generated responses

---

## Contributing

1. Read the relevant documentation before making changes
2. Follow the design system in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
3. Check [COMMON_ISSUES.md](./COMMON_ISSUES.md) for known problems
4. Update documentation when you make changes
5. Follow the patterns in [DECISIONS_LOG.md](./DECISIONS_LOG.md) for architectural decisions

---

## Document Maintenance

All documentation should be updated when:
- Features are added or modified
- Bugs are fixed
- Architecture decisions are made
- Design system is updated
- New issues are discovered

Keep "Last Updated" dates current on all documents.

---

**End of Documentation Index**
