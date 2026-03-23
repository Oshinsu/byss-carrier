---
name: status
description: Show BYSS EMPIRE operational status. Triggers on "status", "état", "health", or "empire status".
---

# Instructions

Gather operational data from multiple sources and display an empire-level status dashboard.

**1. Application**
- Run `npx next build` (dry run or check last build) to get route count
- List all page routes from the `app/` directory
- Last successful build timestamp

**2. Supabase**
- List all tables and their row counts (query `information_schema.tables` or each table)
- Check connection status
- Note any tables with 0 rows

**3. GitHub**
- Count repos (reference: 34 repos in BYSS ecosystem)
- Last commit date on byss-carrier
- Any open PRs or issues

**4. Agents**
- List configured AI agents/automations
- Their status (active/inactive)

**5. Environment**
- Check `.env.local` for required keys: SUPABASE_URL, SUPABASE_ANON_KEY, CLAUDE_API_KEY, NETLIFY_AUTH_TOKEN, etc.
- Report configured vs missing keys (never show actual values)

**6. Infrastructure**
- Disk usage on project directory
- Node.js version
- Next.js version
- Package count from package.json

Display as:
```
BYSS EMPIRE — STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

APPLICATION    [OK/WARN/FAIL]  [X] routes | Last build: [date]
SUPABASE       [OK/WARN/FAIL]  [X] tables | [X] total rows
GITHUB         [OK/WARN/FAIL]  [X] repos | Last commit: [date]
AGENTS         [OK/WARN/FAIL]  [X] active / [X] total
ENVIRONMENT    [OK/WARN/FAIL]  [X]/[X] keys configured
INFRA          [OK/WARN/FAIL]  Node [v] | Next [v] | [X] packages

ALERTS: [any warnings or issues requiring attention]
```
