"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Star,
  Users,
  Zap,
  Phone,
  BarChart3,
  BookOpen,
  Scroll,
  User,
  Music,
  Quote,
  Globe,
  Newspaper,
  Target,
  CheckSquare,
  Square,
  Play,
  AlertCircle,
  Code2,
  GitBranch,
  Film,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  type ProjectData,
  type ProdStatus,
  prodStatusConfig,
  APEX_WORKFLOWS,
  PIP4_CODE,
  CADIFOR_LAWS,
  CADIFOR_CHARACTERS,
  TOXIC_TRACKS,
  BYSS_NEWS_ARTICLES,
  NEWS_REGIONS,
  EVEIL_MESURES,
  EVEIL_CARTOS,
  EVEIL_PLANS,
  LIGNEE_TREE,
  SOTAI_TEAM,
  SOTAI_SERVICES,
  SOTAI_PIPELINE,
} from "@/lib/data/projects-registry";

/* ═══════════════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: ProdStatus }) {
  const config = prodStatusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", config.bg, config.color)}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function GlassCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5",
        "backdrop-blur-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GITHUB TYPES & HELPERS
   ═══════════════════════════════════════════════════════════════ */

interface GitHubData {
  stats: {
    stars: number;
    forks: number;
    openIssues: number;
    lastPush: string;
    language: string | null;
    size: number;
    htmlUrl: string;
    description: string | null;
  };
  commits: {
    sha: string;
    shortSha: string;
    message: string;
    author: string;
    date: string;
    url: string;
  }[];
  issues: {
    number: number;
    title: string;
    author: string;
    isPullRequest: boolean;
    labels: string[];
    url: string;
  }[];
}

function GitHubSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
            <div className="mb-2 h-5 w-5 rounded bg-[var(--color-surface-2)]" />
            <div className="h-7 w-12 rounded bg-[var(--color-surface-2)]" />
            <div className="mt-1 h-3 w-16 rounded bg-[var(--color-surface-2)]" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <div className="mb-3 h-4 w-32 rounded bg-[var(--color-surface-2)]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-2)]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function LanguageBar({ language }: { language: string | null }) {
  if (!language) return null;
  const langColors: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3572A5",
    "C#": "#239120",
    HTML: "#E34C26",
    CSS: "#563D7C",
    Rust: "#DEA584",
    Go: "#00ADD8",
  };
  const color = langColors[language] || "#6B7280";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-medium" style={{ color }}>{language}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION RENDERERS
   ═══════════════════════════════════════════════════════════════ */

export function ExternalProjectSection({ project }: { project: ProjectData }) {
  const [ghData, setGhData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/github?repo=${project.slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setGhData(null);
            setLoading(false);
            return;
          }
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        setGhData(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur GitHub");
      } finally {
        setLoading(false);
      }
    };
    fetchGitHub();
  }, [project.slug]);

  if (loading) return <GitHubSkeleton />;

  return (
    <div className="space-y-4">
      {/* ── GitHub Stats ── */}
      {error && (
        <GlassCard>
          <div className="flex items-center gap-3 text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">GitHub API: {error}</span>
          </div>
        </GlassCard>
      )}

      {ghData ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Stars", value: String(ghData.stats.stars), icon: Star },
              { label: "Forks", value: String(ghData.stats.forks), icon: GitBranch },
              { label: "Issues", value: String(ghData.stats.openIssues), icon: AlertCircle },
              { label: "Taille", value: `${Math.round(ghData.stats.size / 1024)}MB`, icon: Code2 },
            ].map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.05}>
                <stat.icon className="mb-2 h-5 w-5" style={{ color: project.color }} />
                <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          {/* Last Push + Language */}
          <GlassCard delay={0.1}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Activité</h3>
              {ghData.stats.lastPush && (
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Dernier push: {new Date(ghData.stats.lastPush).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            <LanguageBar language={ghData.stats.language} />
            <div className="mt-3 flex gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-all hover:opacity-90"
                  style={{ backgroundColor: project.color }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir
                </a>
              )}
              <a
                href={ghData.stats.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
              >
                <Github className="h-4 w-4" />
                Ouvrir sur GitHub
              </a>
            </div>
          </GlassCard>

          {/* Recent Commits */}
          <GlassCard delay={0.15}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Derniers commits</h3>
            <div className="space-y-2">
              {ghData.commits.map((commit, i) => (
                <motion.a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-2)] px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-2)]/80"
                >
                  <span
                    className="shrink-0 rounded-md px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-medium"
                    style={{ backgroundColor: `${project.color}15`, color: project.color }}
                  >
                    {commit.shortSha}
                  </span>
                  <span className="flex-1 truncate text-xs text-[var(--color-text)]">{commit.message}</span>
                  <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">{commit.author}</span>
                  <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                    {new Date(commit.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </motion.a>
              ))}
            </div>
          </GlassCard>

          {/* Open Issues / PRs */}
          {ghData.issues.length > 0 && (
            <GlassCard delay={0.2}>
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                Issues & PRs ouvertes ({ghData.issues.length})
              </h3>
              <div className="space-y-2">
                {ghData.issues.slice(0, 8).map((issue, i) => (
                  <motion.a
                    key={issue.number}
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-2)] px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-2)]/80"
                  >
                    <span className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      issue.isPullRequest ? "bg-purple-500/15 text-purple-400" : "bg-emerald-500/15 text-emerald-400"
                    )}>
                      {issue.isPullRequest ? "PR" : "Issue"} #{issue.number}
                    </span>
                    <span className="flex-1 truncate text-xs text-[var(--color-text)]">{issue.title}</span>
                    <div className="flex gap-1">
                      {issue.labels.slice(0, 2).map((label) => (
                        <span key={label} className="rounded-full bg-[var(--color-surface)] px-1.5 py-0.5 text-[9px] text-[var(--color-text-muted)]">
                          {label}
                        </span>
                      ))}
                    </div>
                  </motion.a>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      ) : (
        /* Fallback: no GitHub data for this project */
        <>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Statut du projet</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Plateforme déployée et active</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${project.color}20` }}>
                <Zap className="h-6 w-6" style={{ color: project.color }} />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-all hover:opacity-90"
                  style={{ backgroundColor: project.color }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}

export function MoostikSection() {
  const [moostikVideos, setMoostikVideos] = useState<{
    id: string;
    title: string;
    status: string;
    amount_billed: number | null;
    format: string | null;
    start_date: string | null;
    end_date: string | null;
  }[]>([]);
  const [loadingMoostik, setLoadingMoostik] = useState(true);

  useEffect(() => {
    async function fetchMoostik() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .ilike("title", "%MOOSTIK%")
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (data) setMoostikVideos(data);
      } catch (err) {
        console.error("Moostik fetch error:", err);
      } finally {
        setLoadingMoostik(false);
      }
    }
    fetchMoostik();
  }, []);

  const totalEpisodes = moostikVideos.length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Characters", value: "100+", icon: Users },
          { label: "Vidéos Supabase", value: loadingMoostik ? "..." : String(totalEpisodes), icon: Film },
          { label: "Features", value: "4", icon: Zap },
          { label: "Pricing Tiers", value: "4", icon: BarChart3 },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.05}>
            <stat.icon className="mb-2 h-5 w-5 text-[#fafafa]" />
            <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Features */}
      <GlassCard delay={0.08}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">BLOODWINGSStudio — Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Signal Extraction", desc: "Extraction de signaux narratifs depuis n'importe quelle source" },
            { name: "Reality Bleed Protocol", desc: "Protocole de fusion réalité/fiction pour scènes immersives" },
            { name: "100+ Character Variations", desc: "Bibliothèque de plus de 100 variations de personnages" },
            { name: "EDL Export", desc: "Export EDL pour intégration directe en post-production" },
          ].map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-4"
            >
              <h4 className="text-xs font-semibold text-[var(--color-text)]">{f.name}</h4>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Pricing */}
      <GlassCard delay={0.12}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Pricing</h3>
        <div className="flex gap-3">
          {[
            { name: "Free", price: "0€", color: "#6B7280" },
            { name: "Starter", price: "—", color: "#3B82F6" },
            { name: "Pro", price: "—", color: "#8B5CF6" },
            { name: "Enterprise", price: "1 499€/mo", color: "#00B4D8" },
          ].map((p) => (
            <div key={p.name} className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3 text-center">
              <span className="text-[10px] font-semibold" style={{ color: p.color }}>{p.name}</span>
              <div className="mt-1 text-sm font-bold text-[var(--color-text)]">{p.price}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Platform Link */}
      <GlassCard delay={0.14}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Plateforme Live</h3>
          <a
            href="https://moostik.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
          >
            <ExternalLink className="h-4 w-4" />
            moostik.vercel.app
          </a>
        </div>
      </GlassCard>

      {/* Episodes from Supabase */}
      <GlassCard delay={0.15}>
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">{"\u00C9"}pisodes</h3>
        {loadingMoostik ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-8 animate-pulse rounded bg-[var(--color-surface)]" />
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface)]" />
                </div>
                <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--color-surface)]" />
              </div>
            ))}
          </div>
        ) : moostikVideos.length === 0 ? (
          <div className="py-6 text-center text-xs text-[var(--color-text-muted)]">Aucun {"\u00E9"}pisode MOOSTIK trouv{"\u00E9"}</div>
        ) : (
          <div className="space-y-2">
            {moostikVideos.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.03 }}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#8B5CF6]">
                    EP{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-[var(--color-text)]">{ep.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {ep.amount_billed != null && (
                    <span className="text-[10px] font-medium text-[var(--color-gold)]">
                      {ep.amount_billed.toLocaleString("fr-FR")}{"\u20AC"}
                    </span>
                  )}
                  <StatusBadge status={ep.status as ProdStatus} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export function Apex972Section() {
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Leads/mois", value: "120", icon: Users },
          { label: "Conversion", value: "8-12%", icon: BarChart3 },
          { label: "CAC", value: "~15€", icon: Target },
        ].map((kpi, i) => (
          <GlassCard key={kpi.label} delay={i * 0.05}>
            <kpi.icon className="mb-2 h-5 w-5 text-[#F97316]" />
            <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{kpi.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{kpi.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* n8n Workflows */}
      <GlassCard delay={0.1}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Workflows n8n</h3>
        <div className="space-y-2">
          {APEX_WORKFLOWS.map((wf, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[var(--color-text)]">{wf.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[var(--color-text-muted)]">{wf.leads} leads</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Actif</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* WhatsApp Stats */}
      <GlassCard delay={0.15}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">WhatsApp 360dialog</h3>
          <Phone className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            { label: "Messages envoyés", value: "2,847" },
            { label: "Taux d'ouverture", value: "78%" },
            { label: "Réponses", value: "342" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-[var(--color-surface-2)] p-3 text-center">
              <div className="text-lg font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* PIP4 Code */}
      <GlassCard delay={0.2}>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)]">PIP4 — Code Source</h3>
          <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", showCode && "rotate-180")} />
        </button>
        <AnimatePresence>
          {showCode && (
            <motion.pre
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden rounded-lg bg-[var(--color-bg)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap"
            >
              {PIP4_CODE}
            </motion.pre>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

export function CadiforSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChar, setExpandedChar] = useState<string | null>(null);

  const filteredLaws = CADIFOR_LAWS.filter(
    (l) =>
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pages", value: "997", icon: BookOpen },
          { label: "Lois", value: "8", icon: Scroll },
          { label: "Personnages", value: "6", icon: User },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05}>
            <s.icon className="mb-2 h-5 w-5 text-[var(--color-gold)]" />
            <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{s.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans le lore..."
          className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
        />
      </div>

      {/* 8 Laws */}
      <GlassCard delay={0.1}>
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Les 8 Lois du MODE_CADIFOR</h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredLaws.map((law, i) => (
            <motion.div
              key={law.num}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-4 transition-all hover:border-[var(--color-gold-muted)]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-black">
                  {law.num}
                </span>
                <span className="text-xs font-semibold text-[var(--color-text)]">{law.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--color-text-muted)]">{law.desc}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Characters */}
      <GlassCard delay={0.2}>
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-gold)]">Personnages</h3>
        <div className="grid grid-cols-3 gap-3">
          {CADIFOR_CHARACTERS.map((char, i) => (
            <motion.button
              key={char.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              onClick={() => setExpandedChar(expandedChar === char.name ? null : char.name)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                expandedChar === char.name
                  ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                  : "border-[var(--color-border-subtle)] hover:border-[var(--color-gold-muted)]"
              )}
              style={{ backgroundColor: expandedChar === char.name ? `${char.color}10` : undefined }}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${char.color}20` }}>
                <User className="h-5 w-5" style={{ color: char.color }} />
              </div>
              <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-bold" style={{ color: char.color }}>
                {char.name}
              </h4>
              <p className="text-[10px] font-medium text-[var(--color-text-muted)]">{char.role}</p>
              <AnimatePresence>
                {expandedChar === char.name && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 text-[11px] leading-relaxed text-[var(--color-text-muted)]"
                  >
                    {char.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function ToxicSection() {
  return (
    <div className="space-y-4">
      {/* ── Clips Vidéo ── */}
      <GlassCard delay={0}>
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Clips Vid{"\u00E9"}o</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { src: "https://www.youtube.com/embed/AMPrA5-wiVQ", title: "Toxic — Je veux tout", name: "Je veux tout", sub: "Toxic — GI.Corp" },
            { src: "https://www.youtube.com/embed/8hddhXACEXU", title: "Toxic — Toi & Moi", name: "Toi & Moi", sub: "Toxic — GI.Corp" },
            { src: "https://www.youtube.com/embed/hJQu9BA_5Q8", title: "Toxic x Cyparis — Popsta", name: "Popsta", sub: "Toxic x Cyparis — GI.Corp" },
          ].map((clip) => (
            <div key={clip.src} className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={clip.src}
                  title={clip.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3">
                <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold">{clip.name}</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{clip.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* SoundCloud Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tracks", value: "44", icon: Music },
          { label: "Followers", value: "119", icon: Users },
          { label: "Playlist", value: "1", icon: Play },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.05}>
            <stat.icon className="mb-2 h-5 w-5 text-[#06B6D4]" />
            <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Artist Info */}
      <GlassCard delay={0.05}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Quote className="h-5 w-5 text-[#06B6D4]" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Toxic — Artiste From Mada</p>
              <p className="text-xs text-[var(--color-text-muted)]">Lyon, France — GI.Corp</p>
            </div>
          </div>
          <a
            href="https://soundcloud.com/gary-bissol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-all hover:opacity-90 bg-[#06B6D4]"
          >
            <Music className="h-4 w-4" />
            SoundCloud
          </a>
        </div>
      </GlassCard>

      {/* Top 6 */}
      <GlassCard delay={0.1}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Top 6 — Notable Tracks</h3>
        <div className="space-y-2">
          {TOXIC_TRACKS.filter((t) => t.top).slice(0, 5).map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-[#06B6D4]/20 bg-[#06B6D4]/5 px-4 py-3"
            >
              <span className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#06B6D4]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <span className="text-sm font-medium text-[var(--color-text)]">{track.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-[var(--color-surface-2)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(track.grade / 10) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full bg-[#06B6D4]"
                  />
                </div>
                <span className="text-xs font-bold text-[#06B6D4]">{track.grade}</span>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#06B6D4]/15 text-[#06B6D4] transition-colors hover:bg-[#06B6D4]/25">
                <Play className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Full catalogue */}
      <GlassCard delay={0.15}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Catalogue complet — 44 tracks</h3>
        <div className="grid grid-cols-2 gap-2">
          {TOXIC_TRACKS.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.02 }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                track.top ? "bg-[#06B6D4]/5" : "bg-[var(--color-surface-2)]"
              )}
            >
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                {String(track.id).padStart(2, "0")}
              </span>
              <span className={cn("flex-1 text-xs", track.top ? "font-medium text-[var(--color-text)]" : "text-[var(--color-text-muted)]")}>
                {track.title}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-12 rounded-full bg-[var(--color-surface)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(track.grade / 10) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.03, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: track.top ? "#06B6D4" : "var(--color-text-muted)" }}
                  />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{track.grade}</span>
              </div>
              <button className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:text-[#06B6D4]">
                <Play className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export function ByssNewsSection() {
  const [regionFilter, setRegionFilter] = useState("Tous");

  const filtered = regionFilter === "Tous"
    ? BYSS_NEWS_ARTICLES
    : BYSS_NEWS_ARTICLES.filter((a) => a.region === regionFilter);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Signaux", value: "1 392", icon: Zap },
          { label: "Articles", value: String(BYSS_NEWS_ARTICLES.length), icon: Newspaper },
          { label: "Régions", value: "5", icon: Globe },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05}>
            <s.icon className="mb-2 h-5 w-5 text-[#EC4899]" />
            <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">{s.value}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {NEWS_REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              regionFilter === r
                ? "bg-[#EC4899] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map((article, i) => (
          <GlassCard key={article.id} delay={0.1 + i * 0.05}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-[#EC4899]/15 px-2 py-0.5 text-[10px] font-medium text-[#EC4899]">
                    {article.region}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{article.date}</span>
                </div>
                <h4 className="text-sm font-semibold text-[var(--color-text)]">{article.title}</h4>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{article.excerpt}</p>
              </div>
              <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export function FM12Section() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-center"
      >
        <h2 className="font-[family-name:var(--font-clash-display)] text-5xl font-bold text-[var(--color-text)]">
          FM12
        </h2>
        <div className="mx-auto my-8 h-px w-48 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="font-[family-name:var(--font-clash-display)] text-xl text-[var(--color-text-muted)]"
        >
          La durée comme arme
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="mt-4 font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]"
        >
          8 000 heures
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 3.5, duration: 2 }}
          className="mt-12 max-w-md text-xs leading-relaxed text-[var(--color-text-muted)]"
        >
          Le silence est une stratégie. La patience est une arme. Ce qui ne se montre pas
          n&apos;en est pas moins réel. FM12 est le projet invisible — celui qui travaille
          pendant que les autres dorment. 8 000 heures de fondation. Pas de deadline.
          Pas de pitch. Juste le temps qui fait son travail.
        </motion.p>
      </motion.div>
    </div>
  );
}

export function EveilSection() {
  const [mesuresDone, setMesuresDone] = useState<Set<number>>(new Set());
  const toggleMesure = (i: number) => {
    setMesuresDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* 20 mesures */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Programme — 20 Mesures</h3>
          <span className="text-xs text-[var(--color-text-muted)]">{mesuresDone.size}/20</span>
        </div>
        <div className="mb-4 h-1.5 rounded-full bg-[var(--color-surface-2)]">
          <div
            className="h-full rounded-full bg-[var(--color-gold)] transition-all"
            style={{ width: `${(mesuresDone.size / 20) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          {EVEIL_MESURES.map((m, i) => (
            <button
              key={i}
              onClick={() => toggleMesure(i)}
              className="flex items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-2)]"
            >
              {mesuresDone.has(i) ? (
                <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
              ) : (
                <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
              )}
              <span className={cn("text-[11px] leading-tight", mesuresDone.has(i) ? "text-[var(--color-text)] line-through" : "text-[var(--color-text-muted)]")}>
                <span className="font-semibold text-[var(--color-gold)]">{i + 1}.</span> {m}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Cartographies */}
      <div className="grid grid-cols-5 gap-3">
        {EVEIL_CARTOS.map((c, i) => (
          <GlassCard key={c.name} delay={0.1 + i * 0.05} className="text-center">
            <c.icon className="mx-auto mb-2 h-5 w-5 text-[var(--color-gold)]" />
            <h4 className="text-xs font-semibold text-[var(--color-text)]">{c.name}</h4>
            <p className="text-[10px] text-[var(--color-text-muted)]">{c.entries} entrées</p>
          </GlassCard>
        ))}
      </div>

      {/* Plans de Guerre */}
      <div className="grid grid-cols-3 gap-3">
        {EVEIL_PLANS.map((plan, i) => (
          <GlassCard key={plan.name} delay={0.2 + i * 0.06} className="hover:border-[var(--color-gold-muted)] cursor-pointer transition-all">
            <plan.icon className="mb-2 h-5 w-5 text-[var(--color-gold)]" />
            <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">{plan.name}</h4>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{plan.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export function LigneeSection() {
  return (
    <GlassCard>
      <div className="relative mx-auto max-w-xl py-4">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-border)] via-[var(--color-gold-muted)] to-[var(--color-gold)]" />

        {LIGNEE_TREE.map((gen, i) => (
          <motion.div
            key={gen.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative mb-10 last:mb-0"
          >
            {/* Dot */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2">
              <div className={cn(
                "h-4 w-4 rounded-full border-2",
                gen.current
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              )}
                style={gen.current ? { boxShadow: "0 0 16px oklch(0.75 0.12 85 / 0.5)" } : undefined}
              />
              <div className={cn("absolute top-1/2 h-px w-12", i % 2 === 0 ? "right-full" : "left-full")}
                style={{ backgroundColor: gen.current ? "var(--color-gold)" : "var(--color-border)" }}
              />
            </div>

            <div className={cn("w-[calc(50%-48px)]", i % 2 === 0 ? "mr-auto" : "ml-auto")}>
              <div className={cn(
                "rounded-xl border p-4",
                gen.current
                  ? "border-[var(--color-gold)] bg-[oklch(0.12_0.01_270/0.8)] shadow-[var(--shadow-gold)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]"
              )}>
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                    gen.current ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  )}>{gen.gen}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">{gen.years}</span>
                </div>
                <h4 className={cn("font-[family-name:var(--font-clash-display)] text-lg font-bold", gen.current ? "text-[var(--color-gold)]" : "text-[var(--color-text)]")}>
                  {gen.name}
                </h4>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">{gen.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

export function SOTAISection() {
  return (
    <div className="space-y-4">
      {/* Team */}
      <div className="grid grid-cols-4 gap-3">
        {SOTAI_TEAM.map((member, i) => (
          <GlassCard key={member.name} delay={i * 0.05} className="text-center hover:border-[var(--color-gold-muted)] transition-all">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${member.color}20` }}>
              <User className="h-6 w-6" style={{ color: member.color }} />
            </div>
            <h4 className="font-[family-name:var(--font-clash-display)] text-sm font-bold" style={{ color: member.color }}>
              {member.name}
            </h4>
            <p className="text-[10px] font-medium text-[var(--color-text-muted)]">{member.role}</p>
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{member.domain}</p>
          </GlassCard>
        ))}
      </div>

      {/* Services */}
      <GlassCard delay={0.1}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Services</h3>
        <div className="flex flex-wrap gap-2">
          {SOTAI_SERVICES.map((s) => (
            <span key={s} className="rounded-full bg-[var(--color-gold-glow)] px-3 py-1.5 text-xs font-medium text-[var(--color-gold)]">
              {s}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Pipeline */}
      <GlassCard delay={0.15}>
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Production Pipeline</h3>
        <div className="space-y-2">
          {SOTAI_PIPELINE.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[var(--color-text)]">{item.client}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">{item.type}</span>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
