import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ─────────────────────────────────────────────────────────
// BYSS GAMES EXTENDED — 15 entries, universe='jurassic-wars'
// Source: GDD_TRADUCTEUR.md, PIPELINE_3D.md, ACTIONS_PRIORITAIRES.md
// Categories: game_design, pipeline, roadmap
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: game_design — Le Traducteur GDD
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — Pitch",
    content: `Jeu diplomatique narratif Jurassic Wars. Genre : Diplomacy + Visual Novel + puzzle linguistique. Inspiration : 80 Days / Disco Elysium / Sorcery! Tu es le seul homme au monde qui parle les cinq langues. Qui appartient a tout le monde et a personne. Tu voyages entre les cinq civilisations. Tu negocies. Tu dechiffres. Tu previens des guerres. Tu en declenches d'autres. Plateforme : PC + Web (Electron).`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", genre: "Diplomacy + Visual Novel + Linguistic Puzzle" },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — Mecanique centrale",
    content: `Traduire n'est pas neutre. Le choix de traduction EST le gameplay. Quand l'Ambassadeur Pangeen dit 'bwere', tu as 3 options : 1) 'Satisfaction' — le Volonien comprend force, baisse son offre. 2) 'Devoir accompli' — comprend contexte, propose echange equitable. 3) Ne pas traduire — 'une emotion sans equivalent dans votre langue' — curiosite + confiance. Chaque traduction a des consequences diplomatiques differentes.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", mechanic: "translation-as-gameplay" },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — 22 Mots Intraduisibles",
    content: `Chaque mot = un pouvoir debloque quand tu le maitrises. daga (Arkhani) : face a hostilite, suspension, fenetre diplomatique. tzolk (Ishtiri) : silence au sommet, confiance pretresses. ngoma-nze (N'Goro) : ne pas le mentionner = 'tu es des leurs'. bwere (Pangeen) : 3 traductions possibles, 3 consequences. sulam (Volonien) : arriver en mer, signal d'appartenance. kraa (Arkhani) : reponse correcte du raptor, confiance clan. kolok (Volonien) : reconnaitre le bruit d'un prao, confiance marchand.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", count: 22 },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — Neutralite Corrosive",
    content: `Chaque faction a une jauge de loyaute envers toi. Confiance totale d'UNE faction = mefiance des QUATRE autres. La vraie competence : maintenir 5 relations imparfaites et productives. Tu appartiens a tout le monde et a personne. La neutralite se corrode — chaque action la deplace.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", mechanic: "neutrality-gauges" },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — 5 Horloges et Traites Vivants",
    content: `Chaque faction compte le temps autrement. Toute negociation a un delai exprime en notation native. Tu dois convertir mentalement. Des erreurs de conversion = guerres. 6 traites existants avec tensions internes. Tu peux etre appele pour reinterpreter un traite sans le rompre. Tu choisis les mots du nouveau texte. Les mots ont des consequences dans les deux langues.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", treaties: 6, clocks: 5 },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — PNJs vivants Claude API",
    content: `Chaque PNJ majeur est alimente par Claude API avec system prompt = lore complet de Nerel par faction. Chaque PNJ a une memoire des interactions passees. Evil Pichon : Khan d'Arkhan, 33 ans, Ti sur l'epaule gauche, Silence est son raptor, parle peu, tranchant. Ratu Seri : 61 ans, dirigeante du Conseil des Dix, meilleure negociatrice du monde connu, chaque chiffre dans sa tete. Autres PNJs : Ixchel, Grand-Mere Griffes, Lua la Petite Mambo.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", tech: "Claude API" },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — Scenes emblematiques",
    content: `1. L'Arrivee a Songa — un pied sec, un pied dans l'eau, on te demande si tu es Pangeen ou N'Goro, reponse correcte 'je suis les deux'. 2. La Fosse — tu assistes a une Impression, le raptor regarde le gamin, tu dois traduire le silence pour l'Ambassadeur Pangeen. 3. La Mort de Ti — Evil Pichon ne dit rien, tu dois traduire son silence pour les cinq delegations, il n'y a rien a traduire. 4. Le Pont de Drek — sequence noire, 80 pas, le jeu eteint tout. 5. La Nuit des Couleurs — event global annuel, six couleurs, les Fantomes blancs.`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", scenes: 5 },
  },
  {
    universe: "jurassic-wars",
    category: "game_design",
    title: "Le Traducteur — Stack technique",
    content: `Frontend : React + Electron (PC) ou Next.js (Web). Narration : Claude API avec system prompt = lore Nerel par faction. Visuels : Higgsfield (scenes diplomatiques generees). Cinematiques : MiniMax 2.7 (moments-pivots). Audio : Suno (5 ambiances par civilisation). State : Zustand + SQLite local (sauvegarde offline).`,
    metadata: { game: "le-traducteur", source: "GDD_TRADUCTEUR.md", stack: ["React", "Electron", "Claude API", "Higgsfield", "MiniMax", "Suno", "Zustand"] },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: pipeline — 3D Asset Pipeline
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "pipeline",
    title: "Pipeline 3D — Higgsfield a UE5",
    content: `Pipeline complet en 6 etapes. 1) Concept Art (Higgsfield) : prompt vue propre, fond blanc, lighting neutre, 4-6 vues. 2) Generation 3D (Replicate) : TripoSR image vers mesh .glb en 30s, InstantMesh mesh + UV map en 2-3 min. 3) Nettoyage (Blender) : retopologie Infanterie 3K-8K tris, Cavalerie 8K-20K tris, Brachiosaure 20K-40K tris. 4) Texturing HF (UE5 + Megascans) : materials specifiques par civilisation. 5) Rigging (Blender + RMEditor) : skeletons TWW3 mappes. 6) Conversion textures (Paint.net) : .tga vers .dds pour TWW3 ou garder .tga pour UE5.`,
    metadata: { source: "PIPELINE_3D.md", steps: 6, tools: ["Higgsfield", "Replicate", "Blender", "UE5", "Megascans", "Paint.net"] },
  },
  {
    universe: "jurassic-wars",
    category: "pipeline",
    title: "Pipeline 3D — Materials par civilisation",
    content: `Materials Megascans specifiques par civilisation JW. Peau dinosaure : Reptile Scales. Armure pangeenne : Dark Forged Iron + cuivre. Obsidienne ishtiri : Black Volcanic Glass. Laque volonienne : Lacquered Wood. Peau N'Goro : Wet Bark + bioluminescence shader custom. Bake textures : Base Color .tga 2048x2048, Normal Map .tga 2048x2048, Roughness/Metal .tga.`,
    metadata: { source: "PIPELINE_3D.md", step: "texturing", resolution: "2048x2048" },
  },
  {
    universe: "jurassic-wars",
    category: "pipeline",
    title: "Pipeline 3D — Assets prioritaires Phase 1",
    content: `Phase 1 = prototype jouable, assets minimalistes mais corrects. Urgents : Guerrier Pangeen (Human standard), Raptor Arkhani (Cold One), Cavalier Arkhani (Cold One Rider). Medium : Brachiosaure de siege (Dread Saurian), Guerrier N'Goro (Human standard). Low : Quetzalcoatlus (Coatl), Spinosaure (Dread Saurian), Pretresse Ishtiri (Human female), Pleureur Volonien (Human standard).`,
    metadata: { source: "PIPELINE_3D.md", phase: 1, urgent_count: 3, total_count: 9 },
  },
  {
    universe: "jurassic-wars",
    category: "pipeline",
    title: "Pipeline 3D — Notes techniques TripoSR et InstantMesh",
    content: `TripoSR fonctionne mieux avec : fond uni blanc ou gris, eclairage flat sans shadows dures, objet centre sans coupure, pas de transparence. InstantMesh est preferable pour : assets avec beaucoup de details de surface, quand tu as besoin d'UVs propres, quand tu veux exporter une texture map. Blender tips pour TWW3 : uncheck Add Leaf Bones a l'import FBX, uncheck Add Leaf Nodes a l'export, RMEditor Version 7 pour WH3.`,
    metadata: { source: "PIPELINE_3D.md", tools: ["TripoSR", "InstantMesh", "Blender"] },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: roadmap — Priority Actions
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "roadmap",
    title: "Action immediate — JW Villages setup",
    content: `Etape 1 : Setup repo (30 min) — creer repo byss-games/jw-villages sur GitHub (Oshinsu), npx create-expo-app. Etape 2 : Structure projet (1h) — Expo Router, composants VillageMap/BuildingCard/ResourceBar, Zustand store, Supabase + Claude API clients. Etape 3 : Premiere session Cursor (2-3h) — React Native Expo builder Clash-like, civilisation Pangeenne, ressource millet, batiment Grenier-Oeuf, timer 30s, style laterite rouge #C1440E bronze #CD7F32 fond sable #F5DEB3.`,
    metadata: { source: "ACTIONS_PRIORITAIRES.md", project: "jw-villages", priority: "immediate" },
  },
  {
    universe: "jurassic-wars",
    category: "roadmap",
    title: "Backlog global BYSS GAMES",
    content: `JW Villages : 14 taches (repo, expo, carte SVG, 5 batiments, ressources, raid, Supabase, Arkhani, Impression, mort raptor, prix ambre realtime, Claude API events, traites, soft launch itch.io). JW x TWW3 Mod : 11 taches (RPFM + AK, premier pack, 4 unites reskin, Evil Pichon LL, Custom Battle, Workshop alpha, assets originaux, Silence Lua, Prestige, Camp mobile, contacter Mixu). JW Confederation : 6 taches (carte SVG, tour par tour, Claude events, JSON bridge, UE5 prototype, Steam EA). JW Le Traducteur : 6 taches (Comptoir de Songa, 3 PNJs Claude, 5 mots, Evil Pichon PNJ, Electron, itch.io).`,
    metadata: { source: "ACTIONS_PRIORITAIRES.md", total_tasks: 37, projects: 4 },
  },
  {
    universe: "jurassic-wars",
    category: "roadmap",
    title: "Regles de travail BYSS GAMES",
    content: `5 regles immuables. 1) Un foyer a la fois — quand tu travailles sur Villages, tu travailles sur Villages. 2) Cursor first — tout le code passe par Cursor + Claude Code. 3) Lore de Nerel = intouchable — jamais diverger sans valider avec Nerel. 4) Prototype en 2 semaines — si t'as pas quelque chose de jouable en 2 semaines, le design est trop complexe, simplifie. 5) Assets Higgsfield/Replicate = apres la mecanique — d'abord ca marche avec des rectangles, ensuite ca est beau.`,
    metadata: { source: "ACTIONS_PRIORITAIRES.md", rules: 5 },
  },
];

async function seed() {
  console.log(`\n🎮 BYSS GAMES EXTENDED — Seeding ${entries.length} entries...\n`);

  const cleaned = entries.map((e, idx) => {
    const { metadata, ...rest } = e;
    return { ...rest, tags: metadata ? Object.values(metadata).filter(v => typeof v === "string").slice(0, 3) : [], word_count: rest.content ? rest.content.split(/\s+/).length : 0, order_index: idx };
  });
  const { data, error } = await supabase
    .from("lore_entries")
    .insert(cleaned)
    .select("id, title, category");

  if (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }

  console.log(`✅ ${data.length} entries inserted:\n`);
  for (const row of data) {
    console.log(`  [${row.category}] ${row.title} (${row.id})`);
  }
  console.log("\n🎮 Done.\n");
}

seed();
