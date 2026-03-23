"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Map, Landmark, Shield, ChevronDown, Eye, EyeOff, Users, Maximize2, Bone, ExternalLink, Waves, Mountain, Wind, TreePine as TreeIcon } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   JURASSIC WARS — Carte des Territoires
   Real lore from ARCHITECTURE_DU_MONDE + LE_MONDE_VIT + LE_LORE_VIVANT
   ═══════════════════════════════════════════════════════ */

const SITE_URL = "https://jurrasic-wars.vercel.app/fr";

function Tooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute -top-20 left-1/2 z-50 w-56 -translate-x-1/2 rounded-lg border border-[var(--color-border-subtle)] bg-[#1a1a2e] p-3 text-xs opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
      <p className="text-[var(--color-text)]">{label}</p>
    </div>
  );
}

const FACTION_CITIES: Record<string, { name: string; desc: string }[]> = {
  "Empire Pangeen": [
    { name: "Mwamba", desc: "Capitale, 800 000 ames. Mesa de laterite rouge, 120 m. 3 rampes helicoidales en spirale d'ammonite. Le Palais-Plateau n'a pas de toit — le ciel EST le toit." },
    { name: "Urnok", desc: "Ville-marche, 200 000. Pas de murailles — un anneau de greniers fait rempart. Prendre Urnok = prendre la bouffe de 6 legions." },
    { name: "Dakai", desc: "Ville des forges. Vallee volcanique. Toute la ville recouverte de patine verte — fumees de fonderie. A Dakai tu souris vert." },
    { name: "Tambala", desc: "Ville-ecole. L'Impression : le lien entre humain et raptor. Les gamins arrivent a 9 ans, repartent a 12 avec un animal." },
    { name: "Songa-Est", desc: "Ville-frontiere face a N'Goro. Moitie seche, moitie dans l'eau. Un pied sec, un pied impermeable." },
  ],
  "Republique Volonia": [
    { name: "Volonia", desc: "Capitale-archipel. 47 ilots, pontons de bois laque. 300 000 ames. Le 'centre' change avec la maree. Le Grand Ponton emerge 6h par jour." },
    { name: "Koraleth", desc: "Ville-chantier. Demi-cercle de cales seches dans le corail, 200 praos en construction. Le bruit : toujours le maillet." },
    { name: "Patina", desc: "Ville-tresor. Ile rocheuse. Entrepots creuses sous l'ile — cavernes de corail fossile. L'interieur vaut plus que la plupart des royaumes." },
    { name: "Deru", desc: "Ville-eponge. Lagon si peu profond que les pilotis font 40 cm. Tu marches dans l'eau pour aller chez le voisin." },
    { name: "Sel", desc: "Son vrai nom fait 23 syllabes. Port des contrebandiers. N'existe pas officiellement. Le Conseil des Dix y a un representant permanent." },
  ],
  "Royaume Ishtir": [
    { name: "Tonalli", desc: "Cite du Soleil. 150 000 ames. Plateau volcanique a 2 800 m. 7 pyramides a degres. Frill de bronze de 20 m au sommet." },
    { name: "Xochi", desc: "Cite-jardin. Vallee fertile. Fruits, fleurs de ceremonie, plantes medicinales. Xochi sent bon en permanence." },
    { name: "Obsidiane", desc: "Ville-mine. Flanc de volcan eteint. Chaque maison a un mur d'obsidienne — miroir noir. La ville te connait mieux que toi-meme." },
    { name: "Cenote", desc: "Ville-puits. 200 m de diametre, 80 de profondeur. Habitations en spirale dans les parois. L'eau au fond : sacree, glaciale, bleue." },
    { name: "Quetz", desc: "Ville-nid. 3 500 m, au-dessus des nuages. 600 habitants. Les quetzalcoatlus nichent ici. Plus importante que Tonalli pour le calendrier." },
  ],
  "Confederation Arkhan": [
    { name: "Le Kuriltai Eternel", desc: "Pas un lieu fixe — un concept. Cercle de 500 m trace par mille raptors. Se tient 2 fois par an, jamais au meme endroit." },
    { name: "Rakhad", desc: "Canyon de gres rouge, 12 000 personnes en saison seche. Grottes agrandies, fresques accumulees sur des generations." },
    { name: "Les Ossaires", desc: "7 collines sacrees couvertes d'ossements empiles sur des siecles. Personne n'y vit. Tout le monde y passe." },
    { name: "Le Gue de Dara", desc: "Seul lieu d'Arkhan nomme d'apres une personne vivante — l'Apaiseure. Les tyrannosaures de guerre y boivent apres les batailles." },
  ],
  "Cites-Etats N'Goro": [
    { name: "Mbaku", desc: "La mere des cites. Brille en bleu. 60 000 ames, 3 niveaux. L'arbre central — le Coeur — 800 ans, 14 m de diametre." },
    { name: "Krath", desc: "Brille en vert. Cite-pharmacie, 25 000 ames, 300 substances. Meme les Ishtiri envoient chercher un guerisseur de Krath." },
    { name: "Songa", desc: "Brille en violet. Cite-frontiere. Marchands avec un pied dans l'eau, un pied dans la poussiere." },
    { name: "Tala", desc: "Brille en ambre. Cite des constructeurs. Cultivent les racines de paletuvier — 30 ans par pont." },
    { name: "Zuri", desc: "Brille en blanc. Cite des morts. Rappels necromantics — les morts voient leurs petits-enfants. 1 heure. Pas plus." },
    { name: "Drek", desc: "Ne brille pas. Cite des bannis, dans le noir total. Habitants aux pupilles dilatees en permanence. La lumiere les fait pleurer." },
  ],
};

const BIOMES = [
  {
    name: "Grande Plaine",
    territory: "Centre — Empire Pangeen",
    hex: "#D4910A",
    icon: Mountain,
    desc: "Laterite rouge. Millet. Brachiosaures. Mwamba au centre du centre. Saison seche 7 mois : le sol craque, le millet est recolte, les greniers se remplissent. Saison des pluies 5 mois : tout devient boue, les routes disparaissent. L'Aqueduc-Brachi couvre 3 000 km — colonnes en forme de pattes de brachiosaure.",
    dynamics: "Les migrations de parasaurolophus nourrissent l'Empire. Un troupeau peut mettre 3 jours a passer. Le Compteur de Migration ne dort pas pendant 3 jours. La Route des Epices-Os relie N'Goro a Pangeen via le Comptoir de Songa.",
  },
  {
    name: "Archipel de Corail",
    territory: "Sud-Ouest — Republique Volonia",
    hex: "#2A5A9A",
    icon: Waves,
    desc: "47 ilots dans un lagon turquoise. Praos, pilotis, marches flottants. Le recif EST la frontiere — les mosasaures patrouillent les eaux profondes. Pas de saisons : les Voloniens comptent en marees. 730 jours — deux marees par jour. Cycle de tempetes : 3 mois calme, 2 mois tempetes.",
    dynamics: "La Maree d'Ambre : apres les tempetes, les courants ramenent l'ambre fossile sur les plages. 48h de ramassage egalitaire. La Route de l'Ambre : de Volonia a Ishtir, 45 jours. Les caravaniers dorment sous le ventre des brachiosaures — 40m2 d'ombre.",
  },
  {
    name: "Plateau Volcanique",
    territory: "Nord-Est — Royaume Ishtir",
    hex: "#C43D2E",
    icon: Mountain,
    desc: "2 800 metres. Air rare. Silence. 4 saisons franches : Le Feu (40C), L'Eau (torrents), Le Vent (poussiere volcanique, migration des quetzalcoatlus), Le Retour (saison des mariages). Le Chemin de la Corne : 40 km paves, chaque borne un verset. La route EST le livre.",
    dynamics: "Le calendrier de 260 jours mesure la migration des quetzalcoatlus. L'Equinoxe du Frill : le premier rayon touche le frill de bronze, rebondit dans la vallee, touche un point exact au sol. Les pretresses recalibrent a 0.3 degre pres.",
  },
  {
    name: "Plaines d'Herbe Haute",
    territory: "Est — Confederation Arkhan",
    hex: "#4A7A3A",
    icon: Wind,
    desc: "Plus hautes, plus seches, plus venteuses que la Grande Plaine. Le vent ne s'arrete jamais. Pas de villes — des lieux. Le calendrier arkhani EST le troupeau : quand les parasaurolophus bougent, les Arkhani bougent. L'hiver : les cavaliers dorment CONTRE le raptor, 42C de temperature corporelle.",
    dynamics: "La Route du Vent : seul echange pacifique entre nomades et maritimes. Cuir de raptor contre sel volonien. Les Cairns d'Eau — vertebres de dinosaure empilees, gravees de directions. Un GPS d'os. Le Kuriltai dure 3 a 12 jours. Record : 19 jours.",
  },
  {
    name: "Delta de Mangrove",
    territory: "Sud — Cites-Etats N'Goro",
    hex: "#6A4A8A",
    icon: TreeIcon,
    desc: "Eau noire, racines, bioluminescence. Le filtre entre terre et mer. La Montee (6 mois) : eaux montent, cites montent d'un niveau, spinosaure plus actif. La Descente (6 mois) : racines se denudent, enfants explorent. Une fois par generation, l'eau descend assez pour voir les os du fond.",
    dynamics: "Les passerelles vivantes se renforcent avec le temps — plus c'est vieux, plus ca tient. Le Pont de Drek : 80 m dans le noir total. La Nuit des Couleurs : une fois par an, 6 cites, 6 couleurs. Les Fantomes volent entre les cites comme des traits blancs.",
  },
];

const HYBRID_ZONES = [
  { name: "Comptoir de Songa", desc: "Pierre seche cote terre, racines cote marais, table de bronze volonien au milieu. 3 civilisations dans un batiment." },
  { name: "Le Radeau d'Ambre", desc: "Radeau pangeen ancre dans le lagon volonien. Bois pangeen sur eau volonienne. Personne n'est chez soi. Tout le monde est a sa place." },
  { name: "Les Thermes de Frontiere", desc: "Sources chaudes entre Ishtir et Pangeen. Territoire neutre. L'eau chaude adoucit les positions." },
  { name: "Le Quai de Sel", desc: "Os de spinosaure N'Goro, laque Volonia, gravures Arkhanes. Illegal dans 3 juridictions, indispensable aux 3." },
];

const MAP_STATS = [
  { label: "Population", value: "~22M", icon: Users, tooltip: "5 civilisations, de 60 000 (N'Goro) a 800 000 (Mwamba) par cite" },
  { label: "Biomes", value: "5", icon: Maximize2, tooltip: "Plaine, Archipel, Plateau, Steppes, Mangrove + zones hybrides" },
  { label: "Especes", value: "200+", icon: Bone, tooltip: "Du Kiki (2 kg) au brachiosaure (30 tonnes). Le Goutteur vit dans les aqueducs." },
  { label: "Villes", value: "31", icon: Shield, tooltip: "73 structures architecturales repertoriees par Nayou" },
];

const allCities = Object.values(FACTION_CITIES).flatMap((cities) => cities.map((c) => c.name));

export default function JWMapPage() {
  const [expandedBiome, setExpandedBiome] = useState<string | null>(null);
  const [expandedFaction, setExpandedFaction] = useState<string | null>(null);
  const [explored, setExplored] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.JW_MAP, {});

  const toggleExplored = (city: string) => {
    setExplored((prev) => ({ ...prev, [city]: !prev[city] }));
  };

  const exploredCount = allCities.filter((c) => explored[c]).length;
  const explorationPct = allCities.length > 0 ? Math.round((exploredCount / allCities.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Trailer ── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Trailer</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/TOmYpbTo-qM"
              title="Jurassic Wars — Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-3">
            <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold">Jurassic Wars — Trailer Officiel</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Univers original — 5 civilisations, dinosaures domestiques, Age du Bronze</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="overflow-hidden rounded-xl" style={{ backgroundColor: "#D4910A" }}>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/20">
                <Map className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-white">
                  Carte des Territoires
                </h1>
                <p className="text-[10px] tracking-[0.15em] text-white/70">
                  5 biomes &middot; 31 villes &middot; 73 structures &middot; Age du Bronze
                </p>
              </div>
            </div>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visiter le site
            </a>
          </div>
        </div>
      </div>

      {/* Exploration progress */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Exploration globale</span>
          <span className="font-mono text-xs text-[var(--color-gold)]">{exploredCount}/{allCities.length} cites ({explorationPct}%)</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${explorationPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {MAP_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group relative flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3"
          >
            <Tooltip label={s.tooltip} />
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-gold-glow)]">
              <s.icon className="h-4 w-4 text-[var(--color-gold)]" />
            </div>
            <div>
              <div className="font-mono text-lg font-bold text-[var(--color-text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Biomes */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Biomes du Monde</h2>
        <div className="space-y-3">
          {BIOMES.map((biome, i) => {
            const isOpen = expandedBiome === biome.name;
            return (
              <motion.div
                key={biome.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
              >
                <button onClick={() => setExpandedBiome(isOpen ? null : biome.name)} className="flex w-full items-center gap-4 p-4 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${biome.hex}15` }}>
                    <biome.icon className="h-5 w-5" style={{ color: biome.hex }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold" style={{ color: biome.hex }}>{biome.name}</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{biome.territory}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="border-t border-[var(--color-border-subtle)] px-4 pb-4 pt-3 space-y-3">
                        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{biome.desc}</p>
                        <div>
                          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Dynamiques</h4>
                          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{biome.dynamics}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hybrid zones */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Zones Hybrides — Le chaos entre les mondes</h2>
        </div>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {HYBRID_ZONES.map((z) => (
            <div key={z.name} className="px-4 py-3">
              <span className="text-sm font-medium text-[var(--color-gold)]">{z.name}</span>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{z.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Factions cities - expandable */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Cites par Civilisation</h2>
        <div className="space-y-3">
          {Object.entries(FACTION_CITIES).map(([factionName, cities], i) => {
            const biome = BIOMES[i] ?? BIOMES[0];
            const factionExplored = cities.filter((c) => explored[c.name]).length;
            const isOpen = expandedFaction === factionName;
            return (
              <motion.div
                key={factionName}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-gold)]/30"
              >
                <button onClick={() => setExpandedFaction(isOpen ? null : factionName)} className="flex w-full items-center gap-4 p-4 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${biome.hex}15` }}>
                    <Shield className="h-5 w-5" style={{ color: biome.hex }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold" style={{ color: biome.hex }}>{factionName}</h3>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{cities.length} cites</p>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">{factionExplored}/{cities.length}</span>
                  <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="border-t border-[var(--color-border-subtle)] px-4 pb-4 pt-3">
                        <div className="space-y-2">
                          {cities.map((city) => (
                            <button
                              key={city.name}
                              onClick={() => toggleExplored(city.name)}
                              className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors ${
                                explored[city.name]
                                  ? "bg-[var(--color-gold-glow)] text-[var(--color-text)]"
                                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]/50"
                              }`}
                            >
                              {explored[city.name] ? (
                                <Eye className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-gold)]" />
                              ) : (
                                <EyeOff className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                              )}
                              <Landmark className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                              <div>
                                <span className="font-medium">{city.name}</span>
                                <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)] leading-relaxed">{city.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
