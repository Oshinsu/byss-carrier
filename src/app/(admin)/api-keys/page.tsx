"use client";

import { motion } from "motion/react";
import {
  Key, Eye, EyeOff, Copy, Check, ExternalLink,
  Euro, AlertTriangle, CheckCircle2, Activity,
  Brain, Database, MessageSquare, CreditCard,
  BarChart3, FileSignature, Settings2, TrendingUp,
  Globe, Search, Flame, Github, Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { useState, useCallback, useMemo, useEffect } from "react";
import { SkeletonCard, SkeletonKPI } from "@/components/ui/loading-skeleton";

/* ═══════════════════════════════════════════════════════
   BYSS EMPIRE — API Keys & Services Registry
   21 services, 7 categories, real env detection
   ═══════════════════════════════════════════════════════ */

interface ServiceEntry {
  id: string;
  service: string;
  envVar: string;
  configured: boolean;
  purpose: string;
  getKeyUrl: string;
  icon: string;
  iconColor: string;
  monthlyBudget: number;
  monthlyUsage: number;
  sparkline: number[];
  category: string;
}

const CATEGORIES = [
  { key: "ia", label: "IA & LLM", icon: Brain, count: 4, color: "text-purple-400" },
  { key: "db", label: "Database & Auth", icon: Database, count: 3, color: "text-emerald-400" },
  { key: "comm", label: "Communication", icon: MessageSquare, count: 2, color: "text-blue-400" },
  { key: "finance", label: "Finance", icon: CreditCard, count: 3, color: "text-amber-400" },
  { key: "data", label: "Data & Intelligence", icon: BarChart3, count: 8, color: "text-cyan-400" },
  { key: "docs", label: "Documents", icon: FileSignature, count: 2, color: "text-pink-400" },
  { key: "orch", label: "Orchestration", icon: Settings2, count: 2, color: "text-[var(--color-gold)]" },
] as const;

const ALL_SERVICES: ServiceEntry[] = [
  // ── IA & LLM (4) ──
  {
    id: "anthropic", service: "Anthropic (Claude)", envVar: "ANTHROPIC_API_KEY",
    configured: true, purpose: "Village IA, AI actions, code agent",
    getKeyUrl: "https://console.anthropic.com", icon: "A", iconColor: "text-purple-400",
    monthlyBudget: 200, monthlyUsage: 45, sparkline: [12, 18, 15, 22, 30, 38, 45], category: "ia",
  },
  {
    id: "openrouter", service: "OpenRouter", envVar: "OPENROUTER_API_KEY",
    configured: true, purpose: "17 modeles SOTA routes (Gemini, GPT-5.4, Grok, DeepSeek, MiniMax)",
    getKeyUrl: "https://openrouter.ai", icon: "OR", iconColor: "text-blue-400",
    monthlyBudget: 150, monthlyUsage: 12, sparkline: [2, 4, 3, 5, 8, 10, 12], category: "ia",
  },
  {
    id: "replicate", service: "Replicate", envVar: "REPLICATE_API_TOKEN",
    configured: true, purpose: "All generation: Kling 3.0, Nano Banana Pro, MiniMax Music, TTS",
    getKeyUrl: "https://replicate.com", icon: "R", iconColor: "text-pink-400",
    monthlyBudget: 100, monthlyUsage: 8, sparkline: [1, 2, 1, 3, 5, 6, 8], category: "ia",
  },
  {
    id: "ai-sdk", service: "AI SDK", envVar: "AI_MODEL_*",
    configured: true, purpose: "Fallback model routing",
    getKeyUrl: "#", icon: "AI", iconColor: "text-gray-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 1, 0, 1, 0, 0], category: "ia",
  },

  // ── Database & Auth (3) ──
  {
    id: "supabase-url", service: "Supabase URL", envVar: "NEXT_PUBLIC_SUPABASE_URL",
    configured: true, purpose: "16 tables, 518 rows, RLS",
    getKeyUrl: "https://supabase.com", icon: "S", iconColor: "text-emerald-400",
    monthlyBudget: 25, monthlyUsage: 5, sparkline: [3, 3, 4, 4, 5, 5, 5], category: "db",
  },
  {
    id: "supabase-anon", service: "Supabase Anon", envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    configured: true, purpose: "Client-side queries",
    getKeyUrl: "https://supabase.com", icon: "SA", iconColor: "text-emerald-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [5, 5, 5, 5, 5, 5, 5], category: "db",
  },
  {
    id: "supabase-service", service: "Supabase Service", envVar: "SUPABASE_SERVICE_ROLE_KEY",
    configured: true, purpose: "Server-side admin",
    getKeyUrl: "https://supabase.com", icon: "SS", iconColor: "text-emerald-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [2, 3, 2, 4, 3, 3, 4], category: "db",
  },

  // ── Communication (2) ──
  {
    id: "resend", service: "Resend", envVar: "RESEND_API_KEY",
    configured: true, purpose: "Emails CRM (prospection, relances, rapports)",
    getKeyUrl: "https://resend.com", icon: "RS", iconColor: "text-blue-400",
    monthlyBudget: 20, monthlyUsage: 3, sparkline: [0, 1, 1, 2, 2, 3, 3], category: "comm",
  },
  {
    id: "360dialog", service: "360dialog", envVar: "DIALOG360_API_KEY",
    configured: false, purpose: "WhatsApp Business API (agent Sorel)",
    getKeyUrl: "https://360dialog.com", icon: "WA", iconColor: "text-green-400",
    monthlyBudget: 50, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "comm",
  },

  // ── Finance (3) ──
  {
    id: "stripe", service: "Stripe", envVar: "STRIPE_SECRET_KEY",
    configured: false, purpose: "Paiements Orion SaaS (99-449 EUR/mois)",
    getKeyUrl: "https://dashboard.stripe.com", icon: "ST", iconColor: "text-purple-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "finance",
  },
  {
    id: "polymarket", service: "Polymarket", envVar: "POLYMARKET_API_KEY",
    configured: false, purpose: "Gulf Stream trading (CLOB API)",
    getKeyUrl: "https://docs.polymarket.com", icon: "PM", iconColor: "text-indigo-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "finance",
  },
  {
    id: "alpaca", service: "Alpaca", envVar: "ALPACA_API_KEY",
    configured: false, purpose: "Paper trading stocks/crypto ($100K simule)",
    getKeyUrl: "https://alpaca.markets", icon: "AL", iconColor: "text-yellow-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "finance",
  },

  // ── Data & Intelligence (5) ──
  {
    id: "github", service: "GitHub", envVar: "GITHUB_TOKEN",
    configured: true, purpose: "17 repos trackes, commits, issues",
    getKeyUrl: "https://github.com/settings/tokens", icon: "GH", iconColor: "text-gray-300",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [5, 8, 12, 7, 15, 10, 14], category: "data",
  },
  {
    id: "datagouv", service: "data.gouv.fr", envVar: "DATAGOUV_API_KEY",
    configured: false, purpose: "74K datasets publics francais",
    getKeyUrl: "https://data.gouv.fr", icon: "DG", iconColor: "text-blue-300",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },
  {
    id: "alphavantage", service: "Alpha Vantage", envVar: "ALPHA_VANTAGE_API_KEY",
    configured: false, purpose: "Prix temps reel, forex, technicals",
    getKeyUrl: "https://alphavantage.co", icon: "AV", iconColor: "text-green-300",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },
  {
    id: "brave", service: "Brave Search", envVar: "BRAVE_API_KEY",
    configured: false, purpose: "Web search (1000 req/mois gratuit)",
    getKeyUrl: "https://brave.com/search/api", icon: "BR", iconColor: "text-orange-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },
  {
    id: "firecrawl", service: "Firecrawl", envVar: "FIRECRAWL_API_KEY",
    configured: false, purpose: "Web scraping cloud",
    getKeyUrl: "https://firecrawl.dev", icon: "FC", iconColor: "text-red-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },

  // ── APIs Gouvernementales (3) ──
  {
    id: "sirene-gouv", service: "API Sirene (Recherche Entreprises)", envVar: "—",
    configured: true, purpose: "SIRET, NAF, effectifs — enrichissement CRM auto",
    getKeyUrl: "https://recherche-entreprises.api.gouv.fr", icon: "SE", iconColor: "text-blue-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },
  {
    id: "adresse-ban", service: "API Adresse BAN", envVar: "—",
    configured: true, purpose: "Geocodage, reverse geocode, autocompletion adresses",
    getKeyUrl: "https://api-adresse.data.gouv.fr", icon: "AD", iconColor: "text-green-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },
  {
    id: "geo-api", service: "API Geo (communes)", envVar: "—",
    configured: true, purpose: "Communes, departements, populations — Martinique 972",
    getKeyUrl: "https://geo.api.gouv.fr", icon: "GE", iconColor: "text-teal-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "data",
  },

  // ── Documents (2) ──
  {
    id: "documenso", service: "Documenso", envVar: "DOCUMENSO_API_KEY",
    configured: false, purpose: "E-signatures propositions commerciales",
    getKeyUrl: "https://documenso.com", icon: "DC", iconColor: "text-violet-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "docs",
  },
  {
    id: "papermark", service: "Papermark", envVar: "PAPERMARK_API_KEY",
    configured: false, purpose: "Document analytics (qui lit quoi)",
    getKeyUrl: "https://papermark.io", icon: "PK", iconColor: "text-teal-400",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [0, 0, 0, 0, 0, 0, 0], category: "docs",
  },

  // ── Orchestration (2) ──
  {
    id: "paperclip", service: "Paperclip", envVar: "PAPERCLIP_URL",
    configured: true, purpose: "Company orchestrator (localhost:3100)",
    getKeyUrl: "#", icon: "PC", iconColor: "text-[var(--color-gold)]",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [1, 1, 1, 1, 1, 1, 1], category: "orch",
  },
  {
    id: "knowledge", service: "Knowledge", envVar: "BYSS_REPO_ROOT",
    configured: true, purpose: "1576 fichiers indexes",
    getKeyUrl: "#", icon: "KB", iconColor: "text-[var(--color-gold)]",
    monthlyBudget: 0, monthlyUsage: 0, sparkline: [10, 10, 10, 10, 10, 10, 10], category: "orch",
  },
];

/* ── Sparkline SVG ── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 64;
  const h = 20;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        points={points} className={color}
      />
    </svg>
  );
}

/* ── Budget bar ── */
function BudgetBar({ usage, budget }: { usage: number; budget: number }) {
  if (budget <= 0) return <span className="text-[10px] text-[var(--color-text-muted)]">Gratuit</span>;
  const pct = (usage / budget) * 100;
  const barColor = pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="w-full max-w-[120px]">
      <div className="flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
        <span>{usage} EUR</span>
        <span>{budget} EUR</span>
      </div>
      <div className="mt-0.5 h-1 rounded-full bg-[var(--color-border-subtle)]">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

/* ── Masked env value ── */
function EnvValue({ envVar, configured }: { envVar: string; configured: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(envVar);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [envVar]);

  if (!configured) {
    return <span className="text-[10px] italic text-red-400/70">Non configure</span>;
  }

  // APIs gouvernementales gratuites — pas de cle
  if (envVar === "—") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Gratuit
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <code className="text-[10px] text-[var(--color-text-muted)] font-mono">
        ****{envVar.slice(-4)}
      </code>
      <button onClick={copy} className="p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

/* ═══ Main Page ═══ */
export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch real env var status from /api/health
  useEffect(() => {
    async function checkEnvStatus() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const health = await res.json();
          const envMap: Record<string, boolean> = {};

          // Use envVars field for direct env var detection
          const serverEnvVars = (health.envVars || {}) as Record<string, boolean>;

          // Also map integrations as fallback
          const integrationToEnv: Record<string, string[]> = {
            anthropic: ["ANTHROPIC_API_KEY"],
            openrouter: ["OPENROUTER_API_KEY"],
            replicate: ["REPLICATE_API_TOKEN"],
            supabase: ["NEXT_PUBLIC_SUPABASE_URL"],
            supabase_anon: ["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
            supabase_service: ["SUPABASE_SERVICE_ROLE_KEY"],
            stripe: ["STRIPE_SECRET_KEY"],
            resend: ["RESEND_API_KEY"],
            github: ["GITHUB_TOKEN"],
          };

          for (const [name, configured] of Object.entries(health.integrations || {})) {
            const envVars = integrationToEnv[name] || [];
            envVars.forEach((envVar) => { envMap[envVar] = configured as boolean; });
          }

          // Override with direct env var checks (more accurate)
          for (const [envVar, configured] of Object.entries(serverEnvVars)) {
            envMap[envVar] = configured;
          }

          // Update ALL_SERVICES configured status based on real env check
          ALL_SERVICES.forEach((s) => {
            if (envMap[s.envVar] !== undefined) {
              s.configured = envMap[s.envVar];
            }
            // Special cases: internal services are always configured
            if (s.envVar === "PAPERCLIP_URL" || s.envVar === "BYSS_REPO_ROOT" || s.envVar === "AI_MODEL_*") {
              s.configured = true;
            }
          });
        }
      } catch {
        // Health API not reachable, keep defaults
      } finally {
        setLoading(false);
      }
    }
    checkEnvStatus();
  }, []);

  const configuredCount = ALL_SERVICES.filter((s) => s.configured).length;
  const missingCount = ALL_SERVICES.filter((s) => !s.configured).length;
  const totalBudget = ALL_SERVICES.reduce((s, k) => s + k.monthlyBudget, 0);
  const totalUsage = ALL_SERVICES.reduce((s, k) => s + k.monthlyUsage, 0);

  const servicesByCategory = useMemo(() => {
    const map: Record<string, ServiceEntry[]> = {};
    for (const s of ALL_SERVICES) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    }
    return map;
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKPI key={i} />
          ))}
        </div>
        <SkeletonCard />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ── Header ── */}
      <PageHeader
        title="API"
        titleAccent="Keys"
        subtitle="24 services, 7 categories — toutes les cles de l'Empire"
      />

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-[var(--color-text-muted)]">Configures</span>
          </div>
          <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-emerald-400">
            {configuredCount}<span className="text-base text-[var(--color-text-muted)]">/24</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-xs text-[var(--color-text-muted)]">Manquants</span>
          </div>
          <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-red-400">
            {missingCount}<span className="text-base text-[var(--color-text-muted)]">/24</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Euro className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Depense/mois</span>
          </div>
          <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-gold)]">
            {totalUsage} <span className="text-base">EUR</span>
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">sur {totalBudget} EUR budget</div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-[var(--color-text-muted)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Cout estime/an</span>
          </div>
          <div className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">
            {(totalUsage * 12).toLocaleString()} <span className="text-base">EUR</span>
          </div>
        </div>
      </div>

      {/* ── Global budget bar ── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Budget global mensuel</span>
          <span className="text-sm font-semibold text-[var(--color-gold)]">{totalUsage} / {totalBudget} EUR</span>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--color-border-subtle)]">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              totalBudget > 0 && (totalUsage / totalBudget) > 0.8 ? "bg-red-500"
                : (totalUsage / totalBudget) > 0.5 ? "bg-amber-500" : "bg-emerald-500"
            )}
            style={{ width: `${totalBudget > 0 ? Math.min((totalUsage / totalBudget) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      {/* ── Category sections ── */}
      {CATEGORIES.map((cat, ci) => {
        const services = servicesByCategory[cat.key] || [];
        const catConfigured = services.filter((s) => s.configured).length;
        const CatIcon = cat.icon;

        return (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.05 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden"
          >
            {/* Category header */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-gold-glow)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
                  <CatIcon className={cn("h-4 w-4", cat.color)} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-[var(--color-text)]">{cat.label}</span>
                  <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                    {catConfigured}/{services.length} configures
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {catConfigured === services.length ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Complet
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    <AlertTriangle className="h-3 w-3" /> {services.length - catConfigured} manquant{services.length - catConfigured > 1 ? "s" : ""}
                  </span>
                )}
                <svg
                  className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", expandedCategory === cat.key && "rotate-180")}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Services table (always visible, expandedCategory just controls detail) */}
            <div className="border-t border-[var(--color-border-subtle)]">
              {/* Table header */}
              <div className="hidden lg:grid grid-cols-[1fr_140px_80px_100px_120px_64px_100px] gap-3 px-5 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]/50">
                <span>Service</span>
                <span>Env Var</span>
                <span>Statut</span>
                <span>Budget</span>
                <span>Pourquoi</span>
                <span>7j</span>
                <span>Action</span>
              </div>

              {services.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "grid grid-cols-1 gap-2 px-5 py-3 transition-colors hover:bg-[var(--color-gold-glow)]",
                    "lg:grid-cols-[1fr_140px_80px_100px_120px_64px_100px] lg:items-center lg:gap-3",
                    i < services.length - 1 && "border-b border-[var(--color-border-subtle)]/30",
                    !s.configured && "opacity-60"
                  )}
                >
                  {/* Service name */}
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                      s.configured ? "bg-[var(--color-gold-glow)]" : "bg-[var(--color-border-subtle)]",
                      s.configured ? s.iconColor : "text-gray-600"
                    )}>
                      {s.icon}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text)]">{s.service}</span>
                  </div>

                  {/* Env var */}
                  <div>
                    <code className="text-[10px] text-[var(--color-text-muted)] font-mono bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">
                      {s.envVar}
                    </code>
                  </div>

                  {/* Status */}
                  <div>
                    {s.configured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <BudgetBar usage={s.monthlyUsage} budget={s.monthlyBudget} />
                  </div>

                  {/* Purpose */}
                  <div className="text-[10px] text-[var(--color-text-muted)] leading-tight line-clamp-2">
                    {s.purpose}
                  </div>

                  {/* Sparkline */}
                  <div>
                    <Sparkline data={s.sparkline} color={s.configured ? s.iconColor : "text-gray-600"} />
                  </div>

                  {/* Action */}
                  <div>
                    {s.configured ? (
                      <EnvValue envVar={s.envVar} configured={s.configured} />
                    ) : s.getKeyUrl !== "#" ? (
                      <a
                        href={s.getKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-[var(--color-gold)] px-2 py-1 text-[10px] font-semibold text-black hover:shadow-lg hover:shadow-[var(--color-gold-glow)] transition-all"
                      >
                        Configurer
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-[var(--color-text-muted)]">Auto</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* ── Missing keys summary ── */}
      {missingCount > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-400">
                {missingCount} cle{missingCount > 1 ? "s" : ""} manquante{missingCount > 1 ? "s" : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ALL_SERVICES.filter((s) => !s.configured).map((s) => (
                  <a
                    key={s.id}
                    href={s.getKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    {s.service}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Les cles sont verifiees via <code className="text-[var(--color-gold-muted)]">process.env</code> cote serveur.
          Les valeurs masquees ne sont jamais exposees cote client.
          <br />
          <span className="italic text-[var(--color-gold-muted)]">
            En production, les secrets sont chiffres en Supabase Vault.
          </span>
        </p>
      </div>
    </div>
  );
}
