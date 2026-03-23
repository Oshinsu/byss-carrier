import { NextRequest, NextResponse } from "next/server";
import {
  buildIndex,
  searchIndex,
  getByCategory,
  getStats,
  getCategories,
} from "@/lib/knowledge/file-index";
import {
  readKnowledgeFile,
  getFilePreview,
  formatSize,
} from "@/lib/knowledge/reader";
import { join } from "path";

// ═══════════════════════════════════════════════════════
// BYSS EMPIRE — Knowledge API
// Direct filesystem reads. Zero duplication.
//
// GET /api/knowledge              → stats + categories
// GET /api/knowledge?q=digicel    → search results
// GET /api/knowledge?category=lore → all files in category
// GET /api/knowledge?path=...     → full file content
// GET /api/knowledge?list=true    → all files (paginated)
// ═══════════════════════════════════════════════════════

const REPO_ROOT =
  process.env.BYSS_REPO_ROOT || "C:/Users/Gary/Desktop/BYSS GROUP";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);

  try {
    // ── Read specific file ──
    const filePath = searchParams.get("path");
    if (filePath) {
      // Security: prevent path traversal
      const normalized = filePath.replace(/\.\./g, "").replace(/\\/g, "/");
      const absolutePath = join(REPO_ROOT, normalized);

      // Ensure the resolved path is within REPO_ROOT
      if (!absolutePath.startsWith(REPO_ROOT.replace(/\//g, "\\"))) {
        // Also check with forward slashes for cross-platform
        const fwdAbsolute = absolutePath.replace(/\\/g, "/");
        const fwdRoot = REPO_ROOT.replace(/\\/g, "/");
        if (!fwdAbsolute.startsWith(fwdRoot)) {
          return NextResponse.json(
            { error: "Accès interdit" },
            { status: 403 }
          );
        }
      }

      const file = readKnowledgeFile(absolutePath);
      return NextResponse.json({
        path: normalized,
        ...file,
        ms: Date.now() - start,
      });
    }

    // ── Search ──
    const query = searchParams.get("q");
    if (query) {
      const results = searchIndex(query);
      return NextResponse.json({
        query,
        count: results.length,
        results: results.slice(0, 100).map((entry) => ({
          path: entry.path,
          name: entry.name,
          title: entry.title,
          category: entry.category,
          extension: entry.extension,
          size: entry.size,
          sizeFormatted: formatSize(entry.size),
          preview: getFilePreview(entry.absolutePath, 300),
        })),
        ms: Date.now() - start,
      });
    }

    // ── Category filter ──
    const category = searchParams.get("category");
    if (category) {
      const results = getByCategory(category);
      return NextResponse.json({
        category,
        count: results.length,
        results: results.map((entry) => ({
          path: entry.path,
          name: entry.name,
          title: entry.title,
          category: entry.category,
          extension: entry.extension,
          size: entry.size,
          sizeFormatted: formatSize(entry.size),
          preview: getFilePreview(entry.absolutePath, 200),
        })),
        ms: Date.now() - start,
      });
    }

    // ── List all (paginated) ──
    const list = searchParams.get("list");
    if (list === "true") {
      const page = parseInt(searchParams.get("page") || "1", 10);
      const perPage = 50;
      const index = buildIndex();
      const total = index.length;
      const totalPages = Math.ceil(total / perPage);
      const offset = (page - 1) * perPage;
      const slice = index.slice(offset, offset + perPage);

      return NextResponse.json({
        page,
        perPage,
        total,
        totalPages,
        results: slice.map((entry) => ({
          path: entry.path,
          name: entry.name,
          title: entry.title,
          category: entry.category,
          extension: entry.extension,
          size: entry.size,
          sizeFormatted: formatSize(entry.size),
        })),
        ms: Date.now() - start,
      });
    }

    // ── Default: Stats + Categories ──
    const stats = getStats();
    const categories = getCategories();

    return NextResponse.json({
      stats: {
        ...stats,
        totalSizeFormatted: formatSize(stats.totalSize),
      },
      categories,
      ms: Date.now() - start,
    });
  } catch (error) {
    console.error("[KNOWLEDGE API]", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la lecture de la base de connaissances",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
