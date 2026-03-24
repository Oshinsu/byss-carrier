"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  UserPlus,
  Mail,
  Landmark,
  Sparkles,
  TrendingUp,
  Terminal,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────── */
interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: "navigate" | "fetch";
  href?: string;
  apiEndpoint?: string;
}

const ACTIONS: QuickAction[] = [
  {
    id: "nouveau-prospect",
    label: "Nouveau Prospect",
    icon: UserPlus,
    color: "#10B981",
    action: "navigate",
    href: "/pipeline",
  },
  {
    id: "invoquer-sorel",
    label: "Invoquer Sorel",
    icon: Mail,
    color: "#3B82F6",
    action: "navigate",
    href: "/emails",
  },
  {
    id: "scanner-marches",
    label: "Scanner Marches",
    icon: Landmark,
    color: "#F59E0B",
    action: "fetch",
    apiEndpoint: "/api/marches/scan",
  },
  {
    id: "briefing-du-jour",
    label: "Briefing du Jour",
    icon: Sparkles,
    color: "var(--color-gold)",
    action: "navigate",
    href: "#briefing",
  },
  {
    id: "scan-polymarket",
    label: "Scan Polymarket",
    icon: TrendingUp,
    color: "#06B6D4",
    action: "fetch",
    apiEndpoint: "/api/polymarket",
  },
  {
    id: "jarvis",
    label: "JARVIS",
    icon: Terminal,
    color: "#8B5CF6",
    action: "navigate",
    href: "/jarvis",
  },
];

/* ─── Quick Actions Component ─────────────────────────── */
export function QuickActions() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const handleAction = async (action: QuickAction) => {
    if (action.action === "navigate" && action.href) {
      if (action.href.startsWith("#")) {
        // Scroll to section
        const el = document.getElementById(action.href.slice(1));
        el?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      router.push(action.href);
      return;
    }

    if (action.action === "fetch" && action.apiEndpoint) {
      setLoadingId(action.id);
      setResult(null);
      try {
        const res = await fetch(action.apiEndpoint);
        if (res.ok) {
          const data = await res.json();
          const count = data?.count ?? data?.markets?.length ?? data?.length ?? 0;
          setResult({
            id: action.id,
            message: `${count} resultats detectes`,
          });
        } else {
          setResult({
            id: action.id,
            message: `Erreur ${res.status}`,
          });
        }
      } catch {
        setResult({ id: action.id, message: "Connexion echouee" });
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold-muted)]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Actions Rapides
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          const isLoading = loadingId === action.id;
          const hasResult = result?.id === action.id;

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.55 + i * 0.05 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(action)}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all",
                "border-[var(--color-border-subtle)] bg-[var(--color-surface)]",
                "text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]",
                "disabled:opacity-60",
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon
                  className="h-4 w-4"
                  style={{ color: action.color }}
                />
              )}
              <span>{hasResult ? result.message : action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
