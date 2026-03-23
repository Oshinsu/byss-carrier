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
// JURASSIC WARS LORE — 35 entries, universe='jurassic-wars'
// Source: ARCHITECTURE_DU_MONDE, LES_GENS, LE_MONDE_VIT,
//         LE_LORE_VIVANT, LE_CARNET_DU_BAZAR — by Nayou
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: faction
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "faction",
    title: "Empire Pangeen",
    content: `La masse qui dure. Grande Plaine de laterite rouge. Mwamba, capitale de 800 000 ames sur une mesa de 120 metres. Architecture de femurs de brachiosaure, Age du Bronze. 6 000 brachiosaures domestiques. 14 types architecturaux : Grenier-Oeuf, Muraille-Ecaille, Aqueduc-Brachi (3 000 km), Tour-Vertebre, Arene-Oeuf (100 000 places), Forge-Cratere. Monnaie : lingots de bronze. Le Corps Imperial du Fumier : 3 000 employes pour 2 400 tonnes/jour — les fonctionnaires les mieux payes apres les bouchers.`,
    metadata: { leader: "L'Empereur", population: "~800K capitale", source: "ARCHITECTURE_DU_MONDE" },
  },
  {
    universe: "jurassic-wars",
    category: "faction",
    title: "Republique Volonia",
    content: `L'eau qui compte. Archipel de 47 ilots relies par des pontons de bois laque. 300 000 ames. Les Maisons-Praos sont reversibles : retourne ta maison, mets-la a l'eau. Pilotis d'Os-Laque : femur de brachiosaure, laque noire, dure 400 ans. Le Temple du Courant : forme de mosasaure, sol = 5 cm d'eau. Prison d'Eau : 3 marees, la mer decide. Monnaie : ambre pesee au gramme. Le Peseur aveugle juge au poids, au toucher, a l'odeur.`,
    metadata: { leader: "Ratu Seri", population: "~300K", source: "ARCHITECTURE_DU_MONDE" },
  },
  {
    universe: "jurassic-wars",
    category: "faction",
    title: "Royaume Ishtir",
    content: `Le feu sacre. Tonalli sur plateau volcanique a 2 800 m. 7 pyramides a degres. La Grande Pyramide : 80 m, 1 460 marches (une par jour du cycle de 4 ans). Frill de Bronze de 20 m au sommet — capte le premier rayon du soleil, recalibre a 0.3 degre pres. Observatoire-Crane : trou en forme d'oeil de triceraptops, 3 minutes de lumiere par an. Monnaie : lames d'obsidienne calibrees.`,
    metadata: { leader: "Le Roi-Pretre", population: "~150K capitale", source: "ARCHITECTURE_DU_MONDE" },
  },
  {
    universe: "jurassic-wars",
    category: "faction",
    title: "Confederation Arkhan",
    content: `Le vent qui tranche. Pas de villes — des LIEUX. Le Kuriltai Eternel : cercle de 500 m trace par mille raptors, 2 fois par an, jamais au meme endroit. Rakhad : canyon de gres rouge, 12 000 personnes en saison seche. Tente-Raptor : peau de raptor sur arceaux d'os, 8 min de montage. De loin un camp ressemble a un troupeau de raptors endormis. Le concept de monnaie n'existe pas — le prestige est la monnaie.`,
    metadata: { leader: "Evil Pichon, le Khan", population: "~50K cavaliers", source: "ARCHITECTURE_DU_MONDE" },
  },
  {
    universe: "jurassic-wars",
    category: "faction",
    title: "Cites-Etats N'Goro",
    content: `Le reve qui mord. Delta de mangrove. 6 cites, chacune brille d'une couleur. Mbaku en bleu (60 000 ames), Krath en vert (pharmacie), Songa en violet (frontiere), Tala en ambre (constructeurs), Zuri en blanc (cite des morts), Drek ne brille pas (ville sans lumiere). Passerelles vivantes de racines aeriennes — plus c'est vieux, plus ca tient. Monnaie : fioles de poison standardisees.`,
    metadata: { leader: "Conseil des Mambos", population: "~60K Mbaku", source: "ARCHITECTURE_DU_MONDE" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: biome
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "biome",
    title: "Grande Plaine — Centre",
    content: `Laterite rouge, millet, brachiosaures. Mwamba au centre du centre. Saison seche (7 mois) : sol craque, millet recolte, greniers pleins. Saison des pluies (5 mois) : tout devient boue, routes disparaissent, Arene inondee. L'Aqueduc-Brachi couvre 3 000 km — reparateurs vivent SUR l'aqueduc dans des cabanes sous les arches.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "biome",
    title: "Archipel de Corail — Sud-Ouest",
    content: `47 ilots dans lagon turquoise. Pas de saisons : calendrier de 730 jours, 2 marees/jour. Cycle tempetes : 3 mois calme, 2 mois tempetes. Le recif EST la frontiere — mosasaures dans les eaux profondes. La Maree d'Ambre : apres les tempetes, courants ramenent l'ambre fossile. 48h de ramassage egalitaire.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "biome",
    title: "Plateau Volcanique — Nord-Est",
    content: `2 800 metres. Air rare. 4 saisons : Le Feu (40C), L'Eau (torrents), Le Vent (migration quetzalcoatlus), Le Retour (mariages, Equinoxe du Frill). Le Chemin de la Corne : 40 km paves, chaque borne porte un verset sacre. La route EST le livre.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "biome",
    title: "Delta de Mangrove — Sud",
    content: `Eau noire, racines, bioluminescence. La Montee (6 mois) : eaux montent, spinosaure plus actif. La Descente (6 mois) : racines se denudent, enfants explorent. Une fois par generation, l'eau descend assez pour voir des os IMMENSES au fond. Les os du Grand Spinosaure qui reve ? Le mystere EST la religion.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: character
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "character",
    title: "Evil Pichon — Le Khan",
    content: `33 ans. Ne en migration sur le dos d'un parasaurolophus. Nom de naissance : Anke. "Pichon" = petit en dialecte pangeen. "Evil" = dangereux, apres avoir casse la machoire d'un sub-adulte tyrannosaure avec une masse de bronze. Ti, compsognathus de 3 kg, dort sur son epaule gauche depuis 11 ans. Ne boit jamais plus de 2 cranes de koumiss au Kuriltai — avantage tactique deguise en sobriete. Son raptor Silence connait la guerre avant que l'homme ne la pense.`,
    metadata: { faction: "Arkhan", age: 33, source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Ratu Seri — Dirigeante de Volonia",
    content: `61 ans. Dirige le Conseil des Dix depuis 23 ans. Meilleure negociatrice du monde — achete l'ambre 30% moins cher, vend les praos 40% plus cher. Reve secretement de terre seche. Son mari est mort noye dans le port, 1 metre d'eau, saoul. Elle a dit "ah" et est retournee travailler. Les mots longs c'est pour les douleurs courtes.`,
    metadata: { faction: "Volonia", age: 61, source: "LES_GENS" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Kofi le Boucher Imperial",
    content: `Connait les 47 morceaux d'un brachiosaure. Equipe de 30 bouchers. Le premier coup va toujours dans le ventre — le ventre fermente en premier. A vu un brachiosaure exploser une fois, couvert de tripes a 30 metres. N'en parle jamais. Sa femme Nana est potiere. 27 ans de mariage, dorment dos a dos — les odeurs se melangent face a face. Leur fils veut etre musicien. Kofi ne comprend pas. Nana si.`,
    metadata: { faction: "Pangeen", source: "LES_GENS" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Ixchel — La Pretresse Qui Doute",
    content: `34 ans. Pretresse-astronome de 3eme rang. Connait 400 etoiles par leur nom. Doute que les quetzalcoatlus soient les messagers du Soleil-Dragon. Croit que c'est du calcium, pas l'essence du vol. Mais a l'equinoxe, quand 150 000 personnes retiennent leur souffle et que la lumiere fait exactement ce que les maths ont predit — elle sent quelque chose. A eternue pendant l'Equinoxe. 150 000 personnes ont entendu.`,
    metadata: { faction: "Ishtir", age: 34, source: "LES_GENS" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Lua — La Petite Mambo",
    content: `11 ans. 3 dents dans les cheveux — 3 patients gueris. Un Chanteur de Boue s'est pose dans sa main. Sa premiere guerison : infection a la jambe avec un champignon de racine que personne n'utilisait pour les infections. "L'odeur de sa jambe ressemblait a l'odeur du champignon. Je me suis dit qu'ils devaient se connaitre." La vieille Mambo de Mbaku : "celle-la ira loin. Ou elle explosera."`,
    metadata: { faction: "N'Goro", age: 11, source: "LES_GENS" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Le Traducteur",
    content: `43 ans. N'a pas de nom — il a quitte son nom. Pangeen de naissance, Volonien de formation, Ishtiri de curiosite, Arkhani de necessite, N'Goro de choix. Parle les 5 langues BIEN — pas "je me fais comprendre" mais "je connais tes insultes, tes blagues, tes mots pour la pluie et tes mots pour le sexe". Ecrit un dictionnaire d'insultes comparees. C'est l'oeuvre de sa vie. Personne ne la lira.`,
    metadata: { age: 43, source: "LES_GENS" },
  },
  {
    universe: "jurassic-wars",
    category: "character",
    title: "Yara — Grand-Mere Griffes",
    content: `67 ans. Monte encore. Son raptor Dernier — le 3eme de sa vie. L'arthrite lui a tordu les doigts mais les doigts tordus serrent mieux la corde. La cavaliere la plus precise d'Arkhan parce que son raptor est le plus calme — elle ne ferme jamais sa gueule. Evil Pichon l'a consultee une fois : "Attaque le matin. Le soir tu fais des erreurs. Le matin aussi mais tu t'en rends pas encore compte."`,
    metadata: { faction: "Arkhan", age: 67, source: "LES_GENS" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: creature
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Kiki — Compsognathus domestique",
    content: `2-3 kg. Plumes rousses. Yeux dores. Vit dans les camps comme un chat de gouttiere. Trop petit pour etre utile, trop con pour etre dresse. Ti — le compsognathus d'Evil Pichon — est un Kiki noble. La difference entre Ti et un Kiki de camp : genetiquement identique, socialement abyssale.`,
    metadata: { weight: "2-3 kg", source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Fantome — Pteranodon albinos",
    content: `Rare. Envergure 3 m. Blanc pur, presque translucide. Vit uniquement dans le delta de N'Goro. Silencieux — plane entre les cites la nuit. Les N'Goro croient qu'ils transportent les ames des morts. Les guerisseurs savent que c'est un pteranodon qui chasse les insectes lumineux. Ils ne contredisent pas.`,
    metadata: { wingspan: "3m", source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Goutteur — Mosasaure d'aqueduc",
    content: `Petit mosasaure de la taille d'un crocodile dans le reseau d'aqueducs ishtiri. Mange les algues, nettoie le systeme. Un Goutteur a grandi 12 ans sans que personne s'en rende compte, bouchant l'aqueduc avec son propre corps. L'extraction a pris une semaine. Les enfants l'ont nomme Bouchon. Les fontaines bourdonnent a 3h du matin — le bonheur digestif d'un reptile.`,
    metadata: { source: "LE_CARNET_DU_BAZAR" },
  },
  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Craneur — Petit ceratopsien",
    content: `Taille d'un cochon. Frill minuscule deploye en permanence. Charge TOUT — humains, raptors, cailloux. 40 kg, rebondit sur les jambes, se releve, recharge. A charge l'Empereur dans le jardin imperial. L'Empereur : "Qu'on ne touche pas a cet animal. Il est le seul etre de cette cour qui dit exactement ce qu'il pense." Promu mascotte officielle. S'appelle Conseil.`,
    metadata: { weight: "40 kg", source: "LE_CARNET_DU_BAZAR" },
  },
  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Pilleur — Voleur de chaussures",
    content: `Theropode 1m50, vit en meutes de 3-5. Specialise dans le VOL : viande, oeufs, chaussures. Les Pilleurs ne mangent pas les chaussures — ils dorment dessus. L'odeur humaine repousse les predateurs. L'expression "il a dormi pieds nus" = il est tellement pauvre qu'un Pilleur ne l'a meme pas vole.`,
    metadata: { height: "1.5m", source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "creature",
    title: "Le Chanteur de Boue",
    content: `Amphibien dinosauroide relique dans les marais de N'Goro. Taille d'une grosse grenouille, crete osseuse resonnante. Des milliers produisent un bourdonnement melodique la nuit — le bruit de fond de N'Goro. Les N'Goro ne l'entendent plus. Les visiteurs n'entendent QUE ca.`,
    metadata: { source: "LE_MONDE_VIT" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: trade
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "trade",
    title: "Route de l'Ambre — Volonia a Ishtir",
    content: `Maritime (prao) puis terrestre (caravane de brachiosaures). 45 jours. L'ambre contient le temps piege — les insectes fossilises sont des instants sauves de l'oubli, c'est religieux pour les Ishtiri. Les caravaniers dorment sous le ventre des brachiosaures — 40m2 d'ombre.`,
    metadata: { duration: "45 jours", source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "trade",
    title: "Route des Epices-Os — N'Goro a Pangeen",
    content: `N'Goro exporte : poudre de champignon, poisons dilues, insectes bioluminescents, peaux de spinosaure. Pangeen exporte : bronze, millet, viande sechee, os de brachiosaure. Le commerce passe par Songa-Est et le Comptoir de Songa — pierre seche d'un cote, racines de l'autre.`,
    metadata: { source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "trade",
    title: "Route du Vent — Arkhan a Volonia",
    content: `Seul echange pacifique entre nomades et maritimes. Les Arkhani fournissent cuir de raptor et plumes. Volonia fournit sel, ambre, et hamecons de bronze — les seuls outils de peche du monde nomade. Personne ne le dit a voix haute : c'est un aveu de dependance.`,
    metadata: { since: "120 ans", source: "LE_MONDE_VIT" },
  },
  {
    universe: "jurassic-wars",
    category: "trade",
    title: "Systeme monetaire des 5 civilisations",
    content: `Pangeen : lingots de bronze (base), dents de T-Rex (luxe). Volonia : ambre pesee au gramme. Ishtir : lames d'obsidienne calibrees. Arkhan : RIEN — le prestige est la monnaie, tu donnes, tu recois du statut. N'Goro : fioles de poison standardisees — une fiole de venin de spinosaure vaut 10 fioles de decoction d'ecorce. Le systeme monetaire de N'Goro est une pharmacopee.`,
    metadata: { source: "LE_MONDE_VIT" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: history
  // ═══════════════════════════════════════════════════════

  {
    universe: "jurassic-wars",
    category: "history",
    title: "L'Ere de l'Os (-3000 a -1500)",
    content: `Le premier outil humain n'est pas une pierre taillee. C'est un os de dinosaure. Le premier village : cotes de brachiosaure. Le premier couteau : dent de raptor emmanchee. Le premier contact non hostile : un enfant qui a nourri un compsognathus blesse. L'os EST la civilisation.`,
    metadata: { period: "-3000 a -1500", source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "Guerre de l'Ambre (-340 a -335)",
    content: `Volonia et Ishtir. 5 ans. Ishtir veut l'ambre pour ses rituels, Volonia controle le commerce. Le Traite de l'Ambre fixe un prix commun et cree le Peseur aveugle. La justice est nee du commerce et le commerce est ne de la guerre.`,
    metadata: { period: "-340 a -335", source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "Guerre des Cranes (-180 a -175)",
    content: `Arkhan vs Pangeen. Les Arkhani empilent les os sur les Ossaires sacres. Pangeen construit des routes a travers. 5 ans de raids. L'Empire a la masse (200 000), Arkhan la vitesse (50 000 cavaliers qui frappent et disparaissent). Le Pacte des Os : neutralite des Ossaires, aucune route a moins de 2 km.`,
    metadata: { period: "-180 a -175", source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "Guerre du Reve (-60 a -55)",
    content: `N'Goro vs Pangeen pour Songa-Est. Les Mambos empoisonnent les sources d'eau — pas assez pour tuer, assez pour que toute l'armee ait la diarrhee pendant un mois. Les Pangeens se retirent par humiliation. Le Comptoir de Songa : monument de compromis gastro-intestinal.`,
    metadata: { period: "-60 a -55", source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "L'Impression — Le lien humain-raptor",
    content: `Quelqu'un a reussi a monter un raptor. Pas a le dompter — a le MONTER. Le raptor n'obeit pas, il coopere. L'Impression a change la guerre, l'agriculture, le commerce. "Moi et mon raptor" est devenu la premiere unite sociale, avant la famille, avant le clan. Le gamin entre dans la Fosse a 9 ans avec un raptor de 6 mois. 3 jours. Ce qui se passe dans la fosse reste dans la fosse.`,
    metadata: { period: "-1500 a -800", source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "Les 6 Traites Actifs",
    content: `Traite de l'Ambre (335 ans) : Volonia/Ishtir, Peseur aveugle. Pacte des Os (175 ans) : Arkhan/Pangeen, neutralite des Ossaires. Accord de Songa (55 ans) : N'Goro/Pangeen, souverainete partagee. Route du Vent (120 ans) : Arkhan/Volonia, cuir contre sel. Silence de Quetz (400 ans) : Quetz territoire sacre inviolable. Accord de Drek (200 ans) : Drek conserve le droit au noir.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },
  {
    universe: "jurassic-wars",
    category: "history",
    title: "Les mots intraduisibles",
    content: `Tumba (pangeen) : le son d'un grenier vide. Sulam (volonien) : le mouvement de la houle sous une maison a 3h du matin. Tzolk (ishtiri) : le sentiment quand un quetzalcoatlus vole a l'aube au sommet de la pyramide. Kraa (arkhani) : le cri du raptor quand il voit son cavalier — confirmation d'existence. Mbe (n'goro) : marcher sur une passerelle vivante qui bourgeonne sous tes pieds. Chaque mot est la preuve qu'une civilisation PENSE differemment.`,
    metadata: { source: "LE_LORE_VIVANT" },
  },
];

// ─────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🦕 Seeding ${entries.length} Jurassic Wars lore entries...\n`);

  // Delete existing JW entries
  const { error: delError } = await supabase
    .from("lore_entries")
    .delete()
    .eq("universe", "jurassic-wars");

  if (delError) {
    console.error("❌ Delete error:", delError.message);
    return;
  }

  // Insert in batches of 10
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10).map((e, idx) => {
      const { metadata, ...clean } = e;
      return { ...clean, tags: metadata ? Object.values(metadata).filter(v => typeof v === "string").slice(0, 3) : [], word_count: clean.content ? clean.content.split(/\s+/).length : 0, order_index: i + idx };
    });
    const { error } = await supabase.from("lore_entries").insert(batch);

    if (error) {
      console.error(`❌ Batch ${i / 10 + 1} error:`, error.message);
      return;
    }
    console.log(`  ✅ Batch ${i / 10 + 1} — ${batch.length} entries`);
  }

  // Summary
  const categories = {};
  for (const e of entries) {
    categories[e.category] = (categories[e.category] || 0) + 1;
  }
  console.log("\n📊 Summary:");
  for (const [cat, count] of Object.entries(categories)) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log(`\n  TOTAL: ${entries.length} entries, universe=jurassic-wars`);
  console.log("\n🦕 Done.\n");
}

seed().catch(console.error);
