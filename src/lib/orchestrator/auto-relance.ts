// ═══════════════════════════════════════════════════════════
// BYSS GROUP — Auto-Relance System
// Détecte les prospects silencieux. Génère des relances via gates.
// ═══════════════════════════════════════════════════════════

import { createClient } from "@/lib/supabase/client";
import type { Prospect } from "@/types";

/* ─── Types ─────────────────────────────────────────────── */

export interface StaleProspect {
  id: string;
  name: string;
  email: string | null;
  phase: string;
  lastContact: string | null;
  daysSinceContact: number;
  sector: string | null;
  painPoints: string | null;
}

/* ─── Check for stale prospects ─────────────────────────── */

export async function checkStaleProspects(): Promise<StaleProspect[]> {
  const supabase = createClient();

  // Active prospects not in terminal phases
  const { data: prospects, error } = await supabase
    .from("prospects")
    .select("*")
    .not("phase", "in", '("signe","perdu","inactif")')
    .order("last_contact", { ascending: true, nullsFirst: true });

  if (error || !prospects) return [];

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return prospects
    .filter((p: Prospect) => {
      if (!p.last_contact) return true; // never contacted
      return new Date(p.last_contact) < sevenDaysAgo;
    })
    .map((p: Prospect) => {
      const lastDate = p.last_contact ? new Date(p.last_contact) : null;
      const daysSince = lastDate
        ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      return {
        id: p.id,
        name: p.name,
        email: p.email,
        phase: p.phase,
        lastContact: p.last_contact,
        daysSinceContact: daysSince,
        sector: p.sector,
        painPoints: p.pain_points,
      };
    });
}

/* ─── Generate relance actions (goes through gates) ──── */

export async function generateRelanceActions(staleProspects: StaleProspect[]): Promise<number> {
  const supabase = createClient();
  let created = 0;

  for (const prospect of staleProspects) {
    if (!prospect.email) continue;

    // Build context for personalized relance
    const context = buildRelanceContext(prospect);

    // Create a pending_action — human reviews via notification gates
    const { error } = await supabase.from("pending_actions").insert({
      type: "send_email",
      target_type: "prospect",
      target_id: prospect.id,
      title: `Relance: ${prospect.name}`,
      description: context.reason,
      payload: {
        to: prospect.email,
        subject: context.subject,
        body: context.body,
        prospect_name: prospect.name,
        days_since: prospect.daysSinceContact,
      },
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (!error) {
      created++;

      // Create notification for human-in-the-loop gate
      await supabase.from("notifications").insert({
        type: "gate",
        title: `Relance à valider: ${prospect.name}`,
        message: `${prospect.daysSinceContact}j sans contact. ${context.reason}`,
        link: `/pipeline?prospect=${prospect.id}`,
        metadata: {
          pending_action_id: prospect.id,
          action_type: "auto_relance",
          prospect_name: prospect.name,
        },
        read: false,
        created_at: new Date().toISOString(),
      });
    }
  }

  return created;
}

/* ─── Build relance context ─────────────────────────────── */

function buildRelanceContext(prospect: StaleProspect): {
  reason: string;
  subject: string;
  body: string;
} {
  const days = prospect.daysSinceContact;

  if (days >= 30) {
    return {
      reason: `Silence depuis ${days} jours. Réactivation nécessaire.`,
      subject: `${prospect.name} — on reprend?`,
      body: buildEmailBody(prospect, "reactivation"),
    };
  }

  if (days >= 14) {
    return {
      reason: `${days} jours sans contact. Relance de suivi.`,
      subject: `Suite à notre échange, ${prospect.name}`,
      body: buildEmailBody(prospect, "followup"),
    };
  }

  return {
    reason: `${days} jours depuis le dernier contact. Relance standard.`,
    subject: `Un point rapide, ${prospect.name}?`,
    body: buildEmailBody(prospect, "standard"),
  };
}

function buildEmailBody(prospect: StaleProspect, tone: "standard" | "followup" | "reactivation"): string {
  const name = prospect.name.split(" ")[0];

  switch (tone) {
    case "reactivation":
      return [
        `${name},`,
        "",
        `Cela fait un moment. J'ai vu des évolutions dans votre secteur ${prospect.sector ? `(${prospect.sector})` : ""} qui pourraient vous intéresser.`,
        "",
        "Un créneau de 15 min cette semaine?",
        "",
        "Gary Bissol",
        "BYSS GROUP",
      ].join("\n");

    case "followup":
      return [
        `${name},`,
        "",
        "Je reviens vers vous suite à notre dernier échange.",
        prospect.painPoints
          ? `J'ai réfléchi à votre problématique (${prospect.painPoints.slice(0, 80)}) et j'ai une piste concrète.`
          : "J'ai une piste concrète pour avancer.",
        "",
        "On en parle?",
        "",
        "Gary Bissol",
        "BYSS GROUP",
      ].join("\n");

    default:
      return [
        `${name},`,
        "",
        "Un point rapide pour voir où vous en êtes.",
        "Disponible cette semaine?",
        "",
        "Gary Bissol",
        "BYSS GROUP",
      ].join("\n");
  }
}
