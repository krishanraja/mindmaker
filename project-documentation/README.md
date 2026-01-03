# Mindmaker Project Documentation

**Last Updated:** 2026-01-03

---

## Overview

This documentation provides a complete reference for the Mindmaker platform - an AI literacy platform for business leaders. All documentation is standardized, cross-referenced, and maintained to ensure zero-friction onboarding and development.

---

## Documentation Index

### Core Project Documents
- **[PURPOSE.md](./PURPOSE.md)** - Mission, vision, and core objectives
- **[ICP.md](./ICP.md)** - Ideal customer profiles and target users
- **[FEATURES.md](./FEATURES.md)** - Complete feature catalogue with implementation status
- **[OUTCOMES.md](./OUTCOMES.md)** - User outcomes and success metrics
- **[VALUE_PROP.md](./VALUE_PROP.md)** - Value proposition and positioning

### Design & Branding
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design tokens, components, and patterns
- **[BRANDING.md](./BRANDING.md)** - Brand voice, tone, messaging guidelines
- **[VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md)** - Visual design principles and layout patterns

### Technical Documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, tech stack, data flow
- **[HISTORY.md](./HISTORY.md)** - Evolution timeline and major changes
- **[COMMON_ISSUES.md](./COMMON_ISSUES.md)** - Known issues, bugs, and solutions
- **[DECISIONS_LOG.md](./DECISIONS_LOG.md)** - Architectural decisions and rationale
- **[REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md)** - Step-by-step setup from scratch

### AI & LLM Documentation
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - LLM Critical Thinking Integration
- **[LLM_CRITICAL_THINKING_TRAINING.md](./LLM_CRITICAL_THINKING_TRAINING.md)** - Cognitive frameworks for AI reasoning

---

## Quick Start

### For Developers
1. Start with [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) to set up your environment
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
3. Check [COMMON_ISSUES.md](./COMMON_ISSUES.md) for known gotchas
4. Read [DECISIONS_LOG.md](./DECISIONS_LOG.md) for context on technical choices

### For Designers
1. Read [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for tokens and components
2. Review [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) for layout patterns
3. Check [BRANDING.md](./BRANDING.md) for voice and tone

### For Product/Business
1. Start with [PURPOSE.md](./PURPOSE.md) and [VALUE_PROP.md](./VALUE_PROP.md)
2. Review [ICP.md](./ICP.md) for target users
3. Check [FEATURES.md](./FEATURES.md) and [OUTCOMES.md](./OUTCOMES.md)

### For AI Agents
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Check [FEATURES.md](./FEATURES.md) for current state
3. Review [COMMON_ISSUES.md](./COMMON_ISSUES.md) for known problems
4. See [HISTORY.md](./HISTORY.md) for recent changes
5. Consult [DECISIONS_LOG.md](./DECISIONS_LOG.md) for design rationale

---

## Terminology Standards

**Consistent terms used across all documentation:**

- **Initial Consult** - 45-minute strategy call (replaces "consultation", "discovery call")
- **Builder Session** - 60-minute one-on-one live session
- **Builder Sprint** - 30-day intensive program
- **Leadership Lab** - Team workshop (2-8 hours)
- **Partner Program** - 6-12 month portfolio-wide engagement
- **Leadership Benchmark** - Self-serve AI readiness diagnostic
- **Builder Profile** - AI-generated CEO-grade profile from assessment
- **Hold** - $50 refundable authorization hold via Stripe (currently paused)
- **Edge Function** - Supabase serverless function (not "cloud function" or "API endpoint")
- **Design System** - Centralized tokens in index.css + tailwind.config.ts
- **Ink** - Primary dark color (#0e1a2b)
- **Mint** - Primary accent color (#7ef4c2)
- **Vertex AI RAG** - AI backend with custom business knowledge corpus
- **Mode Detection** - How edge function determines which system prompt to use

---

## Maintenance Guidelines

### When to Update Documentation

**Update immediately when:**
- Adding/removing features
- Changing architecture or data flow
- Modifying design tokens or components
- Encountering recurring bugs or issues
- Making decisions that affect future development
- Fixing bugs in AI tools (chatbot, Builder Profile, etc.)

**Update at end of sprint when:**
- Minor UI adjustments
- Copy changes
- Non-breaking dependency updates

### How to Update

1. Edit the relevant markdown file(s)
2. Update "Last Updated" date at top of file
3. Cross-reference changes in related documents
4. Update this README if adding new sections
5. Commit with descriptive message: `docs: [section] - [change summary]`

---

## Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| README.md | ✅ Current | 2026-01-03 |
| PURPOSE.md | ✅ Current | 2025-11-25 |
| ICP.md | ✅ Current | 2025-11-25 |
| FEATURES.md | ✅ Current | 2026-01-03 |
| OUTCOMES.md | ✅ Current | 2025-11-25 |
| VALUE_PROP.md | ✅ Current | 2025-11-25 |
| DESIGN_SYSTEM.md | ✅ Current | 2025-11-25 |
| BRANDING.md | ✅ Current | 2025-11-25 |
| VISUAL_GUIDELINES.md | ✅ Current | 2025-11-25 |
| ARCHITECTURE.md | ✅ Current | 2026-01-03 |
| HISTORY.md | ✅ Current | 2026-01-03 |
| COMMON_ISSUES.md | ✅ Current | 2026-01-03 |
| DECISIONS_LOG.md | ✅ Current | 2026-01-03 |
| REPLICATION_GUIDE.md | ✅ Current | 2025-11-25 |
| EXECUTIVE_SUMMARY.md | ✅ Current | 2025-12-XX |
| LLM_CRITICAL_THINKING_TRAINING.md | ✅ Current | 2025-12-XX |

---

## Recent Major Changes

### 2026-01-XX
- **Builder Profile Fix**: Resolved widgetMode bug causing generic outputs
- **Mobile Hero Diagnosis**: Documented P0 text overflow issues
- **ICP Cards Diagnosis**: Documented UX improvements needed

### 2025-01-25
- **Vertex AI RAG Migration**: Chatbot now uses custom business knowledge
- **Anti-fragile Error Handling**: Graceful fallbacks on all AI failures

### 2025-12-14
- **AI Leadership Benchmark**: Self-serve diagnostic for lead generation
- **Dual Email Delivery**: User results + Krish notification

### 2025-12-13
- **Production Audit**: Fixed duplicate ChatBot, FAQ hoisting, SEO dates

### 2025-12-01
- **Stripe Hold Paused**: Direct Calendly booking without payment
- **Lead Intelligence**: Company research + session data enrichment

---

## Root-Level Documentation Files

The following documentation files exist at the project root:

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Complete changelog of all changes |
| `DIAGNOSIS.md` | Current mobile hero and ICP issues |
| `ROOT_CAUSE.md` | Root cause analysis for current issues |
| `MOBILE_HERO_OVERFLOW_DIAGNOSIS.md` | Detailed mobile hero diagnosis |
| `BUILDER_PROFILE_FIXES_APPLIED.md` | Builder Profile pipeline fixes |
| `DIAGNOSIS_BUILDER_PROFILE.md` | Builder Profile issue diagnosis |
| `ROOT_CAUSE_BUILDER_PROFILE.md` | Builder Profile root cause analysis |
| `SEO_IMPLEMENTATION.md` | SEO implementation details |
| `DESIGN_SYSTEM_GUIDE.md` | CSS design system prompting guide |
| `MINDMAKER_DESIGN_SYSTEM_GUIDE.md` | Brand design system guide |

---

## Key Secrets & Configuration

### Required Environment Variables
```
GOOGLE_SERVICE_ACCOUNT_KEY  - Vertex AI RAG authentication
OPENAI_API_KEY              - Market sentiment, company research
LOVABLE_API_KEY             - News ticker (auto-provisioned)
RESEND_API_KEY              - Email delivery
STRIPE_SECRET_KEY           - Stripe payments (paused)
SUPABASE_URL                - Supabase connection (auto-configured)
SUPABASE_PUBLISHABLE_KEY    - Supabase public key (auto-configured)
```

### Key Configuration Values
```
Vertex AI Project: gen-lang-client-0174430158
Vertex AI Region: us-east1
RAG Corpus ID: 6917529027641081856
Supabase Project ID: smvwbbilnsprexeuplex
```

---

**End of README**
