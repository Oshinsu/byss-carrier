---
name: brief
description: Generate the morning briefing for BYSS EMPIRE. Triggers on "brief", "bonjour", "morning", or "briefing".
---

# Instructions

Query Supabase for the following data:

1. **Relances** — prospects where `followup_date <= today` and phase is not `gagné` or `perdu`. List company + days overdue.
2. **RDVs today** — prospects in phase `rdv` or `demo` with activity today.
3. **Pipeline KPIs**:
   - CA signé (sum of `estimated_basket` where phase = `gagné`)
   - CA pondéré (sum of `estimated_basket * probability / 100` for active prospects)
   - MRR actuel (sum of `mrr` where phase = `gagné`)
   - Nombre de prospects actifs
4. **Recent activity** — last 3 prospect interactions (from notes or activity log).

Format as a compressed 15-line maximum briefing:

```
BRIEFING BYSS EMPIRE — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RELANCES URGENTES (X)
- [Company] — J+[days overdue] — [next_action]

RDV DU JOUR (X)
- [Time] — [Company] — [Contact] — [Objective]

PIPELINE
CA signé: [X]k EUR | Pondéré: [X]k EUR | MRR: [X] EUR
Prospects actifs: [X] | Hot (score>=4): [X]

INSIGHT: [One strategic observation based on the data]
PHRASE DU JOUR: "[One memorable phrase from a hot prospect]"
```

Keep it dense. No fluff. This is a war room briefing, not a newsletter.
