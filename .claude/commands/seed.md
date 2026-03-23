---
description: Run tous les seeds Supabase et affiche les totaux.
argument-hint: [optional: specific-seed-name]
---
## Seed Supabase

Si un argument est fourni, run seulement ce seed:
!`ls scripts/seed-*.mjs`

Si $ARGUMENTS est vide, run tous les seeds dans l'ordre:
```
node scripts/seed-intelligence.mjs
node scripts/seed-bible.mjs
node scripts/seed-war-plans.mjs
node scripts/seed-strategy.mjs
node scripts/seed-jw-lore.mjs
node scripts/seed-lore-extended.mjs
node scripts/seed-village-lore.mjs
node scripts/seed-evren-lore.mjs
node scripts/seed-games-extended.mjs
node scripts/seed-arsenal-prompts.mjs
```

Après chaque seed, affiche le résultat. À la fin, compte les totaux Supabase.
