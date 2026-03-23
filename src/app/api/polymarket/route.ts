import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// GULF STREAM — Polymarket Proxy API
// Proxies gamma-api.polymarket.com to avoid CORS issues
// 5-minute in-memory cache
// ═══════════════════════════════════════════════════════

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build query params for Gamma API
    const params = new URLSearchParams();
    const limit = searchParams.get("limit") || "10";
    const active = searchParams.get("active") || "true";
    const closed = searchParams.get("closed") || "false";
    const order = searchParams.get("order") || "volume";
    const ascending = searchParams.get("ascending") || "false";
    const tag = searchParams.get("tag");

    params.set("limit", limit);
    params.set("active", active);
    params.set("closed", closed);
    params.set("order", order);
    params.set("ascending", ascending);
    if (tag) params.set("tag", tag);

    const cacheKey = `polymarket:${params.toString()}`;

    // Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT" },
      });
    }

    // Fetch from Gamma API
    const url = `https://gamma-api.polymarket.com/markets?${params.toString()}`;
    const apiKey = process.env.POLYMARKET_API_KEY;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BYSS-GulfStream/1.0",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      next: { revalidate: 300 }, // Next.js cache: 5 min
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Gamma API error: ${res.status}` },
        { status: res.status }
      );
    }

    const rawData = await res.json();

    // Normalize the data — Gamma API returns markets with varying shapes
    const markets = (Array.isArray(rawData) ? rawData : []).map(
      (m: Record<string, unknown>) => {
        // Parse outcomePrices which can be a JSON string or array
        let outcomePrices: number[] = [0.5, 0.5];
        if (typeof m.outcomePrices === "string") {
          try {
            outcomePrices = JSON.parse(m.outcomePrices as string);
          } catch {
            outcomePrices = [0.5, 0.5];
          }
        } else if (Array.isArray(m.outcomePrices)) {
          outcomePrices = m.outcomePrices as number[];
        }

        // Parse outcomes
        let outcomes: string[] = ["Yes", "No"];
        if (typeof m.outcomes === "string") {
          try {
            outcomes = JSON.parse(m.outcomes as string);
          } catch {
            outcomes = ["Yes", "No"];
          }
        } else if (Array.isArray(m.outcomes)) {
          outcomes = m.outcomes as string[];
        }

        return {
          id: m.id || m.conditionId || "",
          question: m.question || "Unknown Market",
          outcomes,
          outcomePrices: outcomePrices.map(Number),
          volume: Number(m.volume || m.volumeNum || 0),
          liquidity: Number(m.liquidity || m.liquidityNum || 0),
          category: (m.groupSlug as string) || (m.category as string) || "Other",
          endDate: (m.endDate as string) || (m.endDateIso as string) || "",
          slug: m.slug || "",
          description: typeof m.description === "string" ? (m.description as string).slice(0, 300) : "",
        };
      }
    );

    // Cache the result
    setCache(cacheKey, markets);

    return NextResponse.json(markets, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("[Polymarket Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
