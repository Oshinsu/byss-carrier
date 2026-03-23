"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonKPI } from "./loading-skeleton";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — Stat/KPI Card
   Glass card. Clash Display. Gold hover glow. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  subtitle?: string;
  loading?: boolean;
  delay?: number;
  className?: string;
  iconColor?: string;
  tooltip?: string;
  color?: string;
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "+",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "-",
  },
  neutral: {
    icon: Minus,
    color: "text-[var(--color-text-muted)]",
    bg: "bg-[var(--color-surface-2)]",
    label: "",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendValue,
  subtitle,
  loading = false,
  delay = 0,
  className,
  iconColor,
  tooltip,
  color,
}: StatCardProps) {
  if (loading) {
    return <SkeletonKPI className={className} />;
  }

  const tc = trendConfig[trend];
  const TrendIcon = tc.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      title={tooltip}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-5 transition-colors hover:border-[var(--color-gold-muted)]",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Hover gold glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-gold)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.06]" />

      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconColor
              ? `bg-${iconColor}/10`
              : "bg-[var(--color-gold-glow)]"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              iconColor ?? "text-[var(--color-gold)]"
            )}
          />
        </div>

        {trendValue && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1",
              tc.bg
            )}
          >
            <TrendIcon className={cn("h-3 w-3", tc.color)} />
            <span className={cn("text-[11px] font-medium", tc.color)}>
              {trendValue}
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-gold)]">
          {value}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]/60">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
    </motion.div>
  );
}
