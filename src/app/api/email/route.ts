import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  sendBatchEmails,
  buildProspectionEmail,
  buildFollowupEmail,
  buildProposalEmail,
  type EmailType,
} from "@/lib/integrations/resend";
import { createActivity } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Email API (Resend + Supabase logging)
// ═══════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      // ── Direct send (from AI-drafted emails) ──
      case "send_direct": {
        const { to, subject, body: emailBody, prospectId } = body;
        if (!to || !subject || !emailBody) {
          return NextResponse.json(
            { error: "to, subject, body requis" },
            { status: 400 },
          );
        }

        // Check Resend config
        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const result = await sendEmail({
          to,
          subject,
          html: emailBody,
          type: "prospection_initial" as EmailType,
          prospectName: body.prospectName,
        });

        // Log interaction in Supabase
        if (prospectId) {
          const supabase = await createClient();

          // Log as interaction
          await supabase.from("interactions").insert({
            prospectId: prospectId,
            type: "email",
            subject,
            content: emailBody,
            direction: "outbound",
            channel: "resend",
            created_by: "gary",
          });

          // Log as activity
          await createActivity({
            type: "email",
            title: `Email envoye: ${subject}`,
            description: `Email envoye a ${to}`,
            prospectId: prospectId,
            metadata: { to, subject, channel: "resend" },
          });
        }

        return NextResponse.json({ success: true, result });
      }

      // ── Template sends ──
      case "send": {
        const { to, subject, html, type, prospectName } = body;
        if (!to || !subject || !html) {
          return NextResponse.json(
            { error: "to, subject, html requis" },
            { status: 400 },
          );
        }

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const result = await sendEmail({
          to,
          subject,
          html,
          type: type as EmailType,
          prospectName,
        });

        // Log activity if prospectId provided
        if (body.prospectId) {
          const supabase = await createClient();

          await supabase.from("interactions").insert({
            prospectId: body.prospectId,
            type: "email",
            subject,
            content: html,
            direction: "outbound",
            channel: "resend",
            created_by: "gary",
          });

          await createActivity({
            type: "email",
            title: `Email envoye: ${subject}`,
            description: `Email ${type} envoye a ${to}`,
            prospectId: body.prospectId,
            metadata: { to, subject, type, channel: "resend" },
          });
        }

        return NextResponse.json({ success: true, result });
      }

      case "prospection": {
        const {
          prospectName,
          contactName,
          email,
          sector,
          painPoint,
          memorablePhrase,
          prospectId,
        } = body;
        if (!email || !contactName) {
          return NextResponse.json(
            { error: "email et contactName requis" },
            { status: 400 },
          );
        }

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const template = buildProspectionEmail({
          prospectName,
          contactName,
          sector,
          painPoint,
          memorablePhrase,
        });
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          type: "prospection_initial",
          prospectName,
        });

        if (prospectId) {
          const supabase = await createClient();
          await supabase.from("interactions").insert({
            prospectId: prospectId,
            type: "email",
            subject: template.subject,
            content: template.html,
            direction: "outbound",
            channel: "resend",
            created_by: "gary",
          });
          await createActivity({
            type: "email",
            title: `Prospection: ${template.subject}`,
            description: `Email de prospection envoye a ${contactName}`,
            prospectId: prospectId,
            metadata: { to: email, type: "prospection_initial" },
          });
        }

        return NextResponse.json({ success: true, result, preview: template });
      }

      case "followup": {
        const { contactName, email, daysSince, lastContext, prospectId } = body;
        if (!email || !contactName) {
          return NextResponse.json(
            { error: "email et contactName requis" },
            { status: 400 },
          );
        }

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const template = buildFollowupEmail({
          contactName,
          daysSince: daysSince ?? 3,
          lastContext: lastContext ?? "",
        });
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          type: "prospection_followup",
          prospectName: contactName,
        });

        if (prospectId) {
          const supabase = await createClient();
          await supabase.from("interactions").insert({
            prospectId: prospectId,
            type: "email",
            subject: template.subject,
            content: template.html,
            direction: "outbound",
            channel: "resend",
            created_by: "gary",
          });
          await createActivity({
            type: "email",
            title: `Relance: ${template.subject}`,
            description: `Follow-up envoye a ${contactName}`,
            prospectId: prospectId,
            metadata: { to: email, type: "prospection_followup", daysSince },
          });
        }

        return NextResponse.json({ success: true, result, preview: template });
      }

      case "proposal": {
        const { contactName, email, companyName, optionChosen, price, prospectId } =
          body;
        if (!email || !contactName || !companyName) {
          return NextResponse.json(
            { error: "email, contactName, companyName requis" },
            { status: 400 },
          );
        }

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const template = buildProposalEmail({
          contactName,
          companyName,
          optionChosen: optionChosen ?? "Croissance",
          price: price ?? 0,
        });
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          type: "proposal",
          prospectName: companyName,
        });

        if (prospectId) {
          const supabase = await createClient();
          await supabase.from("interactions").insert({
            prospectId: prospectId,
            type: "email",
            subject: template.subject,
            content: template.html,
            direction: "outbound",
            channel: "resend",
            created_by: "gary",
          });
          await createActivity({
            type: "email",
            title: `Proposition: ${template.subject}`,
            description: `Proposition commerciale envoyee a ${contactName}`,
            prospectId: prospectId,
            metadata: { to: email, type: "proposal", optionChosen, price },
          });
        }

        return NextResponse.json({ success: true, result, preview: template });
      }

      case "batch": {
        const { emails } = body;
        if (!Array.isArray(emails) || emails.length === 0) {
          return NextResponse.json(
            { error: "emails array requis" },
            { status: 400 },
          );
        }

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Resend non configure" },
            { status: 503 },
          );
        }

        const result = await sendBatchEmails(emails);
        return NextResponse.json({ success: true, result });
      }

      case "preview": {
        // Preview only, no send
        const { templateType, ...params } = body;
        let template;
        switch (templateType) {
          case "prospection":
            template = buildProspectionEmail(params);
            break;
          case "followup":
            template = buildFollowupEmail(params);
            break;
          case "proposal":
            template = buildProposalEmail(params);
            break;
          default:
            return NextResponse.json(
              { error: "templateType requis" },
              { status: 400 },
            );
        }
        return NextResponse.json({ preview: template });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Action inconnue: send, send_direct, prospection, followup, proposal, batch, preview",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur email" },
      { status: 500 },
    );
  }
}
