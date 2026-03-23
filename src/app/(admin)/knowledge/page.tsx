"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Database,
  FileText,
  Code,
  BookOpen,
  Shield,
  Sword,
  Brain,
  Sparkles,
  Gamepad2,
  Briefcase,
  DollarSign,
  Globe,
  Rocket,
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

// ═══════════════════════════════════════════════════════
// BYSS EMPIRE — Base de Connaissances
// Direct filesystem knowledge layer.
// 1576 files. Zero duplication. Instant access.
// ═══════════════════════════════════════════════════════

/* ─── Types ────────────────────────────────────── */
interface FileResult {
  path: string;
  name: string;
  title: string;
  category: string;
  extension: string;
  size: number;
  sizeFormatted: string;
  preview?: string;
}

interface StatsData {
  totalFiles: number;
  totalSize: number;
  totalSizeFormatted: string;
  byCategory: Record<string, number>;
  byExtension: Record<string, number>;
}

interface CategoryInfo {
  name: string;
  count: number;
}

/* ─── Category Config ──────────────────────────── */
const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  intelligence: {
    label: "Intelligence",
    icon: Brain,
    color: "var(--color-blue)",
  },
  lore: { label: "Lore", icon: BookOpen, color: "var(--color-gold)" },
  arcane: { label: "Arcane", icon: Sparkles, color: "#a855f7" },
  defense: { label: "Défense", icon: Shield, color: "var(--color-fire)" },
  strategie: { label: "Stratégie", icon: Sword, color: "#ef4444" },
  operations: { label: "Opérations", icon: Rocket, color: "var(--color-amber)" },
  finance: { label: "Finance", icon: DollarSign, color: "#22c55e" },
  prompts: { label: "Prompts", icon: Code, color: "#06b6d4" },
  nerel: { label: "Nerel", icon: Globe, color: "#8b5cf6" },
  jeux: { label: "Jeux Vidéo", icon: Gamepad2, color: "#ec4899" },
  business: { label: "Business", icon: Briefcase, color: "var(--color-gold)" },
  evren: { label: "Evren-Kairos", icon: Globe, color: "#0ea5e9" },
  carrier: { label: "Carrier", icon: Rocket, color: "var(--color-gold)" },
  autre: { label: "Autre", icon: FolderOpen, color: "#6b7280" },
};

/* ─── Extension colors ─────────────────────────── */
const EXT_COLORS: Record<string, string> = {
  ".md": "#3b82f6",
  ".json": "#eab308",
  ".py": "#22c55e",
  ".ts": "#3178c6",
  ".tsx": "#3178c6",
  ".sql": "#f97316",
  ".sh": "#a855f7",
  ".xlsx": "#16a34a",
  ".txt": "#9ca3af",
  ".toml": "#f472b6",
  ".yaml": "#ef4444",
  ".yml": "#ef4444",
};

/* ─── Size formatter (client) ──────────────────── */
function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Markdown renderer (basic) ────────────────── */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-[var(--color-text)]">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-6 mb-2 text-[var(--color-gold)]">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3" style="color:var(--color-gold)">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--color-text)]">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="rounded bg-[var(--color-surface-raised)] px-1.5 py-0.5 text-xs text-[var(--color-gold)]">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm text-[var(--color-text-muted)]">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm text-[var(--color-text-muted)]">$2</li>')
    .replace(/\n{2,}/g, '<div class="h-3"></div>')
    .replace(/\n/g, "<br/>");
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function KnowledgePage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [results, setResults] = useState<FileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
    type: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Initial fetch: stats + categories ──
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/knowledge");
        const data = await res.json();
        setStats(data.stats);
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Knowledge init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ── Search (debounced) ──
  const doSearch = useCallback(async (q: string) => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/knowledge?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setActiveCategory(null);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  // ── Category filter ──
  const handleCategory = async (cat: string) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setResults([]);
      return;
    }
    setActiveCategory(cat);
    setQuery("");
    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/knowledge?category=${encodeURIComponent(cat)}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // ── List all (paginated) ──
  const handleListAll = async (p: number = 1) => {
    setSearchLoading(true);
    setActiveCategory(null);
    setQuery("");
    try {
      const res = await fetch(`/api/knowledge?list=true&page=${p}`);
      const data = await res.json();
      setResults(
        (data.results || []).map((r: FileResult) => ({
          ...r,
          sizeFormatted: r.sizeFormatted || fmtSize(r.size),
        }))
      );
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("List error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // ── Open file ──
  const openFile = async (path: string) => {
    try {
      const res = await fetch(
        `/api/knowledge?path=${encodeURIComponent(path)}`
      );
      const data = await res.json();
      setSelectedFile({ path, content: data.content, type: data.type });
    } catch (err) {
      console.error("File read error:", err);
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
          <div className="h-8 w-64 animate-pulse rounded bg-[var(--color-surface-raised)]" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[var(--color-surface-raised)]" />
        </div>
        <div className="flex-1 space-y-4 p-6">
          <div className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-raised)]" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 animate-pulse rounded-full bg-[var(--color-surface-raised)]"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-[var(--color-surface-raised)]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <PageHeader
          title="Knowledge"
          titleAccent="Base"
          subtitle={`${stats?.totalFiles.toLocaleString("fr-FR")} fichiers \u2022 ${stats?.totalSizeFormatted} \u2022 Lecture directe du filesystem`}
          actions={
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2">
              <HardDrive size={16} className="text-[var(--color-gold)]" />
              <span className="text-xs font-medium text-[var(--color-text-muted)]">LIVE</span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>
          }
        />
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher dans la base de connaissances..."
            className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all"
          />
          {searchLoading && (
            <Loader2
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--color-gold)]"
            />
          )}
        </motion.div>

        {/* ── Category Badges ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => handleListAll(1)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              !activeCategory && results.length > 0
                ? "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]/30 hover:text-[var(--color-text)]"
            )}
          >
            <Database size={12} />
            Tout
          </button>
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.name] || CATEGORY_META.autre;
            const Icon = meta.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategory(cat.name)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "border-current/30 bg-current/10"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-gold)]/30 hover:text-[var(--color-text)]"
                )}
                style={isActive ? { color: meta.color } : undefined}
              >
                <Icon size={12} />
                {meta.label}
                <span className="ml-0.5 opacity-60">{cat.count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Stats Overview (shown when no search active) ── */}
        {results.length === 0 && !query && stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {/* Category pie chart (CSS-only) */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                R{"\u00E9"}partition par cat{"\u00E9"}gorie
              </h3>
              <div className="space-y-2">
                {categories.slice(0, 10).map((cat) => {
                  const meta =
                    CATEGORY_META[cat.name] || CATEGORY_META.autre;
                  const pct =
                    stats.totalFiles > 0
                      ? (cat.count / stats.totalFiles) * 100
                      : 0;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span
                        className="w-20 text-xs font-medium truncate"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-raised)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-[var(--color-text-muted)]">
                        {cat.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extension breakdown */}
            <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
                Types de fichiers
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byExtension)
                  .sort(([, a], [, b]) => b - a)
                  .map(([ext, count]) => (
                    <div
                      key={ext}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-1.5"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: EXT_COLORS[ext] || "#6b7280",
                        }}
                      />
                      <span className="text-xs font-mono text-[var(--color-text)]">
                        {ext}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Summary stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-gold)]">
                    {stats.totalFiles.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Fichiers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-text)]">
                    {Object.keys(stats.byCategory).length}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Cat{"\u00E9"}gories
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--color-text)]">
                    {stats.totalSizeFormatted}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Taille totale
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Results Grid ── */}
        {results.length > 0 && (
          <div>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">
              {results.length} r{"\u00E9"}sultat{results.length > 1 ? "s" : ""}
              {activeCategory && (
                <span>
                  {" "}
                  dans{" "}
                  <span style={{ color: CATEGORY_META[activeCategory]?.color }}>
                    {CATEGORY_META[activeCategory]?.label || activeCategory}
                  </span>
                </span>
              )}
              {query && (
                <span>
                  {" "}
                  pour {"\u00AB"} {query} {"\u00BB"}
                </span>
              )}
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((file, i) => {
                  const meta =
                    CATEGORY_META[file.category] || CATEGORY_META.autre;
                  const Icon = meta.icon;
                  return (
                    <motion.button
                      key={file.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      onClick={() => openFile(file.path)}
                      className="group rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-left transition-all hover:border-[var(--color-gold)]/30 hover:shadow-lg hover:shadow-[var(--color-gold)]/5"
                    >
                      {/* Top row: category badge + extension */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                          }}
                        >
                          <Icon size={10} />
                          {meta.label}
                        </span>
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                          style={{
                            backgroundColor: `${EXT_COLORS[file.extension] || "#6b7280"}15`,
                            color: EXT_COLORS[file.extension] || "#6b7280",
                          }}
                        >
                          {file.extension}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1">
                        {file.title}
                      </h4>

                      {/* Path */}
                      <p className="mt-0.5 text-[10px] font-mono text-[var(--color-text-muted)] line-clamp-1">
                        {file.path}
                      </p>

                      {/* Preview */}
                      {file.preview && (
                        <p className="mt-2 text-xs text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                          {file.preview}
                        </p>
                      )}

                      {/* Bottom: size */}
                      <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">
                        {file.sizeFormatted || fmtSize(file.size)}
                      </p>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && !query && !activeCategory && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => handleListAll(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] disabled:opacity-30 hover:border-[var(--color-gold)]/30 transition-all"
                >
                  <ChevronLeft size={14} />
                  Pr{"\u00E9"}c{"\u00E9"}dent
                </button>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => handleListAll(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] disabled:opacity-30 hover:border-[var(--color-gold)]/30 transition-all"
                >
                  Suivant
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── File Viewer Modal ── */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-background)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[var(--color-gold)] truncate">
                    {selectedFile.path.split("/").pop()}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-mono text-[var(--color-text-muted)] truncate">
                    {selectedFile.path}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="ml-4 rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal content */}
              <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(85vh - 72px)" }}>
                {selectedFile.type === "markdown" ? (
                  <div
                    className="prose prose-sm max-w-none text-[var(--color-text-muted)] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(selectedFile.content),
                    }}
                  />
                ) : selectedFile.type === "json" ||
                  selectedFile.type === "python" ||
                  selectedFile.type === "code" ? (
                  <pre className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-4 text-xs leading-relaxed">
                    <code className="text-[var(--color-text-muted)] font-mono whitespace-pre">
                      {selectedFile.content}
                    </code>
                  </pre>
                ) : (
                  <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] p-4">
                    <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
                      {selectedFile.content}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
