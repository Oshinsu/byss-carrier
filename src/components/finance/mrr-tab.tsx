"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Megaphone,
  Video,
  Bot,
  Monitor,
  Sparkles,
  TrendingUp,
  Receipt,
} from "lucide-react";
import type { MrrDataPoint, RevenueLine, Invoice } from "@/types/finance";
import { eur } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   MRR TAB — Real Supabase data + revenue breakdown + scenarios
   ═══════════════════════════════════════════════════════ */

const REVENUE_LINES: RevenueLine[] = [
  { icon: Megaphone, label: "Wizzee \u2014 Google Ads + Meta (T\u00e9l\u00e9com Antilles)", unitPrice: "800-1 500\u20ac/mois", clients: 1, mrrTotal: 800, annual: 9600, color: "var(--color-blue)" },
  { icon: Megaphone, label: "GoodCircle \u2014 Google Ads + Meta (B2B ESG/RSE)", unitPrice: "800-1 500\u20ac/mois", clients: 1, mrrTotal: 800, annual: 9600, color: "var(--color-blue)" },
  { icon: Video, label: "Digicel (via WITH-YOU) \u2014 72 vid\u00e9os/an, 2 marques", unitPrice: "750\u20ac HT/vid\u00e9o", clients: 1, mrrTotal: 4500, annual: 54000, color: "var(--color-fire)" },
  { icon: Video, label: "Fort-de-France (via BIXA) \u2014 An tan lontan + C\u00e9saire Pixar", unitPrice: "2 500\u20ac/\u00e9pisode", clients: 1, mrrTotal: 0, annual: 0, color: "var(--color-amber)" },
  { icon: Video, label: "Clips artistes \u2014 Evil P, Krys, Mercenaire, Marginal", unitPrice: "750-1 500\u20ac/clip", clients: 4, mrrTotal: 0, annual: 6000, color: "var(--color-fire)" },
  { icon: Bot, label: "Orion SaaS \u2014 CMO Unifi\u00e9 multi-agents", unitPrice: "99-449\u20ac/mois", clients: 0, mrrTotal: 0, annual: 0, color: "var(--color-green)" },
  { icon: Monitor, label: "Diffusion MOOSTIK \u2014 Martinique 1\u00e8re", unitPrice: "Droits \u00e0 n\u00e9gocier", clients: 1, mrrTotal: 0, annual: 0, color: "var(--color-gold)" },
];

interface MrrTabProps {
  invoices: Invoice[];
  loading: boolean;
}

/** Build last 12 months of MRR from real MRR invoices */
function buildMrrTimeline(invoices: Invoice[]): MrrDataPoint[] {
  const now = new Date();
  const months: MrrDataPoint[] = [];
  const MONTH_LABELS = ["Jan", "F\u00e9v", "Mar", "Avr", "Mai", "Juin", "Jul", "Ao\u00fb", "Sep", "Oct", "Nov", "D\u00e9c"];

  for (let offset = 11; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = MONTH_LABELS[d.getMonth()] + (d.getFullYear() !== now.getFullYear() ? ` ${String(d.getFullYear()).slice(2)}` : "");

    // Sum all paid MRR invoices in this month
    const mrrValue = invoices
      .filter((inv) => inv.type === "MRR" && inv.status === "Pay\u00e9e" && inv.issue_date?.startsWith(key))
      .reduce((s, inv) => s + (inv.amount_ht || 0), 0);

    months.push({ month: label, value: mrrValue });
  }
  return months;
}

export function MrrTab({ invoices, loading }: MrrTabProps) {
  /* Compute MRR from real Supabase invoices */
  const mrrData = useMemo(() => buildMrrTimeline(invoices), [invoices]);
  const chartMax = Math.max(...mrrData.map((d) => d.value), 1);

  /* Current MRR = sum of paid MRR invoices this month */
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMRR = invoices
    .filter((inv) => inv.type === "MRR" && inv.status === "Pay\u00e9e" && inv.issue_date?.startsWith(currentMonth))
    .reduce((s, inv) => s + (inv.amount_ht || 0), 0);

  /* All-time MRR revenue */
  const totalMRRRevenue = invoices
    .filter((inv) => inv.type === "MRR" && inv.status === "Pay\u00e9e")
    .reduce((s, inv) => s + (inv.amount_ht || 0), 0);

  /* MRR invoices count */
  const activeMRRCount = invoices.filter((inv) => inv.type === "MRR" && inv.status !== "Brouillon").length;

  const totalMRRTarget = REVENUE_LINES.reduce((s, r) => s + r.mrrTotal, 0);

  return (
    <div className="space-y-6">
      {/* Real MRR KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "MRR Actuel", value: currentMRR, icon: TrendingUp, color: "var(--color-gold)" },
          { label: "MRR Objectif", value: totalMRRTarget, icon: Sparkles, color: "var(--color-blue)" },
          { label: "CA MRR Total", value: totalMRRRevenue, icon: Receipt, color: "var(--color-green)" },
          { label: "Factures MRR", value: activeMRRCount, icon: Receipt, color: "var(--color-gold)", raw: true },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: kpi.color }} />
                <span className="text-xs text-[var(--color-text-muted)]">{kpi.label}</span>
              </div>
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded bg-[var(--color-surface-2)]" />
              ) : (
                <p className="font-[family-name:var(--font-display)] text-xl font-bold" style={{ color: kpi.color }}>
                  {"raw" in kpi && kpi.raw ? kpi.value : eur(kpi.value as number)}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* MRR Chart — from real data */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          MRR Evolution (12 derniers mois)
        </h2>
        {loading ? (
          <div className="flex h-52 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent" />
          </div>
        ) : (
          <div className="flex h-52 items-end gap-3 px-2">
            {mrrData.map((point, i) => {
              const heightPct = chartMax > 0 ? (point.value / chartMax) * 100 : 0;
              return (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] font-medium text-[var(--color-gold)]">{eur(point.value)}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 2)}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-t-md bg-gradient-to-t from-[var(--color-gold)] to-[var(--color-gold-light)]"
                    style={{ boxShadow: "0 0 12px oklch(0.75 0.12 85 / 0.2)" }}
                  />
                  <span className="text-[10px] text-[var(--color-text-muted)]">{point.month}</span>
                </div>
              );
            })}
          </div>
        )}
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
              ~{eur(totalMRRTarget)}/mois
            </p>
            <p className="text-xs text-[var(--color-gold-muted)]">~{eur(totalMRRTarget * 12)}/an</p>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "Sc\u00e9nario A", desc: "Consulting seul", range: "85-150K\u20ac", color: "var(--color-blue)", pct: 25 },
          { name: "Sc\u00e9nario B", desc: "Consulting + Orion SaaS", range: "500K-1.2M\u20ac", color: "var(--color-gold)", pct: 100 },
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
