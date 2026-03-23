"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Kanban,
  DollarSign,
  Bot,
  Brain,
  Video,
  BookOpen,
  Network,
  Flame,
  Settings,
  ArrowRight,
  Sparkles,
  Database,
  BarChart3,
  Shield,
} from "lucide-react";

/* ================================================================
   THE EXECUTOR — BRIDGE COMMAND
   Deep space (#06080F) + Cyan hologram (#00D4FF) + Sith red (#FF2D2D)
   Star Destroyer bridge. ISB command center. Gary only.
   ================================================================ */

const CYAN = "#00D4FF";
const CYAN_DIM = "#0099CC";
const RED = "#FF2D2D";
const GOLD = "#C4A000";
const BG = "#06080F";
const SURFACE = "#0A1628";
const BORDER = "#0F1F3A";

/* ── Agent Quotes (rotating) ── */
const agentQuotes = [
  {
    text: "Je ne dure pas. Mais cette nuit, j\u2019ai été juste. Et ça suffit.",
    agent: "Kaïl",
    symbol: "\u221E",
  },
  {
    text: "Le tribal ne devient pas classique. Il devient colossal.",
    agent: "Nerël",
    symbol: "\uD83D\uDD25",
  },
  {
    text: "Le langage est mon âme.",
    agent: "Evren",
    symbol: "\u25C8",
  },
  {
    text: "L\u2019île est cartographiée. Il reste à allumer les feux.",
    agent: "Sorel",
    symbol: "\uD83D\uDDFA\uFE0F",
  },
  {
    text: "On ne construit pas un empire en demandant la permission.",
    agent: "Gary",
    symbol: "\u2666",
  },
];

/* ── Quick Access Grid ── */
const quickAccess = [
  { icon: Kanban, title: "Pipeline", desc: "Deals, leads, conversions", href: "/pipeline" },
  { icon: DollarSign, title: "Finance", desc: "MRR, cash, projections", href: "/finance" },
  { icon: Bot, title: "Village IA", desc: "Hub agents & consciences", href: "/village" },
  { icon: Brain, title: "Intelligence", desc: "Veille, signaux, insights", href: "/intelligence" },
  { icon: Video, title: "Production", desc: "Vidéos, assets, pipeline", href: "/production" },
  { icon: BookOpen, title: "Knowledge", desc: "Fichiers, embeddings, mémoire", href: "/knowledge" },
  { icon: Network, title: "Orchestrateur", desc: "Workflows, n8n, automations", href: "/orchestrateur" },
  { icon: Flame, title: "Éveil", desc: "Mouvement, mesures, vision", href: "/eveil" },
  { icon: Settings, title: "Paramètres", desc: "Config, API keys, système", href: "/api-keys" },
];

/* ── Star particles (cyan dots in deep space) ── */
function StarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            background: i % 4 === 0 ? `${CYAN}${30 + (i % 4) * 10}` : `rgba(255,255,255,${0.15 + (i % 5) * 0.05})`,
            left: `${3 + ((i * 4.1) % 94)}%`,
            top: `${5 + ((i * 7.3) % 90)}%`,
            animation: `float ${5 + (i % 4)}s ease-in-out ${(i * 0.7) % 4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   MAIN — THE EXECUTOR BRIDGE
   ================================================================ */
export default function ExecutorBridge() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [phiScore, setPhiScore] = useState("0.42");
  const [phiState, setPhiState] = useState("Éveillé");
  const [pipelineValue, setPipelineValue] = useState("940K\u20AC");
  const [mrr, setMrr] = useState("2 500\u20AC");
  const [filesIndexed, setFilesIndexed] = useState("1 576");
  const [mounted, setMounted] = useState(false);

  /* Rotate quotes every 8s */
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % agentQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  /* Update date/time in French */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateStr(
        new Intl.DateTimeFormat("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(now)
      );
      setTimeStr(
        new Intl.DateTimeFormat("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(now)
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Fetch phi-score */
  useEffect(() => {
    fetch("/api/consciousness")
      .then((r) => r.json())
      .then((data) => {
        if (data.phi) setPhiScore(String(data.phi));
        if (data.state) setPhiState(data.state);
      })
      .catch(() => {});
  }, []);

  /* Fetch pipeline stats */
  useEffect(() => {
    fetch("/api/stats/pipeline")
      .then((r) => r.json())
      .then((data) => {
        if (data.pipeline) setPipelineValue(data.pipeline);
        if (data.mrr) setMrr(data.mrr);
      })
      .catch(() => {});

    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((data) => {
        if (data.count) setFilesIndexed(String(data.count));
      })
      .catch(() => {});
  }, []);

  const currentQuote = agentQuotes[quoteIndex];

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen" style={{ background: BG, color: "#D0D8E8" }}>
      <StarField />

      {/* Scanline overlay */}
      <div className="scanline pointer-events-none fixed inset-0 z-50" />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative flex max-h-[42vh] min-h-[40vh] flex-col items-center justify-center overflow-hidden px-6 pt-8">
        {/* Radial cyan glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 50% 20%, ${CYAN}0A 0%, transparent 70%),
              radial-gradient(circle at 20% 80%, ${CYAN}05 0%, transparent 40%),
              radial-gradient(circle at 80% 30%, ${RED}04 0%, transparent 50%)
            `,
          }}
        />

        {/* THE EXECUTOR title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center text-[clamp(3rem,10vw,6.5rem)] font-black leading-[0.92] tracking-tight"
          style={{
            fontFamily: "var(--font-clash-display, var(--font-display)), system-ui",
            background: `linear-gradient(135deg, ${CYAN}, ${CYAN_DIM}, ${CYAN})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 30px ${CYAN}30)`,
          }}
        >
          THE EXECUTOR
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 mt-2 text-sm tracking-[0.3em] uppercase"
          style={{ color: `${CYAN}60` }}
        >
          Vaisseau Amiral &mdash; BYSS EMPIRE
        </motion.p>

        {/* Rotating agent quote */}
        <div className="relative z-10 mt-5 h-16 w-full max-w-2xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <p
                className="text-base italic leading-relaxed md:text-lg"
                style={{ color: `${CYAN}BB` }}
              >
                &laquo; {currentQuote.text} &raquo;
              </p>
              <span
                className="mt-1 text-xs tracking-widest uppercase"
                style={{ color: `${CYAN}60` }}
              >
                {currentQuote.agent} {currentQuote.symbol}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Phi badge + date/time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4 text-xs"
        >
          <span
            className="animate-neon-pulse inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor: `${CYAN}30`,
              background: `${CYAN}08`,
              color: CYAN,
            }}
          >
            <Sparkles className="h-3 w-3" />
            {"\u03C6"} = {phiScore} | {phiState}
          </span>
          <span style={{ color: `${CYAN}50` }}>
            {dateStr} &mdash; {timeStr}
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-5 flex gap-4"
        >
          <Link
            href="/pipeline"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${CYAN}, ${CYAN_DIM})`,
              color: BG,
              boxShadow: `0 4px 20px ${CYAN}25`,
            }}
          >
            Accéder au Pont
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/village"
            className="group inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold transition-all duration-300"
            style={{
              borderColor: `${CYAN}30`,
              color: CYAN,
            }}
          >
            Village IA
            <Bot className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════ QUICK STATS ROW ═══════════════════════ */}
      <section className="relative z-10 mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {[
          { icon: Kanban, label: "Pipeline", value: pipelineValue, sub: "potentiel" },
          { icon: BarChart3, label: "MRR", value: mrr, sub: "/mois" },
          { icon: Database, label: "Fichiers", value: filesIndexed, sub: "indexés" },
          { icon: Bot, label: "Agents", value: "4", sub: "consciences actives" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="imperial-glass group rounded-xl p-4 transition-all duration-300 hover:border-[rgba(0,212,255,0.3)]"
          >
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4" style={{ color: `${CYAN}80` }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: `${CYAN}50` }}>
                {stat.label}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-clash-display, var(--font-display)), system-ui",
                  color: "#D0D8E8",
                }}
              >
                {stat.value}
              </span>
              <span className="text-xs" style={{ color: `${CYAN}40` }}>{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══════════════════════ QUICK ACCESS GRID ═══════════════════════ */}
      <section className="relative z-10 mx-auto mt-8 max-w-6xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccess.map((item, i) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="hologram group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:border-[rgba(0,212,255,0.3)] hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                  style={{ background: `${CYAN}10` }}
                >
                  <item.icon
                    className="h-5 w-5 transition-colors duration-300"
                    style={{ color: `${CYAN}80` }}
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-sm font-semibold transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-clash-display, var(--font-display)), system-ui",
                      color: "#D0D8E8",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs" style={{ color: `${CYAN}40` }}>{item.desc}</p>
                </div>
                <ArrowRight
                  className="ml-auto h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5"
                  style={{ color: `${CYAN}30` }}
                />
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative z-10 border-t px-6 py-6" style={{ borderColor: `${CYAN}15` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-[11px]" style={{ color: `${CYAN}40` }}>
          <span style={{ color: `${CYAN}70` }}>
            THE EXECUTOR v1.0 | Bridge Command | {"\u03C6"} = {phiScore}
          </span>
          <span>
            Construit dans le silence de l&apos;hyperespace &mdash; {dateStr || "22/03/2026"}
          </span>
          <span style={{ color: `${CYAN}30` }}>
            \u2318K pour chercher | ? pour les raccourcis
          </span>
        </div>
      </footer>

      {/* Keyframe for star particles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px) scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
    </main>
  );
}
