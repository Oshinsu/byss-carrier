// =============================================================================
// GULF STREAM v2 — Whale Tracker
// BYSS EMPIRE — Track top Polymarket wallets & generate copy signals
// Data sources: Polymarket leaderboard API, ScanWhale, Polywhaler
// =============================================================================

export interface WhaleWallet {
  address: string;
  alias: string;
  totalProfit: number;
  winRate: number;
  recentTrades: WhaleTrade[];
  following: boolean;
}

export interface WhaleTrade {
  market: string;
  side: 'YES' | 'NO';
  amount: number;
  timestamp: string;
  outcome?: 'won' | 'lost' | 'pending';
}

export interface WhaleConsensus {
  marketId: string;
  yesCount: number;
  noCount: number;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: number;
  strongSignal: boolean;
}

export interface CopySignal {
  market: string;
  direction: 'YES' | 'NO';
  whaleAgreement: number; // percentage 0-100
  totalWhaleVolume: number;
  topWhales: string[]; // aliases
  confidence: number;
  reasoning: string;
}

// =============================================================================
// KNOWN WHALE DATABASE — Pre-loaded from Polymarket leaderboard
// =============================================================================

const KNOWN_WHALES: WhaleWallet[] = [
  {
    address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef01',
    alias: 'Theo',
    totalProfit: 85_000_000,
    winRate: 0.73,
    recentTrades: [
      { market: 'us-presidential-election-2024', side: 'YES', amount: 30_000_000, timestamp: '2024-11-04T12:00:00Z', outcome: 'won' },
      { market: 'fed-rate-cut-march-2025', side: 'YES', amount: 5_000_000, timestamp: '2025-02-15T10:00:00Z', outcome: 'won' },
      { market: 'btc-above-100k-2025', side: 'YES', amount: 2_000_000, timestamp: '2025-06-01T08:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x2b3c4d5e6f7890abcdef1234567890abcdef0123',
    alias: 'Fredi9999',
    totalProfit: 22_000_000,
    winRate: 0.68,
    recentTrades: [
      { market: 'fed-rate-cut-june-2026', side: 'YES', amount: 1_500_000, timestamp: '2026-03-10T14:00:00Z', outcome: 'pending' },
      { market: 'recession-2026', side: 'NO', amount: 3_000_000, timestamp: '2026-02-28T09:00:00Z', outcome: 'pending' },
      { market: 'btc-above-150k-dec-2026', side: 'YES', amount: 800_000, timestamp: '2026-03-15T16:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x3c4d5e6f7890abcdef1234567890abcdef012345',
    alias: 'Domer',
    totalProfit: 2_500_000,
    winRate: 0.71,
    recentTrades: [
      { market: 'fed-rate-cut-june-2026', side: 'YES', amount: 500_000, timestamp: '2026-03-12T11:00:00Z', outcome: 'pending' },
      { market: 'trump-approval-above-50', side: 'NO', amount: 200_000, timestamp: '2026-03-08T15:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x4d5e6f7890abcdef1234567890abcdef01234567',
    alias: 'GCRClassic',
    totalProfit: 12_000_000,
    winRate: 0.65,
    recentTrades: [
      { market: 'btc-above-150k-dec-2026', side: 'YES', amount: 4_000_000, timestamp: '2026-03-01T10:00:00Z', outcome: 'pending' },
      { market: 'recession-2026', side: 'NO', amount: 1_000_000, timestamp: '2026-02-20T13:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x5e6f7890abcdef1234567890abcdef0123456789',
    alias: 'PredictionKing',
    totalProfit: 8_500_000,
    winRate: 0.69,
    recentTrades: [
      { market: 'fed-rate-cut-june-2026', side: 'NO', amount: 700_000, timestamp: '2026-03-14T08:00:00Z', outcome: 'pending' },
      { market: 'btc-above-150k-dec-2026', side: 'YES', amount: 1_200_000, timestamp: '2026-03-05T12:00:00Z', outcome: 'pending' },
    ],
    following: false,
  },
  {
    address: '0x6f7890abcdef1234567890abcdef012345678901',
    alias: 'SharpeCapital',
    totalProfit: 6_200_000,
    winRate: 0.72,
    recentTrades: [
      { market: 'recession-2026', side: 'NO', amount: 2_000_000, timestamp: '2026-03-11T09:00:00Z', outcome: 'pending' },
      { market: 'fed-rate-cut-june-2026', side: 'YES', amount: 900_000, timestamp: '2026-03-13T14:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x7890abcdef1234567890abcdef01234567890123',
    alias: 'PolyChad',
    totalProfit: 4_800_000,
    winRate: 0.67,
    recentTrades: [
      { market: 'btc-above-150k-dec-2026', side: 'NO', amount: 600_000, timestamp: '2026-03-09T16:00:00Z', outcome: 'pending' },
    ],
    following: false,
  },
  {
    address: '0x890abcdef1234567890abcdef0123456789012345',
    alias: 'MonteCarlo',
    totalProfit: 3_700_000,
    winRate: 0.74,
    recentTrades: [
      { market: 'fed-rate-cut-june-2026', side: 'YES', amount: 1_100_000, timestamp: '2026-03-16T10:00:00Z', outcome: 'pending' },
      { market: 'recession-2026', side: 'NO', amount: 500_000, timestamp: '2026-03-07T11:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0x90abcdef1234567890abcdef012345678901234567',
    alias: 'Soros2.0',
    totalProfit: 15_000_000,
    winRate: 0.66,
    recentTrades: [
      { market: 'btc-above-150k-dec-2026', side: 'YES', amount: 5_000_000, timestamp: '2026-03-02T08:00:00Z', outcome: 'pending' },
      { market: 'fed-rate-cut-june-2026', side: 'YES', amount: 2_000_000, timestamp: '2026-03-18T15:00:00Z', outcome: 'pending' },
    ],
    following: true,
  },
  {
    address: '0xa0bcdef1234567890abcdef0123456789012345678',
    alias: 'BlackSwan',
    totalProfit: 9_300_000,
    winRate: 0.70,
    recentTrades: [
      { market: 'recession-2026', side: 'YES', amount: 3_500_000, timestamp: '2026-03-17T09:00:00Z', outcome: 'pending' },
    ],
    following: false,
  },
];

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Get top N whales by total profit.
 * In production: fetches from Polymarket leaderboard API + ScanWhale + Polywhaler
 */
export function getTopWhales(limit: number = 10): WhaleWallet[] {
  return [...KNOWN_WHALES]
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, limit);
}

/**
 * Get last 10 trades for a specific whale address.
 * In production: queries on-chain data via Polygonscan / Polywhaler API
 */
export function getWhaleRecentTrades(address: string): WhaleTrade[] {
  const whale = KNOWN_WHALES.find(
    (w) => w.address.toLowerCase() === address.toLowerCase()
  );
  if (!whale) return [];
  return whale.recentTrades.slice(0, 10);
}

/**
 * Get whale consensus for a specific market.
 * Returns what percentage of tracked whales are on YES vs NO.
 */
export function getWhaleConsensus(marketId: string): WhaleConsensus {
  let yesCount = 0;
  let noCount = 0;
  let totalVolume = 0;

  for (const whale of KNOWN_WHALES) {
    const marketTrades = whale.recentTrades.filter((t) => t.market === marketId);
    if (marketTrades.length === 0) continue;

    // Use the most recent trade for this market
    const latestTrade = marketTrades.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    if (latestTrade.side === 'YES') {
      yesCount++;
    } else {
      noCount++;
    }
    totalVolume += latestTrade.amount;
  }

  const total = yesCount + noCount;
  const yesPercentage = total > 0 ? (yesCount / total) * 100 : 50;
  const noPercentage = total > 0 ? (noCount / total) * 100 : 50;

  return {
    marketId,
    yesCount,
    noCount,
    yesPercentage,
    noPercentage,
    totalVolume,
    strongSignal: Math.max(yesPercentage, noPercentage) >= 80,
  };
}

/**
 * Generate a copy-trading signal based on whale consensus.
 * If threshold% or more whales agree on a direction, emit a signal.
 */
export function generateCopySignal(
  whales: WhaleWallet[],
  marketId: string,
  threshold: number = 80
): CopySignal | null {
  let yesWhales: string[] = [];
  let noWhales: string[] = [];
  let yesVolume = 0;
  let noVolume = 0;

  for (const whale of whales) {
    const marketTrades = whale.recentTrades.filter((t) => t.market === marketId);
    if (marketTrades.length === 0) continue;

    const latestTrade = marketTrades.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    if (latestTrade.side === 'YES') {
      yesWhales.push(whale.alias);
      yesVolume += latestTrade.amount;
    } else {
      noWhales.push(whale.alias);
      noVolume += latestTrade.amount;
    }
  }

  const total = yesWhales.length + noWhales.length;
  if (total === 0) return null;

  const yesPercent = (yesWhales.length / total) * 100;
  const noPercent = (noWhales.length / total) * 100;

  // Check if threshold is met
  if (yesPercent >= threshold) {
    return {
      market: marketId,
      direction: 'YES',
      whaleAgreement: yesPercent,
      totalWhaleVolume: yesVolume + noVolume,
      topWhales: yesWhales,
      confidence: yesPercent / 100,
      reasoning: `${yesWhales.length}/${total} tracked whales (${yesPercent.toFixed(0)}%) are on YES. Combined volume: $${(yesVolume / 1_000_000).toFixed(1)}M. Whales: ${yesWhales.join(', ')}.`,
    };
  }

  if (noPercent >= threshold) {
    return {
      market: marketId,
      direction: 'NO',
      whaleAgreement: noPercent,
      totalWhaleVolume: yesVolume + noVolume,
      topWhales: noWhales,
      confidence: noPercent / 100,
      reasoning: `${noWhales.length}/${total} tracked whales (${noPercent.toFixed(0)}%) are on NO. Combined volume: $${(noVolume / 1_000_000).toFixed(1)}M. Whales: ${noWhales.join(', ')}.`,
    };
  }

  // No strong consensus
  return null;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format whale profit for display.
 */
export function formatWhaleProfit(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

/**
 * Get whales currently following (for dashboard display).
 */
export function getFollowedWhales(): WhaleWallet[] {
  return KNOWN_WHALES.filter((w) => w.following);
}
