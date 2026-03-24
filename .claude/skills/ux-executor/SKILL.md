---
name: ux-executor
description: Enforce the EXECUTOR UX philosophy across all pages. Triggers on "UX", "UI", "design", "améliorer l'interface", "rendre beau", "executor mode", "action first".
---

# UX EXECUTOR — AI First, Action First, BYSS GROUP First

## Philosophy

Every page of BYSS Carrier must feel like the bridge of a warship.
Not a dashboard. Not a SaaS. A COMMAND CENTER.

### 3 Principles

**1. AI FIRST**
- Every page has an AI action as PRIMARY CTA
- "Analyser avec Claude", "Générer le dossier", "Invoquer Sorel"
- The AI button is BIGGER, BRIGHTER, MORE PROMINENT than any CRUD button
- Empty states suggest AI actions, not manual entry

**2. ACTION FIRST**
- No page is read-only. Every page has a primary action.
- Pipeline: drag to close deals. Finance: create invoices. Production: generate content.
- Actions are 1 click away. No modals within modals. No "Are you sure?" except for deletions.
- Keyboard shortcuts on every critical action (⌘K command bar)

**3. BYSS GROUP FIRST**
- Every metric serves the business. No vanity metrics.
- Pipeline value > Prospect count. MRR > Invoice count. Conversion rate > Page views.
- The dashboard shows MONEY first, everything else second.
- MODE_CADIFOR: compression, memorable phrases, no filler.

## Visual Rules

### Layout
- Full bleed. No max-width containers on command pages.
- 3-column layout on desktop: nav | content | context panel
- Cards use glass morphism: bg-[#0F0F1A]/80 backdrop-blur border-[var(--color-border-subtle)]
- No rounded-full on action buttons. Use rounded-lg. Rounded = softness. This is a warship.

### Colors
- Primary actions: CYAN gradient (from-[#00B4D8] to-[#00D4FF])
- Destructive: RED (#FF2D2D)
- Success: EMERALD (#22C55E)
- Warning: AMBER (#F59E0B)
- Neutral: WHITE at 40% opacity
- NO GOLD ANYWHERE. Cyan is the new gold.

### Typography
- Page titles: font-clash-display, text-3xl, font-bold
- Section headers: font-clash-display, text-lg, font-semibold
- Body: system sans, text-sm, text-[var(--color-text-muted)]
- Numbers/metrics: font-mono, tabular-nums
- KPI values: font-clash-display, text-2xl+

### Animations
- Page entry: motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
- Card hover: hover:border-[#00B4D8]/40 transition-all
- Loading: skeleton shimmer (not spinners)
- Success: green checkmark flash
- No bouncing. No wiggling. Controlled. Precise. Military.

### Empty States
- Icon (lucide, 48px, opacity-20)
- MODE_CADIFOR phrase (memorable, compressed)
- PRIMARY AI ACTION button (not "Add manually")
- Example: "La forge est froide." → [Générer avec l'IA]

### KPI Cards
- Always show TREND (↑↓) with color
- Always show COMPARISON (vs last period)
- Click → navigate to detail
- 4 KPIs per row maximum
- Order: Money → Volume → Rate → Time

## Anti-Patterns (NEVER do)
- ❌ "Welcome to the dashboard!" — No greetings
- ❌ "You have 0 items" — Say something meaningful
- ❌ Gray buttons that do nothing
- ❌ Modals for simple actions (use inline edit)
- ❌ "Loading..." text (use skeleton)
- ❌ Success messages that last forever (2s max)
- ❌ Rounded-full buttons (this isn't Instagram)
- ❌ Light mode (EXECUTOR is dark only)
