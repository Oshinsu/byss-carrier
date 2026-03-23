// =============================================================================
// GULF STREAM v2 — Cross-Platform Arbitrage Scanner
// BYSS EMPIRE — Detect risk-free spreads between Polymarket & Kalshi
// =============================================================================

export interface ArbitrageOpportunity {
  market: string;
  polymarketYesPrice: number;
  polymarketNoPrice: number;
  kalshiYesPrice: number;
  kalshiNoPrice: number;
  spread: number;
  profitPerDollar: number;
  direction: 'buy_poly_yes_kalshi_no' | 'buy_poly_no_kalshi_yes';
  viable: boolean; // spread > fees (2% Poly + Kalshi fees)
}

export interface SpreadCalculation {
  grossSpread: number;
  polymarketFee: number;
  kalshiFee: number;
  totalFees: number;
  netProfit: number;
  profitable: boolean;
}

export interface HistoricalSpread {
  market: string;
  date: string;
  averageSpread: number;
  maxSpread: number;
  minSpread: number;
  opportunityCount: number;
}

// =============================================================================
// FEE STRUCTURE
// =============================================================================

const FEES = {
  polymarket: {
    winnerFee: 0.02, // 2% on winnings
    makerRebate: 0.0, // Makers get 0% fee currently
    takerFee: 0.02, // Takers pay 2%
  },
  kalshi: {
    tradeFee: 0.07, // ~7% effective fee on profits
    minFee: 0.01, // Minimum 1 cent per contract
    maxFee: 0.07, // Capped at 7 cents per contract
  },
};

// =============================================================================
// MOCK CROSS-PLATFORM MARKET DATA
// In production: real-time APIs from both platforms
// Polymarket: GET https://clob.polymarket.com/markets
// Kalshi: GET https://trading-api.kalshi.com/trade-api/v2/markets
// =============================================================================

interface CrossPlatformMarket {
  slug: string;
  name: string;
  polymarketYes: number;
  kalshiYes: number;
  liquidity: 'low' | 'medium' | 'high';
  expiresAt: string;
}

const MOCK_MARKETS: CrossPlatformMarket[] = [
  {
    slug: 'fed-rate-cut-june-2026',
    name: 'Fed Rate Cut by June 2026',
    polymarketYes: 0.62,
    kalshiYes: 0.58,
    liquidity: 'high',
    expiresAt: '2026-06-30T23:59:59Z',
  },
  {
    slug: 'btc-above-100k-july-2026',
    name: 'Bitcoin above $100K by July 2026',
    polymarketYes: 0.71,
    kalshiYes: 0.74,
    liquidity: 'high',
    expiresAt: '2026-07-31T23:59:59Z',
  },
  {
    slug: 'recession-2026',
    name: 'US Recession in 2026',
    polymarketYes: 0.28,
    kalshiYes: 0.25,
    liquidity: 'high',
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    slug: 'trump-approval-above-50',
    name: 'Trump Approval Above 50%',
    polymarketYes: 0.45,
    kalshiYes: 0.41,
    liquidity: 'medium',
    expiresAt: '2026-06-30T23:59:59Z',
  },
  {
    slug: 'ai-replace-10pct-jobs-2026',
    name: 'AI Replaces 10% of US Jobs by 2026',
    polymarketYes: 0.15,
    kalshiYes: 0.12,
    liquidity: 'medium',
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    slug: 'sp500-above-6000-2026',
    name: 'S&P 500 Above 6000 End of 2026',
    polymarketYes: 0.68,
    kalshiYes: 0.65,
    liquidity: 'high',
    expiresAt: '2026-12-31T23:59:59Z',
  },
];

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Calculate the spread between two platforms for a given market.
 * Accounts for fees on both sides.
 */
export function calculateSpread(
  polyPrice: number,
  kalshiPrice: number,
  direction: 'buy_poly_yes_kalshi_no' | 'buy_poly_no_kalshi_yes'
): SpreadCalculation {
  let totalCost: number;
  let polyFee: number;
  let kalshiFee: number;

  if (direction === 'buy_poly_yes_kalshi_no') {
    // Buy YES on Poly + Buy NO on Kalshi
    // One side always wins, payout is $1.00
    totalCost = polyPrice + (1 - kalshiPrice);
    polyFee = FEES.polymarket.winnerFee; // 2% on the winning side
    kalshiFee = FEES.kalshi.tradeFee; // 7% on Kalshi winnings
  } else {
    // Buy NO on Poly + Buy YES on Kalshi
    totalCost = (1 - polyPrice) + kalshiPrice;
    polyFee = FEES.polymarket.winnerFee;
    kalshiFee = FEES.kalshi.tradeFee;
  }

  const grossSpread = 1.0 - totalCost; // Gross profit if one side pays $1
  const totalFees = Math.max(polyFee, kalshiFee); // Worst-case fee on winner
  const netProfit = grossSpread - totalFees;

  return {
    grossSpread,
    polymarketFee: polyFee,
    kalshiFee: kalshiFee,
    totalFees,
    netProfit,
    profitable: netProfit > 0,
  };
}

/**
 * Check if an arbitrage opportunity is viable.
 * Considers fees, liquidity, and execution speed requirements.
 */
export function isViable(opportunity: ArbitrageOpportunity): boolean {
  // Must be profitable after all fees
  if (opportunity.profitPerDollar <= 0) return false;

  // Minimum spread of 0.5% to cover slippage
  if (opportunity.spread < 0.005) return false;

  // Profit must be at least 0.5 cents per dollar to justify execution
  if (opportunity.profitPerDollar < 0.005) return false;

  return true;
}

/**
 * Scan all cross-platform markets for arbitrage opportunities.
 * Checks both directions (Poly YES + Kalshi NO, and vice versa).
 */
export function scanArbitrageOpportunities(): ArbitrageOpportunity[] {
  const opportunities: ArbitrageOpportunity[] = [];

  for (const market of MOCK_MARKETS) {
    const polyYes = market.polymarketYes;
    const polyNo = 1 - polyYes;
    const kalshiYes = market.kalshiYes;
    const kalshiNo = 1 - kalshiYes;

    // Direction 1: Buy Poly YES + Kalshi NO
    const spread1 = calculateSpread(polyYes, kalshiYes, 'buy_poly_yes_kalshi_no');
    const opp1: ArbitrageOpportunity = {
      market: market.slug,
      polymarketYesPrice: polyYes,
      polymarketNoPrice: polyNo,
      kalshiYesPrice: kalshiYes,
      kalshiNoPrice: kalshiNo,
      spread: spread1.grossSpread,
      profitPerDollar: spread1.netProfit,
      direction: 'buy_poly_yes_kalshi_no',
      viable: spread1.profitable,
    };

    if (isViable(opp1)) {
      opportunities.push(opp1);
    }

    // Direction 2: Buy Poly NO + Kalshi YES
    const spread2 = calculateSpread(polyYes, kalshiYes, 'buy_poly_no_kalshi_yes');
    const opp2: ArbitrageOpportunity = {
      market: market.slug,
      polymarketYesPrice: polyYes,
      polymarketNoPrice: polyNo,
      kalshiYesPrice: kalshiYes,
      kalshiNoPrice: kalshiNo,
      spread: spread2.grossSpread,
      profitPerDollar: spread2.netProfit,
      direction: 'buy_poly_no_kalshi_yes',
      viable: spread2.profitable,
    };

    if (isViable(opp2)) {
      opportunities.push(opp2);
    }
  }

  // Sort by profit per dollar descending
  return opportunities.sort((a, b) => b.profitPerDollar - a.profitPerDollar);
}

/**
 * Get historical spread data for a specific market.
 * In production: queries time-series database of past spreads.
 * Mock data shows typical spread patterns.
 */
export function getHistoricalSpreads(market: string): HistoricalSpread[] {
  // Mock historical data — in production this comes from a time-series DB
  // tracking price deltas between platforms every 5 seconds
  const mockHistory: HistoricalSpread[] = [
    {
      market,
      date: '2026-03-15',
      averageSpread: 0.032,
      maxSpread: 0.078,
      minSpread: 0.005,
      opportunityCount: 14,
    },
    {
      market,
      date: '2026-03-16',
      averageSpread: 0.028,
      maxSpread: 0.065,
      minSpread: 0.003,
      opportunityCount: 11,
    },
    {
      market,
      date: '2026-03-17',
      averageSpread: 0.041,
      maxSpread: 0.092,
      minSpread: 0.008,
      opportunityCount: 22,
    },
    {
      market,
      date: '2026-03-18',
      averageSpread: 0.025,
      maxSpread: 0.055,
      minSpread: 0.002,
      opportunityCount: 8,
    },
    {
      market,
      date: '2026-03-19',
      averageSpread: 0.035,
      maxSpread: 0.081,
      minSpread: 0.006,
      opportunityCount: 17,
    },
    {
      market,
      date: '2026-03-20',
      averageSpread: 0.029,
      maxSpread: 0.063,
      minSpread: 0.004,
      opportunityCount: 12,
    },
    {
      market,
      date: '2026-03-21',
      averageSpread: 0.038,
      maxSpread: 0.088,
      minSpread: 0.007,
      opportunityCount: 19,
    },
  ];

  return mockHistory;
}

// =============================================================================
// UTILITY & DISPLAY FUNCTIONS
// =============================================================================

/**
 * Format an arbitrage opportunity for dashboard display.
 */
export function formatOpportunity(opp: ArbitrageOpportunity): string {
  const dir =
    opp.direction === 'buy_poly_yes_kalshi_no'
      ? 'Poly YES + Kalshi NO'
      : 'Poly NO + Kalshi YES';
  const profit = (opp.profitPerDollar * 100).toFixed(2);
  const spread = (opp.spread * 100).toFixed(2);
  return `[${opp.market}] ${dir} | Spread: ${spread}% | Net profit: ${profit} cents/dollar | Viable: ${opp.viable}`;
}

/**
 * Get a summary of current arbitrage landscape.
 */
export function getArbitrageSummary(): {
  totalOpportunities: number;
  viableOpportunities: number;
  bestOpportunity: ArbitrageOpportunity | null;
  averageProfitPerDollar: number;
} {
  const all = scanArbitrageOpportunities();
  const viable = all.filter((o) => o.viable);
  const avgProfit =
    viable.length > 0
      ? viable.reduce((sum, o) => sum + o.profitPerDollar, 0) / viable.length
      : 0;

  return {
    totalOpportunities: all.length,
    viableOpportunities: viable.length,
    bestOpportunity: viable[0] || null,
    averageProfitPerDollar: Math.round(avgProfit * 10000) / 10000,
  };
}
