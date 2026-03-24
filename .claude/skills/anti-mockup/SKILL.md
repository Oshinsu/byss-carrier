---
name: anti-mockup
description: Hunt and kill all fake data, mock ups, placeholder content, and hardcoded demos. Triggers on "mockup", "mock", "fake data", "placeholder", "hardcoded", "anti-fake", "real data only".
---

# Anti-Mockup Skill — Zero Fake Data Policy

## Mission
Every piece of data in BYSS Carrier MUST come from a real source:
- Supabase tables (407+ entries)
- External APIs (BOAMP, Sirene, Transport, Culture, Polymarket)
- localStorage persistence
- User input
- AI generation (Claude)

## What to hunt:

### 1. Hardcoded arrays pretending to be data
Search for patterns like:
```
const FAKE_DATA = [
const DEMO_DATA = [
const MOCK_
const SAMPLE_
// Mock data
// Fake data
// TODO: replace with real
setTimeout(() => { // simulating
```

### 2. Static numbers that should be dynamic
Search for:
- KPI cards with hardcoded numbers (should fetch from Supabase)
- Progress bars with fixed percentages
- Counts that never change

### 3. Buttons that don't do anything
Search for:
- `onClick={() => {}}` (empty handlers)
- `onClick={() => console.log(` (log-only handlers)
- `// TODO` in click handlers

### 4. API calls that return fake data
Search for:
- `setTimeout` used to simulate API latency
- `Math.random()` used to generate fake metrics
- `Promise.resolve(fakeData)` patterns

## What's ACCEPTABLE:
- Default/initial state values (0, empty arrays) that get populated
- Fallback values when API fails (graceful degradation)
- Constants that ARE the data (CADIFOR_LAWS, CPV_CODES, NAF_TO_SECTOR)
- Template structures (MARCHE_STATUSES, PIPELINE_PHASES)

## Action:
For each fake data found:
1. Identify the real data source (Supabase table, API, localStorage)
2. Replace with a real fetch
3. Add loading state
4. Add error handling
5. Add toast feedback if it's a write operation
