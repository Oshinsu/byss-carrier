"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { AnalysisResult, PredictionResult } from "@/types/gulf-stream";

/* ═══════════════════════════════════════════════════════
   GULF STREAM — Market Analysis
   AI analysis + prediction result display cards.
   ═══════════════════════════════════════════════════════ */

interface MarketAnalysisProps {
  analysis?: AnalysisResult;
  prediction?: PredictionResult;
}

export function MarketAnalysis({ analysis, prediction }: MarketAnalysisProps) {
  return (
    <>
      {/* Analysis result */}
      {analysis && !analysis.loading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 rounded-lg border border-cyan-500/20 bg-black/30 p-2.5"
        >
          <p className="text-[10px] leading-relaxed text-cyan-200/80">
            {analysis.analysis}
          </p>
        </motion.div>
      )}

      {/* Prediction result */}
      {prediction && !prediction.loading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 p-2.5"
        >
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span className="text-[var(--color-text-muted)]">Fair Value</span>
            <span className="font-mono font-bold text-[var(--color-gold)]">
              {(prediction.fairValue * 100).toFixed(0)}c
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between text-[10px]">
            <span className="text-[var(--color-text-muted)]">Edge</span>
            <span
              className={cn(
                "font-mono font-bold",
                prediction.edge > 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {prediction.edge > 0 ? "+" : ""}
              {(prediction.edge * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {prediction.reasoning}
          </p>
        </motion.div>
      )}
    </>
  );
}
