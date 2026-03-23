---
name: propose
description: Generate a commercial proposal PDF for a prospect. Use when user says "proposal", "devis", "offre commerciale", or "propose [company]".
---

# Instructions

1. **Pull prospect data** from Supabase `prospects` table: name, sector, key_contact, pain_points, estimated_basket, notes, memorable_phrase.

2. **Select 3-tier pricing** based on their sector and estimated basket:
   - **Essentiel** — entry offer, ~30% of estimated_basket. Core deliverable only.
   - **Croissance** — recommended offer, ~60% of estimated_basket. Core + optimization + support.
   - **Domination** — premium offer, 100% of estimated_basket. Full suite + priority + strategic advisory.

3. **Generate the PDF** by calling the `/api/pdf` endpoint (or generating locally) with the following sections:

   **Page 1 — Cover**
   - BYSS GROUP logo
   - "Proposition Commerciale"
   - Prospect company name
   - Date
   - "Confidentiel"

   **Page 2 — Context & Pain**
   - 3-5 bullet points summarizing their pain_points
   - 1 paragraph connecting their pain to our solution
   - Include the memorable_phrase as a pull quote

   **Page 3 — Options Table**
   | | Essentiel | Croissance | Domination |
   |---|---|---|---|
   | Description | ... | ... | ... |
   | Deliverables | ... | ... | ... |
   | Timeline | ... | ... | ... |
   | Price HT | ... | ... | ... |

   **Page 4 — ROI Projections**
   - Conservative / Moderate / Optimistic scenarios
   - Payback period estimate
   - Key metrics impacted

   **Page 5 — CGV**
   - Standard terms: 30% upfront, 40% mid-project, 30% delivery
   - Payment 30 days
   - Validity 15 days

4. Save the PDF to the user's Desktop with filename: `BYSS_Proposition_[CompanyName]_[Date].pdf`
