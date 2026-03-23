"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Flame, Music, Star, Play } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   TOXIC — Le feu sacre en creole.
   "Gary ecrit mieux quand il saigne que quand il brille."
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

interface Track {
  title: string;
  grade: number;
  description: string;
  top5: boolean;
}

const tracks: Track[] = [
  { title: "Maybe One Day", grade: 16.7, description: "L'espoir comme arme blanche. Creole et anglais. Lame a double tranchant.", top5: true },
  { title: "Plus loin", grade: 16.5, description: "Distance comme doctrine. On ne revient pas. On avance ou on disparait.", top5: true },
  { title: "Vannevar", grade: 15.8, description: "Hommage a Vannevar Bush. L'information comme pouvoir. Le savoir comme territoire.", top5: true },
  { title: "Forgemagie", grade: 15.3, description: "L'alchimie du verbe. Transformer le plomb des jours en or des nuits.", top5: true },
  { title: "Differente des autres", grade: 15.2, description: "Portrait de celle qui refuse le moule. Singularite comme identite.", top5: true },
  { title: "Acier", grade: 14.8, description: "La resilience n'est pas un mot. C'est un materiau.", top5: false },
  { title: "Nuit rouge", grade: 14.5, description: "Chronique d'une insomnie productive. Le feu brule aussi dans le noir.", top5: false },
  { title: "972", grade: 14.3, description: "Code postal. Code genetique. Code d'honneur.", top5: false },
  { title: "Souverain", grade: 14.1, description: "Manifeste personnel. La couronne se forge, ne se donne pas.", top5: false },
  { title: "Creole noir", grade: 13.9, description: "La langue comme armure. Le creole comme epee.", top5: false },
  { title: "Signal", grade: 13.7, description: "Dans le bruit, une frequence. Dans le chaos, une direction.", top5: false },
  { title: "Marge", grade: 13.5, description: "Vivre en peripherie. Penser depuis le centre.", top5: false },
  { title: "Volcan", grade: 13.3, description: "La Pelee comme metaphore. Dormant ne veut pas dire mort.", top5: false },
  { title: "Trajectoire", grade: 13.1, description: "La balistique du destin. Angle de tir. Vitesse initiale. Impact.", top5: false },
  { title: "Ancrage", grade: 12.9, description: "Les racines ne sont pas des chaines. Elles sont des fondations.", top5: false },
  { title: "Protocol", grade: 12.7, description: "Regles du jeu. Ceux qui les ecrivent gagnent toujours.", top5: false },
  { title: "Derive", grade: 12.5, description: "Se perdre pour mieux cartographier. L'errance comme methode.", top5: false },
  { title: "Cendre", grade: 12.3, description: "Ce qui reste apres le feu. Pas rien. Le necessaire.", top5: false },
];

function GradeBar({ grade }: { grade: number }) {
  const percentage = (grade / 20) * 100;
  const isTop = grade >= 15.2;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: isTop
              ? "linear-gradient(90deg, #E94560, #FF6B6B)"
              : "linear-gradient(90deg, var(--color-gold-muted), var(--color-gold))",
          }}
        />
      </div>
      <span
        className={`font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-semibold ${
          isTop ? "text-[#E94560]" : "text-[var(--color-gold)]"
        }`}
      >
        {grade.toFixed(1)}
      </span>
    </div>
  );
}

export default function ToxicPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)]">
      {/* ── Nav ── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
          >
            <ArrowLeft className="h-4 w-4" />
            BYSS GROUP
          </Link>
        </div>
      </nav>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Fire glow background */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.25 15 / 0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/3 top-2/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.25 15 / 0.04) 0%, transparent 60%)",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E94560]/20 bg-[#E94560]/5 px-4 py-2"
          >
            <Flame className="h-4 w-4 text-[#E94560]" />
            <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[#E94560]/80">
              Rap creole
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-clash-display)] text-[clamp(3rem,14vw,9rem)] font-bold leading-none tracking-tight"
            style={{
              background: "linear-gradient(135deg, #E94560, #FF6B6B, #E94560)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TOXIC
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-8 max-w-lg font-[family-name:var(--font-satoshi)] text-lg text-[var(--color-text)] md:text-xl"
          >
            Le feu sacre en creole.
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-4 max-w-sm font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]"
          >
            18 titres. Chacun est une brulure.
          </motion.p>
        </motion.div>
      </section>

      {/* ════════════════════ CATALOGUE ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E94560]/30 to-transparent" />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] font-medium uppercase tracking-[0.2em] text-[#E94560]/60"
            >
              Catalogue
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 font-[family-name:var(--font-clash-display)] text-[var(--text-h1)] font-bold text-[var(--color-white)]"
            >
              18 titres.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #E94560, #FF6B6B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Notes sur 20.
              </span>
            </motion.h2>
          </motion.div>

          {/* Top 5 highlight */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="mb-12"
          >
            <div className="mb-6 flex items-center gap-2">
              <Star className="h-4 w-4 text-[#E94560]" />
              <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-semibold uppercase tracking-wider text-[#E94560]">
                Top 5
              </span>
            </div>

            <div className="space-y-3">
              {tracks
                .filter((t) => t.top5)
                .map((track, i) => (
                  <motion.div
                    key={track.title}
                    variants={slideIn}
                    transition={{ duration: 0.5 }}
                    className="group flex items-start gap-4 rounded-[var(--radius-lg)] border border-[#E94560]/10 bg-[#E94560]/[0.03] p-5 transition-all duration-300 hover:border-[#E94560]/30 hover:bg-[#E94560]/[0.06]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E94560]/20 bg-[#E94560]/10">
                      <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-bold text-[#E94560]">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Play className="h-3.5 w-3.5 text-[#E94560]/60" />
                          <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-semibold text-[var(--color-white)]">
                            {track.title}
                          </h3>
                        </div>
                        <GradeBar grade={track.grade} />
                      </div>
                      <p className="mt-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] leading-relaxed text-[var(--color-text-muted)]">
                        {track.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Rest of catalog */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <div className="mb-6 flex items-center gap-2">
              <Music className="h-4 w-4 text-[var(--color-gold-muted)]" />
              <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-semibold uppercase tracking-wider text-[var(--color-gold-muted)]">
                Catalogue complet
              </span>
            </div>

            <div className="space-y-2">
              {tracks
                .filter((t) => !t.top5)
                .map((track) => (
                  <motion.div
                    key={track.title}
                    variants={slideIn}
                    transition={{ duration: 0.4 }}
                    className="glass group flex items-start gap-4 rounded-[var(--radius-md)] p-4 transition-all duration-300 hover:border-[var(--color-gold-muted)]"
                  >
                    <Play className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-body)] font-medium text-[var(--color-text)]">
                          {track.title}
                        </h3>
                        <GradeBar grade={track.grade} />
                      </div>
                      <p className="mt-1 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]">
                        {track.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ PHILOSOPHY ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#E94560]/20 bg-[#E94560]/5"
          >
            <Flame className="h-7 w-7 text-[#E94560]" />
          </motion.div>
          <motion.blockquote
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-clash-display)] text-[var(--text-h2)] font-bold leading-tight text-[var(--color-white)]"
          >
            &ldquo;Gary ecrit mieux quand il saigne que quand il brille.&rdquo;
          </motion.blockquote>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="mt-6 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]"
          >
            Toxic n&apos;est pas un album. C&apos;est un incendie controle.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-4 font-[family-name:var(--font-satoshi)] font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
            >
              Retour au QG
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
