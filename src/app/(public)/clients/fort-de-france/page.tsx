"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Film,
  Calendar,
  BookOpen,
  Clapperboard,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   Fort-de-France x BYSS GROUP
   "Raconter l'histoire. Autrement."
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
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

// ── Timeline An tan lontan ──
interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const timeline: TimelineEvent[] = [
  { year: "1635", title: "Premier contact", description: "Belain d'Esnambuc pose le drapeau. L'ile change de destin. Pas de consentement demande." },
  { year: "1685", title: "Code Noir", description: "La loi comme instrument de deshumanisation. Le texte juridique le plus froid de l'Histoire." },
  { year: "1794", title: "Premiere abolition", description: "La Convention abolit l'esclavage. Huit ans plus tard, Napoleon le retablit. La liberte comme mirage." },
  { year: "1848", title: "Abolition definitive", description: "Schoelcher signe le decret. Les chaines tombent. Le combat commence vraiment." },
  { year: "1902", title: "Saint-Pierre disparait", description: "La Montagne Pelee efface 30 000 vies en 2 minutes. Fort-de-France devient capitale par defaut." },
  { year: "1913", title: "Naissance de Cesaire", description: "A Basse-Pointe, un enfant nait. Il ne le sait pas encore, mais il va changer la langue." },
  { year: "1946", title: "Departementalisation", description: "La Martinique devient departement francais. Integration ou assimilation ? Le debat ne finira jamais." },
  { year: "1958", title: "Cesaire quitte le PCF", description: "Lettre a Maurice Thorez. Rupture avec le communisme. Naissance d'une pensee autonome." },
  { year: "1983", title: "Premiere loi de decentralisation", description: "Conseil regional. Autonomie administrative. Les premiers pas vers l'autodetermination institutionnelle." },
  { year: "2026", title: "BYSS GROUP", description: "Premier studio IA de la Martinique. L'ile qui produit enfin ses propres outils. La suite s'ecrit." },
];

// ── Cesaire Pixar sequences ──
interface Sequence {
  number: number;
  title: string;
  description: string;
  status: "termine" | "en_cours" | "planifie";
}

const sequences: Sequence[] = [
  { number: 1, title: "La grand-mere qui lit", description: "L'enfant decouvre les mots par la voix de sa grand-mere. La lumiere entre par les livres.", status: "planifie" },
  { number: 2, title: "Le lycee Schoelcher", description: "Fort-de-France. Le jeune Cesaire devore tout. Les professeurs ne suivent plus.", status: "planifie" },
  { number: 3, title: "La rencontre Senghor", description: "Paris, 1931. Deux etudiants noirs. Un martiniquais, un senegalais. Le monde va trembler.", status: "planifie" },
  { number: 4, title: "La Negritude", description: "Le mot qui n'existait pas. Cesaire l'invente. La langue francaise s'enrichit malgre elle.", status: "en_cours" },
  { number: 5, title: "Le Cahier", description: "Cahier d'un retour au pays natal. Le texte-eruption. Le Vesuve de la poesie francophone.", status: "en_cours" },
  { number: 6, title: "L'enseignant", description: "Retour en Martinique. Il enseigne. Parmi ses eleves : Frantz Fanon. L'histoire begaye volontairement.", status: "planifie" },
  { number: 7, title: "Le maire, 1945", description: "Elu maire de Fort-de-France. 56 ans de mandat suivront. Le plus long regne democratique de France.", status: "planifie" },
  { number: 8, title: "Le Discours, 1950", description: "Discours sur le colonialisme. Le texte qui deshabille l'Occident. Chaque phrase est un verdict.", status: "en_cours" },
  { number: 9, title: "La marche du vieil homme", description: "Cesaire age, marchant dans Fort-de-France. La ville qu'il a construite le regarde passer.", status: "planifie" },
  { number: 10, title: "Le depart", description: "17 avril 2008. La Martinique perd son poete. Le monde perd un architecte de la dignite.", status: "planifie" },
];

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  termine: { label: "Termine", color: "text-[var(--color-green)]", bg: "bg-[var(--color-green)]/10" },
  en_cours: { label: "En cours", color: "text-[var(--color-amber)]", bg: "bg-[var(--color-amber)]/10" },
  planifie: { label: "Planifie", color: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-2)]" },
};

export default function FortDeFrancePage() {
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
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 pt-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.12 85 / 0.04) 0%, transparent 60%)",
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
            <MapPin className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] text-[var(--color-text-muted)]">
              Projet client
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 1 }}
            className="font-[family-name:var(--font-clash-display)] text-[clamp(1.8rem,6vw,4rem)] font-bold leading-tight tracking-tight text-[var(--color-white)]"
          >
            Fort-de-France{" "}
            <span className="gradient-sovereign">&times; BYSS GROUP</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-satoshi)] text-lg text-[var(--color-text)]"
          >
            Raconter l&apos;histoire. Autrement.
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-3 max-w-md font-[family-name:var(--font-satoshi)] text-[var(--text-small)] italic text-[var(--color-text-muted)]"
          >
            &ldquo;Une ville qui ne connait pas son histoire est une ville qui marche les yeux fermes.&rdquo;
          </motion.p>
        </motion.div>
      </section>

      {/* ════════════════════ AN TAN LONTAN ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[var(--color-gold)]" />
              <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] font-medium uppercase tracking-[0.2em] text-[var(--color-gold-muted)]">
                Docuserie
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 font-[family-name:var(--font-clash-display)] text-[var(--text-h1)] font-bold text-[var(--color-white)]"
            >
              An tan lontan
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-3 max-w-xl font-[family-name:var(--font-satoshi)] text-[var(--color-text-muted)]"
            >
              10 episodes. De 1635 a aujourd&apos;hui. L&apos;histoire de la Martinique racontee par ceux qui la vivent.
            </motion.p>

            {/* Production badge */}
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5 px-3 py-1.5 font-[family-name:var(--font-satoshi)] text-[var(--text-micro)] font-medium text-[var(--color-amber)]">
                <Clock className="h-3 w-3" />
                En developpement
              </span>
            </motion.div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="relative"
          >
            {/* Vertical line */}
            <div className="absolute bottom-0 left-[39px] top-0 w-px bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-border)] to-transparent md:left-1/2" />

            {timeline.map((event, i) => (
              <motion.div
                key={event.year}
                variants={i % 2 === 0 ? fadeUp : slideLeft}
                transition={{ duration: 0.6 }}
                className={`relative mb-12 flex items-start gap-6 ${
                  i % 2 === 0
                    ? "md:flex-row md:text-right"
                    : "md:flex-row-reverse md:text-left"
                }`}
              >
                {/* Content — left or right on desktop */}
                <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                  <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-bold text-[var(--color-gold)]">
                    {event.year}
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-clash-display)] text-[var(--text-h3)] font-semibold text-[var(--color-white)]">
                    {event.title}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-satoshi)] text-[var(--text-small)] leading-relaxed text-[var(--color-text-muted)]">
                    {event.description}
                  </p>
                </div>

                {/* Node */}
                <div className="absolute left-7 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-gold)] bg-[var(--color-bg)] md:left-1/2 md:-translate-x-1/2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-gold)]" />
                </div>

                {/* Spacer for opposite side on desktop */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ CESAIRE PIXAR ════════════════════ */}
      <section className="relative px-6 py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex items-center gap-3">
              <Clapperboard className="h-5 w-5 text-[var(--color-gold)]" />
              <span className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] font-medium uppercase tracking-[0.2em] text-[var(--color-gold-muted)]">
                Animation IA
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-4 font-[family-name:var(--font-clash-display)] text-[var(--text-h1)] font-bold text-[var(--color-white)]"
            >
              Cesaire{" "}
              <span className="gradient-sovereign">Pixar</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-3 max-w-xl font-[family-name:var(--font-satoshi)] text-[var(--color-text-muted)]"
            >
              10 sequences animees par IA. La vie d&apos;Aime Cesaire en qualite cinematographique. Production video IA a 99.96% de marge.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-amber)]/20 bg-[var(--color-amber)]/5 px-3 py-1.5 font-[family-name:var(--font-satoshi)] text-[var(--text-micro)] font-medium text-[var(--color-amber)]">
                <Film className="h-3 w-3" />
                Production active
              </span>
            </motion.div>
          </motion.div>

          {/* Sequence cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid gap-5 sm:grid-cols-2"
          >
            {sequences.map((seq) => {
              const status = statusLabels[seq.status];
              return (
                <motion.div
                  key={seq.number}
                  variants={scaleIn}
                  transition={{ duration: 0.5 }}
                  className="glass group rounded-[var(--radius-lg)] p-6 transition-all duration-300 hover:border-[var(--color-gold-muted)] hover:shadow-[var(--shadow-gold)]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)]">
                        <span className="font-[family-name:var(--font-clash-display)] text-[var(--text-small)] font-bold text-[var(--color-gold)]">
                          {seq.number.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-clash-display)] text-[var(--text-body)] font-semibold text-[var(--color-white)]">
                        {seq.title}
                      </h3>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[var(--text-micro)] font-medium ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-satoshi)] text-[var(--text-small)] leading-relaxed text-[var(--color-text-muted)]">
                    {seq.description}
                  </p>
                </motion.div>
              );
            })}
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
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5"
          >
            <Sparkles className="h-6 w-6 text-[var(--color-gold)]" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="font-[family-name:var(--font-clash-display)] text-[var(--text-h2)] font-bold text-[var(--color-white)]"
          >
            Un projet similaire ?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-4 font-[family-name:var(--font-satoshi)] text-[var(--color-text-muted)]"
          >
            Nous transformons l&apos;heritage en experience. Video IA, docuserie, animation.
            Le passe merite le futur.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] px-7 py-3.5 font-[family-name:var(--font-satoshi)] font-semibold text-[var(--color-bg)] transition-all hover:shadow-[var(--shadow-gold)]"
            >
              Nous contacter
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-7 py-3.5 font-[family-name:var(--font-satoshi)] font-medium text-[var(--color-text)] transition-all hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
            >
              Retour au QG
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
