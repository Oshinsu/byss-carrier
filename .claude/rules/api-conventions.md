---
paths:
  - "src/app/api/**/*.ts"
---
# API Conventions

- All routes export POST handler (or GET for reads).
- Use SUPABASE_SERVICE_ROLE_KEY for server-side operations.
- Return shape: { data, error?, tokens? }
- Log to agent_logs table: agent name, action, model, tokens, cost, duration, success.
- For AI calls: use callOpenRouter() from @/lib/ai/router.ts for smart model routing.
- For expensive calls (Opus): use context-compressor to reduce tokens first.
- Track costs via logUsage() from @/lib/ai/usage-tracker.ts.
- Rate limit awareness: cache Polymarket responses 5min, GitHub 1min.
- CORS: CSP header allows *.supabase.co, api.anthropic.com, openrouter.ai, gamma-api.polymarket.com, youtube.com.
