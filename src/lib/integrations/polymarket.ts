// ═══════════════════════════════════════════════════════════════════
// BYSS GROUP — Polymarket Integration (Doctoral-Grade)
// CLOB API (clob.polymarket.com) + Gamma API (gamma-api.polymarket.com)
// Rate limits: 3000 req/10min orders, 60/min public
// Auth: L1 (wallet signer) → L2 (API key+secret+passphrase)
// WebSocket: wss://ws-subscriptions-clob.polymarket.com
// ═══════════════════════════════════════════════════════════════════

const CLOB_BASE = "https://clob.polymarket.com";
const GAMMA_BASE = "https://gamma-api.polymarket.com";

// ── Rate Limiter ──
// Public: 60 req/min, Orders: 3000 req/10min
const rateLimiter = {
  public: { count: 0, resetAt: 0, limit: 60, windowMs: 60_000 },
  orders: { count: 0, resetAt: 0, limit: 3000, windowMs: 600_000 },
};

function checkRateLimit(bucket: "public" | "orders"): boolean {
  const rl = rateLimiter[bucket];
  const now = Date.now();
  if (now > rl.resetAt) {
    rl.count = 0;
    rl.resetAt = now + rl.windowMs;
  }
  if (rl.count >= rl.limit) return false;
  rl.count++;
  return true;
}

// ── Cache (5 min TTL) ──
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttl = CACHE_TTL): void {
  cache.set(key, { data, expires: Date.now() + ttl });
}

// ── Types (from CLOB documentation) ──

export type OrderType = "GTC" | "GTD" | "FOK" | "FAK";

export interface Market {
  id: string;
  condition_id: string;
  question: string;
  outcomes: string[];
  outcomePrices: number[];
  volume: number;
  liquidity: number;
  endDate: string;
  category: string;
  active: boolean;
  closed: boolean;
  volume24hr: number;
  competitive: number;
}

export interface MarketDetails extends Market {
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  tokens: TokenInfo[];
  bestBid: number;
  bestAsk: number;
  spread: number;
  tags: string[];
  minimum_order_size: number;
  minimum_tick_size: number;
}

export interface TokenInfo {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBook {
  market: string;
  asset_id: string;
  timestamp: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  hash: string;
}

export interface MidpointResponse {
  mid: string;
}

export interface PriceResponse {
  price: string;
}

export interface MarketPrices {
  marketId: string;
  yes: number;
  no: number;
  lastTradePrice: number;
  midpoint: number;
  spread: number;
  timestamp: string;
}

export interface EdgeAnalysis {
  marketId: string;
  fairValue: number;
  marketPrice: number;
  edge: number;
  edgePercent: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  kellyFraction: number;
  recommendedSize: number;
}

export interface KellyResult {
  fraction: number;
  halfKelly: number;
  optimalSize: number;
  edge: number;
  odds: number;
}

export interface PortfolioPosition {
  id: string;
  marketId: string;
  question: string;
  outcome: string;
  size: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface PhiGuardrailResult {
  safe: boolean;
  action: "hold" | "reduce" | "kill";
  reason: string;
  phiScore: number;
  timestamp: string;
}

export interface MarketSearchParams {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  tag?: string;
  order?: "volume" | "liquidity" | "created_at" | "end_date_min";
  ascending?: boolean;
  /** Minimum 24h volume in USD */
  minVolume?: number;
  /** Minimum liquidity in USD */
  minLiquidity?: number;
}

// ── Headers ──
function getGammaHeaders(): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function getClobHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  // L2 auth: API key + secret + passphrase
  const apiKey = process.env.POLYMARKET_API_KEY;
  const apiSecret = process.env.POLYMARKET_API_SECRET;
  const passphrase = process.env.POLYMARKET_PASSPHRASE;

  if (apiKey) headers["POLY_API_KEY"] = apiKey;
  if (apiSecret) headers["POLY_API_SECRET"] = apiSecret;
  if (passphrase) headers["POLY_PASSPHRASE"] = passphrase;

  return headers;
}

// ── Fetch Helpers ──

async function gammaFetch<T>(path: string, cacheTtl = CACHE_TTL): Promise<T> {
  const cacheKey = `pm:gamma:${path}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit("public")) {
    throw new Error("Polymarket Gamma API rate limit reached (60/min). Retry later.");
  }

  const res = await fetch(`${GAMMA_BASE}${path}`, {
    headers: getGammaHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Polymarket Gamma API error ${res.status}: ${body || res.statusText} — ${path}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data, cacheTtl);
  return data;
}

async function clobFetch<T>(path: string, cacheTtl = 30_000): Promise<T> {
  const cacheKey = `pm:clob:${path}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit("public")) {
    throw new Error("Polymarket CLOB API rate limit reached. Retry later.");
  }

  const res = await fetch(`${CLOB_BASE}${path}`, {
    headers: getClobHeaders(),
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Polymarket CLOB API error ${res.status}: ${body || res.statusText} — ${path}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data, cacheTtl);
  return data;
}

// ═══════════════════════════════════════════════════════════════════
// GAMMA API — Market Discovery (Public, No Auth)
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /markets — Discover active prediction markets
 * Supports filtering by category, volume, liquidity, and pagination.
 */
export async function getActiveMarkets(
  params: MarketSearchParams = {}
): Promise<Market[]> {
  const {
    limit = 20,
    offset = 0,
    active = true,
    closed = false,
    tag,
    order = "volume",
    ascending = false,
    minVolume,
    minLiquidity,
  } = params;

  let path = `/markets?limit=${limit}&offset=${offset}&active=${active}&closed=${closed}`;
  path += `&order=${order}&ascending=${ascending}`;
  if (tag) path += `&tag=${encodeURIComponent(tag)}`;

  const data = await gammaFetch<Record<string, unknown>[]>(path);

  const markets: Market[] = data.map((m) => ({
    id: String(m.id || ""),
    condition_id: String(m.condition_id || m.conditionId || ""),
    question: String(m.question || ""),
    outcomes: (m.outcomes as string[]) || ["Yes", "No"],
    outcomePrices: ((m.outcomePrices as string[]) || []).map(Number),
    volume: Number(m.volume || 0),
    liquidity: Number(m.liquidity || 0),
    endDate: String(m.endDate || m.end_date_iso || ""),
    category: String(m.category || (Array.isArray(m.tags) ? m.tags[0] : null) || "Other"),
    active: Boolean(m.active ?? true),
    closed: Boolean(m.closed ?? false),
    volume24hr: Number(m.volume24hr || 0),
    competitive: Number(m.competitive || 0),
  }));

  // Client-side filters for volume/liquidity thresholds
  return markets.filter((m) => {
    if (minVolume && m.volume < minVolume) return false;
    if (minLiquidity && m.liquidity < minLiquidity) return false;
    return true;
  });
}

/**
 * GET /markets/{id} — Full market details from Gamma
 */
export async function getMarketDetails(
  conditionId: string
): Promise<MarketDetails> {
  const data = await gammaFetch<Record<string, unknown>>(
    `/markets/${conditionId}`
  );

  const prices = ((data.outcomePrices as string[]) || []).map(Number);
  const yesPrice = prices[0] || 0;
  const noPrice = prices[1] || 1 - yesPrice;

  const tokens: TokenInfo[] = ((data.tokens as Record<string, unknown>[]) || []).map((t) => ({
    token_id: String(t.token_id || ""),
    outcome: String(t.outcome || ""),
    price: Number(t.price || 0),
    winner: Boolean(t.winner ?? false),
  }));

  return {
    id: String(data.id || ""),
    condition_id: String(data.condition_id || data.conditionId || conditionId),
    question: String(data.question || ""),
    outcomes: (data.outcomes as string[]) || ["Yes", "No"],
    outcomePrices: prices,
    volume: Number(data.volume || 0),
    liquidity: Number(data.liquidity || 0),
    endDate: String(data.endDate || ""),
    category: String(data.category || "Other"),
    active: Boolean(data.active ?? true),
    closed: Boolean(data.closed ?? false),
    volume24hr: Number(data.volume24hr || 0),
    competitive: Number(data.competitive || 0),
    description: String(data.description || ""),
    slug: String(data.slug || ""),
    createdAt: String(data.createdAt || ""),
    updatedAt: String(data.updatedAt || ""),
    tokens,
    bestBid: yesPrice,
    bestAsk: noPrice,
    spread: Math.abs(yesPrice - (1 - noPrice)),
    tags: (data.tags as string[]) || [],
    minimum_order_size: Number(data.minimum_order_size || 1),
    minimum_tick_size: Number(data.minimum_tick_size || 0.01),
  };
}

// ═══════════════════════════════════════════════════════════════════
// CLOB API — Trading Data (Auth for orders, public for book/prices)
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /book — Order book for a specific token
 * Returns bids and asks with price levels and sizes.
 */
export async function getOrderBook(tokenId: string): Promise<OrderBook> {
  const data = await clobFetch<OrderBook>(
    `/book?token_id=${tokenId}`,
    15_000 // 15s cache for live order book
  );
  return data;
}

/**
 * GET /midpoint — Current midpoint price for a token
 */
export async function getMidpoint(tokenId: string): Promise<number> {
  const data = await clobFetch<MidpointResponse>(
    `/midpoint?token_id=${tokenId}`,
    10_000 // 10s cache
  );
  return parseFloat(data.mid) || 0;
}

/**
 * GET /price — Current price for a token on a specific side
 * @param side - "BUY" or "SELL"
 */
export async function getPrice(
  tokenId: string,
  side: "BUY" | "SELL"
): Promise<number> {
  const data = await clobFetch<PriceResponse>(
    `/price?token_id=${tokenId}&side=${side}`,
    10_000
  );
  return parseFloat(data.price) || 0;
}

/**
 * Get complete pricing snapshot from Gamma (public, no auth needed)
 */
export async function getMarketPrices(marketId: string): Promise<MarketPrices> {
  const data = await gammaFetch<Record<string, unknown>>(
    `/markets/${marketId}`
  );
  const prices = ((data.outcomePrices as string[]) || []).map(Number);
  const yes = prices[0] || 0.5;
  const no = prices[1] || 1 - yes;

  return {
    marketId,
    yes,
    no,
    lastTradePrice: yes,
    midpoint: (yes + (1 - no)) / 2,
    spread: Math.abs(yes - (1 - no)),
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// EDGE DETECTION & KELLY CRITERION
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate edge (mispricing) between fair value and market price.
 * Confidence thresholds calibrated from Renaissance-style research.
 *
 *   HIGH:   |edge| > 10%  — strong mispricing, high confidence entry
 *   MEDIUM: |edge| > 5%   — moderate mispricing, worth considering
 *   LOW:    |edge| <= 5%  — noise range, no trade
 */
export function calculateEdge(
  fairValue: number,
  marketPrice: number,
  bankroll = 100
): EdgeAnalysis {
  const edge = fairValue - marketPrice;
  const edgePercent = marketPrice > 0 ? (edge / marketPrice) * 100 : 0;

  let signal: EdgeAnalysis["signal"] = "HOLD";
  let confidence: EdgeAnalysis["confidence"] = "LOW";

  if (Math.abs(edgePercent) > 10) {
    signal = edge > 0 ? "BUY" : "SELL";
    confidence = "HIGH";
  } else if (Math.abs(edgePercent) > 5) {
    signal = edge > 0 ? "BUY" : "SELL";
    confidence = "MEDIUM";
  }

  const kelly = calculateKellyFraction(fairValue, marketPrice, bankroll);

  return {
    marketId: "",
    fairValue,
    marketPrice,
    edge: Math.round(edge * 10000) / 10000,
    edgePercent: Math.round(edgePercent * 100) / 100,
    signal,
    confidence,
    kellyFraction: kelly.halfKelly,
    recommendedSize: kelly.optimalSize,
  };
}

/**
 * Kelly Criterion — optimal position sizing.
 * Formula: f* = (bp - q) / b
 *   where b = decimal odds, p = probability of winning, q = 1 - p
 *
 * Renaissance Technologies confirmed to use Kelly criterion for
 * position sizing (per academic research & Medallion Fund analysis).
 *
 * We default to half-Kelly for safety:
 *   - Full Kelly is growth-optimal but volatile
 *   - Half-Kelly captures ~75% of growth with ~50% of variance
 *   - Quarter-Kelly for ultra-conservative sizing available
 *
 * @param probability - estimated true probability of outcome (0-1)
 * @param marketPrice - current market price / implied probability (0-1)
 * @param bankroll - total available bankroll in USD
 * @param kellyMultiplier - fraction of full Kelly (default 0.5 = half-Kelly)
 */
export function calculateKellyFraction(
  probability: number,
  marketPrice: number,
  bankroll: number,
  kellyMultiplier = 0.5
): KellyResult {
  if (
    probability <= 0 ||
    probability >= 1 ||
    marketPrice <= 0 ||
    marketPrice >= 1 ||
    bankroll <= 0
  ) {
    return { fraction: 0, halfKelly: 0, optimalSize: 0, edge: 0, odds: 0 };
  }

  const odds = (1 / marketPrice) - 1; // decimal odds
  const q = 1 - probability;
  const fullKelly = (odds * probability - q) / odds;

  if (fullKelly <= 0) {
    return { fraction: 0, halfKelly: 0, optimalSize: 0, edge: probability - marketPrice, odds };
  }

  const fractionalKelly = fullKelly * kellyMultiplier;
  // Clamp: never risk more than 5% of bankroll on a single position
  const clamped = Math.min(fractionalKelly, 0.05);
  const optimalSize = Math.round(clamped * bankroll * 100) / 100;

  return {
    fraction: Math.round(fullKelly * 10000) / 10000,
    halfKelly: Math.round(clamped * 10000) / 10000,
    optimalSize,
    edge: Math.round((probability - marketPrice) * 10000) / 10000,
    odds: Math.round(odds * 100) / 100,
  };
}

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO FROM SUPABASE
// ═══════════════════════════════════════════════════════════════════

/**
 * Read open positions from Supabase trades table.
 * Falls back to empty array if Supabase is not configured.
 */
export async function getPortfolioFromSupabase(): Promise<PortfolioPosition[]> {
  const { createClient } = await import("@supabase/supabase-js");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: trades, error } = await supabase
    .from("polymarket_trades")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error || !trades) return [];

  return trades.map((t: Record<string, unknown>) => {
    const currentPrice = Number(t.current_price || t.entry_price || 0);
    const avgPrice = Number(t.entry_price || 0);
    const size = Number(t.size || 0);
    const pnl = (currentPrice - avgPrice) * size;

    return {
      id: String(t.id),
      marketId: String(t.market_id || ""),
      question: String(t.question || ""),
      outcome: String(t.outcome || "Yes"),
      size,
      avgPrice,
      currentPrice,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent:
        avgPrice > 0
          ? Math.round(((currentPrice - avgPrice) / avgPrice) * 10000) / 100
          : 0,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// PHI-ENGINE GUARDRAIL
// ═══════════════════════════════════════════════════════════════════

/**
 * Check phi-engine guardrail for trade safety.
 *
 * Thresholds (from "Agents of Chaos" research):
 *   >= 0.3: Safe to trade — hold current positions
 *   0.1–0.3: Dangerous — reduce all positions by 50%
 *   < 0.1:  Critical — kill ALL positions immediately
 *
 * The phi-engine acts as an externalized governance layer,
 * preventing autonomous collusion per the academic findings
 * on LLM agents in financial markets.
 */
export function checkPhiGuardrail(phiScore: number): PhiGuardrailResult {
  const timestamp = new Date().toISOString();

  if (phiScore >= 0.3) {
    return {
      safe: true,
      action: "hold",
      reason: "Phi score within safe range — trading permitted",
      phiScore,
      timestamp,
    };
  }

  if (phiScore >= 0.1) {
    return {
      safe: false,
      action: "reduce",
      reason: `Phi score ${phiScore.toFixed(3)} below minimum 0.3 — reduce all positions 50%`,
      phiScore,
      timestamp,
    };
  }

  return {
    safe: false,
    action: "kill",
    reason: `Phi score ${phiScore.toFixed(3)} critical — KILL ALL POSITIONS`,
    phiScore,
    timestamp,
  };
}
