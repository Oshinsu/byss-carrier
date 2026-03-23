"use client";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — Badge Component
   Pill shape. Glow hover. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "gold";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  BadgeVariant,
  { base: string; dot: string; glow: string }
> = {
  default: {
    base: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]",
    dot: "bg-[var(--color-text-muted)]",
    glow: "hover:shadow-[0_0_12px_oklch(0.60_0.02_270/0.2)]",
  },
  success: {
    base: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "hover:shadow-[0_0_12px_oklch(0.72_0.19_155/0.25)]",
  },
  warning: {
    base: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    glow: "hover:shadow-[0_0_12px_oklch(0.75_0.15_75/0.25)]",
  },
  danger: {
    base: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
    glow: "hover:shadow-[0_0_12px_oklch(0.60_0.20_15/0.25)]",
  },
  info: {
    base: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
    glow: "hover:shadow-[0_0_12px_oklch(0.65_0.15_250/0.25)]",
  },
  gold: {
    base: "bg-[var(--color-gold-glow)] text-[var(--color-gold)] border-[var(--color-gold)]/20",
    dot: "bg-[var(--color-gold)]",
    glow: "hover:shadow-[0_0_12px_oklch(0.75_0.12_85/0.3)]",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

const dotSizeMap: Record<BadgeSize, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

const iconSizeMap: Record<BadgeSize, string> = {
  sm: "[&>svg]:h-2.5 [&>svg]:w-2.5",
  md: "[&>svg]:h-3 [&>svg]:w-3",
  lg: "[&>svg]:h-3.5 [&>svg]:w-3.5",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className,
}: BadgeProps) {
  const config = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-shadow duration-200",
        config.base,
        config.glow,
        sizeStyles[size],
        icon && iconSizeMap[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("shrink-0 rounded-full", config.dot, dotSizeMap[size])}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
