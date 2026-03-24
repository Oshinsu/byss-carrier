import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import { callOpenRouter } from "@/lib/ai/router";
import { TARGET_MARKETS, NICHES } from "@/lib/ecommerce";

// ═══════════════════════════════════════════════════════
// E-COMMERCE API — Market Analysis + Product Finder + Store Builder
// 4 actions: analyze_market, find_products, generate_store_plan, competitor_analysis
// ═══════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const { allowed } = rateLimit("ecommerce-route", 8, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const start = Date.now();

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "analyze_market":
        return handleAnalyzeMarket(body, start);
      case "find_products":
        return handleFindProducts(body, start);
      case "generate_store_plan":
        return handleGenerateStorePlan(body, start);
      case "competitor_analysis":
        return handleCompetitorAnalysis(body, start);
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[ecommerce] API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}

/* ── Action: Analyze Market ───────────────────────────── */

async function handleAnalyzeMarket(body: Record<string, unknown>, start: number) {
  const { niche, country } = body as { niche: string; country: string };
  if (!niche || !country) {
    return NextResponse.json({ error: "niche and country required" }, { status: 400 });
  }

  const market = TARGET_MARKETS.find((m) => m.id === country || m.name === country);
  const marketContext = market
    ? `Market: ${market.name}, Currency: ${market.currency}, Avg Order Value: $${market.avgOrderValue}, Ad CPM: $${market.adCostPer1000}, Language: ${market.lang}`
    : `Market: ${country}`;

  const prompt = `You are a dropshipping market analyst for BYSS GROUP. Analyze this market opportunity.

Niche: ${niche}
${marketContext}

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, pure JSON):
{
  "niche": "${niche}",
  "country": "${country}",
  "marketSize": "estimated market size (e.g. '$2.3B globally, $45M in ${country}')",
  "competitionLevel": "blue_ocean" or "moderate" or "saturated",
  "trendingProducts": ["product1", "product2", "product3", "product4", "product5"],
  "recommendedPlatforms": ["platform1", "platform2"],
  "estimatedMargins": "e.g. '35-55%'",
  "adStrategy": "recommended ad strategy in 2-3 sentences",
  "startupCost": "e.g. '$200-500'",
  "score": 0-100 (market opportunity score)
}

Be specific to the ${country} market. Consider local purchasing power, logistics, payment methods, and cultural fit. Score reflects: demand * margin * low-competition * logistics-ease.`;

  const result = await callOpenRouter({
    task: "analysis",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    maxTokens: 2048,
  });

  try {
    const cleaned = result.content.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    analysis.timestamp = new Date().toISOString();
    return NextResponse.json({ data: analysis, duration: Date.now() - start, model: result.model });
  } catch {
    return NextResponse.json({
      data: {
        niche,
        country,
        raw: result.content,
        score: 50,
        competitionLevel: "moderate",
        trendingProducts: [],
        recommendedPlatforms: [],
        estimatedMargins: "N/A",
        adStrategy: result.content.slice(0, 200),
        startupCost: "N/A",
        marketSize: "N/A",
        timestamp: new Date().toISOString(),
      },
      duration: Date.now() - start,
      model: result.model,
    });
  }
}

/* ── Action: Find Products ────────────────────────────── */

async function handleFindProducts(body: Record<string, unknown>, start: number) {
  const { niche, priceRange } = body as { niche: string; priceRange: string };
  if (!niche) {
    return NextResponse.json({ error: "niche required" }, { status: 400 });
  }

  const range = priceRange || "$5-$30";

  const prompt = `You are a dropshipping product research expert for BYSS GROUP. Find winning products.

Niche: ${niche}
Price range (selling price): ${range}

Return a JSON array of exactly 10 product ideas. No markdown, no code blocks, pure JSON array:
[
  {
    "name": "product name",
    "cost": 5.50,
    "sellingPrice": 19.99,
    "margin": 72,
    "source": "CJDropshipping" or "AliExpress" or "Local supplier",
    "marketingAngle": "one compelling sentence for ad copy"
  }
]

Focus on:
- Products with viral TikTok potential
- High perceived value vs actual cost
- Lightweight for cheap shipping
- Problem-solving or impulse-buy products
- Seasonal trends 2026
Costs in USD. Margin as percentage.`;

  const result = await callOpenRouter({
    task: "analysis",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    maxTokens: 3000,
  });

  try {
    const cleaned = result.content.replace(/```json\n?|\n?```/g, "").trim();
    const products = JSON.parse(cleaned);
    const withIds = products.map((p: Record<string, unknown>, i: number) => ({
      ...p,
      id: `prod_${Date.now()}_${i}`,
    }));
    return NextResponse.json({ data: withIds, duration: Date.now() - start, model: result.model });
  } catch {
    return NextResponse.json({
      data: [],
      raw: result.content,
      duration: Date.now() - start,
      model: result.model,
    });
  }
}

/* ── Action: Generate Store Plan ──────────────────────── */

async function handleGenerateStorePlan(body: Record<string, unknown>, start: number) {
  const { niche, products, country, budget } = body as {
    niche: string;
    products: Array<{ name: string }>;
    country: string;
    budget: number;
  };

  if (!niche || !country) {
    return NextResponse.json({ error: "niche and country required" }, { status: 400 });
  }

  const productList = (products || []).map((p) => p.name).join(", ") || "TBD";
  const budgetStr = budget ? `$${budget}` : "$500";

  const prompt = `You are a Shopify store strategist for BYSS GROUP. Create a complete store launch plan.

Niche: ${niche}
Target market: ${country}
Products: ${productList}
Budget: ${budgetStr}

Return a JSON object with EXACTLY this structure (no markdown, pure JSON):
{
  "storeNames": ["name1", "name2", "name3", "name4", "name5"],
  "brandIdentity": {
    "colors": ["#hex1", "#hex2", "#hex3"],
    "tone": "brand voice description",
    "targetAudience": "specific demographic"
  },
  "pages": ["page1", "page2", "page3", "page4", "page5"],
  "homepageStructure": ["section1", "section2", "section3", "section4", "section5"],
  "adCreativesBrief": "brief for Kling/Replicate video ad generation",
  "launchTimeline": [
    { "day": 1, "task": "task description" },
    { "day": 2, "task": "task description" },
    { "day": 3, "task": "task description" },
    { "day": 4, "task": "task description" },
    { "day": 5, "task": "task description" },
    { "day": 6, "task": "task description" },
    { "day": 7, "task": "task description" }
  ],
  "budgetAllocation": [
    { "category": "Ads", "amount": 200, "percentage": 40 },
    { "category": "Tools", "amount": 100, "percentage": 20 },
    { "category": "Inventory", "amount": 100, "percentage": 20 },
    { "category": "Creative", "amount": 50, "percentage": 10 },
    { "category": "Reserve", "amount": 50, "percentage": 10 }
  ]
}

Store names: catchy, domain-available style, fits the ${country} market.
Budget allocation must sum to ${budgetStr}.
Timeline: 7-day sprint to first sale.`;

  const result = await callOpenRouter({
    task: "analysis",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    maxTokens: 3000,
  });

  try {
    const cleaned = result.content.replace(/```json\n?|\n?```/g, "").trim();
    const plan = JSON.parse(cleaned);
    return NextResponse.json({ data: plan, duration: Date.now() - start, model: result.model });
  } catch {
    return NextResponse.json({
      data: { raw: result.content },
      duration: Date.now() - start,
      model: result.model,
    });
  }
}

/* ── Action: Competitor Analysis ──────────────────────── */

async function handleCompetitorAnalysis(body: Record<string, unknown>, start: number) {
  const { competitor_url } = body as { competitor_url: string };
  if (!competitor_url) {
    return NextResponse.json({ error: "competitor_url required" }, { status: 400 });
  }

  const prompt = `You are a competitive intelligence analyst for BYSS GROUP e-commerce division.

Analyze this competitor store (based on the URL/description, not actual scraping):
URL: ${competitor_url}

Infer what you can from the domain name, niche signals, and common patterns for this type of store.

Return a JSON object (no markdown, pure JSON):
{
  "url": "${competitor_url}",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "pricingStrategy": "description of likely pricing approach",
  "trafficEstimate": "estimated monthly visitors range",
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "timestamp": "${new Date().toISOString()}"
}

Be realistic and actionable. Focus on gaps we can exploit.`;

  const result = await callOpenRouter({
    task: "analysis",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    maxTokens: 2048,
  });

  try {
    const cleaned = result.content.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json({ data: analysis, duration: Date.now() - start, model: result.model });
  } catch {
    return NextResponse.json({
      data: { url: competitor_url, raw: result.content, timestamp: new Date().toISOString() },
      duration: Date.now() - start,
      model: result.model,
    });
  }
}
