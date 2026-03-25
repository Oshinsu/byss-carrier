---
name: harness
description: Run the GAN-inspired Generator/Evaluator harness on any task. Use when asked to "build and verify", "create with QA", "harness mode", "GAN mode", or when a task needs iterative improvement with honest evaluation.
---
# GAN Harness Skill

Architecture: Generator (builds) + Evaluator (critiques) + Context Resets

When triggered:
1. PLAN: Break the task into sprints with acceptance criteria
2. GENERATE: Execute sprint (Sonnet)
3. EVALUATE: Score result with skeptical evaluator (MiniMax or different model)
4. If score < 75: iterate or pivot
5. If score >= 75: next sprint
6. Context reset between sprints (handoff document)

Key principle: The evaluator is ALWAYS skeptical. If it finds 0 issues, it hasn't looked hard enough.

## Models
- Generator: `anthropic/claude-sonnet-4-6` (speed)
- Evaluator: `minimax/minimax-m2.7` (cheap, different perspective)
- Planner: `anthropic/claude-sonnet-4-6`

## API
POST `/api/harness` with actions:
- `evaluate_page` — Score one page (pagePath or pageContent)
- `plan_task` — Break task into sprints
- `execute_sprint` — Run one Generator/Evaluator loop
- `full_run` — Complete harness until acceptance
- `evaluate_random_pages` — Cron: evaluate N random pages

## Evaluation Criteria (25pts each = 100 total)
1. FONCTIONNALITE: Features work? No mocks?
2. QUALITE CODE: Error handling, loading, toast, TypeScript strict?
3. DESIGN: MODE_CADIFOR? Cyan EXECUTOR? Animations?
4. INTEGRATION: Synergies wired? RAG? Supabase CRUD? Real APIs?

## Handoff Document
Between sprints, the context resets. Only a compressed handoff doc transfers:
- Completed tasks
- Remaining tasks
- Key decisions
- Files modified
- Known issues
- Context summary (compressed)

## Cost
~$0.015 per Generator+Evaluator cycle. Average task: 3-5 iterations = ~$0.05-0.08.
