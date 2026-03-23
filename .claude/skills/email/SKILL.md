---
name: email
description: Draft a sales email for a prospect in MODE_CADIFOR style. Use when user wants to write an email, relance, or outreach message.
---

# Instructions

Accept two inputs:
1. **Prospect name** — used to pull data from Supabase `prospects` table
2. **Email type** — one of: `cold`, `followup`, `proposal`, `meeting`, `relance`

Pull the prospect's data from Supabase: name, key_contact, sector, pain_points, memorable_phrase, phase, last_contact, notes.

Draft the email following MODE_CADIFOR rules:

- **Length**: 5-8 lines maximum. No padding, no filler.
- **Opening**: Always "Bonjour [Prénom]," — never "Cher", never "Madame/Monsieur"
- **Forbidden phrases**: Never use "n'hésitez pas", "je me permets de", "suite à notre conversation", "je reviens vers vous"
- **CTA**: Every email ends with one concrete, specific call to action (propose a date, ask a yes/no question, send a link)
- **Memorable phrase**: Weave the prospect's memorable_phrase naturally into the body
- **Tone**: Direct, warm, confident. No supplication. We are peers, not vendors begging.

Output format:
```
Objet: [Subject line — max 8 words, curiosity-driven]

Bonjour [Prénom],

[Body — 5-8 lines]

Gary Bissol
Fondateur — BYSS GROUP SAS
```

Adapt tone by type:
- `cold`: Pattern interrupt opening, reference their sector pain
- `followup`: Reference last interaction, add new value
- `proposal`: Attach context, 3 options teaser, urgency
- `meeting`: Confirm date/time, agenda in 3 bullets
- `relance`: Short, direct, one question only
