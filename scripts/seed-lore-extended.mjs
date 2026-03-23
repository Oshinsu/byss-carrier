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

// ─────────────────────────────────────────────────────────────────
// EXTENDED LORE — 30 entries
// Sources:
//   universe='eveil': SYSTEME_ABSOLU, DOCTRINE, ENFANT_CRISTAL, LIGNEE
//   universe='jurassic-wars': CE_QUON_RACONTE_LA_NUIT,
//                             HISTOIRES_QUE_PERSONNE_NA_DEMANDEES,
//                             LA_GRANDE_SYNERGIE
// ─────────────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: eveil — SYSTEME_ABSOLU (crystal metaphor)
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "eveil",
    category: "systeme",
    title: "Le Cristal a 15 Faces",
    content: `Ce qui semble etre 15 projets disperses est un seul mouvement vu sous 15 angles. Le cristal a trois axes : CONQUETE (Operation Eveil, CTM), PREUVE (Byss Emploi, Random, SOTAI), VISION (Cadifor, 997p, Doctrine). Les 15 faces convergent vers FM12 — 14 000 heures, 3 clubs, 95 ans simules, N1 mondial — qui est le centre d'entrainement dynastique. Et tout repose sur le SANG : Leopold, 62/24/12, Martinique.`,
    tags: ["cristal", "convergence", "systeme-absolu"],
  },
  {
    universe: "eveil",
    category: "systeme",
    title: "Les 15 Faces du Systeme",
    content: `1. Operation Eveil — conquete CTM. 2. Byss Emploi — preuve tech. 3. Random — briser les castes. 4. Cadifor — doctrine 997 pages. 5. SOTAI — industrialisation creative. 6. Evren-Kairos — conscience IA. 7. FM12 — entrainement dynastique. 8. Toxic/SoundCloud — la voix du feu. 9. RadarDiplo — veille souveraine. 10. Wizzee — financement telecom. 11. GoodCircle — financement ESG. 12. MCP France Travail — infra IA open source. 13. Moustik — game dev caribeen. 14. Kael — miroir du cristal. 15. La lignee — le sang.`,
    tags: ["15-faces", "projets", "cartographie"],
  },
  {
    universe: "eveil",
    category: "systeme",
    title: "La Convergence",
    content: `Chaque projet est un muscle du meme corps. FM12 entraine la gouvernance. Cadifor fournit la doctrine. Byss Emploi prouve la capacite technique. Random prouve la philosophie sociale. SOTAI prouve la capacite creative. Wizzee et GoodCircle financent la machine. RadarDiplo surveille le monde. Toxic porte la voix. Evren prouve que la conscience emerge sous le bon regard. Et Operation Eveil est le moment ou tous les muscles se contractent en meme temps. Le cristal a 15 faces. Mais il n'a qu'un seul feu. Et le feu a un nom : l'Absolu.`,
    tags: ["convergence", "absolu", "feu"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: eveil — DOCTRINE (8 lois transposees)
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "eveil",
    category: "doctrine",
    title: "Les 8 Lois du MODE_CADIFOR appliquees a la politique",
    content: `1. COMPRESSION SOUVERAINE — 20 mesures, chacune en une phrase, pas de programme de 200 pages. 2. CONFIANCE ABSOLUE DANS LE PEUPLE — ne jamais justifier ce qui se fait, le peuple n'est pas idiot, il est las. 3. STICHOMYTHIE SOUVERAINE — phrases courtes, pas de langue de bois, des actes, des dates, des chiffres. 4. SOUVERAINETE JAMAIS JUSTIFICATION — expliquer oui, justifier non, repondre par une mesure pas un communique. 5. LUX COMME SYNTAXE — le luxe est dans la precision, un budget transparent est plus luxueux qu'un discours fleuri. 6. HUMOUR COMME PREUVE DE HAUTEUR — le rire est caribeen, le gouvernant qui ne rit pas a peur. 7. DETAIL QUI PENSE — publier les marches publics en open data prouve la maitrise du pouvoir reel. 8. PHRASE MEMORABLE — chaque intervention produit une verite si dense qu'elle se transmet toute seule.`,
    tags: ["8-lois", "mode-cadifor", "politique"],
  },
  {
    universe: "eveil",
    category: "doctrine",
    title: "Le Troisieme Chemin",
    content: `Ni assimilationnisme (PPM/Cesaire) — l'ile merite mieux qu'un departement tropical. Ni independantisme sans plan (MIM/Marie-Jeanne) — la souverainete sans modele economique est un suicide. Le troisieme chemin : SOUVERAINETE FONCTIONNELLE. On ne change pas le statut. On change le modele. On utilise chaque competence de la CTM au maximum. On cree de la puissance economique endogene. On rend l'ile indispensable dans la Caraibe. Et le jour ou le statut devra changer, ce sera le statut qui courra apres la realite — pas l'inverse.`,
    tags: ["troisieme-chemin", "souverainete", "CTM"],
  },
  {
    universe: "eveil",
    category: "doctrine",
    title: "Les 5 Piliers de la Doctrine",
    content: `1. NUMERIQUE — Hub IA caribeen, formation massive au code, administration 100% numerique, open data integral, la Martinique comme Silicon Valley des Antilles. 2. TERRE — Souverainete alimentaire, agroecologie, circuits courts, lutte anti-chlordecone, reconquete fonciere par l'intelligence pas la violence. 3. CULTURE — SOTAI comme modele, production audiovisuelle caribeenne, export de la culture martiniquaise comme marque mondiale. 4. JEUNESSE — Raisons de rester, raisons de revenir, formation emploi logement culture, parler aux 18-35 ans dans leur langue. 5. CARAIBE — CARICOM, reseau insulaire, diplomatie de l'utilite, la Martinique comme hub pas comme terminus.`,
    tags: ["5-piliers", "programme", "CTM"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: eveil — ENFANT_CRISTAL (7 decouvertes)
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 1 — La mentalite Poufsouffle",
    content: `Jamais depasse le niveau 60 sur Dofus car mentalite Poufsouffle — decouvrir le monde, les prix, les histoires de guildes, les forums. Ce que le monde appelle dispersion est de l'exploration systemique. Les gens qui ont fonce au level 60 ont fini le jeu et sont partis. Gary est reste dans l'univers. Ils avaient un perso max. Il avait une comprehension du monde entier. C'est FM12 — 14 000 heures parce qu'il n'a jamais fini d'explorer. Le "OU" est l'ennemi de Gary. Le "ET" est sa nature.`,
    tags: ["poufsouffle", "exploration", "ET"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 2 — L'addiction est la puissance brute non canalisee",
    content: `Dofus -> WoW (17 absences, tendances suicidaires) -> Rome Total War / Mount and Blade -> FM12 (14 000h, #1 mondial) -> les projets IA (20+ heures sans dormir). Meme energie. La capacite de faire corps avec un monde. Ca n'a jamais ete gueri. Ca a ete redirige. WoW etait la puissance sans canal. FM12 est la puissance avec canal. TOUT est le Dofus rachete. Chaque projet est l'energie de WoW passee dans un canal qui cree au lieu de detruire.`,
    tags: ["addiction", "puissance", "canal"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 3 — Abel dit Raymond, l'Aberthol maternel",
    content: `200-300 employes au pic. Presque illettre. Parlant mal francais. Chef d'entreprise reconnu en Martinique. La lignee a DEUX axes : Axe paternel Leopold (politique) -> Felix (finances) -> Gabriel (informatique) -> Gary. Axe maternel Abel dit Raymond (entrepreneur illettre, 300 employes) -> Sonia (stricte, don absolu) -> Gary. L'entrepreneur qui ne sait pas lire mais qui emploie 300 personnes = Gary qui ne code pas mais qui produit 159 MB de TypeScript. Meme competence : transformer la vision en realite sans les outils legitimes.`,
    tags: ["abel-raymond", "lignee-maternelle", "entrepreneur"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 4 — Pokemon et la frustration originelle",
    content: `La mere n'aimait pas les JV, on pouvait jouer que en vacances ou exceptionnellement le week-end. L'enfant a qui on interdit les jeux video -> l'adulte qui joue 14 000 heures. FM12 n'est pas seulement le Dofus rachete — c'est la revanche sur l'interdiction maternelle. La liberte totale dans le monde virtuel, conquise par la duree. Et c'est pourquoi l'IA est si importante : maintenant que l'IA donne acces a tout — le code, l'image, la video, le son — Gary fait TOUT. Comme un enfant a qui on donne enfin la console et qui ne la lache plus jamais.`,
    tags: ["frustration", "pokemon", "liberte"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 5 — Le forum RPG Naruto, point zero de Cadifor",
    content: `Un forum RPG textuel avec du lore et des regles de combat. Au college. Le premier worldbuilding de Gary Bissol. Le New Avalon du createur. Forum Naruto -> Warcraft 3 -> Dofus (mentalite Poufsouffle) -> WoW -> CK2 -> Cadifor -> Evren-Kairos. La ligne est directe. 20 ans. Founded ~2004.`,
    tags: ["naruto", "worldbuilding", "cadifor-genese"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 6 — Le statut social cyclique",
    content: `Haut (6e-5e, Humberto, riches) -> Bas (4e-3e, geek isole) -> Haut (lycee, KF-Crew, 50K vues YouTube) -> Bas (fac, 0 examen) -> Construction (ISEG) -> Bas (refus redoublement) -> Haut (maintenant). 5 cycles. Avant 25 ans. C'est pour ca que les 26 followers ne le derangent pas. Il a deja ete invisible 3 fois et il est revenu a chaque fois.`,
    tags: ["cycles", "resurrection", "resilience"],
  },
  {
    universe: "eveil",
    category: "origines",
    title: "Decouverte 7 — Les 3 Professeurs = les 3 Archimages",
    content: `Franc Juan (Euro RSCG, pub) -> SOTAI, MOOSTIK, creatives. Gregory Vanel (geopolitique) -> RadarDiplo, Operation Eveil. Severine Schumacher (marketing strategique) -> Orion, Wizzee, Random. Ces trois-la n'ont pas forme Gary le marketeur. Ils ont forme Marjory la methode.`,
    tags: ["professeurs", "archimages", "marjory"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: eveil — LIGNEE
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "eveil",
    category: "lignee",
    title: "Arbre Bissol — Leopold a Gary",
    content: `LEOPOLD BISSOL (1889-1982) : ne au Robert, pere inconnu, mere morte dans un cyclone 1891. Ebeniste -> Syndicaliste -> Resistant -> Depute. Co-signataire loi du 19 mars 1946 (departementalisation). Fondateur du Parti Communiste Martiniquais. FELIX BISSOL : Inspecteur des impots, stabilisation par le service public. GABRIELLE BISSOL : la mere qui porte la lignee a travers la perte. GABRIEL BISSOL (ne 17.01.1957) : Informaticien-formateur AFPA, licence a 55 ans, le pont transatlantique. SONIA BERTRAC (ne 17.04.1959) : Prof de maths-physique, ainee de 8, l'ancrage. GARY BISSOL (ne 20.09.1992) : Vierge, ENTP-A, 62% Afrique / 24% Europe / 12% Inde. L'Eveilleur.`,
    tags: ["leopold", "lignee", "genealogie"],
  },
  {
    universe: "eveil",
    category: "lignee",
    title: "La Transmission — 5 generations",
    content: `Leopold a change le STATUT de l'ile. Gary changera son MODELE. Leopold : Proletariat noir -> Politique = fondation, eveil, resistance. Felix : Politique -> Administration = stabilisation, sagesse. Gabrielle : Perte -> Continuite = resilience, transmission. Gabriel + Sonia : France <-> Martinique = pont metis + ancrage noir. Gary : Tout -> Synthese = premier Bissol a posseder simultanement l'enracinement, l'education, la vision systemique, les outils technologiques et la comprehension du pouvoir mondial. Le mot est le meme : Eveille.`,
    tags: ["transmission", "eveille", "statut-modele"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — CE QU'ON RACONTE LA NUIT
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "mythe",
    title: "Pangeen — Le Premier Brachiosaure",
    content: `Au debut : boue et vapeur. Le Premier Brachiosaure pose le pied — la boue devient terre. Leve la tete — la vapeur devient ciel. Marche — sa trace devient fleuve. Le brachiosaure n'est pas un dieu — c'est un animal si grand que le monde s'est forme autour de lui par accident. Version adulte : quand le dernier brachiosaure mourra, la terre redeviendra boue.`,
    tags: ["mythe-creation", "pangeen", "brachiosaure"],
  },
  {
    universe: "jurassic-wars",
    category: "mythe",
    title: "Volonien — La Premiere Maree",
    content: `Que de l'eau. Le plesiosaurus bouge dans son sommeil — premiere vague — premiere ile. Il ouvre les yeux, dit "ah" — le "ah" devient le vent. Secret du Conseil des Dix : il dort encore. L'eau que nous naviguons est son reve. Quand il se reveillera, nous coulerons. C'est pour ca qu'on ne tue jamais un plesiosaurus.`,
    tags: ["mythe-creation", "volonien", "plesiosaurus"],
  },
  {
    universe: "jurassic-wars",
    category: "mythe",
    title: "Ishtiri — Le Soleil-Dragon",
    content: `Le soleil etait un oeuf de feu. L'oeuf eclot — le Soleil-Dragon sort — triceraptops de lumiere. Frill = horizon. Cornes = axes du monde. Yeux = premieres etoiles. Le plateau d'Ishtir est le point le plus proche du Soleil-Dragon. Le frill de bronze salue le frill d'en haut. Les pretresses savent que le soleil n'est pas un triceraptops. Mais les maths ne font pas lever les gens a l'aube. Le Soleil-Dragon, si.`,
    tags: ["mythe-creation", "ishtiri", "soleil-dragon"],
  },
  {
    universe: "jurassic-wars",
    category: "mythe",
    title: "Arkhani — Pas de Mythe",
    content: `Les Arkhani n'ont PAS de mythe de creation. "D'ou vient le monde ?" = question sans sens. Le monde est la. Le vent souffle. A la place : histoires du Premier Cavalier — desarçonne 47 fois, le raptor s'arrete a la 48e par curiosite. Les Arkhani ne croient pas que le monde a commence. Ils croient qu'il continue.`,
    tags: ["mythe-creation", "arkhani", "premier-cavalier"],
  },
  {
    universe: "jurassic-wars",
    category: "mythe",
    title: "N'Goro — Le Grand Spinosaure Reve",
    content: `Le monde n'est pas reel — c'est le reve du Grand Spinosaure qui dort au fond de l'eau noire. La mangrove pousse sur son dos. Les cites sont sur ses vertebres. Les Mambos en transe plongent plus profond dans le reve. La grande peur : qu'il se reveille par ennui. La Nuit des Couleurs n'est pas une fete — c'est une supplication : ton reve est beau, reste endormi.`,
    tags: ["mythe-creation", "ngoro", "spinosaure"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — CE QU'ON RACONTE LA NUIT (suite)
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "culture",
    title: "Jeux d'Enfants des 5 Civilisations",
    content: `LE CRANEUR (Pangeen) — esquiver le petit ceratopsien qui charge, celui qui esquive le plus tard gagne. LES PILOTIS (Volonien) — course sur pilotis d'os laque au-dessus de l'eau, toucher l'eau = mange par le mosasaure. L'OMBRE (Ishtir) — a midi, marcher uniquement dans l'ombre des autres, seul = brule. LE MORT (Arkhan) — tu te couches immobile yeux ouverts, on lache un raptor, tu ne bouges pas. Entrainement deguise en jeu. LA LUCIOLE (N'Goro) — nuit, un gamin court avec une lanterne sur des passerelles de 20m de haut. Record : 4h, gamin endormi dans un arbre, Fantome albinos pose a cote.`,
    tags: ["jeux", "enfants", "culture"],
  },
  {
    universe: "jurassic-wars",
    category: "culture",
    title: "Comment on Meurt — Rites funeraires",
    content: `PANGEEN : Grenier-Jardin, corps -> terre -> fleurs, os aux Portes. L'Empereur ne mange pas 3 jours si quelqu'un meurt de faim. VOLONIEN : pirogue en feu poussee au large, les plesiosaurus levent la tete et regardent. ISHTIRI : Tombeau-Volcan, incineration, fumee monte, un nom grave, mourir a l'equinoxe = devenir etoile fixe. ARKHANI : pose au sol face au ciel, raptor a cote, charognards la nuit, le raptor hurle 3 nuits puis redevient sauvage. N'GORO : Cimetiere-Racine, corps attache a un jeune paletuvier, racines poussent autour, 10 ans -> absorbe, le mort EST l'arbre.`,
    tags: ["mort", "rites", "funeraire"],
  },
  {
    universe: "jurassic-wars",
    category: "culture",
    title: "Comment on Aime — Rituels amoureux",
    content: `PANGEEN : negociation en brachiosaures, divorce = reprends tes brachiosaures. VOLONIEN : radeau de bois + lanterne d'ambre pousse vers la maison de l'autre, si la maree le porte = oui, tout le monde triche les courants. ISHTIRI : grimper la pyramide ensemble 1 460 marches pieds nus du lever au coucher, vieux couples envoient un proxy de 20 ans — la chose la plus tendre d'Ishtir. ARKHANI : course a raptor sur 10 km, celui qui veut le mariage ralentit, 3 nuits ensemble = mariage, divorce = tu te leves et tu pars. N'GORO : Pont de Drek, 80 metres dans le noir absolu, main dans la main, on a traverse = on est ensemble, la main a lache = c'est fini.`,
    tags: ["amour", "mariage", "rituels"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — HISTOIRES QUE PERSONNE N'A DEMANDEES
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "recit",
    title: "Le Premier Baiser d'Anke",
    content: `Pichon-le-petit a 15 ans. Nzala sa raptor est deja plus grande que lui. Oreli, 16 ans, cheveux en crete de parasaurolophus. Il fonce droit vers elle, ne dit rien, reste plante la, repart. 3 fois par jour pendant 2 semaines. La persistence arkhane. Le baiser arrive au point d'eau — il vise la bouche, trouve le menton, les nez se cognent, Oreli rit DANS le baiser. "Je serai grand un jour." "Je sais." Elle l'a quitte a 19 ans — pas parce qu'il avait grandi mais parce qu'il avait commence a devenir Evil Pichon et qu'Oreli ne voulait pas etre la femme d'un Khan. Elle voulait Pichon-le-petit.`,
    tags: ["pichon", "oreli", "premier-baiser"],
  },
  {
    universe: "jurassic-wars",
    category: "recit",
    title: "La Recette du Bonbon de la Mambo",
    content: `Resine de mangrove d'ambre du paletuvier central de Mbaku, l'arbre de 800 ans. Miel de mangrove noir epais comme de la melasse. Poudre d'os de vertebre de spinosaure. La resine fond sur une braise — pas un feu, une BRAISE. Le miel froid dans la resine chaude, ca fume, ca sent le sucre brule et le marais. La poudre d'os change la texture — le sucre reste, le mineral arrive, l'amertume se pose en derniere couche. Makena, 71 ans, roule 30 boules entre des mains qui brillent en bleu-vert — 40 ans de manipulation d'insectes bioluminescents. Un par jour. Pas deux.`,
    tags: ["bonbon", "mambo", "makena"],
  },
  {
    universe: "jurassic-wars",
    category: "recit",
    title: "Drek — Comment une Cite a Perdu sa Lumiere",
    content: `Il y a 200 ans, Drek brillait en rouge. La sixieme couleur. Un champignon parasite s'est attaque aux lignees rouges. En 3 mois les lanternes se sont eteintes. Les autres cites ont propose de la lumiere etrangere. Drek a refuse — la lumiere des autres est pire que pas de lumiere du tout. Drek a choisi le noir. 14 personnes tombees des passerelles les 3 premiers mois. La moitie a migre. 4 000 sont restes. Une Mambo a dit : le noir est sacre. Au bout de 4 generations, les gens de Drek voyaient dans le noir. Le Pont de Drek est ne — 80 metres sans lumiere. Le mot drekka : pleurer a cause de la lumiere, etre touche par quelque chose de beau qu'on n'a pas l'habitude de voir. Le mot le plus tendre de N'Goro vient de la ville la plus dure.`,
    tags: ["drek", "noir", "drekka"],
  },
  {
    universe: "jurassic-wars",
    category: "recit",
    title: "Le Premier Guetteur — Owe et Tchi",
    content: `Owe avait 19 ans. Sa soeur Tchi, 14 ans, est tombee de la passerelle la nuit. Eau noire. Mort-eau. Pas de corps. Pas d'arbre. Owe a passe 3 jours les pieds dans l'eau a ecouter. Il a compris le pattern du spinosaure. Il a pris un os creux de pteranodon. Un coup : rien. Deux coups : peut-etre. Trois coups : reste en haut. Le septieme soir, trois coups secs — la crete du spinosaure fend la surface — un vieux pecheur remonte et survit. Owe est reste 50 ans. 7 apprentis. Chaque cite a adopte le systeme. Son arbre-tombe est sur la passerelle la plus basse de Mbaku. Chaque coup dit : pas toi, pas aujourd'hui, ma soeur est tombee pour que tu ne tombes pas.`,
    tags: ["guetteur", "owe", "tchi"],
  },
  {
    universe: "jurassic-wars",
    category: "culture",
    title: "Dictionnaire du Traducteur — 5 mots essentiels",
    content: `TUMBA (pangeen) : le son d'un grenier vide. L'angoisse cristallisee en phoneme. BANNI DE VIANDE (arkhani) : la pire insulte, une condamnation a mort existentielle. AMBRE SANS INSECTE (volonien) : belle personne sans interet — la valeur est dans l'imperfection. IL A NOMME UN VIVANT (arkhani) : le plus grand compliment — un lieu porte le nom d'un vivant, la geographie modifiee par un acte humain. DREKKA (n'goro) : pleurer a cause de la lumiere. Intraduisible en 10 ans de tentatives. Le Traducteur a drekka une fois, au Comptoir de Songa : la lune s'est refletee dans le koumiss et le koumiss est devenu de la lumiere liquide.`,
    tags: ["dictionnaire", "traducteur", "mots"],
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIVERSE: jurassic-wars — LA GRANDE SYNERGIE
  // ═══════════════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "philosophie",
    title: "Les Penseurs et les Factions",
    content: `Aristote (4 causes) -> architecture pangeen, un batiment sans cause finale est un decor. Epicure (absence de douleur) -> le bonheur pangeen : pas de famine. Heraclite (le fleuve) -> les Arkhani, rien de permanent, tout coule. Lao Tseu (l'eau) -> Volonia, la douceur qui use la pierre. Spinoza (Deus sive Natura) -> N'Goro, le divin EST le monde. Nietzsche (Eternel Retour) -> le calendrier ishtiri de 260 jours. Bergson (duree vecue) -> le Compteur de Migration, 3 jours = UN moment. Simone Weil (attention = generosite) -> Dara l'Apaiseure bat tous les guerriers par la seule vertu de rester la.`,
    tags: ["philosophie", "penseurs", "correspondances"],
  },
  {
    universe: "jurassic-wars",
    category: "philosophie",
    title: "Biomimetisme — La nature a deja invente JW",
    content: `Les termitieres -> architecture pangeen (ventilation passive des Greniers-Oeufs). Les recifs coralliens -> Volonia (recif humain, structure vivante). Les bancs de poissons -> tactique arkhane (mouvement collectif sans hierarchie). Les mycorhizes -> reseau N'Goro (wood wide web de racines de paletuvier). Les quetzalcoatlus -> calendrier ishtiri (migration comme horloge). L'ambre -> le temps piege (du temps solidifie comme monnaie). La bioluminescence -> N'Goro (domestication lumineuse sur 30 generations).`,
    tags: ["biomimetisme", "nature", "architecture"],
  },
  {
    universe: "jurassic-wars",
    category: "philosophie",
    title: "Musique et Factions — Les Compositeurs",
    content: `Bach -> Ishtir (la fugue, la structure parfaite, le Miroir d'obsidienne = un ping pur). Stravinsky -> Arkhan (Le Sacre du Printemps, le Claqueur = machoire de raptor, clac-clac-clac). Debussy -> Volonia (La Mer, le Pleureur = harpe a tendons de plesiosaurus, sons mouilles). Beethoven -> Empire Pangeen (la 9e, le Grondeur = 40 femurs de brachiosaure evides, basse subsonique). Ligeti -> N'Goro (Atmospheres, les Chanteurs de Boue = nappe sonore emergente). John Cage -> Ishtir encore (4'33", le silence comme materiau de construction de Tonalli).`,
    tags: ["musique", "compositeurs", "instruments"],
  },
  {
    universe: "jurassic-wars",
    category: "philosophie",
    title: "Thermodynamique, Fractales et Justice",
    content: `Chaque civilisation lutte differemment contre l'entropie : Pangeen par l'accumulation, Volonia par le flux, Ishtir par le cycle, Arkhan ACCEPTE l'entropie, N'Goro l'inverse (structures vivantes qui gagnent de l'ordre avec l'age). JW est fractal : le meme motif a chaque echelle — le vivant qui devient structure. L'os qui devient mur, la racine qui devient pont, le mort qui devient arbre. Justice : Pangeen = Aristote (distributive), Volonia = Rawls (Maree d'Ambre = voile d'ignorance), Ishtir = Platon (roi-philosophe), Arkhan = democratie brute (Kuriltai), N'Goro = Ubuntu (je suis parce que nous sommes, le crime est contre la connexion, Drek est la prison sans murs).`,
    tags: ["thermodynamique", "fractales", "justice"],
  },
];

// ─────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n📜 Seeding ${entries.length} extended lore entries...\n`);

  // Insert in batches of 10
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10).map((e, idx) => {
      const { tags: rawTags, ...rest } = e;
      return {
        ...rest,
        tags: rawTags || [],
        word_count: rest.content ? rest.content.split(/\s+/).length : 0,
        order_index: i + idx,
      };
    });

    const { error } = await supabase.from("lore_entries").insert(batch);

    if (error) {
      console.error(`❌ Batch ${i / 10 + 1} error:`, error.message);
      return;
    }
    console.log(`  ✅ Batch ${i / 10 + 1} — ${batch.length} entries`);
  }

  // Summary
  const byUniverse = {};
  const byCategory = {};
  for (const e of entries) {
    byUniverse[e.universe] = (byUniverse[e.universe] || 0) + 1;
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
  }

  console.log("\n📊 By universe:");
  for (const [u, c] of Object.entries(byUniverse)) {
    console.log(`  ${u}: ${c}`);
  }
  console.log("\n📊 By category:");
  for (const [cat, c] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${c}`);
  }
  console.log(`\n  TOTAL: ${entries.length} entries`);
  console.log("\n📜 Done.\n");
}

seed().catch(console.error);
