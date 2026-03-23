"use client";

import { motion } from "motion/react";
import { Star, Brain, Mail, FileText, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────── */
export interface Prospect {
  id: string;
  company: string;
  contact: string;
  sector: string;
  score: number; // 1-5
  probability: number; // 0-100
  basket: number; // estimated € value
  memorablePhrase: string;
  aiScore: "fire" | "warm" | "cold";
  stage: string;
}

interface ProspectCardProps {
  prospect: Prospect;
  onAction: (action: "analyse" | "email" | "proposition" | "score" | "suggest", prospect: Prospect) => void;
}

const aiScoreConfig = {
  fire: { emoji: "\uD83D\uDD25", label: "Hot", glow: "shadow-[0_0_12px_oklch(0.60_0.20_15/0.5)]" },
  warm: { emoji: "\uD83D\uDFE1", label: "Warm", glow: "shadow-[0_0_12px_oklch(0.75_0.15_75/0.4)]" },
  cold: { emoji: "\uD83D\uDD35", label: "Cold", glow: "shadow-[0_0_12px_oklch(0.65_0.15_250/0.4)]" },
};

/* ─── Component ──────────────────────────────────────── */
export function ProspectCard({ prospect, onAction }: ProspectCardProps) {
  const ai = aiScoreConfig[prospect.aiScore];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative cursor-pointer rounded-lg p-3",
        "bg-[oklch(0.12_0.01_270/0.6)] backdrop-blur-md",
        "border border-[var(--color-border-subtle)]",
        "transition-all duration-200",
        "hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
      )}
    >
      {/* ── Header row ── */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            {prospect.company}
          </h4>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {prospect.contact}
          </p>
        </div>
        {/* AI Score Badge */}
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm",
            "bg-[var(--color-surface-2)]",
            ai.glow
          )}
          title={ai.label}
        >
          {ai.emoji}
        </div>
      </div>

      {/* ── Sector tag ── */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {prospect.sector}
        </span>
      </div>

      {/* ── Score stars ── */}
      <div className="mb-2 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < prospect.score
                ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                : "text-[var(--color-border)]"
            )}
          />
        ))}
        <span className="ml-2 text-[10px] text-[var(--color-text-muted)]">
          {prospect.probability}%
        </span>
      </div>

      {/* ── Basket ── */}
      <div className="mb-2 text-xs font-medium text-[var(--color-gold)]">
        {prospect.basket.toLocaleString("fr-FR")} EUR/mois
      </div>

      {/* ── Memorable phrase ── */}
      {prospect.memorablePhrase && (
        <p className="mb-3 text-[10px] italic leading-tight text-[var(--color-fire)]">
          &ldquo;{prospect.memorablePhrase}&rdquo;
        </p>
      )}

      {/* ── IA Action buttons (THINK / DRAFT / PROPOSE) ── */}
      <div className="flex gap-1 border-t border-[var(--color-border-subtle)] pt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onAction("analyse", prospect); }}
          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-surface-2)] px-2 py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-gold-glow)] hover:text-[var(--color-gold)]"
          title="THINK — Analyse profonde (SPIN + neuro-selling + Sun Tzu)"
        >
          <Brain className="h-3 w-3" />
          <span className="hidden min-[1400px]:inline">Think</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction("email", prospect); }}
          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-surface-2)] px-2 py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-gold-glow)] hover:text-[var(--color-gold)]"
          title="DRAFT — Email MODE_CADIFOR"
        >
          <Mail className="h-3 w-3" />
          <span className="hidden min-[1400px]:inline">Draft</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction("proposition", prospect); }}
          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-[var(--color-surface-2)] px-2 py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-gold-glow)] hover:text-[var(--color-gold)]"
          title="PROPOSE — Proposition 3 options (Essentiel/Croissance/Domination)"
        >
          <FileText className="h-3 w-3" />
          <span className="hidden min-[1400px]:inline">Propose</span>
        </button>
      </div>
      {/* ── SCORE + SUGGEST row ── */}
      <div className="mt-1 flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onAction("score", prospect); }}
          className="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[9px] font-medium transition-colors hover:bg-[#EF444415] hover:text-[#EF4444]"
          style={{ color: "var(--color-text-muted)" }}
          title="SCORE — Temperature dynamique Claude"
        >
          <Flame className="h-2.5 w-2.5" />
          Score
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction("suggest", prospect); }}
          className="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[9px] font-medium transition-colors hover:bg-[#00D4FF15] hover:text-[#00D4FF]"
          style={{ color: "var(--color-text-muted)" }}
          title="SUGGEST — Prochaine action concrete"
        >
          <Zap className="h-2.5 w-2.5" />
          Suggest
        </button>
      </div>
    </motion.div>
  );
}
