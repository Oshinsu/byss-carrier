"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type ProdStatus, prodStatusConfig } from "@/lib/data/projects-registry";

/* ═══════════════════════════════════════════════════════════════
   PROJECT TIMELINE — Production milestones / episodes / sequences
   ═══════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: ProdStatus }) {
  const config = prodStatusConfig[status];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", config.bg, config.color)}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export function ProductionTimelineSection({ title, items }: { title: string; items: { id: number; title: string; status: ProdStatus }[] }) {
  const delivered = items.filter((i) => i.status === "Livré").length;
  const inProd = items.filter((i) => i.status === "En prod").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 backdrop-blur-sm"
    >
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text)]">{title}</h3>
      <div className="mb-4 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span className="text-emerald-400">{delivered} livrés</span>
        <span className="text-amber-400">{inProd} en prod</span>
        <span>{items.length - delivered - inProd} à faire</span>
      </div>
      {/* Progress bar */}
      <div className="mb-4 h-1.5 rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all"
          style={{ width: `${(delivered / items.length) * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-gold)]">
                {String(item.id).padStart(2, "0")}
              </span>
              <span className="text-xs text-[var(--color-text)]">{item.title}</span>
            </div>
            <StatusBadge status={item.status} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
