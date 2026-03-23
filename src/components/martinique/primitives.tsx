"use client";

import { cn } from "@/lib/utils";

/* =================================================================
   SHARED PRIMITIVES — Used across all martinique tabs
   ================================================================= */

export function ImperialGlass({ children, className, glow }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-[#00D4FF15] p-4", className)}
      style={{
        background: "linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.7) 100%)",
        backdropFilter: "blur(16px)",
        boxShadow: glow ? `inset 0 1px 0 rgba(0,212,255,0.1), 0 0 20px ${glow}` : "inset 0 1px 0 rgba(0,212,255,0.1)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <h3
      className="mb-3 flex items-center gap-2 font-[family-name:var(--font-clash-display)] text-[11px] font-bold uppercase tracking-[0.2em]"
      style={{ color: color || "#00D4FF" }}
    >
      <span className="h-px flex-1 opacity-20" style={{ background: color || "#00D4FF" }} />
      {children}
      <span className="h-px flex-1 opacity-20" style={{ background: color || "#00D4FF" }} />
    </h3>
  );
}

export function MetricCell({ label, value, sub, alert }: { label: string; value: string; sub?: string; alert?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 rounded border border-[#00D4FF10] bg-[#0A1628] px-3 py-2">
      <span className="text-[9px] uppercase tracking-widest text-[#00D4FF80]">{label}</span>
      <span className={cn("font-[family-name:var(--font-clash-display)] text-lg font-bold", alert ? "text-[#FF2D2D]" : "text-[#00D4FF]")}>
        {value}
      </span>
      {sub && <span className="text-[9px] text-[#ffffff40]">{sub}</span>}
    </div>
  );
}

export function InfluenceBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-2.5 w-2 rounded-sm" style={{ background: i < level ? "#00B4D8" : "#0A1628" }} />
      ))}
    </div>
  );
}

export function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 truncate text-[10px] text-[#ffffff50]">{label}</span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#0A1628]">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${(value / max) * 100}%`, background: color, opacity: 0.8 }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-[10px] font-semibold text-[#00D4FF]">{value}%</span>
    </div>
  );
}

export function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#FF2D2D40] bg-[#FF2D2D10] px-2.5 py-0.5">
      <div className="relative h-2 w-2">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#FF2D2D]" />
        <div className="relative h-2 w-2 rounded-full bg-[#FF2D2D]" />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF2D2D]">LIVE</span>
    </div>
  );
}
