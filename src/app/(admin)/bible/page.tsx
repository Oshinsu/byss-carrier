"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Search, Brain, BookOpen, Target, Shield, MessageSquare,
  Users, Calendar, Swords, Leaf, LayoutGrid, ChevronDown,
  Sparkles, Send, Hash, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════════════
   BYSS GROUP — Bible de Vente
   Fetches from lore_entries table (universe = 'bible')
   ═══════════════════════════════════════════════════════════════ */

interface LoreEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  order_index: number;
}

/* ── Icon mapping for categories ── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Psychologie": Brain,
  "Vente": Target,
  "Objections": Shield,
  "Neuro-Selling": MessageSquare,
  "Credibilite": Shield,
  "Strategie": Users,
  "Recrutement": Users,
  "Saisonnalite": Calendar,
  "Sun Tzu": Swords,
  "Biomimetisme": Leaf,
  "Architecture": LayoutGrid,
};

function getIconForCategory(category: string): React.ElementType {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return BookOpen;
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════════════ */
function BibleSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-64 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#1A1A2E] animate-pulse" />
            </div>
            <div className="h-4 w-4 rounded bg-[#1A1A2E] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function BibleDeVentePage() {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorelQuery, setSorelQuery] = useState("");
  const [sorelResponse, setSorelResponse] = useState("");
  const [sorelLoading, setSorelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Fetch from Supabase ─── */
  useEffect(() => {
    async function fetchEntries() {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("lore_entries")
          .select("*")
          .eq("universe", "bible")
          .order("order_index");

        if (fetchError) throw fetchError;

        setEntries(
          (data || []).map((row: Record<string, unknown>) => ({
            id: row.id as string,
            title: (row.title as string) || "Sans titre",
            category: (row.category as string) || "Général",
            content: (row.content as string) || "",
            order_index: Number(row.order_index) || 0,
          }))
        );
      } catch (err) {
        console.error("Bible fetch error:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement de la Bible.");
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  /* ─── Group entries by category ─── */
  const categories = useMemo(() => {
    const map = new Map<string, LoreEntry[]>();
    for (const entry of entries) {
      const cat = entry.category || "Général";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(entry);
    }
    return Array.from(map.entries());
  }, [entries]);

  const totalWords = useMemo(
    () => entries.reduce((sum, e) => sum + (e.content ? e.content.split(/\s+/).length : 0), 0),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  /* ─── Group filtered entries by category ─── */
  const filteredCategories = useMemo(() => {
    const map = new Map<string, LoreEntry[]>();
    for (const entry of filteredEntries) {
      const cat = entry.category || "Général";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(entry);
    }
    return Array.from(map.entries());
  }, [filteredEntries]);

  const handleAskSorel = async () => {
    if (!sorelQuery.trim()) return;
    setSorelLoading(true);
    setSorelResponse("");
    try {
      // Build context from Bible entries for RAG
      const bibleContext = entries
        .map((e) => `[${e.category}] ${e.title}: ${e.content?.slice(0, 500) || ""}`)
        .join("\n\n");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "command",
          payload: {
            query: sorelQuery,
            context: { bibleContext: bibleContext.slice(0, 8000) },
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSorelResponse(data.result || "Sorel n'a pas pu repondre.");
      } else {
        setSorelResponse("Erreur de connexion avec Sorel. Verifiez l'API.");
      }
    } catch {
      setSorelResponse("Sorel est temporairement indisponible.");
    } finally {
      setSorelLoading(false);
    }
  };

  const renderContent = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => (
      <p key={i} className="mb-3 last:mb-0">
        {paragraph.split("**").map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="text-[var(--color-text)] font-semibold">
              {part}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    ));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <PageHeader
        title="Bible de"
        titleAccent="Vente"
        subtitle={`${entries.length} entrées — Stratégie commerciale BYSS GROUP`}
      />

      {/* Error Banner */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{
            borderColor: "rgba(255,45,45,0.2)",
            background: "rgba(255,45,45,0.05)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans la Bible..."
          className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none transition-colors"
        />
      </div>

      {/* Ask Sorel */}
      <div className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
          <span className="font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-gold)]">
            Ask Sorel
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            — Assistant commercial IA
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={sorelQuery}
            onChange={(e) => setSorelQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskSorel()}
            placeholder="Pose une question commerciale a Sorel..."
            className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
          />
          <button
            onClick={handleAskSorel}
            disabled={sorelLoading}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-[var(--color-gold-glow)] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Envoyer
          </button>
        </div>
        <AnimatePresence>
          {sorelResponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                {sorelResponse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading state */}
      {loading && <BibleSkeleton />}

      {/* Chapters grouped by category */}
      {!loading && (
        <div className="space-y-6">
          {filteredCategories.map(([category, catEntries]) => {
            const CatIcon = getIconForCategory(category);
            return (
              <div key={category}>
                {/* Category header */}
                <div className="mb-3 flex items-center gap-2">
                  <CatIcon className="h-4 w-4 text-[var(--color-gold)]" />
                  <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {category}
                  </h2>
                  <span className="rounded-full bg-[var(--color-gold-glow)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-gold)]">
                    {catEntries.length}
                  </span>
                </div>

                {/* Entries in this category */}
                <div className="space-y-3">
                  {catEntries.map((entry, i) => {
                    const isOpen = expandedId === entry.id;
                    const EntryIcon = getIconForCategory(entry.category);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden"
                      >
                        {/* Entry header */}
                        <button
                          onClick={() => setExpandedId(isOpen ? null : entry.id)}
                          className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[var(--color-gold-glow)]"
                        >
                          {/* Gold numbered badge */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold)] text-black">
                            <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold">
                              {entry.order_index || i + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-1">
                            <EntryIcon className="h-4 w-4 text-[var(--color-gold)] shrink-0" />
                            <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[var(--color-text)]">
                              {entry.title}
                            </h3>
                          </div>

                          {entry.content && (
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                              <Hash className="h-3 w-3" />
                              {entry.content.split(/\s+/).length} mots
                            </div>
                          )}

                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {/* Entry content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-t border-[var(--color-border-subtle)]"
                            >
                              <div className="p-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
                                {entry.content ? renderContent(entry.content) : (
                                  <p className="italic text-[var(--color-text-muted)]">Aucun contenu pour cette entrée.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No results */}
      {!loading && filteredEntries.length === 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
          <Search className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" />
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {searchQuery
              ? `Aucune entrée ne correspond à "${searchQuery}"`
              : "Aucune entrée dans la Bible de Vente"}
          </p>
        </div>
      )}

      {/* Footer — total word count */}
      {!loading && entries.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
              {totalWords.toLocaleString("fr-FR")}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              mots au total — {entries.length} entrées
            </span>
          </div>
          <p className="mt-2 text-xs italic text-[var(--color-text-muted)]">
            Document vivant — mis à jour par Sorel, agent commercial IA de BYSS GROUP.
          </p>
        </div>
      )}
    </div>
  );
}
