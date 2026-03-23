---
name: prospect
description: Analyze a prospect from the CRM. Use when user mentions a company name, asks to look up a client, or wants to prepare for a sales meeting.
---

# Instructions

Query the Supabase `prospects` table for rows matching the provided company or contact name (use `ilike` for partial matching).

Display the following fields as a concise prospect card:

- **Name** / **Sector** / **Phase**
- **Score** (1-5) / **Probability** (%) / **Estimated Basket** (EUR)
- **Key Contact** / **Email** / **Phone**
- **Memorable Phrase** — the hook line tied to this prospect
- **Pain Points** — their core problems we solve
- **Notes** — latest context
- **Last Contact** / **Next Action** / **Followup Date**

If multiple prospects match the query, display all of them as separate cards.

After displaying the card, suggest the next action based on:
- If `followup_date` is overdue: recommend immediate relance with urgency note
- If phase is `lead`: recommend qualifying call
- If phase is `qualifié`: recommend booking a demo/RDV
- If phase is `rdv` or `demo`: recommend sending proposal
- If phase is `proposition`: recommend followup on decision
- If phase is `négociation`: recommend closing strategy
- If phase is `gagné`: recommend upsell or referral ask
