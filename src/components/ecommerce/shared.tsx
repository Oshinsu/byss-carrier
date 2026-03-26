"use client";

import { ShoppingCart, Globe } from "lucide-react";
import { competitionConfig, type MarketAnalysis } from "@/lib/ecommerce";

export function ScoreBadge({ score, small }: { score: number; small?: boolean }) {
  const color = score >= 75 ? "emerald" : score >= 50 ? "cyan" : score >= 30 ? "amber" : "red";
  const colorMap = { emerald: "#10B981", cyan: "#00D4FF", amber: "#F59E0B", red: "#EF4444" };
  return (
    <span
      className={`rounded-full font-mono font-bold ${small ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-0.5 text-[10px]"}`}
      style={{ backgroundColor: `${colorMap[color]}20`, color: colorMap[color] }}
    >
      {score}/100
    </span>
  );
}

export function CompetitionBadge({ level }: { level: MarketAnalysis["competitionLevel"] }) {
  const cfg = competitionConfig(level);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Globe }) {
  return (
    <div className="rounded-lg bg-[var(--color-surface-2)] p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-cyan-400" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className="text-xs text-[var(--color-text)]">{value || "N/A"}</p>
    </div>
  );
}

export function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "#00D4FF", emerald: "#10B981", amber: "#F59E0B", red: "#EF4444",
  };
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
      <p className="font-mono text-lg font-bold" style={{ color: colorMap[color] || "#00D4FF" }}>{value}</p>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      {sub && <p className="text-[9px] text-[var(--color-text-muted)]">{sub}</p>}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-subtle)] py-16">
      <ShoppingCart className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
      <p className="text-sm italic text-[var(--color-text-muted)]">{text}</p>
    </div>
  );
}
