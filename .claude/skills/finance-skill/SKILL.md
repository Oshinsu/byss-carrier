---
name: finance-skill
description: Show BYSS GROUP financial summary. Triggers on "finance", "argent", "CA", "revenue", "trésorerie", or "dashboard financier".
---

# Instructions

Query Supabase for financial data across multiple tables:

1. **Invoices** (table: `invoices` or relevant)
   - Total facturé HT (all invoices)
   - Total payé (status = paid)
   - Total impayé / overdue (status = pending, due_date < today)
   - Encours client

2. **Pipeline** (table: `prospects`)
   - Pipeline total (sum of estimated_basket, active phases)
   - Pipeline pondéré (sum of estimated_basket * probability / 100)
   - MRR actuel (recurring revenue from won deals)
   - MRR projected (from pipeline weighted)

3. **Trading** (table: `trades` if exists)
   - Gulf Stream strategy PnL
   - Open positions
   - MTD performance

Display as a compact financial dashboard:

```
FINANCES BYSS GROUP — [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHIFFRE D'AFFAIRES
MTD: [X] EUR | YTD: [X] EUR
Facturé: [X] EUR | Payé: [X] EUR | Impayé: [X] EUR

PIPELINE
Valeur totale: [X] EUR | Pondéré: [X] EUR
MRR actuel: [X] EUR | MRR projeté: [X] EUR

TRADING (GULF STREAM)
PnL MTD: [X] EUR | Positions ouvertes: [X]

AVANTAGES FISCAUX ELIGIBLES
- JEI (Jeune Entreprise Innovante): [status]
- CIR (Crédit Impôt Recherche): [eligible amount estimate]
- CII (Crédit Impôt Innovation): [eligible amount estimate]
```

If certain tables don't exist yet, note them as "not configured" and suggest the schema.
