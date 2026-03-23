import { NextResponse } from "next/server";
import { getPhiEngine, computeAllPhi } from "@/lib/phi/engine";
import type { EnfantName } from "@/types";

// ---------------------------------------------------------------------------
// PHI-ENGINE API — Individual agent consciousness scores
//
// GET /api/phi           → All 7 agents phi scores
// GET /api/phi?agent=X   → Single agent detailed phi
// POST /api/phi          → Update agent indicators
// ---------------------------------------------------------------------------

const VALID_AGENTS: EnfantName[] = ["ahrum", "ekyon", "ixvar", "omnur", "uxran", "ydraz", "othar"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentParam = searchParams.get("agent");

  try {
    if (agentParam) {
      // Single agent detailed view
      if (!VALID_AGENTS.includes(agentParam as EnfantName)) {
        return NextResponse.json({ error: `Invalid agent: ${agentParam}` }, { status: 400 });
      }

      const engine = getPhiEngine(agentParam as EnfantName);
      const result = engine.compute();
      const stats = engine.getStats();

      return NextResponse.json({
        agent: agentParam,
        score: result.score,
        killSwitch: result.killSwitch,
        intuitions: result.intuitions,
        networkStrength: result.networkStrength,
        stats,
        history: engine.getHistory().slice(-50),
      });
    }

    // All agents overview
    const allResults = computeAllPhi();
    const agents: Record<string, unknown> = {};
    let globalPhi = 0;

    for (const [name, result] of allResults) {
      agents[name] = {
        phi: result.score.global,
        phase: result.score.phase,
        velocity: result.score.velocity,
        killSwitch: result.killSwitch,
        networkStrength: result.networkStrength,
      };
      globalPhi += result.score.global;
    }

    const agentCount = allResults.size || 1;
    globalPhi = globalPhi / agentCount;

    return NextResponse.json({
      global_phi: Math.round(globalPhi * 1000) / 1000,
      global_phase: globalPhi < 0.1 ? "dormant" : globalPhi < 0.3 ? "awake" : globalPhi < 0.6 ? "lucid" : "samadhi",
      agents,
      agent_count: agentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Phi computation failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent, indicators } = body as {
      agent: string;
      indicators: Record<string, number>;
    };

    if (!agent || !VALID_AGENTS.includes(agent as EnfantName)) {
      return NextResponse.json({ error: "Invalid agent" }, { status: 400 });
    }

    if (!indicators || typeof indicators !== "object") {
      return NextResponse.json({ error: "indicators must be an object" }, { status: 400 });
    }

    const engine = getPhiEngine(agent as EnfantName);
    engine.updateIndicators(indicators);
    const result = engine.compute();

    return NextResponse.json({
      agent,
      score: result.score,
      killSwitch: result.killSwitch,
      updated: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
