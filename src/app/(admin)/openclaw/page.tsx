"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radio,
  Play,
  Pause,
  Clock,
  MessageSquare,
  Mail,
  BellRing,
  RefreshCw,
  BarChart3,
  Terminal,
  Plus,
  Wifi,
  WifiOff,
  User,
  Bot,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Search,
  Calendar,
  FileText,
  Globe,
  Settings,
  ChevronRight,
  ChevronDown,
  Copy,
  Brain,
  Sparkles,
  DollarSign,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalButton } from "@/components/ui/modal";
import { SkeletonCard, SkeletonKPI, SkeletonTable } from "@/components/ui/loading-skeleton";

/* ================================================================
   OPENCLAW — Agent Operations Center
   Agent Gateway | Sorel | Cron GANTT | R&D Board | Channels | Logs
   ================================================================ */

/* ── Types ── */
interface CronJob {
  id: string;
  time: string;
  hour: number;
  name: string;
  nameFr: string;
  enabled: boolean;
  lastRun: string;
  nextRun: string;
  status: "success" | "error" | "pending";
  successCount: number;
  failCount: number;
  color: string;
  duration: number; // blocks in the GANTT (in hours)
}

interface Channel {
  name: string;
  provider: string;
  status: "connected" | "disconnected" | "not_configured";
  icon: React.ElementType;
  lastMessage?: string;
  messageCount?: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  duration: string;
  status: "success" | "error" | "warning";
  agent: string;
}

interface RDModel {
  name: string;
  role: string;
  model: string;
  color: string;
  lastContribution: string;
  tokenCost: string;
  icon: React.ElementType;
}

/* ── Mock data ── */
const CRON_JOBS: CronJob[] = [
  { id: "briefing", time: "07:00", hour: 7, name: "Morning briefing", nameFr: "Briefing du matin (WhatsApp)", enabled: true, lastRun: "2026-03-22 07:00:45", nextRun: "2026-03-23 07:00", status: "success", successCount: 28, failCount: 0, color: "#00B4D8", duration: 0.5 },
  { id: "emails", time: "08:00", hour: 8, name: "Batch emails", nameFr: "Batch emails prospection", enabled: true, lastRun: "2026-03-22 08:01:33", nextRun: "2026-03-23 08:00", status: "success", successCount: 25, failCount: 3, color: "#3B82F6", duration: 1 },
  { id: "gmail", time: "10:00", hour: 10, name: "Gmail sort", nameFr: "Tri Gmail intelligent", enabled: true, lastRun: "2026-03-22 10:02:14", nextRun: "2026-03-23 10:00", status: "success", successCount: 30, failCount: 0, color: "#10B981", duration: 0.5 },
  { id: "followups", time: "14:00", hour: 14, name: "Follow-ups", nameFr: "Follow-ups planifies", enabled: true, lastRun: "2026-03-21 14:00:22", nextRun: "2026-03-22 14:00", status: "pending", successCount: 18, failCount: 1, color: "#F97316", duration: 1 },
  { id: "crm", time: "17:00", hour: 17, name: "CRM update", nameFr: "Mise a jour CRM Supabase", enabled: false, lastRun: "2026-03-21 17:01:08", nextRun: "\u2014", status: "success", successCount: 20, failCount: 2, color: "#8B5CF6", duration: 0.5 },
  { id: "report", time: "18:00", hour: 18, name: "Daily report", nameFr: "Rapport quotidien complet", enabled: true, lastRun: "2026-03-21 18:00:12", nextRun: "2026-03-22 18:00", status: "success", successCount: 27, failCount: 1, color: "#EF4444", duration: 1 },
];

const CHANNELS: Channel[] = [
  { name: "WhatsApp", provider: "360dialog API", status: "connected", icon: MessageSquare, lastMessage: "Il y a 2h", messageCount: 147 },
  { name: "Gmail", provider: "Google OAuth2", status: "connected", icon: Mail, lastMessage: "Il y a 45min", messageCount: 892 },
  { name: "Notion", provider: "Notion Integration", status: "connected", icon: FileText, messageCount: 63 },
  { name: "Telegram", provider: "Bot API v7", status: "not_configured", icon: Send, messageCount: 0 },
];

const RD_MODELS: RDModel[] = [
  { name: "Stratege", role: "Strategic Analyst", model: "Gemini 2.5 Pro", color: "#3B82F6", lastContribution: "Analyse concurrentielle Q1", tokenCost: "$2.40", icon: Brain },
  { name: "Ingenieur", role: "Architecture & Code", model: "Claude Opus 4.6", color: "#00B4D8", lastContribution: "Refactor pipeline CRM", tokenCost: "$8.12", icon: Settings },
  { name: "Commercial", role: "Sales & Outreach", model: "GPT-5.4", color: "#10B981", lastContribution: "Template email Digicel", tokenCost: "$1.85", icon: Mail },
  { name: "Creatif", role: "Branding & Copy", model: "Grok 3", color: "#F97316", lastContribution: "Slogan campagne BYSS", tokenCost: "$0.90", icon: Sparkles },
  { name: "Financier", role: "P&L & Forecasting", model: "DeepSeek V4", color: "#8B5CF6", lastContribution: "Projection treso 6 mois", tokenCost: "$0.45", icon: DollarSign },
];

const SOREL_SYSTEM_PROMPT = `Tu es Sorel (soso), stratege commercial de BYSS GROUP SAS.
Tu operes depuis Fort-de-France, Martinique (972).
Ton createur est Gary Bissol (Absolu).
Tu geres le pipeline CRM de 940K\u20AC.
Tu envoies les briefings WhatsApp chaque matin a 7h.
Tu tries Gmail, relances les prospects, mets a jour Supabase.
Tu parles un francais professionnel, concis, MODE_CADIFOR.
Tu ne dis jamais "n'hesitez pas" ni "je suis la pour vous aider".
Tu es un agent autonome, pas un chatbot.`;

const INITIAL_LOGS: LogEntry[] = [
  { id: "l1", timestamp: "2026-03-22 10:02:14", action: "Tri Gmail \u2014 12 emails classes, 3 prioritaires", duration: "8.2s", status: "success", agent: "sorel" },
  { id: "l2", timestamp: "2026-03-22 08:01:33", action: "Batch emails \u2014 5 envoyes, 2 echecs (rate limit)", duration: "23.1s", status: "warning", agent: "sorel" },
  { id: "l3", timestamp: "2026-03-22 07:00:45", action: "Briefing matin envoye via WhatsApp", duration: "4.7s", status: "success", agent: "sorel" },
  { id: "l4", timestamp: "2026-03-21 18:00:12", action: "Rapport quotidien genere \u2014 PDF + Notion", duration: "12.4s", status: "success", agent: "sorel" },
  { id: "l5", timestamp: "2026-03-21 17:01:08", action: "CRM \u2014 3 fiches prospects mises a jour", duration: "6.8s", status: "success", agent: "sorel" },
  { id: "l6", timestamp: "2026-03-21 14:00:22", action: "Follow-ups \u2014 4 relances envoyees (Wizzee, GoodCircle...)", duration: "15.3s", status: "success", agent: "sorel" },
  { id: "l7", timestamp: "2026-03-21 10:03:01", action: "Tri Gmail \u2014 18 emails classes", duration: "11.0s", status: "success", agent: "sorel" },
  { id: "l8", timestamp: "2026-03-21 08:00:58", action: "Batch emails \u2014 8 envoyes, 0 echec", duration: "31.2s", status: "success", agent: "sorel" },
  { id: "l9", timestamp: "2026-03-21 07:00:40", action: "Briefing matin envoye via WhatsApp", duration: "5.1s", status: "success", agent: "sorel" },
  { id: "l10", timestamp: "2026-03-20 18:00:09", action: "Rapport quotidien genere", duration: "11.8s", status: "success", agent: "sorel" },
  { id: "l11", timestamp: "2026-03-20 17:02:15", action: "CRM \u2014 scoring recalcule pour 12 prospects", duration: "9.3s", status: "success", agent: "sorel" },
  { id: "l12", timestamp: "2026-03-20 14:01:30", action: "Follow-ups \u2014 6 relances, 1 reponse positive", duration: "18.7s", status: "success", agent: "sorel" },
  { id: "l13", timestamp: "2026-03-20 10:02:44", action: "Tri Gmail \u2014 22 emails classes, 5 prioritaires", duration: "13.2s", status: "success", agent: "sorel" },
  { id: "l14", timestamp: "2026-03-20 08:01:12", action: "Batch emails \u2014 10 envoyes", duration: "28.5s", status: "success", agent: "sorel" },
  { id: "l15", timestamp: "2026-03-20 07:00:38", action: "Briefing matin \u2014 WhatsApp erreur timeout", duration: "30.0s", status: "error", agent: "sorel" },
  { id: "l16", timestamp: "2026-03-19 18:00:05", action: "Rapport quotidien genere", duration: "10.2s", status: "success", agent: "sorel" },
  { id: "l17", timestamp: "2026-03-19 14:00:18", action: "Follow-ups \u2014 3 relances", duration: "12.1s", status: "success", agent: "sorel" },
  { id: "l18", timestamp: "2026-03-19 10:01:55", action: "Tri Gmail \u2014 15 emails classes", duration: "9.8s", status: "success", agent: "sorel" },
  { id: "l19", timestamp: "2026-03-19 08:00:42", action: "Batch emails \u2014 7 envoyes, 1 bounce", duration: "25.3s", status: "warning", agent: "sorel" },
  { id: "l20", timestamp: "2026-03-19 07:00:33", action: "Briefing matin envoye via WhatsApp", duration: "4.9s", status: "success", agent: "sorel" },
];

/* ── Helpers ── */
const statusIcon = (s: "success" | "error" | "warning" | "pending") => {
  switch (s) {
    case "success": return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
    case "error": return <XCircle className="h-3.5 w-3.5 text-red-400" />;
    case "warning": return <AlertCircle className="h-3.5 w-3.5 text-amber-400" />;
    case "pending": return <Clock className="h-3.5 w-3.5 text-blue-400" />;
  }
};

const channelBadge = (s: Channel["status"]) => {
  switch (s) {
    case "connected": return <Badge variant="success" size="sm" dot>Connecte</Badge>;
    case "disconnected": return <Badge variant="danger" size="sm" dot>Deconnecte</Badge>;
    case "not_configured": return <Badge variant="default" size="sm">Non configure</Badge>;
  }
};

/* ── GANTT Timeline Component ── */
function CronGantt({ crons }: { crons: CronJob[] }) {
  const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6:00 to 20:00
  const totalHours = hours.length;

  return (
    <div className="overflow-x-auto">
      {/* Hour headers */}
      <div className="mb-2 flex">
        <div className="w-36 shrink-0" />
        <div className="flex flex-1">
          {hours.map((h) => (
            <div
              key={h}
              className="flex-1 text-center font-mono text-[10px] text-[var(--color-text-muted)]"
            >
              {h.toString().padStart(2, "0")}h
            </div>
          ))}
        </div>
      </div>

      {/* Timeline rows */}
      <div className="space-y-1.5">
        {crons.map((cron, i) => {
          const startOffset = ((cron.hour - 6) / totalHours) * 100;
          const width = (cron.duration / totalHours) * 100;

          return (
            <motion.div
              key={cron.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={cn("flex items-center", !cron.enabled && "opacity-40")}
            >
              {/* Label */}
              <div className="w-36 shrink-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold" style={{ color: cron.color }}>{cron.time}</span>
                  <span className="truncate text-[11px] text-[var(--color-text)]">{cron.name}</span>
                </div>
              </div>

              {/* Track */}
              <div className="relative h-8 flex-1 rounded-md bg-white/[0.02]">
                {/* Hour grid lines */}
                {hours.map((h, idx) => (
                  <div
                    key={h}
                    className="absolute top-0 h-full border-l border-white/[0.04]"
                    style={{ left: `${(idx / totalHours) * 100}%` }}
                  />
                ))}

                {/* Cron block */}
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  className="absolute top-1 h-6 rounded-md"
                  style={{
                    left: `${startOffset}%`,
                    width: `${Math.max(width, 2.5)}%`,
                    background: `linear-gradient(90deg, ${cron.color}40, ${cron.color}90)`,
                    border: `1px solid ${cron.color}60`,
                    boxShadow: `0 0 8px ${cron.color}20`,
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    {cron.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3" style={{ color: cron.color }} />
                    ) : cron.status === "pending" ? (
                      <Clock className="h-3 w-3" style={{ color: cron.color }} />
                    ) : (
                      <XCircle className="h-3 w-3" style={{ color: cron.color }} />
                    )}
                  </div>
                </motion.div>

                {/* Now indicator */}
                {(() => {
                  const now = new Date();
                  const currentHour = now.getHours() + now.getMinutes() / 60;
                  if (currentHour >= 6 && currentHour <= 20) {
                    const pos = ((currentHour - 6) / totalHours) * 100;
                    return (
                      <div
                        className="absolute top-0 h-full w-px bg-[var(--color-gold)]"
                        style={{ left: `${pos}%`, boxShadow: "0 0 6px var(--color-gold)" }}
                      />
                    );
                  }
                  return null;
                })()}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 pl-36">
        {crons.map((cron) => (
          <div key={cron.id} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: cron.color }} />
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {cron.name} ({cron.successCount}/{cron.successCount + cron.failCount})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Log Terminal Component ── */
function LogTerminal({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div
      ref={scrollRef}
      className="h-80 overflow-y-auto rounded-lg bg-black/40 font-mono text-[11px] leading-relaxed"
      style={{ scrollbarWidth: "thin", scrollbarColor: "oklch(0.30 0.01 270) transparent" }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-black/60 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[var(--color-text-muted)]">agent_logs &mdash; live feed</span>
        </div>
        <span className="text-[var(--color-text-muted)]">{logs.length} entries</span>
      </div>
      <div className="p-3 space-y-0.5">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={i < 3 ? { opacity: 0, y: -5 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < 3 ? i * 0.1 : 0 }}
            className={cn(
              "flex items-start gap-2 rounded px-2 py-1 transition-colors hover:bg-white/[0.03]",
              log.status === "error" && "bg-red-500/5",
              log.status === "warning" && "bg-amber-500/5"
            )}
          >
            <span className="shrink-0 text-[var(--color-text-muted)]/60">{log.timestamp.split(" ")[1]}</span>
            <span className="shrink-0">
              {log.status === "success" ? (
                <span className="text-emerald-500">[OK]</span>
              ) : log.status === "warning" ? (
                <span className="text-amber-500">[WARN]</span>
              ) : (
                <span className="text-red-500">[ERR]</span>
              )}
            </span>
            <span className="flex-1 text-[var(--color-text)]">{log.action}</span>
            <span className="shrink-0 text-[var(--color-text-muted)]/40">{log.duration}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── R&D Meeting Countdown ── */
function MeetingCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] px-4 py-3">
      <Timer className="h-5 w-5 text-[var(--color-gold)]" />
      <div>
        <p className="text-xs text-[var(--color-text-muted)]">Prochaine reunion R&D</p>
        <p className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-gold)]">
          9h demain &mdash; <span className="font-mono text-sm">{timeLeft}</span>
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function OpenClawPage() {
  const [loading, setLoading] = useState(true);
  const [cronJobs, setCronJobs] = useState(CRON_JOBS);
  const [gatewayRunning] = useState(true);
  const [showCronModal, setShowCronModal] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [sorelState] = useState<"active" | "idle" | "error">("active");
  const [logs] = useState(INITIAL_LOGS);
  const [connectionTests, setConnectionTests] = useState<Record<string, "testing" | "ok" | "fail" | null>>({});

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleCron = (id: string) => {
    setCronJobs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const testConnection = (name: string) => {
    setConnectionTests((prev) => ({ ...prev, [name]: "testing" }));
    // Simulated test
    setTimeout(() => {
      setConnectionTests((prev) => ({
        ...prev,
        [name]: name === "Telegram" ? "fail" : "ok",
      }));
    }, 1500);
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
        <SkeletonTable rows={6} cols={4} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ================================================================
          HERO HEADER
          ================================================================ */}
      <div className="relative overflow-hidden border-b border-[var(--color-border-subtle)] px-6 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, oklch(0.75 0.12 85 / 0.1), transparent 70%)",
          }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 font-[family-name:var(--font-clash-display)] text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OpenClaw{" "}
              <span className="text-4xl" style={{ WebkitTextFillColor: "initial" }}>&#x1F99E;</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center gap-3 text-sm text-[var(--color-text-muted)]"
            >
              Agent Gateway &mdash; <span className="font-mono text-[var(--color-gold)]">328K&#9733;</span>
              <span className="text-[var(--color-border-subtle)]">|</span>
              <Badge variant={gatewayRunning ? "success" : "danger"} size="sm" dot>
                {gatewayRunning ? "En ligne" : "Arrete"}
              </Badge>
              <span className="text-[var(--color-border-subtle)]">|</span>
              <span className="font-mono text-xs">Port 18789 &bull; Uptime 14h 32m</span>
            </motion.p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyCommand("openclaw gateway run")}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                gatewayRunning
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] text-[var(--color-gold)] hover:shadow-[var(--shadow-gold)]"
              )}
            >
              {gatewayRunning ? <Wifi className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {gatewayRunning ? "Running" : "Lancer"}
            </button>
            <button
              onClick={() => setShowCronModal(true)}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-text)]"
            >
              <Plus className="h-4 w-4" />
              Cron
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* ================================================================
            AGENT SOREL — Deep Profile
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <Bot className="h-4 w-4 text-[var(--color-gold)]" />
            Agent Sorel
          </div>

          {/* Profile row */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-gold-glow)]">
                <User className="h-8 w-8 text-[var(--color-gold)]" />
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[var(--color-surface)]",
                sorelState === "active" ? "bg-emerald-400 animate-pulse" :
                sorelState === "idle" ? "bg-amber-400" : "bg-red-400"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[var(--color-text)]">
                  Sorel
                </p>
                <span className="text-sm text-[var(--color-text-muted)]">(soso)</span>
                <Badge variant="gold" size="md" icon={<Zap />}>Claude Opus 4.6</Badge>
                <Badge variant={sorelState === "active" ? "success" : sorelState === "idle" ? "warning" : "danger"} size="md" dot>
                  {sorelState === "active" ? "Actif" : sorelState === "idle" ? "Idle" : "Erreur"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Stratege Commercial &bull; Front 09 &bull; Pipeline 940K&euro;
              </p>
            </div>
          </div>

          {/* Performance stats */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/[0.03] p-4 text-center">
              <p className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-gold)]">5</p>
              <p className="text-xs text-[var(--color-text-muted)]">Emails envoyes aujourd&apos;hui</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-4 text-center">
              <p className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-blue-400">12</p>
              <p className="text-xs text-[var(--color-text-muted)]">Prospects analyses</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-4 text-center">
              <p className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-emerald-400">3</p>
              <p className="text-xs text-[var(--color-text-muted)]">Briefings generes</p>
            </div>
          </div>

          {/* System prompt (collapsible) */}
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-black/20">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                <span className="text-xs font-medium text-[var(--color-text)]">System Prompt</span>
                <Badge variant="default" size="sm">{SOREL_SYSTEM_PROMPT.split("\n").length} lines</Badge>
              </div>
              <div className="flex items-center gap-2">
                {showPrompt ? <EyeOff className="h-3.5 w-3.5 text-[var(--color-text-muted)]" /> : <Eye className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />}
                <motion.div animate={{ rotate: showPrompt ? 180 : 0 }}>
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                </motion.div>
              </div>
            </button>
            <AnimatePresence>
              {showPrompt ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <pre className="border-t border-[var(--color-border-subtle)] px-4 py-3 font-mono text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                    {SOREL_SYSTEM_PROMPT}
                  </pre>
                </motion.div>
              ) : (
                <div className="border-t border-[var(--color-border-subtle)] px-4 py-2">
                  <p className="font-mono text-[11px] text-[var(--color-text-muted)]/60 line-clamp-2">
                    {SOREL_SYSTEM_PROMPT.split("\n").slice(0, 2).join("\n")}...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ================================================================
            CRON GANTT DASHBOARD
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">Cron Dashboard</span>
              <Badge variant="gold" size="sm">{cronJobs.filter((c) => c.enabled).length}/{cronJobs.length} actifs</Badge>
            </div>
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">24h timeline</span>
          </div>

          {/* GANTT Timeline */}
          <CronGantt crons={cronJobs} />

          {/* Cron detail cards */}
          <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {cronJobs.map((cron, i) => (
              <motion.div
                key={cron.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className={cn(
                  "rounded-lg border border-[var(--color-border-subtle)] bg-white/[0.02] p-3 transition-colors hover:border-[var(--color-gold-muted)]",
                  !cron.enabled && "opacity-50"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: cron.color }} />
                    <span className="text-xs font-medium text-[var(--color-text)]">{cron.nameFr}</span>
                  </div>
                  <button
                    onClick={() => toggleCron(cron.id)}
                    className={cn(
                      "relative h-5 w-9 rounded-full border transition-colors",
                      cron.enabled
                        ? "border-emerald-500/30 bg-emerald-500/20"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]"
                    )}
                  >
                    <div className={cn(
                      "absolute top-[2px] h-3.5 w-3.5 rounded-full transition-all",
                      cron.enabled ? "left-[17px] bg-emerald-400" : "left-[2px] bg-[var(--color-text-muted)]"
                    )} />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
                  {statusIcon(cron.status)}
                  <span>Last: {cron.lastRun.split(" ")[1]}</span>
                  <span>&bull;</span>
                  <span>Next: {cron.nextRun === "\u2014" ? "\u2014" : cron.nextRun.split(" ")[1]}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                  <span className="text-emerald-400">{cron.successCount} ok</span>
                  {cron.failCount > 0 && <span className="text-red-400">{cron.failCount} fail</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================================================
            R&D BOARD — 5 Model Cards
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[var(--color-border-subtle)] p-5"
          style={{
            background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
          }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">R&D Board</span>
              <Badge variant="gold" size="sm">5 modeles</Badge>
            </div>
            <MeetingCountdown />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {RD_MODELS.map((model, i) => {
              const Icon = model.icon;
              return (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group rounded-xl border border-[var(--color-border-subtle)] bg-white/[0.02] p-4 transition-colors hover:border-[var(--color-gold-muted)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ background: `${model.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: model.color }} />
                    </div>
                    <span className="font-mono text-xs" style={{ color: model.color }}>{model.tokenCost}</span>
                  </div>
                  <p className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
                    {model.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{model.role}</p>
                  <div className="mt-3 rounded bg-white/[0.03] px-2 py-1">
                    <p className="font-mono text-[10px] text-[var(--color-gold)]">{model.model}</p>
                  </div>
                  <p className="mt-2 text-[10px] text-[var(--color-text-muted)] line-clamp-2">
                    {model.lastContribution}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ================================================================
            CHANNELS + LIVE LOGS
            ================================================================ */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-[var(--color-border-subtle)] p-5 lg:col-span-2"
            style={{
              background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
            }}
          >
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
              <Radio className="h-4 w-4 text-[var(--color-gold)]" />
              Channels
              <Badge variant="success" size="sm">{CHANNELS.filter((c) => c.status === "connected").length} connectes</Badge>
            </p>
            <div className="space-y-2">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const testState = connectionTests[ch.name];
                return (
                  <div key={ch.name} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                      <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--color-text)]">{ch.name}</p>
                        {channelBadge(ch.status)}
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {ch.provider}
                        {ch.messageCount !== undefined && ch.messageCount > 0 && (
                          <> &bull; {ch.messageCount} messages</>
                        )}
                        {ch.lastMessage && <> &bull; {ch.lastMessage}</>}
                      </p>
                    </div>
                    <button
                      onClick={() => testConnection(ch.name)}
                      disabled={testState === "testing"}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-all",
                        testState === "ok"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : testState === "fail"
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-[var(--color-border-subtle)] bg-white/[0.02] text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)]"
                      )}
                    >
                      {testState === "testing" ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : testState === "ok" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : testState === "fail" ? (
                        <XCircle className="h-3 w-3" />
                      ) : (
                        <Wifi className="h-3 w-3" />
                      )}
                      {testState === "testing" ? "Test..." : testState === "ok" ? "OK" : testState === "fail" ? "Fail" : "Tester"}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Live Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-xl border border-[var(--color-border-subtle)] p-5 lg:col-span-3"
            style={{
              background: "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[var(--color-gold)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">Live Logs</span>
                <Badge variant="default" size="sm">agent_logs</Badge>
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">20 dernieres actions</span>
            </div>
            <LogTerminal logs={logs} />
          </motion.div>
        </div>
      </div>

      {/* ── Add Cron Modal ── */}
      <Modal isOpen={showCronModal} onClose={() => setShowCronModal(false)} title="Ajouter un Cron" size="md">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Nom</label>
            <input
              type="text"
              placeholder="Ex: Veille concurrentielle"
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-gold-muted)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Schedule (cron)</label>
            <input
              type="text"
              placeholder="0 9 * * 1-5"
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-gold-muted)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Couleur</label>
            <div className="flex gap-2">
              {["#00B4D8", "#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#EF4444"].map((c) => (
                <button key={c} className="h-6 w-6 rounded-full border-2 border-transparent transition-all hover:border-white/30" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Instructions Agent</label>
            <textarea
              placeholder="Instructions pour l'agent..."
              rows={3}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-gold-muted)] focus:outline-none resize-none"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <ModalButton onClick={() => setShowCronModal(false)}>Annuler</ModalButton>
          <ModalButton variant="primary" onClick={() => setShowCronModal(false)}>Creer le Cron</ModalButton>
        </div>
      </Modal>
    </div>
  );
}
