---
description: Deploy BYSS Carrier sur Vercel. Vérification pré-deploy + push.
---
## Pre-deploy checks

!`npx tsc --noEmit 2>&1 | tail -5`

!`git status --short`

Avant de déployer:
1. Vérifie que tsc --noEmit a 0 erreurs
2. Vérifie qu'il n'y a pas de fichiers sensibles (.env, clés API) dans les fichiers staged
3. Liste les fichiers modifiés non commités
4. Si tout est clean: propose un commit message MODE_CADIFOR et déploie
