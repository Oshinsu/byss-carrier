"use client";

import { motion } from "motion/react";
import {
  Megaphone,
  Video,
  Bot,
  Monitor,
  Sparkles,
} from "lucide-react";
import type { MrrDataPoint, RevenueLine } from "@/types/finance";
import { eur } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   MRR TAB — MRR chart, revenue breakdown, scenarios
   ═══════════════════════════════════════════════════════ */

const MRR_DATA: MrrDataPoint[] = [
  { month: "Mar", value: 0 },
  { month: "Avr", value: 0 },
  { month: "Mai", value: 6000 },
  { month: "Juin", value: 6099 },
  { month: "Jul", value: 9500 },
  { month: "Ao\u00FB", value: 9500 },
  { month: "Sep", value: 14500 },
  { month: "Oct", value: 34500 },
  { month: "Nov", value: 34500 },
  { month: "D\u00E9c", value: 34500 },
  { month: "Jan 27", value: 154500 },
  { month: "F\u00E9v 27", value: 154500 },
];

const REVENUE_LINES: RevenueLine[] = [
  { icon: Megaphone, label: "Wizzee \u2014 Google Ads + Meta (T\u00E9l\u00E9com Antilles)", unitPrice: "800-1 500\u20AC/mois", clients: 1, mrrTotal: 800, annual: 9600, color: "var(--color-blue)" },
  { icon: Megaphone, label: "GoodCircle \u2014 Google Ads + Meta (B2B ESG/RSE)", unitPrice: "800-1 500\u20AC/mois", clients: 1, mrrTotal: 800, annual: 9600, color: "var(--color-blue)" },
  { icon: Video, label: "Digicel (via WITH-YOU) \u2014 72 vid\u00E9os/an, 2 marques", unitPrice: "750\u20AC HT/vid\u00E9o", clients: 1, mrrTotal: 4500, annual: 54000, color: "var(--color-fire)" },
  { icon: Video, label: "Fort-de-France (via BIXA) \u2014 An tan lontan + C\u00E9saire Pixar", unitPrice: "2 500\u20AC/\u00E9pisode", clients: 1, mrrTotal: 0, annual: 0, color: "var(--color-amber)" },
  { icon: Video, label: "Clips artistes \u2014 Evil P, Krys, Mercenaire, Marginal", unitPrice: "750-1 500\u20AC/clip", clients: 4, mrrTotal: 0, annual: 6000, color: "var(--color-fire)" },
  { icon: Bot, label: "Orion SaaS \u2014 CMO Unifi\u00E9 multi-agents", unitPrice: "99-449\u20AC/mois", clients: 0, mrrTotal: 0, annual: 0, color: "var(--color-green)" },
  { icon: Monitor, label: "Diffusion MOOSTIK \u2014 Martinique 1\u00E8re", unitPrice: "Droits \u00E0 n\u00E9gocier", clients: 1, mrrTotal: 0, annual: 0, color: "var(--color-gold)" },
];

export function MrrTab() {
  const chartMax = Math.max(...MRR_DATA.map((d) => d.value));
  const totalMRR = REVENUE_LINES.reduce((s, r) => s + r.mrrTotal, 0);

  return (
    <div className="space-y-6">
      {/* MRR Chart */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          MRR Evolution
        </h2>
        <div className="flex h-52 items-end gap-3 px-2">
          {MRR_DATA.map((point, i) => {
            const heightPct = (point.value / chartMax) * 100;
            return (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-[var(--color-gold)]">{eur(point.value)}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[var(--color-gold)] to-[var(--color-gold-light)]"
                  style={{ boxShadow: "0 0 12px oklch(0.75 0.12 85 / 0.2)" }}
                />
                <span className="text-[10px] text-[var(--color-text-muted)]">{point.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          Revenue Breakdown — Objectifs
        </h2>
        <div className="space-y-3">
          {REVENUE_LINES.map((line, i) => {
            const Icon = line.icon;
            return (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklch, ${line.color} 15%, transparent)` }}
                >
                  <Icon className="h-4 w-4" style={{ color: line.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--color-text)]">{line.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{line.unitPrice} x {line.clients} clients</p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-display)] text-sm font-bold" style={{ color: line.color }}>
                    {eur(line.mrrTotal)}/mois
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{eur(line.annual)}/an</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.06)] p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-gold)]">
              TOTAL MRR POTENTIEL
            </span>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-gold)]">
              ~{eur(totalMRR)}/mois
            </p>
            <p className="text-xs text-[var(--color-gold-muted)]">~{eur(totalMRR * 12)}/an</p>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "Sc\u00E9nario A", desc: "Consulting seul", range: "85-150K\u20AC", color: "var(--color-blue)", pct: 25 },
          { name: "Sc\u00E9nario B", desc: "Consulting + Orion SaaS", range: "500K-1.2M\u20AC", color: "var(--color-gold)", pct: 100 },
        ].map((sc) => (
          <motion.div
            key={sc.name}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">{sc.name}</h3>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold" style={{ color: sc.color }}>
                {sc.range}
              </span>
            </div>
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">{sc.desc}</p>
            <div className="h-2 rounded-full bg-[var(--color-surface-2)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sc.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: sc.color, boxShadow: `0 0 10px ${sc.color}` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
