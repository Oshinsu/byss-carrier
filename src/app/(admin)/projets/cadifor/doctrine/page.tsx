"use client";

import { motion } from "motion/react";
import { Award, Minimize2, Users, MessageSquare, Crown, Lightbulb, Laugh, Eye, Zap, BookOpen, Landmark, Sprout, Palette, UserCheck, Globe } from "lucide-react";

const LAWS = [
  {
    number: 1,
    title: "Compression souveraine",
    description: "Chaque mesure doit gagner sa place. Pas de programme de 200 pages que personne ne lit. 20 mesures. Chacune tient en une phrase. Si elle a besoin d'un paragraphe pour etre comprise, elle n'est pas prete.",
    icon: Minimize2,
  },
  {
    number: 2,
    title: "Confiance absolue dans le peuple",
    description: "Ne jamais expliquer ce qui se voit. Ne jamais justifier ce qui se fait. Le peuple martiniquais n'est pas idiot — il est las. La difference est immense. On ne lui parle pas comme a un enfant. On lui parle comme Marjory parle a Rose : en exigeant qu'il soit a la hauteur.",
    icon: Users,
  },
  {
    number: 3,
    title: "Stichomythie souveraine",
    description: "En communication politique : des phrases courtes. Pas de langue de bois. Pas de \"il faut que\", pas de \"nous devons\". Des actes. Des dates. Des chiffres. Le creole est naturellement stichomythique — utiliser cette force.",
    icon: MessageSquare,
  },
  {
    number: 4,
    title: "Souverainete, jamais justification",
    description: "Ne jamais se justifier. Justifier c'est reculer. Expliquer oui. Justifier non. Quand on attaque, on repond par une mesure, pas par un communique.",
    icon: Crown,
  },
  {
    number: 5,
    title: "Lux comme syntaxe",
    description: "Le luxe n'est pas dans les moyens — il est dans la precision. Un budget transparent est plus luxueux qu'un discours fleuri. Un tableau de bord citoyen en temps reel est plus luxueux qu'une promesse de transparence.",
    icon: Lightbulb,
  },
  {
    number: 6,
    title: "Humour comme preuve de hauteur",
    description: "Ne jamais etre solennel sans necessite. Le rire est caribeen. Le rire est martiniquais. Le rire est la preuve qu'on n'est pas consume par le pouvoir. Viki rit. Le peuple rit. Le gouvernant qui ne rit pas est un gouvernant qui a peur.",
    icon: Laugh,
  },
  {
    number: 7,
    title: "Detail qui pense",
    description: "Chaque micro-action doit prouver la maitrise du systeme. Publier les marches publics en open data n'est pas une mesure spectaculaire — c'est un detail qui prouve qu'on a compris comment fonctionne le pouvoir reel.",
    icon: Eye,
  },
  {
    number: 8,
    title: "Phrase memorable comme unite minimale",
    description: "Chaque intervention publique doit produire au moins une phrase que les gens repeteront. Pas un slogan marketing — une verite si dense qu'elle se transmet toute seule.",
    icon: Zap,
  },
];

const PILIERS = [
  {
    title: "Numerique",
    subtitle: "L'arme que personne d'autre n'a",
    description: "Hub IA caribeen. Formation massive au code. Administration 100% numerique. Open data integral. Incubateur de startups. La Martinique comme Silicon Valley des Antilles.",
    icon: BookOpen,
  },
  {
    title: "Terre",
    subtitle: "Le sol d'abord",
    description: "Souverainete alimentaire. Agroecologie. Circuits courts. Lutte anti-chlordecone. Reconquete fonciere. Fin du monopole beke sur la terre par l'intelligence, pas par la violence.",
    icon: Sprout,
  },
  {
    title: "Culture",
    subtitle: "L'economie invisible",
    description: "SOTAI comme modele. Production audiovisuelle caribeenne. Export de la culture martiniquaise. Dancehall, cuisine, art, langue creole comme produits d'exportation. La Martinique comme marque mondiale.",
    icon: Palette,
  },
  {
    title: "Jeunesse",
    subtitle: "Stop a l'hemorragie",
    description: "Raisons de rester. Raisons de revenir. Formation, emploi, logement, culture. Parler aux 18-35 ans dans leur langue, sur leurs plateformes, avec leurs codes.",
    icon: UserCheck,
  },
  {
    title: "Caraibe",
    subtitle: "Le reseau plutot que l'isolement",
    description: "CARICOM (accord signe 2026). Reseau insulaire. Diplomatie de l'utilite. La Martinique comme hub, pas comme terminus.",
    icon: Globe,
  },
];

export default function DoctrinePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Award className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Doctrine
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            MODE_CADIFOR — 8 Lois
          </p>
        </div>
      </div>

      {/* Le Troisieme Chemin */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-5"
      >
        <h2 className="mb-2 font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
          Le Troisieme Chemin
        </h2>
        <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          Ni assimilationnisme — l&apos;ile merite mieux qu&apos;un departement tropical.
          Ni independantisme sans plan — la souverainete sans modele economique est un suicide.
        </p>
        <p className="text-xs font-medium leading-relaxed text-[var(--color-text)]">
          Souverainete fonctionnelle. On ne change pas le statut. On change le modele.
          On utilise chaque competence de la CTM au maximum. On cree de la puissance economique endogene.
          On rend l&apos;ile indispensable dans la Caraibe. Et le jour ou le statut devra changer,
          ce sera le statut qui courra apres la realite — pas l&apos;inverse.
        </p>
      </motion.div>

      {/* Laws grid */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
          Les 8 Lois
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LAWS.map((law, i) => (
            <motion.div
              key={law.number}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold)]/30"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
                  <law.icon className="h-4 w-4 text-[var(--color-gold)]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[var(--color-gold-muted)]">LOI {law.number}</span>
                  <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
                    {law.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {law.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Les 5 Piliers */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
          Les 5 Piliers
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PILIERS.map((pilier, i) => (
            <motion.div
              key={pilier.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
              className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-gold)]/30"
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
                <pilier.icon className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              </div>
              <h3 className="font-[family-name:var(--font-clash-display)] text-xs font-bold text-[var(--color-text)]">
                {pilier.title}
              </h3>
              <p className="mb-1 text-[10px] text-[var(--color-gold-muted)]">
                {pilier.subtitle}
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                {pilier.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="border-l-2 border-[var(--color-gold)]/30 pl-4 text-xs italic text-[var(--color-text-secondary)]"
      >
        &ldquo;Le comte mineur ne demande pas la permission de devenir un Empire.
        Il le devient, et le monde s&apos;adapte.&rdquo;
      </motion.p>
    </div>
  );
}
