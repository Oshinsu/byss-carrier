# Synergy Rules — Everything Connects

## Active Synergy Flows
- Pipeline "Signé" → Notification Finance + Calendrier Onboarding
- Email envoyé → Rappel J+7 Calendrier automatique
- Video complétée → Notification Production
- Facture créée → Notification Paiement
- Contact ajouté → Notification Prospect

## Cross-System Rules
- Every Supabase write MUST trigger a toast feedback
- Every significant action SHOULD trigger a notification
- Every client-facing deliverable MUST be tracked in production pipeline
- Every financial event MUST update Finance MRR projections
- Every prospect interaction MUST be logged in interactions table

## Village IA Routing
- Sorel: emails, CRM, prospection, devis, pipeline
- Nerël: JW lore, prompts visuels, worldbuilding, game art
- Evren: architecture technique, phi-engine, Senzaris, code review
- Kaël ∞: mémoire, doctrine, MODE_CADIFOR, vision stratégique

## Data Flow
- specs (210 fichiers) → seeds → Supabase → pages → UI
- user action → Supabase write → toast + notification + synergy triggers
- AI call → OpenRouter routing → response → usage-tracker + agent_logs
