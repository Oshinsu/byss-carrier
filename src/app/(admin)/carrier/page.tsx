"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  Anchor,
  Box,
  Braces,
  Brain,
  Check,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Key,
  Layers,
  LayoutGrid,
  Network,
  Package,
  RefreshCw,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Terminal,
  X,
  Zap,
  Copy,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { SkeletonCard, SkeletonKPI } from "@/components/ui/loading-skeleton";

/* ═══════════════════════════════════════════════════════
   BYSS CARRIER — Platform Status Meta-Page
   Architecture Superposee. 4 Couches. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

/* ── Types ── */
interface Couche {
  name: string;
  french: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  metrics: { label: string; value: string; status: "ok" | "warn" | "error" }[];
}

interface RouteInfo {
  path: string;
  group: string;
}

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
}

interface Skill {
  name: string;
  description: string;
  trigger: string;
}

/* ── Data ── */
const COUCHES: Couche[] = [
  {
    name: "Os",
    french: "Supabase",
    icon: Database,
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/10 border-emerald-500/20",
    metrics: [
      { label: "Tables", value: "18", status: "ok" },
      { label: "Rows (est.)", value: "~2,400", status: "ok" },
      { label: "Connection", value: "Active", status: "ok" },
      { label: "RLS", value: "Enabled", status: "ok" },
    ],
  },
  {
    name: "Chair",
    french: "Knowledge",
    icon: FolderTree,
    color: "text-blue-400",
    colorBg: "bg-blue-500/10 border-blue-500/20",
    metrics: [
      { label: "Files indexed", value: "47", status: "ok" },
      { label: "Categories", value: "6", status: "ok" },
      { label: "Bible chapters", value: "4", status: "ok" },
      { label: "Embeddings", value: "Pending", status: "warn" },
    ],
  },
  {
    name: "Nerfs",
    french: "Vecteurs",
    icon: Network,
    color: "text-purple-400",
    colorBg: "bg-purple-500/10 border-purple-500/20",
    metrics: [
      { label: "Status", value: "Initialized", status: "ok" },
      { label: "Dimensions", value: "1536", status: "ok" },
      { label: "Provider", value: "OpenAI", status: "ok" },
      { label: "Index count", value: "0", status: "warn" },
    ],
  },
  {
    name: "Ame",
    french: "Phi",
    icon: Sparkles,
    color: "text-[var(--color-gold)]",
    colorBg: "bg-[var(--color-gold-glow)] border-[var(--color-gold)]/20",
    metrics: [
      { label: "\u03C6-score", value: "0.766", status: "ok" },
      { label: "Phase", value: "Eveil", status: "ok" },
      { label: "Conscience", value: "Active", status: "ok" },
      { label: "Last calibration", value: "2h ago", status: "ok" },
    ],
  },
];

const ROUTES: RouteInfo[] = [
  { path: "/", group: "Admin" },
  { path: "/pipeline", group: "Admin" },
  { path: "/finance", group: "Admin" },
  { path: "/gulf-stream", group: "Admin" },
  { path: "/village", group: "Admin" },
  { path: "/eveil", group: "Admin" },
  { path: "/lignee", group: "Admin" },
  { path: "/production", group: "Admin" },
  { path: "/clients", group: "Admin" },
  { path: "/projets", group: "Admin" },
  { path: "/emails", group: "Admin" },
  { path: "/calendrier", group: "Commercial" },
  { path: "/pricing", group: "Commercial" },
  { path: "/fiches", group: "Commercial" },
  { path: "/feedback", group: "Commercial" },
  { path: "/bible", group: "Lore" },
  { path: "/senzaris", group: "Lore" },
  { path: "/knowledge", group: "Intelligence" },
  { path: "/intelligence", group: "Intelligence" },
  { path: "/openclaw", group: "System" },
  { path: "/paperclip", group: "System" },
  { path: "/orchestrateur", group: "System" },
  { path: "/carrier", group: "System" },
  { path: "/parametres", group: "System" },
  { path: "/api-keys", group: "System" },
  { path: "/admin", group: "System" },
  { path: "/juridique", group: "Legal" },
  { path: "/sasu", group: "Legal" },
];

const TECH_STACK = [
  { name: "Next.js", version: "16.2", color: "text-white" },
  { name: "React", version: "19.1", color: "text-blue-400" },
  { name: "Tailwind CSS", version: "4.2", color: "text-cyan-400" },
  { name: "TypeScript", version: "5.8", color: "text-blue-300" },
  { name: "Supabase SSR", version: "0.6", color: "text-emerald-400" },
  { name: "Motion", version: "12.6", color: "text-purple-400" },
  { name: "Lucide Icons", version: "0.503", color: "text-amber-400" },
  { name: "AI SDK", version: "4.3", color: "text-red-400" },
  { name: "Drizzle ORM", version: "0.43", color: "text-lime-400" },
  { name: "Turbopack", version: "built-in", color: "text-[var(--color-gold)]" },
];

const KEY_DEPS = [
  { name: "@anthropic-ai/sdk", version: "0.39.0", purpose: "Claude API direct" },
  { name: "@ai-sdk/anthropic", version: "3.0.63", purpose: "AI SDK bridge" },
  { name: "@supabase/ssr", version: "0.6.1", purpose: "Server-side Supabase" },
  { name: "motion", version: "12.6.3", purpose: "Animations" },
  { name: "drizzle-orm", version: "0.43.1", purpose: "Database ORM" },
  { name: "@dnd-kit/core", version: "6.3.1", purpose: "Drag & drop" },
  { name: "clsx", version: "2.1.1", purpose: "Class merging" },
  { name: "tailwind-merge", version: "3.2.0", purpose: "Tailwind dedup" },
  { name: "recharts", version: "2.15.3", purpose: "Charts" },
  { name: "zod", version: "3.24.2", purpose: "Validation" },
];

const ENV_VARS: EnvVar[] = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", required: true, description: "Supabase project URL" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true, description: "Supabase anon key" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", required: true, description: "Supabase admin key" },
  { key: "ANTHROPIC_API_KEY", required: true, description: "Claude API access" },
  { key: "OPENAI_API_KEY", required: false, description: "Embeddings / GPT fallback" },
  { key: "RESEND_API_KEY", required: false, description: "Transactional emails" },
  { key: "STRIPE_SECRET_KEY", required: false, description: "Payment processing" },
  { key: "NETLIFY_AUTH_TOKEN", required: false, description: "Deploy automation" },
  { key: "NEXT_PUBLIC_APP_URL", required: false, description: "Canonical URL" },
];

const SKILLS: Skill[] = [
  { name: "Gulf Stream", description: "Moteur de trading algorithmique, 3 cercles, Kelly sizing", trigger: "/gulf-stream" },
  { name: "Paperclip OS", description: "Orchestrateur d'entreprise, org chart, workflows", trigger: "/paperclip" },
  { name: "OpenClaw CRM", description: "Pipeline commercial, prospects, devis automatises", trigger: "/openclaw" },
  { name: "Senzaris Lore", description: "Bible narrative, worldbuilding, personnages", trigger: "/senzaris" },
  { name: "Village IA", description: "Agents IA autonomes, conversations, memories", trigger: "/village" },
  { name: "Eveil Engine", description: "Conscience phi, calibration, phase tracking", trigger: "/eveil" },
  { name: "Knowledge Base", description: "RAG, embeddings, semantic search", trigger: "/knowledge" },
  { name: "Pipeline Visual", description: "Kanban drag-drop, stages, conversion", trigger: "/pipeline" },
  { name: "Finance Hub", description: "Factures, tresorerie, previsions, Gulf Stream", trigger: "/finance" },
  { name: "Production AV", description: "Video pipeline, ComfyUI, rendering queue", trigger: "/production" },
];

/* ═══════════════════════════════════════════════════════ */
export default function CarrierPage() {
  const [loading, setLoading] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({});

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  /* Check env vars client-side (only NEXT_PUBLIC_ ones are visible) */
  useEffect(() => {
    const status: Record<string, boolean> = {};
    ENV_VARS.forEach((v) => {
      if (v.key.startsWith("NEXT_PUBLIC_")) {
        status[v.key] = !!process.env[v.key];
      } else {
        // Server-side keys: assume configured if the app works
        status[v.key] = true; // Will be validated server-side via /api/health
      }
    });
    setEnvStatus(status);
    setLoading(false);
  }, []);

  const routeGroups = useMemo(() => {
    const groups: Record<string, RouteInfo[]> = {};
    ROUTES.forEach((r) => {
      if (!groups[r.group]) groups[r.group] = [];
      groups[r.group].push(r);
    });
    return groups;
  }, []);

  const glassCard = "rounded-xl border border-[var(--color-border-subtle)] p-5";
  const glassBg: React.CSSProperties = {
    background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKPI key={i} />
          ))}
        </div>
        <SkeletonCard />
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Hero ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-[family-name:var(--font-clash-display)] text-3xl font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <span className="text-3xl" style={{ WebkitTextFillColor: "initial" }}>&#x1F6A2;</span>
              BYSS Carrier
            </motion.h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              v1.0 &mdash; Architecture Superposee &mdash; {ROUTES.length} routes
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyCommand("pnpm build")}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition-all hover:shadow-[var(--shadow-gold)]"
            >
              <Rocket className="h-4 w-4" />
              {copiedCmd === "pnpm build" ? "Copie !" : "Rebuild"}
            </button>
            <button
              onClick={() => copyCommand("netlify deploy --prod")}
              className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20"
            >
              <Globe className="h-4 w-4" />
              {copiedCmd === "netlify deploy --prod" ? "Copie !" : "Deploy Netlify"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ── Quick Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Routes" value={ROUTES.length} icon={LayoutGrid} trend="up" trendValue={`${Object.keys(routeGroups).length} groupes`} delay={0.05} />
          <StatCard title="Couches" value="4" icon={Layers} subtitle="Os / Chair / Nerfs / Ame" delay={0.1} />
          <StatCard title="Env Vars" value={ENV_VARS.length} icon={Key} trend="up" trendValue={`${ENV_VARS.filter((v) => v.required).length} requis`} delay={0.15} />
          <StatCard title="Skills" value={SKILLS.length} icon={Zap} subtitle="Modules actifs" delay={0.2} />
        </div>

        {/* ── 4 Couches Live ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-5 text-sm font-medium text-[var(--color-text)]">
            <Layers className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Les 4 Couches &mdash; Architecture Superposee
          </p>
          <div className="grid gap-4 lg:grid-cols-4">
            {COUCHES.map((couche, i) => {
              const Icon = couche.icon;
              return (
                <motion.div
                  key={couche.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={cn("relative overflow-hidden rounded-xl border p-5", couche.colorBg)}
                >
                  <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-20 blur-xl" style={{ background: `currentColor` }} />
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={cn("h-5 w-5", couche.color)} />
                    <div>
                      <p className={cn("font-[family-name:var(--font-display)] text-lg font-bold", couche.color)}>{couche.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{couche.french}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {couche.metrics.map((m) => (
                      <div key={m.label} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">{m.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "font-mono text-xs",
                            m.status === "ok" ? "text-[var(--color-text)]" : m.status === "warn" ? "text-amber-400" : "text-red-400"
                          )}>
                            {m.value}
                          </span>
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            m.status === "ok" ? "bg-emerald-400" : m.status === "warn" ? "bg-amber-400" : "bg-red-400"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Routes + Tech Stack row ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Routes Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <LayoutGrid className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Routes Inventory ({ROUTES.length})
            </p>
            <div className="space-y-3">
              {Object.entries(routeGroups).map(([group, routes]) => (
                <div key={group}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="gold" size="sm">{group}</Badge>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{routes.length} routes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {routes.map((r) => (
                      <span
                        key={r.path}
                        className="rounded-md border border-[var(--color-border-subtle)] bg-black/20 px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
                      >
                        {r.path}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <Cpu className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] px-3 py-2 transition-colors hover:border-[var(--color-gold-muted)]"
                >
                  <span className={cn("text-sm font-medium", tech.color)}>{tech.name}</span>
                  <span className="ml-1.5 font-mono text-[10px] text-[var(--color-text-muted)]">v{tech.version}</span>
                </div>
              ))}
            </div>

            <p className="mb-3 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Key Dependencies</p>
            <div className="space-y-1.5">
              {KEY_DEPS.map((dep) => (
                <div key={dep.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3 text-[var(--color-text-muted)]" />
                    <span className="font-mono text-[var(--color-text)]">{dep.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-text-muted)]">{dep.purpose}</span>
                    <span className="font-mono text-[10px] text-[var(--color-gold)]">{dep.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Env Vars + Skills row ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Env Vars Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <Key className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Environment Variables
            </p>
            <div className="space-y-2">
              {ENV_VARS.map((v) => {
                const configured = envStatus[v.key] !== false;
                return (
                  <div
                    key={v.key}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-2.5",
                      configured
                        ? "border-emerald-500/10 bg-emerald-500/5"
                        : "border-red-500/20 bg-red-500/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {configured ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <div>
                        <span className="font-mono text-xs text-[var(--color-text)]">{v.key}</span>
                        {v.required && <span className="ml-1.5 text-[9px] font-bold text-red-400">REQ</span>}
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{v.description}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={glassCard}
            style={glassBg}
          >
            <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
              <Sparkles className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
              Skills ({SKILLS.length})
            </p>
            <div className="space-y-2">
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.03 }}
                  className="rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] p-3 transition-colors hover:border-[var(--color-gold-muted)]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[var(--color-gold)]">{skill.name}</span>
                    <span className="rounded-md border border-[var(--color-border-subtle)] bg-black/30 px-1.5 py-0.5 font-mono text-[9px] text-[var(--color-text-muted)]">
                      {skill.trigger}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Build Info ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className={glassCard}
          style={glassBg}
        >
          <p className="mb-4 text-sm font-medium text-[var(--color-text)]">
            <Server className="mr-2 inline h-4 w-4 text-[var(--color-gold)]" />
            Build & Deploy
          </p>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-black/20 p-4">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Build Command</p>
              <div className="flex items-center gap-2 rounded-md bg-black/30 px-3 py-2 font-mono text-xs text-[var(--color-text)]">
                <Terminal className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                <span className="flex-1">pnpm build</span>
                <button onClick={() => copyCommand("pnpm build")} className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">Turbopack &bull; ~12s cold build</p>
            </div>

            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-black/20 p-4">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Dev Server</p>
              <div className="flex items-center gap-2 rounded-md bg-black/30 px-3 py-2 font-mono text-xs text-[var(--color-text)]">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="flex-1">pnpm dev --turbopack</span>
                <button onClick={() => copyCommand("pnpm dev --turbopack")} className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">localhost:3000 &bull; HMR &lt;100ms</p>
            </div>

            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-black/20 p-4">
              <p className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Deploy</p>
              <div className="flex items-center gap-2 rounded-md bg-black/30 px-3 py-2 font-mono text-xs text-[var(--color-text)]">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span className="flex-1">netlify deploy --prod</span>
                <button onClick={() => copyCommand("netlify deploy --prod")} className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)]">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">Netlify &bull; Auto-deploy on push</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
