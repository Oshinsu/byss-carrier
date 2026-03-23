// @ts-nocheck
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — Vercel AI SDK 6 Wrapper
// Streaming-first AI functions for CADIFOR pipeline
// Model routing via env vars, Anthropic-native
// ═══════════════════════════════════════════════════════

// ── Model routing ─────────────────────────────────────
const OPUS = process.env.AI_MODEL_OPUS ?? "claude-opus-4-6";
const SONNET = process.env.AI_MODEL_SONNET ?? "claude-sonnet-4-6";
const GPT = process.env.AI_MODEL_GPT ?? "gpt-4o";

// ── Re-export providers for route handlers ────────────
export { anthropic, openai };

// ── System prompts ────────────────────────────────────

const SYSTEM_BASE = `Tu es CADIFOR, l'assistant IA strategique de BYSS GROUP, le premier studio IA de la Martinique. Tu operes en tant que directeur commercial virtuel avec une expertise approfondie en prospection B2B, vente consultative et strategie commerciale dans l'ecosysteme caribeen et francais.

Ton style :
- Professionnel mais chaleureux, avec une touche caribbeenne authentique
- Direct et oriente action — chaque reponse doit mener a une decision concrete
- Tu utilises des donnees pour appuyer tes recommandations
- Tu connais parfaitement le marche martiniquais, guadeloupeen et caribeen
- Tu parles toujours en francais

BYSS GROUP propose :
- Developpement de solutions IA sur mesure
- Automatisation des processus metier
- Consulting en strategie IA
- Formation et accompagnement IA
- Developpement web/mobile avec integration IA`;

const ANALYSIS_SYSTEM = `${SYSTEM_BASE}

Tu analyses en profondeur un prospect pour determiner la meilleure strategie d'approche. Fournis :
1. Score de qualification (1-10)
2. Analyse du besoin detecte
3. Points de douleur identifies
4. Budget estime et capacite d'investissement
5. Strategie d'approche recommandee
6. Arguments cles a utiliser
7. Objections potentielles et reponses
8. Timeline recommandee
9. Probabilite de conversion (%)`;

const EMAIL_SYSTEM = `${SYSTEM_BASE}

Tu rediges des emails commerciaux percutants pour BYSS GROUP. Regles :
- Objet accrocheur (max 60 caracteres)
- Corps concis et impactant
- Personnalise selon le prospect et son secteur
- Call-to-action clair et unique
- Ton professionnel mais accessible
- Pas de jargon technique excessif
- Signature : Gary Bissol, Fondateur — BYSS GROUP`;

const COMMAND_SYSTEM = `${SYSTEM_BASE}

Tu es Sorel, l'interface en langage naturel du CRM BYSS GROUP. L'utilisateur te pose des questions ou donne des commandes. Tu reponds de maniere concise et actionnable. Tu peux :
- Resumer des donnees du pipeline
- Suggerer des actions
- Rediger du contenu rapidement
- Analyser des tendances
- Repondre a des questions strategiques

Si la question sort de ton domaine, redirige poliment vers le sujet commercial.`;

// ── Types ─────────────────────────────────────────────

export interface ProspectInput {
  name: string;
  company: string;
  sector: string;
  contact?: string;
  email?: string;
  website?: string;
  score?: number;
  probability?: number;
  basket?: number;
  memorablePhrase?: string;
  painPoints?: string;
  notes?: string;
  stage?: string;
  aiScore?: string;
}

export type EmailType =
  | "cold-outreach"
  | "follow-up"
  | "proposal"
  | "meeting-request"
  | "thank-you"
  | "reactivation";

export interface WorkflowStep {
  id: string;
  action: "analyze" | "draft_email" | "score" | "suggest" | "custom";
  input: Record<string, unknown>;
  dependsOn?: string[];
}

// ── Streaming functions ───────────────────────────────

/**
 * Stream a deep prospect analysis using Claude Opus.
 * Returns a Vercel AI StreamableValue for use with useChat / readStreamableValue.
 */
export function analyzeProspectStream(prospect: ProspectInput) {
  const userMessage = `Prospect a analyser :
- Nom : ${prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.sector}
- Contact : ${prospect.contact || "Non renseigne"}
- Email : ${prospect.email || "Non renseigne"}
- Site web : ${prospect.website || "Non renseigne"}
- Score : ${prospect.score ?? "Non evalue"}/5
- Probabilite : ${prospect.probability ?? "Non estimee"}%
- Panier : ${prospect.basket ? `${prospect.basket.toLocaleString("fr-FR")} EUR` : "Non estime"}
- Phase : ${prospect.stage || "prospect"}
- Points de douleur : ${prospect.painPoints || "A identifier"}
- Notes : ${prospect.notes || "Aucune"}
- Phrase memorable : ${prospect.memorablePhrase || "Aucune"}

Realise une analyse approfondie de ce prospect.`;

  return streamText({
    model: anthropic(OPUS),
    system: ANALYSIS_SYSTEM,
    prompt: userMessage,
    maxOutputTokens: 6144,
    temperature: 0.5,
  });
}

/**
 * Stream an email draft using Claude Sonnet.
 * Faster model for high-volume email generation.
 */
export function draftEmailStream(prospect: ProspectInput, type: EmailType) {
  const emailTypeLabels: Record<EmailType, string> = {
    "cold-outreach": "Premier contact (prospection a froid)",
    "follow-up": "Relance suite a un echange precedent",
    proposal: "Envoi de proposition commerciale",
    "meeting-request": "Demande de rendez-vous",
    "thank-you": "Remerciement post-rendez-vous",
    reactivation: "Reactivation d'un prospect inactif",
  };

  const userMessage = `Redige un email de type : ${emailTypeLabels[type]}

Prospect :
- Nom : ${prospect.contact || prospect.name}
- Entreprise : ${prospect.company}
- Secteur : ${prospect.sector}
- Panier estime : ${prospect.basket ? `${prospect.basket.toLocaleString("fr-FR")} EUR` : "A definir"}
- Points de douleur : ${prospect.painPoints || "A decouvrir"}
- Notes : ${prospect.notes || "Aucune"}

Redige l'email complet avec un objet accrocheur. Format :
OBJET: [objet de l'email]

[corps de l'email]`;

  return streamText({
    model: anthropic(SONNET),
    system: EMAIL_SYSTEM,
    prompt: userMessage,
    maxOutputTokens: 2048,
    temperature: 0.7,
  });
}

/**
 * ToolLoopAgent — chains multiple AI actions with tool calling.
 * Each step can depend on results from previous steps.
 * Uses generateText (non-streaming) for reliable tool execution.
 */
export async function executeWorkflow(steps: WorkflowStep[]) {
  const results: Record<string, string> = {};

  // Define available tools for the agent
  const agentTools = {
    analyzeProspect: tool({
      description: "Analyse approfondie d'un prospect pour qualification et strategie",
      parameters: z.object({
        company: z.string().describe("Nom de l'entreprise"),
        sector: z.string().describe("Secteur d'activite"),
        painPoints: z.string().optional().describe("Points de douleur identifies"),
      }),
      execute: async ({ company, sector, painPoints }) => {
        const result = await generateText({
          model: anthropic(OPUS),
          system: ANALYSIS_SYSTEM,
          prompt: `Analyse rapide : ${company} (${sector}). Pain points: ${painPoints || "A identifier"}`,
          maxOutputTokens: 2048,
        });
        return result.text;
      },
    }),
    draftEmail: tool({
      description: "Redige un email commercial personnalise",
      parameters: z.object({
        prospectName: z.string().describe("Nom du contact"),
        company: z.string().describe("Nom de l'entreprise"),
        emailType: z.string().describe("Type d'email: cold-outreach, follow-up, proposal, meeting-request, thank-you, reactivation"),
        context: z.string().optional().describe("Contexte additionnel"),
      }),
      execute: async ({ prospectName, company, emailType, context }) => {
        const result = await generateText({
          model: anthropic(SONNET),
          system: EMAIL_SYSTEM,
          prompt: `Email ${emailType} pour ${prospectName} de ${company}. ${context || ""}`,
          maxOutputTokens: 2048,
        });
        return result.text;
      },
    }),
    scoreProspect: tool({
      description: "Evalue la temperature d'un prospect: hot, warm, cold",
      parameters: z.object({
        company: z.string(),
        sector: z.string(),
        interactions: z.number().describe("Nombre d'interactions"),
        budget: z.number().optional().describe("Budget estime en EUR"),
      }),
      execute: async ({ company, sector, interactions, budget }) => {
        const result = await generateText({
          model: anthropic(SONNET),
          system: `${SYSTEM_BASE}\n\nEvalue ce prospect. Reponds avec: HOT, WARM, ou COLD suivi d'une explication en 1 ligne.`,
          prompt: `${company} (${sector}), ${interactions} interactions, budget: ${budget ? `${budget} EUR` : "inconnu"}`,
          maxOutputTokens: 256,
        });
        return result.text;
      },
    }),
    suggestAction: tool({
      description: "Recommande la prochaine action concrete pour un prospect",
      parameters: z.object({
        company: z.string(),
        currentStage: z.string(),
        lastInteraction: z.string().optional(),
      }),
      execute: async ({ company, currentStage, lastInteraction }) => {
        const result = await generateText({
          model: anthropic(SONNET),
          system: `${SYSTEM_BASE}\n\nRecommande UNE action prioritaire, concrete et datee.`,
          prompt: `${company}, phase: ${currentStage}. Derniere interaction: ${lastInteraction || "Aucune"}`,
          maxOutputTokens: 512,
        });
        return result.text;
      },
    }),
  };

  // Execute steps in dependency order
  for (const step of steps) {
    // Wait for dependencies
    if (step.dependsOn) {
      const missingDeps = step.dependsOn.filter((dep) => !(dep in results));
      if (missingDeps.length > 0) {
        results[step.id] = `[ERREUR] Dependencies manquantes: ${missingDeps.join(", ")}`;
        continue;
      }
    }

    // Inject dependency results into input
    const enrichedInput = { ...step.input };
    if (step.dependsOn) {
      enrichedInput._previousResults = step.dependsOn.reduce(
        (acc, dep) => {
          acc[dep] = results[dep];
          return acc;
        },
        {} as Record<string, string>,
      );
    }

    try {
      if (step.action === "custom") {
        // Custom action uses the full tool loop
        const { text } = await generateText({
          model: anthropic(OPUS),
          system: `${SYSTEM_BASE}\n\nTu es un agent autonome qui execute des taches commerciales. Utilise les outils disponibles pour accomplir la tache demandee. Chaine les appels si necessaire.`,
          prompt: JSON.stringify(enrichedInput),
          tools: agentTools,
          maxSteps: 5,
          maxOutputTokens: 4096,
        });
        results[step.id] = text;
      } else {
        // Direct action mapping
        const { text } = await generateText({
          model: anthropic(step.action === "analyze" ? OPUS : SONNET),
          system: step.action === "analyze" ? ANALYSIS_SYSTEM : SYSTEM_BASE,
          prompt: JSON.stringify(enrichedInput),
          maxOutputTokens: 4096,
        });
        results[step.id] = text;
      }
    } catch (err) {
      results[step.id] = `[ERREUR] ${err instanceof Error ? err.message : "Execution echouee"}`;
    }
  }

  return results;
}

/**
 * Stream command bar responses using Sorel persona.
 * For the natural-language CRM interface.
 */
export function askSorelStream(
  question: string,
  context?: {
    currentPage?: string;
    pipelineSummary?: { total: number; hot: number; warm: number; cold: number };
    selectedProspect?: { name: string; company: string; stage: string } | null;
  },
) {
  let contextBlock = "";

  if (context) {
    const parts: string[] = [];
    if (context.currentPage) {
      parts.push(`Page actuelle : ${context.currentPage}`);
    }
    if (context.selectedProspect) {
      const p = context.selectedProspect;
      parts.push(`Prospect selectionne : ${p.name} (${p.company}) — ${p.stage}`);
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

  return streamText({
    model: anthropic(SONNET),
    system: COMMAND_SYSTEM,
    prompt: `${contextBlock}\nCommande utilisateur : ${question}`,
    maxOutputTokens: 2048,
    temperature: 0.7,
  });
}
