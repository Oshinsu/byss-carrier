import { readFileSync, existsSync } from "fs";
import { extname } from "path";

// ═══════════════════════════════════════════════════════
// BYSS EMPIRE — Knowledge Layer: File Reader
// Direct filesystem reads. No database. No duplication.
// ═══════════════════════════════════════════════════════

/* ─── Types ────────────────────────────────────── */
export type FileType =
  | "markdown"
  | "json"
  | "python"
  | "code"
  | "excel"
  | "unknown";

export interface FileContent {
  content: string;
  type: FileType;
}

/* ─── Extension → Type Mapping ─────────────────── */
const EXT_TYPE_MAP: Record<string, FileType> = {
  ".md": "markdown",
  ".json": "json",
  ".py": "python",
  ".ts": "code",
  ".tsx": "code",
  ".js": "code",
  ".jsx": "code",
  ".sql": "code",
  ".sh": "code",
  ".toml": "code",
  ".yaml": "code",
  ".yml": "code",
  ".txt": "markdown",
  ".xlsx": "excel",
};

/* ─── Public API ───────────────────────────────── */

/** Read a file and return typed content */
export function readKnowledgeFile(absolutePath: string): FileContent {
  if (!existsSync(absolutePath)) {
    return { content: "Fichier introuvable.", type: "unknown" };
  }

  const ext = extname(absolutePath).toLowerCase();
  const fileType = EXT_TYPE_MAP[ext] || "unknown";

  // Excel files can't be read as text
  if (fileType === "excel") {
    return {
      content:
        "Fichier Excel (.xlsx) — Ouvrir dans Excel ou LibreOffice pour visualiser le contenu.",
      type: "excel",
    };
  }

  try {
    const raw = readFileSync(absolutePath, "utf-8");

    switch (fileType) {
      case "json": {
        // Pretty-print JSON
        try {
          const parsed = JSON.parse(raw);
          return { content: JSON.stringify(parsed, null, 2), type: "json" };
        } catch {
          return { content: raw, type: "json" };
        }
      }

      case "markdown":
      case "python":
      case "code":
        return { content: raw, type: fileType };

      default: {
        // Unknown text: return first 5000 chars
        const truncated =
          raw.length > 5000 ? raw.slice(0, 5000) + "\n\n[...tronqué]" : raw;
        return { content: truncated, type: "unknown" };
      }
    }
  } catch {
    return { content: "Erreur de lecture du fichier.", type: "unknown" };
  }
}

/** Extract first # heading from content, or fallback to filename */
export function extractTitle(content: string, filename: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  // Fallback: strip extension from filename
  return filename.replace(/\.[^.]+$/, "");
}

/** Get a short preview of a file for search results */
export function getFilePreview(
  absolutePath: string,
  maxChars: number = 500
): string {
  if (!existsSync(absolutePath)) return "";

  const ext = extname(absolutePath).toLowerCase();

  if (ext === ".xlsx") {
    return "Fichier Excel (.xlsx)";
  }

  try {
    const raw = readFileSync(absolutePath, "utf-8");

    // Strip markdown headings and excessive whitespace for preview
    const cleaned = raw
      .replace(/^#+\s+/gm, "") // Remove heading markers
      .replace(/\n{3,}/g, "\n\n") // Collapse blank lines
      .trim();

    if (cleaned.length <= maxChars) return cleaned;
    // Cut at last word boundary before maxChars
    const truncated = cleaned.slice(0, maxChars);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > maxChars * 0.7 ? truncated.slice(0, lastSpace) : truncated) + "...";
  } catch {
    return "";
  }
}

/** Format bytes to human-readable */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
