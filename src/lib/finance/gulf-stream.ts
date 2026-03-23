/**
 * ═══════════════════════════════════════════════════════════════════
 * GULF STREAM — Finance Engine (Doctoral-Grade)
 *
 * The Gulf Stream operates in 3 concentric circles:
 *   Circle 1 (Intelligence): Scan Polymarket via Gamma API, filter by volume/liquidity
 *   Circle 2 (Execution):    Kelly sizing, position management, risk limits
 *   Circle 3 (Protection):   Phi-engine guardrail, "Agents of Chaos" safeguards, max drawdown 15%
 *
 * Key academic foundations:
 *   - Kelly Criterion: Confirmed by Renaissance Technologies / Medallion Fund research
 *   - "Agents of Chaos" (2025): LLMs autonomously collude in markets → need externalized governance
 *   - Prediction market structure: ~$6B weekly, projected $20B/month by end 2026
 *
 * Philosophy: The ocean doesn't rush. Neither does capital.
 * $2/day safe cap. Phi-minimum 0.3. Kelly-fractional sizing. Zero emotion.
 * ═══════════════════════════════════════════════════════════════════
 */

import {
  getActiveMarkets,
  getMarketPrices,
  calculateEdge,
  calculateKellyFraction,
  checkPhiGuardrail,
  type Market,
  type EdgeAnalysis,
  type KellyResult,
  type PhiGuardrailResult,
  type MarketSearchParams,
} from "@/lib/integrations/polymarket";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type EdgeType =
  | "logical_arbitrage"
  | "market_making"
  | "narrative"
  | "calendar"
  | "correlation";

export type Platform = "polymarket" | "kalshi";

export interface MarketOpportunity {
  id: string;
  conditionId: string;
  marketName: string;
  platform: Platform;
  edgeType: EdgeType;
  currentPrice: number;
  fairValue: number;
  edge: number;
  edgePercent: number;
  confidence: number;
  kellyFraction: number;
  recommendedSize: number;
  volume: number;
  liquidity: number;
  category: string;
}

export interface Position {
  id: string;
  marketId: string;
  marketName: string;
  side: "yes" | "no";
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  phiScore: number;
  status: "active" | "closed" | "killed";
  createdAt: string;
  reasoning: string;
}

export interface GulfStreamConfig {
  /** Daily budget cap in USD */
  dailyBudget: number;
  /** Maximum position size as percentage of bankroll (0.05 = 5%) */
  maxPositionPct: number;
  /** Drawdown threshold that triggers kill switch (0.15 = 15%) */
  maxDrawdown: number;
  /** Minimum phi score required to enter a trade */
  phiMinimum: number;
  /** Kelly multiplier (0.5 = half-Kelly for safety) */
  kellyMultiplier: number;
  /** Model routing for each circle */
  models: {
    scanning: string;  // minimax/minimax-m2.7
    analysis: string;  // anthropic/claude-sonnet-4.6
    decision: string;  // anthropic/claude-opus-4.6
  };
  /** Anti-manipulation: max share of a market's liquidity (0.05 = 5%) */
  maxMarketImpact: number;
  /** Minimum volume (24h) to consider a market */
  minVolume24h: number;
  /** Minimum liquidity to consider a market */
  minLiquidity: number;
}

export interface PortfolioSummary {
  totalPnl: number;
  activePositions: number;
  closedPositions: number;
  killedPositions: number;
  currentDrawdown: number;
  bankroll: number;
  dailySpend: number;
  winRate: number;
  averageEdge: number;
  phiScore: number;
  collusionRisk: CollusionRisk;
}

export interface CollusionRisk {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  marketImpactPct: number;
  concentrationRisk: number;
  recommendation: string;
}

export interface AuditEntry {
  timestamp: string;
  action: "scan" | "enter" | "exit" | "reduce" | "kill" | "block";
  marketId: string;
  reasoning: string;
  phiScore: number;
  outcome?: string;
}

export interface AgentsOfChaosSafeguard {
  collusionRisk: CollusionRisk;
  marketImpact: { marketId: string; impactPct: number; blocked: boolean }[];
  auditTrail: AuditEntry[];
  governance: {
    phiEngineActive: boolean;
    lastCheck: string;
    interventions: number;
  };
}

export interface ProtocolStatus {
  x402: { name: string; status: "ready" | "pending" | "unavailable"; description: string };
  mpp: { name: string; status: "ready" | "pending" | "unavailable"; description: string };
  tap: { name: string; status: "ready" | "pending" | "unavailable"; description: string };
}

// ─────────────────────────────────────────────
// DEFAULT CONFIG
// ─────────────────────────────────────────────

const DEFAULT_CONFIG: GulfStreamConfig = {
  dailyBudget: 2.0,
  maxPositionPct: 0.05,
  maxDrawdown: 0.15,
  phiMinimum: 0.3,
  kellyMultiplier: 0.5,
  models: {
    scanning: "minimax/minimax-m2.7",
    analysis: "anthropic/claude-sonnet-4.6",
    decision: "anthropic/claude-opus-4.6",
  },
  maxMarketImpact: 0.05,
  minVolume24h: 10_000,
  minLiquidity: 5_000,
};

// ─────────────────────────────────────────────
// STATE (in-memory; Supabase persistence planned)
// ─────────────────────────────────────────────

let positions: Position[] = [];
let bankroll = 100.0;
let dailySpend = 0.0;
let config = { ...DEFAULT_CONFIG };
let auditTrail: AuditEntry[] = [];

// ═════════════════════════════════════════════
// CIRCLE 1 — INTELLIGENCE
// Scan Polymarket via Gamma API, filter by volume/liquidity
// ═════════════════════════════════════════════

/**
 * Scan Polymarket for opportunities with detectable edge.
 * Uses the Gamma API to fetch active markets, then calculates edge
 * using current prices vs a simple implied-probability fair-value model.
 *
 * For production: integrate Claude analysis model to estimate fair values.
 */
export async function scanMarkets(
  searchParams?: MarketSearchParams
): Promise<MarketOpportunity[]> {
  const params: MarketSearchParams = {
    limit: 50,
    active: true,
    closed: false,
    order: "volume",
    ascending: false,
    minVolume: config.minVolume24h,
    minLiquidity: config.minLiquidity,
    ...searchParams,
  };

  let markets: Market[];
  try {
    markets = await getActiveMarkets(params);
  } catch (err) {
    console.error("[GULF STREAM] Circle 1 scan failed:", err);
    return [];
  }

  const opportunities: MarketOpportunity[] = [];

  for (const market of markets) {
    const yesPrice = market.outcomePrices[0] || 0.5;
    const noPrice = market.outcomePrices[1] || 1 - yesPrice;

    // Simple edge detection: markets where prices deviate from 50/50
    // In production, Claude analysis model would provide fair values
    const midpoint = (yesPrice + (1 - noPrice)) / 2;

    // Detect potential edge from spread/competitive metrics
    const impliedFairValue = midpoint;
    const edge = calculateEdge(impliedFairValue, yesPrice, bankroll);

    if (Math.abs(edge.edgePercent) > 3 && market.volume > config.minVolume24h) {
      const kelly = calculateKellyFraction(
        impliedFairValue,
        yesPrice,
        bankroll,
        config.kellyMultiplier
      );

      const edgeType = categorizeEdge(market);

      opportunities.push({
        id: market.id,
        conditionId: market.condition_id,
        marketName: market.question,
        platform: "polymarket",
        edgeType,
        currentPrice: yesPrice,
        fairValue: impliedFairValue,
        edge: edge.edge,
        edgePercent: edge.edgePercent,
        confidence: Math.min(0.95, market.volume / 1_000_000),
        kellyFraction: kelly.halfKelly,
        recommendedSize: kelly.optimalSize,
        volume: market.volume,
        liquidity: market.liquidity,
        category: market.category,
      });
    }
  }

  // Log scan to audit trail
  addAuditEntry({
    action: "scan",
    marketId: "ALL",
    reasoning: `Scanned ${markets.length} markets, found ${opportunities.length} opportunities with edge > 3%`,
    phiScore: getCurrentPhiScore(),
  });

  // Sort by absolute edge descending
  return opportunities.sort((a, b) => Math.abs(b.edgePercent) - Math.abs(a.edgePercent));
}

function categorizeEdge(market: Market): EdgeType {
  const q = market.question.toLowerCase();
  if (q.includes("election") || q.includes("vote") || q.includes("primary")) return "calendar";
  if (q.includes("price") || q.includes("rate") || q.includes("gdp")) return "correlation";
  if (q.includes("launch") || q.includes("release") || q.includes("announce")) return "narrative";
  return "market_making";
}

// ═════════════════════════════════════════════
// CIRCLE 2 — EXECUTION
// Kelly sizing, position management, risk limits
// ═════════════════════════════════════════════

/**
 * Kelly Criterion position sizing.
 * Uses half-Kelly by default for safety.
 *
 * Formula: f* = (bp - q) / b
 *   where b = odds, p = win probability, q = 1-p
 *
 * Half-Kelly captures ~75% of growth with ~50% of variance.
 * Renaissance Technologies confirms Kelly usage for Medallion Fund.
 */
export function calculateKelly(
  probability: number,
  odds: number
): number {
  if (probability <= 0 || probability >= 1 || odds <= 0) return 0;

  const q = 1 - probability;
  const fullKelly = (odds * probability - q) / odds;
  const fractionalKelly = fullKelly * config.kellyMultiplier;

  // Clamp: never risk more than maxPositionPct of bankroll
  return Math.max(0, Math.min(fractionalKelly, config.maxPositionPct));
}

/**
 * Execute a trade on a market opportunity.
 * Respects: daily budget, phi guardrail, position limits,
 * AND "Agents of Chaos" anti-manipulation check.
 */
export async function executeTrade(
  opportunity: MarketOpportunity,
  phiScore: number
): Promise<Position | null> {
  // ── Circle 3 gate: phi guardrail ──
  const guardrail = checkPhiGuardrail(phiScore);
  if (!guardrail.safe) {
    addAuditEntry({
      action: "block",
      marketId: opportunity.id,
      reasoning: `Trade blocked by phi guardrail: ${guardrail.reason}`,
      phiScore,
    });
    console.log(`[GULF STREAM] Trade blocked: ${guardrail.reason}`);
    return null;
  }

  // ── "Agents of Chaos" safeguard: market impact check ──
  const impactPct = opportunity.liquidity > 0
    ? (opportunity.recommendedSize / opportunity.liquidity)
    : 1;

  if (impactPct > config.maxMarketImpact) {
    addAuditEntry({
      action: "block",
      marketId: opportunity.id,
      reasoning: `ANTI-MANIPULATION: Trade would represent ${(impactPct * 100).toFixed(1)}% of market liquidity (limit: ${(config.maxMarketImpact * 100).toFixed(0)}%). Blocked to prevent market manipulation per "Agents of Chaos" research.`,
      phiScore,
    });
    console.log(`[GULF STREAM] Trade blocked: market impact ${(impactPct * 100).toFixed(1)}% exceeds ${(config.maxMarketImpact * 100).toFixed(0)}% limit`);
    return null;
  }

  // ── Budget gate ──
  const tradeSize = Math.min(
    opportunity.recommendedSize,
    config.dailyBudget - dailySpend,
    bankroll * config.maxPositionPct
  );

  if (tradeSize <= 0.01) {
    addAuditEntry({
      action: "block",
      marketId: opportunity.id,
      reasoning: "Trade size too small or daily budget exhausted",
      phiScore,
    });
    console.log("[GULF STREAM] Trade too small or daily budget exhausted");
    return null;
  }

  // ── Create position ──
  const position: Position = {
    id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    marketId: opportunity.id,
    marketName: opportunity.marketName,
    side: opportunity.fairValue > opportunity.currentPrice ? "yes" : "no",
    size: Math.round(tradeSize * 100) / 100,
    entryPrice: opportunity.currentPrice,
    currentPrice: opportunity.currentPrice,
    pnl: 0,
    phiScore,
    status: "active",
    createdAt: new Date().toISOString(),
    reasoning: `Edge: ${(opportunity.edgePercent).toFixed(1)}% | Kelly: ${(opportunity.kellyFraction * 100).toFixed(1)}% | Confidence: ${(opportunity.confidence * 100).toFixed(0)}% | Type: ${opportunity.edgeType}`,
  };

  positions.push(position);
  dailySpend += tradeSize;

  addAuditEntry({
    action: "enter",
    marketId: opportunity.id,
    reasoning: position.reasoning,
    phiScore,
  });

  console.log(
    `[GULF STREAM] Opened: ${position.side} $${position.size} @ ${position.entryPrice} — ${position.marketName}`
  );

  return position;
}

/**
 * Evaluate whether to hold, reduce, or kill a position.
 * Combines PnL trajectory with phi score for decision.
 */
export function evaluatePosition(
  position: Position,
  phiScore: number
): { action: "hold" | "reduce" | "kill"; reason: string } {
  // Kill: phi collapsed below critical threshold
  if (phiScore < 0.1) {
    return { action: "kill", reason: `Phi collapsed to ${phiScore.toFixed(3)} — emergency exit` };
  }

  // Kill: excessive loss
  const lossPct = position.size > 0 ? position.pnl / position.size : 0;
  if (lossPct < -0.5) {
    return { action: "kill", reason: "Loss exceeds 50% of position — kill switch" };
  }

  // Reduce: phi below minimum
  if (phiScore < config.phiMinimum) {
    return {
      action: "reduce",
      reason: `Phi ${phiScore.toFixed(3)} below minimum ${config.phiMinimum} — reduce exposure`,
    };
  }

  // Reduce: take profits on big winner
  if (lossPct > 1.0) {
    return { action: "reduce", reason: "Position up 100%+ — take partial profits" };
  }

  return {
    action: "hold",
    reason: `Healthy. Phi: ${phiScore.toFixed(3)}, PnL: ${lossPct > 0 ? "+" : ""}${(lossPct * 100).toFixed(1)}%`,
  };
}

// ═════════════════════════════════════════════
// CIRCLE 3 — PROTECTION
// Phi-engine guardrail, Agents of Chaos defense, max drawdown 15%
// ═════════════════════════════════════════════

/**
 * Portfolio-wide drawdown check.
 * If total drawdown exceeds 15%, kill EVERYTHING.
 */
export function checkDrawdownKillSwitch(): {
  triggered: boolean;
  drawdown: number;
} {
  const totalPnl = positions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.pnl, 0);

  const drawdown = totalPnl < 0 ? Math.abs(totalPnl) / bankroll : 0;

  if (drawdown >= config.maxDrawdown) {
    positions.forEach((p) => {
      if (p.status === "active") {
        p.status = "killed";
        addAuditEntry({
          action: "kill",
          marketId: p.marketId,
          reasoning: `DRAWDOWN KILL SWITCH: ${(drawdown * 100).toFixed(1)}% exceeds ${(config.maxDrawdown * 100).toFixed(0)}% limit`,
          phiScore: p.phiScore,
        });
      }
    });
    console.log(`[GULF STREAM] KILL SWITCH. Drawdown: ${(drawdown * 100).toFixed(1)}%`);
  }

  return { triggered: drawdown >= config.maxDrawdown, drawdown };
}

/**
 * "Agents of Chaos" phi-score emergency: kill ALL positions.
 * Triggered when phi < 0.3 (from research on LLM autonomous collusion).
 */
export function phiEmergencyKill(phiScore: number): {
  triggered: boolean;
  killed: number;
} {
  if (phiScore >= config.phiMinimum) {
    return { triggered: false, killed: 0 };
  }

  let killed = 0;
  positions.forEach((p) => {
    if (p.status === "active") {
      p.status = "killed";
      killed++;
      addAuditEntry({
        action: "kill",
        marketId: p.marketId,
        reasoning: `PHI EMERGENCY: score ${phiScore.toFixed(3)} < ${config.phiMinimum} — "Agents of Chaos" governance triggered`,
        phiScore,
      });
    }
  });

  console.log(`[GULF STREAM] PHI EMERGENCY KILL: ${killed} positions terminated`);
  return { triggered: true, killed };
}

/**
 * Get "Agents of Chaos" safeguard status.
 * Evaluates collusion risk, market impact across all positions,
 * and provides the full audit trail.
 */
export function getAgentsOfChaosSafeguard(): AgentsOfChaosSafeguard {
  const activePositions = positions.filter((p) => p.status === "active");

  // Calculate market impact for each position
  const marketImpact = activePositions.map((p) => {
    // Use a conservative estimate: size / estimated market liquidity
    const estimatedLiquidity = 50_000; // conservative default
    const impactPct = p.size / estimatedLiquidity;
    return {
      marketId: p.marketId,
      impactPct: Math.round(impactPct * 10000) / 10000,
      blocked: impactPct > config.maxMarketImpact,
    };
  });

  // Concentration risk: how much of bankroll is in one market
  const maxConcentration = activePositions.length > 0
    ? Math.max(...activePositions.map((p) => p.size / bankroll))
    : 0;

  // Total market impact
  const totalImpact = marketImpact.reduce((s, m) => s + m.impactPct, 0);

  let level: CollusionRisk["level"] = "LOW";
  let recommendation = "All positions within safe parameters";
  if (totalImpact > 0.15 || maxConcentration > 0.3) {
    level = "CRITICAL";
    recommendation = "REDUCE IMMEDIATELY: concentrated positions risk market manipulation detection";
  } else if (totalImpact > 0.08 || maxConcentration > 0.15) {
    level = "HIGH";
    recommendation = "Monitor closely: approaching anti-manipulation thresholds";
  } else if (totalImpact > 0.03 || maxConcentration > 0.08) {
    level = "MEDIUM";
    recommendation = "Within bounds but increasing concentration risk";
  }

  const interventions = auditTrail.filter(
    (e) => e.action === "block" || e.action === "kill"
  ).length;

  return {
    collusionRisk: {
      level,
      marketImpactPct: Math.round(totalImpact * 10000) / 10000,
      concentrationRisk: Math.round(maxConcentration * 10000) / 10000,
      recommendation,
    },
    marketImpact,
    auditTrail: auditTrail.slice(-50), // Last 50 entries
    governance: {
      phiEngineActive: true,
      lastCheck: new Date().toISOString(),
      interventions,
    },
  };
}

// ─────────────────────────────────────────────
// PROTOCOL STATUS
// ─────────────────────────────────────────────

/**
 * Get payment protocol integration status.
 * x402: Coinbase agent-native payments
 * MPP: Stripe Merchant Payment Protocol
 * TAP: Agent-to-agent transaction protocol
 */
export function getProtocolStatus(): ProtocolStatus {
  return {
    x402: {
      name: "Coinbase x402",
      status: process.env.COINBASE_API_KEY ? "ready" : "pending",
      description: "Agent-native crypto payments via HTTP 402. Machine-to-machine commerce.",
    },
    mpp: {
      name: "Stripe MPP",
      status: process.env.STRIPE_SECRET_KEY ? "ready" : "pending",
      description: "Merchant Payment Protocol for agent transactions. Virtual card provisioning.",
    },
    tap: {
      name: "TAP Protocol",
      status: "pending",
      description: "Agent-to-agent transaction protocol. Multi-agent coordination layer.",
    },
  };
}

// ─────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────

/**
 * Get full portfolio summary with collusion risk assessment.
 */
export function getPortfolioSummary(): PortfolioSummary {
  const active = positions.filter((p) => p.status === "active");
  const closed = positions.filter((p) => p.status === "closed");
  const killed = positions.filter((p) => p.status === "killed");

  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const winners = [...closed, ...killed].filter((p) => p.pnl > 0).length;
  const totalClosed = closed.length + killed.length;

  const drawdown = totalPnl < 0 ? Math.abs(totalPnl) / bankroll : 0;

  const avgEdge =
    active.length > 0
      ? active.reduce((sum, p) => sum + (p.currentPrice - p.entryPrice), 0) / active.length
      : 0;

  const safeguard = getAgentsOfChaosSafeguard();

  return {
    totalPnl: Math.round(totalPnl * 100) / 100,
    activePositions: active.length,
    closedPositions: closed.length,
    killedPositions: killed.length,
    currentDrawdown: Math.round(drawdown * 10000) / 10000,
    bankroll: Math.round(bankroll * 100) / 100,
    dailySpend: Math.round(dailySpend * 100) / 100,
    winRate: totalClosed > 0 ? Math.round((winners / totalClosed) * 100) : 0,
    averageEdge: Math.round(avgEdge * 10000) / 10000,
    phiScore: getCurrentPhiScore(),
    collusionRisk: safeguard.collusionRisk,
  };
}

// ─────────────────────────────────────────────
// AUDIT TRAIL
// ─────────────────────────────────────────────

function addAuditEntry(entry: Omit<AuditEntry, "timestamp">): void {
  auditTrail.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  // Keep last 500 entries
  if (auditTrail.length > 500) {
    auditTrail = auditTrail.slice(-500);
  }
}

export function getAuditTrail(): AuditEntry[] {
  return [...auditTrail];
}

function getCurrentPhiScore(): number {
  const active = positions.filter((p) => p.status === "active");
  if (active.length === 0) return 0.85; // default safe score
  return active.reduce((sum, p) => sum + p.phiScore, 0) / active.length;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

export function updateConfig(partial: Partial<GulfStreamConfig>): GulfStreamConfig {
  config = { ...config, ...partial };
  return config;
}

export function getConfig(): GulfStreamConfig {
  return { ...config };
}

export function resetDailySpend(): void {
  dailySpend = 0;
}

export function setBankroll(amount: number): void {
  bankroll = amount;
}

// Re-export types from polymarket for convenience
export type { EdgeAnalysis, KellyResult, PhiGuardrailResult };
