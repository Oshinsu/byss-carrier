"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Radar, Clock, MapPin, ArrowUpRight, Filter, Newspaper,
  ExternalLink, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

/* ═══════════════════════════════════════════════════════
   BYSS NEWS — RadarDiplo
   Intelligence geopolitique. Veille strategique.
   Cyan EXECUTOR theme, font-clash-display
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/* ── Types ── */
interface IntelEntry {
  id: string;
  title: string;
  content: string | null;
  category: string;
  tags: string[] | null;
  created_at: string;
}

/* ── Tag colors ── */
const TAG_COLORS: Record<string, string> = {
  geopolitique: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  economie: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  defense: "bg-red-500/10 text-red-400 border-red-500/20",
  diplomatie: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  technologie: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  martinique: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  intel: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]";
}

export default function ByssNewsPage() {
  const [entries, setEntries] = useState<IntelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [allTags, setAllTags] = useState<string[]>([]);

  /* ── Fetch intel bulletins ── */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("lore_entries")
          .select("id, title, content, category, tags, created_at")
          .eq("universe", "bible")
          .eq("category", "intel")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        const items: IntelEntry[] = data ?? [];
        setEntries(items);

        // Extract unique tags
        const tagSet = new Set<string>();
        items.forEach((e) => {
          if (e.tags) e.tags.forEach((t) => tagSet.add(t));
        });
        setAllTags(Array.from(tagSet).sort());
      } catch {
        // Fallback: empty state
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Filter by tag ── */
  const filtered = activeTag === "all"
    ? entries
    : entries.filter((e) => e.tags?.includes(activeTag));

  return (
    <div className="min-h-screen">
      {/* ════════════════════ HEADER ════════════════════ */}
      <div className="relative overflow-hidden border-b border-cyan-500/10 bg-gradient-to-b from-cyan-950/20 to-transparent px-6 py-12">
        {/* Radar glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.15 200 / 0.06) 0%, transparent 60%)" }}
        />

        {/* Animated rings */}
        {[180, 300, 420].map((size, i) => (
          <div
            key={size}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500"
            style={{ width: size, height: size, opacity: 0.03 + i * 0.015 }}
          />
        ))}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5"
          >
            <Radar className="h-4 w-4 text-cyan-400" />
            <span className="font-[family-name:var(--font-satoshi)] text-xs font-medium uppercase tracking-wider text-cyan-400">
              RadarDiplo
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="font-[family-name:var(--font-clash-display)] text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            BYSS NEWS
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 font-[family-name:var(--font-satoshi)] text-sm text-cyan-300/60"
          >
            Intelligence geopolitique. Veille strategique.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 flex items-center gap-4"
          >
            <span className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-cyan-400">
              {loading ? "--" : filtered.length}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">signaux actifs</span>

            <a
              href="https://news.byss.group"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 font-[family-name:var(--font-satoshi)] text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/10"
            >
              <ExternalLink className="h-3 w-3" />
              Visiter le site
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ════════════════════ TAG FILTERS ════════════════════ */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3 overflow-x-auto scrollbar-none">
          <Filter className="h-4 w-4 shrink-0 text-cyan-500/50" />
          <button
            onClick={() => setActiveTag("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              activeTag === "all"
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-cyan-500/20 hover:text-cyan-400"
            )}
          >
            Tous
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all",
                activeTag === tag
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-cyan-500/20 hover:text-cyan-400"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════ NEWS FEED ════════════════════ */}
      <div className="px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
                >
                  <div className="mb-3 flex gap-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" />
                    <div className="h-4 w-14 animate-pulse rounded-full bg-[var(--color-surface-2)]" />
                  </div>
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--color-surface-2)]" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-[var(--color-surface-2)]" />
                  <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-[var(--color-surface-2)]" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-16 text-center">
              <Radar className="mx-auto mb-4 h-10 w-10 text-cyan-500/30" />
              <p className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[var(--color-text-muted)]">
                Aucun signal detecte
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]/60">
                Les bulletins d&apos;intelligence apparaitront ici.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-4"
            >
              {filtered.map((entry) => {
                const date = new Intl.DateTimeFormat("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(entry.created_at));

                return (
                  <motion.article
                    key={entry.id}
                    variants={scaleIn}
                    transition={{ duration: 0.4 }}
                    className="group rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:border-cyan-500/20 hover:shadow-[0_0_30px_-10px_rgba(0,188,212,0.08)]"
                  >
                    {/* Meta */}
                    <div className="mb-3 flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                        <Clock className="h-3 w-3" />
                        {date}
                      </span>
                      {entry.tags?.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                            getTagColor(tag)
                          )}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold leading-snug text-white transition-colors group-hover:text-cyan-400">
                        {entry.title}
                      </h3>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-all group-hover:text-cyan-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>

                    {/* Excerpt */}
                    {entry.content && (
                      <p className="mt-2.5 font-[family-name:var(--font-satoshi)] text-sm leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
                        {entry.content.slice(0, 250)}
                        {entry.content.length > 250 ? "..." : ""}
                      </p>
                    )}
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
