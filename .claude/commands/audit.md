---
description: Audit complet du BYSS Carrier. Pages, Supabase, erreurs, extraction.
---
## Audit Carrier

1. **Pages HTTP** — Fetch toutes les routes et vérifie 200 OK
2. **Supabase** — Compte toutes les tables et entrées
3. **TypeScript** — Run tsc --noEmit
4. **Extraction** — Calcule le % de fichiers specs extraits dans l'app
5. **Boutons** — Vérifie qu'il n'y a pas de onClick manquants
6. **Design** — Cherche les couleurs hardcodées (#D4AF37, #E8C547)
7. **MODE_CADIFOR** — Cherche les mots interdits dans les strings JSX

Retourne un rapport avec des métriques et une note globale.
