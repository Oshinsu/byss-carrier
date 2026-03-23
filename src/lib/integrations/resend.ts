import { Resend } from "resend";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Resend Email Integration
// CRM emails: prospection, follow-ups, invoices
// ═══════════════════════════════════════════════════════

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY non configuree. Ajoutez-la dans .env.local");
  return new Resend(key);
}

const FROM_EMAIL = "gary@byssgroup.fr";
const FROM_NAME = "Gary Bissol — BYSS GROUP";
const REPLY_TO = "gary@byss-group.com";

// ── Email types ──
export type EmailType =
  | "prospection_initial"
  | "prospection_followup"
  | "demo_invite"
  | "proposal"
  | "invoice"
  | "thank_you"
  | "reactivation";

// ── Send email ──
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  type: EmailType;
  prospectName?: string;
  tags?: string[];
}) {
  const { to, subject, html, type, prospectName, tags = [] } = params;

  const result = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    replyTo: REPLY_TO,
    subject,
    html: wrapInTemplate(html, prospectName),
    tags: [
      { name: "type", value: type },
      { name: "prospect", value: prospectName ?? "unknown" },
      ...tags.map((t) => ({ name: "custom", value: t })),
    ],
  });

  return result;
}

// ── Batch send ──
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    html: string;
    type: EmailType;
    prospectName?: string;
  }>
) {
  const batch = emails.map((e) => ({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [e.to],
    replyTo: REPLY_TO,
    subject: e.subject,
    html: wrapInTemplate(e.html, e.prospectName),
    tags: [
      { name: "type", value: e.type },
      { name: "prospect", value: e.prospectName ?? "unknown" },
    ],
  }));

  return getResend().batch.send(batch);
}

// ── Email template wrapper ──
function wrapInTemplate(content: string, prospectName?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAFAF8; color: #1A1A1A; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { display: inline-block; background: linear-gradient(135deg, #B8860B, #00B4D8); color: #FAFAF8; font-weight: 700; font-size: 14px; width: 36px; height: 36px; line-height: 36px; border-radius: 8px; text-align: center; }
    .brand { font-size: 16px; font-weight: 600; color: #1A1A1A; margin-top: 8px; letter-spacing: 0.05em; }
    .content { font-size: 15px; line-height: 1.7; color: #333; }
    .content p { margin: 0 0 16px 0; }
    .cta { display: inline-block; background: linear-gradient(135deg, #B8860B, #00B4D8); color: #FAFAF8; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #E8E5E0; text-align: center; font-size: 12px; color: #999; }
    .footer a { color: #B8860B; text-decoration: none; }
    .signature { margin-top: 24px; font-style: italic; color: #B8860B; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BG</div>
      <div class="brand">BYSS GROUP</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="signature">
      Le courant entre par les passages etroits.
    </div>
    <div class="footer">
      <strong>Gary Bissol</strong> — BYSS GROUP SAS<br>
      Fort-de-France, Martinique<br>
      <a href="mailto:gary@byssgroup.fr">gary@byssgroup.fr</a>
    </div>
  </div>
</body>
</html>`;
}

// ── Pre-built email templates (MODE_CADIFOR) ──
export function buildProspectionEmail(params: {
  prospectName: string;
  contactName: string;
  sector: string;
  painPoint: string;
  memorablePhrase: string;
}): { subject: string; html: string } {
  const { contactName, sector, painPoint, memorablePhrase } = params;
  const firstName = contactName.split(" ")[0];

  return {
    subject: `${firstName}, une question sur ${sector === "Telecoms" ? "vos creatives" : "votre visibilite"}`,
    html: `
      <p>Bonjour ${firstName},</p>
      <p>${painPoint}</p>
      <p>${memorablePhrase}</p>
      <p>BYSS GROUP produit des videos par IA a Fort-de-France. Marge 99.96%. Aucun concurrent local.</p>
      <p>Un cafe de 15 minutes cette semaine pour vous montrer ?</p>
      <p>Gary Bissol<br>BYSS GROUP</p>
    `,
  };
}

export function buildFollowupEmail(params: {
  contactName: string;
  daysSince: number;
  lastContext: string;
}): { subject: string; html: string } {
  const firstName = params.contactName.split(" ")[0];
  const hook =
    params.daysSince <= 3
      ? "Suite a notre echange"
      : params.daysSince <= 7
        ? "Je reviens vers vous"
        : "Vous aviez montre de l'interet";

  return {
    subject: `${firstName} — ${hook.toLowerCase()}`,
    html: `
      <p>Bonjour ${firstName},</p>
      <p>${hook} concernant ${params.lastContext}.</p>
      <p>Etes-vous disponible pour un point rapide cette semaine ?</p>
      <p>Gary Bissol<br>BYSS GROUP</p>
    `,
  };
}

export function buildProposalEmail(params: {
  contactName: string;
  companyName: string;
  optionChosen: string;
  price: number;
}): { subject: string; html: string } {
  const firstName = params.contactName.split(" ")[0];

  return {
    subject: `Proposition ${params.companyName} — Option ${params.optionChosen}`,
    html: `
      <p>Bonjour ${firstName},</p>
      <p>Suite a notre discussion, voici la proposition pour ${params.companyName}.</p>
      <p><strong>Option ${params.optionChosen}</strong> — ${params.price.toLocaleString("fr-FR")} EUR HT</p>
      <p>Le document complet est en piece jointe.</p>
      <p>Quand pouvons-nous en discuter ?</p>
      <p>Gary Bissol<br>BYSS GROUP</p>
    `,
  };
}
