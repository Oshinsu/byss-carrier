/**
 * Usage Tracker — Cost analytics per agent, per model, per day.
 *
 * Inspired by Hermes-Agent usage_pricing.py.
 * Tracks every Claude API call and calculates real costs.
 *
 * SOTAI V3 pricing (March 2026):
 * - Claude Opus 4.6: $15/M input, $75/M output
 * - Claude Sonnet 4: $3/M input, $15/M output
 * - MiniMax M2.7: $0.30/M (unified)
 * - Hunter Alpha: $0.00 (free tier)
 */

export interface UsageRecord {
  id: string;
  agent: string;
  model: string;
  action: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  duration_ms: number;
  success: boolean;
  timestamp: string;
}

// Pricing per million tokens (March 2026)
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-opus-4-6": { input: 15, output: 75 },
  "claude-sonnet-4": { input: 3, output: 15 },
  "claude-haiku-3.5": { input: 0.8, output: 4 },
  "minimax-m2.7": { input: 0.3, output: 0.3 },
  "hunter-alpha": { input: 0, output: 0 },
  "default": { input: 3, output: 15 },
};

const USAGE_LS_KEY = "byss-usage-records";

/**
 * Calculate cost in USD from token counts.
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const p = PRICING[model] || PRICING["default"];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}

/**
 * Log a usage record.
 */
export function logUsage(record: Omit<UsageRecord, "id" | "timestamp">): UsageRecord {
  const full: UsageRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") return full;

  try {
    const records = getUsageRecords();
    records.push(full);
    // Keep last 1000 records
    const trimmed = records.slice(-1000);
    localStorage.setItem(USAGE_LS_KEY, JSON.stringify(trimmed));
  } catch {}

  return full;
}

/**
 * Get all usage records.
 */
export function getUsageRecords(): UsageRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USAGE_LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Get usage summary for a time period.
 */
export function getUsageSummary(days: number = 30) {
  const records = getUsageRecords();
  const cutoff = Date.now() - days * 86400000;
  const recent = records.filter((r) => new Date(r.timestamp).getTime() > cutoff);

  const totalCost = recent.reduce((sum, r) => sum + r.cost_usd, 0);
  const totalTokens = recent.reduce((sum, r) => sum + r.input_tokens + r.output_tokens, 0);
  const totalCalls = recent.length;
  const successRate = recent.length > 0
    ? recent.filter((r) => r.success).length / recent.length
    : 0;

  // Per-agent breakdown
  const byAgent: Record<string, { calls: number; cost: number; tokens: number }> = {};
  for (const r of recent) {
    if (!byAgent[r.agent]) byAgent[r.agent] = { calls: 0, cost: 0, tokens: 0 };
    byAgent[r.agent].calls++;
    byAgent[r.agent].cost += r.cost_usd;
    byAgent[r.agent].tokens += r.input_tokens + r.output_tokens;
  }

  // Per-model breakdown
  const byModel: Record<string, { calls: number; cost: number; tokens: number }> = {};
  for (const r of recent) {
    if (!byModel[r.model]) byModel[r.model] = { calls: 0, cost: 0, tokens: 0 };
    byModel[r.model].calls++;
    byModel[r.model].cost += r.cost_usd;
    byModel[r.model].tokens += r.input_tokens + r.output_tokens;
  }

  // Per-day breakdown
  const byDay: Record<string, number> = {};
  for (const r of recent) {
    const day = r.timestamp.substring(0, 10);
    byDay[day] = (byDay[day] || 0) + r.cost_usd;
  }

  return {
    totalCost: Math.round(totalCost * 10000) / 10000,
    totalTokens,
    totalCalls,
    successRate: Math.round(successRate * 100),
    avgCostPerCall: totalCalls > 0 ? Math.round((totalCost / totalCalls) * 10000) / 10000 : 0,
    byAgent,
    byModel,
    byDay,
  };
}
