---
name: pipeline
description: Show CRM pipeline statistics. Triggers on "pipeline", "funnel", "prospects", or "CRM stats".
---

# Instructions

Query the Supabase `prospects` table. Group all prospects by `phase`.

Calculate and display:

**Pipeline by Phase**

| Phase | Count | Total Basket (EUR) | Weighted (EUR) | Avg Score |
|---|---|---|---|---|
| Lead | ... | ... | ... | ... |
| Qualifié | ... | ... | ... | ... |
| RDV | ... | ... | ... | ... |
| Demo | ... | ... | ... | ... |
| Proposition | ... | ... | ... | ... |
| Négociation | ... | ... | ... | ... |
| Gagné | ... | ... | ... | ... |
| Perdu | ... | ... | ... | ... |
| **TOTAL** | ... | ... | ... | ... |

**Key Metrics**
- Total pipeline value (all active phases)
- Weighted pipeline (sum of basket * probability / 100)
- Total MRR (from gagné prospects)
- Average deal size
- Average conversion probability

**Hot Prospects** (score >= 4 AND probability >= 50%)
List each with: name, phase, basket, probability, next_action

**Overdue Relances**
Count of prospects where followup_date < today. List the top 5 most overdue.

**Velocity**
- Average days per phase (if data available)
- Prospects moved this week/month
