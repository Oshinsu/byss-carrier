// ═══════════════════════════════════════════════════════
// AI ROUTER — SOTAI v3 Intelligent Model Selection
//
// 4 Tiers:
//   Tier 3 (Brain): Opus 4.6, Sonnet 4.6, MiniMax M2.7
//   Tier 2 (Support): Hunter Alpha, MiniMax Speech
//   Tier 1 (Utility): Gemini, GPT-5.4, Midjourney
//   Tier 0 (Orchestration): Paperclip, OpenClaw
//
// Before: all-Opus ~$558/mo
// After: multi-model ~$13.20/mo (-97.6%)
// ═══════════════════════════════════════════════════════

import { routeTask, type TaskType, type ModelConfig } from "./models";

export type CostTier = "brain" | "support" | "utility" | "orchestration";

// ── OpenRouter env-based model overrides ──
// Maps task categories to env vars for cheap OpenRouter routing
const OPENROUTER_TASK_MAP: Record<string, string> = {
  // Quick scan/classification → cheapest
  classification: "OPENROUTER_DAILY_MODEL",
  bulk: "OPENROUTER_DAILY_MODEL",
  translation: "OPENROUTER_DAILY_MODEL",
  // Code generation → Kimi K2.5
  code: "OPENROUTER_CODE_MODEL",
  code_heavy: "OPENROUTER_CODE_MODEL",
  // Heavy analysis → Claude Opus 4.6
  analysis: "OPENROUTER_HEAVY_MODEL",
  lore: "OPENROUTER_HEAVY_MODEL",
  copywriting: "OPENROUTER_HEAVY_MODEL",
  // Finance/trading → DeepSeek V3.2
  finance: "OPENROUTER_FINANCE_MODEL",
  // Default daily → Claude Sonnet 4.6
  commercial: "OPENROUTER_DEFAULT_MODEL",
};

/**
 * Resolve the OpenRouter model ID for a given task type.
 * Uses env-configured models when OPENROUTER_API_KEY is set,
 * otherwise falls back to Anthropic direct via the model registry.
 */
export function resolveOpenRouterModel(task: TaskType): string | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const envVar = OPENROUTER_TASK_MAP[task];
  if (!envVar) return process.env.OPENROUTER_DEFAULT_MODEL || null;

  return process.env[envVar] || process.env.OPENROUTER_DEFAULT_MODEL || null;
}

/**
 * Call OpenRouter API with smart model routing.
 * Falls back to Anthropic direct if OPENROUTER_API_KEY is not set.
 */
export async function callOpenRouter(params: {
  task: TaskType;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
}): Promise<{ content: string; model: string; usage?: { prompt_tokens: number; completion_tokens: number } }> {
  const { task, messages, temperature = 0.7, maxTokens = 4096 } = params;
  const startTime = Date.now();

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = resolveOpenRouterModel(task);

  // If OpenRouter is available and we have a model, use it
  if (openRouterKey && openRouterModel) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://byss-group.com",
        "X-Title": "BYSS Carrier",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const result = {
        content: data.choices?.[0]?.message?.content || "",
        model: openRouterModel,
        usage: data.usage,
      };

      // ── Agent Audit Trail — log OpenRouter call ──
      try {
        const { logAgentAction } = await import("@/lib/db/queries");
        const inputTokens = data.usage?.prompt_tokens || 0;
        const outputTokens = data.usage?.completion_tokens || 0;
        // Rough cost estimate for OpenRouter models (avg $2/M in, $6/M out)
        const cost = (inputTokens / 1_000_000) * 2 + (outputTokens / 1_000_000) * 6;
        await logAgentAction({
          agent_name: task || "openrouter",
          action: "openrouter_call",
          model: openRouterModel,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cost_usd: Math.round(cost * 10000) / 10000,
          duration_ms: Date.now() - startTime,
          success: true,
          metadata: { task, provider: "openrouter" },
        } as any);
      } catch {} // Fire and forget

      return result;
    }

    // If OpenRouter fails, fall through to Anthropic
    console.warn(`[router] OpenRouter failed (${res.status}), falling back to Anthropic direct`);
  }

  // Fallback: Anthropic direct
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    throw new Error("No API key available (neither OPENROUTER_API_KEY nor ANTHROPIC_API_KEY)");
  }

  const route = routeTask(task);
  const anthropicModel = route.primary.id.replace("anthropic/", "");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: anthropicModel,
      messages: messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await res.json();
  const result = {
    content: data.content?.[0]?.text || "",
    model: anthropicModel,
    usage: data.usage ? { prompt_tokens: data.usage.input_tokens, completion_tokens: data.usage.output_tokens } : undefined,
  };

  // ── Agent Audit Trail — log Anthropic fallback call ──
  try {
    const { logAgentAction } = await import("@/lib/db/queries");
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const rates: Record<string, { input: number; output: number }> = {
      "claude-opus-4-6": { input: 5.0, output: 25.0 },
      "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
    };
    const rate = rates[anthropicModel] || { input: 3.0, output: 15.0 };
    const cost = (inputTokens / 1_000_000) * rate.input + (outputTokens / 1_000_000) * rate.output;
    await logAgentAction({
      agent_name: task || "system",
      action: "anthropic_fallback_call",
      model: anthropicModel,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: Math.round(cost * 10000) / 10000,
      duration_ms: Date.now() - startTime,
      success: true,
      metadata: { task, provider: "anthropic_fallback" },
    } as any);
  } catch {} // Fire and forget

  return result;
}

interface RoutingDecision {
  model: ModelConfig;
  tier: CostTier;
  reason: string;
  estimatedCostPer1k: number; // cost per 1000 tokens (avg in/out)
  fallback: ModelConfig | null;
}

/**
 * Classify a task type from natural language intent.
 */
export function classifyIntent(input: string): TaskType {
  const lower = input.toLowerCase();

  // Code tasks
  if (/code|debug|refactor|implement|function|component|api|endpoint/.test(lower)) {
    return lower.includes("complex") || lower.includes("architect") ? "code_heavy" : "code";
  }

  // Commercial
  if (/email|prospect|crm|relance|pipeline|client|vente|commercial/.test(lower)) return "commercial";

  // Creative writing
  if (/write|redige|copywriting|lore|cadifor|story|narrative/.test(lower)) return "copywriting";

  // Analysis
  if (/analy|research|rapport|compare|evaluat|diagnostic/.test(lower)) return "analysis";

  // Finance
  if (/trade|arbitrage|kelly|polymarket|gulf.?stream|finance|budget/.test(lower)) return "finance";

  // Lore/world-building
  if (/lore|cadifor|jurassic|temple|doctrine|mytholog/.test(lower)) return "lore";

  // Bulk/classification
  if (/classif|categoriz|sort|batch|bulk|tag/.test(lower)) return "classification";
  if (/translat|tradui/.test(lower)) return "translation";

  // Image
  if (/image|photo|visual|design|illustration/.test(lower)) {
    if (/cinema|film|dramatic/.test(lower)) return "image_cinematic";
    if (/product|produit|packshot/.test(lower)) return "image_product";
    if (/portrait|headshot|face/.test(lower)) return "image_portrait";
    return "image_design";
  }

  // Video
  if (/video|clip|film|animation/.test(lower)) {
    if (/series|episode/.test(lower)) return "video_series";
    if (/social|tiktok|reel|story/.test(lower)) return "video_social";
    return "video_clip";
  }

  // Music
  if (/music|musique|ost|soundtrack/.test(lower)) return "music_ost";
  if (/song|chanson|lyrics/.test(lower)) return "music_song";
  if (/sfx|sound.?effect|bruitage/.test(lower)) return "sfx";

  // Default
  return "commercial";
}

/**
 * Get the cost tier for a task.
 */
function getTier(task: TaskType): CostTier {
  const brainTasks: TaskType[] = ["code_heavy", "copywriting", "lore", "analysis"];
  const supportTasks: TaskType[] = ["code", "finance", "commercial"];
  const utilityTasks: TaskType[] = ["bulk", "classification", "translation"];

  if (brainTasks.includes(task)) return "brain";
  if (supportTasks.includes(task)) return "support";
  if (utilityTasks.includes(task)) return "utility";
  return "support"; // default for media tasks
}

/**
 * Route a natural language request to the optimal model.
 */
export function routeRequest(input: string): RoutingDecision {
  const taskType = classifyIntent(input);
  const route = routeTask(taskType);
  const tier = getTier(taskType);

  const avgCostPer1k =
    (route.primary.costInput + route.primary.costOutput) / 2 / 1000;

  return {
    model: route.primary,
    tier,
    reason: `Task "${taskType}" → ${route.primary.name} (${tier} tier)`,
    estimatedCostPer1k: Math.round(avgCostPer1k * 10000) / 10000,
    fallback: route.fallback,
  };
}

/**
 * Estimate monthly cost with SOTAI v3 routing.
 */
export function estimateSOTAICost(monthlyTokens: number): {
  sotaiCost: number;
  allOpusCost: number;
  savings: number;
  savingsPercent: number;
} {
  // SOTAI v3 weighted average: 40% Sonnet ($9/M avg), 25% MiniMax ($0.75/M avg),
  // 20% Kimi ($1.3/M avg), 10% Opus ($15/M avg), 5% other ($1/M avg)
  const sotaiAvgPerM = 0.4 * 9 + 0.25 * 0.75 + 0.2 * 1.3 + 0.1 * 15 + 0.05 * 1;
  const opusAvgPerM = 15; // $5 in + $25 out, avg $15

  const sotaiCost = (monthlyTokens / 1_000_000) * sotaiAvgPerM;
  const allOpusCost = (monthlyTokens / 1_000_000) * opusAvgPerM;
  const savings = allOpusCost - sotaiCost;

  return {
    sotaiCost: Math.round(sotaiCost * 100) / 100,
    allOpusCost: Math.round(allOpusCost * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    savingsPercent: Math.round((savings / allOpusCost) * 100),
  };
}
