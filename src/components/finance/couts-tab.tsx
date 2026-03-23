"use client";

import { motion } from "motion/react";
import type { CostItem, MarginItem } from "@/types/finance";
import { eur } from "@/types/finance";

/* ═══════════════════════════════════════════════════════
   COUTS TAB — Fixed costs table + margin analysis
   ═══════════════════════════════════════════════════════ */

const COSTS: CostItem[] = [
  { cat: "Hosting (Vercel, Supabase, Sentry)", mensuel: 100, notes: "Orion + Byss Emploi" },
  { cat: "API IA (Claude, GPT, Cohere)", mensuel: 150, notes: "Variable" },
  { cat: "Outils (Notion, Claude Code, Supermemory)", mensuel: 50, notes: "" },
  { cat: "Ads (Google Ads propres campagnes)", mensuel: 200, notes: "" },
  { cat: "Juridique (Legalstart, comptable)", mensuel: 100, notes: "" },
];

const MARGINS: MarginItem[] = [
  { label: "Clip vid\u00E9o IA (standard)", cost: "~\u20AC5 API + temps", price: "750\u20AC", margin: 99, color: "var(--color-green)" },
  { label: "Pack annuel 72 vid\u00E9os", cost: "~\u20AC360 API/an", price: "45 000\u20AC/an", margin: 99, color: "var(--color-green)" },
  { label: "Marketing Growth", cost: "~\u20AC50 outils/mois", price: "1 500\u20AC/mois", margin: 97, color: "var(--color-green)" },
  { label: "Orion SaaS Pro", cost: "~\u20AC20 infra/mois", price: "249\u20AC/mois", margin: 92, color: "var(--color-gold)" },
  { label: "\u00C9pisode s\u00E9rie (MOOSTIK)", cost: "~\u20AC15 API + temps", price: "2 500\u20AC", margin: 99, color: "var(--color-green)" },
];

export function CoutsTab() {
  const totalCosts = COSTS.reduce((s, c) => s + c.mensuel, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
          <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            Structure de co\u00FBts fixes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                {["Cat\u00E9gorie", "Mensuel", "Notes"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COSTS.map((c) => (
                <tr key={c.cat} className="border-b border-[var(--color-border-subtle)] last:border-0">
                  <td className="px-4 py-3 text-xs text-[var(--color-text)]">{c.cat}</td>
                  <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-gold)]">~{eur(c.mensuel)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{c.notes}</td>
                </tr>
              ))}
              <tr className="bg-[var(--color-surface-2)]">
                <td className="px-4 py-3 text-xs font-bold text-[var(--color-text)]">TOTAL CO\u00DBTS FIXES</td>
                <td className="px-4 py-3 font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-gold)]">~{eur(totalCosts)}/mois</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          Analyse des marges
        </h2>
        <div className="space-y-4">
          {MARGINS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="mb-1.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[var(--color-text)]">{m.label}</span>
                  <span className="ml-2 text-[10px] text-[var(--color-text-muted)]">co\u00FBt {m.cost} — vendu {m.price}</span>
                </div>
                <span className="font-[family-name:var(--font-display)] text-sm font-bold" style={{ color: m.color }}>
                  {m.margin}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.margin}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${m.color}, oklch(0.82 0.10 85))`, boxShadow: `0 0 10px ${m.color}` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
