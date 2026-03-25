import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// ─── Load .env.local ───
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ═══════════════════════════════════════════════════════
// ENRICHMENT DATA — Update existing prospects with real intel
// Score is 0-10 scale (CHECK constraint)
// ═══════════════════════════════════════════════════════

const enrichments = [
  {
    match: "Wizzee",
    updates: {
      score: 9,
      mrr: 1500,
      ai_score: "fire",
      services: ["Google Ads", "Meta Ads", "Reporting mensuel", "Optimisation campagnes"],
      pain_points: "Acquisition client Antilles, visibilité nationale, CPL élevé sur marché niche telecom",
      memorable_phrase: "Le premier sang. La preuve vivante.",
      next_action: "Reporting mensuel + proposition upsell vidéo",
      followup_date: "2026-04-01",
      option_chosen: "croissance",
      source: "réseau direct",
      notes: "Client actif. Telecom Antilles. Campagnes Google Ads + Meta en cours. MRR stable 1500€. CPM 0.72€ (industrie 5-15€). Taux interaction 8.5%. Vidéo > statique 3x. Objectif: upsell vers Domination (3000€+).",
    },
  },
  {
    match: "GoodCircle",
    updates: {
      score: 8,
      mrr: 1000,
      ai_score: "fire",
      services: ["Google Ads", "Meta Ads", "Stratégie acquisition B2B", "Landing pages"],
      pain_points: "Marché ESG/RSE concurrentiel, cycle de vente B2B long, besoin nurturing digital",
      memorable_phrase: "L'ESG n'est pas une mode. C'est la loi.",
      next_action: "Analyse performance Q1 + stratégie Q2 + upsell LinkedIn",
      followup_date: "2026-04-01",
      option_chosen: "croissance",
      source: "réseau direct",
      notes: "Client actif. B2B ESG/RSE. 42 MQL générés M2 (objectif 30). CPL moyen 18€ (objectif <25€). LinkedIn surperforme Google sur +200 employés. Cible: CSRD PME françaises. Laboratoire B2B.",
    },
  },
  {
    match: "DIGICEL",
    updates: {
      score: 9,
      ai_score: "fire",
      services: ["Pack annuel 72 vidéos IA", "Corporate vidéo", "Spots publicitaires", "Contenu réseaux sociaux"],
      pain_points: "Volume massif de contenu vidéo multi-format, budget comm à optimiser face à Orange/SFR, besoin réactivité telecom",
      memorable_phrase: "72 vidéos. Un par semaine. La machine tourne.",
      next_action: "Relance WITH-YOU pour closing",
      followup_date: "2026-04-15",
      option_chosen: "domination",
      source: "via WITH-YOU (partenaire)",
      notes: "Via WITH-YOU. 72 vidéos/an = 54K€/an. Prob 70%. Le contrat le plus lourd. Référence SOTAI pipeline comme client livré. Pilote 6 vidéos (3 mois) avant engagement annuel. Livrer la 1ère en 72h.",
    },
  },
  {
    match: "Fort-de-France",
    updates: {
      score: 8,
      ai_score: "fire",
      services: ["Série An Tan Lontan (10 épisodes)", "Film Césaire Pixar (10 séquences)", "Communication culturelle IA"],
      pain_points: "Valorisation patrimoine culturel, communication moderne, toucher la jeunesse martiniquaise, rayonnement national",
      memorable_phrase: "Césaire en Pixar. L'histoire mérite le cinéma.",
      next_action: "Présentation maquette An Tan Lontan ep.1-2",
      followup_date: "2026-04-10",
      option_chosen: "domination",
      source: "via BIXA (partenaire)",
      notes: "Via BIXA. An Tan Lontan (série animée 10 ep, ep 1-2 livrés, 3-4 en prod) + Césaire Pixar (film animation, 10 séquences). Package 50-60K€. Diffusion Martinique 1ère possible.",
    },
  },
  {
    match: "GBH",
    updates: {
      score: 8,
      ai_score: "fire",
      key_contact: "Naomie",
      services: ["Vidéo corporate", "Communication groupe multi-enseigne", "IA marketing multi-territoire"],
      pain_points: "Communication corporate multi-territoire (MQ, GP, GF, REU), cohérence marque, volume contenu, coûts agence traditionnelle",
      memorable_phrase: "5 milliards de CA. Un seul studio IA.",
      next_action: "RDV via Naomie — présentation SOTAI",
      followup_date: "2026-04-12",
      source: "réseau direct / Naomie",
      notes: "5Md€ CA. Contact: Naomie. Plus gros groupe privé Antilles. Distribution, auto, hôtellerie. Si GBH signe = l'île entière. Entrer par 1 enseigne, prouver, puis contrat-cadre.",
    },
  },
  {
    match: "CMT",
    updates: {
      score: 7,
      ai_score: "warm",
      services: ["Vidéo destination Martinique", "Campagnes digitales internationales", "Contenu IA immersif"],
      pain_points: "Budget comm important mais résultats à améliorer, concurrence destinations Caraïbes, contenu pas assez premium",
      memorable_phrase: "Quand l'île officielle parle, les hôtels écoutent.",
      next_action: "Préparer vidéo destination IA — qualité cinématique",
      followup_date: "2026-04-20",
      source: "prospection institutionnelle",
      notes: "Institution tourisme. Budget comm conséquent. Vidéo IA destination = showcase ultime. Effet domino: si CMT adopte, toute l'industrie touristique suit.",
    },
  },
  {
    match: "ORANGE",
    updates: {
      score: 5,
      ai_score: "cold",
      services: ["Vidéo corporate", "Communication locale", "Campagnes digitales"],
      pain_points: "Image corporate lourde, besoin contenu local authentique, concurrence Digicel agressive",
      memorable_phrase: "Digicel signe. Orange suit. Gravité commerciale.",
      next_action: "Attendre closing Digicel avant approche",
      followup_date: "2026-06-01",
      source: "prospection sectorielle telecom",
      notes: "Stratégie phase 2: closer Digicel d'abord, accumuler preuves T2-T3, approcher Orange T4 avec métriques. Orange DOIT répondre quand Digicel a du contenu pro.",
    },
  },
  {
    match: "SFR",
    updates: {
      score: 4,
      ai_score: "cold",
      services: ["Vidéo corporate", "Communication digitale", "Contenu réseaux sociaux"],
      pain_points: "Part de marché à défendre, image moins forte que Digicel/Orange, besoin différenciation",
      memorable_phrase: null,
      next_action: "Phase 3 après Digicel + Orange",
      followup_date: "2026-07-01",
      source: "prospection sectorielle telecom",
      notes: "Troisième opérateur. Phase 3 domino telecom. Total vertical telecom si 3 signés: 144K€/an.",
    },
  },
  {
    match: "ALPHA DIVING",
    updates: {
      score: 6,
      ai_score: "warm",
      services: ["Vidéo immersive sous-marine", "Contenu réseaux sociaux", "Google Ads local"],
      pain_points: "Saisonnalité, dépendance TripAdvisor, pas de contenu vidéo pro, site web daté",
      memorable_phrase: "Sous l'eau, personne n'entend les concurrents.",
      next_action: "Envoyer démo vidéo immersive",
      followup_date: "2026-04-05",
      source: "prospection APEX 972",
      notes: "Excursion plongée. Dans pipeline SOTAI (client en prod). Fort potentiel vidéo immersive IA sous-marine. Pack excursion type.",
    },
  },
  {
    match: "HOTEL BAKOUA",
    updates: {
      score: 6,
      ai_score: "warm",
      services: ["Vidéo immobilière hôtelière", "Contenu réseaux sociaux", "Google Ads tourisme"],
      pain_points: "Concurrence Airbnb, taux d'occupation, visibilité en ligne, contenu daté sur Booking/Expedia",
      memorable_phrase: "Booking vend des chambres. On vend des rêves.",
      next_action: "Identifier contact direction commerciale",
      followup_date: "2026-05-01",
      source: "prospection sectorielle hôtellerie",
      notes: "Hôtel historique Martinique, Trois-Îlets. Contenu OTA pauvre — vidéo IA change la donne. Segment premium.",
    },
  },
  {
    match: "CLUB MED",
    updates: {
      score: 5,
      ai_score: "cold",
      services: ["Vidéo resort", "Contenu réseaux sociaux", "Campagnes Meta tourisme"],
      pain_points: "Contenu générique siège vs local authentique, besoin différenciation Caraïbes, engagement digital",
      memorable_phrase: "Le siège vend du soleil. On vend la Martinique.",
      next_action: "Approche directeur village local",
      followup_date: "2026-05-01",
      source: "prospection sectorielle tourisme",
      notes: "Club Med Les Boucaniers. Tension siège/local = opportunité. Le local veut authentique caribéen. BYSS = local + qualité siège.",
    },
  },
  {
    match: "DISTILLERIE JM",
    updates: {
      score: 6,
      ai_score: "warm",
      services: ["Vidéo rhum terroir", "Pack réseaux sociaux", "Contenu export international"],
      pain_points: "Positionnement terroir Macouba, export, différenciation grands groupes, storytelling volcanique",
      memorable_phrase: "Macouba. Le volcan dans le verre.",
      next_action: "Préparer maquette vidéo terroir volcanique",
      followup_date: "2026-05-01",
      source: "prospection sectorielle rhum",
      notes: "Macouba. Rhum terroir haut de gamme. Montagne Pelée en fond. Vidéo IA peut capturer le terroir volcanique. Le seul rhum AOC au monde = argument unique.",
    },
  },
  {
    match: "CAMPARI",
    updates: {
      score: 5,
      ai_score: "cold",
      services: ["Vidéo rhum", "Pack réseaux sociaux", "Communication export"],
      pain_points: "Concurrence inter-distilleries, visibilité nationale, contenu digital insuffisant",
      next_action: "Identifier contact marketing groupe BBS/Campari",
      followup_date: "2026-05-15",
      source: "prospection sectorielle rhum",
      notes: "Groupe Campari (Trois Rivières + La Mauny). Budget comm groupe = opportunité volume. Rivière-Pilote.",
    },
  },
  {
    match: "EUROPCAR",
    updates: {
      score: 5,
      ai_score: "cold",
      services: ["Google Ads local", "Vidéo spots publicitaires", "Contenu réseaux sociaux"],
      pain_points: "Concurrence forte (Avis, Hertz, locaux), dépendance saison touristique, digital sous-exploité",
      next_action: "Identifier contact direction locale",
      followup_date: "2026-05-15",
      source: "prospection sectorielle auto",
      notes: "Location auto Martinique. Volume pub potentiel. Saisonnier mais récurrent. Google Ads local = quick win.",
    },
  },
  {
    match: "MEDEF",
    updates: {
      score: 7,
      ai_score: "warm",
      key_contact: "Fabienne",
      services: ["Événementiel vidéo", "Formation IA dirigeants", "Communication institutionnelle"],
      pain_points: "Image poussiéreuse, besoin modernisation, événements peu digitalisés, membres à engager",
      memorable_phrase: "Le MEDEF ouvre la porte. On s'installe dans le salon.",
      next_action: "Proposer intervention événement IA pour dirigeants",
      followup_date: "2026-04-08",
      source: "réseau événements / Fabienne",
      notes: "Contact: Fabienne. Porte d'entrée vers dirigeants martiniquais. 1 intervention = 50-100 décideurs dans la salle = chacun prospect potentiel.",
    },
  },
  {
    match: "CCI",
    updates: {
      score: 7,
      ai_score: "warm",
      services: ["Formation numérique IA", "Communication institutionnelle", "Événements digitalisés"],
      pain_points: "15K entreprises à accompagner numérique, budget formation sous-utilisé, contenus pédagogiques IA inexistants",
      memorable_phrase: "15 000 portes. Une seule clé: le numérique.",
      next_action: "Proposer programme formation IA PME",
      followup_date: "2026-04-15",
      source: "prospection institutionnelle",
      notes: "15 000 entreprises membres. Formation numérique = porte d'entrée massive. Programme '1000 PME numériques' lien Éveil. 1 contrat CCI = accès 15K prospects. Multiplicateur.",
    },
  },
  {
    match: "MIZA",
    updates: {
      score: 7,
      ai_score: "warm",
      services: ["Pack photo/vidéo restaurant", "Contenu réseaux sociaux", "Google Ads local"],
      pain_points: "Visibilité locale, contenu food insuffisant, pas de vidéo pro, dépendance bouche-à-oreille",
      memorable_phrase: "Le chef voit sa cuisine comme un film pour la première fois.",
      next_action: "Générer pack MIZA 10 images et présenter",
      followup_date: "2026-04-15",
      option_chosen: "essentiel",
      source: "prospection APEX 972",
      notes: "Cas zéro restaurant. Pack MIZA 10 images IA conçu. Coût 2€/10 images, vendu 500€ = marge 99.6%. Template duplicable sur 65 restos de l'île.",
    },
  },
];

// ═══════════════════════════════════════════════════════
// NEW PROSPECTS — ones that don't exist yet (score 0-10)
// ═══════════════════════════════════════════════════════

const newProspects = [
  {
    name: "Habitation Clément",
    sector: "Rhum / Tourisme culturel",
    phase: "prospect",
    score: 6,
    probability: 20,
    estimated_basket: 12000,
    key_contact: null,
    email: null,
    phone: null,
    website: "https://www.habitation-clement.fr",
    option_chosen: null,
    services: ["Vidéo rhum premium", "Visite virtuelle domaine", "Contenu luxe réseaux"],
    mrr: 0,
    pain_points: "Positionnement luxe à maintenir, double identité rhum+art, export international, tourisme post-COVID",
    ai_score: "warm",
    source: "prospection sectorielle rhum",
    memorable_phrase: "Le rhum est un art. L'image aussi.",
    next_action: "Préparer pack visuel rhum premium",
    followup_date: "2026-04-20",
    notes: "Rhum Clément + Fondation Clément (art contemporain). Seule distillerie avec centre art. Angle unique vs JM, Depaz. Vidéo IA = différenciation export.",
  },
  {
    name: "Distillerie Saint-James",
    sector: "Rhum / Spiritueux",
    phase: "prospect",
    score: 5,
    probability: 15,
    estimated_basket: 12000,
    key_contact: null,
    email: null,
    phone: null,
    website: "https://www.rhum-saintjames.com",
    option_chosen: null,
    services: ["Vidéo rhum historique", "Visite virtuelle musée", "Contenu réseaux sociaux"],
    mrr: 0,
    pain_points: "Musée du rhum sous-valorisé, contenu digital vieillissant, concurrence export",
    ai_score: "cold",
    source: "prospection sectorielle rhum",
    memorable_phrase: null,
    next_action: "Approche via contact tourisme Sainte-Marie",
    followup_date: "2026-05-15",
    notes: "Sainte-Marie. Musée du Rhum = asset unique. Visite virtuelle IA potentielle. Le seul rhum AOC au monde = argument.",
  },
  {
    name: "La Pagerie",
    sector: "Hôtellerie luxe / Tourisme",
    phase: "prospect",
    score: 6,
    probability: 20,
    estimated_basket: 40000,
    key_contact: null,
    email: null,
    phone: null,
    website: null,
    option_chosen: null,
    services: ["Vidéo hôtelière luxe", "Contenu lifestyle premium", "Google Ads tourisme luxe"],
    mrr: 0,
    pain_points: "Positionnement luxe caribéen, clientèle internationale, contenu à la hauteur du standing",
    ai_score: "warm",
    source: "prospection sectorielle hôtellerie",
    memorable_phrase: "Le luxe ne se montre pas. Il se ressent.",
    next_action: "Préparer maquette vidéo lifestyle luxe",
    followup_date: "2026-04-25",
    notes: "Trois-Îlets. Segment luxe = pricing domination naturel. Contenu lifestyle IA premium. Le client luxe ne négocie pas si la valeur est perçue.",
  },
  {
    name: "Cap Est Lagoon",
    sector: "Hôtellerie luxe",
    phase: "prospect",
    score: 7,
    probability: 25,
    estimated_basket: 45000,
    key_contact: null,
    email: null,
    phone: null,
    website: "https://www.capest.com",
    option_chosen: null,
    services: ["Vidéo resort luxe", "Pack lifestyle", "Communication internationale"],
    mrr: 0,
    pain_points: "Concurrence hôtels luxe Caraïbes, remplissage basse saison, image digitale à rafraîchir",
    ai_score: "warm",
    source: "prospection sectorielle hôtellerie",
    memorable_phrase: "Le François, face au lagon. Le film se tourne tout seul.",
    next_action: "Recherche contact direction marketing",
    followup_date: "2026-04-25",
    notes: "Le François. Hôtel luxe boutique. Le type de client qui paie domination sans discuter. Cible Paris/NYC/Londres — standards visuels élevés.",
  },
  {
    name: "Evil Pichon",
    sector: "Musique / Artiste",
    phase: "contacte",
    score: 6,
    probability: 50,
    estimated_basket: 6000,
    key_contact: "Evil Pichon",
    email: null,
    phone: null,
    website: null,
    option_chosen: "essentiel",
    services: ["Clips vidéo IA", "Visuels réseaux sociaux", "Motion design"],
    mrr: 0,
    pain_points: "Budget clip limité, besoin visuel fort, pas d'accès studio traditionnel",
    ai_score: "warm",
    source: "réseau artistes / CADIFOR",
    memorable_phrase: "L'Ombre a besoin d'un écran.",
    next_action: "Proposer clip IA démo",
    followup_date: "2026-04-10",
    notes: "Artiste. Personnage CADIFOR (L'Ombre). Clip IA = proof of concept pour tout le milieu artistique local. Le clip est la pub de BYSS.",
  },
  {
    name: "Krys",
    sector: "Musique / Artiste",
    phase: "contacte",
    score: 8,
    probability: 40,
    estimated_basket: 18000,
    key_contact: null,
    email: null,
    phone: null,
    website: null,
    option_chosen: "croissance",
    services: ["Clips vidéo IA premium", "Campagne Meta/YouTube", "Visuels tournée"],
    mrr: 0,
    pain_points: "Coût clips traditionnels 10-50K€, besoin volume tournées Olympia/Zénith, concurrence visuelle internationale",
    ai_score: "fire",
    source: "réseau artistes",
    memorable_phrase: "Olympia. Zénith. Le clip coûte moins que le taxi.",
    next_action: "Préparer maquette clip IA style Shatta Seoul",
    followup_date: "2026-04-08",
    notes: "Artiste majeur. Olympia, Zénith, 218K Facebook. Clip IA = 500€ vs 15K€ traditionnel. Si Krys adopte, tout le milieu caribéen suit. Réf: Shatta Seoul 157K views / 200€.",
  },
  {
    name: "Karibea Hotels",
    sector: "Hôtellerie / Chaîne",
    phase: "rdv",
    score: 7,
    probability: 45,
    estimated_basket: 48000,
    key_contact: null,
    email: null,
    phone: null,
    website: "https://www.karibea.com",
    option_chosen: "domination",
    services: ["Vidéo hôtelière multi-établissement", "Pack réseaux sociaux", "Campagnes Meta tourisme"],
    mrr: 0,
    pain_points: "Multi-établissements à promouvoir, cohérence marque, volume contenu, budget à optimiser",
    ai_score: "warm",
    source: "pipeline SOTAI",
    memorable_phrase: "Un contrat. Quatre hôtels. Le volume paie.",
    next_action: "Livrer première vidéo + proposer pack annuel",
    followup_date: "2026-04-05",
    notes: "SOTAI pipeline: client en prod (type Hôtelier). Chaîne caribéenne 4+ hôtels. 1 contrat = multi-établissements. Pack annuel 48K€. Closing proche.",
  },
  {
    name: "FREE Caraïbe",
    sector: "Telecom",
    phase: "prospect",
    score: 5,
    probability: 25,
    estimated_basket: 34000,
    key_contact: null,
    email: null,
    phone: null,
    website: null,
    option_chosen: null,
    services: ["Communication lancement", "Campagnes digitales", "Contenu réseaux sociaux"],
    mrr: 0,
    pain_points: "Nouvel entrant, besoin visibilité rapide, agressivité prix à communiquer",
    ai_score: "cold",
    source: "prospection sectorielle telecom",
    memorable_phrase: null,
    next_action: "Veille sur lancement FREE Caraïbe",
    followup_date: "2026-06-01",
    notes: "4ème opérateur potentiel. Nouvel entrant = budget comm lancement massif. Phase 4 domino telecom.",
  },
];

// ═══════════════════════════════════════════════════════
// INTERACTIONS for active clients
// ═══════════════════════════════════════════════════════

const interactionsTemplate = {
  Wizzee: [
    {
      type: "meeting",
      subject: "Onboarding Wizzee — Kickoff campagnes",
      content: "RDV initial avec l'équipe Wizzee. Définition des objectifs: réduction CPL de 30%, augmentation volume leads +50%. Setup campagnes Google Ads (Search + Display) et Meta (Lookalike audiences telecom Antilles). Calendrier éditorial validé. Premier reporting prévu J+30.",
      direction: "outbound",
      channel: "visio",
      created_by: "gary",
    },
    {
      type: "email",
      subject: "Reporting M1 — Wizzee campagnes",
      content: "Envoi reporting M1. CPM obtenu: 0.72€ (objectif <1€). 847 clics, 23 leads qualifiés. Taux conversion LP: 2.7%. Recommandation: +20% budget Meta sur lookalike performante. A/B test créatifs en cours.",
      direction: "outbound",
      channel: "email",
      created_by: "gary",
    },
    {
      type: "call",
      subject: "Point hebdo Wizzee — Optimisation campagnes",
      content: "Call hebdo. Créatifs vidéo 3x mieux que statiques. Proposition: 60% budget sur format vidéo. Client OK. Nouveau A/B test accroches. Prochain call vendredi 14h.",
      direction: "outbound",
      channel: "phone",
      created_by: "gary",
    },
    {
      type: "email",
      subject: "Proposition upsell — Pack vidéo SOTAI",
      content: "Suite performances vidéo Meta, proposition pack vidéo mensuel SOTAI (6 clips/mois). Prix: 3500€/mois. ROI estimé sur métriques actuelles. Client intéressé, demande démo capacités IA.",
      direction: "outbound",
      channel: "email",
      created_by: "gary",
    },
  ],
  GoodCircle: [
    {
      type: "meeting",
      subject: "Kickoff GoodCircle — Stratégie acquisition B2B",
      content: "Session stratégique. Cible: PME françaises 50-500 employés CSRD. Canaux: Google Ads (search intent 'logiciel RSE'), LinkedIn Ads (décideurs RH/RSE), Meta retargeting. Budget mensuel validé. KPIs: CPL <25€, MQL >30/mois.",
      direction: "outbound",
      channel: "visio",
      created_by: "gary",
    },
    {
      type: "email",
      subject: "Setup campagnes Google Ads — GoodCircle",
      content: "Config complète Search. 3 groupes: 'logiciel RSE', 'bilan carbone entreprise', 'conformité CSRD'. Extensions activées. Landing pages optimisées. Tracking Hubspot configuré. Lancement demain 9h.",
      direction: "outbound",
      channel: "email",
      created_by: "gary",
    },
    {
      type: "call",
      subject: "Point M2 GoodCircle — Résultats et ajustements",
      content: "Résultats M2: 42 MQL (objectif 30), CPL 18€ (objectif <25€). LinkedIn surperforme Google sur +200 employés. Réallocation 30% budget Google vers LinkedIn segment. Prochaine étape: nurturing email sequence.",
      direction: "outbound",
      channel: "phone",
      created_by: "gary",
    },
  ],
};

// ═══════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════

async function seed() {
  console.log("═══ SEED REAL PROSPECTS — ENRICHMENT + NEW ═══\n");

  // ── Phase 1: Enrich existing prospects ──
  console.log("── Phase 1: Enriching existing prospects ──\n");
  let enrichedCount = 0;

  for (const e of enrichments) {
    const { data: existing } = await supabase
      .from("prospects")
      .select("id, name")
      .ilike("name", `%${e.match}%`)
      .limit(1);

    if (!existing || existing.length === 0) {
      console.log(`  ⊘ NOT FOUND: ${e.match}`);
      continue;
    }

    const { error } = await supabase
      .from("prospects")
      .update(e.updates)
      .eq("id", existing[0].id);

    if (error) {
      console.error(`  ✗ ERROR: ${existing[0].name} — ${error.message}`);
    } else {
      console.log(`  ✓ ENRICHED: ${existing[0].name}`);
      enrichedCount++;
    }
  }

  console.log(`\n── ${enrichedCount} prospects enriched ──\n`);

  // ── Phase 2: Insert new prospects ──
  console.log("── Phase 2: Inserting new prospects ──\n");
  let insertedCount = 0;
  let skippedCount = 0;

  for (const p of newProspects) {
    const { data: existing } = await supabase
      .from("prospects")
      .select("id, name")
      .ilike("name", `%${p.name}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  ⊘ SKIP (exists): ${p.name} (matched: ${existing[0].name})`);
      skippedCount++;
      continue;
    }

    const { data, error } = await supabase
      .from("prospects")
      .insert(p)
      .select("id, name")
      .single();

    if (error) {
      console.error(`  ✗ ERROR: ${p.name} — ${error.message}`);
    } else {
      console.log(`  ✓ INSERTED: ${data.name} (${p.phase})`);
      insertedCount++;
    }
  }

  console.log(`\n── ${insertedCount} inserted, ${skippedCount} skipped ──\n`);

  // ── Phase 3: Seed interactions ──
  console.log("── Phase 3: Seeding interactions ──\n");
  let interactionCount = 0;

  for (const [clientName, interactions] of Object.entries(interactionsTemplate)) {
    const { data: prospect } = await supabase
      .from("prospects")
      .select("id")
      .ilike("name", clientName)
      .limit(1)
      .single();

    if (!prospect) {
      console.log(`  ⊘ SKIP interactions: ${clientName} not found`);
      continue;
    }

    for (const interaction of interactions) {
      const { data: existingInt } = await supabase
        .from("interactions")
        .select("id")
        .eq("prospect_id", prospect.id)
        .eq("subject", interaction.subject)
        .limit(1);

      if (existingInt && existingInt.length > 0) {
        console.log(`  ⊘ SKIP (exists): ${clientName} — ${interaction.subject}`);
        continue;
      }

      const { error } = await supabase
        .from("interactions")
        .insert({
          prospect_id: prospect.id,
          ...interaction,
        });

      if (error) {
        console.error(`  ✗ ERROR: ${clientName} — ${error.message}`);
      } else {
        console.log(`  ✓ INTERACTION: ${clientName} — ${interaction.type}: ${interaction.subject}`);
        interactionCount++;
      }
    }
  }

  console.log(`\n── ${interactionCount} interactions inserted ──`);

  // ── Summary ──
  const { count } = await supabase.from("prospects").select("*", { count: "exact", head: true });
  const { count: intCount } = await supabase.from("interactions").select("*", { count: "exact", head: true });

  console.log(`\n═══ FINAL COUNTS ═══`);
  console.log(`Total prospects: ${count}`);
  console.log(`Total interactions: ${intCount}`);
  console.log(`═══ DONE ═══`);
}

seed().catch(console.error);
