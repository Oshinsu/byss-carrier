---
paths:
  - "src/**/studio/**"
  - "src/**/byss-games/**"
  - "src/**/jurassic-wars/**"
---
# Game Development Rules — BYSS GAMES STUDIO

## Godot 4 (JW Villages + Le Traducteur)
- GDScript preferred over C# for prototyping speed
- Use Resources for data-driven values (no magic numbers in code)
- Delta time in all movement/animation calculations
- Signal-based architecture (decouple systems)
- Export variables for designer-tunable values

## Game Design
- MDA Framework: define Mechanics → predict Dynamics → target Aesthetics
- Every system needs a GDD section with: core loop, formulas, edge cases, fail states
- Economy: simulate before implementing (spreadsheet → prototype → production)
- Bartle types: every feature should serve at least 2 player types
- Accessibility: WCAG 2.1 AA minimum, colorblind modes, remappable controls

## Production
- Sprint = 1 week (solo dev cadence)
- INVEST stories: Independent, Negotiable, Valuable, Estimable, Small, Testable
- Definition of Done: plays without crash, has 1 test, documented in GDD
- Prototype budget: 4 weeks max per game before go/no-go

## AI Integration
- Claude API for NPC dialogue (Le Traducteur)
- Suno for dynamic OST per civilization (JW Villages)
- Kling 3.0 for cinematic trailers
- Replicate for character reference sheets

## Asset Pipeline
- Higgsfield → Replicate → Blender → Godot/UE5
- Naming: {game}_{type}_{name}_{variant}.{ext} (e.g., jw_char_evil_pichon_idle.png)
- Max texture size: 2048x2048 for mobile, 4096 for desktop
- Audio: OGG Vorbis for Godot, WAV for UE5
