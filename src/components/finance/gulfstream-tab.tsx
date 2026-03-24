"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Zap,
  ShieldCheck,
  TrendingUp,
  Target,
  Bot,
  DollarSign,
  Clock,
  Wallet,
  CheckSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   GULF STREAM TAB — 3 circles, opportunities, action plan
   ═══════════════════════════════════════════════════════ */

const GULF_OPPORTUNITIES = [
  { title: "Arbitrage Logique (Polymarket)", risk: "Quasi-nul", riskColor: "var(--color-green)", returnText: "1-5%/semaine", build: "1 semaine", capital: "$500", icon: ShieldCheck },
  { title: "Market Making (spread)", risk: "Faible", riskColor: "var(--color-blue)", returnText: "1-3%/mois constant", build: "2 semaines", capital: "$2 000-5 000", icon: TrendingUp },
  { title: "Latency Arbitrage (BTC/ETH)", risk: "Moyen", riskColor: "var(--color-amber)", returnText: "98% win rate r\u00E9f.", build: "2-3 semaines", capital: "$1 000-5 000", icon: Zap },
  { title: "Information Edge (Polyseer + phi)", risk: "Moyen", riskColor: "var(--color-amber)", returnText: "March\u00E9s niche long-tail", build: "3-4 semaines", capital: "$1 000-10 000", icon: Target },
  { title: "BYSS Finance (service PME)", risk: "Tr\u00E8s faible", riskColor: "var(--color-green)", returnText: "MRR additionnel", build: "Mois 6+", capital: "\u20AC0", icon: Bot },
];

const GULF_PLAN = [
  { phase: "Phase 0 \u2014 Setup (semaine 1)", tasks: ["Cr\u00E9er wallet Coinbase (agentic wallet)", "D\u00E9ployer $500 USDC sur Polygon via Base bridge", "Installer OpenClaw + Polyclaw + Polymarket/agents", "Installer Polyseer (pip install polyseer)", "Build scanner arbitrage logique avec Claude Code", "Premier trade MANUEL ($5-10)"] },
  { phase: "Phase 1 \u2014 Arbitrage logique (sem. 2-4)", tasks: ["Agent arb logique op\u00E9rationnel 24/7", "Scanner 415+ march\u00E9s actifs Polymarket", "Backtester sur donn\u00E9es historiques", "Objectif: $50-100 profit sur $500", "Phi-engine check confiance chaque trade"] },
  { phase: "Phase 2 \u2014 Market Making (mois 2)", tasks: ["D\u00E9ployer market making bot sur 5 march\u00E9s liquides", "Spreads conservateurs 2-5%", "Phi-engine surveille volatilit\u00E9", "Objectif: 1-2% mensuel constant", "Capital: $2 000 (r\u00E9investissement Phase 1)"] },
  { phase: "Phase 3 \u2014 Latency Arb (mois 2-3)", tasks: ["WebSocket Binance + Polymarket CLOB", "Bot march\u00E9s 5-15min BTC/ETH/SOL", "Ex\u00E9cution <5 secondes", "Capital RING-FENCED (wallet s\u00E9par\u00E9)", "Stop loss auto \u00E0 -10% du capital allou\u00E9"] },
  { phase: "Phase 4 \u2014 Info Edge (mois 3-4)", tasks: ["Polyseer + Claude Deep Research + phi-engine", "March\u00E9s politiques, tech, g\u00E9opolitique", "Kelly criterion pour sizing positions", "Agent ne parie QUE quand phi > seuil", "Capital: $5 000"] },
  { phase: "Phase 5 \u2014 BYSS Finance (mois 6+)", tasks: ["Publier r\u00E9sultats (anonymis\u00E9s) sur byssgroup.fr", "Service Agent Finance pour PME martiniquaises", "CCI/MEDEF pitch: agents comptables pilot\u00E9s par IA", "x402 merchant node: micropaiements", "Les profits trading FINANCENT la croissance BYSS GROUP"] },
];

const GULF_PLAN_STORAGE_KEY = "byss-gulfstream-plan-checked";

export function GulfstreamTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  /* Load checked state from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(GULF_PLAN_STORAGE_KEY);
      if (stored) setChecked(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const toggleTask = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(GULF_PLAN_STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)] p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-gold)]">
          Op{"\u00E9"}ration Gulf Stream v3
        </h2>
        <p className="mt-1 text-sm text-[var(--color-gold-muted)]">3 cercles. 4 strat{"\u00E9"}gies. R{"\u00E8"}gles du Paladin. Phi-guardrail.</p>
      </div>

      {/* 3 Circles Architecture */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { circle: "Intelligence", color: "#3B82F6", icon: Globe, desc: "Polyseer (Bay\u00E9sien) + Claude Deep Research + DeFiLlama + News/Social", cost: "Gratuit" },
          { circle: "Ex\u00E9cution", color: "#00B4D8", icon: Zap, desc: "4 strat\u00E9gies : Arbitrage logique, Market making, Latence, Info edge", cost: "$500-10K capital" },
          { circle: "Protection", color: "#EF4444", icon: ShieldCheck, desc: "Phi-engine guardrail + Kelly criterion + Kill switch + Max 5%/trade", cost: "Phi-engine" },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.circle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border p-5"
              style={{ borderColor: `${c.color}40`, background: `${c.color}08` }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-5 w-5" style={{ color: c.color }} />
                <span className="font-[family-name:var(--font-display)] text-sm font-bold" style={{ color: c.color }}>
                  Cercle {i + 1} — {c.circle}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{c.desc}</p>
              <p className="mt-2 text-[10px] font-semibold" style={{ color: c.color }}>{c.cost}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Paladin Rules */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-gold)]">
          <ShieldCheck className="h-4 w-4" />
          R{"\u00E8"}gles du Paladin
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Jamais >5% du capital sur un seul trade",
            "Ring-fencing : chaque strat\u00E9gie a son wallet",
            "Journal Sorel : chaque trade document\u00E9",
            "Kill switch phi : 3 ticks sous seuil = STOP ALL",
            "30 premiers jours = apprentissage",
            "BYSS GROUP d'abord \u2014 trading = foyer additionnel",
            "R\u00E8gle Ner\u00EBl : noter le feeling",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-[var(--color-surface-2)] px-3 py-2">
              <span className="mt-0.5 text-[10px] font-bold text-[var(--color-gold)]">{i + 1}.</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { stat: "$50B", label: "march\u00E9 global" },
          { stat: "44%", label: "\u00E9quipes finance d\u00E9ploient agents" },
          { stat: "52%", label: "retour moyen fonds agentiques" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center"
          >
            <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-gold)]">{s.stat}</p>
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Opportunities */}
      <div>
        <h3 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">Opportunit{"\u00E9"}s</h3>
        <div className="grid grid-cols-5 gap-3">
          {GULF_OPPORTUNITIES.map((opp, i) => {
            const Icon = opp.icon;
            return (
              <motion.div key={opp.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[oklch(1_0_0/0.02)] to-transparent" />
                <div className="mb-3 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-[var(--color-gold)]" />
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                    style={{ backgroundColor: `color-mix(in oklch, ${opp.riskColor} 15%, transparent)`, color: opp.riskColor }}
                  >{opp.risk}</span>
                </div>
                <h4 className="mb-2 text-xs font-bold text-[var(--color-text)]">{opp.title}</h4>
                <div className="space-y-1 text-[10px] text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-[var(--color-green)]" />{opp.returnText}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{opp.build}</div>
                  <div className="flex items-center gap-1"><Wallet className="h-3 w-3" />{opp.capital}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Plan */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h3 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          Plan d&apos;action 90 jours
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {GULF_PLAN.map((phase, pi) => (
            <div key={phase.phase}>
              <p className="mb-2 text-xs font-bold text-[var(--color-gold)]">{phase.phase}</p>
              <div className="space-y-2">
                {phase.tasks.map((task) => {
                  const key = `${pi}-${task}`;
                  const isDone = !!checked[key];
                  return (
                    <button key={key} onClick={() => toggleTask(key)} className="flex w-full items-start gap-2 text-left transition-colors">
                      {isDone ? (
                        <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                      ) : (
                        <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                      )}
                      <span className={cn("text-[11px] leading-tight", isDone ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text)]")}>
                        {task}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
