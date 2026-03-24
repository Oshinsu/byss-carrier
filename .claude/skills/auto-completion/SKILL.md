---
name: auto-completion
description: Analyze every page's completion level, identify gaps, and auto-generate improvements. Triggers on "completion", "auto-improve", "auto-fix", "page audit", "what's missing", "completer", "améliorer automatiquement".
---

# Auto-Completion Skill — Self-Improving System

## Mission
Analyze each page of BYSS Carrier against what it PROMISES to deliver, score its real completion level, and generate the code to fill the gaps — autonomously.

## Pipeline (7 stages)

### Stage 1: Page Discovery
- List all pages in src/app/(admin)/
- For each page, read the first 50 lines to understand its purpose

### Stage 2: Promise Extraction
For each page, identify:
- What the page title/header promises
- What KPIs/widgets are shown (real vs hardcoded)
- What buttons exist and whether they work
- What Supabase tables it reads/writes
- What API routes it calls

### Stage 3: Reality Check
For each promise, verify:
- Does the button have a real onClick handler? (not empty, not console.log)
- Does the KPI fetch from Supabase? (not hardcoded number)
- Does the form actually INSERT/UPDATE? (not just setState)
- Does the toast fire after writes?
- Does the loading state exist?
- Does error handling exist?

### Stage 4: Scoring
Score each page 0-100:
- 0-25: Mockup (hardcoded data, fake buttons)
- 26-50: Skeleton (structure exists, no real data)
- 51-75: Functional (real data, some gaps)
- 76-90: Production (all features work, minor polish)
- 91-100: SOTA (real data, real actions, toasts, errors, loading, synergies)

### Stage 5: Gap Generation
For each gap identified:
- Generate the exact code fix needed
- Classify: quick-fix (< 5 lines) vs feature (> 5 lines)
- Estimate cost (MiniMax for analysis, Sonnet for generation)

### Stage 6: Auto-Fix (with gates)
For quick-fixes (< 5 lines):
- Apply automatically if score impact > 10 points
- Log to agent_logs

For features (> 5 lines):
- Create a pending_action for human approval
- Include the generated code in the payload
- Notification: "Page X: +15 points si on ajoute Y"

### Stage 7: Report
Generate a completion dashboard showing:
- All pages with scores
- Top 10 gaps by impact
- Estimated cost to reach 100%
- Auto-fix queue

## Model Routing
- Page analysis: MiniMax M2.7 ($0.30/M) — bulk, cheap
- Code generation: Claude Sonnet 4.6 ($3/M) — precise
- Architecture decisions: Claude Opus 4.6 ($15/M) — only if needed

## Autonomy Rules
1. NEVER modify code without logging to agent_logs
2. Quick-fixes (< 5 lines) can auto-apply
3. Features MUST go through pending_actions gates
4. Human approves via notification buttons
5. Each auto-fix generates a git-ready diff
6. Cost per run: ~$0.50-2.00 depending on page count
