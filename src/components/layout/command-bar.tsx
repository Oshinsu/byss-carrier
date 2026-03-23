"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Kanban,
  DollarSign,
  Bot,
  Flame,
  GitBranch,
  Video,
  UserPlus,
  FileText,
  Sparkles,
  Mail,
  Search,
  MessageSquare,
  BarChart3,
  Zap,
  Code,
  Workflow,
  Network,
  Calendar,
  Calculator,
  BookOpen,
  FolderOpen,
  Tag,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────── */
interface CommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
  subtitle?: string;
  badge?: string;
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

interface KnowledgeResult {
  path: string;
  name: string;
  title: string;
  category: string;
  extension: string;
  sizeFormatted: string;
  preview: string;
}

/* ─── Category Colors ────────────────────────────────── */
const categoryColors: Record<string, string> = {
  lore: "text-[var(--color-amber)] bg-[var(--color-amber)]/10",
  code: "text-[var(--color-blue)] bg-[var(--color-blue)]/10",
  config: "text-[var(--color-green)] bg-[var(--color-green)]/10",
  docs: "text-[var(--color-gold)] bg-[var(--color-gold)]/10",
  data: "text-[var(--color-fire)] bg-[var(--color-fire)]/10",
  media: "text-[#8B5CF6] bg-[#8B5CF6]/10",
  default: "text-[var(--color-text-muted)] bg-[var(--color-surface-2)]",
};

/* ─── Command Bar Component ─────────────────────────── */
export function CommandBar({ open, onOpenChange }: CommandBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeResult[]>([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Claude natural language response
  const [claudeResponse, setClaudeResponse] = useState("");
  const [claudeLoading, setClaudeLoading] = useState(false);

  // Detect knowledge search: starts with "?" or "cherche"
  const isKnowledgeSearch =
    search.startsWith("?") || search.toLowerCase().startsWith("cherche ");
  const knowledgeQuery = search.startsWith("?")
    ? search.slice(1).trim()
    : search.toLowerCase().startsWith("cherche ")
      ? search.slice(8).trim()
      : "";

  /* ── Global shortcut: Cmd+K / Ctrl+K ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  /* Reset search on close */
  useEffect(() => {
    if (!open) {
      setSearch("");
      setKnowledgeResults([]);
    }
  }, [open]);

  /* ── Knowledge Layer search with debounce ── */
  useEffect(() => {
    if (!isKnowledgeSearch || knowledgeQuery.length < 2) {
      setKnowledgeResults([]);
      setKnowledgeLoading(false);
      return;
    }

    setKnowledgeLoading(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/knowledge?q=${encodeURIComponent(knowledgeQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          setKnowledgeResults((data.results || []).slice(0, 8));
        }
      } catch {
        setKnowledgeResults([]);
      } finally {
        setKnowledgeLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [isKnowledgeSearch, knowledgeQuery]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const action = useCallback(
    (_id: string) => {
      // Placeholder for future action handling
      onOpenChange(false);
    },
    [onOpenChange]
  );

  /* ── Command Groups ── */
  const groups: CommandGroup[] = [
    {
      heading: "Navigation",
      items: [
        {
          id: "nav-dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          shortcut: "G D",
          onSelect: () => navigate("/"),
        },
        {
          id: "nav-pipeline",
          label: "Pipeline",
          icon: Kanban,
          shortcut: "G P",
          onSelect: () => navigate("/pipeline"),
        },
        {
          id: "nav-finance",
          label: "Finance",
          icon: DollarSign,
          shortcut: "G F",
          onSelect: () => navigate("/finance"),
        },
        {
          id: "nav-village",
          label: "Village IA",
          icon: Bot,
          shortcut: "G V",
          onSelect: () => navigate("/village"),
        },
        {
          id: "nav-eveil",
          label: "Eveil",
          icon: Flame,
          shortcut: "G E",
          onSelect: () => navigate("/eveil"),
        },
        {
          id: "nav-lignee",
          label: "Lignee",
          icon: GitBranch,
          shortcut: "G L",
          onSelect: () => navigate("/lignee"),
        },
        {
          id: "nav-production",
          label: "Production",
          icon: Video,
          shortcut: "G R",
          onSelect: () => navigate("/production"),
        },
        {
          id: "nav-openclaw",
          label: "OpenClaw",
          icon: Bot,
          onSelect: () => navigate("/openclaw"),
        },
        {
          id: "nav-senzaris",
          label: "Senzaris",
          icon: Code,
          onSelect: () => navigate("/senzaris"),
        },
        {
          id: "nav-paperclip",
          label: "Paperclip",
          icon: Workflow,
          onSelect: () => navigate("/paperclip"),
        },
        {
          id: "nav-orchestrateur",
          label: "Orchestrateur",
          icon: Network,
          onSelect: () => navigate("/orchestrateur"),
        },
        {
          id: "nav-calendrier",
          label: "Calendrier",
          icon: Calendar,
          onSelect: () => navigate("/calendrier"),
        },
        {
          id: "nav-pricing",
          label: "Calculateur ROI",
          icon: Calculator,
          onSelect: () => navigate("/pricing"),
        },
      ],
    },
    {
      heading: "Actions",
      items: [
        {
          id: "action-prospect",
          label: "Nouveau Prospect",
          icon: UserPlus,
          shortcut: "N P",
          onSelect: () => navigate("/pipeline"),
        },
        {
          id: "action-invoice",
          label: "Nouvelle Facture",
          icon: FileText,
          shortcut: "N F",
          onSelect: () => navigate("/finance"),
        },
        {
          id: "action-briefing",
          label: "Eveiller le Pont",
          icon: Sparkles,
          shortcut: "N B",
          onSelect: () => navigate("/"),
        },
        {
          id: "action-email",
          label: "Rediger Email",
          icon: Mail,
          onSelect: () => navigate("/emails"),
        },
      ],
    },
    {
      heading: "IA — Sorel",
      items: [
        {
          id: "ai-ask",
          label: "Invoquer Sorel",
          icon: MessageSquare,
          shortcut: "A S",
          onSelect: () => action("ask-sorel"),
        },
        {
          id: "ai-analyze",
          label: "Scanner un Prospect",
          icon: BarChart3,
          onSelect: () => action("analyze-prospect"),
        },
        {
          id: "ai-draft",
          label: "Forger un texte",
          icon: Zap,
          onSelect: () => action("ai-draft"),
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* ── Command Dialog ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-x-0 top-[20%] z-[101] mx-auto w-full max-w-[560px] px-4"
          >
            <Command
              className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.14 0.01 270 / 0.98) 0%, oklch(0.10 0.01 270 / 0.98) 100%)",
                backdropFilter: "blur(24px)",
              }}
              loop
              shouldFilter={!isKnowledgeSearch}
            >
              {/* ── Search Input ── */}
              <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
                {isKnowledgeSearch ? (
                  <BookOpen className="h-5 w-5 shrink-0 text-[var(--color-blue)]" />
                ) : (
                  <Search className="h-5 w-5 shrink-0 text-[var(--color-gold-muted)]" />
                )}
                <Command.Input
                  value={search}
                  onValueChange={(v) => { setSearch(v); setClaudeResponse(""); }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && search.trim() && !isKnowledgeSearch) {
                      // If no exact command match, route to Claude natural language
                      const allLabels = groups.flatMap((g) => g.items.map((i) => i.label.toLowerCase()));
                      const isExactMatch = allLabels.some((l) => l.includes(search.toLowerCase()));
                      if (!isExactMatch && search.length > 5) {
                        e.preventDefault();
                        setClaudeLoading(true);
                        setClaudeResponse("");
                        try {
                          const res = await fetch("/api/ai", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: "ask_sorel",
                              payload: { question: search },
                            }),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setClaudeResponse(data.result || "Silence.");
                          } else {
                            setClaudeResponse("Ligne coupee.");
                          }
                        } catch { setClaudeResponse("Kaiou dort."); }
                        finally { setClaudeLoading(false); }
                      }
                    }
                  }}
                  placeholder="Parle. Le vaisseau ecoute. (? pour chercher)"
                  className="flex-1 bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
                />
                {knowledgeLoading && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--color-blue)]" />
                )}
                <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                  ESC
                </kbd>
              </div>

              {/* ── Results ── */}
              <Command.List className="max-h-[360px] overflow-y-auto p-2">
                <Command.Empty className="py-4 text-sm text-[var(--color-text-muted)]">
                  {claudeLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-gold)]" />
                      <span>Kaiou reflechit...</span>
                    </div>
                  ) : claudeResponse ? (
                    <div className="space-y-2 px-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">Kaiou</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--color-text)]">{claudeResponse}</p>
                    </div>
                  ) : isKnowledgeSearch ? (
                    <div className="flex items-center justify-center py-8">
                      {knowledgeQuery.length < 2
                        ? "2 caracteres minimum."
                        : "Rien dans les archives."}
                    </div>
                  ) : search.length > 5 ? (
                    <div className="flex items-center justify-center py-8">
                      <kbd className="mx-1 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px]">Entree</kbd> pour invoquer Kaiou
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      {`\u201C${search}\u201D \u2014 inconnu du vaisseau.`}
                    </div>
                  )}
                </Command.Empty>

                {/* ── Knowledge Results ── */}
                {isKnowledgeSearch && knowledgeResults.length > 0 && (
                  <Command.Group
                    heading="Connaissances"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--color-blue)]"
                  >
                    {knowledgeResults.map((result) => {
                      const catColor =
                        categoryColors[result.category] ||
                        categoryColors.default;
                      return (
                        <Command.Item
                          key={result.path}
                          value={`${result.name} ${result.title} ${result.category}`}
                          onSelect={() =>
                            navigate(
                              `/knowledge?path=${encodeURIComponent(result.path)}`
                            )
                          }
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                            "text-[var(--color-text-muted)] aria-selected:bg-[var(--color-gold-glow)] aria-selected:text-[var(--color-text)]",
                            "hover:bg-[var(--color-surface-2)]"
                          )}
                        >
                          <FolderOpen className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-blue)]" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-[var(--color-text)]">
                                {result.title || result.name}
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                                  catColor
                                )}
                              >
                                {result.category}
                              </span>
                            </div>
                            {result.preview && (
                              <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                                {result.preview.slice(0, 80)}
                                {result.preview.length > 80 ? "..." : ""}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                            {result.sizeFormatted}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                )}

                {/* ── Standard Groups (hidden during knowledge search) ── */}
                {!isKnowledgeSearch &&
                  groups.map((group) => (
                    <Command.Group
                      key={group.heading}
                      heading={group.heading}
                      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--color-text-muted)]"
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Command.Item
                            key={item.id}
                            value={`${group.heading} ${item.label}`}
                            onSelect={item.onSelect}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                              "text-[var(--color-text-muted)] aria-selected:bg-[var(--color-gold-glow)] aria-selected:text-[var(--color-gold)]",
                              "hover:bg-[var(--color-surface-2)]"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.shortcut && (
                              <span className="flex items-center gap-1">
                                {item.shortcut.split(" ").map((key) => (
                                  <kbd
                                    key={key}
                                    className="min-w-[20px] rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1 py-0.5 text-center font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]"
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </span>
                            )}
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  ))}
              </Command.List>

              {/* ── Footer ── */}
              <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-4 py-2.5">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {isKnowledgeSearch
                    ? "Knowledge Layer"
                    : "Propulse par Sorel"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {isKnowledgeSearch ? "? query" : "Naviguer"}
                  </span>
                  <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                    {"\u2191\u2193"}
                  </kbd>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    Selectionner
                  </span>
                  <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                    {"\u23CE"}
                  </kbd>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
