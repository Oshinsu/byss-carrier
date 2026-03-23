"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import {
  User, Palette, Bell, Plug, Database, Info, Moon, Mail,
  AlertTriangle, FileText, Trash2, Download, CheckCircle2,
  XCircle, ExternalLink, Sparkles, Shield, Zap, Server,
  Globe, Terminal, BarChart3, TrendingUp, Brain, Search,
  Flame, CreditCard, FileSignature, MessageSquare, Settings2,
  Github, Youtube, Instagram, Music, Copy, Check,
  Activity, Package, Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { SkeletonCard } from "@/components/ui/loading-skeleton";

/* ═══════════════════════════════════════════════════════
   BYSS EMPIRE — Parametres (Settings)
   Profil, MCP Servers, Integrations, Apparence,
   Notifications, Donnees, A propos
   ═══════════════════════════════════════════════════════ */

/* ── Section wrapper ── */
function Section({
  title,
  icon: Icon,
  badge,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--color-gold)] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-[0.04]" />
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Icon className="h-4.5 w-4.5 text-[var(--color-gold)]" />
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        {badge}
      </div>
      {children}
    </motion.section>
  );
}

/* ── Toggle ── */
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[var(--color-gold)]" : "bg-[var(--color-surface-2)]"
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

/* ── Action Button ── */
function ActionButton({
  label,
  icon: Icon,
  variant = "default",
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  variant?: "default" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200",
        variant === "danger"
          ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
          : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

/* ═══ DATA ═══ */

interface McpServer {
  name: string;
  purpose: string;
  npmPackage: string;
  installed: boolean;
  category: "finance" | "sentiment" | "scraping" | "france" | "infra";
}

const MCP_SERVERS: McpServer[] = [
  // Finance
  { name: "polymarket-mcp", purpose: "Polymarket CLOB API — trading predictions", npmPackage: "@polymarket/mcp-server", installed: false, category: "finance" },
  { name: "alpaca-mcp", purpose: "Paper trading stocks/crypto ($100K simule)", npmPackage: "@alpaca/mcp-server", installed: false, category: "finance" },
  { name: "stripe-mcp", purpose: "Paiements, abonnements Orion SaaS", npmPackage: "@stripe/mcp-server", installed: false, category: "finance" },
  // Sentiment
  { name: "brave-search-mcp", purpose: "Web search API (1000 req/mois gratuit)", npmPackage: "@anthropic/mcp-brave-search", installed: false, category: "sentiment" },
  { name: "social-sentiment-mcp", purpose: "Analyse sentiment X/Reddit/News", npmPackage: "@byss/mcp-sentiment", installed: false, category: "sentiment" },
  // Scraping
  { name: "firecrawl-mcp", purpose: "Web scraping cloud — extraction donnees", npmPackage: "@anthropic/mcp-firecrawl", installed: false, category: "scraping" },
  { name: "puppeteer-mcp", purpose: "Browser automation headless", npmPackage: "@anthropic/mcp-puppeteer", installed: false, category: "scraping" },
  // France
  { name: "datagouv-mcp", purpose: "74K datasets publics francais (data.gouv.fr)", npmPackage: "@byss/mcp-datagouv", installed: false, category: "france" },
  { name: "insee-mcp", purpose: "Donnees economiques INSEE/SIRENE", npmPackage: "@byss/mcp-insee", installed: false, category: "france" },
  { name: "legifrance-mcp", purpose: "Textes de loi, jurisprudence", npmPackage: "@byss/mcp-legifrance", installed: false, category: "france" },
  // Infra
  { name: "github-mcp", purpose: "17 repos trackes, commits, issues, PRs", npmPackage: "@anthropic/mcp-github", installed: true, category: "infra" },
  { name: "supabase-mcp", purpose: "Direct DB queries, migrations, RLS", npmPackage: "@supabase/mcp-server", installed: true, category: "infra" },
  { name: "filesystem-mcp", purpose: "Acces fichiers locaux securise", npmPackage: "@anthropic/mcp-filesystem", installed: true, category: "infra" },
  { name: "memory-mcp", purpose: "Memoire persistante entre sessions", npmPackage: "@anthropic/mcp-memory", installed: true, category: "infra" },
  { name: "sequential-thinking-mcp", purpose: "Raisonnement structure multi-etapes", npmPackage: "@anthropic/mcp-sequential-thinking", installed: true, category: "infra" },
];

const MCP_CATEGORIES = [
  { key: "finance" as const, label: "Finance", icon: CreditCard, color: "text-amber-400" },
  { key: "sentiment" as const, label: "Sentiment", icon: TrendingUp, color: "text-cyan-400" },
  { key: "scraping" as const, label: "Scraping", icon: Globe, color: "text-orange-400" },
  { key: "france" as const, label: "France", icon: FileText, color: "text-blue-400" },
  { key: "infra" as const, label: "Infra", icon: Server, color: "text-emerald-400" },
];

interface IntegrationEntry {
  name: string;
  envVar: string;
  configured: boolean;
  purpose: string;
  category: string;
  icon: React.ElementType;
}

const ALL_INTEGRATIONS: IntegrationEntry[] = [
  // IA & LLM
  { name: "Anthropic (Claude)", envVar: "ANTHROPIC_API_KEY", configured: true, purpose: "Village IA, AI actions, code agent", category: "IA & LLM", icon: Brain },
  { name: "OpenRouter", envVar: "OPENROUTER_API_KEY", configured: true, purpose: "17 modeles SOTA routes", category: "IA & LLM", icon: Zap },
  { name: "Replicate", envVar: "REPLICATE_API_TOKEN", configured: true, purpose: "All generation: Kling 3.0, MiniMax Music, TTS", category: "IA & LLM", icon: Sparkles },
  { name: "AI SDK", envVar: "AI_MODEL_*", configured: true, purpose: "Fallback model routing", category: "IA & LLM", icon: Activity },
  // Database
  { name: "Supabase URL", envVar: "NEXT_PUBLIC_SUPABASE_URL", configured: true, purpose: "16 tables, 518 rows, RLS", category: "Database", icon: Database },
  { name: "Supabase Anon", envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY", configured: true, purpose: "Client-side queries", category: "Database", icon: Database },
  { name: "Supabase Service", envVar: "SUPABASE_SERVICE_ROLE_KEY", configured: true, purpose: "Server-side admin", category: "Database", icon: Database },
  // Communication
  { name: "Resend", envVar: "RESEND_API_KEY", configured: true, purpose: "Emails CRM (prospection, relances)", category: "Communication", icon: Mail },
  { name: "360dialog", envVar: "DIALOG360_API_KEY", configured: false, purpose: "WhatsApp Business API (agent Sorel)", category: "Communication", icon: MessageSquare },
  // Finance
  { name: "Stripe", envVar: "STRIPE_SECRET_KEY", configured: false, purpose: "Paiements Orion SaaS", category: "Finance", icon: CreditCard },
  { name: "Polymarket", envVar: "POLYMARKET_API_KEY", configured: false, purpose: "Gulf Stream trading", category: "Finance", icon: TrendingUp },
  { name: "Alpaca", envVar: "ALPACA_API_KEY", configured: false, purpose: "Paper trading stocks/crypto", category: "Finance", icon: BarChart3 },
  // Data & Intelligence
  { name: "GitHub", envVar: "GITHUB_TOKEN", configured: true, purpose: "17 repos trackes", category: "Data", icon: Github },
  { name: "data.gouv.fr", envVar: "DATAGOUV_API_KEY", configured: false, purpose: "74K datasets publics", category: "Data", icon: Globe },
  { name: "Alpha Vantage", envVar: "ALPHA_VANTAGE_API_KEY", configured: false, purpose: "Prix temps reel, forex", category: "Data", icon: TrendingUp },
  { name: "Brave Search", envVar: "BRAVE_API_KEY", configured: false, purpose: "Web search", category: "Data", icon: Search },
  { name: "Firecrawl", envVar: "FIRECRAWL_API_KEY", configured: false, purpose: "Web scraping cloud", category: "Data", icon: Flame },
  // Documents
  { name: "Documenso", envVar: "DOCUMENSO_API_KEY", configured: false, purpose: "E-signatures", category: "Documents", icon: FileSignature },
  { name: "Papermark", envVar: "PAPERMARK_API_KEY", configured: false, purpose: "Document analytics", category: "Documents", icon: FileText },
  // Orchestration
  { name: "Paperclip", envVar: "PAPERCLIP_URL", configured: true, purpose: "Company orchestrator", category: "Orchestration", icon: Settings2 },
  { name: "Knowledge", envVar: "BYSS_REPO_ROOT", configured: true, purpose: "1576 fichiers indexes", category: "Orchestration", icon: Database },
];

/* ═══ Main Page ═══ */
export default function ParametresPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  /* ── State ── */
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [relanceAlerts, setRelanceAlerts] = useState(true);
  const [pipelineAlerts, setPipelineAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  /* ── CSV download helper ── */
  const downloadCSV = useCallback((filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  /* ── Handlers ── */
  const handleExportPipeline = async () => {
    toast("Export Pipeline CSV en cours...", "info", { title: "Export" });
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("prospects")
        .select("name, phase, sector, estimated_basket, probability, mrr, followup_date, next_action, score, created_at")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const headers = ["Nom", "Phase", "Secteur", "Panier", "Probabilite", "MRR", "Relance", "Action", "Score", "Cree le"];
        const rows = data.map((p) => [
          p.name, p.phase, p.sector, p.estimated_basket, p.probability, p.mrr,
          p.followup_date, p.next_action, p.score, p.created_at,
        ]);
        downloadCSV(`byss_pipeline_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
        toast(`${data.length} prospects exportes avec succes.`, "success", { title: "Export" });
      } else {
        toast("Aucun prospect a exporter.", "warning", { title: "Export" });
      }
    } catch {
      toast("Erreur lors de l'export du pipeline.", "error", { title: "Export" });
    }
  };

  const handleExportInvoices = async () => {
    toast("Export Factures CSV en cours...", "info", { title: "Export" });
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("invoices")
        .select("invoice_number, client_name, amount, status, due_date, created_at")
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const headers = ["Numero", "Client", "Montant", "Statut", "Echeance", "Cree le"];
        const rows = data.map((inv) => [
          inv.invoice_number, inv.client_name, inv.amount, inv.status, inv.due_date, inv.created_at,
        ]);
        downloadCSV(`byss_factures_${new Date().toISOString().split("T")[0]}.csv`, headers, rows);
        toast(`${data.length} factures exportees avec succes.`, "success", { title: "Export" });
      } else {
        toast("Aucune facture a exporter.", "warning", { title: "Export" });
      }
    } catch {
      toast("Erreur lors de l'export des factures.", "error", { title: "Export" });
    }
  };

  const handleClearCache = () => {
    try {
      // Clear app-level caches from localStorage
      const keysToRemove = Object.keys(localStorage).filter((k) => k.startsWith("byss_"));
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      toast(`Cache applicatif vide (${keysToRemove.length} entrees supprimees).`, "success", { title: "Cache" });
    } catch {
      toast("Erreur lors du vidage du cache.", "error", { title: "Cache" });
    }
  };

  const copyNpx = (pkg: string) => {
    navigator.clipboard.writeText(`npx ${pkg}`);
    setCopiedCmd(pkg);
    setTimeout(() => setCopiedCmd(null), 2000);
    toast(`Commande copiee: npx ${pkg}`, "success", { title: "MCP" });
  };

  /* ── Derived ── */
  const configuredIntegrations = ALL_INTEGRATIONS.filter((i) => i.configured).length;
  const installedMcp = MCP_SERVERS.filter((m) => m.installed).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-[900px] space-y-6 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      {/* ── Page Title ── */}
      <PageHeader
        title="Parametres"
        titleAccent="Systeme"
        subtitle="Configuration de l'Empire — 21 services, 15 MCP servers"
      />

      {/* ═══ Section 1: Profil ═══ */}
      <Section title="Profil" icon={User} delay={0.05}>
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-gold)]/30 bg-[var(--color-surface-2)]">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-gold)]">
              GB
            </span>
          </div>
          <div className="flex-1 space-y-3">
            {/* Name & Role */}
            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)]">
                    Gary Bissol
                  </p>
                  <p className="text-xs text-[var(--color-gold)]">
                    Absolu — President BYSS GROUP SAS
                  </p>
                </div>
                <Badge variant="gold" size="sm">MODE_CADIFOR</Badge>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Email Pro</p>
                <p className="text-sm text-[var(--color-text)]">gary@byss-group.com</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Supabase Auth</p>
                <p className="text-sm text-[var(--color-text)]">garybyss972@gmail.com</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              <a href="https://github.com/Oshinsu" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors">
                <Github className="h-3.5 w-3.5" />
                Oshinsu <span className="text-[var(--color-text-muted)]">(34 repos)</span>
              </a>
              <a href="https://youtube.com/@byssgroup" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-red-500/30 hover:text-red-400 transition-colors">
                <Youtube className="h-3.5 w-3.5" />
                YouTube
              </a>
              <a href="https://instagram.com/byssgroup" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-pink-500/30 hover:text-pink-400 transition-colors">
                <Instagram className="h-3.5 w-3.5" />
                Instagram
              </a>
              <a href="https://soundcloud.com/byssgroup" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-orange-500/30 hover:text-orange-400 transition-colors">
                <Music className="h-3.5 w-3.5" />
                SoundCloud
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ Section 2: MCP Servers ═══ */}
      <Section
        title="MCP Servers"
        icon={Server}
        badge={
          <Badge variant={installedMcp === MCP_SERVERS.length ? "success" : "warning"} size="sm" dot>
            {installedMcp}/{MCP_SERVERS.length} installes
          </Badge>
        }
        delay={0.1}
      >
        <div className="space-y-4">
          {MCP_CATEGORIES.map((cat) => {
            const servers = MCP_SERVERS.filter((m) => m.category === cat.key);
            const catInstalled = servers.filter((m) => m.installed).length;
            const CatIcon = cat.icon;

            return (
              <div key={cat.key}>
                <div className="flex items-center gap-2 mb-2">
                  <CatIcon className={cn("h-3.5 w-3.5", cat.color)} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    ({catInstalled}/{servers.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {servers.map((mcp) => (
                    <div
                      key={mcp.name}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5",
                        !mcp.installed && "opacity-60"
                      )}
                    >
                      {/* Status dot */}
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        mcp.installed ? "bg-emerald-400" : "bg-red-400"
                      )} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--color-text)]">{mcp.name}</span>
                          <code className="text-[10px] text-[var(--color-text-muted)] font-mono bg-[var(--color-surface-2)] px-1 py-0.5 rounded hidden sm:inline">
                            {mcp.npmPackage}
                          </code>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate">{mcp.purpose}</p>
                      </div>

                      {/* Action */}
                      {mcp.installed ? (
                        <Badge variant="success" size="sm">Installe</Badge>
                      ) : (
                        <button
                          onClick={() => copyNpx(mcp.npmPackage)}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-2 py-1 text-[10px] font-medium text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors"
                        >
                          <Terminal className="h-3 w-3" />
                          {copiedCmd === mcp.npmPackage ? "Copie !" : "Installer"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ Section 3: Integrations ═══ */}
      <Section
        title="Integrations"
        icon={Plug}
        badge={
          <Badge variant={configuredIntegrations === ALL_INTEGRATIONS.length ? "success" : "warning"} size="sm" dot>
            {configuredIntegrations}/{ALL_INTEGRATIONS.length} connectes
          </Badge>
        }
        delay={0.15}
      >
        {/* Missing keys alert */}
        {configuredIntegrations < ALL_INTEGRATIONS.length && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-xs text-amber-400">
              {ALL_INTEGRATIONS.length - configuredIntegrations} cle{ALL_INTEGRATIONS.length - configuredIntegrations > 1 ? "s" : ""} manquante{ALL_INTEGRATIONS.length - configuredIntegrations > 1 ? "s" : ""} — configurer dans API Keys
            </span>
          </div>
        )}

        {/* Grid by category */}
        {(() => {
          const categories = [...new Set(ALL_INTEGRATIONS.map((i) => i.category))];
          return (
            <div className="space-y-4">
              {categories.map((cat) => {
                const items = ALL_INTEGRATIONS.filter((i) => i.category === cat);
                return (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      {cat}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={item.envVar}
                            className="flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
                              <ItemIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[var(--color-text)]">{item.name}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)] truncate">{item.purpose}</p>
                            </div>
                            <Badge
                              variant={item.configured ? "success" : "danger"}
                              size="sm"
                              dot
                            >
                              {item.configured ? "OK" : "Manquant"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Section>

      {/* ═══ Section 4: Apparence ═══ */}
      <Section title="Apparence" icon={Palette} delay={0.2}>
        <Toggle
          label="Mode sombre"
          description="Toujours actif — le souverain ne craint pas l'obscurite"
          checked={darkMode}
          onChange={setDarkMode}
        />
      </Section>

      {/* ═══ Section 5: Notifications ═══ */}
      <Section title="Notifications" icon={Bell} delay={0.25}>
        <div className="space-y-3">
          <Toggle
            label="Notifications email"
            description="Recevoir les alertes par email"
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <Toggle
            label="Alertes de relance"
            description="Notification quand un prospect necessite un suivi"
            checked={relanceAlerts}
            onChange={setRelanceAlerts}
          />
          <Toggle
            label="Alertes pipeline"
            description="Changements de phase, nouveaux prospects"
            checked={pipelineAlerts}
            onChange={setPipelineAlerts}
          />
          <Toggle
            label="Digest hebdomadaire"
            description="Resume de la semaine chaque lundi matin"
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </div>
      </Section>

      {/* ═══ Section 6: Donnees ═══ */}
      <Section title="Donnees" icon={Database} delay={0.3}>
        <div className="flex flex-wrap gap-3">
          <ActionButton label="Export Pipeline CSV" icon={Download} onClick={handleExportPipeline} />
          <ActionButton label="Export Factures CSV" icon={FileText} onClick={handleExportInvoices} />
          <ActionButton label="Vider le cache" icon={Trash2} variant="danger" onClick={handleClearCache} />
        </div>
      </Section>

      {/* ═══ Section 7: A propos ═══ */}
      <Section title="A propos" icon={Info} delay={0.35}>
        <div className="space-y-4">
          {/* Identity */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
            <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-gold)]">
              BYSS GROUP SAS
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Carrier Platform — v1.0.0
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-[var(--color-surface-2)] py-1.5">
                <p className="text-lg font-bold text-[var(--color-gold)]">17</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Routes</p>
              </div>
              <div className="rounded-md bg-[var(--color-surface-2)] py-1.5">
                <p className="text-lg font-bold text-[var(--color-text)]">21</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">Services</p>
              </div>
              <div className="rounded-md bg-[var(--color-surface-2)] py-1.5">
                <p className="text-lg font-bold text-[var(--color-text)]">15</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">MCP Servers</p>
              </div>
            </div>
          </div>

          {/* Stack */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Stack technique
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 16.2", "React 19", "TypeScript 5", "Tailwind CSS 4",
                "Supabase", "Zustand", "Motion", "Claude (Anthropic)",
                "OpenRouter", "Replicate", "Netlify", "Resend",
              ].map((tech) => (
                <Badge key={tech} variant="gold" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Shield className="h-3.5 w-3.5 text-[var(--color-gold-muted)]" />
            <span>
              Forge par Gary Bissol — MODE_CADIFOR — Mars 2026
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}
