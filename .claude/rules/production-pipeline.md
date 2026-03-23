---
paths:
  - "src/**/production/**"
  - "src/**/studio/**"
---
# Production Pipeline Rules

## SOTA Stack (March 2026) — All via Replicate
- Video: Kling 3.0 via Replicate ($0.029/sec, 6 multi-shot, 15s, native audio)
- Image: Nano Banana Pro via Replicate ($0.09-0.12/image, 4K, text rendering)
- Music: MiniMax Music 2.5+ via Replicate ($0.075/run)
- TTS: XTTS-v2 via Replicate (Caribbean accent clone) or Qwen3-TTS (open source)
- Edit: BYSS Studio (Remotion-based) or OpenCut (47K stars, MIT, Next.js)

## Pipeline Stages (SEQUENTIAL — dependencies matter)
1. Context Images → generate character refs, environment refs (Nano Banana Pro)
2. Style Lock → review & approve visual style, lock Element Library
3. Storyboard → generate shot list with descriptions (Claude/Kael)
4. Video Generation → Kling 3.0 multi-shot per scene
5. Audio → Music (MiniMax via Replicate) + Voice-off (XTTS-v2 via Replicate / Qwen3-TTS)
6. Beat Sync → align cuts to music beats (BeatSync-Engine pattern)
7. Assembly → Remotion composition + final render
8. Review → quality check + client approval

## Templates
- Teaser Soirée 25s (9:16) — flyer + event → vertical teaser with music
- Clip Musical 60-90s (16:9) — track + photos → music video
- Pub Restaurant 15s (9:16) — plat photos + nom → social ad
- Court-Métrage 3-5min (16:9) — script + refs → short film
- Trailer JW 30s (16:9) — faction + scene → cinematic trailer
- Story Instagram 15s (9:16) — photo + text → animated story

## Cost Awareness
- All generation routed through Replicate (single API token)
- Batch generate context images before starting video
- Use MiniMax M2.7 for prompt refinement, Opus only for final creative review
- Log every generation cost via usage-tracker
