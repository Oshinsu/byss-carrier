# BYSS CARRIER — The Executor

## Identity
Vaisseau amiral du BYSS EMPIRE. CRM + Production + Intelligence + Finance + Village IA.
Stack: Next.js 16.2, Supabase, Claude API, Zustand, Tailwind 4, motion/react.

## Commands
```
pnpm dev          # Dev server (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm seed         # Seed Supabase tables
```

## Architecture
- `src/app/(admin)/` — 79 admin pages (use client)
- `src/app/api/` — 13 API routes (AI, email, PDF, Polymarket, Replicate)
- `src/components/` — 36 shared components (ui/, layout/, village/, pipeline/)
- `src/lib/` — 58 modules (ai/, agents/, phi/, finance/, village/, supabase/)
- `src/hooks/` — useLocalStorage, useToast, useSupabase, useAI, useKeyboardShortcuts
- `src/types/index.ts` — All types centralized (504 lines)
- `src/lib/constants.ts` — All constants (366 lines)
- `src/lib/store.ts` — Zustand stores (Sidebar, Pipeline, Finance, Production, Village)

## Design System — EXECUTOR
- Background: #06080F (deep space), #0A0A14 (sidebar), #0F0F1A (panels)
- Accent: Cyan (#00B4D8, #00D4FF) — NO GOLD ANYWHERE
- Alert: Sith red (var(--color-red))
- Font: Clash Display (titles), system sans (body), monospace (code/timecodes)
- CSS vars: --color-gold = CYAN (redefined), --color-cyan, --color-red, --color-border-subtle

## MODE_CADIFOR — 8 lois
1. Compression Souveraine — chaque phrase porte 3 niveaux
2. Confiance au lecteur — jamais expliquer, jamais paraphraser
3. Stichomythie — dialogues coupés, nets
4. Souveraineté — la phrase correcte contient déjà sa raison
5. Lux as Syntax — chaque objet est un signe de civilisation
6. Humour comme preuve — raccourci vers le pouvoir
7. Le détail qui pense — chaque micro-événement prouve le pouvoir intégré
8. Phrase mémorable — unité minimum: la phrase gravable

## Mots interdits
"très", "vraiment", "assez" (faible), "je pense que", "c'est-à-dire", "en d'autres termes", "n'hésitez pas"

## Supabase (407 entries)
- `intel_entities` (67) — 5 cartographies Martinique
- `lore_entries` (288) — bible 92, JW 128, éveil 18, village 50
- `prospects` (32) — Pipeline CRM
- `contacts_directory` (20)
- `notifications`, `calendar_events`, `gulf_positions`, `project_milestones`, `image_jobs`, `music_jobs`

## API Routing (SOTAI V3)
- Bulk/cheap → MiniMax M2.7 via OpenRouter ($0.30/M)
- Code → Kimi K2.5 via OpenRouter
- Analysis → Claude Opus 4.6 via OpenRouter ($15/M)
- Finance → DeepSeek V3.2 via OpenRouter
- Default → Claude Sonnet 4.6
- Direct Anthropic → Village IA, Email Sorel, briefing

## Watch out for
- SWC blocked by Windows AppControl — works fine on Netlify (Linux)
- `--color-gold` CSS var = CYAN (renamed but kept for backward compat)
- Auth middleware: only garybyss972@gmail.com and gary@byss-group.com
- Factur-X mandatory September 2026 — system built and ready
