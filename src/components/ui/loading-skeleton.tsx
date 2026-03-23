"use client";

import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   SOVEREIGN — Loading Skeletons
   Dark pulsing with gold shimmer. MODE_CADIFOR.
   ═══════════════════════════════════════════════════════ */

/* ── Base shimmer class ── */
const shimmerBase =
  "animate-shimmer-gold rounded-[var(--radius-md)]";

/* ── SkeletonText ── */
interface SkeletonTextProps {
  width?: string;
  lines?: number;
  className?: string;
}

export function SkeletonText({
  width = "100%",
  lines = 1,
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(shimmerBase, "h-3.5")}
          style={{
            width:
              i === lines - 1 && lines > 1
                ? `${Math.max(40, parseInt(width) * 0.6)}%`
                : width,
          }}
        />
      ))}
    </div>
  );
}

/* ── SkeletonAvatar ── */
interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className }: SkeletonAvatarProps) {
  return (
    <div
      className={cn(shimmerBase, "shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

/* ── SkeletonCard ── */
interface SkeletonCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-5",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Gold shimmer sweep overlay */}
      <div className="pointer-events-none absolute inset-0 animate-shimmer-gold opacity-40" />
      {children ?? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SkeletonAvatar size={36} />
            <div className="flex-1 space-y-2">
              <SkeletonText width="60%" />
              <SkeletonText width="40%" />
            </div>
          </div>
          <SkeletonText lines={3} />
        </div>
      )}
    </div>
  );
}

/* ── SkeletonTable ── */
interface SkeletonTableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-border-subtle)]",
        className
      )}
    >
      {/* Header */}
      <div
        className="flex gap-4 border-b border-[var(--color-border-subtle)] px-5 py-3"
        style={{ background: "oklch(0.10 0.01 270 / 0.8)" }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={`h-${i}`}
            className={cn(shimmerBase, "h-3 flex-1")}
            style={{ maxWidth: i === 0 ? "30%" : "20%" }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`r-${r}`}
          className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] px-5 py-4 last:border-b-0"
          style={{ background: "oklch(0.12 0.01 270 / 0.4)" }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={`r${r}-c${c}`}
              className={cn(shimmerBase, "h-3.5 flex-1")}
              style={{
                maxWidth: c === 0 ? "30%" : `${15 + Math.random() * 10}%`,
                animationDelay: `${r * 0.08 + c * 0.04}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── SkeletonKPI ── */
interface SkeletonKPIProps {
  className?: string;
}

export function SkeletonKPI({ className }: SkeletonKPIProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] p-5",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.01 270 / 0.6) 0%, oklch(0.10 0.01 270 / 0.8) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 animate-shimmer-gold opacity-30" />
      <div className="flex items-start justify-between">
        <div
          className={cn(shimmerBase, "h-10 w-10 rounded-lg")}
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className={cn(shimmerBase, "h-6 w-16 rounded-full")}
          style={{ animationDelay: "0.2s" }}
        />
      </div>
      <div className="mt-4 space-y-2">
        <div
          className={cn(shimmerBase, "h-8 w-24")}
          style={{ animationDelay: "0.15s" }}
        />
        <div
          className={cn(shimmerBase, "h-3.5 w-20")}
          style={{ animationDelay: "0.25s" }}
        />
      </div>
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full animate-shimmer-gold" />
    </div>
  );
}
