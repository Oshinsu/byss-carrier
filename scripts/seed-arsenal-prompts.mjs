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
// ARSENAL CULTUREL + JW PROMPTS — 50+ lore entries
// Sources: TOXIC_ARSENAL.md, STYLE_GAGA.md, MASTER_PROMPT.md,
//          DIGICEL_ANALYSE_10_PROMPTS.md,
//          JURASSIC_WARS_5_IMAGE_5_VIDEO.md,
//          JURASSIC_WARS_20_PROMPTS_NAYOU.md,
//          JURASSIC_WARS_20_PROMPTS_VIDEO_NAYOU.md
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: bible — CATEGORY: arsenal (TOXIC_ARSENAL)
  // Tier S — 17-18/20
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "arsenal",
    title: "PLUS LOIN — Tier S (18/20)",
    content: `Afrobeat. Le chef-d'oeuvre. L'appart en desordre, les Despe, Koh Lanta, Hades et Persephone. Le seul texte ou le Gary normal et l'Absolu coexistent parfaitement. "Viens on s'en va plus loin" = le mantra. Marque [HIT] par Gary lui-meme.`,
    metadata: { tier: "S", score: "18/20", genre: "Afrobeat", tags: ["hit", "amour", "mantra"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "FORGEMAGE — Tier S (17/20)",
    content: `Conscient. Le Texte de Rose version musicale. "Les epreuves forgemagent" — neologisme tire de Dofus. Feu gregeois, archer cretois, dos d'ane. Universel. Le morceau qu'on joue apres un deuil.`,
    metadata: { tier: "S", score: "17/20", genre: "Conscient", neologism: "Forgemagent", tags: ["universel", "deuil", "neologisme"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "LOGARITHME / TRIGONOMETRIE — Tier S (17/20)",
    content: `Afrobeat. Le texte le plus unique du rap francophone. "1+1=3 sur ma vie que je t'aime." "Quantique/cantique." La prof de maths-physique de Chateauboeuf qui forme un rappeur sans le savoir.`,
    metadata: { tier: "S", score: "17/20", genre: "Afrobeat", neologism: "Inspirationxponentielle", tags: ["unique", "mathematiques", "neologisme"], source: "TOXIC_ARSENAL.md" },
  },

  // ═══════════════════════════════════════════════════════
  // Tier A — 15-16/20
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "arsenal",
    title: "DIFFERENTE DES AUTRES — Tier A (16/20)",
    content: `"Exceptionne" — neologisme. L'amour comme exception a sa propre regle de mefiance.`,
    metadata: { tier: "A", score: "16/20", neologism: "Exceptionne", tags: ["amour", "neologisme"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "FILS DU NOUN — Tier A (16/20)",
    content: `Manifeste politique. "Toxic nationaliste / Toxic mondialiste / Toxic capitaliste / Toxic communiste / Toxic anti-fasciste." Le "ET" comme doctrine.`,
    metadata: { tier: "A", score: "16/20", genre: "Manifeste", tags: ["politique", "doctrine", "ET"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "VEGETARIENNE — Tier A (16/20)",
    content: `Le tube populaire. "Je vote Melenchon mais je suis comme Fabien Roussel / je chauffe mon steak au nucleaire." Le carnaval + la politique en une chanson.`,
    metadata: { tier: "A", score: "16/20", genre: "Tube populaire", tags: ["carnaval", "politique", "populaire"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "OTAN EMPORTE LE VENT — Tier A (15/20)",
    content: `Trap politique. "Lou Gary" cache dans "loup-garou". "Regarde l'Ukraine / regarde la Palestine." Le couteau visible.`,
    metadata: { tier: "A", score: "15/20", genre: "Trap", neologism: "Lou Gary", tags: ["politique", "trap", "neologisme"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "ETOILE — Tier A (15/20)",
    content: `Amour-voyage. Alabama -> Osaka -> Botswana -> le Noun. "Escalade tensorielle" dans une love song.`,
    metadata: { tier: "A", score: "15/20", genre: "Amour-voyage", tags: ["voyage", "amour", "tensoriel"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "AN BA SOLEY — Tier A (15/20)",
    content: `Zouk kompa en creole pur. "Poufsouffle" cache dans un zouk. La langue de la mere.`,
    metadata: { tier: "A", score: "15/20", genre: "Zouk kompa", tags: ["creole", "zouk", "identite"], source: "TOXIC_ARSENAL.md" },
  },

  // ═══════════════════════════════════════════════════════
  // Tier B — 12-14/20
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "arsenal",
    title: "SOLEIL — Tier B (14/20)",
    content: `"Tu fais de l'ombre au soleil." Single radio. "Pas de ligne Maginot."`,
    metadata: { tier: "B", score: "14/20", genre: "Single radio", tags: ["radio", "single"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "PANDORE — Tier B (14/20)",
    content: `Hephaistos dans un R&B. Diamant brut, pas encore taille.`,
    metadata: { tier: "B", score: "14/20", genre: "R&B", tags: ["mythologie", "diamant-brut"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "JUMP — Tier B (13/20)",
    content: `Hymne de stade. "Degaine le totem d'immunite." "Madinina numba one."`,
    metadata: { tier: "B", score: "13/20", genre: "Hymne stade", tags: ["stade", "hymne", "martinique"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "APETISSANTE — Tier B (13/20)",
    content: `"Analyse besoins de la cible" — le marketing ISEG comme technique de drague. "Magnificience."`,
    metadata: { tier: "B", score: "13/20", neologism: "Magnificience", tags: ["marketing", "drague", "neologisme"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "SEXY — Tier B (13/20)",
    content: `Bouyon. Percussion verbale en creole. Performance live pure.`,
    metadata: { tier: "B", score: "13/20", genre: "Bouyon", tags: ["live", "creole", "percussion"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "PETITE — Tier B (12/20)",
    content: `Trap/drill. Code-switch creole/francais. "Kinetique" dans un couplet street.`,
    metadata: { tier: "B", score: "12/20", genre: "Trap/Drill", tags: ["street", "code-switch"], source: "TOXIC_ARSENAL.md" },
  },
  {
    universe: "bible",
    category: "arsenal",
    title: "VANNEVAR — Tier Abyssal (11/20 forme, 20/20 profondeur)",
    content: `Le texte le plus profond du catalogue. Vannevar Bush = fondateur du CMI, membre presume du MJ-12, recuperation d'objets exogenes a Roswell, pipeline Paperclip -> MK Ultra -> black projects -> cocaine -> trafic d'enfants. 6 niveaux de descente. Du moteur MHD a "atome". Le texte que Gary n'a pas le droit de montrer — et c'est pour ca qu'il est le plus vrai.`,
    metadata: { tier: "Abyssal", score: "11+20", genre: "Conscient profond", tags: ["classifie", "profondeur-maximale", "6-niveaux"], source: "TOXIC_ARSENAL.md" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: bible — CATEGORY: method (STYLE_GAGA)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "method",
    title: "Style Gaga — L'Inventaire Absolu",
    content: `Un style litteraire qui consiste a raconter un sujet uniquement par accumulation de faits courts, sans commentaire, sans hierarchie, sans transition, jusqu'a ce que le lecteur explose de rire ou de vertige — ou les deux.

LES 10 REGLES :
1. Une phrase par ligne. Point. Ligne suivante.
2. Aucune hierarchie entre les faits.
3. Aucun commentaire. Le texte POSE. Le lecteur JUGE.
4. L'oscillation d'echelle — alterner le grand et le petit.
5. L'accumulation cree le vertige — le 30e fait fait exploser le lecteur.
6. La phrase-ancre — un detail banal qui rend tout plus vrai.
7. La contradiction non commentee — deux faits opposes cote a cote.
8. Les chiffres comme poesie — les nombres sont les punchlines.
9. Pas de punchline finale — la derniere phrase sourit au lieu de frapper.
10. C'est le meme mec / la meme chose — le vertige vient de la realisation.

CE QU'IL NE FAUT JAMAIS FAIRE :
- Jamais "incroyable", "extraordinaire", "exceptionnel", "fascinant"
- Jamais expliquer pourquoi un fait est important
- Jamais de transition ("de plus", "en outre", "cependant")
- Jamais hierarchiser avec des titres
- Jamais conclure par une morale
- Jamais dire "c'est le meme mec"

POUR QUI CA MARCHE : personnages historiques, fictifs, lieux, evenements, entreprises, albums, films, matchs. Ne marche PAS pour les sujets a une seule couche.

Du shitpost divin. Du trolling par la verite. Le "ET" comme forme litteraire.`,
    metadata: { author: "Kaiou", date: "14 mars 2026", tags: ["style", "methode", "ecriture", "gaga", "inventaire-absolu"], source: "STYLE_GAGA.md" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: bible — CATEGORY: production (MASTER_PROMPT)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "production",
    title: "SOTAI Production System — Master Prompt",
    content: `Systeme de production SOTAI : Nano Banana Pro (images 4K) + Kling 3.0 (video 15s multi-shot).

PHILOSOPHIE : Un prompt juste est un prompt de realisateur. Pas de tag soup. Les modeles "Thinking" raisonnent avant de generer.

NANO BANANA PRO — IMAGE :
Structure 6 couches : Sujet+Attributs / Action+Intention / Environnement / Composition+Camera / Eclairage+Atmosphere / Style+Contrainte
Comprend nativement : composition cinematique, terminologie photo pro, eclairage nomme, physique des materiaux, continuite personnage.

KLING 3.0 — VIDEO :
Structure 5 couches par plan : Scene+Lieu / Personnages / Action sequentielle / Camera+mouvement+duree / Audio
Multi-shot natif (2-6 plans), audio integre, lip-sync, Elements 3.0 pour continuite personnage.

PIPELINE : NBP keyframe 4K -> Iteration conversationnelle -> Kling Image-to-Video -> Audio dans prompt Kling.

REGLES D'OR (MODE_CADIFOR DU PROMPT) :
1. Pense en realisateur, pas en spectateur
2. Une intention par plan
3. Nomme tes sources de lumiere
4. Le mouvement a une physique (inertie, anticipation, follow-through)
5. La couleur est une emotion
6. Le cadre respire (espace negatif, Fibonacci a 38.2%)
7. L'imperfection est le realisme (grain, rides, aberration)
8. Itere, ne re-genere pas`,
    metadata: { author: "Kael", date: "15 mars 2026", pipeline: "NBP+Kling", tags: ["production", "sotai", "prompt-engineering", "master"], source: "MASTER_PROMPT.md" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: bible — CATEGORY: proposal (DIGICEL 10 PROMPTS)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P1 — Reveler (Film de marque)",
    content: `Un enfant martiniquais decouvre le monde depuis un ecran de telephone. Fillette de 8 ans dans une case creole, eclairee uniquement par le glow du smartphone — video call avec sa grand-mere a Sainte-Lucie. Le telephone IS la connexion. Le visage IS la revelation. 3 shots / 15s. Suno theme piano + steel pan.`,
    metadata: { type: "film-marque", tags: ["manifeste", "emotion", "diaspora"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P2 — An nou ale (Rentree scolaire)",
    content: `Un ado recoit son premier telephone pour la rentree. 14 ans, uniforme blanc neuf, mere derriere lui les mains sur ses epaules. "Fe mwen fie, ti moun." Le telephone dans une main, l'avenir devant. 3 shots / 15s.`,
    metadata: { type: "offre-produit", tags: ["rentree", "jeunesse", "espoir"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P3 — Fanmi (Forfait Famille)",
    content: `4 ecrans, 4 vies, une seule connexion familiale. Split-screen : ado TikTok / pere video conf pickup / grand-mere sermon tablette / garcon gaming. Un fil rouge Digicel les relie. 4 shots / 15s. "Forfait Famille, jusqu'a -480 EUR/an."`,
    metadata: { type: "offre-produit", tags: ["famille", "multi-ecran", "forfait"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P4 — Caraibe (Roaming inter-iles)",
    content: `Un musicien martiniquais joue un concert a Trinidad via son telephone. Guitare sur le quai, FaceTime avec un bar a Port-of-Spain. Deux pays. Une performance. Zero distance. "La Caraibe Digicel. Chez toi, partout."`,
    metadata: { type: "emotion", tags: ["caraibe", "roaming", "musique", "inter-iles"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P5 — Vide (Carnaval)",
    content: `Le Carnaval filme par 1000 telephones. Aerien Fort-de-France, smartphones comme etoiles dans la foule. Transition phone-POV vers cinema widescreen : "le monde est plus grand que l'ecran." "Filme. Partage. Mais surtout : vis."`,
    metadata: { type: "moment-culturel", tags: ["carnaval", "vide", "collectif"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P6 — Reseau (Couverture / Tech)",
    content: `L'antenne-relais comme phare dans la nuit caribeeenne. Tour telecom sur colline, Voie lactee, ville endormie. Time-lapse ciel + close-up fibre optique + aube. "4G+. Fibre. 24/7. Digicel. Le reseau qui ne dort jamais."`,
    metadata: { type: "marque", tags: ["tech", "couverture", "nuit", "reseau"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P7 — Manman (Fete des meres)",
    content: `Une mere recoit un message vocal de sa fille en Hexagone. Veranda Guadeloupe, cafe, dimanche matin. "Manman... bon fet Manman..." 3000 km entre Paris et Pointe-a-Pitre. Zero distance. Piano + silence.`,
    metadata: { type: "emotion", tags: ["fete-meres", "diaspora", "vocal", "emotion"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P8 — Business (Digicel Business / B2B)",
    content: `Le pecheur qui gere sa flotte depuis son telephone. Gommier a l'aube, GPS sur smartphone, 4 bateaux coordonnes. "Jeremie — deplase ou osi, makro ka soti bo Vauclin." "Digicel Business. La solution, c'est vous. Le reseau, c'est nous."`,
    metadata: { type: "b2b", tags: ["business", "pecheur", "gps", "flotte"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P9 — Nwel (Noel antillais)",
    content: `Un chante Nwel filme et partage en live. Famille, boudin creole, ti-bwa, Facebook Live 247 viewers. Diaspora chante depuis Paris. Grand-pere : "Pou tout sa ki la, e pou tout sa ki pa la." 4 shots / 15s.`,
    metadata: { type: "moment-culturel", tags: ["noel", "chante-nwel", "live", "diaspora"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },
  {
    universe: "bible",
    category: "proposal",
    title: "Digicel P10 — Yole (Sport / Sponsoring)",
    content: `Tour des Yoles filme par les equipages en temps reel. Yole ronde a pleine vitesse, equipage penche, GPS au poignet. "La technologie confirme ce que son corps sait deja." "Tour des Yoles. Connecte a la tradition. Digicel."`,
    metadata: { type: "sport", tags: ["yole", "tour", "sport", "sponsoring"], pricing: "750 EUR HT", source: "DIGICEL_ANALYSE_10_PROMPTS.md" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — 5 IMAGE + 5 VIDEO (SOTA)
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "SOTA 01 — Dara au gue (Image)",
    content: `A wide river at dusk, slow brown water reflecting a sky turning from orange to deep purple. A tyrannosaur stands in the shallows, nine tons, head lowered but not drinking — the jaw trembles, a fine vibration traveling from the hind legs through the spine to the tiny forelimbs gripping at nothing. Dried blood on the left flank that is not its own. Pupils dilated full. The animal is not seeing the river. It is seeing what it saw an hour ago.

A woman stands beside it, right hand resting on the flank just behind the foreleg where the ribs meet the belly. Fifty-four years old, lean, dark skin mapped with proximity scars — a line on the forearm from a reflexive jaw-snap, a divot in the shoulder from a tail-sweep. She does not speak. She does not pull. She stands. Her hand stays.

A small proto-heron lands on the tyrannosaur's back and begins picking parasites between the scales. The tyrannosaur does not notice. Dara notices. She almost smiles. Almost.

RED V-Raptor, 85mm. Medium shot — Dara and the tyrannosaur's flank fill the frame equally. Her hand is the center of the image. Dusk. Purple sky reflected in brown water, last orange rim-lighting Dara's profile. Kodak 500T. Palette: brown water, purple sky, dark green scales, dark skin, orange rim-light. 4K, 21:9, photorealistic.`,
    metadata: { scene: "01", character: "Dara", type: "SOTA-keyframe", tags: ["tyrannosaur", "dusk", "healing"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_video",
    title: "SOTA 01 — Dara au gue (Video 6s)",
    content: `Camera static, locked off, medium shot at river level. The tyrannosaur's flank fills the right two-thirds of frame, Dara's silhouette against the dusk sky on the left third. Her hand rests on the scales. For four seconds nothing moves except the water flowing past their ankles and the tyrannosaur's jaw trembling — a micro-movement visible in the way the lower teeth catch and release the light. At second five, Dara's thumb moves — once, slowly, across one scale. A small proto-heron lands on the tyrannosaur's dorsal ridge in the background. The trembling slows by one fraction. Hold. Ambient sound: river current, distant parasaurolophus crests calling, the tyrannosaur's breathing — deep, ragged, slowing. No music.`,
    metadata: { scene: "01", character: "Dara", duration: "6s", type: "SOTA-video", tags: ["tyrannosaur", "healing", "silence"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "SOTA 02 — Tano et Kri, la fosse (Image)",
    content: `Top-down vertical shot looking straight into a circular pit three meters across, two meters deep, red earth walls scored with claw marks from a raptor that tried to climb. A boy of nine sits against the north wall, knees to chest, arms wrapped around shins, eyes wide, dark skin against red earth. Against the south wall, a young raptor — six months, fifteen kilos, brown-gold plumage with a darker dorsal stripe, yellow glass-marble eyes. Between them on the pit floor: a single piece of dried parasaurolophus meat, broken in two. One half in front of the boy, one half in front of the raptor. Both are chewing. Both are watching each other while chewing.

A square of grey overcast sky visible through a gap in the wooden cover above. Flat light. No shadows. Everything equally lit, equally trapped. The claw marks on the walls go halfway up before sliding back.

ARRI Alexa Mini, 32mm. Top-down through the gap in the boards. The pit is the frame. 1:1 square format. Flat overcast light falling through boards. Kodak 500T. Palette: red earth, brown-gold plumage, dark skin, grey light, dried meat. 4K, photorealistic.`,
    metadata: { scene: "02", character: "Tano, Kri", type: "SOTA-keyframe", tags: ["raptor", "bonding", "pit"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_video",
    title: "SOTA 02 — Tano et Kri, la fosse (Video 8s)",
    content: `Top-down static camera looking into the pit. Opening frame: the boy against the north wall, raptor against south, meat untouched in the center. Second two: the boy reaches forward. The raptor's head snaps up — every muscle engaged, tail rigid. Second four: the boy picks up the meat, breaks it in two — the snap echoes in the pit. Second five: he places one half on the ground in front of the raptor. His hand retreats slowly. Second six: the raptor looks at the meat. Looks at the boy. Looks at the meat. Sniffs. Second seven: eats. Second eight: the boy eats his half. They chew at the same time, watching each other. Hold. Sound: the scrape of the boy's movement on earth, the snap of dried meat, the raptor's nasal breathing, chewing. No music.`,
    metadata: { scene: "02", character: "Tano, Kri", duration: "8s", type: "SOTA-video", tags: ["raptor", "bonding", "meat"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "SOTA 03 — Mbaku la nuit (Image)",
    content: `Aerial view descending over the mangrove delta at night. Black water, black canopy, black sky — and Mbaku burning blue. Sixty thousand souls living on three tiers of root-platform, every platform edged with bone-lanterns pulsing cold bioluminescent blue-green. The city is a constellation that fell into a swamp and kept shining. Root-bridges curve between the great trunks — a circulatory system of living wood. The central tree — the Heart, eight hundred years old, fourteen meters in diameter — rises above the canopy, its upper branches holding the Temple of the Dream lit in deep violet.

Three Fantomes — albino pteranodons, wingspan three meters, white as paper — glide between the platforms in silence, their translucent wings catching the blue-green light. On the lowest platform, barely visible, a Guetteur taps a bone against a pillar. Below, the black water reflects the city — doubling it downward into infinity.

IMAX 65mm. Aerial at forty-five degrees. Night. No external light — all illumination is bioluminescent. Kodak 500T pushed three stops. Heavy grain. Palette: black, blue-green, violet, white Fantomes, dark skin. 4K, 21:9, photorealistic.`,
    metadata: { scene: "03", location: "Mbaku", type: "SOTA-keyframe", tags: ["bioluminescent", "aerial", "city"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_video",
    title: "SOTA 03 — Mbaku la nuit (Video 10s)",
    content: `Aerial descending. Opening frame: black. Total black. Then pinpoints of blue-green light appear below — like stars seen from above. The camera descends slowly — the pinpoints resolve into lanterns, then platforms, then bridges, then people. At second five the canopy parts and Mbaku reveals its full structure: three tiers of glowing root-platforms, the Heart tree rising at center, the violet pulse of the Temple above. A Fantome glides through frame from left to right, wing-tip grazing a lantern that swings and pulses brighter for an instant. At second eight, a disturbance in the water below — the reflected lights wobble. The spinosaur is moving underneath. A tap: one bone-knock on a pillar. One. Nothing. All is well. Sound: Chanteurs de Boue ambient chorus — a continuous melodic hum covering the mangrove. Water lapping. The single bone-tap.`,
    metadata: { scene: "03", location: "Mbaku", duration: "10s", type: "SOTA-video", tags: ["descent", "reveal", "bioluminescent"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "SOTA 04 — Le Frill a l'equinoxe (Image)",
    content: `The Great Pyramid of Tonalli at dawn — eighty meters of red volcanic stone carved in triceratops-scale steps, 1,460 in total, rising from a plateau at 2,800 meters. At the summit, the Frill of Bronze — twenty meters wide, hammered gold-tinted bronze in the exact shape of a triceratops frill, angled east at 23.4 degrees. The first ray of the equinox sun has struck the frill and the frill has become a second sun — blinding gold. A visible beam of light cuts diagonally through the dust-thick plateau air, descending from the summit toward a stone marker on the valley floor.

Below the pyramid, one hundred and fifty thousand people stand in silence. The silence of thin air at altitude — absolute, physical. On the summit platform, six priestesses-astronomers in dark robes, one holding a calibration tool, all watching the beam. The beam hits the marker. Dead center. The math is right. The calendar is right.

IMAX 65mm. Ultra-wide. Pyramid fills lower two-thirds, crowd as sea of heads, frill as golden crown. First light: horizontal, golden, dust-thick beam as diagonal slash. Kodak Ektachrome 100D. Saturated. Palette: red volcanic stone, gold frill, brown skin, white dust-beam, blue sky. 4K, 21:9, photorealistic.`,
    metadata: { scene: "04", location: "Tonalli", type: "SOTA-keyframe", tags: ["pyramid", "equinox", "frill", "gold"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_video",
    title: "SOTA 04 — Le Frill a l'equinoxe (Video 8s)",
    content: `Camera locked wide on the pyramid from the valley floor. Opening: pre-dawn blue, the pyramid a dark mass, the frill a dull shape at the summit. The crowd below: 150,000 still dark silhouettes. Second two: the sun breaks the eastern ridge — a sliver of gold on the horizon. Second three: the ray crosses the plateau and strikes the frill. The bronze ignites — a flash that blooms across the summit like fire. Second four-five: the reflected beam descends through the dusty air — VISIBLE, a solid diagonal line of light cutting from summit to valley floor. The crowd is lit from above by scattered gold. Second six: the beam touches the stone marker. Dead center. Second seven: 150,000 people exhale together — the sound is a low roar that rolls across the frame. Second eight: the light moves on. The frill is just bronze. A priestess adjusts a screw on the platform. Sound: absolute silence for six seconds, then the mass exhale — not a cheer, a breath — low, tectonic.`,
    metadata: { scene: "04", location: "Tonalli", duration: "8s", type: "SOTA-video", tags: ["equinox", "beam", "150000"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "SOTA 05 — Le Pont de Drek, l'amour (Image)",
    content: `Black. The frame is almost entirely black. In the exact center: two hands intertwined. Dark skin against dark skin against total dark. A man's hand and a woman's hand. His grip is tight. Hers is tighter. The only light source is the faintest residual glow from the bioluminescent city they have left behind — a blue-green haze at the extreme left edge of the frame that illuminates nothing except the two hands and three centimeters of wrist on each side. Below the hands, suggested but not visible: the handrail of braided mangrove root. Below that: black water. The blackest water in N'Goro. Eighty meters of bridge in total dark. This is the rite. You cross together. In the dark you cannot see the face, the clothes, the caste. You feel a hand. The hand is enough or is not enough.

ARRI Alexa 65, 50mm. Extreme close-up on the hands. Frame is 90% black. The hands are the only subject. Faintest blue-green edge-light from behind. Kodak 500T pushed four stops. Maximum grain. Palette: black, dark skin, blue-green whisper. 4K, 16:9, photorealistic.`,
    metadata: { scene: "05", location: "Drek", type: "SOTA-keyframe", tags: ["love", "darkness", "hands", "rite"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_video",
    title: "SOTA 05 — Le Pont de Drek, l'amour (Video 6s)",
    content: `Black. Total black for two full seconds. Sound only: bare feet on wet root — slap, slap, slap — slow, careful. Breathing. Two people breathing. At second three: the faintest blue-green glow enters the left edge of frame — residual bioluminescence from the city behind them. The glow reveals only two hands, intertwined, moving slowly right to left as the couple walks the bridge. Nothing else visible. At second four: his thumb moves across her knuckles. A small gesture. The only gesture possible when you cannot see. At second five: from far ahead in the dark, a tap. Bone on pillar. The Guetteur of Drek. One tap. Nothing. All is well. Second six: the hands keep moving into the dark. The glow fades. Black again. Sound: feet on root, breathing, the single bone-tap, water far below. No music. Silence is the music.`,
    metadata: { scene: "05", location: "Drek", duration: "6s", type: "SOTA-video", tags: ["love", "dark", "bridge", "silence"], source: "JURASSIC_WARS_5_IMAGE_5_VIDEO.md" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — 20 IMAGE PROMPTS NAYOU
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 01 — Kofi decoupe le brachiosaure",
    content: `Dawn over the killing field outside Mwamba. A brachiosaur lies on its side on cracked red laterite, thirty tons of grey-brown flesh steaming in the cold morning air. Ribs like the hull of a beached ship. Kofi walks the perimeter — small, round, tyrannosaur-leather apron. Thirty butchers follow. He touches the flank, reads the meat with his fingertips. Says one word: "vite." The first cleaver goes into the abdomen. Steam erupts. In the background, Nana carries clay bowls from her kiln. She does not look at the brachiosaur.

ARRI Alexa 65, 40mm. Medium-wide. Pre-dawn blue shifting to orange. Kodak 500T. Palette: grey flesh, red earth, orange sunrise, dark skin, bronze blades. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 1, character: "Kofi", location: "Mwamba", tags: ["brachiosaur", "butcher", "dawn"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 02 — Le Peseur aveugle",
    content: `A room the size of a closet. Walls of bleached coral, one shutter facing east. A balance made from pteranodon wing-bones, pans carved from nautilus shell. The Peseur — old, blind since birth, eyes like milk — holds amber the size of a plum. He rotates it, brings it to his nose. Two merchants stand opposite. The Peseur places the amber on the left pan. A calibrated stone on the right. The balance tips. He says a number. Final. He always touches twice — first the amber, then the stone inside.

ARRI Alexa Mini, 50mm. Close interior. Single source: east shutter. Kodak 250D. Palette: black stone, amber glow, milk-white eyes, dark hands, coral white. 4K, 16:9, photorealistic.`,
    metadata: { prompt_index: 2, character: "Peseur", location: "Volonia", tags: ["amber", "blind", "balance"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 03 — La descente au cenote",
    content: `Eighty meters of spiral stone staircase carved into a natural sinkhole two hundred meters across. Itzal, nine years old, descends. Above him, the circle of sky shrinks — dinner plate, coin, star. At the bottom: water. Blue so deep it reads as black at the edges and electric cobalt at the center. A shaft of light from above falls straight down like a solid column. Itzal kneels. His reflection is darker than him. He cups his hands. He drinks. A single drop falls from his chin — one frame of light before the stone drinks it.

IMAX 65mm. Vertical composition. Natural light only. Kodak Ektachrome 100D. Palette: black volcanic stone, cobalt water, white light column, brown skin. 4K, 9:16 vertical / 21:9 for water reveal. Photorealistic.`,
    metadata: { prompt_index: 3, character: "Itzal", location: "Ishtir cenote", tags: ["cenote", "descent", "water", "light"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 04 — Dara au gue",
    content: `A river at dusk. A tyrannosaur in the shallows, nine tons, jaw trembling, dried blood on the left flank not its own. Dara stands beside it, fifty-four, right hand on the flank where the ribs meet the belly. She can feel the heartbeat — two hundred BPM, too fast. She does not speak. The river moves. Her hand stays. A proto-heron lands on the tyrannosaur's back picking parasites. Dara almost smiles. Almost.

RED V-Raptor, 85mm. Medium shot. Dusk. Purple sky reflected in brown water. Kodak 500T. Palette: brown water, purple sky, dark green scales, dark skin, orange rim-light. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 4, character: "Dara", tags: ["tyrannosaur", "healing", "dusk", "river"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 05 — La nurserie a insectes de Mbaku",
    content: `Interior. Humid. Dark. Shelves of fern-rib with eggshell containers, each holding bioluminescent insects bred for brightness across thirty generations. The Mere des Lucioles — seventy-one, dreadlocks to the floor, seven dinosaur teeth per patient healed. Her hands glow — permanent luciferase residue under her skin. She holds a container to her ear. Listens. Nods. She claps once — two blue flashes illuminate the room. Every container pulses in response, a ripple of light like a wave. Then dark. 347 small ecosystems, each one alive.

ARRI Alexa 65, 25mm. Wide interior. No external light — bioluminescence only. Kodak 500T pushed two stops. Palette: black, blue-green glow, amber pulse, dark skin, bone-white eggshells. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 5, character: "Mere des Lucioles", location: "Mbaku", tags: ["bioluminescence", "insects", "nursery"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 06 — Le Frill a l'equinoxe",
    content: `Dawn. Tonalli plateau at 2,800m. The largest pyramid — eighty meters, 1,460 steps. At summit, the Frill of Bronze — twenty meters wide, angled east at 23.4 degrees. 150,000 people stand below in silence. The sun breaks the ridge, strikes the frill. The bronze ignites. The reflected beam descends, touches the stone marker. Dead center. The math is right. 150,000 breaths release — a low roar. Ixchel stumbles on the platform. Nobody sees.

IMAX 65mm. Ultra-wide. Kodak Ektachrome 100D. Saturated. Palette: red volcanic stone, gold frill, brown skin, white dust-beam, blue sky. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 6, character: "Ixchel", location: "Tonalli", tags: ["pyramid", "equinox", "frill", "astronomy"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 07 — Le Pont de Drek",
    content: `Black. Total black. Two hands holding — dark skin against dark skin against total dark. Eighty meters of bridge in total dark. The rite: in the dark you cannot see face, clothes, caste — you feel a hand. The hand is enough or is not enough. His thumb moves across her knuckles. The only gesture when you cannot see. Distantly, a bone tap on a pillar. One tap. Nothing. All is well. She says his name. He says hers. In the dark, names are the only proof they exist.

ARRI Alexa 65, 35mm. Near-black. Infrared reveal — hands, bridge, two bodies. Kodak 500T pushed four stops. Maximum grain. Palette: black. Just black. And two hands. 4K, 16:9, photorealistic.`,
    metadata: { prompt_index: 7, location: "Drek", tags: ["love", "darkness", "bridge", "rite"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 08 — Le sechoir a voiles de Koraleth",
    content: `Sunrise over Koraleth harbor. Bleached bone pillars — brachiosaur femurs vertical, twenty meters — with crossbeams holding dozens of prao sails drying. Each sail a different color: turquoise for amber guild, crimson for fishing fleet, saffron for temple ships, black for the Ratu's vessels. A laqueur walks the crossbeam barefoot, twenty meters up, painting the seventeenth coat. Below, three praos launch simultaneously. A skitter steals a fish head from a bucket.

RED V-Raptor, 35mm. Wide. Dawn golden light through translucent sails. Kodak Ektachrome 100D. Saturated. Palette: turquoise, crimson, saffron, black sails, white bone, golden light, dark skin. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 8, location: "Koraleth", tags: ["sails", "harbor", "colors", "bone"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 09 — Tano et Kri, la premiere nuit",
    content: `A pit. Three meters across. Two meters deep. Red earth walls scored with claw marks. Boy of nine against north wall, knees to chest. Young raptor against south wall — six months, brown-gold plumage, yellow glass-marble eyes. Between them: dried parasaurolophus meat, broken in two. They chew watching each other. In the raptor's brain: this one gives before it takes. The boy has just become the mother.

ARRI Alexa Mini, 32mm. Top-down through gap in boards. 1:1 square. Flat overcast light. Kodak 500T. Palette: red earth, brown-gold plumage, dark skin, grey light, dried meat. 4K, photorealistic.`,
    metadata: { prompt_index: 9, character: "Tano, Kri", tags: ["raptor", "bonding", "pit", "origin"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 10 — Mbaku la nuit",
    content: `Aerial descending. Mangrove delta, 200m above. Black water, black canopy, black sky — then lights. Mbaku burns blue. 60,000 souls on three levels, bone-lanterns pulsing blue-green. Root-bridges between trunks. The Heart tree, eight hundred years old, Temple of the Dream in violet. Three Fantomes — albino pteranodons — glide through. A Guetteur taps. Below, the spinosaur moves. The dead in the root-tombs are under everyone's feet. The living walk on the dead and the dead hold the living up. This is not a metaphor. This is architecture.

IMAX 65mm. Aerial descending. Night. Bioluminescent only. Kodak 500T pushed three stops. Heavy grain. Palette: black, blue-green, violet, white Fantomes, dark skin. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 10, location: "Mbaku", tags: ["aerial", "bioluminescent", "city", "night"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 11 — Grand-Mere Griffes tire a l'arc",
    content: `Open grassland. Parasaurolophus herd in middle distance. Dernier, old scarred raptor. On his back: Yara, sixty-seven, arthritis-twisted hands that resemble raptor claws. She holds a short recurve bow made from raptor-rib, drawn to her deformed right ear. She talks nonstop — about koumiss, young riders, weather. Dernier doesn't understand but a calm raptor is a steady raptor. She releases. Arrow crosses sixty meters. Clean kill behind the ear. "Bon. Tu vois ? Le matin c'est mieux."

RED V-Raptor, 135mm telephoto. Compression. Early morning, low horizontal light. Kodak 250D. Palette: golden grass, pale sky, brown raptor, dark weathered skin, bone-white bow. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 11, character: "Yara (Grand-Mere Griffes)", tags: ["archery", "raptor", "grassland", "hunt"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 12 — Owe le premier Guetteur",
    content: `Lowest platform of Mbaku. Owe, nineteen, legs hanging, bare feet in black water. His sister Tchi fell three days ago. He holds a hollow pteranodon bone, taps the pillar. One tap. The water pushes sideways — the spinosaur's bow wave. He has felt it three times. The circuit is not random. It can be read. 1 tap: nothing. 2 taps: maybe. 3 taps: stay up. Around his ankle, a young mangrove root growing around his skin. The city holds him.

ARRI Alexa 65, 50mm. Low angle from water level. Blue-green lanterns above, black water below. Kodak 500T. Palette: black water, blue-green light, dark skin, white bone, grey platform wood. 4K, 16:9, photorealistic.`,
    metadata: { prompt_index: 12, character: "Owe", location: "Mbaku", tags: ["guetteur", "spinosaur", "grief", "water"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 13 — L'Aqueduc-Brachi au crepuscule",
    content: `Three thousand kilometers of aqueduct. At this point — twenty-two columns shaped like brachiosaur legs, fifteen meters high. Water channel on top carries snowmelt. Under the arches: repairmen's huts. Evening light turns limestone orange. The water becomes a ribbon of fire. A repairwoman sits in her doorway, legs dangling, eating millet cake. 2,000 parasaurolophus pass through the valley. Her son, four, imitates the call. Terrible at it. She does not correct him.

IMAX 65mm. Ultra-wide. Golden hour. Kodak Ektachrome 100D. Palette: orange limestone, golden water-fire, green valley, brown-green herd, dark skin, thatch. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 13, location: "Pangean aqueduct", tags: ["aqueduct", "brachiosaur", "golden-hour", "family"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 14 — Le cimetiere-jardin",
    content: `A field of sixty Grenier-Oeufs — egg-shaped granaries, six meters high, filled with earth and planted. Flowers erupt from the tops, bees orbit everything. Each cylinder contains a body. A woman walks between the rows, pours water, speaks to each. At the twelfth — newer, bright red — she kneels. Her husband. Eight months. She places her palm flat against warm laterite. A bee lands on her hand, investigates, flies to a flower. Man feeds earth, earth feeds flower, flower feeds bee. The dead feed the living. This is not a metaphor. This is agriculture.

ARRI Alexa 65, 40mm. Medium-wide. Late afternoon. Kodak 250D. Palette: red-orange laterite, yellow and white flowers, deep red blooms, brown skin, bone-white sky. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 14, location: "Pangean", tags: ["cemetery", "garden", "grief", "cycle"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 15 — Le Temple du Courant",
    content: `Central building of Volonia on bone-stilts over the harbor, shaped like a mosasaur. Interior columns are polished plesiosaur ribs, pale as milk. Floor: a shallow basin of salt water that never drains. Ratu Seri, sixty-one, barefoot in the basin, holds amber with a beetle frozen mid-wingbeat for forty million years. Gold light pours through the mosasaur-mouth window. Her feet are cold. They are always cold. Sixty-one years of cold feet. A skitter catches a crab. Crunch echoes. She almost laughs. Almost.

RED V-Raptor, 25mm. Wide interior. Morning gold through mosasaur-mouth window. Kodak 500T. Palette: milk-white ribs, gold light, dark water, amber glow, dark skin. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 15, character: "Ratu Seri", location: "Volonia", tags: ["temple", "amber", "mosasaur", "water"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 16 — Le marche flottant a l'aube",
    content: `Dawn at Volonia. Low tide. The Grand Ponton emerges — the size of a football field, underwater at high tide, marketplace for six hours. Fifty barges converge, awnings of prao-sail fabric. An amber merchant arranges pieces on black velvet in optimal morning light. Three barges away, a mosasaur-parasite fish slapped onto cutting board. A child runs across a bridge placed ten seconds ago. A plesiosaur surfaces in the harbor mouth — head four meters, one breath, sinks. Nobody reacts. Every morning.

IMAX 65mm. Ultra-wide. Dawn golden light across wet surfaces. Kodak Ektachrome 100D. Palette: turquoise water, colored awnings, dark wood, white fish-flesh, gold light, dark skin. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 16, location: "Volonia", tags: ["market", "floating", "dawn", "trade"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 17 — Le Seuil des tyrannosaures au crepuscule",
    content: `Two tyrannosaur skulls on brachiosaur-femur posts, five meters high, jaws open. Moss in one eye socket, copper-repaired jaw on the other. Twelve raptor-riders approach in single file, silhouetted against burning orange sunset. Lead rider reaches up, ties a strip of red-ochre raptor-hide to the left skull's teeth — among a hundred others, some fossilized. Each strip: we came. We fight. Behind the gate: fires, tents, chained tyrannosaurs, a Claqueur marking evening. Clac. Clac. Clac-clac-clac.

RED V-Raptor, 50mm. Medium shot from inside camp. Sunset backlight through gate. Kodak 500T. Palette: yellowed bone, sunset gold, dark skin, amber raptor-plumage, red-ochre strips, green copper. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 17, location: "Pangean camp", tags: ["gate", "tyrannosaur-skulls", "riders", "sunset"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 18 — La petite Mambo de Mbaku",
    content: `Pharmacie aerienne suspended in mangrove branches. Shelves of fern-rib hold three hundred eggshell containers. Lua, eleven, three dinosaur teeth in her hair. She holds eggshell 212 — root-fungus for joint pain. She smells the old man's infected wound, smells the fungus again. "L'odeur de sa jambe ressemblait a l'odeur du champignon. Je me suis dit qu'ils devaient se connaitre." She applies it. Steady hands eleven-year-olds shouldn't have. Through the doorway: Mbaku glows blue-green. A Fantome glides past, stirring her hair. She doesn't turn.

ARRI Alexa Mini, 40mm. Interior. Amber lantern interior, blue-green exterior. Kodak 500T. Palette: amber interior, blue-green exterior, dark skin, white eggshell, red wound, green fungus. 4K, 16:9, photorealistic.`,
    metadata: { prompt_index: 18, character: "Lua", location: "Mbaku", tags: ["healer", "pharmacie", "fungi", "child"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 19 — Les pretresses de Quetz au-dessus des nuages",
    content: `Quetz. 3,500 meters. Above the cloud sea. Five priestesses-astronomers on a perching platform — stone beams over white infinity. A quetzalcoatlus descends — ten-meter wingspan, crest catching first light like stained glass. Lands. Impact shakes the platform. They don't flinch. Wings fold — sound of sails striking. A priestess produces a dried fish. The beak takes it surgically. The quetzalcoatlus turns to watch the sun rise. The priestess writes a number on black stone. The sky writes the calendar. The priestesses copy.

IMAX 65mm. Ultra-wide. Pre-dawn above clouds, pure gold. Kodak Ektachrome 100D. Palette: gold light, blue sky, white clouds, grey stone, dark skin, amber-red crest. 4K, 21:9, photorealistic.`,
    metadata: { prompt_index: 19, character: "Priestesses", location: "Quetz", tags: ["quetzalcoatlus", "clouds", "calendar", "astronomy"], source: "20_PROMPTS_NAYOU" },
  },
  {
    universe: "jurassic-wars",
    category: "prompt_image",
    title: "Nayou 20 — Le Comptoir de Songa, l'enfant ne sur la table",
    content: `The Comptoir de Songa. Half stone (red laterite), half root (living mangrove). Between: a Volonian bronze table. On the table: a newborn. Minutes old. The umbilical cord lies between ingots and a trade ledger — "Lingot N4, prix: —" never filled in because contractions started. Abla closed the sale at fifteen percent below market between contractions. A N'Goro healer from the root side, a Pangean midwife from the stone side. Three civilizations in one birth. Camera cranes up — the Comptoir shrinks. The cry follows up, thinning, never quite gone.

ARRI Alexa 65, 35mm. Medium interior. Mixed light: warm lantern stone-side, blue-green bio root-side. Kodak 500T. Palette: red laterite, green root, bronze table, dark skin, white cotton, blood. 4K, 16:9, photorealistic.`,
    metadata: { prompt_index: 20, character: "Abla, Songa", location: "Comptoir de Songa", tags: ["birth", "trade", "three-civilizations", "bronze"], source: "20_PROMPTS_NAYOU" },
  },

  // ═══════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — 20 VIDEO PROMPTS NAYOU
  // (compressed — full prompts in source file)
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 01 — Kofi et le premier coup",
    content: `Steadicam track forward through pre-dawn mist across cracked red laterite toward a fallen brachiosaur. Scale reveals itself — ribcage like a beached hull. Kofi walks into frame, touches the flank, says one word. The first bronze cleaver rises and falls. Steam erupts catching first horizontal light. Camera cranes up as the team surrounds the carcass. Behind: Nana carries clay bowls without looking. 8s. Pre-dawn blue to gold. Kodak 500T. 21:9.`,
    metadata: { prompt_index: 1, character: "Kofi", duration: "8s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 02 — Le Peseur touche deux fois",
    content: `Extreme close-up on dark weathered hands rotating amber the size of a plum. Light from the single east shutter makes it glow — an insect frozen mid-flight inside for forty million years. He brings it to his ear. Tilts his blind milky-eyed head. Places it on the pteranodon-bone balance. Tips. Holds. His lips count by feel. He always touches twice now. First time: the amber. Second time: the stone. 10s. Single east-shutter blade of gold. Kodak 250D. 16:9.`,
    metadata: { prompt_index: 2, character: "Peseur", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 03 — La descente au cenote",
    content: `Top-down into the cenote — 200-meter circle spiraling into depth. Itzal descends, camera descends WITH him. Sky above shrinks: dinner plate, coin, star. At 80 meters: cobalt water. A shaft of light falls straight down, hits water, reflects back up. Itzal kneels. Cups. Drinks. A drop falls — one frame of light. The stone drinks it. 10s. Vertical crane descent 80m continuous. Ektachrome 100D. 9:16 vertical.`,
    metadata: { prompt_index: 3, character: "Itzal", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 04 — Dara pose la main",
    content: `Tyrannosaur in river at dusk, jaw trembling. Nine tons vibrating — water ripples outward. Slow push-in. Dara enters right. Places hand on its side. Camera arrives at her hand — the heartbeat visible, skin pushing rhythmically, 200 BPM. A proto-heron lands on the dorsal ridge. The corner of her mouth moves. Almost. 10s. Wide hold, slow dolly push to hand close-up. Dusk purple/brown/orange rim. Kodak 500T. 21:9.`,
    metadata: { prompt_index: 4, character: "Dara", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 05 — Les mains qui brillent",
    content: `Camera drifts through eggshell containers on fern-rib shelves — blue, green, amber pulses at different rhythms. Rounds a corner to find the Mere des Lucioles. She lifts a container to her ear. Listens. Returns it. Then raises both hands and CLAPS. Two flashes of blue-green light. Every container on every shelf pulses in response — a ripple of light. Then dark. 347 small ecosystems. 8s. Zero external light. Kodak 500T+2. 21:9.`,
    metadata: { prompt_index: 5, character: "Mere des Lucioles", duration: "8s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 06 — Le rayon touche le point",
    content: `Dawn, Tonalli summit. Behind the Frill of Bronze. 150,000 heads below. Sun breaks the ridge. Ray hits frill. Bronze ignites — lens flare burns the frame. Whip-pan DOWN the beam from frill to stone marker. Dead center. 150,000 breaths releasing — a roar that flattens the grass. Ixchel stumbles on a rock. Nobody sees. 8s. Summit POV, whip-pan. First gold. Ektachrome 100D. 21:9.`,
    metadata: { prompt_index: 6, location: "Tonalli", duration: "8s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 07 — Le pont dans le noir",
    content: `Black frame. Three seconds. Bare feet on wet root. Two sets, out of sync. Infrared reveal — two figures on a bridge, only intertwined hands in focus. His thumb crosses her knuckles. Infrared fades. Black. From the far end: tap. Bone on wood. One tap. All is well. They step onto solid ground. She says a name. He says a name. Names are proof you exist. 10s. Lateral track, infrared oscillating with black. Kodak 500T+4. 16:9.`,
    metadata: { prompt_index: 7, location: "Drek", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 08 — Le sechoir au lever du soleil",
    content: `Camera rises vertically from harbor water — first pillar, then crossbeams, then sails. Dozens of prao sails in offshore breeze — turquoise, crimson, saffron, black — wet lacquer catching dawn. A laqueur walks a crossbeam barefoot twenty meters up. Behind him three praos launch — three slaps of wood on water. He doesn't turn. A skitter steals a fish head. 8s. Vertical crane rise, 20m continuous. Dawn gold. Ektachrome 100D. 21:9.`,
    metadata: { prompt_index: 8, location: "Koraleth", duration: "8s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 09 — Tano casse la viande en deux",
    content: `Top-down. The pit. Boy north wall. Raptor south wall. Meat center. Five seconds breathing. Hand reaches. Raptor head snaps up. Boy picks up meat. BREAKS it. Snap echoes. Places half before the raptor. Raptor looks at meat. At boy. At meat. Eats. Boy eats. They chew watching each other. Two animals. Two halves. One beginning. 10s. Top-down static, slight push at the break. Flat overcast. Kodak 500T. 1:1 square.`,
    metadata: { prompt_index: 9, character: "Tano, Kri", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 10 — Mbaku vue du ciel",
    content: `Aerial descent from stars — Southern Cross visible — tilting down to the delta. Black. Then lights. Mbaku burns blue. 60,000 souls, every edge pulsing blue-green. Root-bridges curving. Heart tree rises, violet at Temple. Three Fantomes cross frame white against blue, one wing grazes a lantern, flash-response ripples. Camera descends to platform level. A Guetteur taps. The sound rises to meet us. 12s. Continuous aerial descent, stars to street, 200m. Night, bioluminescent only. Kodak 500T+3. 21:9.`,
    metadata: { prompt_index: 10, location: "Mbaku", duration: "12s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 11 — Grand-Mere Griffes lache la fleche",
    content: `Telephoto compression. Yara on Dernier in golden grass, bow at full draw. Her lips move — talking about koumiss. Exhale mid-sentence. Release. Slow motion: arrow crossing 60 meters, shaft rotating, grass parting. Strikes behind the ear. Clean. Herd bolts — forty crests sounding panic. Return to real-time. Yara lowers bow. "Bon. Tu vois? Le matin c'est mieux." 10s. 135mm static, slow-mo arrow track. Kodak 250D. 21:9.`,
    metadata: { prompt_index: 11, character: "Yara", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 12 — Owe et la racine",
    content: `Low angle from water level. Owe's feet hanging in black water. Nineteen. His sister fell three days ago. The underside of Mbaku recedes above. He taps the bone against the pillar. The water pushes sideways. Taps twice. The water parts — dorsal sail, two meters of grey keratin, surfaces three seconds, submerges. Taps once. Safe. Camera drifts to his ankle. Underwater: a young mangrove root growing around his skin. The city holds him. 10s. Low water-level, push to feet, underwater drift. Kodak 500T. 16:9.`,
    metadata: { prompt_index: 12, character: "Owe", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 13 — L'aqueduc au crepuscule",
    content: `Drone tracking along the water channel atop the Aqueduc-Brachi — twenty-two columns like legs, water liquid fire reflecting sunset. Camera flies inches above the surface. Reaches hut seven. Repairwoman in doorway eating millet cake. Her son imitates the parasaurolophus call. Terrible at it. She doesn't correct him. Camera pulls back: the full aqueduct — a burning river on twenty-two stone dinosaurs. 10s. Drone tracking, orbit hut, wide pullback. Golden hour. Ektachrome 100D. 21:9.`,
    metadata: { prompt_index: 13, location: "Pangean aqueduct", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 14 — La veuve au grenier-jardin",
    content: `Camera glides between rows of Grenier-Oeufs — cylinders of red laterite, flowers erupting, bees orbiting. A woman enters — old, water jug, pours and speaks to each. At the twelfth, newer — she kneels. Palm flat against warm clay. Her husband. Eight months. A bee lands on her hand. Walks. Flies to a flower. Camera follows the bee UP — hand, clay wall, flower, sky. Man feeds earth, earth feeds flower, flower feeds bee. 10s. Glide between rows, push to hand, follow bee up. Kodak 250D. 21:9.`,
    metadata: { prompt_index: 14, location: "Pangean", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 15 — Seri dans le temple qui tangue",
    content: `Camera enters through the mosasaur-mouth window riding morning light. Gold floods the interior — plesiosaur-rib columns glow from below as basin water bounces light. Five centimeters of seawater on the floor. The building sways on stilts. Ratu Seri holds amber up to the light — the piece ignites, a beetle inside frozen mid-flight. Camera pushes to her face. Tired. Cold feet. A skitter catches a crab. Crunch echoes. 10s. Track forward through window with light. Gold through mosasaur-mouth. Kodak 500T. 21:9.`,
    metadata: { prompt_index: 15, character: "Ratu Seri", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 16 — Le marche nait de l'eau",
    content: `Time-lapse 8x. Dawn. Low tide. Grand Ponton emerges from the sea like a rising stage. Barges converge, V-wakes crossing. Awnings up — turquoise, crimson, saffron. Slows to real-time: a child runs across a fresh bridge. Camera follows at speed. Child reaches the edge. A plesiosaur surfaces — head four meters, one breath, sinking. The child watches. Worth watching. Every time. 10s. Static wide time-lapse, then Steadicam tracking child. Dawn gold. Ektachrome 100D. 21:9.`,
    metadata: { prompt_index: 16, location: "Volonia", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 17 — Le passage sous les cranes",
    content: `From inside camp looking through the Seuil — two yellowed tyrannosaur skulls on femur posts, jaws open. Twelve raptor-riders approach silhouetted against burning orange sunset. Lead raptor stops — head tilted, one eye on the skull. It remembers. The rider ties red-ochre raptor-hide to the left skull's teeth. The raptor ducks through. Camera pulls back — the camp resolves. The Claqueur marks evening. Clac. Clac. Clac-clac-clac. 10s. Static inside looking out, slow pull-back. Sunset backlight. Kodak 500T. 21:9.`,
    metadata: { prompt_index: 17, location: "Pangean camp", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 18 — Lua sent le champignon",
    content: `Pharmacie aerienne. Lua sits cross-legged — eleven, three teeth in hair. Before her: an old man, wound red and weeping. She opens eggshell 212. Eyes half-closed, nostrils flaring. Smelling the fungus. Turns to the wound. Smells it. The biological negotiation. She nods. Scoops with two small fingers. Applies. Through the doorway: Mbaku glows. A Fantome glides past, stirring her hair. She doesn't turn. Not her patient. 8s. Medium, macro face, back to medium. Amber interior, blue-green exterior. Kodak 500T. 16:9.`,
    metadata: { prompt_index: 18, character: "Lua", duration: "8s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 19 — Le quetzalcoatlus se pose",
    content: `Quetz. 3,500 meters. Above the cloud sea. Camera faces east from the perching platform. Five priestesses motionless, legs dangling. Shadow. Tilt up. A quetzalcoatlus descends — ten-meter wingspan, crest catching first light like stained glass. Lands. Impact shakes platform. Wings fold — sound of sails striking. One eye regards the nearest priestess. She produces a dried fish. The beak takes it surgically. It turns to watch the sunrise. She writes a number on black stone. 10s. East hold, tilt for approach, hold for landing. Pre-dawn above clouds. Ektachrome 100D. 21:9.`,
    metadata: { prompt_index: 19, location: "Quetz", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },
  {
    universe: "jurassic-wars", category: "prompt_video", title: "Video 20 — Le premier cri au Comptoir",
    content: `Interior. Le Comptoir de Songa — red laterite left, living mangrove root right, bronze table between. Camera drifts between the walls. On the table: ingots, trade ledger, blood. Abla against stone wall breathing hard. A N'Goro healer enters from root side. A Pangean midwife from stone side. They work without sharing a language. A cry. The first cry. Camera finds: newborn on bronze, fists clenched. The umbilical cord lies between ingots and the ledger — never filled in. Camera cranes up through the roof. The cry follows up, thinning, never quite gone. 10s. Interior drift, find baby, crane up. Warm lantern + blue-green bio meeting on the child. Kodak 500T. 16:9.`,
    metadata: { prompt_index: 20, character: "Abla, Songa", duration: "10s", source: "20_PROMPTS_VIDEO_NAYOU" },
  },

];

// ─────────────────────────────────────────────────────────
// INSERT
// ─────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🔫 Inserting ${entries.length} arsenal + JW prompt entries...\n`);

  const rows = entries.map((e, i) => ({
    universe: e.universe,
    category: e.category,
    title: e.title,
    content: e.content,
    tags: e.metadata?.tags || (e.metadata ? Object.values(e.metadata).filter(v => typeof v === "string").slice(0, 3) : []),
    word_count: e.content.split(/\s+/).length,
    order_index: i,
  }));

  const { data, error } = await supabase
    .from("lore_entries")
    .insert(rows);

  if (error) {
    console.error("❌ Insert error:", error.message);
    console.error("Details:", JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log(`✅ ${rows.length} entries inserted into lore_entries`);

  // Count by universe/category
  const counts = {};
  for (const r of rows) {
    const key = `${r.universe}/${r.category}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  console.log("\n📊 Breakdown:");
  for (const [key, count] of Object.entries(counts)) {
    console.log(`   ${key}: ${count}`);
  }
  console.log(`\n   TOTAL: ${rows.length}\n`);
}

run();
