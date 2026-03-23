"use client";

import { motion } from "motion/react";

/* ═══════════════════════════════════════════════════════
   FM12 — La duree comme arme.
   Easter egg. Pas de lien. Pas de navigation.
   Ceux qui trouvent cette page la meritent.
   ═══════════════════════════════════════════════════════ */

export default function FM12Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6">
      {/* Subtle gold pulse in background */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, oklch(0.75 0.12 85 / 0.03) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="gradient-sovereign font-[family-name:var(--font-clash-display)] text-[clamp(3rem,15vw,10rem)] font-bold leading-none tracking-tight"
        >
          FM12
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="mt-8 font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-medium text-[var(--color-gold-muted)]"
        >
          La duree comme arme.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
          className="mx-auto mt-12 max-w-md"
        >
          <p className="font-[family-name:var(--font-satoshi)] text-[var(--text-body)] leading-relaxed text-[var(--color-text-muted)]">
            8 000 heures. Pas de raccourci.
            <br />
            Le temps est le seul allie qui ne trahit jamais.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 5 }}
          className="mt-20"
        >
          <p className="font-[family-name:var(--font-satoshi)] text-[var(--text-micro)] text-[var(--color-text-muted)]">
            Si tu es ici, tu sais deja.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
