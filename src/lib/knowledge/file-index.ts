import { readdirSync, statSync, readFileSync } from "fs";
import { join, relative, extname, basename } from "path";

// ═══════════════════════════════════════════════════════
// BYSS EMPIRE — Knowledge Layer: File Index
// Reads the entire BYSS GROUP repo from disk.
// Zero duplication. Direct filesystem access.
// ═══════════════════════════════════════════════════════

const REPO_ROOT =
  process.env.BYSS_REPO_ROOT || "C:/Users/Gary/Desktop/BYSS GROUP";

/* ─── Types ────────────────────────────────────── */
export interface FileEntry {
  path: string; // relative to REPO_ROOT
  absolutePath: string;
  name: string;
  extension: string;
  size: number;
  lastModified: number;
  category: string;
  title: string;
}

export interface IndexStats {
  totalFiles: number;
  totalSize: number;
  byCategory: Record<string, number>;
  byExtension: Record<string, number>;
}

/* ─── Config ───────────────────────────────────── */
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".a_supprimer",
  "07_OpenClaw",
  "paperclip",
]);

const EXCLUDED_PREFIXES = ["_source-"];

const ALLOWED_EXTENSIONS = new Set([
  ".md",
  ".json",
  ".py",
  ".ts",
  ".tsx",
  ".sql",
  ".sh",
  ".xlsx",
  ".txt",
  ".toml",
  ".yaml",
  ".yml",
]);

/* ─── Category Rules ───────────────────────────── */
const CATEGORY_RULES: Array<{ pattern: string; category: string }> = [
  { pattern: "02_Operation-Eveil/01_intelligence", category: "intelligence" },
  { pattern: "02_Operation-Eveil/07_lore", category: "lore" },
  { pattern: "02_Operation-Eveil/08_arcane", category: "arcane" },
  { pattern: "02_Operation-Eveil/05_defense", category: "defense" },
  { pattern: "02_Operation-Eveil/02_strategie", category: "strategie" },
  { pattern: "02_Operation-Eveil/03_operations", category: "operations" },
  { pattern: "02_Operation-Eveil/04_finance", category: "finance" },
  { pattern: "02_Operation-Eveil/09_prompts", category: "prompts" },
  { pattern: "02_Operation-Eveil/10_nerel", category: "nerel" },
  { pattern: "01_Jeux-Video", category: "jeux" },
  { pattern: "BYSS incroyable", category: "business" },
  { pattern: "FINANCE BYSS", category: "finance" },
  { pattern: "Evren-Kairos", category: "evren" },
  { pattern: "byss-carrier", category: "carrier" },
];

function detectCategory(relativePath: string): string {
  // Normalize separators for consistent matching
  const normalized = relativePath.replace(/\\/g, "/");
  for (const rule of CATEGORY_RULES) {
    if (normalized.includes(rule.pattern)) return rule.category;
  }
  return "autre";
}

/* ─── Title Extraction ─────────────────────────── */
function extractTitleFromContent(
  absolutePath: string,
  filename: string
): string {
  try {
    const ext = extname(filename).toLowerCase();
    if (ext !== ".md" && ext !== ".txt") {
      return filename.replace(/\.[^.]+$/, "");
    }
    const content = readFileSync(absolutePath, "utf-8");
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
    return filename.replace(/\.[^.]+$/, "");
  } catch {
    return filename.replace(/\.[^.]+$/, "");
  }
}

/* ─── Cache ────────────────────────────────────── */
let cachedIndex: FileEntry[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function isCacheValid(): boolean {
  return cachedIndex !== null && Date.now() - cacheTimestamp < CACHE_TTL;
}

/* ─── Directory Scanner ────────────────────────── */
function shouldExclude(name: string): boolean {
  if (EXCLUDED_DIRS.has(name)) return true;
  for (const prefix of EXCLUDED_PREFIXES) {
    if (name.startsWith(prefix)) return true;
  }
  return false;
}

function scanDir(dir: string, entries: FileEntry[]): void {
  let items: string[];
  try {
    items = readdirSync(dir);
  } catch {
    return; // Skip inaccessible dirs
  }

  for (const item of items) {
    const fullPath = join(dir, item);
    let stat;
    try {
      stat = statSync(fullPath);
    } catch {
      continue; // Skip inaccessible files
    }

    if (stat.isDirectory()) {
      if (!shouldExclude(item)) {
        scanDir(fullPath, entries);
      }
    } else if (stat.isFile()) {
      const ext = extname(item).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) continue;

      const rel = relative(REPO_ROOT, fullPath).replace(/\\/g, "/");
      entries.push({
        path: rel,
        absolutePath: fullPath,
        name: item,
        extension: ext,
        size: stat.size,
        lastModified: stat.mtimeMs,
        category: detectCategory(rel),
        title: extractTitleFromContent(fullPath, item),
      });
    }
  }
}

/* ─── Public API ───────────────────────────────── */

/** Build/rebuild the full file index. Uses 10-min cache. */
export function buildIndex(): FileEntry[] {
  if (isCacheValid()) return cachedIndex!;

  const entries: FileEntry[] = [];
  scanDir(REPO_ROOT, entries);

  // Sort by path for consistent ordering
  entries.sort((a, b) => a.path.localeCompare(b.path));

  cachedIndex = entries;
  cacheTimestamp = Date.now();
  return entries;
}

/** Force-rebuild ignoring cache */
export function rebuildIndex(): FileEntry[] {
  cachedIndex = null;
  cacheTimestamp = 0;
  return buildIndex();
}

/** Case-insensitive search across path + title */
export function searchIndex(query: string): FileEntry[] {
  const index = buildIndex();
  const q = query.toLowerCase().trim();
  if (!q) return index;

  const terms = q.split(/\s+/);
  return index.filter((entry) => {
    const haystack = `${entry.path} ${entry.title}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

/** Filter by category */
export function getByCategory(category: string): FileEntry[] {
  const index = buildIndex();
  return index.filter((e) => e.category === category);
}

/** Get aggregate stats */
export function getStats(): IndexStats {
  const index = buildIndex();
  const byCategory: Record<string, number> = {};
  const byExtension: Record<string, number> = {};
  let totalSize = 0;

  for (const entry of index) {
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
    byExtension[entry.extension] = (byExtension[entry.extension] || 0) + 1;
    totalSize += entry.size;
  }

  return {
    totalFiles: index.length,
    totalSize,
    byCategory,
    byExtension,
  };
}

/** Get all unique categories with counts */
export function getCategories(): Array<{ name: string; count: number }> {
  const stats = getStats();
  return Object.entries(stats.byCategory)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
