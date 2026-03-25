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
// PROSPECT INTELLIGENCE — Bible de Vente entries
// universe='bible', category='prospect_intel'
// ═══════════════════════════════════════════════════════

const entries = [

  // ── 1. DIGICEL ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Digicel — 72 vidéos, un empire de contenu",
    content: `PROSPECT: Digicel
SECTEUR: Telecom Caraïbes
CANAL: Via WITH-YOU (partenaire)
DEAL: 72 vidéos/an — 54K€/an — 4 500€/mois

PAIN POINTS:
- Volume massif de contenu vidéo multi-format (spots TV, réseaux sociaux, corporate)
- Budget comm à optimiser face à Orange et SFR
- Besoin de réactivité — le telecom bouge vite
- Contenu local authentique vs productions siège générique

CONTEXTE CONCURRENTIEL:
- Orange Martinique: budget supérieur, production lente
- SFR Caraïbe: agressif sur les prix, contenu faible
- Wizzee: client actif BYSS, même secteur = preuve de compétence

APPROCHE RECOMMANDÉE:
1. Laisser WITH-YOU piloter la relation — ne pas court-circuiter
2. Montrer les métriques Wizzee (CPM 0.59€, interaction 11.30%)
3. Proposer un pilote de 6 vidéos (3 mois) avant engagement annuel
4. Livrer la première en 72h pour créer l'effet "choc de vitesse"

PRICING:
- Pack annuel 72 vidéos: 54K€ HT (750€/vidéo moyenne)
- Alternative mensuel: 4 500€/mois (6 vidéos)
- Coût production interne: ~50€/vidéo (MiniMax + Kling) = marge 93%

OBJECTIONS PROBABLES:
- "On a déjà une agence" → "Combien de vidéos livrent-ils par mois? En combien de temps?"
- "L'IA c'est pas assez quali" → Montrer reel Shatta Seoul (157K views / 200€)
- "Le prix est élevé" → Comparer: 1 vidéo agence traditionnelle = 5-15K€. Ici 750€.

CASE STUDY: Shatta Seoul — 157K views, 200€ budget, CPM 0.59€.`,
    metadata: { prospect: "Digicel", priority: "critical", estimated_value: 54000 },
    tags: ["digicel", "telecom", "with-you", "video", "contrat-annuel"],
  },

  // ── 2. FORT-DE-FRANCE ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Fort-de-France — Césaire et l'histoire en animation",
    content: `PROSPECT: Ville de Fort-de-France
SECTEUR: Institution / Collectivité territoriale
CANAL: Via BIXA (partenaire)
DEAL: Série An Tan Lontan + Film Césaire Pixar

PAIN POINTS:
- Patrimoine culturel martiniquais sous-valorisé auprès de la jeunesse
- Communication institutionnelle souvent terne et bureaucratique
- Besoin de rayonnement national/international pour la ville
- Budget culture existant mais mal exploité en digital

CONTEXTE:
- An Tan Lontan: série animée 10 épisodes sur l'histoire de la Martinique
- Césaire Pixar: film d'animation style Pixar sur la vie d'Aimé Césaire, 10 séquences
- Les deux projets sont déjà en développement (épisodes 1-2 livrés, 3-4 en prod)
- Fort-de-France = capitale, vitrine culturelle de l'île

APPROCHE RECOMMANDÉE:
1. Laisser BIXA gérer la relation institutionnelle
2. Présenter les épisodes livrés comme preuve de concept
3. Proposer diffusion nationale (Martinique 1ère, France Télévisions)
4. Positionner comme outil pédagogique pour les écoles

PRICING:
- Série An Tan Lontan (10 épisodes): 25K€ (2 500€/épisode)
- Césaire Pixar (10 séquences): 35K€ (3 500€/séquence)
- Total package: 60K€ — négociable à 50K€ si les deux ensemble

OBJECTIONS:
- "C'est de l'IA, pas du vrai cinéma" → Kling 3.0 = qualité cinématique. Montrer les épisodes.
- "Budget insuffisant" → Comparer: 1 minute d'animation Pixar = 1M$. Ici: 500€/minute.
- "Diffusion?" → Partenariat Martinique 1ère déjà dans le pipeline.`,
    metadata: { prospect: "Fort-de-France", priority: "critical", estimated_value: 50000 },
    tags: ["fort-de-france", "institution", "bixa", "animation", "culture", "cesaire"],
  },

  // ── 3. GBH ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel GBH — Le baleine blanche du pipeline",
    content: `PROSPECT: GBH (Groupe Bernard Hayot)
SECTEUR: Distribution, auto, hôtellerie
CONTACT: Naomie
CA: 5 milliards d'euros

PAIN POINTS:
- Communication corporate multi-territoire (MQ, GP, GF, REU)
- Cohérence de marque entre dizaines d'enseignes
- Volume de contenu énorme (Carrefour, Mr.Bricolage, Renault, etc.)
- Coûts agence traditionnelle disproportionnés

CONTEXTE CONCURRENTIEL:
- Agences locales: artisanales, pas de capacité volume
- Agences parisiennes: chères, méconnaissance terrain
- BYSS GROUP: production IA + connaissance locale = unicité

APPROCHE RECOMMANDÉE:
1. Entrer par Naomie — relation personnelle, pas de cold approach
2. Cibler UNE enseigne d'abord (ex: concession auto ou hôtel)
3. Livrer un pilote gratuit ou low-cost pour prouver la vitesse
4. Puis proposer contrat-cadre multi-enseigne

PRICING:
- Pilote (1 enseigne, 1 mois): 3 000€
- Pack multi-enseigne mensuel: 8-15K€/mois selon volume
- Contrat annuel groupe: 100-180K€ (objectif stratosphérique)

OBJECTIONS:
- "On a des process groupe" → S'adapter aux process, pas les combattre
- "Faut passer par le siège" → Naomie est la porte. Livrer local, valider groupe ensuite.
- "C'est trop petit pour nous" → "On a livré 72 vidéos/an à Digicel. Le volume, on connaît."`,
    metadata: { prospect: "GBH", priority: "high", estimated_value: 100000 },
    tags: ["gbh", "distribution", "naomie", "multi-enseigne", "whale"],
  },

  // ── 4. KRYS ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Krys — L'artiste qui ouvre le marché musical",
    content: `PROSPECT: Krys
SECTEUR: Musique / Artiste caribéen
AUDIENCE: 218K Facebook, Olympia, Zénith

PAIN POINTS:
- Coût clips vidéo traditionnels (10-50K€ par clip)
- Besoin volume contenu pour tournées et réseaux
- Pas de budget pour un réalisateur permanent
- Compétition visuelle avec artistes internationaux (budgets 10x)

CONTEXTE:
- Artiste majeur caribéen. Olympia, Zénith = salles de référence.
- 218K followers Facebook = base d'audience réelle
- Le marché artistique caribéen n'a pas encore adopté la vidéo IA
- Premier artiste qui adopte = effet de réseau sur tout le milieu

APPROCHE RECOMMANDÉE:
1. Créer un clip IA démo gratuit (style Shatta Seoul: 157K views / 200€)
2. Montrer le ROI vs clip traditionnel: 500€ vs 15 000€
3. Proposer pack mensuel: 4 clips IA + visuels réseaux
4. Utiliser Krys comme case study pour tout le secteur musical

PRICING:
- Clip IA premium (1-3min): 1 500€ (vs 10-50K€ traditionnel)
- Pack mensuel (4 clips + visuels): 3 500€/mois
- Pilote gratuit: 1 clip démo pour convaincre

OBJECTIONS:
- "C'est pas authentique" → "157K personnes ont regardé Shatta Seoul. Elles n'ont pas fait la différence."
- "Mon public veut du vrai" → "Le public veut de l'émotion. L'IA livre l'émotion 10x plus vite."`,
    metadata: { prospect: "Krys", priority: "high", estimated_value: 18000 },
    tags: ["krys", "artiste", "musique", "clips", "shatta-seoul"],
  },

  // ── 5. CCI MARTINIQUE ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel CCI — 15 000 PME, la porte vers le marché",
    content: `PROSPECT: CCI Martinique
SECTEUR: Institution / Formation / Économie
CIBLE: 15 000 entreprises membres

PAIN POINTS:
- 15K entreprises à accompagner sur la transition numérique
- Budget formation sous-utilisé
- Contenu pédagogique IA inexistant localement
- Besoin de montrer des résultats concrets aux élus

CONTEXTE:
- Programme "1000 PME numériques" en lien avec la vision Éveil
- Chaque PME formée = prospect futur pour BYSS GROUP
- La CCI est un prescripteur: si elle recommande, les PME suivent
- Formation IA = sujet brûlant, financement possible via OPCO

APPROCHE RECOMMANDÉE:
1. Proposer un programme de formation IA pour dirigeants PME
2. Format: ateliers de 2h, 20 participants, mensuel
3. Contenu: utilisation IA pour marketing, production vidéo, automatisation
4. La CCI finance via budget formation, BYSS délivre

PRICING:
- Atelier IA dirigeants (2h, 20 pers.): 1 500€/session
- Programme trimestriel (6 ateliers): 8 000€
- Programme annuel + suivi: 25 000€
- Chaque participant = lead qualifié pour les services BYSS

MULTIPLICATEUR: 1 contrat CCI = accès à 15 000 prospects.`,
    metadata: { prospect: "CCI Martinique", priority: "high", estimated_value: 25000 },
    tags: ["cci", "institution", "formation", "pme", "multiplicateur"],
  },

  // ── 6. MEDEF MARTINIQUE ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel MEDEF — L'entrée par le patronat",
    content: `PROSPECT: MEDEF Martinique
CONTACT: Fabienne
SECTEUR: Institution / Patronat

PAIN POINTS:
- Image institutionnelle poussiéreuse
- Événements peu digitalisés, faible engagement
- Membres (dirigeants) à informer sur le numérique
- Besoin de contenu événementiel récurrent

APPROCHE RECOMMANDÉE:
1. Proposer intervention "IA pour dirigeants" lors d'un événement
2. Format: keynote 20min + démo live production vidéo IA
3. Créer l'effet "wow" devant 50-100 décideurs
4. Distribuer des cartes → chaque participant = lead chaud

PRICING:
- Intervention événement: 2 000€
- Pack événementiel (vidéo recap + photos + diffusion): 5 000€
- Partenariat annuel (4 événements): 15 000€

VALEUR CACHÉE: 1 intervention MEDEF = 50-100 dirigeants dans la salle. Chacun est un prospect potentiel 1 500-5 000€/mois. ROI du MEDEF: pas le contrat lui-même, mais l'accès au réseau.`,
    metadata: { prospect: "MEDEF Martinique", priority: "medium", estimated_value: 15000 },
    tags: ["medef", "institution", "fabienne", "evenements", "reseau"],
  },

  // ── 7. CMT ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel CMT — L'institution qui fait tomber les dominos",
    content: `PROSPECT: CMT (Comité Martiniquais du Tourisme)
SECTEUR: Institution / Tourisme

PAIN POINTS:
- Budget communication important mais résultats perfectibles
- Concurrence destinations Caraïbes (Guadeloupe, Cuba, Rép. Dominicaine)
- Contenu pas assez premium pour le marché international
- Besoin de vidéo destination au niveau des Maldives/Bali

APPROCHE RECOMMANDÉE:
1. Créer une vidéo destination "Martinique" en IA — qualité cinématique
2. Montrer le coût: 2 000€ vs 50-100K€ pour un film tourisme classique
3. Proposer campagne internationale (Meta + YouTube) avec vidéo IA
4. Si CMT adopte → chaque hôtel, restaurant, excursion suit

PRICING:
- Film destination IA (3-5min): 5 000€
- Campagne digitale internationale (3 mois): 15 000€
- Pack annuel destination: 40 000€

EFFET DOMINO: CMT est le prescripteur officiel du tourisme martiniquais. Si le CMT utilise de la vidéo IA BYSS, chaque acteur touristique le verra et voudra la même chose.`,
    metadata: { prospect: "CMT", priority: "high", estimated_value: 40000 },
    tags: ["cmt", "tourisme", "institution", "destination", "domino"],
  },

  // ── 8. HABITATION CLÉMENT ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Habitation Clément — Rhum premium + art contemporain",
    content: `PROSPECT: Habitation Clément
SECTEUR: Rhum premium / Tourisme culturel

PAIN POINTS:
- Positionnement luxe à maintenir face aux distilleries mass-market
- Double identité: rhum + Fondation Clément (art contemporain)
- Export international = besoin contenu multilingue
- Tourisme premium post-COVID à relancer

APPROCHE RECOMMANDÉE:
1. Pack visuel rhum premium (style Monocle magazine, pas duty-free)
2. Visite virtuelle du domaine et de la Fondation
3. Contenu bilingue FR/EN pour export
4. Storytelling terroir: la canne, le fût, le temps

PRICING:
- Pack visuel premium (10 images + 3 vidéos): 3 500€
- Visite virtuelle interactive: 5 000€
- Pack export (contenu multilingue): 4 000€

ANGLE UNIQUE: Clément est le SEUL à avoir un centre d'art contemporain dans une distillerie. C'est l'angle qui fait la différence vs JM, Depaz, etc.`,
    metadata: { prospect: "Habitation Clément", priority: "medium", estimated_value: 12000 },
    tags: ["clement", "rhum", "luxe", "art", "tourisme", "export"],
  },

  // ── 9. KARIBEA ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Karibea — La chaîne qui multiplie les contrats",
    content: `PROSPECT: Karibea Hotels
SECTEUR: Hôtellerie / Chaîne caribéenne

PAIN POINTS:
- Multi-établissements (4+ hôtels) = besoin de cohérence visuelle
- Chaque hôtel a sa personnalité mais doit rester "Karibea"
- Volume contenu mensuel énorme pour les réseaux
- Agences locales = un prestataire par hôtel, pas de cohérence

APPROCHE RECOMMANDÉE:
1. Livrer la première vidéo (en prod dans SOTAI) avec qualité cinématique
2. Proposer pack mensuel multi-établissement
3. Un seul contrat, tous les hôtels couverts
4. Template visuel Karibea réutilisable par propriété

PRICING:
- Pack mensuel (6 vidéos, tous établissements): 4 500€/mois
- Pack annuel: 48 000€ (remise volume)
- Pilote (1 hôtel, 1 mois): 1 500€

LEVIER: Karibea est déjà dans le pipeline SOTAI (type Hôtelier, statut En prod). La relation existe. Le closing est proche.`,
    metadata: { prospect: "Karibea", priority: "high", estimated_value: 48000 },
    tags: ["karibea", "hotellerie", "chaine", "multi-etablissement", "volume"],
  },

  // ── 10. CAP EST LAGOON ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Cap Est — Le luxe qui ne négocie pas",
    content: `PROSPECT: Cap Est Lagoon Resort & Spa
SECTEUR: Hôtellerie luxe
LOCALISATION: Le François, Martinique

PAIN POINTS:
- Concurrence hôtels luxe Caraïbes (St-Barth, Anguilla)
- Remplissage basse saison problématique
- Image digitale à rafraîchir (site web, OTA)
- Clientèle cible: Paris, New York, Londres — exigeante visuellement

APPROCHE RECOMMANDÉE:
1. Vidéo lifestyle luxe (style Condé Nast Traveler)
2. Contenu pour OTA premium (Booking luxe, Relais & Châteaux)
3. Campagne Meta ciblée clientèle haute (CSP+, voyageurs fréquents)
4. Ne pas négocier le prix — le luxe paie le prix du luxe

PRICING:
- Pack lifestyle luxe (5 vidéos + 20 visuels): 5 000€
- Campagne acquisition internationale: 8 000€/mois
- Pack annuel premium: 60 000€

LE CLIENT LUXE ne négocie pas les prix s'il perçoit la valeur. La maquette doit être parfaite dès le premier contact.`,
    metadata: { prospect: "Cap Est", priority: "medium", estimated_value: 60000 },
    tags: ["cap-est", "luxe", "francois", "resort", "premium"],
  },

  // ── 11. DISTILLERIES (JM, LA MAUNY, SAINT-JAMES) ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Verticale Rhum — 3 distilleries, 1 stratégie",
    content: `PROSPECTS: Distillerie JM (Macouba) / La Mauny (Rivière-Pilote) / Saint-James (Sainte-Marie)
SECTEUR: Rhum AOC Martinique

PAIN POINTS COMMUNS:
- Différenciation sur un marché saturé (16 distilleries en Martinique)
- Export international = besoin contenu premium multilingue
- Storytelling terroir insuffisant en digital
- Concurrence des rhums non-AOC (moins chers, marketing agressif)

SPÉCIFICITÉS:
- JM: terroir volcanique Macouba, positionnement haut de gamme, Pelée en fond
- La Mauny: groupe BBS (avec Trois Rivières), volume, Rivière-Pilote
- Saint-James: musée du Rhum = asset unique, Sainte-Marie, historique

APPROCHE RECOMMANDÉE:
1. Créer un pack "Rhum Martinique" standardisé mais personnalisable
2. 10 images + 3 vidéos par distillerie
3. Style: éditorial luxe (Monocle, pas duty-free)
4. Proposer aux 3 en même temps — si l'une signe, les autres suivent

PRICING PAR DISTILLERIE:
- Pack visuel terroir (10 images + 3 vidéos): 3 500€
- Pack export multilingue (+EN, +ES): +1 500€
- Pack réseaux sociaux mensuel: 1 500€/mois

ANGLE: Le rhum AOC Martinique est le SEUL rhum AOC au monde. C'est l'argument — pas le prix, pas le goût — l'unicité légale.`,
    metadata: { prospect: "Verticale Rhum", priority: "medium", estimated_value: 15000 },
    tags: ["rhum", "jm", "la-mauny", "saint-james", "aoc", "terroir", "export"],
  },

  // ── 12. ORANGE + SFR ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Telecom — L'effet domino après Digicel",
    content: `PROSPECTS: Orange Martinique / SFR Caraïbe
SECTEUR: Telecom
STRATÉGIE: Phase 2 (après closing Digicel)

LE PLAN:
1. Closer Digicel d'abord (72 vidéos/an, 54K€)
2. Une fois Digicel livré (3-6 mois de preuves), approcher Orange
3. Orange voudra riposter face à Digicel qui a du contenu pro
4. SFR suit en phase 3

POURQUOI ÇA MARCHE:
- Les 3 opérateurs se surveillent mutuellement
- Quand Digicel a du contenu IA, Orange DOIT répondre
- Le coût de ne pas répondre > le coût du contrat BYSS
- Même logique que Samsung vs Apple sur le contenu marketing

PRICING:
- Orange: pack similaire Digicel 54K€/an (ils voudront au moins autant)
- SFR: pack croissance 36K€/an (budget inférieur mais veut être dans la course)
- Total vertical telecom si 3 signés: 144K€/an

TIMELINE:
- T1 2026: Closer Digicel
- T2-T3 2026: Livrer, accumuler les preuves
- T4 2026: Approcher Orange avec les métriques Digicel
- T1 2027: SFR`,
    metadata: { prospect: "Verticale Telecom", priority: "medium", estimated_value: 144000 },
    tags: ["orange", "sfr", "telecom", "domino", "phase-2"],
  },

  // ── 13. EVIL PICHON ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Evil Pichon — L'Ombre entre dans la lumière",
    content: `PROSPECT: Evil Pichon
SECTEUR: Musique / Artiste local
CONNEXION: Personnage CADIFOR (L'Ombre)

PAIN POINTS:
- Budget clip quasi nul
- Besoin d'un visuel qui match l'énergie musicale
- Pas d'accès aux studios de production traditionnels
- Scène locale compétitive, besoin de se démarquer

APPROCHE:
1. Clip IA démo gratuit ou 200€ — investissement marketing
2. Qualité Shatta Seoul (157K views)
3. Utiliser le personnage CADIFOR comme concept créatif
4. Si ça marche → case study pour tout le milieu artistique local

PRICING:
- Clip IA social (30s-1min): 500€
- Clip IA premium (2-3min): 1 500€
- Pack artiste mensuel (2 clips + visuels): 2 000€

VALEUR RÉELLE: Evil Pichon n'est pas un gros contrat. C'est un PROOF OF CONCEPT. Chaque artiste local qui voit le clip = prospect futur. Le clip est la pub de BYSS, pas juste la livraison client.`,
    metadata: { prospect: "Evil Pichon", priority: "low", estimated_value: 6000 },
    tags: ["evil-pichon", "artiste", "cadifor", "proof-of-concept", "musique"],
  },

  // ── 14. WIZZEE (client actif — expansion strategy) ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Wizzee — De croissance à domination",
    content: `CLIENT ACTIF: Wizzee
MRR ACTUEL: 1 500€ (tier Croissance)
SECTEUR: Fintech / Telecom Antilles

STRATÉGIE D'EXPANSION:
1. Phase actuelle: Google Ads + Meta (1 500€/mois)
2. Upsell vidéo: pack 6 clips/mois (+2 000€/mois)
3. Upsell landing pages: refonte conversion (+1 000€ one-shot)
4. Cible: passer de Croissance (1 500€) à Domination (3 000€+)

MÉTRIQUES ACTUELLES:
- CPM: 0.72€ (industrie 5-15€)
- Taux interaction: 8.5% (industrie 2-5%)
- CPL: en cours d'optimisation
- Vidéo > statique: 3x engagement

PROCHAINES ÉTAPES:
1. Reporting Q1 avec métriques solides
2. Proposition upsell vidéo basée sur les données
3. Démontrer ROI incrémental de la vidéo
4. Passage tier Domination avant fin Q2

WIZZEE EST LA PREUVE. Chaque prospect qui demande "vous avez des résultats?" — Wizzee est la réponse.`,
    metadata: { prospect: "Wizzee", priority: "high", estimated_value: 36000 },
    tags: ["wizzee", "client-actif", "upsell", "domination", "preuve"],
  },

  // ── 15. GOODCIRCLE (client actif — expansion strategy) ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel GoodCircle — Le B2B ESG comme laboratoire",
    content: `CLIENT ACTIF: GoodCircle
MRR ACTUEL: 1 500€ (tier Croissance)
SECTEUR: ESG / RSE / B2B SaaS

STRATÉGIE D'EXPANSION:
1. Phase actuelle: Google Ads + Meta B2B (1 500€/mois)
2. Upsell LinkedIn Ads: segment +200 employés surperforme
3. Upsell nurturing: séquences email automatisées
4. Cible: Domination (3 000€) + projet Orion intégration

MÉTRIQUES:
- MQL générés M2: 42 (objectif 30 = +40%)
- CPL moyen: 18€ (objectif <25€)
- LinkedIn > Google sur segment +200 employés
- Taux conversion MQL→SQL: en mesure

VALEUR STRATÉGIQUE:
- GoodCircle = premier client B2B SaaS
- Prouve que BYSS peut faire du B2B, pas seulement du local
- Les méthodes B2B (nurturing, scoring, ABM) sont transférables
- Chaque apprentissage GoodCircle enrichit l'offre pour tous les clients

GOODCIRCLE EST LE LABORATOIRE B2B. Ce qu'on apprend ici finance la méthode pour tout le reste.`,
    metadata: { prospect: "GoodCircle", priority: "high", estimated_value: 36000 },
    tags: ["goodcircle", "client-actif", "b2b", "esg", "laboratoire"],
  },

  // ── 16. CLUB MED + HÔTELS LUXE ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel Verticale Hôtellerie Luxe — La Pagerie, Cap Est, Club Med",
    content: `PROSPECTS: La Pagerie (Trois-Îlets) / Cap Est Lagoon (Le François) / Club Med Les Boucaniers
SECTEUR: Hôtellerie premium à luxe

PAIN POINTS COMMUNS:
- Contenu visuel pas au niveau du standing
- OTA (Booking, Expedia) montrent des photos amateur
- Concurrence Caraïbes féroce (St-Barth, Anguilla, Turks)
- Clientèle haute: Paris, NYC, Londres — standards visuels élevés

STRATÉGIE DE PÉNÉTRATION:
1. Cibler Cap Est d'abord (boutique, décision rapide)
2. Livrer un contenu tellement bon que les concurrents appellent
3. La Pagerie suit (même segment, même zone)
4. Club Med = approche différente (directeur village local, pas siège)

PRICING VERTICAL:
- Pack lifestyle luxe (5 vidéos + 20 images): 5 000€
- Campagne OTA premium (refonte visuels Booking/Expedia): 3 000€
- Pack mensuel réseaux: 2 500€/mois
- Contrat annuel tout-inclus: 40-60K€

DIFFÉRENCIATION CLUB MED:
- Le siège fait du contenu générique (soleil + piscine)
- Le local veut de l'authentique caribéen
- BYSS propose: le local avec la qualité du siège
- Tension créative siège/local = notre opportunité`,
    metadata: { prospect: "Verticale Hôtellerie Luxe", priority: "medium", estimated_value: 120000 },
    tags: ["la-pagerie", "cap-est", "club-med", "luxe", "hotellerie", "vertical"],
  },

  // ── 17. MIZA RESTAURANT ──
  {
    universe: "bible",
    category: "prospect_intel",
    title: "Intel MIZA — Le cas zéro de la verticale restaurant",
    content: `PROSPECT: MIZA Restaurant
SECTEUR: Restauration gastronomique caribéenne

PAIN POINTS:
- Pas de contenu vidéo professionnel
- Photos Instagram faites au téléphone
- Site web daté ou inexistant
- Dépendance au bouche-à-oreille

CONTEXTE:
- Pack MIZA de 10 images IA déjà conçu (dans PIPELINE_FORK_GUIDE)
- Style system complet: camera base, realism guard, direction food
- Prompts prêts: hero, plat signature, chef hands, cocktail, terrasse, etc.
- Coût: ~2€ pour 10 images IA, vendu 500€ = marge 99.6%

APPROCHE:
1. Générer les 10 images du pack MIZA
2. Les imprimer sur tablette, aller manger au restaurant
3. Montrer au chef: "Voici votre cuisine comme un film"
4. L'effet émotionnel vend le pack. Pas le prix.

PRICING:
- Pack photo restaurant (10 images IA): 500€
- Pack complet (10 images + 3 vidéos + menu design): 1 500€
- Pack mensuel contenu (4 posts/semaine): 800€/mois

VALEUR STRATÉGIQUE: MIZA est le TEMPLATE. Une fois le pack livré et validé, on le duplique sur chaque restaurant de l'île. 50 restaurants = 25K€ de revenus juste en packs photo.`,
    metadata: { prospect: "MIZA", priority: "low", estimated_value: 10000 },
    tags: ["miza", "restaurant", "gastronomie", "cas-zero", "template"],
  },
];

// ═══════════════════════════════════════════════════════
// UPSERT LOGIC
// ═══════════════════════════════════════════════════════

async function seed() {
  console.log("═══ SEED PROSPECT INTELLIGENCE ═══\n");

  let insertedCount = 0;
  let skippedCount = 0;

  for (const entry of entries) {
    // Check if exists by title
    const { data: existing } = await supabase
      .from("lore_entries")
      .select("id")
      .eq("title", entry.title)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`  ⊘ SKIP (exists): ${entry.title}`);
      skippedCount++;
      continue;
    }

    const { error } = await supabase
      .from("lore_entries")
      .insert({
        universe: entry.universe,
        category: entry.category,
        title: entry.title,
        content: entry.content,
        tags: entry.tags,
        word_count: entry.content.split(/\s+/).length,
        order_index: 0,
      });

    if (error) {
      console.error(`  ✗ ERROR: ${entry.title} — ${error.message}`);
    } else {
      console.log(`  ✓ INSERTED: ${entry.title}`);
      insertedCount++;
    }
  }

  console.log(`\n── Intel entries: ${insertedCount} inserted, ${skippedCount} skipped ──`);
  console.log(`\n═══ DONE ═══`);
}

seed().catch(console.error);
