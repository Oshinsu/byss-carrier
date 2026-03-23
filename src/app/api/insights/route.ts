// ═══════════════════════════════════════════════════════
// INSIGHTS API — Phase 6B
// GET: fetch latest insights
// POST: generate new insight from medallion data + Claude
// ═══════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limiter";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ---------------------------------------------------------------------------
// GET — Fetch latest insights
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const type = searchParams.get("type");

    const supabase = await createClient();

    let query = supabase
      .from("insights")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ insights: data });
  } catch (err) {
    console.error("[INSIGHTS] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — Generate new insight from medallion data
// ---------------------------------------------------------------------------
export async function POST() {
  const { allowed, remaining } = rateLimit("insights-route", 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
    });
  }

  try {
    const supabase = await createClient();

    // 1. Query prospect_scores for stale prospects
    const { data: staleProspects } = await supabase
      .from("prospect_scores")
      .select("name, sector, phase, weighted_value, days_since_contact, engagement_status")
      .in("engagement_status", ["stale", "cooling"])
      .order("weighted_value", { ascending: false })
      .limit(10);

    // 2. Query revenue_projections for trends
    const { data: revenueTrends } = await supabase
      .from("revenue_projections")
      .select("month, revenue_ht, pending_ht, total_ht, invoice_count")
      .order("month", { ascending: false })
      .limit(6);

    // 3. Query agent_logs for agent health (last 24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: agentLogs } = await supabase
      .from("agent_logs")
      .select("agent_name, action, success, created_at")
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false })
      .limit(50);

    // 4. Compress data and send to Claude Sonnet
    const compressedData = JSON.stringify({
      stale_prospects: staleProspects || [],
      revenue_trends: revenueTrends || [],
      agent_activity_24h: agentLogs || [],
      generated_at: new Date().toISOString(),
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      temperature: 0.6,
      system: `Tu es l'analyseur stratégique de BYSS GROUP. MODE_CADIFOR strict : compression, pas de mots faibles.
Génère UN insight actionnable à partir des données medallion. Structure :
- type: "pipeline" | "revenue" | "agent_health" | "opportunity" | "risk"
- title: max 60 caractères, percutant
- content: 2-3 phrases max, action concrète incluse

Réponds UNIQUEMENT en JSON valide : {"type": "...", "title": "...", "content": "..."}`,
      messages: [{
        role: "user",
        content: `Données medallion du ${new Date().toLocaleDateString("fr-FR")}:\n${compressedData}`,
      }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No text from Claude" }, { status: 500 });
    }

    // Parse the insight
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid JSON from Claude" }, { status: 500 });
    }

    const insight = JSON.parse(jsonMatch[0]) as {
      type: string;
      title: string;
      content: string;
    };

    // 5. Insert generated insight into insights table
    const { data: inserted, error: insertError } = await supabase
      .from("insights")
      .insert({
        type: insight.type,
        title: insight.title,
        content: insight.content,
        data: {
          stale_count: staleProspects?.length || 0,
          revenue_months: revenueTrends?.length || 0,
          agent_logs_24h: agentLogs?.length || 0,
        },
        agent_name: "system",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 6. Return the insight
    return NextResponse.json({ insight: inserted });
  } catch (err) {
    console.error("[INSIGHTS] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
