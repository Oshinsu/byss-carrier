"use client";

import { motion } from "motion/react";
import { Briefcase, Server, AlertTriangle, Database, Zap, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   BYSS EMPLOI — France Travail MCP Platform
   Real data extracted from byss-emploi.com — 22/03/2026
   Primary: #0b1120 (dark navy)
   ═══════════════════════════════════════════════════════ */

const SITE_URL = "https://byss-emploi.com";
const EXTRACTION_DATE = "22/03/2026";

const REAL_STATS = [
  { label: "Offres d'emploi", value: "95 000+", tooltip: "Nombre total d'offres indexees depuis France Travail API (actualisation quotidienne)" },
  { label: "Utilisateurs beta", value: "2 400+", tooltip: "Utilisateurs inscrits sur la plateforme beta" },
  { label: "Regions couvertes", value: "13", tooltip: "Regions metropolitaines et ultramarines avec donnees territoriales INSEE" },
  { label: "Outils IA", value: "50+", tooltip: "Outils d'intelligence artificielle integres (matching, analyse CV, recommandations)" },
];

const DATA_SOURCES = [
  { name: "France Travail", frequency: "Quotidien", status: "active" as const },
  { name: "INSEE", frequency: "Mensuel", status: "active" as const },
  { name: "ROME v4", frequency: "Trimestriel", status: "active" as const },
  { name: "RNCP", frequency: "Trimestriel", status: "active" as const },
  { name: "CPF", frequency: "Mensuel", status: "active" as const },
];

const MCP_SERVICES = [
  { name: "France Travail API", count: 27, status: "partial" },
  { name: "INSEE", count: 1, status: "planned" },
  { name: "Banque de France", count: 1, status: "planned" },
  { name: "ESCO", count: 1, status: "planned" },
  { name: "France Competences", count: 1, status: "planned" },
  { name: "Apprentissage", count: 1, status: "planned" },
  { name: "CertifInfo", count: 1, status: "planned" },
  { name: "Anotea", count: 1, status: "planned" },
];

const CRITICAL_ISSUES = [
  "40+ tables Supabase manquantes",
  "Migrations 012-013 non appliquees",
  "Credentials hardcodes dans le code",
  "Donnees fake en fallback",
  "20+ TODOs critiques",
];

const SERVICE_STATUSES = ["planned", "partial", "active", "done"] as const;
type ServiceStatus = (typeof SERVICE_STATUSES)[number];
function cycleServiceStatus(s: ServiceStatus): ServiceStatus {
  return SERVICE_STATUSES[(SERVICE_STATUSES.indexOf(s) + 1) % SERVICE_STATUSES.length];
}

function serviceStatusStyle(s: ServiceStatus) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "active") return { bg: "#22D3EE20", color: "#22D3EE", label: "active" };
  if (s === "partial") return { bg: "#F59E0B20", color: "#F59E0B", label: "partial" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

function Tooltip({ label, source }: { label: string; source?: string }) {
  return (
    <div className="pointer-events-none absolute -top-20 left-1/2 z-50 w-56 -translate-x-1/2 rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] p-3 text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      <p className="mb-1 text-[var(--color-text)]">{label}</p>
      <p className="text-[9px] text-[var(--color-text-muted)]">Extrait de {source ?? SITE_URL} le {EXTRACTION_DATE}</p>
    </div>
  );
}

interface State {
  services: Record<string, ServiceStatus>;
  issues: Record<string, boolean>;
}

const defaultState = (): State => ({
  services: Object.fromEntries(MCP_SERVICES.map((s) => [s.name, s.status as ServiceStatus])),
  issues: Object.fromEntries(CRITICAL_ISSUES.map((i) => [i, false])),
});

export default function ByssEmploiPage() {
  const [state, setState, loaded] = useLocalStorage<State>(STORAGE_KEYS.BYSS_EMPLOI_MILESTONES, defaultState());

  const toggleService = (name: string) => {
    setState({ ...state, services: { ...state.services, [name]: cycleServiceStatus(state.services[name] ?? "planned") } });
  };

  const toggleIssue = (issue: string) => {
    setState({ ...state, issues: { ...state.issues, [issue]: !state.issues[issue] } });
  };

  const serviceDone = Object.values(state.services).filter((s) => s === "done" || s === "active").length;
  const issuesResolved = Object.values(state.issues).filter(Boolean).length;
  const total = MCP_SERVICES.length + CRITICAL_ISSUES.length;
  const done = serviceDone + issuesResolved;
  const pct = Math.round((done / total) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Colored Header Bar */}
      <div className="overflow-hidden rounded-xl" style={{ backgroundColor: "#0b1120" }}>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <PageHeader title="Byss" titleAccent="Emploi" />
              <p className="mt-1 text-sm text-blue-200/70">
                Your job search, with a head start
              </p>
              <p className="mt-0.5 text-[10px] text-blue-300/50">
                27 services MCP wrappant France Travail API + 8 sources secondaires
              </p>
            </div>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visiter le site
            </a>
          </div>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {REAL_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3"
          >
            <Tooltip label={s.tooltip} />
            <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: "#0b112015" }}>
              <Briefcase className="h-4 w-4" style={{ color: "#0b1120" }} />
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Progress Bars */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Metriques cles — progression
        </h3>
        <div className="space-y-4">
          {[
            { label: "Offres indexees", value: "95 000+", target: "150 000", pct: 63, color: "#3B82F6" },
            { label: "Utilisateurs beta", value: "2 400", target: "10 000", pct: 24, color: "#10B981" },
            { label: "Regions couvertes", value: "13 / 18", target: "18", pct: 72, color: "#F59E0B" },
            { label: "Services MCP actifs", value: "27 / 34", target: "34", pct: 79, color: "#8B5CF6" },
            { label: "Outils IA integres", value: "50+", target: "100", pct: 50, color: "#00B4D8" },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--color-text)]">{m.label}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  <span className="font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                  <span className="text-[var(--color-text-muted)]"> / {m.target}</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.pct}%` }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources — Enhanced */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Database className="h-3 w-3" style={{ color: "#0b1120" }} />
          Sources de donnees — Detail
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: "France Travail", frequency: "Quotidien", records: "95K+ offres", api: "27 endpoints", desc: "API principale emploi. Recherche, referentiels ROME, communes, NAF. Actualisation quotidienne automatique via n8n." },
            { name: "INSEE", frequency: "Mensuel", records: "13 regions", api: "1 endpoint", desc: "Donnees territoriales. Population active, taux chomage, bassins d'emploi. Croisement avec offres pour scoring territorial." },
            { name: "ROME v4", frequency: "Trimestriel", records: "532 fiches", api: "Referentiel", desc: "Repertoire Operationnel des Metiers. Classification officielle. Mapping competences-metiers pour le matching IA." },
            { name: "RNCP", frequency: "Trimestriel", records: "12K+ titres", api: "Referentiel", desc: "Repertoire National des Certifications Professionnelles. Lien diplome-metier. Validation des acquis." },
            { name: "CPF", frequency: "Mensuel", records: "48K+ formations", api: "Referentiel", desc: "Compte Personnel de Formation. Catalogue formations eligibles. Budget disponible par utilisateur." },
          ].map((ds) => (
            <div key={ds.name} className="group relative rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3">
              <Tooltip label={ds.desc} />
              <p className="text-xs font-bold text-[var(--color-text)]">{ds.name}</p>
              <p className="text-[9px] text-[var(--color-text-muted)]">{ds.frequency}</p>
              <p className="mt-1 font-mono text-[9px] text-[var(--color-cyan)]">{ds.records}</p>
              <p className="text-[8px] text-[var(--color-text-muted)]">{ds.api}</p>
              <div className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Progression globale</span>
          <span className="font-mono text-sm font-bold text-[var(--color-gold)]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{serviceDone}/{MCP_SERVICES.length} services active &middot; {issuesResolved}/{CRITICAL_ISSUES.length} issues resolved</p>
      </div>

      {/* Alert */}
      <div className="rounded-xl border border-[var(--color-fire)] bg-[#EF444408] p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-[var(--color-fire)]" />
          <h2 className="text-sm font-bold text-[var(--color-fire)]">Fenetre MCP : NOW OR NEVER</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          L&apos;ecosysteme MCP converge en Mars 2026. Si on ne ship pas maintenant,
          les wrappers France Travail seront faits par d&apos;autres. Etat actuel : partiellement casse.
        </p>
      </div>

      {/* MCP Services */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Server className="h-3 w-3 text-[var(--color-cyan)]" />
          Services MCP ({MCP_SERVICES.reduce((s, m) => s + m.count, 0)} total) — click to cycle status
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {MCP_SERVICES.map((s, i) => {
            const status = state.services[s.name] ?? "planned";
            const st = serviceStatusStyle(status);
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggleService(s.name)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-gold)]"
              >
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: st.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[var(--color-text)]">{s.name}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">{s.count} service{s.count > 1 ? "s" : ""}</p>
                </div>
                <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                  {st.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Critical Issues */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-3 text-sm font-bold text-[var(--color-fire)]">Issues critiques — click to toggle resolved</h3>
        <div className="space-y-2">
          {CRITICAL_ISSUES.map((issue, i) => {
            const resolved = state.issues[issue] ?? false;
            return (
              <div
                key={i}
                onClick={() => toggleIssue(issue)}
                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all hover:bg-[var(--color-surface-2)]"
              >
                {resolved ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-[var(--color-fire)]" />
                )}
                <span className={`text-xs ${resolved ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text)]"}`}>
                  {issue}
                </span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                  resolved ? "bg-[#10B98115] text-[#10B981]" : "bg-[#EF444415] text-[#EF4444]"
                }`}>
                  {resolved ? "resolved" : "open"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">Stack cible</h3>
        <div className="flex flex-wrap gap-2">
          {["Next.js 16.1", "React 19", "LangGraph", "GPT-5.4", "Pinecone", "Mem0", "Cohere", "Supabase", "Stripe", "PWA"].map((t) => (
            <span key={t} className="rounded-full bg-[var(--color-surface-2)] px-3 py-1 text-[10px] font-medium text-[var(--color-text-muted)]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
