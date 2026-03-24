// ═══════════════════════════════════════════════════════
// AUTO-COMPLETION API — Self-Improving Scanner
// POST: analyze_page | analyze_all | auto_fix
// GET: latest completion scores
// MiniMax M2.7 (cheap) + Claude Sonnet (fixes)
// ═══════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { createClient as _createSC } from "@supabase/supabase-js";
function createClient() { return _createSC(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }
import { callOpenRouter } from "@/lib/ai/router";
import {
  ANALYSIS_SYSTEM_PROMPT,
  pagePathToName,
  type PageAnalysis,
  type Gap,
} from "@/lib/completion";
import { promises as fs } from "fs";
import path from "path";

// ── Helpers ──────────────────────────────────────────

function generateGapId(): string {
  return `gap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function parseAnalysisJSON(raw: string): Record<string, unknown> | null {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function listPageFiles(rootDir: string): Promise<string[]> {
  const pages: string[] = [];
  const adminDir = path.join(rootDir, "src/app/(admin)");

  async function walk(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else if (entry.name === "page.tsx") {
          // Convert to relative path
          const rel = path.relative(rootDir, full).replace(/\\/g, "/");
          pages.push(rel);
        }
      }
    } catch {
      // Directory not accessible
    }
  }

  await walk(adminDir);
  return pages;
}

async function readPageContent(rootDir: string, pagePath: string, maxLines = 100): Promise<string> {
  try {
    const fullPath = path.join(rootDir, pagePath);
    const content = await fs.readFile(fullPath, "utf-8");
    const lines = content.split("\n");
    return lines.slice(0, maxLines).join("\n");
  } catch {
    return "";
  }
}

async function analyzeSinglePage(pagePath: string, pageContent: string): Promise<PageAnalysis> {
  const result = await callOpenRouter({
    task: "classification",
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Fichier: ${pagePath}\n\n\`\`\`tsx\n${pageContent}\n\`\`\``,
      },
    ],
    temperature: 0.3,
    maxTokens: 2048,
  });

  const parsed = parseAnalysisJSON(result.content);

  if (!parsed) {
    return {
      pagePath,
      pageName: pagePathToName(pagePath),
      score: 0,
      promises: [],
      reality: [],
      gaps: [],
      hasRealData: false,
      hasLoading: false,
      hasErrorHandling: false,
      hasToast: false,
      hasSupabase: false,
      mockupsFound: [],
      analyzedAt: new Date().toISOString(),
    };
  }

  const gaps: Gap[] = ((parsed.gaps as Array<Record<string, unknown>>) || []).map((g) => ({
    id: generateGapId(),
    type: (g.type as "quick-fix" | "feature") || "feature",
    description: (g.description as string) || "",
    impact: (g.impact as number) || 0,
    fix: g.fix as string | undefined,
    status: "pending" as const,
  }));

  return {
    pagePath,
    pageName: pagePathToName(pagePath),
    score: Math.min(100, Math.max(0, (parsed.score as number) || 0)),
    promises: (parsed.promises as string[]) || [],
    reality: (parsed.reality as string[]) || [],
    gaps,
    hasRealData: (parsed.has_real_data as boolean) || false,
    hasLoading: (parsed.has_loading as boolean) || false,
    hasErrorHandling: (parsed.has_error_handling as boolean) || false,
    hasToast: (parsed.has_toast as boolean) || false,
    hasSupabase: (parsed.has_supabase as boolean) || false,
    mockupsFound: (parsed.mockups_found as string[]) || [],
    analyzedAt: new Date().toISOString(),
  };
}

// ── GET — Latest completion scores ──────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "1", 10);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("type", "completion")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Parse the latest analysis data
    const latest = data?.[0];
    if (!latest) {
      return NextResponse.json({ analyses: [], globalScore: 0, lastRun: null });
    }

    const analysisData = latest.data as Record<string, unknown> | null;

    return NextResponse.json({
      analyses: (analysisData?.analyses as PageAnalysis[]) || [],
      globalScore: (analysisData?.globalScore as number) || 0,
      totalGaps: (analysisData?.totalGaps as number) || 0,
      quickFixes: (analysisData?.quickFixes as number) || 0,
      features: (analysisData?.features as number) || 0,
      costUsd: (analysisData?.costUsd as number) || 0,
      lastRun: latest.created_at,
    });
  } catch (err) {
    console.error("[COMPLETION] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST — Actions ──────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Root of the project (resolve from the API route location)
    const rootDir = path.resolve(process.cwd());

    switch (action) {
      // ── analyze_page ──────────────────────────────
      case "analyze_page": {
        const { pagePath, pageContent } = body;
        if (!pagePath || !pageContent) {
          return NextResponse.json({ error: "pagePath and pageContent required" }, { status: 400 });
        }

        const analysis = await analyzeSinglePage(pagePath, pageContent);

        // Save to insights
        const supabase = createClient();
        await supabase.from("insights").insert({
          type: "completion",
          title: `Scan: ${analysis.pageName}`,
          content: `Score ${analysis.score}/100 — ${analysis.gaps.length} gaps`,
          data: {
            analyses: [analysis],
            globalScore: analysis.score,
            totalGaps: analysis.gaps.length,
            quickFixes: analysis.gaps.filter((g) => g.type === "quick-fix").length,
            features: analysis.gaps.filter((g) => g.type === "feature").length,
            costUsd: 0.01,
          },
          agent_name: "auto_completion",
        });

        return NextResponse.json({ analysis });
      }

      // ── analyze_all ───────────────────────────────
      case "analyze_all": {
        const pages = await listPageFiles(rootDir);

        if (pages.length === 0) {
          return NextResponse.json({ error: "No page.tsx files found" }, { status: 404 });
        }

        const analyses: PageAnalysis[] = [];
        let totalCost = 0;

        // Process in batches of 5 to avoid rate limits
        const batchSize = 5;
        for (let i = 0; i < pages.length; i += batchSize) {
          const batch = pages.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (pagePath) => {
              const content = await readPageContent(rootDir, pagePath, 100);
              if (!content) return null;
              try {
                const analysis = await analyzeSinglePage(pagePath, content);
                totalCost += 0.007; // ~$0.007 per page with MiniMax
                return analysis;
              } catch (err) {
                console.error(`[COMPLETION] Error analyzing ${pagePath}:`, err);
                return null;
              }
            }),
          );
          analyses.push(...batchResults.filter((a): a is PageAnalysis => a !== null));
        }

        // Compute global stats
        const globalScore =
          analyses.length > 0
            ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / analyses.length)
            : 0;
        const allGaps = analyses.flatMap((a) => a.gaps);
        const quickFixes = allGaps.filter((g) => g.type === "quick-fix").length;
        const features = allGaps.filter((g) => g.type === "feature").length;

        // Save to insights
        const supabase = createClient();
        await supabase.from("insights").insert({
          type: "completion",
          title: `Scan complet: ${analyses.length} pages`,
          content: `Score global ${globalScore}/100 — ${allGaps.length} gaps (${quickFixes} quick-fixes, ${features} features)`,
          data: {
            analyses,
            globalScore,
            totalGaps: allGaps.length,
            quickFixes,
            features,
            costUsd: Math.round(totalCost * 1000) / 1000,
          },
          agent_name: "auto_completion",
        });

        // Log to agent_logs
        try {
          const { logAgentAction } = await import("@/lib/db/queries");
          await logAgentAction({
            agent_name: "auto_completion",
            action: "analyze_all",
            model: "minimax-m2.7",
            input_tokens: analyses.length * 2000,
            output_tokens: analyses.length * 500,
            cost_usd: totalCost,
            duration_ms: 0,
            success: true,
            metadata: { pages: analyses.length, globalScore, totalGaps: allGaps.length },
          } as Record<string, unknown>);
        } catch {} // Fire and forget

        return NextResponse.json({
          analyses,
          globalScore,
          totalGaps: allGaps.length,
          quickFixes,
          features,
          costUsd: Math.round(totalCost * 1000) / 1000,
          pagesScanned: analyses.length,
        });
      }

      // ── auto_fix ──────────────────────────────────
      case "auto_fix": {
        const { pagePath, gapId, fix } = body;
        if (!pagePath || !gapId || !fix) {
          return NextResponse.json({ error: "pagePath, gapId, and fix required" }, { status: 400 });
        }

        const fixLines = fix.split("\n").length;

        if (fixLines <= 5) {
          // Auto-apply small fixes
          try {
            const fullPath = path.join(rootDir, pagePath);
            const content = await fs.readFile(fullPath, "utf-8");
            // Append fix as a comment-marked section
            const patched = content + "\n\n// AUTO-FIX [" + gapId + "]\n" + fix + "\n";
            await fs.writeFile(fullPath, patched, "utf-8");

            // Log
            try {
              const { logAgentAction } = await import("@/lib/db/queries");
              await logAgentAction({
                agent_name: "auto_completion",
                action: "auto_fix_applied",
                success: true,
                metadata: { pagePath, gapId, fixLines },
              } as Record<string, unknown>);
            } catch {}

            return NextResponse.json({ status: "applied", gapId, pagePath });
          } catch (err) {
            return NextResponse.json(
              { error: err instanceof Error ? err.message : "Write failed" },
              { status: 500 },
            );
          }
        } else {
          // Create pending_action for approval
          const supabase = createClient();
          await supabase.from("insights").insert({
            type: "completion",
            title: `Fix pending: ${pagePathToName(pagePath)}`,
            content: `Gap ${gapId} — ${fixLines} lines — needs approval`,
            data: {
              action: "pending_fix",
              pagePath,
              gapId,
              fix,
              fixLines,
              status: "pending",
            },
            agent_name: "auto_completion",
          });

          // Log
          try {
            const { logAgentAction } = await import("@/lib/db/queries");
            await logAgentAction({
              agent_name: "auto_completion",
              action: "auto_fix_pending",
              success: true,
              metadata: { pagePath, gapId, fixLines, reason: "exceeds_5_lines" },
            } as Record<string, unknown>);
          } catch {}

          return NextResponse.json({ status: "pending", gapId, pagePath, fixLines });
        }
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("[COMPLETION] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
