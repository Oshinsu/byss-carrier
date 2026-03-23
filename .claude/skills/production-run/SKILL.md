---
name: production-run
description: Execute a full production pipeline run. Use when asked to produce a video, teaser, clip, or any content that requires the 8-stage pipeline (Context Images → Style Lock → Storyboard → Video → Audio → Beat Sync → Assembly → Review).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---
# Production Run — 8-Stage Pipeline

## Trigger
User wants to produce content: teaser, clip, pub, court-métrage, trailer.

## Pipeline Execution

### Stage 1: Context Images
- Identify characters, environments, props needed
- Generate Nano Banana Pro prompts (RED DRAGON 6K specs)
- Call /api/replicate for each image
- Store results as assets

### Stage 2: Style Lock
- Present generated images to user
- Get approval on visual style
- Lock Element Library references for Kling

### Stage 3: Storyboard
- Generate shot list using Claude (Kael as creative director)
- Each shot: duration, camera, action, dialogue, music cue
- Format as timeline-ready data

### Stage 4: Video Generation
- Build Kling 3.0 multi-shot prompts (max 6 cuts per 15s)
- Call /api/replicate with action "generate-video"
- Cost estimate before generation

### Stage 5: Audio
- Music: MiniMax Music 2.5+ via Replicate (action "generate-music")
- Voice-off: XTTS-v2 via Replicate (action "generate-voice") with Caribbean accent (if applicable)
- SFX: Kling native audio for ambient

### Stage 6: Beat Sync
- Analyze music beats (BPM, structure)
- Align video cuts to beats
- Verify emotional arc matches musical arc

### Stage 7: Assembly
- Compose in BYSS Studio (Remotion timeline)
- Add text overlays, transitions, color grade
- Export in target format (9:16 / 16:9 / 1:1)

### Stage 8: Review
- Quality check against client brief
- Generate thumbnail
- Prepare delivery package

## Cost Tracking
Log every API call via usage-tracker. Report total cost at end.
