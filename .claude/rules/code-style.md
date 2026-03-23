---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---
# Code Style — BYSS CARRIER

- TypeScript strict mode. No `any`. No unused imports.
- "use client" on every page and interactive component.
- Imports: lucide-react for icons, motion/react for animations, cn() for classnames.
- Colors: NEVER hardcode hex. Use CSS vars (--color-gold, --color-cyan, --color-red, --color-border-subtle).
- Exception: #0F0F1A for panel backgrounds, #0A0A14 for sidebar.
- Font: font-[family-name:var(--font-clash-display)] for titles.
- Supabase: import createClient from @/lib/supabase/client (browser) or server (RSC).
- State: prefer Zustand stores (src/lib/store.ts) over local useState for cross-page state.
- localStorage: use useLocalStorage hook from @/hooks/use-local-storage.ts, keys in STORAGE_KEYS (constants.ts).
- Empty states: MODE_CADIFOR phrases. Never "Aucun résultat trouvé."
- Error handling: try/catch on all Supabase calls. Show toast on error. Never fail silently.
- Loading: show SkeletonCard/SkeletonKPI from @/components/ui/loading-skeleton.tsx.
