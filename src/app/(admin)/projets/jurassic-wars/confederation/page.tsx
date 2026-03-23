"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sword, Shield, Swords, Crown, Flame, Anchor, TreePine, ChevronDown } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

const DIPLOMATIC_CYCLE = ["Allie", "Neutre", "Hostile", "Guerre"] as const;
type DiplomaticStatus = (typeof DIPLOMATIC_CYCLE)[number];

const DIPLOMATIC_COLORS: Record<DiplomaticStatus, string> = {
  Allie: "bg-blue-400/10 text-blue-400",
  Neutre: "bg-gray-400/10 text-gray-400",
  Hostile: "bg-orange-400/10 text-orange-400",
  Guerre: "bg-red-400/10 text-red-400",
};

const DIPLOMATIC_DOT: Record<DiplomaticStatus, string> = {
  Allie: "bg-blue-400",
  Neutre: "bg-gray-400",
  Hostile: "bg-orange-400",
  Guerre: "bg-red-400",
};

const FACTIONS_DATA = [
  {
    name: "Empire Pangeen",
    leader: "L'Empereur de Mwamba",
    leaderDesc:
      "120 kilos de muscle et de dignite imperiale. Dirige depuis le Palais-Plateau — le sommet de la mesa, sans toit, ouvert au ciel. Quand il pleut, l'Empereur descend. L'Empereur ne combat pas la pluie.",
    strength: "Cavalerie lourde sur Brachiosaures, 6 000 brachiosaures domestiques",
    army: "200,000",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    defaultStatus: "Neutre" as DiplomaticStatus,
    desc: "La masse qui dure. Empire de la Grande Plaine, construit sur la laterite rouge. Mwamba, la capitale, 800 000 ames sur une mesa de 120 metres. Architecture de femurs de brachiosaure, Age du Bronze. Le Corps Imperial du Fumier est le plus grand employeur — 3 000 pelleteurs pour 2 400 tonnes de fumier par jour. Les fonctionnaires les mieux payes apres les bouchers.",
    economy:
      "Monnaie : lingots de bronze coule. Luxe : dents de T-Rex. Troc : sacs de millet. Exportations : bronze, millet, viande sechee, os de brachiosaure. Le Grand Comptage — 3 jours ou l'on compte TOUT — est la fete nationale.",
    keyFigures: [
      "Kofi le Boucher Imperial — connait les 47 morceaux d'un brachiosaure. Equipe de 30 bouchers. A vu un brachi exploser une fois.",
      "Le Compteur de Migration — fonctionnaire le plus important de l'Empire, personne ne connait son nom. S'il se trompe de 5%, une legion creve de faim.",
      "Le Nettoyeur de Cranes — 8eme de sa lignee, entretient les cranes de T-Rex avec de la resine d'ambre.",
    ],
  },
  {
    name: "Republique Volonia",
    leader: "Ratu Seri",
    leaderDesc:
      "61 ans. Dirige le Conseil des Dix depuis 23 ans. Meilleure negociatrice du monde connu — achete l'ambre 30% moins cher, vend les praos 40% plus cher. Reve secretement de terre seche, ce qui est une heresie existentielle pour une Ratu.",
    strength: "Flotte de praos, commerce maritime, Peseurs aveugles d'ambre",
    army: "300,000",
    icon: Anchor,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    defaultStatus: "Allie" as DiplomaticStatus,
    desc: "L'eau qui compte. Volonia n'est pas une ville — c'est un reseau de 47 ilots relies par des pontons de bois laque. 300 000 ames dont 40 000 vivent sur bateaux. Les maisons-praos sont reversibles : retourne ta maison, mets-la a l'eau, pars. L'architecture volonienne est la seule au monde a etre reversible.",
    economy:
      "Monnaie : ambre pesee au gramme. Le Peseur aveugle juge au poids, au toucher, a l'odeur — sa decision est finale. La Maree d'Ambre : 48h de ramassage egalitaire apres les tempetes. Les larmes de mosasaure (bonbon d'ambre comestible) coutent une journee de salaire.",
    keyFigures: [
      "Le Peseur Aveugle — en 140 ans, un Peseur ne s'est trompe qu'une seule fois. La justice volonienne nait du commerce.",
      "Ama la Tisseuse de Voiles — 40 jours par voile, 8 par an. Elle chante ses noeuds et 12 marins vivent.",
      "Le Gamin Plongeur Kito — 11 ans, descend a 15 metres en apnee sous les pilotis d'os laque.",
    ],
  },
  {
    name: "Royaume Ishtir",
    leader: "Le Roi-Pretre de Tonalli",
    leaderDesc:
      "Dirige depuis le Plateau Volcanique a 2 800 metres. Le frill de bronze au sommet de la Grande Pyramide capte le premier rayon du soleil. Le calendrier de 260 jours mesure les migrations de quetzalcoatlus. Le silence est le premier materiau de construction.",
    strength: "Pretresses-astronomes, pyramides sacrees, reseau d'aqueducs",
    army: "150,000",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    defaultStatus: "Neutre" as DiplomaticStatus,
    desc: "Le feu sacre. Tonalli, 150 000 ames, 7 pyramides a degres sur le plateau volcanique. La Grande Pyramide : 80 metres, 1 460 marches — une par jour du cycle de 4 ans. L'Observatoire-Crane : un trou en forme d'oeil de triceraptops dans le plafond, aligne avec une etoile specifique. Trois minutes par an la lumiere passe. Le Mur Calendaire : 260 niches, une pierre d'obsidienne par jour.",
    economy:
      "Monnaie : lames d'obsidienne calibrees. Luxe : poudre d'or. Le chocolatl sacre — cacao + piment + poudre d'os de quetzalcoatlus — est le Red Bull des pretresses. Le Chemin de la Corne : 40 km paves, chaque borne porte un verset. La route EST le livre.",
    keyFigures: [
      "Ixchel la Pretresse Qui Doute — 34 ans, connait 400 etoiles par leur nom. Doute que les quetzalcoatlus soient les messagers du Soleil-Dragon. A eternue pendant l'Equinoxe devant 150 000 personnes.",
      "Le Liseur de Galettes — lit les taches de brule sur les galettes de mais noir. 90% hasard, 10% agronomie. Ne le dit a personne.",
      "Itzal — le gamin du cenote. 9 ans. L'eau a le gout de pierre et de temps.",
    ],
  },
  {
    name: "Confederation Arkhan",
    leader: "Evil Pichon, le Khan",
    leaderDesc:
      "33 ans. Ne a la naissance en migration sur le dos d'un parasaurolophus. A casse la machoire d'un sub-adulte tyrannosaure avec une masse de bronze. Ti, un compsognathus de 3 kilos, dort sur son epaule gauche. Ne boit jamais plus de deux cranes de koumiss au Kuriltai — seul avantage tactique deguise en sobriete.",
    strength: "Cavalerie rapide sur raptors, tyrannosaures de guerre, mobilite totale",
    army: "50,000",
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-400/10",
    defaultStatus: "Hostile" as DiplomaticStatus,
    desc: "Le vent qui tranche. Les Arkhani n'ont pas de villes — ils ont des LIEUX. Le Kuriltai Eternel : un cercle de 500 metres trace par mille raptors marchant en rond, deux fois par an, jamais au meme endroit. Rakhad : canyon de gres rouge, 12 000 personnes en saison seche. La Tente-Raptor se monte en 8 minutes — de loin un camp ressemble a un troupeau de raptors endormis.",
    economy:
      "Le concept de monnaie n'existe pas. Le prestige EST la monnaie — tu donnes, tu recois du statut. Troc : viande. La Route du Vent : seul commerce pacifique d'Arkhan — cuir de raptor contre sel volonien. Le koumiss de parasaurolophus servi dans des cranes de raptor : refuser est une declaration de guerre.",
    keyFigures: [
      "Yara, Grand-Mere Griffes — 67 ans, monte encore. Arthrite aux mains, tire a l'arc depuis le dos de Dernier. La plus precise de la Confederation parce qu'elle ne ferme jamais sa gueule.",
      "Tano — 9 ans, premiere nuit dans la Fosse de l'Impression. A nomme son raptor Kri, le bruit de la peur.",
      "Dara, l'Apaiseure — la seule personne a rester a cote d'un tyrannosaure qui tremble et attendre que ca passe.",
    ],
  },
  {
    name: "Cites-Etats N'Goro",
    leader: "Le Conseil des Mambos",
    leaderDesc:
      "Les Mambos anciennes se reunissent dans la Salle des Cliquetis. Les dents de dinosaure dans leurs dreadlocks cliquettent. Les decisions se prennent sans parler. Elles se regardent. Elles hochent la tete. Ca marche depuis 400 ans.",
    strength: "Pharmacopee de 300+ substances, bioluminescence, mangrove imprenable",
    army: "60,000",
    icon: TreePine,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    defaultStatus: "Neutre" as DiplomaticStatus,
    desc: "Le reve qui mord. Six cites dans le delta de mangrove, chacune brille d'une couleur differente. Mbaku brille en bleu, 60 000 ames sur trois niveaux de passerelles. Krath brille en vert — la cite-pharmacie. Drek ne brille pas — la ville sans lumiere, ses habitants pleurent quand ils voient la lumiere des autres cites. Les passerelles vivantes se renforcent avec le temps : plus c'est vieux, plus ca tient.",
    economy:
      "Monnaie : fioles de poison standardisees. Une fiole de venin de spinosaure dilue vaut 10 fioles de decoction d'ecorce. Exportations : poudre de champignon (secret commercial), insectes bioluminescents (luxe), peaux de spinosaure (armure). Le bonbon de la Mambo : ambre + miel + poudre d'os. Un par jour, pas plus.",
    keyFigures: [
      "Lua, la Petite Mambo — 11 ans, trois dents dans les cheveux, trois patients gueris. Un Chanteur de Boue s'est pose dans sa main.",
      "Manu, le Guetteur de Spinosaure — tombe a 16 ans, 20 metres. L'eau noire est chaude. Il tape le pilotis : un coup, un coup, un coup. Rien. Tout va bien.",
      "La Mere des Lucioles — gere la nurserie d'insectes depuis 40 ans. Mains qui brillent en permanence. Quand elle applaudit dans le noir, deux eclairs bleus.",
    ],
  },
];

const TREATIES = [
  { name: "Traite de l'Ambre", between: "Volonia / Ishtir", since: "335 ans", desc: "Prix commun, route commune, Peseur aveugle comme arbitre." },
  { name: "Pacte des Os", between: "Arkhan / Pangeen", since: "175 ans", desc: "Neutralite des Ossaires, aucune route a moins de 2 km. Cessation des raids." },
  { name: "Accord de Songa", between: "N'Goro / Pangeen", since: "55 ans", desc: "Souverainete partagee de Songa-Est. Ne en humiliation gastro-intestinale." },
  { name: "Route du Vent", between: "Arkhan / Volonia", since: "120 ans", desc: "Cuir de raptor contre sel. Seul commerce pacifique d'Arkhan." },
  { name: "Silence de Quetz", between: "Ishtir / tous", since: "400 ans", desc: "Quetz, ville-nid des quetzalcoatlus, territoire sacre inviolable." },
];

const DEFAULT_STATUSES: Record<string, DiplomaticStatus> = Object.fromEntries(
  FACTIONS_DATA.map((f) => [f.name, f.defaultStatus])
);

export default function ConfederationPage() {
  const [statuses, setStatuses] = useLocalStorage<Record<string, DiplomaticStatus>>(STORAGE_KEYS.JW_CONFEDERATION, DEFAULT_STATUSES);
  const [expanded, setExpanded] = useState<string | null>(null);

  const cycleStatus = (factionName: string) => {
    setStatuses((prev) => {
      const current = prev[factionName] ?? "Neutre";
      const idx = DIPLOMATIC_CYCLE.indexOf(current);
      const nextIdx = idx >= DIPLOMATIC_CYCLE.length - 1 ? 0 : idx + 1;
      return { ...prev, [factionName]: DIPLOMATIC_CYCLE[nextIdx] };
    });
  };

  const summary = {
    Allie: FACTIONS_DATA.filter((f) => statuses[f.name] === "Allie").length,
    Neutre: FACTIONS_DATA.filter((f) => statuses[f.name] === "Neutre").length,
    Hostile: FACTIONS_DATA.filter((f) => statuses[f.name] === "Hostile").length,
    Guerre: FACTIONS_DATA.filter((f) => statuses[f.name] === "Guerre").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Sword className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Confederation
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            5 civilisations &middot; 3 grandes guerres &middot; 6 traites actifs
          </p>
        </div>
      </div>

      {/* Diplomatic summary */}
      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(summary) as [DiplomaticStatus, number][]).map(([status, count]) => (
          <div
            key={status}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2.5 text-center"
          >
            <div className="font-mono text-lg font-bold text-[var(--color-text)]">{count}</div>
            <div className={`text-[10px] font-medium ${DIPLOMATIC_COLORS[status].split(" ")[1]}`}>{status}</div>
          </div>
        ))}
      </div>

      {/* Factions */}
      <div className="space-y-4">
        {FACTIONS_DATA.map((f, i) => {
          const status = statuses[f.name] ?? f.defaultStatus;
          const isOpen = expanded === f.name;
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.09, duration: 0.4 }}
              className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-gold)]/30"
            >
              <div className="flex items-start gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${f.bg}`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-[family-name:var(--font-clash-display)] text-base font-bold ${f.color}`}>
                      {f.name}
                    </h3>
                    <button
                      onClick={() => cycleStatus(f.name)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${DIPLOMATIC_COLORS[status]}`}
                      title="Cliquer pour changer le statut diplomatique"
                    >
                      {status}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">Leader: {f.leader}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{f.strength}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-[var(--color-text)]">{f.army}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">population</div>
                  </div>
                  <button
                    onClick={() => setExpanded(isOpen ? null : f.name)}
                    className="text-[10px] text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-1"
                  >
                    <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    {isOpen ? "Fermer" : "Lore"}
                  </button>
                </div>
              </div>

              {/* Expanded lore panel */}
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-[var(--color-border-subtle)] px-5 pb-5 pt-4 space-y-4"
                >
                  {/* Description */}
                  <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{f.desc}</p>

                  {/* Leader backstory */}
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Leader — {f.leader}
                    </h4>
                    <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{f.leaderDesc}</p>
                  </div>

                  {/* Economy */}
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Economie & Commerce
                    </h4>
                    <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{f.economy}</p>
                  </div>

                  {/* Key figures */}
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                      Figures Notables
                    </h4>
                    <ul className="space-y-1.5">
                      {f.keyFigures.map((fig, j) => (
                        <li key={j} className="text-xs text-[var(--color-text-secondary)] pl-3 border-l-2 border-[var(--color-border-subtle)]">
                          {fig}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Treaties */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Traites & Accords actifs
          </h2>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {TREATIES.map((t) => (
            <div key={t.name} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[var(--color-text)]">{t.name}</span>
                <span className="font-mono text-[10px] text-[var(--color-gold)]">{t.since}</span>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">{t.between}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction matrix */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Matrice diplomatique
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th className="px-3 py-2 text-left text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]" />
                {FACTIONS_DATA.map((f) => (
                  <th key={f.name} className={`px-3 py-2 text-[9px] font-medium uppercase tracking-wider ${f.color}`}>
                    {f.name.split(" ").pop()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FACTIONS_DATA.map((row) => (
                <tr key={row.name} className="border-b border-[var(--color-border-subtle)] last:border-b-0">
                  <td className={`px-3 py-2 text-left text-[10px] font-medium ${row.color}`}>
                    {row.name.length > 12 ? row.name.split(" ").pop() : row.name}
                  </td>
                  {FACTIONS_DATA.map((col) => {
                    if (row.name === col.name) {
                      return (
                        <td key={col.name} className="px-3 py-2">
                          <span className="text-[10px] text-[var(--color-text-muted)]">--</span>
                        </td>
                      );
                    }
                    const rowStatus = statuses[row.name] ?? "Neutre";
                    const colStatus = statuses[col.name] ?? "Neutre";
                    const order: DiplomaticStatus[] = ["Guerre", "Hostile", "Neutre", "Allie"];
                    const pairStatus = order.find((s) => s === rowStatus || s === colStatus) ?? "Neutre";
                    return (
                      <td key={col.name} className="px-3 py-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${DIPLOMATIC_DOT[pairStatus]}`} title={pairStatus} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
