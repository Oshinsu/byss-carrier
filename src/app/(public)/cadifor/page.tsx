"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Crown, Flame, Shield, Swords, Zap } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   CADIFOR — 997 pages. Le systeme d'exploitation cognitif.
   "Le detail n'est pas un ornement. C'est la preuve."
   ═══════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// ── 8 Laws of MODE_CADIFOR ──
const laws = [
  {
    number: "I",
    title: "Lux as syntax",
    body: "Le luxe n'est pas un prix. C'est une precision. Chaque mot pese. Chaque silence compte. La syntaxe est l'architecture de la pensee.",
    icon: Crown,
  },
  {
    number: "II",
    title: "L'humour comme preuve de hauteur",
    body: "Celui qui rit de lui-meme possede l'altitude. L'humour n'est pas une faiblesse. C'est la signature de celui qui voit plus loin.",
    icon: Zap,
  },
  {
    number: "III",
    title: "Le detail qui pense",
    body: "Un bouton mal place trahit une vision floue. Le detail n'est pas decoration. C'est intention cristallisee.",
    icon: BookOpen,
  },
  {
    number: "IV",
    title: "La phrase memorable",
    body: "Si on ne peut pas la citer de memoire, elle n'existait pas. Ecrire pour l'oubli est un crime contre l'intelligence.",
    icon: Flame,
  },
  {
    number: "V",
    title: "Compression",
    body: "Dix mots la ou cent suffiraient a un mediocre. La compression est le signe du maitre. Le bavardage, celui de l'imposteur.",
    icon: Shield,
  },
  {
    number: "VI",
    title: "Stichomythie",
    body: "Dialogue comme duel. Chaque replique est une lame. Pas de filler. Pas de transition molle. Du tranchant.",
    icon: Swords,
  },
  {
    number: "VII",
    title: "Pas de justification",
    body: "On n'explique pas le soleil. Le texte se suffit ou il echoue. Aucune note de bas de page ne sauvera une phrase faible.",
    icon: Crown,
  },
  {
    number: "VIII",
    title: "Text stream",
    body: "L'ecriture comme flux continu. Pas de plan preetabli. La pensee dicte. La main suit. Le resultat surprend celui qui ecrit.",
    icon: Zap,
  },
];

// ── Characters ──
const characters = [
  {
    name: "Marjory",
    role: "97/100 combat. Architecte de civilisation.",
    color: "from-red-500 to-orange-500",
    initial: "M",
  },
  {
    name: "Rose",
    role: "La souveraine integree.",
    color: "from-pink-500 to-rose-500",
    initial: "R",
  },
  {
    name: "Viki",
    role: "La joie qui ne s'excuse pas.",
    color: "from-amber-400 to-yellow-500",
    initial: "V",
  },
  {
    name: "Aberthol",
    role: "La fondation.",
    color: "from-blue-500 to-cyan-500",
    initial: "A",
  },
  {
    name: "Evil Pichon",
    role: "Le feu.",
    color: "from-red-600 to-red-900",
    initial: "E",
  },
  {
    name: "Cadifor",
    role: "Le tout.",
    color: "from-[var(--color-gold)] to-[var(--color-gold-light)]",
    initial: "C",
  },
];

export default function CadiforPage() {
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
        {/* Background glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.12 85 / 0.05) 0%, transparent 60%)",
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
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2"
          >
            <BookOpen className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]">
              Doctrine
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="gradient-sovereign font-[family-name:var(--font-clash-display)] text-[clamp(3rem,12vw,8rem)] font-bold leading-none tracking-tight"
          >
            CADIFOR
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl font-[family-name:var(--font-satoshi)] text-lg text-[var(--color-text)] md:text-xl"
          >
            997 pages. 15 personnages. 1 systeme d&apos;exploitation cognitif.
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-4 max-w-md font-[family-name:var(--font-satoshi)] text-[var(--text-small)] italic text-[var(--color-text-muted)]"
          >
            &ldquo;Le detail n&apos;est pas un ornement. C&apos;est la preuve.&rdquo;
          </motion.p>
        </motion.div>

        {/* Scroll line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="h-12 w-px animate-pulse bg-gradient-to-b from-[var(--color-gold-muted)] to-transparent" />
        </motion.div>
      </section>

      {/* ════════════════════ 8 LOIS ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-20 text-center"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] font-medium uppercase tracking-[0.2em] text-[var(--color-gold-muted)]"
            >
              Fondations
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 font-[family-name:var(--font-clash-display)] text-[var(--text-h1)] font-bold text-[var(--color-white)]"
            >
              Les 8 lois du{" "}
              <span className="gradient-sovereign">MODE_CADIFOR</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-2"
          >
            {laws.map((law) => (
              <motion.div
                key={law.number}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                className="glass group rounded-[var(--radius-lg)] p-8 transition-all duration-300 hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold-muted)] bg-[var(--color-surface-2)]">
                    <law.icon className="h-4 w-4 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-micro)] font-medium text-[var(--color-gold-muted)]">
                      Loi {law.number}
                    </span>
                    <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-semibold text-[var(--color-white)]">
                      {law.title}
                    </h3>
                  </div>
                </div>
                <p className="font-[family-name:var(--font-satoshi)] text-[var(--text-body)] leading-relaxed text-[var(--color-text-muted)]">
                  {law.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ PERSONNAGES ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-20 text-center"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] font-medium uppercase tracking-[0.2em] text-[var(--color-gold-muted)]"
            >
              Pantheon
            </motion.span>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 font-[family-name:var(--font-clash-display)] text-[var(--text-h1)] font-bold text-[var(--color-white)]"
            >
              Les architectes du{" "}
              <span className="gradient-sovereign">systeme</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {characters.map((char) => (
              <motion.div
                key={char.name}
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                className="glass group rounded-[var(--radius-lg)] p-8 text-center transition-all duration-300 hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
              >
                {/* Avatar */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${char.color}`}>
                    <span className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-white">
                      {char.initial}
                    </span>
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-semibold text-[var(--color-white)]">
                  {char.name}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] italic text-[var(--color-text-muted)]">
                  {char.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="font-[family-name:var(--font-clash-display)] text-[var(--text-h2)] font-bold text-[var(--color-white)]"
          >
            L&apos;univers attend.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-4 font-[family-name:var(--font-satoshi)] text-[var(--color-text-muted)]"
          >
            997 pages ne se resument pas. Elles se vivent.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-8 py-4 font-[family-name:var(--font-satoshi)] font-semibold text-[var(--color-bg)] transition-all hover:shadow-[var(--shadow-gold)]"
            >
              Retour au QG
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
