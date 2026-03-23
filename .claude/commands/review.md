---
description: Review toutes les modifications depuis le dernier commit. Audit qualité MODE_CADIFOR.
---
## Fichiers modifiés

!`git diff --name-only HEAD`

## Diff complet

!`git diff HEAD`

Analyse les modifications ci-dessus:
1. **Bugs** — erreurs logiques, null checks manquants, race conditions
2. **TypeScript** — types manquants, any implicites, imports inutilisés
3. **Design System** — couleurs hardcodées (doit être CSS vars), fonts incorrectes
4. **MODE_CADIFOR** — textes verbeux, mots interdits ("très", "vraiment", etc.)
5. **Sécurité** — credentials exposées, XSS, injection SQL
6. **Performance** — re-renders inutiles, fetches dans les render loops

Pour chaque problème: fichier, ligne, gravité (🔴/🟡/🟢), fix proposé.
