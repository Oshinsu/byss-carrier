// ═══════════════════════════════════════════════════════════
// BYSS GROUP — GAN-Inspired Multi-Agent Harness
//
// Architecture:
// - GENERATOR: builds/codes/creates (Sonnet for speed)
// - EVALUATOR: critiques/scores/rejects (different model, skeptical)
// - PLANNER: breaks tasks into sprints with contracts
// - Context Resets: fresh agent per sprint with handoff doc
// ═══════════════════════════════════════════════════════════

import { callOpenRouter } from "@/lib/ai/router";

/* ─── Types ─────────────────────────────────────────────── */

export interface SprintContract {
  id: string;
  goal: string;
  acceptance_criteria: string[];
  estimated_tokens: number;
  model: string;
}

export interface EvaluationResult {
  score: number; // 0-100
  passed: boolean; // score >= threshold
  criteria: {
    fonctionnalite: number;
    qualite_code: number;
    design: number;
    integration: number;
  };
  issues: { severity: "critical" | "major" | "minor"; description: string; location?: string }[];
  suggestions: string[];
  should_pivot: boolean; // true = try completely different approach
}

export interface HandoffDocument {
  sprint_id: string;
  completed_tasks: string[];
  remaining_tasks: string[];
  key_decisions: string[];
  files_modified: string[];
  known_issues: string[];
  context_summary: string; // compressed summary for next agent
}

export interface HarnessConfig {
  generator_model: string;
  evaluator_model: string;
  planner_model: string;
  max_iterations: number;
  acceptance_threshold: number;
  enable_pivot: boolean;
}

export interface HarnessRun {
  success: boolean;
  iterations: number;
  final_score: number;
  evaluations: EvaluationResult[];
  handoff: HandoffDocument;
  pivoted: boolean;
  cost_usd: number;
}

export interface SprintResult {
  sprint: SprintContract;
  generator_output: string;
  evaluation: EvaluationResult;
  iteration: number;
  handoff: HandoffDocument;
}

/* ─── Default Config ────────────────────────────────────── */

export const DEFAULT_HARNESS_CONFIG: HarnessConfig = {
  generator_model: "anthropic/claude-sonnet-4-6",
  evaluator_model: "minimax/minimax-m2.7", // Different model = honest evaluation
  planner_model: "anthropic/claude-sonnet-4-6",
  max_iterations: 5,
  acceptance_threshold: 75,
  enable_pivot: true,
};

/* ─── Evaluator System Prompt — SKEPTICAL ───────────────── */

export const EVALUATOR_PROMPT = `Tu es un évaluateur SCEPTIQUE de code et d'UI pour BYSS GROUP.

RÈGLE FONDAMENTALE: Tu es naturellement méfiant. Tu cherches les problèmes, pas les succès.
Ne te laisse JAMAIS convaincre que "c'est suffisant". Si tu hésites, c'est que c'est insuffisant.

Critères d'évaluation (chacun sur 25 points = 100 total):
1. FONCTIONNALITÉ (25pts): Les features décrites fonctionnent-elles réellement? Pas de mocks?
2. QUALITÉ CODE (25pts): Error handling, loading states, toast feedback, TypeScript strict?
3. DESIGN (25pts): MODE_CADIFOR respecté? Cyan EXECUTOR? Animations pertinentes?
4. INTÉGRATION (25pts): Synergies wirées? RAG context? Supabase CRUD? API réelles?

Pour chaque critère, donne un score ET liste les problèmes trouvés.
Si le score total < 75, REJETTE et liste les corrections nécessaires.
Si tu trouves 0 problème, tu n'as pas assez cherché. Regarde mieux.

Réponds UNIQUEMENT en JSON valide:
{
  "score": number,
  "passed": boolean,
  "criteria": { "fonctionnalite": number, "qualite_code": number, "design": number, "integration": number },
  "issues": [{ "severity": "critical|major|minor", "description": "...", "location": "..." }],
  "suggestions": ["..."],
  "should_pivot": boolean
}`;

/* ─── Planner System Prompt ─────────────────────────────── */

const PLANNER_PROMPT = `Tu es le PLANIFICATEUR du harness GAN pour BYSS GROUP.

Ta mission: décomposer une tâche complexe en sprints indépendants.
Chaque sprint doit avoir des critères d'acceptation clairs et mesurables.

Contexte technique:
- Stack: Next.js 16, Supabase, Claude API, Tailwind 4, Zustand
- Design: MODE_CADIFOR, thème EXECUTOR (cyan, deep space)
- Chaque sprint = context reset (agent frais avec handoff doc)

Réponds UNIQUEMENT en JSON valide:
{
  "sprints": [
    {
      "id": "sprint_1",
      "goal": "...",
      "acceptance_criteria": ["critère mesurable 1", "critère 2"],
      "estimated_tokens": number,
      "model": "anthropic/claude-sonnet-4-6"
    }
  ]
}`;

/* ─── ID Generation ─────────────────────────────────────── */

let _harnessCounter = 0;
function harnessId(prefix: string): string {
  _harnessCounter++;
  return `${prefix}_${Date.now().toString(36)}_${_harnessCounter.toString(36)}`;
}

/* ─── JSON Parsing Helper ───────────────────────────────── */

function parseJSON<T>(raw: string): T | null {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

function parseJSONArray<T>(raw: string): T | null {
  try {
    // Try object first (wraps array)
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]) as T;
    // Try raw array
    const arrMatch = raw.match(/\[[\s\S]*\]/);
    if (arrMatch) return JSON.parse(arrMatch[0]) as T;
    return null;
  } catch {
    return null;
  }
}

/* ─── Core Functions ────────────────────────────────────── */

/**
 * Plan sprints for a complex task
 */
export async function planSprints(
  task: string,
  config: Partial<HarnessConfig> = {},
): Promise<SprintContract[]> {
  const cfg = { ...DEFAULT_HARNESS_CONFIG, ...config };

  const result = await callOpenRouter({
    task: "analysis",
    messages: [
      { role: "system", content: PLANNER_PROMPT },
      { role: "user", content: `Tâche à planifier:\n\n${task}` },
    ],
    temperature: 0.4,
    maxTokens: 2048,
  });

  const parsed = parseJSONArray<{ sprints: SprintContract[] }>(result.content);

  if (!parsed?.sprints?.length) {
    // Fallback: single sprint with the full task
    return [
      {
        id: harnessId("sprint"),
        goal: task,
        acceptance_criteria: ["La tâche est complétée", "Le code compile", "Pas d'erreurs TypeScript"],
        estimated_tokens: 4000,
        model: cfg.generator_model,
      },
    ];
  }

  return parsed.sprints.map((s, i) => ({
    ...s,
    id: s.id || harnessId("sprint"),
    model: s.model || cfg.generator_model,
    estimated_tokens: s.estimated_tokens || 4000,
  }));
}

/**
 * Evaluate content with the skeptical evaluator
 */
export async function evaluate(
  content: string,
  context: string,
  config: Partial<HarnessConfig> = {},
): Promise<EvaluationResult> {
  const cfg = { ...DEFAULT_HARNESS_CONFIG, ...config };

  const result = await callOpenRouter({
    task: "classification", // Uses cheap model routing
    messages: [
      { role: "system", content: EVALUATOR_PROMPT },
      {
        role: "user",
        content: `Contexte: ${context}\n\nContenu à évaluer:\n\`\`\`\n${content}\n\`\`\``,
      },
    ],
    temperature: 0.3,
    maxTokens: 2048,
  });

  const parsed = parseJSON<EvaluationResult>(result.content);

  if (!parsed) {
    return {
      score: 0,
      passed: false,
      criteria: { fonctionnalite: 0, qualite_code: 0, design: 0, integration: 0 },
      issues: [{ severity: "critical", description: "Évaluation impossible — réponse non-parseable" }],
      suggestions: ["Vérifier le format de la réponse évaluateur"],
      should_pivot: false,
    };
  }

  // Ensure consistent scoring
  const score = Math.min(100, Math.max(0, parsed.score || 0));
  return {
    ...parsed,
    score,
    passed: score >= cfg.acceptance_threshold,
    issues: parsed.issues || [],
    suggestions: parsed.suggestions || [],
    criteria: parsed.criteria || { fonctionnalite: 0, qualite_code: 0, design: 0, integration: 0 },
  };
}

/**
 * Evaluate a single page's source code
 */
export async function evaluatePage(
  pageContent: string,
  pageUrl: string,
  config: Partial<HarnessConfig> = {},
): Promise<EvaluationResult> {
  return evaluate(pageContent, `Page: ${pageUrl}`, config);
}

/**
 * Build a handoff document for context reset between sprints
 */
export function buildHandoff(
  sprintId: string,
  completedTasks: string[],
  remainingTasks: string[],
  keyDecisions: string[],
  filesModified: string[],
  knownIssues: string[],
  evaluation: EvaluationResult,
): HandoffDocument {
  const issueSummary = evaluation.issues
    .filter((i) => i.severity !== "minor")
    .map((i) => `[${i.severity}] ${i.description}`)
    .join("; ");

  const contextSummary = [
    `Sprint ${sprintId}: score ${evaluation.score}/100 (${evaluation.passed ? "PASSED" : "FAILED"})`,
    completedTasks.length > 0 ? `Fait: ${completedTasks.join(", ")}` : "",
    remainingTasks.length > 0 ? `Reste: ${remainingTasks.join(", ")}` : "",
    issueSummary ? `Issues: ${issueSummary}` : "",
    keyDecisions.length > 0 ? `Decisions: ${keyDecisions.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    sprint_id: sprintId,
    completed_tasks: completedTasks,
    remaining_tasks: remainingTasks,
    key_decisions: keyDecisions,
    files_modified: filesModified,
    known_issues: knownIssues,
    context_summary: contextSummary,
  };
}

/**
 * Execute a single sprint: Generator → Evaluator loop
 */
export async function executeSprint(
  sprint: SprintContract,
  previousHandoff: HandoffDocument | null,
  config: Partial<HarnessConfig> = {},
): Promise<SprintResult> {
  const cfg = { ...DEFAULT_HARNESS_CONFIG, ...config };

  // Build generator context with previous handoff
  const handoffContext = previousHandoff
    ? `\n\n--- HANDOFF DOCUMENT (Sprint précédent) ---\n${previousHandoff.context_summary}\nFichiers modifiés: ${previousHandoff.files_modified.join(", ")}\nIssues connues: ${previousHandoff.known_issues.join(", ")}\n---`
    : "";

  const criteriaList = sprint.acceptance_criteria.map((c, i) => `${i + 1}. ${c}`).join("\n");

  let generatorOutput = "";
  let evaluation: EvaluationResult = {
    score: 0,
    passed: false,
    criteria: { fonctionnalite: 0, qualite_code: 0, design: 0, integration: 0 },
    issues: [],
    suggestions: [],
    should_pivot: false,
  };
  let iteration = 0;
  let feedbackHistory = "";

  while (iteration < cfg.max_iterations) {
    iteration++;

    // GENERATOR: produce/iterate
    const generatorPrompt = iteration === 1
      ? `Objectif: ${sprint.goal}\n\nCritères d'acceptation:\n${criteriaList}${handoffContext}`
      : `Objectif: ${sprint.goal}\n\nCritères d'acceptation:\n${criteriaList}${handoffContext}\n\n--- FEEDBACK ÉVALUATEUR (iteration ${iteration - 1}) ---\nScore: ${evaluation.score}/100\nIssues:\n${evaluation.issues.map((i) => `- [${i.severity}] ${i.description}`).join("\n")}\nSuggestions:\n${evaluation.suggestions.map((s) => `- ${s}`).join("\n")}\n${feedbackHistory}\n---\n\nCorrige les problèmes signalés et améliore le résultat.`;

    const genResult = await callOpenRouter({
      task: "code",
      messages: [
        {
          role: "system",
          content:
            "Tu es le GENERATOR du harness BYSS GROUP. Tu produis du code Next.js/TypeScript de qualité. Stack: Next.js 16, Supabase, Tailwind 4, Zustand. Design: MODE_CADIFOR, thème EXECUTOR (cyan, deep space). Chaque feature doit être RÉELLE (pas de mocks).",
        },
        { role: "user", content: generatorPrompt },
      ],
      temperature: 0.5,
      maxTokens: sprint.estimated_tokens,
    });

    generatorOutput = genResult.content;

    // EVALUATOR: score with skepticism
    evaluation = await evaluate(
      generatorOutput,
      `Sprint: ${sprint.goal}\nCritères: ${criteriaList}\nIteration: ${iteration}/${cfg.max_iterations}`,
      config,
    );

    // Track feedback for next iteration
    feedbackHistory += `\n[Iteration ${iteration}] Score: ${evaluation.score}`;

    // Check acceptance
    if (evaluation.passed) break;

    // Check pivot
    if (cfg.enable_pivot && evaluation.should_pivot && iteration >= 2) {
      feedbackHistory += " → PIVOT";
      // Reset and try different approach
      generatorOutput = "";
    }
  }

  // Build handoff
  const handoff = buildHandoff(
    sprint.id,
    evaluation.passed ? [sprint.goal] : [],
    evaluation.passed ? [] : [sprint.goal],
    [`Iterations: ${iteration}`, `Score final: ${evaluation.score}`],
    [], // Files would be tracked by the actual code execution
    evaluation.issues.filter((i) => i.severity === "critical").map((i) => i.description),
    evaluation,
  );

  return {
    sprint,
    generator_output: generatorOutput,
    evaluation,
    iteration,
    handoff,
  };
}

/**
 * Full harness run: Plan → Sprint loops → Final handoff
 */
export async function executeWithHarness(
  task: string,
  config: Partial<HarnessConfig> = {},
): Promise<HarnessRun> {
  const cfg = { ...DEFAULT_HARNESS_CONFIG, ...config };

  // 1. Plan sprints
  const sprints = await planSprints(task, config);

  // 2. Execute each sprint with context resets
  const evaluations: EvaluationResult[] = [];
  let previousHandoff: HandoffDocument | null = null;
  let totalIterations = 0;
  let pivoted = false;

  for (const sprint of sprints) {
    const result = await executeSprint(sprint, previousHandoff, config);

    evaluations.push(result.evaluation);
    totalIterations += result.iteration;
    previousHandoff = result.handoff; // Context reset: next sprint gets handoff doc only

    if (result.evaluation.should_pivot) pivoted = true;
  }

  // 3. Final score = average of all sprint scores
  const finalScore =
    evaluations.length > 0
      ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
      : 0;

  // 4. Build final handoff
  const finalHandoff: HandoffDocument = previousHandoff ?? {
    sprint_id: "final",
    completed_tasks: [],
    remaining_tasks: [task],
    key_decisions: [],
    files_modified: [],
    known_issues: [],
    context_summary: "Aucun sprint exécuté",
  };

  // Rough cost estimation
  const costUsd = totalIterations * 0.015; // ~$0.015 per gen+eval cycle

  return {
    success: finalScore >= cfg.acceptance_threshold,
    iterations: totalIterations,
    final_score: finalScore,
    evaluations,
    handoff: finalHandoff,
    pivoted,
    cost_usd: Math.round(costUsd * 1000) / 1000,
  };
}
