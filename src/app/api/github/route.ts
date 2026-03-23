import { NextRequest, NextResponse } from "next/server";
import {
  getAllReposStatus,
  getRepoStats,
  getRecentCommits,
  getOpenIssues,
  getRepoConfig,
} from "@/lib/integrations/github";

// ═══════════════════════════════════════════════════════
// BYSS GROUP — GitHub API Route
// GET /api/github          → all repos status
// GET /api/github?repo=xxx → specific repo stats + commits
// ═══════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const repoSlug = searchParams.get("repo");

    // ── Specific repo ──
    if (repoSlug) {
      const config = getRepoConfig(repoSlug);
      if (!config) {
        return NextResponse.json(
          { error: `Repo inconnu: ${repoSlug}` },
          { status: 404 }
        );
      }

      const [stats, commits, issues] = await Promise.all([
        getRepoStats(config.owner, config.repo),
        getRecentCommits(config.owner, config.repo, 5),
        getOpenIssues(config.owner, config.repo),
      ]);

      return NextResponse.json(
        {
          project: config.project,
          stats,
          commits,
          issues,
          fetchedAt: new Date().toISOString(),
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
          },
        }
      );
    }

    // ── All repos ──
    const allStatus = await getAllReposStatus();

    return NextResponse.json(allStatus, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[API/GitHub]", error);
    return NextResponse.json(
      {
        error: "Erreur GitHub API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
