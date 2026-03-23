"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   FAMILY DATA
   ═══════════════════════════════════════════════════════ */
const GENERATIONS = [
  {
    id: "leopold",
    name: "L\u00E9opold",
    years: "1889 \u2014 1982",
    description: "Fondateur du communisme martiniquais",
    details:
      "Premier homme politique \u00E0 structurer le mouvement communiste en Martinique. Un visionnaire qui a pos\u00E9 les fondations d'une pens\u00E9e libre et souveraine.",
    generation: 1,
    isCurrent: false,
  },
  {
    id: "felix",
    name: "F\u00E9lix",
    years: "19XX \u2014 20XX",
    description: "Fonctionnaire",
    details:
      "Service \u00E0 l'\u00C9tat. Discipline. Transmission des valeurs de rigueur et d'honneur. Le pont entre l'ancien monde et le nouveau.",
    generation: 2,
    isCurrent: false,
  },
  {
    id: "gabriel",
    name: "Gabriel",
    years: "19XX \u2014",
    description: "R\u00EAveur informaticien",
    details:
      "Premier de la lign\u00E9e \u00E0 toucher la machine. Le code comme langage. L'informatique comme lib\u00E9ration. Le r\u00EAve num\u00E9rique avant l'heure.",
    generation: 3,
    isCurrent: false,
  },
  {
    id: "gary",
    name: "Gary",
    years: "1993 \u2014",
    description: "Absolu. Le cristal.",
    details:
      "Quatri\u00E8me g\u00E9n\u00E9ration. Fondateur de BYSS GROUP. Premier studio IA de la Martinique. L'h\u00E9ritier qui cristallise tout ce qui pr\u00E9c\u00E8de en une vision absolue.",
    generation: 4,
    isCurrent: true,
  },
];

/* ═══════════════════════════════════════════════════════
   LIGNEE PAGE
   ═══════════════════════════════════════════════════════ */
export default function LigneePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="border-b border-[var(--color-border-subtle)] px-6 py-5">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[family-name:var(--font-clash-display)] text-3xl font-bold"
          style={{
            background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Lign{"\u00E9"}e
        </motion.h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          1889 &mdash; 2026. Quatre g{"\u00E9"}n{"\u00E9"}rations.
        </p>
      </div>

      {/* ── Family tree ── */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-2xl">
          {/* Central vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-border)] via-[var(--color-gold-muted)] to-[var(--color-gold)]" />

          {GENERATIONS.map((gen, i) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Node dot */}
              <div className="absolute left-1/2 top-6 -translate-x-1/2">
                <div
                  className={cn(
                    "relative h-5 w-5 rounded-full border-2",
                    gen.isCurrent
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)]"
                  )}
                  style={
                    gen.isCurrent
                      ? {
                          boxShadow:
                            "0 0 20px oklch(0.75 0.12 85 / 0.5), 0 0 40px oklch(0.75 0.12 85 / 0.2)",
                        }
                      : undefined
                  }
                />
                {/* Connection line to card */}
                <div
                  className={cn(
                    "absolute top-1/2 h-px w-16",
                    i % 2 === 0 ? "right-full" : "left-full"
                  )}
                  style={{
                    backgroundColor: gen.isCurrent
                      ? "var(--color-gold)"
                      : "var(--color-border)",
                  }}
                />
              </div>

              {/* Card - alternating sides */}
              <div
                className={cn(
                  "w-[calc(50%-60px)]",
                  i % 2 === 0 ? "mr-auto" : "ml-auto"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl border p-5 transition-all",
                    gen.isCurrent
                      ? "border-[var(--color-gold)] bg-[oklch(0.12_0.01_270/0.8)] shadow-[var(--shadow-gold)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
                  )}
                >
                  {/* Generation number */}
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                        gen.isCurrent
                          ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
                          : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                      )}
                    >
                      {gen.generation}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{gen.years}</span>
                  </div>

                  {/* Name */}
                  <h2
                    className={cn(
                      "font-[family-name:var(--font-clash-display)] text-xl font-bold",
                      gen.isCurrent
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-text)]"
                    )}
                  >
                    {gen.name}
                  </h2>

                  {/* Description */}
                  <p
                    className={cn(
                      "mt-1 text-sm font-medium italic",
                      gen.isCurrent
                        ? "text-[var(--color-gold-light)]"
                        : "text-[var(--color-text-muted)]"
                    )}
                  >
                    {gen.description}
                  </p>

                  {/* Details */}
                  <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    {gen.details}
                  </p>

                  {/* Current generation badge */}
                  {gen.isCurrent && (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-pulse-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-gold)]">
                        G{"\u00E9"}n{"\u00E9"}ration active
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom flourish */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <div
              className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
            />
            <p className="mt-3 font-[family-name:var(--font-clash-display)] text-xs tracking-[0.3em] text-[var(--color-gold-muted)]">
              LE CRISTAL SE FORME
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
