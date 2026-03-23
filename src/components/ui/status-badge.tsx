"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  config?: Record<string, { label: string; color: string; dot?: string }>;
  size?: "sm" | "md";
}

const defaultConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: "bg-emerald-500/10 text-emerald-400" },
  dev: { label: "En dev", color: "bg-amber-500/10 text-amber-400" },
  pause: { label: "Pause", color: "bg-gray-500/10 text-gray-400" },
  draft: { label: "Brouillon", color: "bg-gray-500/10 text-gray-400" },
  sent: { label: "Envoyee", color: "bg-blue-500/10 text-blue-400" },
  paid: { label: "Payee", color: "bg-emerald-500/10 text-emerald-400" },
  overdue: { label: "Impayee", color: "bg-red-500/10 text-red-400" },
  cancelled: { label: "Annulee", color: "bg-gray-500/10 text-gray-400" },
  planifie: { label: "Planifie", color: "bg-gray-500/10 text-gray-400" },
  en_cours: { label: "En cours", color: "bg-blue-500/10 text-blue-400" },
  teste: { label: "Teste", color: "bg-purple-500/10 text-purple-400" },
  deploye: { label: "Deploye", color: "bg-emerald-500/10 text-emerald-400" },
  fire: { label: "Chaud", color: "bg-red-500/10 text-red-400" },
  warm: { label: "Tiede", color: "bg-amber-500/10 text-amber-400" },
  cold: { label: "Froid", color: "bg-blue-500/10 text-blue-400" },
};

export function StatusBadge({ status, config, size = "sm" }: StatusBadgeProps) {
  const cfg = (config ?? defaultConfig)[status] ?? { label: status, color: "bg-gray-500/10 text-gray-400" };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      cfg.color,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
    )}>
      {cfg.label}
    </span>
  );
}
