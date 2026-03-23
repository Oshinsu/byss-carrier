---
name: deploy
description: Deploy BYSS Carrier to Netlify. Triggers on "deploy", "ship", "mise en prod", or "push to prod".
---

# Instructions

Execute the deployment sequence for BYSS Carrier:

**Step 1 — Build**
```bash
cd "C:/Users/Gary/Desktop/BYSS GROUP/byss-carrier" && npx next build
```
Capture: build time, route count, any warnings or errors.

**Step 2 — Evaluate Build Result**
- If build succeeds (exit code 0): proceed to deploy
- If build fails: show the error output, identify the failing file and line, suggest a fix. Do NOT deploy.

**Step 3 — Deploy**
```bash
npx netlify deploy --prod
```
Capture: deployment URL, deploy ID, deploy time.

**Step 4 — Report**
```
DEPLOY REPORT — [Date + Time]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build: [SUCCESS/FAIL]
Build time: [X]s
Routes: [X] pages
Warnings: [X]

Deploy: [SUCCESS/FAIL]
URL: [deployment URL]
Deploy ID: [ID]

Issues: [any warnings or notes]
```

**Error Handling:**
- TypeScript errors: show file, line, and fix suggestion
- Missing env vars: list which ones are missing from `.env.local`
- Build memory issues: suggest `NODE_OPTIONS=--max-old-space-size=4096`
- Netlify auth issues: prompt user to run `npx netlify login`
