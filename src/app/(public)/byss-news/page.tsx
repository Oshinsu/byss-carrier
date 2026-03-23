"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Radar, Clock, MapPin, ArrowUpRight, Filter, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   BYSS NEWS — RadarDiplo
   "1392 signaux. 0 bruit."
   Articles from Knowledge Layer + Supabase lore_entries
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

/* ── Types ── */
interface Article {
  id: string;
  date: string;
  title: string;
  category: string;
  excerpt: string;
}

/* ── Category → display config ── */
const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  plan_guerre: { label: "Strategie", color: "bg-[var(--color-gold)]/10 text-[var(--color-gold)]" },
  dossier_prospect: { label: "Prospect", color: "bg-[var(--color-blue)]/10 text-[var(--color-blue)]" },
  analyse_strategique: { label: "Analyse", color: "bg-[var(--color-fire)]/10 text-[var(--color-fire)]" },
  intelligence: { label: "Intel", color: "bg-[var(--color-green)]/10 text-[var(--color-green)]" },
  lore: { label: "Lore", color: "bg-[var(--color-amber)]/10 text-[var(--color-amber)]" },
};

function getCategoryDisplay(cat: string) {
  return CATEGORY_CONFIG[cat] ?? { label: cat, color: "bg-[var(--color-gold)]/10 text-[var(--color-gold)]" };
}

/* ── Static filter tags ── */
const ALL_TAGS = ["Tous", "Strategie", "Prospect", "Analyse", "Intel", "Lore"];

export default function ByssNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("Tous");
  const [articleCount, setArticleCount] = useState(0);

  /* ── Fetch articles from Knowledge Layer, fallback to lore_entries ── */
  useEffect(() => {
    async function load() {
      setLoading(true);
      let fetched: Article[] = [];

      // Try Knowledge Layer first
      try {
        const res = await fetch("/api/knowledge?category=intelligence");
        if (res.ok) {
          const data = await res.json();
          if (data.results?.length) {
            fetched = data.results.map((r: { path: string; title: string; category: string; preview: string; name: string }) => ({
              id: r.path,
              date: "", // filesystem entries don't have dates
              title: r.title || r.name,
              category: r.category || "intelligence",
              excerpt: r.preview || "",
            }));
          }
        }
      } catch {
        // Knowledge API not available, continue to fallback
      }

      // Also fetch from Supabase lore_entries for strategic content
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data } = await supabase
          .from("lore_entries")
          .select("*")
          .in("category", ["plan_guerre", "dossier_prospect", "analyse_strategique"])
          .order("created_at", { ascending: false })
          .limit(20);

        if (data?.length) {
          const loreArticles: Article[] = data.map((entry: { id: string; created_at: string; title: string; category: string; content: string | null }) => ({
            id: entry.id,
            date: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(entry.created_at)),
            title: entry.title,
            category: entry.category || "lore",
            excerpt: entry.content?.slice(0, 200) ?? "",
          }));
          fetched = [...loreArticles, ...fetched];
        }
      } catch {
        // Supabase not available
      }

      // Deduplicate by id
      const seen = new Set<string>();
      fetched = fetched.filter((a) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });

      setArticles(fetched);
      setArticleCount(fetched.length);
      setLoading(false);
    }

    load();
  }, []);

  /* ── Filter ── */
  const filteredArticles = activeTag === "Tous"
    ? articles
    : articles.filter((a) => getCategoryDisplay(a.category).label === activeTag);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)]">
      {/* ── Nav ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
          >
            <ArrowLeft className="h-4 w-4" />
            BYSS GROUP
          </Link>
        </div>
      </nav>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20">
        {/* Radar glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.12 85 / 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Animated radar rings */}
        {[200, 350, 500].map((size, i) => (
          <div
            key={size}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-gold)]"
            style={{
              width: size,
              height: size,
              opacity: 0.04 + i * 0.02,
            }}
          />
        ))}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2"
          >
            <Radar className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]">
              RadarDiplo
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="gradient-sovereign font-[family-name:var(--font-clash-display)] text-[clamp(2.5rem,10vw,6rem)] font-bold leading-none tracking-tight"
          >
            BYSS NEWS
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-satoshi)] text-lg text-[var(--color-text)] md:text-xl"
          >
            {articleCount > 0 ? `${articleCount} signaux. 0 bruit.` : "Chargement des signaux..."}
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-3 max-w-md font-[family-name:var(--font-satoshi)] text-[var(--text-small)] italic text-[var(--color-text-muted)]"
          >
            &ldquo;L&apos;information est gratuite. La comprehension coute une fortune.&rdquo;
          </motion.p>
        </motion.div>
      </section>

      {/* ════════════════════ FEED ════════════════════ */}
      <section className="relative px-6 py-24">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Main feed */}
            <div className="flex-1">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={stagger}
                className="mb-10 flex items-center gap-3"
              >
                <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
                  <Newspaper className="h-5 w-5 text-[var(--color-gold)]" />
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="font-[family-name:var(--font-clash-display)] text-[var(--text-h2)] font-bold text-[var(--color-white)]"
                >
                  Derniers signaux
                </motion.h2>
              </motion.div>

              {loading ? (
                <div className="space-y-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
                      <div className="mb-3 flex gap-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-2)]" />
                        <div className="h-4 w-16 animate-pulse rounded-full bg-[var(--color-surface-2)]" />
                      </div>
                      <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--color-surface-2)]" />
                      <div className="mt-3 space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-[var(--color-surface-2)]" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--color-surface-2)]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
                  <Radar className="mx-auto mb-4 h-8 w-8 text-[var(--color-text-muted)]" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Aucun signal pour ce filtre
                  </p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={stagger}
                  className="space-y-5"
                >
                  {filteredArticles.map((article) => {
                    const catDisplay = getCategoryDisplay(article.category);
                    return (
                      <motion.article
                        key={article.id}
                        variants={scaleIn}
                        transition={{ duration: 0.5 }}
                        className="glass group cursor-pointer rounded-[var(--radius-lg)] p-6 transition-all duration-300 hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          {article.date && (
                            <span className="flex items-center gap-1.5 font-[family-name:var(--font-satoshi)] text-[var(--text-micro)] text-[var(--color-text-muted)]">
                              <Clock className="h-3 w-3" />
                              {article.date}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[var(--text-micro)] font-medium ${catDisplay.color}`}>
                            <MapPin className="h-3 w-3" />
                            {catDisplay.label}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-semibold leading-tight text-[var(--color-white)] transition-colors group-hover:text-[var(--color-gold)]">
                            {article.title}
                          </h3>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-all group-hover:text-[var(--color-gold)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                        {article.excerpt && (
                          <p className="mt-3 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="sticky top-24"
              >
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="mb-6 flex items-center gap-2"
                >
                  <Filter className="h-4 w-4 text-[var(--color-gold-muted)]" />
                  <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-semibold uppercase tracking-wider text-[var(--color-gold-muted)]">
                    Filtres
                  </span>
                </motion.div>

                <motion.div
                  variants={stagger}
                  className="flex flex-wrap gap-2"
                >
                  {ALL_TAGS.map((tag) => (
                    <motion.button
                      key={tag}
                      variants={scaleIn}
                      transition={{ duration: 0.4 }}
                      onClick={() => setActiveTag(tag)}
                      className={cn(
                        "rounded-full border px-4 py-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] transition-all",
                        activeTag === tag
                          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
                      )}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Stats sidebar */}
                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="mt-10 glass rounded-[var(--radius-lg)] p-6"
                >
                  <h3 className="mb-4 font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-semibold text-[var(--color-white)]">
                    Couverture
                  </h3>
                  <div className="space-y-3 font-[family-name:var(--font-satoshi)] text-[var(--text-small)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Signaux traites</span>
                      <span className="font-medium text-[var(--color-gold)]">{articleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Categories</span>
                      <span className="font-medium text-[var(--color-gold)]">{new Set(articles.map((a) => a.category)).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Taux de bruit</span>
                      <span className="font-medium text-[var(--color-green)]">0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Frequence</span>
                      <span className="font-medium text-[var(--color-text)]">Quotidien</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  transition={{ duration: 0.6 }}
                  className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
                >
                  <p className="font-[family-name:var(--font-satoshi)] text-[var(--text-micro)] italic leading-relaxed text-[var(--color-text-muted)]">
                    &ldquo;Lire le monde sans filtre, c&apos;est le voir sans lunettes. Nous sommes les lunettes.&rdquo;
                  </p>
                </motion.div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Footer link ── */}
      <section className="border-t border-[var(--color-border-subtle)] px-6 py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <Link
            href="/"
            className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
          >
            &larr; Retour au QG
          </Link>
        </div>
      </section>
    </main>
  );
}
