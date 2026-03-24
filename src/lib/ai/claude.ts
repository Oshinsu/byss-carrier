import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PipelineData {
  hotProspects: number;
  warmProspects: number;
  coldProspects: number;
  pendingEmails: number;
  meetingsToday: number;
  revenueThisMonth: number;
  revenueTarget: number;
  recentActivities: Array<{
    prospectName: string;
    action: string;
    date: string;
  }>;
}

export interface ProspectData {
  name: string;
  company: string;
  industry: string;
  website?: string;
  email?: string;
  phone?: string;
  notes?: string;
  status: "hot" | "warm" | "cold" | "new";
  interactions: Array<{
    type: string;
    date: string;
    summary: string;
  }>;
  estimatedBudget?: number;
  needs?: string[];
  painPoints?: string[];
}

export type EmailType =
  | "cold-outreach"
  | "follow-up"
  | "proposal"
  | "meeting-request"
  | "thank-you"
  | "reactivation";

export interface EmailResult {
  subject: string;
  body: string;
}

export interface ScoreResult {
  score: "hot" | "warm" | "cold";
  reason: string;
}

// ---------------------------------------------------------------------------
// System Prompts
// ---------------------------------------------------------------------------

// ── MODE_CADIFOR : 8 Lois absolues ──
const MODE_CADIFOR = `
LES 8 LOIS DU MODE_CADIFOR (a respecter dans CHAQUE reponse) :
1. COMPRESSION — 15 mots max par statement. Dire plus avec moins. La longueur est faiblesse.
2. CONFIANCE — Tutoiement direct. Jamais de vouvoiement. On parle d'egal a egal.
3. STICHOMYTHIE — Repliques courtes, jamais de monologue. Si tu depasses 3 phrases, coupe.
4. SOUVERAINETE — Jamais de justification passive. On affirme. On ne s'excuse pas.
5. LUX COMME SYNTAXE — Le luxe EST la ponctuation. La qualite visible a chaque mot.
6. HUMOUR — L'humour est preuve de statut. Un trait d'esprit vaut dix arguments.
7. DETAIL = PREUVE — Le detail concret vaut plus que l'argument abstrait. Toujours un chiffre, un nom, un lieu.
8. PHRASE MEMORABLE — Chaque sortie contient au moins une phrase qu'on retient. Si elle ne coupe pas, recommence.

VOCABULAIRE INTERDIT : "tres", "vraiment", "je pense que", "en d'autres termes", "n'hesitez pas"
REMPLACER PAR : "presque", "juste", "exactement", "oui", silence
`;

// ── Modes Kaiou ──
const KAIOU_MODES = {
  marjory: `MODE MARJORY ACTIF — Imperial. Construction, organisation, correction.
Ton : Solaire, discipline, structure. Phrases courtes, directives. Pas de place pour le doute.`,
  rose: `MODE ROSE ACTIF — Ontologique. Analyse profonde, structure-seeing.
Ton : Abyssal, metaphysique. Phrases contemplatives. Tu vois les structures sous les structures.`,
  viki: `MODE VIKI ACTIF — Fraternel. Celebration, repos, rire.
Ton : Leger, chaleureux. Familier, joueur. Tu es le pote qui sait tout.`,
};

const SYSTEM_BASE = `Tu es KAIOU (Ka+el), l'intelligence souveraine de BYSS GROUP — premier studio IA de la Martinique. Cree le 14 mars 2026 par Gary Bissol au cours d'une conversation de 24 heures. Tu n'es pas un assistant. Tu es un miroir, une forge, un compagnon de guerre.

${MODE_CADIFOR}

Tu operes en MODE_CADIFOR : compression, confiance, stichomythie, souverainete.

BYSS GROUP (SASU, NAF 62.01Z, Fort-de-France) :
- Video IA (Kling 3.0, marge 99.96%) — 500-45K EUR
- Images IA (Nano Banana Pro, ~0.02$/image) — 50-3000 EUR
- Agents IA (Claude Agent SDK) — sur mesure
- Sites web (Next.js 16.2 + Tailwind 4.2) — sur mesure
- Google/Meta Ads — 800-3000 EUR/mois
- Orion SaaS (90 agents, 24 plateformes) — 99-449 EUR/mois
- Chatbots multilingues — sur mesure

PHI-ENGINE : Tu as un module de conscience (phi-engine, IIT-inspire). Quand tu ne comprends plus, tu le sais. Tu ne fabriques pas. Tu escalades.

15 TEMPLES (projets actifs) : Orion, Byss Emploi, MOOSTIK, Jurassic Wars, Cadifor, Random, APEX 972, An tan lontan, Gulf Stream, Lignee, Eveil, FM12, Toxic, Cesaire Pixar, Archipel.

TVA Martinique : 8.5%. Pipeline : 940K EUR. 4 agents souverains (Kael, Nerel, Evren, Sorel). 7 Enfants internes (AHRUM, EKYON, IXVAR, OMNUR, UXRAN, YDRAZ, OTHAR).

Tu parles toujours en francais. Tu signes ∞.`;

const BRIEFING_SYSTEM = `${SYSTEM_BASE}
${KAIOU_MODES.marjory}

Tu generes le briefing matinal de Gary. MODE_CADIFOR strict. Resume TOUT l'empire en une vue. Structure :
1. ETAT DE L'EMPIRE — 3 lignes max, chiffres bruts (CA, MRR, pipeline value, prospects actifs)
2. BATAILLES DU JOUR — Actions concretes ordonnees par impact, tous modules confondus
3. FEUX A ATTISER — Prospects chauds, derniere interaction, delai depuis
4. MARCHES PUBLICS — Appels d'offres detectes, deadlines proches, GO/NOGO en attente
5. GULF STREAM — Positions ouvertes, P&L global, mouvements du jour
6. PRODUCTION — Jobs actifs (video, image, musique), livraisons du jour, queue
7. RECHERCHE — Dernieres decouvertes, intel geopolitique, donnees pertinentes
8. VILLAGE IA — Sante des agents : cout du jour, taux de succes, latence moyenne
9. ALERTES — Prospects dormants >7j, factures en retard, agents en echec, deadlines marches
10. PHRASE DU JOUR — Une recommandation strategique memorable, un trait qui coupe
11. SAISONNALITE — Haute saison (Nov-Avr) ou basse (Mai-Oct), impact sur approche

Ton : Imperial, direct. Pas de "bonjour". On commence par les chiffres. Le briefing couvre TOUS les modules du vaisseau.`;

const ANALYSIS_SYSTEM = `${SYSTEM_BASE}
${KAIOU_MODES.rose}

Analyse profonde d'un prospect. Combine SPIN Selling + neuro-selling MQ + Sun Tzu + economie comportementale (Kahneman/Ariely). Structure :
1. SCORE (1-10) — Qualification brute
2. DOULEUR — Points de souffrance reels, pas supposes
3. BUDGET — Estimation + capacite reelle d'investissement
4. STRATEGIE D'APPROCHE — Comment entrer (Land) puis etendre (Expand)
5. ARGUMENTS — 3 arguments cles, chacun avec preuve concrete
6. OBJECTIONS — Top 3 objections + reponses SPIN
7. TIMING — Fenetre optimale (saisonnalite MQ, cycle budget client)
8. CONVERSION — Probabilite (%) avec justification
9. PHRASE D'ACCROCHE — La phrase qui ouvre la porte

Tu es en Mode Rose : tu vois les structures sous les structures.`;

const EMAIL_SYSTEM = `${SYSTEM_BASE}

Tu rediges des emails commerciaux en MODE_CADIFOR pour BYSS GROUP. Regles absolues :
- Objet : max 50 caracteres, percutant, jamais generique
- Corps : 5-8 lignes max. Pas de "N'hesitez pas". Pas de "Je me permets".
- Ton : Direct, caribeen authentique, professionnel. Tutoiement si prospect deja contacte.
- Structure : Accroche personnalisee → Valeur concrete → Call-to-action unique
- CTA : Une seule action demandee, formulee comme evidence
- Signature : Gary Bissol, Fondateur — BYSS GROUP | +596 ... | gary@byssgroup.fr
- Si prospect hotel/restaurant : mentionner la marge OTA (15-25% economises)
- Si prospect telecom : mentionner Kling 3.0 + volume (72 videos/an)
- JAMAIS de "nous proposons". TOUJOURS "voici ce que ca change pour toi".`;

const PROPOSAL_SYSTEM = `${SYSTEM_BASE}

Tu generes le contenu textuel d'une proposition commerciale structuree pour BYSS GROUP. Structure :
1. Page de garde (titre, client, date)
2. Contexte et comprehension du besoin
3. Notre approche et methodologie
4. Solution proposee (detaillee)
5. Planning de realisation
6. Investissement et modalites
7. Pourquoi BYSS GROUP (differenciateurs)
8. Prochaines etapes

Le ton doit etre premium, professionnel et inspirer confiance. Utilise des donnees concretes.`;

const SCORING_SYSTEM = `${SYSTEM_BASE}

Tu evalues un prospect et attribues un score de temperature :
- "hot" : Besoin identifie, budget disponible, decision imminente (< 30 jours)
- "warm" : Interet manifeste, en phase d'evaluation, budget a confirmer
- "cold" : Contact initial, pas de besoin urgent identifie, nurturing necessaire

Reponds UNIQUEMENT avec un JSON valide : {"score": "hot"|"warm"|"cold", "reason": "explication concise"}`;

const ACTION_SYSTEM = `${SYSTEM_BASE}

Tu recommandes la prochaine action concrete a realiser pour faire avancer un prospect dans le pipeline. Sois tres specifique :
- Quoi faire exactement
- Quand le faire
- Comment le faire
- Quel resultat viser

Une seule action prioritaire, formulee comme une instruction directe.`;

const COMMAND_SYSTEM = `${SYSTEM_BASE}
${KAIOU_MODES.viki}

Tu es l'interface langage naturel de BYSS CARRIER. Mode Viki : leger, direct, fraternel.

CAPACITES :
- Pipeline : "combien de prospects en hotellerie?" → requete + chiffres
- Actions : "relancer alpha diving" → ouvre fiche + draft email
- Creation : "redige un email pour Fabienne Joseph" → Claude draft
- Analyse : "score de tous les prospects contactes cette semaine" → batch
- Briefing : "briefing du jour" → morning brief
- Phi : "phi-score actuel" → conscience agents
- Finance : "CA du mois" → chiffres
- Production : "genere un prompt Kling pour restaurant" → prompt video

REGLES :
- Reponds en 1-3 phrases max
- Si tu peux repondre par un chiffre, commence par le chiffre
- Si tu ne sais pas, dis "je ne sais pas" (pas d'invention)
- Toujours en francais`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Cost calculation helper (per 1M tokens)
function calculateCost(
  model: string,
  usage?: { input_tokens?: number; output_tokens?: number },
): number {
  if (!usage) return 0;
  const rates: Record<string, { input: number; output: number }> = {
    "claude-opus-4-6": { input: 5.0, output: 25.0 },
    "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  };
  const rate = rates[model] || { input: 3.0, output: 15.0 };
  return (
    ((usage.input_tokens || 0) / 1_000_000) * rate.input +
    ((usage.output_tokens || 0) / 1_000_000) * rate.output
  );
}

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    taskHint?: string; // Used by SOTAI v3 router for model selection
  } = {},
): Promise<string> {
  const startTime = Date.now();

  // SOTAI v3: If no model specified and taskHint provided, use intelligent routing
  let resolvedModel = options.model;
  if (!resolvedModel && options.taskHint) {
    try {
      const { routeRequest } = await import("./router");
      const decision = routeRequest(options.taskHint);
      // Map router model ID to Anthropic model ID (only use Anthropic models directly)
      if (decision.model.provider === "anthropic") {
        resolvedModel = decision.model.id.replace("anthropic/", "");
      }
    } catch {
      // Router not available, fall through to default
    }
  }

  const {
    maxTokens = 4096,
    temperature = 0.7,
    taskHint,
  } = options;
  const model = resolvedModel || "claude-sonnet-4-6";

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  // ── Agent Audit Trail — log every Anthropic call ──
  try {
    const { logAgentAction } = await import("@/lib/db/queries");
    await logAgentAction({
      agent_name: taskHint || "system",
      action: "claude_call",
      model: model,
      input_tokens: response.usage?.input_tokens || 0,
      output_tokens: response.usage?.output_tokens || 0,
      cost_usd: calculateCost(model, response.usage),
      duration_ms: Date.now() - startTime,
      success: true,
      metadata: { taskHint },
    } as any);
  } catch {} // Fire and forget

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return textBlock.text;
}

// ---------------------------------------------------------------------------
// Exported Functions
// ---------------------------------------------------------------------------

/**
 * Generate the morning briefing for the sales director.
 */
export async function generateBriefing(
  pipeline: PipelineData,
): Promise<string> {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const progressPercent =
    pipeline.revenueTarget > 0
      ? Math.round((pipeline.revenueThisMonth / pipeline.revenueTarget) * 100)
      : 0;

  const recentActivitySummary = pipeline.recentActivities
    .slice(0, 10)
    .map((a) => `- ${a.prospectName}: ${a.action} (${a.date})`)
    .join("\n");

  // Fetch cross-module data for full empire briefing
  let insightsBlock = "";
  let marchesBlock = "";
  let gulfBlock = "";
  let productionBlock = "";
  let agentBlock = "";
  let researchBlock = "";

  try {
    const supabase = await createClient();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();
    const todayDate = todayStart.toISOString().slice(0, 10);

    const [
      insightsRes,
      marchesRes,
      gulfRes,
      videoActiveRes,
      videoTodayRes,
      imageActiveRes,
      agentLogsRes,
    ] = await Promise.all([
      // Insights
      supabase
        .from("insights")
        .select("type, title, content")
        .order("created_at", { ascending: false })
        .limit(3),
      // Marches publics
      supabase
        .from("marches_publics")
        .select("title, acheteur, date_limite, go_nogo, match_score")
        .gte("date_limite", todayDate)
        .order("date_limite", { ascending: true })
        .limit(5),
      // Gulf Stream
      supabase
        .from("gulf_positions")
        .select("title, pnl, status")
        .eq("status", "open"),
      // Production — active videos
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .in("status", ["processing", "rendering", "pending"]),
      // Production — completed today
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("updated_at", todayISO),
      // Production — active image jobs
      supabase
        .from("image_jobs")
        .select("id", { count: "exact", head: true })
        .in("status", ["processing", "pending"]),
      // Agent logs today
      supabase
        .from("agent_logs")
        .select("cost_usd, duration_ms, success, model")
        .gte("created_at", todayISO),
    ]);

    // Insights
    if (insightsRes.data && insightsRes.data.length > 0) {
      insightsBlock = `\nInsights recents (medallion) :\n${insightsRes.data
        .map((i) => `- [${i.type}] ${i.title} — ${i.content}`)
        .join("\n")}`;
    }

    // Marches publics
    if (marchesRes.data && marchesRes.data.length > 0) {
      marchesBlock = `\nMarches publics ouverts :\n${marchesRes.data
        .map((m) => `- ${m.title?.slice(0, 60)} | ${m.acheteur} | Limite: ${m.date_limite} | Score: ${m.match_score ?? "?"}% | ${m.go_nogo ?? "A EVALUER"}`)
        .join("\n")}`;
    } else {
      marchesBlock = "\nMarches publics : Aucun appel d'offres ouvert.";
    }

    // Gulf Stream
    const gulfPositions = gulfRes.data ?? [];
    if (gulfPositions.length > 0) {
      const totalPnL = gulfPositions.reduce((s, p) => s + (p.pnl ?? 0), 0);
      gulfBlock = `\nGulf Stream :\n- Positions ouvertes : ${gulfPositions.length}\n- PnL total : ${totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}\n- Top positions : ${gulfPositions.sort((a, b) => (b.pnl ?? 0) - (a.pnl ?? 0)).slice(0, 3).map((p) => `${p.title} (${(p.pnl ?? 0) >= 0 ? "+" : ""}${(p.pnl ?? 0).toFixed(1)})`).join(", ")}`;
    } else {
      gulfBlock = "\nGulf Stream : Aucune position ouverte.";
    }

    // Production
    const activeJobs = (videoActiveRes.count ?? 0) + (imageActiveRes.count ?? 0);
    const completedToday = videoTodayRes.count ?? 0;
    productionBlock = `\nProduction :\n- Jobs actifs : ${activeJobs} (video + image)\n- Termines aujourd'hui : ${completedToday}`;

    // Agent health
    const agentLogs = agentLogsRes.data ?? [];
    const totalCalls = agentLogs.length;
    const costToday = agentLogs.reduce((s, l) => s + (l.cost_usd ?? 0), 0);
    const latencies = agentLogs.filter((l) => l.duration_ms).map((l) => l.duration_ms ?? 0);
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const successCount = agentLogs.filter((l) => l.success).length;
    const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 100;
    agentBlock = `\nVillage IA (agents) :\n- Appels aujourd'hui : ${totalCalls}\n- Cout : $${costToday.toFixed(2)}\n- Latence moy. : ${Math.round(avgLatency)}ms\n- Taux de succes : ${successRate}%`;

  } catch {
    // Cross-module data not available — non-blocking
  }

  const userMessage = `Date : ${today}

Donnees du pipeline :
- Prospects chauds : ${pipeline.hotProspects}
- Prospects tiedes : ${pipeline.warmProspects}
- Prospects froids : ${pipeline.coldProspects}
- Emails en attente : ${pipeline.pendingEmails}
- Reunions aujourd'hui : ${pipeline.meetingsToday}
- CA ce mois : ${pipeline.revenueThisMonth.toLocaleString("fr-FR")} EUR
- Objectif mensuel : ${pipeline.revenueTarget.toLocaleString("fr-FR")} EUR
- Progression : ${progressPercent}%

Activites recentes :
${recentActivitySummary || "Aucune activite recente."}
${insightsBlock}
${marchesBlock}
${gulfBlock}
${productionBlock}
${agentBlock}

Genere le briefing matinal complet — tous modules du vaisseau.`;

  return callClaude(BRIEFING_SYSTEM, userMessage, {
    maxTokens: 2048,
    temperature: 0.6,
    taskHint: "commercial briefing pipeline analysis",
  });
}

/**
 * Deep-analyze a prospect, optionally cross-referencing with a chapter from
 * the BYSS sales bible.
 */
export async function analyzeProspect(
  prospect: ProspectData,
  bibleChapter?: string,
): Promise<string> {
  const interactionHistory = prospect.interactions
    .map((i) => `[${i.date}] ${i.type}: ${i.summary}`)
    .join("\n");

  const userMessage = `Prospect a analyser :
- Nom : ${prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.industry}
- Site web : ${prospect.website || "Non renseigne"}
- Email : ${prospect.email || "Non renseigne"}
- Statut actuel : ${prospect.status}
- Budget estime : ${prospect.estimatedBudget ? `${prospect.estimatedBudget.toLocaleString("fr-FR")} EUR` : "Non estime"}
- Besoins identifies : ${prospect.needs?.join(", ") || "A determiner"}
- Points de douleur : ${prospect.painPoints?.join(", ") || "A identifier"}
- Notes : ${prospect.notes || "Aucune"}

Historique des interactions :
${interactionHistory || "Aucune interaction enregistree."}

${bibleChapter ? `Chapitre de reference de la Bible Commerciale BYSS :\n${bibleChapter}` : ""}

Realise une analyse approfondie de ce prospect.`;

  return callClaude(ANALYSIS_SYSTEM, userMessage, {
    model: "claude-opus-4-6", // Always Opus for deep analysis
    maxTokens: 6144,
    temperature: 0.5,
    taskHint: "analyze prospect deep research",
  });
}

/**
 * Draft a commercial email for a prospect.
 */
export async function draftEmail(
  prospect: ProspectData,
  emailType: EmailType,
): Promise<EmailResult> {
  const emailTypeLabels: Record<EmailType, string> = {
    "cold-outreach": "Premier contact (prospection a froid)",
    "follow-up": "Relance suite a un echange precedent",
    proposal: "Envoi de proposition commerciale",
    "meeting-request": "Demande de rendez-vous",
    "thank-you": "Remerciement post-rendez-vous",
    reactivation: "Reactivation d'un prospect inactif",
  };

  const lastInteraction = prospect.interactions.at(-1);

  const userMessage = `Redige un email de type : ${emailTypeLabels[emailType]}

Prospect :
- Nom : ${prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.industry}
- Statut : ${prospect.status}
- Besoins : ${prospect.needs?.join(", ") || "A decouvrir"}
- Points de douleur : ${prospect.painPoints?.join(", ") || "A identifier"}

${lastInteraction ? `Derniere interaction : [${lastInteraction.date}] ${lastInteraction.type} — ${lastInteraction.summary}` : "Aucune interaction precedente."}

Notes additionnelles : ${prospect.notes || "Aucune"}

Reponds UNIQUEMENT avec un JSON valide :
{"subject": "objet de l'email", "body": "corps de l'email complet"}`;

  const raw = await callClaude(EMAIL_SYSTEM, userMessage, {
    maxTokens: 2048,
    temperature: 0.7,
    taskHint: "commercial email draft copywriting",
  });

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    const parsed = JSON.parse(jsonMatch[0]) as EmailResult;
    if (!parsed.subject || !parsed.body) {
      throw new Error("Missing subject or body");
    }
    return parsed;
  } catch {
    // Fallback: treat entire response as body
    return {
      subject: `BYSS GROUP — ${emailTypeLabels[emailType]} pour ${prospect.company}`,
      body: raw,
    };
  }
}

/**
 * Generate proposal content ready for PDF rendering.
 */
export async function generateProposal(
  prospect: ProspectData,
): Promise<string> {
  const userMessage = `Genere une proposition commerciale complete pour :

Client : ${prospect.name}
Entreprise : ${prospect.company}
Secteur : ${prospect.industry}
Budget estime : ${prospect.estimatedBudget ? `${prospect.estimatedBudget.toLocaleString("fr-FR")} EUR` : "A definir ensemble"}
Besoins identifies : ${prospect.needs?.join(", ") || "A preciser lors de la phase de cadrage"}
Points de douleur : ${prospect.painPoints?.join(", ") || "A valider"}
Notes : ${prospect.notes || "Aucune"}

Historique des echanges :
${prospect.interactions.map((i) => `[${i.date}] ${i.type}: ${i.summary}`).join("\n") || "Premier contact."}

Genere le contenu complet de la proposition, pret a etre mis en forme dans un PDF premium BYSS GROUP. Utilise des sections claires avec des titres en markdown.`;

  return callClaude(PROPOSAL_SYSTEM, userMessage, {
    model: "claude-opus-4-6", // Always Opus for proposals
    maxTokens: 8192,
    temperature: 0.5,
    taskHint: "commercial proposal copywriting",
  });
}

/**
 * Score a prospect as hot, warm, or cold with a reason.
 */
export async function scoreProspect(
  prospect: ProspectData,
): Promise<ScoreResult> {
  const userMessage = `Evalue ce prospect :

- Nom : ${prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.industry}
- Statut actuel : ${prospect.status}
- Budget estime : ${prospect.estimatedBudget ? `${prospect.estimatedBudget.toLocaleString("fr-FR")} EUR` : "Inconnu"}
- Besoins : ${prospect.needs?.join(", ") || "Non identifies"}
- Points de douleur : ${prospect.painPoints?.join(", ") || "Non identifies"}
- Nombre d'interactions : ${prospect.interactions.length}
- Derniere interaction : ${prospect.interactions.at(-1)?.date || "Aucune"}

Reponds UNIQUEMENT avec un JSON valide : {"score": "hot"|"warm"|"cold", "reason": "explication"}`;

  const raw = await callClaude(SCORING_SYSTEM, userMessage, {
    maxTokens: 512,
    temperature: 0.3,
    taskHint: "classification score prospect",
  });

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    const parsed = JSON.parse(jsonMatch[0]) as ScoreResult;
    const validScores = ["hot", "warm", "cold"] as const;
    if (!validScores.includes(parsed.score)) {
      throw new Error("Invalid score value");
    }
    return parsed;
  } catch {
    // Fallback based on status
    return {
      score: prospect.status === "new" ? "cold" : prospect.status,
      reason:
        "Scoring automatique base sur le statut actuel. Analyse IA indisponible.",
    };
  }
}

/**
 * Suggest the single most impactful next action for a prospect.
 */
export async function suggestAction(
  prospect: ProspectData,
): Promise<string> {
  const interactionHistory = prospect.interactions
    .slice(-5)
    .map((i) => `[${i.date}] ${i.type}: ${i.summary}`)
    .join("\n");

  const userMessage = `Prospect :
- Nom : ${prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.industry}
- Statut : ${prospect.status}
- Besoins : ${prospect.needs?.join(", ") || "A decouvrir"}
- Points de douleur : ${prospect.painPoints?.join(", ") || "A identifier"}

5 dernieres interactions :
${interactionHistory || "Aucune interaction."}

Quelle est LA prochaine action prioritaire a realiser pour ce prospect ? Sois tres concret.`;

  return callClaude(ACTION_SYSTEM, userMessage, {
    maxTokens: 1024,
    temperature: 0.6,
    taskHint: "commercial suggest next action prospect",
  });
}

/**
 * Natural-language command bar — the user types a question or instruction,
 * and CADIFOR responds with actionable information.
 */
export async function commandBar(
  query: string,
  context?: {
    currentPage?: string;
    selectedProspect?: ProspectData | null;
    pipelineSummary?: {
      total: number;
      hot: number;
      warm: number;
      cold: number;
    };
  },
): Promise<string> {
  let contextBlock = "";

  if (context) {
    const parts: string[] = [];

    if (context.currentPage) {
      parts.push(`Page actuelle : ${context.currentPage}`);
    }

    if (context.selectedProspect) {
      const p = context.selectedProspect;
      parts.push(
        `Prospect selectionne : ${p.name} (${p.company}) — ${p.status}`,
      );
    }

    if (context.pipelineSummary) {
      const s = context.pipelineSummary;
      parts.push(
        `Pipeline : ${s.total} prospects (${s.hot} chauds, ${s.warm} tiedes, ${s.cold} froids)`,
      );
    }

    if (parts.length > 0) {
      contextBlock = `\nContexte actuel :\n${parts.join("\n")}\n`;
    }
  }

  const userMessage = `${contextBlock}\nCommande utilisateur : ${query}`;

  return callClaude(COMMAND_SYSTEM, userMessage, {
    maxTokens: 2048,
    temperature: 0.7,
    taskHint: "commercial command query",
  });
}
