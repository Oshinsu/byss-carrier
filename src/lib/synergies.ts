import { createNotification } from "@/lib/notifications";

// ═══════════════════════════════════════════════════════
// BYSS Synergy Engine
//
// Connects: Pipeline → Email → Calendar → Notifications → Finance
// Every action in one system triggers reactions in others.
// ═══════════════════════════════════════════════════════

/* ── Types ─────────────────────────────────────────────── */

export interface SynergyTarget {
  system: string;
  action: string;
  data: Record<string, unknown>;
}

export interface SynergyAction {
  source: string;
  action: string;
  targets: SynergyTarget[];
}

export interface SynergyRule {
  id: string;
  source: string;
  trigger: string;
  description: string;
  execute: (data: Record<string, unknown>) => Promise<void>;
}

/* ── Synergy Rules Map ─────────────────────────────────── */

export const SYNERGY_RULES: SynergyRule[] = [
  // ── Pipeline → Finance + Notifications ──
  {
    id: "pipeline-signe-to-finance",
    source: "pipeline",
    trigger: "prospect_signed",
    description: "Prospect signé → Créer notification facture + MRR update",
    execute: async (data) => {
      const name = (data.prospectName as string) || "Prospect";
      const basket = (data.basket as number) || 0;

      // Notification: create invoice
      await createNotification(
        "invoice",
        `Nouveau client signé — ${name}`,
        `Créer la facture. Panier estimé: ${basket.toLocaleString("fr-FR")} EUR/mois`,
        "/finance",
        { prospectId: data.prospectId, basket, trigger: "pipeline-signe" },
      );

      // Notification: onboarding reminder
      await createNotification(
        "reminder",
        `Onboarding — ${name}`,
        "Planifier le kick-off et le calendrier de livraison",
        "/calendrier",
        { prospectId: data.prospectId, trigger: "pipeline-signe" },
      );
    },
  },

  // ── Pipeline → Notifications (stage change) ──
  {
    id: "pipeline-stage-change",
    source: "pipeline",
    trigger: "stage_changed",
    description: "Phase changed → Notification de suivi",
    execute: async (data) => {
      const name = (data.prospectName as string) || "Prospect";
      const stage = (data.newStage as string) || "";
      const stageLabel = (data.stageLabel as string) || stage;

      // Only notify for key stages
      const keyStages = ["rdv_planifie", "demo_faite", "proposition", "negociation"];
      if (!keyStages.includes(stage)) return;

      await createNotification(
        "prospect",
        `${name} → ${stageLabel}`,
        `Le prospect avance dans le pipeline`,
        "/pipeline",
        { prospectId: data.prospectId, stage, trigger: "pipeline-move" },
      );
    },
  },

  // ── Video completed → Notification ──
  {
    id: "video-completed-notify",
    source: "production",
    trigger: "video_completed",
    description: "Vidéo terminée → Notification + stats update",
    execute: async (data) => {
      const title = (data.videoTitle as string) || "Vidéo";
      const project = (data.project as string) || "";

      await createNotification(
        "system",
        `Vidéo terminée — ${title}`,
        project ? `Projet: ${project}` : "Production complète",
        "/production/video",
        { videoId: data.videoId, trigger: "video-completed" },
      );
    },
  },

  // ── Email sent → Calendar follow-up suggestion ──
  {
    id: "email-sent-to-calendar",
    source: "emails",
    trigger: "email_sent",
    description: "Email envoyé → Suggestion relance J+7 au calendrier",
    execute: async (data) => {
      const prospectName = (data.prospectName as string) || "Prospect";
      const emailType = (data.emailType as string) || "custom";

      // Calculate J+7 date
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 7);
      const dateStr = followUpDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await createNotification(
        "reminder",
        `Relance J+7 — ${prospectName}`,
        `Email "${emailType}" envoyé. Relancer le ${dateStr}`,
        "/calendrier",
        {
          prospectId: data.prospectId,
          prospectName,
          emailType,
          followUpDate: followUpDate.toISOString(),
          trigger: "email-sent",
        },
      );
    },
  },

  // ── Finance → Notifications (invoice created) ──
  {
    id: "invoice-created-notify",
    source: "finance",
    trigger: "invoice_created",
    description: "Facture créée → Notification de suivi paiement",
    execute: async (data) => {
      const clientName = (data.clientName as string) || "Client";
      const amount = (data.amount as number) || 0;

      await createNotification(
        "invoice",
        `Facture envoyée — ${clientName}`,
        `Montant: ${amount.toLocaleString("fr-FR")} EUR. Suivre le paiement.`,
        "/finance",
        { invoiceId: data.invoiceId, trigger: "invoice-created" },
      );
    },
  },

  // ── Calendar event → Notification reminder ──
  {
    id: "calendar-event-reminder",
    source: "calendrier",
    trigger: "event_created",
    description: "Événement créé → Notification rappel",
    execute: async (data) => {
      const title = (data.eventTitle as string) || "Événement";

      await createNotification(
        "reminder",
        `Rappel — ${title}`,
        (data.description as string) || "Événement planifié",
        "/calendrier",
        { eventId: data.eventId, trigger: "calendar-event" },
      );
    },
  },

  // ── Research → Bible de Vente (commercial findings) ──
  {
    id: "research-to-bible",
    source: "research",
    trigger: "research_completed",
    description: "Recherche commerciale → Suggestion sauvegarde Bible de Vente",
    execute: async (data) => {
      const domain = (data.domain as string) || "";
      const question = (data.question as string) || "Recherche";

      if (!["market", "competition"].includes(domain)) return;

      await createNotification(
        "system",
        `Recherche terminee — ${question.slice(0, 50)}`,
        "Resultats pertinents pour la Bible de Vente. Sauvegarder ?",
        "/bible",
        { researchId: data.researchId, domain, trigger: "research-to-bible" },
      );
    },
  },

  // ── Research → Intelligence (geopolitics/martinique findings) ──
  {
    id: "research-to-intelligence",
    source: "research",
    trigger: "research_completed",
    description: "Recherche geopolitique → Suggestion ajout Intel",
    execute: async (data) => {
      const domain = (data.domain as string) || "";
      const question = (data.question as string) || "Recherche";

      if (!["geopolitics", "culture"].includes(domain)) return;

      await createNotification(
        "system",
        `Intel detectee — ${question.slice(0, 50)}`,
        "Donnees pertinentes pour le module Intelligence. Ajouter ?",
        "/intelligence",
        { researchId: data.researchId, domain, trigger: "research-to-intel" },
      );
    },
  },

  // ── Research → Prospect CRM (company research) ──
  {
    id: "research-to-prospect",
    source: "research",
    trigger: "research_completed",
    description: "Recherche entreprise → Suggestion lien prospect CRM",
    execute: async (data) => {
      const domain = (data.domain as string) || "";
      const question = (data.question as string) || "Recherche";

      if (!["market", "competition", "finance"].includes(domain)) return;

      await createNotification(
        "prospect",
        `Prospect potentiel — ${question.slice(0, 50)}`,
        "Resultats de recherche pourraient enrichir un prospect existant ou en creer un nouveau.",
        "/pipeline",
        { researchId: data.researchId, domain, trigger: "research-to-prospect" },
      );
    },
  },

  // ── Finance → Invoice paid notification ──
  {
    id: "invoice-paid-notify",
    source: "finance",
    trigger: "invoice_paid",
    description: "Facture payée → Notification paiement reçu",
    execute: async (data) => {
      const clientName = (data.clientName as string) || "Client";
      const amount = (data.amount as number) || 0;

      await createNotification(
        "invoice",
        `Paiement recu — ${clientName}`,
        `${amount.toLocaleString("fr-FR")} EUR encaisses.`,
        "/finance",
        { invoiceId: data.invoiceId, trigger: "invoice-paid" },
      );
    },
  },

  // ── Contacts → Contact added notification ──
  {
    id: "contact-added-notify",
    source: "contacts",
    trigger: "contact_added",
    description: "Contact ajouté → Notification prospect",
    execute: async (data) => {
      const name = (data.name as string) || "Contact";
      const sector = (data.sector as string) || "";

      await createNotification(
        "prospect",
        `Contact ajoute — ${name}`,
        sector ? `Secteur: ${sector}` : "Nouveau contact dans le repertoire",
        "/contacts",
        { trigger: "contact-added" },
      );
    },
  },

  // ── Games → Sprint completed notification ──
  {
    id: "sprint-completed-notify",
    source: "games",
    trigger: "sprint_completed",
    description: "Sprint terminé → Notification studio",
    execute: async (data) => {
      const gameName = (data.gameName as string) || "Jeu";
      const sprintNumber = (data.sprintNumber as number) || 0;

      await createNotification(
        "system",
        `Sprint termine — ${gameName}`,
        `Sprint ${sprintNumber} complete. Toutes les taches Done.`,
        "/studio/games",
        { gameName, sprintNumber, trigger: "sprint-completed" },
      );
    },
  },

  // ── Marchés Publics → Tender high-relevance notification ──
  {
    id: "tender-high-relevance-notify",
    source: "marches",
    trigger: "tender_analyzed",
    description: "Marché analysé score > 70 → Notification suggestion répondre",
    execute: async (data) => {
      const title = (data.tenderTitle as string) || "Marché public";
      const score = (data.matchScore as number) || 0;
      const acheteur = (data.acheteur as string) || "";
      const dateLimite = (data.dateLimite as string) || "";

      if (score < 70) return;

      const goNoGo = (data.goNoGo as string) || "A EVALUER";
      const deadlineInfo = dateLimite ? ` — Limite: ${dateLimite}` : "";

      await createNotification(
        "prospect",
        `Marché pertinent — ${title.slice(0, 60)}`,
        `Score ${score}% | ${goNoGo} | ${acheteur}${deadlineInfo}. Préparer la réponse.`,
        "/marches",
        { tenderId: data.tenderId, score, acheteur, goNoGo, trigger: "tender-high-relevance" },
      );
    },
  },

  // ── Calendar → Event created notification ──
  {
    id: "calendar-event-created-notify",
    source: "calendrier",
    trigger: "event_created",
    description: "Événement créé → Notification calendrier",
    execute: async (data) => {
      const title = (data.title as string) || "Événement";

      await createNotification(
        "reminder",
        `Evenement cree — ${title}`,
        (data.description as string) || "Nouvel evenement planifie",
        "/calendrier",
        { trigger: "calendar-event-created" },
      );
    },
  },
];

/* ── Synergy Executor ──────────────────────────────────── */

/**
 * Trigger all synergy rules matching a source + trigger combination.
 * Fire-and-forget: errors are logged but never block the caller.
 */
export async function triggerSynergy(
  source: string,
  trigger: string,
  data: Record<string, unknown> = {},
): Promise<void> {
  const matchingRules = SYNERGY_RULES.filter(
    (r) => r.source === source && r.trigger === trigger,
  );

  if (matchingRules.length === 0) return;

  // Execute all matching rules in parallel, silently catching errors
  await Promise.allSettled(
    matchingRules.map(async (rule) => {
      try {
        await rule.execute(data);
      } catch (err) {
        console.error(`[synergy] Rule "${rule.id}" failed:`, err);
      }
    }),
  );
}

/**
 * Convenience: trigger the pipeline-signed synergy.
 */
export function onProspectSigned(
  prospectId: string,
  prospectName: string,
  basket: number,
) {
  return triggerSynergy("pipeline", "prospect_signed", {
    prospectId,
    prospectName,
    basket,
  });
}

/**
 * Convenience: trigger the email-sent synergy.
 */
export function onEmailSent(
  prospectId: string,
  prospectName: string,
  emailType: string,
) {
  return triggerSynergy("emails", "email_sent", {
    prospectId,
    prospectName,
    emailType,
  });
}

/**
 * Convenience: trigger the video-completed synergy.
 */
export function onVideoCompleted(
  videoId: string,
  videoTitle: string,
  project?: string,
) {
  return triggerSynergy("production", "video_completed", {
    videoId,
    videoTitle,
    project,
  });
}

/**
 * Convenience: trigger the research-completed synergy.
 */
export function onResearchCompleted(
  researchId: string,
  question: string,
  domain: string,
) {
  return triggerSynergy("research", "research_completed", {
    researchId,
    question,
    domain,
  });
}

/**
 * Convenience: trigger the invoice-paid synergy.
 */
export function onInvoicePaid(
  invoiceId: string,
  clientName: string,
  amount: number,
) {
  return triggerSynergy("finance", "invoice_paid", {
    invoiceId,
    clientName,
    amount,
  });
}

/**
 * Convenience: trigger the contact-added synergy.
 */
export function onContactAdded(name: string, sector: string) {
  return triggerSynergy("contacts", "contact_added", { name, sector });
}

/**
 * Convenience: trigger the sprint-completed synergy.
 */
export function onSprintCompleted(gameName: string, sprintNumber: number) {
  return triggerSynergy("games", "sprint_completed", { gameName, sprintNumber });
}

/**
 * Convenience: trigger the calendar event-created synergy.
 */
export function onEventCreated(title: string, description?: string) {
  return triggerSynergy("calendrier", "event_created", { title, description });
}

/**
 * Convenience: trigger the tender-analyzed synergy.
 * Only fires notification if matchScore >= 70.
 */
export function onTenderAnalyzed(
  tenderId: string,
  tenderTitle: string,
  acheteur: string,
  matchScore: number,
  goNoGo: string,
  dateLimite?: string,
) {
  return triggerSynergy("marches", "tender_analyzed", {
    tenderId,
    tenderTitle,
    acheteur,
    matchScore,
    goNoGo,
    dateLimite,
  });
}
