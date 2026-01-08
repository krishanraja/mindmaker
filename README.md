# The Mindmaker - AI Literacy Platform

**Last Updated:** 2026-01-08

---

## Overview

The Mindmaker is an AI literacy platform for business leaders. We help non-technical executives and senior leaders build practical AI systems through hands-on coaching, not theory.

**Live Site:** [themindmaker.ai](https://themindmaker.ai)  
**Lovable Project:** [lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf](https://lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.3, TypeScript, Vite 5.x |
| Styling | TailwindCSS 3.x, Shadcn/ui, Framer Motion |
| Backend | Supabase Edge Functions (Deno) |
| AI | Vertex AI RAG (Gemini 2.5 Flash), Lovable AI Gateway, OpenAI |
| Email | Resend |
| Payments | Stripe (paused) |
| Scheduling | Calendly |
| Hosting | Lovable Cloud / Vercel |

---

## Quick Start

### Prerequisites
- Node.js 18+ (recommend using nvm)
- npm or pnpm

### Development
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd mindmaker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Shadcn base components
│   │   ├── ChatBot/    # AI chatbot system
│   │   ├── Animations/ # Visual effects
│   │   ├── Interactive/# Interactive demos
│   │   └── ShowDontTell/# Content sections
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks
│   ├── contexts/       # React contexts
│   ├── lib/            # Utilities
│   ├── data/           # Static data
│   └── index.css       # Design tokens
├── supabase/
│   └── functions/      # Edge functions
├── public/             # Static assets
├── project-documentation/  # Full documentation
└── package.json
```

---

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/builder-session` | 60-minute session details |
| `/builder-sprint` | 4-week intensive details |
| `/leadership-lab` | Team workshop details |
| `/portfolio-program` | Partner program details |
| `/leaders` | AI Leadership Benchmark diagnostic |
| `/blog` | Blog listing page |
| `/blog/:slug` | Individual blog posts |
| `/builder-economy` | Thought leadership page |
| `/faq`, `/privacy`, `/terms`, `/contact` | Support pages |

---

## Edge Functions

| Function | Purpose |
|----------|---------|
| `chat-with-krish` | AI chatbot (Vertex AI RAG + Gemini 2.5 Flash) |
| `get-ai-news` | News ticker (Lovable AI Gateway) |
| `get-market-sentiment` | Market analysis (OpenAI) |
| `send-lead-email` | Lead capture + enrichment |
| `send-contact-email` | Contact form |
| `send-leadership-insights-email` | Leadership Benchmark results |
| `create-consultation-hold` | Stripe checkout (paused) |

---

## Environment Variables

Required secrets in Supabase:
```
GOOGLE_SERVICE_ACCOUNT_KEY  - Vertex AI RAG
OPENAI_API_KEY              - Market sentiment, company research
RESEND_API_KEY              - Email delivery
LOVABLE_API_KEY             - News ticker (auto-provisioned)
STRIPE_SECRET_KEY           - Payments (paused)
```

---

## Documentation

Full documentation available in `/project-documentation/`:

- **[ARCHITECTURE.md](./project-documentation/ARCHITECTURE.md)** - System architecture
- **[FEATURES.md](./project-documentation/FEATURES.md)** - Feature catalogue
- **[DESIGN_SYSTEM.md](./project-documentation/DESIGN_SYSTEM.md)** - Design system guide
- **[COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md)** - Known issues & solutions
- **[HISTORY.md](./project-documentation/HISTORY.md)** - Change history
- **[DECISIONS_LOG.md](./project-documentation/DECISIONS_LOG.md)** - Design decisions
- **[DEPLOYMENT.md](./project-documentation/DEPLOYMENT.md)** - Deployment checklist

---

## Recent Changes (2026-01)

### Hero & Drawer UX Fixes (2026-01-06)
- Fixed horizontal scrollbar flash on page load
- Fixed side drawer content cut off behind navbar
- Added navbar-aware sheet positioning system

### Text Contrast System Fix (2026-01-05)
- Fixed WCAG AA contrast failures on dark backgrounds
- Added `dark-cta-card` component class
- Added `dark-card-*` text color utilities

### Builder Profile Pipeline Fix (2026-01-XX)
- Fixed `widgetMode: 'tryit'` bug causing generic outputs
- Added Builder Profile mode detection in edge function
- Improved fallback quality with LLM-generated responses

### AI Backend (2025-01-25)
- Migrated chatbot to Vertex AI RAG with custom corpus
- Gemini 2.5 Flash model with business-specific knowledge
- Anti-fragile error handling with graceful fallbacks

---

## Design System

| Element | Value |
|---------|-------|
| Primary Dark (Ink) | `#0e1a2b` |
| Primary Accent (Mint) | `#7ef4c2` |
| Display Font | Space Grotesk Variable |
| Body Font | Inter Variable |

### Typography System
- **Headings (h1-h6)**: Space Grotesk Variable
- **Body text**: Inter Variable
- **Fluid sizing**: Uses `clamp()` for responsive typography

### Dark Card Text (WCAG Compliant)
- Never use `text-white/80` on dark backgrounds
- Use `.dark-cta-card` class or `text-dark-card-*` utilities

---

## Deployment

### Via Lovable
1. Open [Lovable Project](https://lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf)
2. Click Share → Publish

### Via GitHub
1. Push to main branch
2. Auto-deploy to Lovable Cloud / Vercel
3. Edge functions auto-deploy to Supabase

---

## Contributing

1. Check [COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md) for known problems
2. Read [DECISIONS_LOG.md](./project-documentation/DECISIONS_LOG.md) for context
3. Follow design system in [DESIGN_SYSTEM.md](./project-documentation/DESIGN_SYSTEM.md)
4. Update documentation with your changes

---

## Support

- **Email:** krish@themindmaker.ai
- **Calendly:** Book directly via site CTAs

---

## License

Private repository. All rights reserved.
