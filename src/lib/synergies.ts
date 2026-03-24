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

  // ── Gulf Stream → Position opened notification ──
  {
    id: "gulf-position-opened",
    source: "gulf",
    trigger: "position_opened",
    description: "Position ouverte → Notification Gulf Stream",
    execute: async (data) => {
      const title = (data.title as string) || "Position";
      const amount = (data.amount as number) || 0;

      await createNotification(
        "system",
        `Gulf Stream — Position ouverte`,
        `${title} | Mise: $${amount.toFixed(2)}`,
        "/gulf-stream",
        { positionId: data.positionId, trigger: "gulf-position-opened" },
      );
    },
  },

  // ── Gulf Stream → Position closed → Finance notification ──
  {
    id: "gulf-position-closed-to-finance",
    source: "gulf",
    trigger: "position_closed",
    description: "Position fermée → Notification PnL + Finance update",
    execute: async (data) => {
      const title = (data.title as string) || "Position";
      const pnl = (data.pnl as number) || 0;
      const pnlStr = pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;

      await createNotification(
        "invoice",
        `Gulf Stream — ${pnlStr}`,
        `${title} cloturee. Mettre a jour les projections.`,
        "/finance",
        { positionId: data.positionId, pnl, trigger: "gulf-position-closed" },
      );
    },
  },

  // ── Marchés → GO decision → Pipeline + Calendar ──
  {
    id: "marche-go-to-pipeline",
    source: "marches",
    trigger: "go_decision",
    description: "Marché GO → Créer prospect + deadline calendrier",
    execute: async (data) => {
      const title = (data.tenderTitle as string) || "Marché";
      const acheteur = (data.acheteur as string) || "";
      const dateLimite = (data.dateLimite as string) || "";

      await createNotification(
        "prospect",
        `Marche GO — ${title.slice(0, 50)}`,
        `Preparer la reponse. Acheteur: ${acheteur}`,
        "/pipeline",
        { tenderId: data.tenderId, trigger: "marche-go-to-pipeline" },
      );

      if (dateLimite) {
        await createNotification(
          "reminder",
          `Deadline Marche — ${title.slice(0, 40)}`,
          `Date limite: ${dateLimite}. Planifier la soumission.`,
          "/calendrier",
          { tenderId: data.tenderId, dateLimite, trigger: "marche-go-to-calendar" },
        );
      }
    },
  },

  // ── Marchés → Status GO → Calendar J-7 + CRM ──
  {
    id: "marche-status-go-calendar",
    source: "marches",
    trigger: "status_changed",
    description: "Marché → GO → Rappel calendrier J-7 + prospect CRM",
    execute: async (data) => {
      const newStatus = (data.newStatus as string) || "";
      if (newStatus !== "go") return;

      const title = (data.title as string) || "Marché";
      const acheteur = (data.acheteur as string) || "";
      const dateLimite = (data.dateLimite as string) || "";

      let reminderMsg = "Date limite non précisée — vérifier le dossier";
      if (dateLimite) {
        const d = new Date(dateLimite);
        d.setDate(d.getDate() - 7);
        reminderMsg = `Rappel J-7 : soumission avant le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
      }

      await createNotification(
        "reminder",
        `Deadline marché — ${title.slice(0, 50)}`,
        reminderMsg,
        "/calendrier",
        { marcheId: data.marcheId, trigger: "marche-go-calendar" },
      );

      await createNotification(
        "prospect",
        `Prospect marché — ${acheteur || title.slice(0, 40)}`,
        `Marché GO. Créer/lier prospect CRM.`,
        "/pipeline",
        { marcheId: data.marcheId, acheteur, trigger: "marche-go-crm" },
      );
    },
  },

  // ── Marchés → Status Submitted → Finance projection ──
  {
    id: "marche-status-submitted-finance",
    source: "marches",
    trigger: "status_changed",
    description: "Marché soumis → Projection budgétaire finance",
    execute: async (data) => {
      const newStatus = (data.newStatus as string) || "";
      if (newStatus !== "submitted") return;

      const title = (data.title as string) || "Marché";
      const budget = (data.budget as number) || 0;

      await createNotification(
        "invoice",
        `Projection — ${title.slice(0, 50)}`,
        budget > 0
          ? `Offre soumise : ${budget.toLocaleString("fr-FR")} EUR. A suivre.`
          : "Offre soumise. Budget à confirmer.",
        "/finance",
        { marcheId: data.marcheId, budget, trigger: "marche-submitted-finance" },
      );
    },
  },

  // ── Marchés → Status Won → Invoice + Pipeline update ──
  {
    id: "marche-status-won-invoice",
    source: "marches",
    trigger: "status_changed",
    description: "Marché gagné → Facture + prospect 'signé'",
    execute: async (data) => {
      const newStatus = (data.newStatus as string) || "";
      if (newStatus !== "won") return;

      const title = (data.title as string) || "Marché";
      const acheteur = (data.acheteur as string) || "";
      const budget = (data.budget as number) || 0;

      await createNotification(
        "invoice",
        `Marché gagné — ${acheteur}`,
        `"${title.slice(0, 50)}" remporté. ${budget > 0 ? `${budget.toLocaleString("fr-FR")} EUR.` : ""} Créer la facture.`,
        "/finance",
        { marcheId: data.marcheId, budget, trigger: "marche-won-invoice" },
      );

      await createNotification(
        "prospect",
        `Client signé — ${acheteur}`,
        `Passer le prospect lié en "Signé".`,
        "/pipeline",
        { marcheId: data.marcheId, trigger: "marche-won-pipeline" },
      );
    },
  },

  // ── E-Commerce → Store created → Notification + Calendar ──
  {
    id: "ecom-store-created",
    source: "ecommerce",
    trigger: "store_created",
    description: "Store cree → Notification + evenement calendrier lancement",
    execute: async (data) => {
      const storeName = (data.storeName as string) || "Store";
      const niche = (data.niche as string) || "";
      const country = (data.country as string) || "";

      await createNotification(
        "system",
        `Store cree — ${storeName}`,
        `Niche: ${niche} | Marche: ${country}. Lancer le sprint 7 jours.`,
        "/projets/ecommerce",
        { storeId: data.storeId, niche, country, trigger: "ecom-store-created" },
      );

      // Calendar event for launch date (J+7)
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 7);
      const dateStr = launchDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await createNotification(
        "reminder",
        `Lancement store — ${storeName}`,
        `Date cible: ${dateStr}. Verifier ads, produits, storefront.`,
        "/calendrier",
        { storeId: data.storeId, launchDate: launchDate.toISOString(), trigger: "ecom-store-launch" },
      );
    },
  },

  // ── Production → Image completed → Notification ──
  {
    id: "image-completed-notify",
    source: "production",
    trigger: "image_completed",
    description: "Image terminée → Notification production",
    execute: async (data) => {
      const prompt = (data.prompt as string) || "Image";
      const project = (data.project as string) || "";

      await createNotification(
        "system",
        `Image terminee`,
        project ? `Projet: ${project} — ${prompt.slice(0, 60)}` : prompt.slice(0, 80),
        "/production/images",
        { jobId: data.jobId, trigger: "image-completed" },
      );
    },
  },

  // ── Music completed → Notification ──
  {
    id: "music-completed-notify",
    source: "production",
    trigger: "music_completed",
    description: "Musique terminée → Notification production",
    execute: async (data) => {
      const title = (data.title as string) || "Piste";

      await createNotification(
        "system",
        `Musique terminee — ${title}`,
        "Composition IA generee. Ecouter et valider.",
        "/production/music",
        { jobId: data.jobId, trigger: "music-completed" },
      );
    },
  },

  // ── Pipeline prospect signed → Production suggestion ──
  {
    id: "pipeline-signe-to-production",
    source: "pipeline",
    trigger: "prospect_signed",
    description: "Client signé → Suggestion lancement production",
    execute: async (data) => {
      const name = (data.prospectName as string) || "Client";

      await createNotification(
        "system",
        `Production — Nouveau client ${name}`,
        "Demarrer le brief creatif et planifier les premieres livraisons.",
        "/production",
        { prospectId: data.prospectId, trigger: "pipeline-signe-to-production" },
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

/**
 * Convenience: trigger the marche GO decision synergy.
 */
export function onMarcheGo(
  tenderId: string,
  tenderTitle: string,
  acheteur: string,
  dateLimite?: string,
) {
  return triggerSynergy("marches", "go_decision", {
    tenderId,
    tenderTitle,
    acheteur,
    dateLimite,
  });
}

/**
 * Convenience: trigger a Gulf Stream position opened synergy.
 */
export function onGulfPositionOpened(
  positionId: string,
  title: string,
  amount: number,
) {
  return triggerSynergy("gulf", "position_opened", {
    positionId,
    title,
    amount,
  });
}

/**
 * Convenience: trigger a Gulf Stream position closed synergy.
 */
export function onGulfPositionClosed(
  positionId: string,
  title: string,
  pnl: number,
) {
  return triggerSynergy("gulf", "position_closed", {
    positionId,
    title,
    pnl,
  });
}

/**
 * Convenience: trigger the image-completed synergy.
 */
export function onImageCompleted(
  jobId: string,
  prompt: string,
  project?: string,
) {
  return triggerSynergy("production", "image_completed", {
    jobId,
    prompt,
    project,
  });
}

/**
 * Convenience: trigger the music-completed synergy.
 */
export function onMusicCompleted(jobId: string, title: string) {
  return triggerSynergy("production", "music_completed", {
    jobId,
    title,
  });
}

/**
 * Convenience: trigger marché status change synergies.
 * Fires: calendar reminder (GO), CRM prospect (GO), finance projection (submitted),
 * invoice + pipeline update (won).
 */
export function onMarcheStatusChanged(
  marcheId: string,
  title: string,
  acheteur: string,
  newStatus: string,
  budget?: number,
  dateLimite?: string,
) {
  return triggerSynergy("marches", "status_changed", {
    marcheId,
    title,
    acheteur,
    newStatus,
    budget,
    dateLimite,
  });
}

/**
 * Convenience: trigger the e-commerce store-created synergy.
 * Fires: notification + calendar launch event.
 */
export function onStoreCreated(
  storeId: string,
  storeName: string,
  niche: string,
  country: string,
) {
  return triggerSynergy("ecommerce", "store_created", {
    storeId,
    storeName,
    niche,
    country,
  });
}
