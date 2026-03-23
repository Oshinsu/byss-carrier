---
name: research
description: Conduct deep research on any topic. Triggers on "research", "recherche", "investigate", "analyse marche", "competitor analysis", "veille", "benchmark".
---
# Research Skill

When triggered:
1. Identify the research question
2. Determine the domain and depth
3. Route to the appropriate model (quick=Haiku, medium=Sonnet, deep=Opus)
4. Execute the 7-stage pipeline
5. Present findings in structured format
6. Suggest synergies (save to Bible, add to Intel, link to Prospect)

## Pipeline Stages
1. **Question** — Reformulate for precision
2. **Sources** — Crawl web, Supabase lore_entries, local files
3. **Analysis** — Cross-reference findings, detect contradictions
4. **Synthesis** — Identify patterns, trends, gaps
5. **Hypothesis** — Generate actionable insights
6. **Validation** — Fact-check with alternative sources
7. **Report** — Produce structured summary

## Domain Routing
- Technology -> agent=evren, model=sonnet
- Market/Competition -> agent=sorel, model=sonnet
- Finance -> agent=sorel, model=deepseek-v3.2
- Legal -> agent=sorel, model=opus
- Geopolitics -> agent=kael (archive), model=opus
- Culture -> agent=nerel, model=sonnet

## Depth Levels
- Quick: 1 source, 2000 tokens, Haiku
- Medium: 3-5 sources, 4000 tokens, Sonnet
- Deep: 10+ sources, 8000 tokens, Opus

## Synergy Triggers
- Commercial domain -> suggest saving to Bible de Vente
- Geopolitics domain -> suggest adding to intel_entities
- Company research -> suggest linking to prospect in CRM

## Output Format
Always structure output as:
- Reformulated question
- Key findings with confidence levels
- Numbered sources
- MODE_CADIFOR synthesis
- Next action recommendation
