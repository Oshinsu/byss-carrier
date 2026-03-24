"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────── */
interface KpiWidgetProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  delay?: number;
}

/* ─── KPI Widget Component ──────────────────────────── */
export function KpiWidget({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
}: KpiWidgetProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      color: "text-[var(--color-green)]",
      bg: "bg-[var(--color-green)]/10",
    },
    down: {
      icon: TrendingDown,
      color: "text-[var(--color-fire)]",
      bg: "bg-[var(--color-fire)]/10",
    },
    neutral: {
      icon: Minus,
      color: "text-[var(--color-text-muted)]",
      bg: "bg-[var(--color-surface-2)]",
    },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-5 transition-colors hover:border-[var(--color-gold-muted)]"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover gold glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-gold)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.06]" />

      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Icon className="h-5 w-5 text-[var(--color-gold)]" />
        </div>

        {/* Trend */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1",
            trendConfig[trend].bg
          )}
        >
          <TrendIcon className={cn("h-3 w-3", trendConfig[trend].color)} />
          <span
            className={cn(
              "text-[11px] font-medium",
              trendConfig[trend].color
            )}
          >
            {trendValue}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-gold)]">
          {value}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{title}</p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
    </motion.div>
  );
}
