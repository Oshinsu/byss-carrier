---
name: video
description: Generate a Kling 3.0 or Nano Banana Pro prompt from a creative brief. Use when user wants to create a video, animation, or visual content.
---

# Instructions

Accept a creative brief as input (free text describing the desired video/image).

Transform into a structured prompt following the MASTER_PROMPT architecture:

1. **Subject** — Who/what is the main focus. Be specific: age, appearance, clothing, expression.
2. **Action** — What is happening. Use active, dynamic verbs.
3. **Environment** — Where it takes place. Include time of day, weather, setting details.
4. **Composition** — Camera angle, framing, depth of field. Be cinematic.
5. **Lighting** — Natural, studio, neon, golden hour, etc. Specify direction and quality.
6. **Style** — Photorealistic, cinematic, anime, editorial, etc.

For video prompts, add:
- **Camera Movement** — Pan, tracking shot, dolly zoom, crane, handheld, etc.
- **Duration** — 5s or 10s (Kling standard durations)
- **Aspect Ratio** — 16:9 (landscape), 9:16 (portrait/reels), 1:1 (square)

Output format:
```
PROMPT (copy-paste ready):
[Full structured prompt in one paragraph, comma-separated descriptors]

NEGATIVE PROMPT:
[Elements to avoid: blur, distortion, watermark, text, extra limbs, etc.]

SETTINGS:
- Model: [Kling 3.0 / Nano Banana Pro]
- Duration: [5s / 10s]
- Aspect: [16:9 / 9:16 / 1:1]
- Camera: [movement type]
- Mode: [Standard / Professional]
```

Rules:
- Keep prompts under 200 words
- Front-load the most important descriptors
- Use cinematic language: "shallow depth of field", "volumetric lighting", "anamorphic lens flare"
- Never use abstract or vague terms. Every word must paint a visual.
- If the user provides a reference image, describe it in prompt-compatible language

Optionally, if `/api/replicate` is configured, offer to trigger generation directly.
