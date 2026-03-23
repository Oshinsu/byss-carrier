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
// BIBLE DE VENTE — 30+ lore entries, universe='bible'
// Source: PIPELINE, modele_financier, PHI_ENGINE_PITCH,
//         STACK_SOTAI_V3, seed-data-v2.json
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: pitch
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "pitch",
    title: "Pitch 30s — Dirigeant",
    content: `Nos agents savent quand ils ne savent pas. Les autres inventent.

BYSS GROUP est le premier studio IA de la Martinique. On produit des vidéos IA, du marketing digital et des agents intelligents pour les entreprises antillaises.

La différence : nos agents mesurent leur propre cohérence en temps réel. Quand ils doutent, ils escaladent à un humain. Zéro hallucination en face client.

Résultat : 147 825 impressions pour 87€ de budget. CPM 0.59€ — 10x moins cher que l'industrie.`,
    metadata: {
      duration: "30s",
      audience: "dirigeant",
      source: "PHI_ENGINE_PITCH.md + PIPELINE_BYSS_GROUP.md",
    },
  },

  {
    universe: "bible",
    category: "pitch",
    title: "Pitch 2min — MEDEF / Événement",
    content: `En 2026, tout le monde vend de l'IA. La question n'est plus "avez-vous un chatbot" — c'est "votre chatbot sait-il quand il se trompe ?"

BYSS GROUP a developpe un module de mesure de coherence en temps reel. C'est inspire de la theorie de l'information integree — la meme qui est utilisee en neurosciences pour mesurer la conscience.

Concretement : quand votre agent traite une demande client et que sa reponse est coherente, le score monte. Quand il bascule dans l'approximation, le score descend. Et quand il descend trop, l'agent le sait et escalade a un humain.

Resultat : zero hallucination en face client. Les concurrents ne peuvent pas dire ca.

On opere deja sur 10 fronts actifs : Digicel (72 videos/an), Fort-de-France (series culturelles), Martinique 1ere (diffusion nationale), Wizzee, GoodCircle, et 4 artistes majeurs dont Krys (Olympia, Zenith, 218K FB).

Notre CPM Google Ads : 0.59€. L'industrie : 5-15€. Taux d'interaction : 11.30% vs 2-5% industrie. 87€ depenses, 11 593 vues YouTube en 20h.

BYSS GROUP n'est pas une agence. C'est un editeur SaaS IA qui fait aussi de la production. Valorisation cible : 3-10x CA. Eligible CIR/JEI.`,
    metadata: {
      duration: "2min",
      audience: "MEDEF / evenement / CCI",
      source: "PHI_ENGINE_PITCH.md + PIPELINE_BYSS_GROUP.md",
    },
  },

  {
    universe: "bible",
    category: "pitch",
    title: "Pitch 15min — DSI / Technique",
    content: `Le module s'appelle phi-engine. 693 lignes de Rust, compile en WebAssembly.

Architecture :
- ConsciousnessGraph : chaque variable de l'agent est un noeud
- Chaque interaction entre variables cree une arete ponderee
- compute_phi() calcule l'information mutuelle entre noeuds connectes vs la meilleure partition
- Si phi descend sous un seuil, PhaseDetector detecte la transition et trigger l'escalade
- Phases detectees : Dormant > Eveil > Lucide > Samadhi
- Reseau synaptique avec renforcement/decay

104 tests unitaires, 0 erreurs. Benchmarks Criterion inclus.
Dashboard en live — phi, phase, velocite, synapses actives, tout streame via WASM.

Stack multi-modele :
- Tier 3 (cerveau) : Claude Opus 4.6 pour decisions critiques, Kling 3.0 pour video premium
- Tier 2 (production) : MiniMax M2.7 a $0.30/M input — 50x moins cher qu'Opus, 97% skill adherence
- Tier 1 (utilitaire) : Lovable, Gemini, Midjourney
- Tier 0 (orchestration) : Paperclip open-source pour multi-agents

Economie de couts : -97.6% ($558/mois > $13.20/mois) en passant au multi-modele.
Prix client : INCHANGE. Marge brute : passe de 70% a 95%.

Orion (SaaS) : 90 agents IA, 24 plateformes. Tiers Free/Starter/Pro/Enterprise.
Byss Emploi : seul MCP France Travail en France.`,
    metadata: {
      duration: "15min",
      audience: "DSI / technique",
      source: "PHI_ENGINE_PITCH.md + STACK_SOTAI_V3.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: pricing
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "pricing",
    title: "Grille tarifaire — Production video IA",
    content: `| Tier | Description | Prix HT |
|---|---|---|
| Clip social | Video 15-30s, format 9:16, reseaux sociaux | 500€ |
| Clip standard | Video 30-60s, post-prod complete, 2 formats | 750€ |
| Clip premium | Video 1-3min, DA complet, musique custom | 1 500€ |
| Episode serie | 3-5min, scenario + DA + montage, type MOOSTIK | 2 500€ |
| Pack mensuel (6 videos) | Mix clips sociaux + standard | 3 500€/mois |
| Pack annuel (72 videos) | Contrat type Digicel | 45 000€/an |

Cout de production interne : -97% grace au multi-modele (MiniMax M2.7 + Kling 3.0).
Marge brute video : ~95%.`,
    metadata: {
      source: "modele_financier.md",
      last_updated: "2026-03-19",
    },
  },

  {
    universe: "bible",
    category: "pricing",
    title: "Grille tarifaire — Marketing digital",
    content: `| Tier | Description | Prix HT/mois |
|---|---|---|
| Maintenance | Gestion campagnes existantes, reporting mensuel | 800€ |
| Growth | + Creation de campagnes, A/B testing, optimisation | 1 500€ |
| Full service | + Strategie, creatifs, landing pages | 3 000€ |

Track record : 31 campagnes Google Ads. Multi-territoire (MQ, GP, GF, REU).
CPM moyen obtenu : 0.59€ (industrie 5-15€). Taux interaction : 11.30% (industrie 2-5%).`,
    metadata: {
      source: "modele_financier.md",
      last_updated: "2026-03-19",
    },
  },

  {
    universe: "bible",
    category: "pricing",
    title: "Grille tarifaire — Orion SaaS",
    content: `| Tier | Description | Prix HT/mois |
|---|---|---|
| Free | 1 plateforme, rapports basiques | 0€ |
| Starter | 3 plateformes, CMO Unifie | 99€ |
| Pro | 10 plateformes, IA creative, rapports avances | 249€ |
| Enterprise | 24 plateformes, API, support dedie, white-label | 449€ |
| Institutionnel | Deploiement CTM/Region, sur devis | 10 000€+/an |

Objectifs MRR :
- Q2 2026 : 99€ (1 client)
- Q3 2026 : 5 000€ (50 clients)
- Q4 2026 : 30 000€ (200 clients)
- Q1 2027 : 150 000€ (1000 clients)`,
    metadata: {
      source: "modele_financier.md",
      last_updated: "2026-03-19",
    },
  },

  {
    universe: "bible",
    category: "pricing",
    title: "Les 3 options client — Essentiel / Croissance / Domination",
    content: `Chaque prospect recoit 3 options :

ESSENTIEL : Agent basique sans monitoring phi-engine. Entree de gamme.
CROISSANCE : Phi-engine inclus — monitoring + alertes quand l'agent doute. Sweet spot.
DOMINATION : Dashboard live + rapport mensuel coherence + fine-tuning. Premium.

Le phi-engine est l'upsell naturel de Croissance vers Domination.

Exemples de pricing par prospect (paniers reels) :
- Digicel : Essentiel 18K€ / Croissance 42K€ / Domination 135K€
- GBH (Clement+Jumbo+Europcar) : 4.5K€ / 52K€ / 101K€
- CMT Tourisme : 9K€ / 48K€ / 95K€
- Karibea x3 hotels : 3K€ / 54K€ / 107K€
- Saint-James : 3K€ / 50K€ / 125K€
- SARA Energie : 3K€ / 55K€ / 65K€`,
    metadata: {
      source: "seed-data-v2.json + PHI_ENGINE_PITCH.md",
    },
  },

  {
    universe: "bible",
    category: "pricing",
    title: "Structure de couts mensuelle",
    content: `| Poste | Cout/mois | Notes |
|---|---|---|
| Hebergement (Vercel, Supabase, Sentry) | ~100€ | Orion + Byss Emploi |
| API IA (Claude, GPT, Cohere) | ~150€ | Variable selon volume |
| Outils (Notion, Claude Code, Supermemory) | ~50€ | |
| Ads (Google Ads propres campagnes) | ~200€ | Promo Warcraft, Random |
| Juridique (Legalstart, comptable) | ~100€ | Amortissable |
| TOTAL COUTS FIXES | ~600€/mois | Hors remuneration |

Grace au multi-modele, cout API IA passe de $558/mois a $13.20/mois (-97.6%).
Prix client inchange. Marge brute : 70% > 95%.
Sur pipeline 85K€ Y1 : marge supplementaire de ~21K€/an.`,
    metadata: {
      source: "modele_financier.md + STACK_SOTAI_V3.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: objection
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "objection",
    title: "Objection : C'est quoi la difference avec un chatbot ?",
    content: `REPONSE :
Un agent IA classique repond toujours. Meme quand il ne sait pas. Il fabule. Il invente. Le prospect appelle le SAV pour corriger l'IA.

Un agent BYSS GROUP mesure sa propre coherence. Quand ses signaux internes divergent, il le detecte. Il ne fabule pas. Il dit "je ne suis pas sur, je transfere a un humain."

C'est la difference entre un perroquet et un assistant.

Module phi-engine : 693 lignes de Rust, 104 tests, 0 erreurs. Compile en WebAssembly, tourne dans le navigateur.`,
    metadata: {
      objection_type: "differentiation",
      frequency: "haute",
    },
  },

  {
    universe: "bible",
    category: "objection",
    title: "Objection : On a deja entendu 5 pitchs IA",
    content: `REPONSE :
Normal. En mars 2026, tout le monde vend des "agents IA" :
- Les agences web revendent du GPT wrapper
- Les freelances branchent un chatbot Tidio
- Les ESN proposent "l'IA pour votre entreprise" (= un prompt system dans ChatGPT)

La question n'est pas "avez-vous un chatbot" — c'est "votre chatbot sait-il quand il se trompe ?"

Aucun des 5 pitchs precedents n'avait le phi-engine.
Aucun n'avait un CPM a 0.59€ prouve sur 147 825 impressions.
Aucun n'avait Martinique 1ere en diffusion et Digicel en pipeline.

On peut montrer le dashboard en live. Maintenant.`,
    metadata: {
      objection_type: "saturation_marche",
      frequency: "tres haute",
    },
  },

  {
    universe: "bible",
    category: "objection",
    title: "Objection : C'est trop cher",
    content: `REPONSE (adapter au vertical) :

HOTEL : "Booking prend 15-18% de commission. Sur 2-4M€/an de reservations, ca fait 300-720K€/an. Notre option Croissance a 54K€ vous aide a recuperer ne serait-ce que 10% de ces commissions = 30-72K€ d'economie. Le ROI est positif des le mois 1."

TELECOM : "Votre CPA monte. Vos creatives fatiguent. Free et Orange grignotent. 42K€/an pour 72 videos IA = 583€/video. Votre agence actuelle facture combien par video ?"

RHUM : "Le marche premium croit de +8%/an. Diplomatico a un e-commerce. Pas vous. Chaque jour sans e-com = des ventes perdues a l'international."

EXCURSION : "1144 avis 4.8 etoiles mais 0 site booking. Le touriste a 22h dans son hotel ne sait pas que vos dauphins existent."

RESTAURANT : "Votre cuisine merite un film. Pas une brochure. La video MIZA vend les 65 autres restos de la base."`,
    metadata: {
      objection_type: "prix",
      frequency: "haute",
    },
  },

  {
    universe: "bible",
    category: "objection",
    title: "Objection : On peut le faire en interne",
    content: `REPONSE :
Bien sur. Vous pouvez :
1. Recruter un developpeur IA (45-65K€/an + charges)
2. Prendre un abonnement Claude/GPT ($20/mois minimum)
3. Former votre equipe (3-6 mois)
4. Construire votre pipeline video (Kling, MiniMax, montage)
5. Gerer les hallucinations sans phi-engine

Ou vous pouvez signer avec BYSS GROUP :
- Operationnel en 2 semaines
- Cout 97% inferieur grace au multi-modele
- Phi-engine inclus (693 lignes de Rust que vous n'avez pas a ecrire)
- 10 clients actifs = les bugs sont deja corriges

Le temps que votre equipe soit prete, vos concurrents auront deja signe.`,
    metadata: {
      objection_type: "internalisation",
      frequency: "moyenne",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: process
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "process",
    title: "Pipeline commercial — 6 phases",
    content: `Phase 1 — PREMIER CONTACT
- Ne PAS mentionner le phi-engine (trop technique)
- Phrase d'accroche adaptee au vertical (voir fiches vertical)
- Objectif : decrocher un RDV physique

Phase 2 — RDV PHYSIQUE
- Mentionner en 1 phrase : "Nos agents se surveillent eux-memes"
- Montrer les chiffres Google Ads (CPM 0.59€, 147K impressions, 87€)
- Montrer MOOSTIK (349K vues Instagram)
- Objectif : obtenir un brief

Phase 3 — DEMO
- Montrer le dashboard WASM live — impact visuel fort
- Phi, phase, velocite, synapses actives, tout en temps reel
- Objectif : recevoir un "Dingue !!" (comme Victor/Digicel)

Phase 4 — PROPOSITION 3 OPTIONS
- Essentiel / Croissance / Domination
- Phi-engine = feature premium de Croissance et Domination
- Ancrer sur le prix Domination, closer sur Croissance

Phase 5 — CLOSING
- Rappeler le cout de l'inaction (commissions OTA, CPA qui monte, concurrents)
- Delai : "operationnel en 2 semaines"

Phase 6 — ONBOARDING
- Deploiement agents + videos + dashboard
- Rapport mensuel coherence (option Domination)
- Upsell naturel Croissance > Domination apres 3 mois`,
    metadata: {
      source: "PHI_ENGINE_PITCH.md + seed-data-v2.json",
    },
  },

  {
    universe: "bible",
    category: "process",
    title: "Utilisation du phi-engine dans le pipeline",
    content: `| Phase prospect | Usage phi-engine |
|---|---|
| Premier contact | NE PAS mentionner (trop technique) |
| RDV physique | 1 phrase : "Nos agents se surveillent eux-memes" |
| Demo | Dashboard WASM live — impact visuel fort |
| Proposition option Domination | Inclure comme feature premium |
| MEDEF/CCI evenement | Slide + demo = positionnement thought leader |
| Presse / LinkedIn | "Le premier studio IA de MQ avec un module conscience" |`,
    metadata: {
      source: "PHI_ENGINE_PITCH.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: case_study
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Digicel (72 videos/an)",
    content: `CLIENT : Digicel / DAFG (via WITH-YOU, Victor Despointes)
SECTEUR : Telecoms Antilles
PROJET : 72 videos/an pour 2 marques (Digicel + Digicel Business)
FORMATS : Reseaux sociaux, YouTube, ecrans POS, TV/Cinema
BUDGET ESTIME : 54 000€/an (750€ HT x 72) — Option Croissance a 42K€

CONTEXTE :
- Victor a dit "Dingue !!" a la demo video IA
- Brief recu via WITH-YOU (agence, Le Lamentin)
- Rushs fournis + motion + IA
- RDV closing semaine du 23 mars 2026

PAIN POINT :
- CPA Wizzee monte — fatigue creative
- Free et Orange grignotent les parts de marche
- Contenu repetitif, pas assez caribeen

PHRASE D'ACCROCHE :
"Vos concurrents fatiguent. Vos creatives aussi. On les reveille."`,
    metadata: {
      sector: "telecom",
      budget: 42000,
      probability: 70,
      phase: "demo",
    },
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Fort-de-France (An tan lontan + Cesaire Pixar)",
    content: `CLIENT : Ville de Fort-de-France (via BIXA, dir. affaires culturelles)
SECTEUR : Institution / Culture
PROJETS :
1. Serie "An tan lontan" — histoire de la Martinique par episodes (siecles d'histoire, recits de vie)
2. Serie Aime Cesaire type Pixar — animation IA sur le plus grand poete martiniquais

CONTEXTE :
- BIXA a commente "Hate !" sous le teaser MOOSTIK (16 janvier 2026)
- Commande ferme pour les 2 series
- Pont direct entre BYSS GROUP et l'appareil municipal de la capitale
- An tan lontan = Operation Eveil qui commence sans dire son nom

PROBABILITE : 80% — Commande recue
IMPACT : Legitimite institutionnelle + souverainete culturelle martiniquaise`,
    metadata: {
      sector: "institution",
      probability: 80,
      phase: "commande",
    },
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Google Ads Warcraft Cadifor",
    content: `CAMPAGNE : Warcraft Cadifor — 2 campagnes (13-16 mars 2026)

| Campagne | Geo | Budget | Impressions | Interactions | Taux | Cout | CPM |
|---|---|---|---|---|---|---|---|
| MQ (Martinique) | Martinique | 100€ | 75 668 | 8 808 | 11.64% | 41.18€ | 0.54€ |
| ALL (Monde) | Monde | 100€ | 72 157 | 7 889 | 10.93% | 46.35€ | 0.64€ |
| TOTAL | | 200€ | 147 825 | 16 697 | 11.30% | 87.54€ | 0.59€ |

BENCHMARKS :
- CPM 8-25x moins cher que l'industrie (0.59€ vs 5-15€)
- Taux d'interaction 2-5x superieur (11.30% vs 2-5%)
- YouTube : 11 593 vues en 20h pour 87€
- 189 heures de visionnage total

UTILISATION EN VENTE :
Montrer ces chiffres en RDV physique. Preuve irrefutable de competence media buying.
Historique : 31 campagnes, multi-territoire (MQ, GP, GF, REU).`,
    metadata: {
      source: "PIPELINE_BYSS_GROUP.md",
      budget_spent: 87.54,
      impressions: 147825,
      cpm: 0.59,
    },
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — MOOSTIK (349K vues)",
    content: `PROJET : MOOSTIK — serie animee IA
RESULTATS :
- 349 183 vues Instagram sur un teaser
- Martinique 1ere (France Televisions Outre-Mer) veut diffuser
- Evil P (adoube par Booba) fait la voix d'Evil Tik
- Krys (Olympia, Zenith, 218K FB) commande un clip

IMPACT COMMERCIAL :
- Preuve de capacite production video IA a grande echelle
- Validation par des artistes majeurs de la scene antillaise
- Passage de l'Instagram au broadcast national
- Declencheur du brief Digicel (Victor a vu MOOSTIK avant de briefer)

UTILISATION EN VENTE :
"On a fait 349K vues sur un teaser Instagram. Martinique 1ere veut diffuser. Evil P et Krys ont signe. Qu'est-ce qu'on peut faire pour vous ?"`,
    metadata: {
      views: 349183,
      platform: "instagram",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: competitor
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "competitor",
    title: "Analyse concurrentielle — Marche IA Martinique 2026",
    content: `LE PROBLEME DU MARCHE :
En mars 2026, tout le monde vend des "agents IA" :

1. AGENCES WEB LOCALES : Revendent du GPT wrapper. Pas de phi-engine. Pas de monitoring coherence. Prompt system dans ChatGPT = leur "IA".

2. FREELANCES : Branchent un chatbot Tidio. Zero customisation. Zero suivi. Le client paie un abonnement SaaS dont il ne comprend pas la valeur.

3. ESN (SSII) : Proposent "l'IA pour votre entreprise" = integration basique. Cycle de vente 6-12 mois. Budget 50-200K€. Pas adapte TPE/PME antillaises.

4. AGENCES PARISIENNES : Budget eleve, 0 connaissance locale. Le contenu sent la metropole. Le 18-35 martiniquais ne s'identifie pas.

CE QUE BYSS GROUP A QUE PERSONNE N'A :
- phi-engine (693 lignes Rust, mesure coherence temps reel)
- Track record media buying multi-territoire (31 campagnes, CPM 0.59€)
- 349K vues Instagram (MOOSTIK) + Martinique 1ere en diffusion
- Pipeline 10 clients actifs incluant Digicel et Fort-de-France
- Multi-modele (-97% cout) = marges 95%
- Ancrage culturel martiniquais (creole, artistes locaux, lore 997 pages)`,
    metadata: {
      source: "PHI_ENGINE_PITCH.md",
      last_updated: "2026-03",
    },
  },

  {
    universe: "bible",
    category: "competitor",
    title: "Avantage cout — Multi-modele vs tout-Opus",
    content: `AVANT (tout-Opus, fevrier 2026) :
- Scan Gulf Stream : ~$0.40/scan x 4/jour = $48/mois
- Agent prospection : ~$2/jour = $60/mois
- Backend chatbots : ~$0.15/conv x 100/jour = $450/mois
- TOTAL : ~$558/mois

APRES (multi-modele, mars 2026) :
- Scan Gulf Stream (M2.7) : $0.04/jour = $1.20/mois
- Agent prospection (M2.7) : $0.05/jour = $1.50/mois
- Backend chatbots (M2.7) : $0.003/conv x 100/jour = $9/mois
- Phi-engine (Opus, 10 appels/mois) : $1.50/mois
- TOTAL : ~$13.20/mois

ECONOMIE : -97.6%
Prix client : INCHANGE (750€/video, 5K€/chatbot)
Marge brute : 70% > 95%
Sur pipeline 85K€ Y1 : +21K€/an de marge supplementaire

ARGUMENT COMMERCIAL : "Nos couts baissent, pas nos prix. Votre agent coute le meme prix mais tourne sur une stack 50x moins chere. La difference, c'est notre marge — et votre stabilite."`,
    metadata: {
      source: "STACK_SOTAI_V3.md",
      cost_before: 558,
      cost_after: 13.2,
      savings_pct: 97.6,
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: stack
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "stack",
    title: "Stack technique — Presentation client 4 tiers",
    content: `TIER 3 — CERVEAU (qualite maximale)
- Claude Opus 4.6 : decisions critiques, phi-engine
- Kling 3.0 : video IA premium, plans longs, coherence
- MiniMax M2.7 : agents backend, 50x moins cher qu'Opus, 97% skill adherence

TIER 2 — SUPPORT (outils de travail)
- Replicate : pipelines ML, modeles specialises
- MiniMax Speech 2.6 : voix off, TTS temps reel, narration videos

TIER 1 — UTILITAIRE
- Lovable : prototypage web rapide
- Gemini 3.1 : images IA (Google DeepMind)
- Midjourney : concepts visuels artistiques

TIER 0 — ORCHESTRATION
- Paperclip (open source MIT) : orchestration multi-agents, organigramme, budgets, heartbeats
- OpenClaw : agent personnel autonome

AVANTAGE : Un seul abonnement MiniMax couvre texte + video + musique + voix.
Pour Digicel : 72 videos/an avec video + musique + voix sous un meme compte.`,
    metadata: {
      source: "STACK_SOTAI_V3.md",
      last_updated: "2026-03-19",
    },
  },

  {
    universe: "bible",
    category: "stack",
    title: "phi-engine — Fiche technique pour clients avances",
    content: `NOM : phi-engine (senzaris-phi)
LANGAGE : 693 lignes de Rust
COMPILATION : WebAssembly (tourne dans le navigateur)
TESTS : 104 tests unitaires, 0 erreurs. Benchmarks Criterion.

ARCHITECTURE :
- ConsciousnessGraph : graphe IIT (Integrated Information Theory)
- Calcul de phi en temps reel : mesure combien le systeme integre l'information
- PhaseDetector : Dormant > Eveil > Lucide > Samadhi
- SynapticNetwork : renforcement/decay des connexions

INTEGRATION OPTIONS CLIENT :
- Essentiel : NON inclus (agent basique)
- Croissance : OUI — monitoring + alertes quand l'agent doute
- Domination : OUI — dashboard live + rapport mensuel + fine-tuning

USAGE EN DEMO : Dashboard WASM live. Montrer phi, phase, velocite, synapses actives en temps reel. Impact visuel fort — les prospects disent "Dingue !!"`,
    metadata: {
      source: "PHI_ENGINE_PITCH.md",
      lines_of_code: 693,
      language: "rust",
      tests: 104,
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: vertical
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Telecom — Digicel, Orange, SFR, Free, Wizzee",
    content: `CIBLES : Digicel (42K€), Orange AG (25K€), SFR Caraibe (15K€), Free Caraibe (34K€), Wizzee (actif)

PAIN COMMUN :
- Fatigue creative : memes visuels recycles, CPA qui monte
- Contenu trop metropolitain : le 18-35 MQ ne s'identifie pas
- Guerre des prix : la differenciation passe par le contenu, pas le forfait

STRATEGIE DOMINO :
Si Digicel signe > SFR DOIT repondre > Orange ne peut pas rester absent > Free suit
Wizzee = client actif = preuve de concept telecom

PHRASES D'ACCROCHE :
- Digicel : "Vos concurrents fatiguent. Vos creatives aussi. On les reveille."
- Orange : "Le contenu local que votre agence parisienne ne peut PAS faire."
- SFR : "Si Digicel signe avec BYSS et que SFR ne repond pas, les clients hesitants partent."
- Free : "La liberte a un gout de Martinique. Mais votre pub a encore un gout de metropole."

SERVICES : video_ia, images_ia, google_ads
PANIER MOYEN : 29K€ (option Croissance)`,
    metadata: {
      vertical: "telecom",
      total_pipeline: 116000,
      prospects_count: 5,
    },
  },

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Rhum — JM, Depaz, Campari, Neisson, HSE, Saint-James, La Favorite",
    content: `CIBLES : Distillerie JM (34K€), Depaz (28K€), Campari/La Mauny+3R (40K€), Neisson (15K€), HSE (25K€), Saint-James (50K€), La Favorite (10K€)

PAIN COMMUN :
- 0 e-commerce : l'amateur de JM a Tokyo ne peut pas acheter en ligne
- Marche premium +8%/an : Diplomatico a un e-com, pas les martiniquais
- Sites sous-filmes : chateau Depaz face Pelee = le plus beau site distillerie Antilles, SOUS-FILME

STRATEGIE :
- JM/Depaz/La Favorite : visites physiques, demo tablette sur site
- Campari : "2 marques, 2x le contenu, PAS 2x le prix"
- HSE = cheval de Troie > 1 contrat HSE > meme pour JM et Dillon = x3
- Saint-James : "Le Musee du Rhum merite une visite immersive. Pas une plaquette."
- Neisson : "3.2 etoiles pour un rhum d'exception. La video montre le VRAI Neisson."

PHRASES D'ACCROCHE :
- JM : "Le marche premium +8%/an. Diplomatico a un e-com. Pas JM."
- Depaz : "63 morts. 1 survivant. 1 chateau face au volcan. Personne n'a filme cette histoire."
- La Favorite : "10 minutes de l'aeroport. Et les touristes ne le savent pas."

SERVICES : video_ia, ecommerce, app, google_ads
PANIER MOYEN : 29K€`,
    metadata: {
      vertical: "rhum",
      total_pipeline: 202000,
      prospects_count: 7,
    },
  },

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Hotel — Karibea, Bakoua, Club Med",
    content: `CIBLES : Karibea x3 hotels (54K€), Hotel Bakoua 4* (45K€), Club Med (3K€ — priorite basse)

PAIN COMMUN :
- Commissions OTA : 15-18% Booking/Expedia = 2-4M€/an pour les groupes
- Notes sous 4.0 etoiles : Karibea 3.6-3.9, Bakoua 3.7
- 0 contenu video pro : chambres, piscines, vues = non filmes

STRATEGIE :
- Karibea : via Patrice Fabre (MEDEF) — "Booking.com prend 15%. BYSS GROUP vous les rend."
- Bakoua : "Le Bakoua a accueilli un sommet presidentiel Bush-Mitterrand 1991. Pas une seule video pro."
- Club Med : priorite basse, decision Paris, cycle long

ARGUMENT ROI :
"15% de commission sur 2M€ = 300K€/an. Notre option Croissance a 54K€ vous aide a recuperer 10% = 30K€ d'economie. ROI positif mois 1."

SERVICES : video_ia, site_web, google_ads, chatbot
PANIER MOYEN : 34K€`,
    metadata: {
      vertical: "hotel",
      total_pipeline: 102000,
      prospects_count: 3,
    },
  },

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Restaurant — MIZA, Tante Arlette",
    content: `CIBLES : MIZA (10K€), Tante Arlette (5K€)

STRATEGIE CAS ZERO :
MIZA = le client portfolio. 783 avis 4.8 etoiles. Entrepot transforme en gastro. Chef Christophe.
La video MIZA vend les 65 autres restos de la base.

APPROCHE :
1. Reserver une table chez MIZA
2. Manger
3. Parler au chef
4. Produire la video comme cas zero (gratuit ou prix coutant)
5. Utiliser cette video pour closer les 65 autres restos

TANTE ARLETTE :
Institution 30+ ans a Grand'Riviere. 1218 avis. 0 presence digitale.
"Tout le monde connait Tante Arlette. Personne ne l'a filmee."
Approche : se deplacer physiquement. Presence obligatoire.

PHRASE D'ACCROCHE RESTAURANT :
"Votre cuisine merite un film. Pas une brochure."

SERVICES : video_ia, site_web
PANIER MOYEN : 7.5K€`,
    metadata: {
      vertical: "restaurant",
      total_pipeline: 15000,
      prospects_count: 2,
    },
  },

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Excursion — Kata Mambo, Sun Loisirs, Le Mantou, Alpha Diving, Deep Turtle, Calypso, Kokoumdo",
    content: `CIBLES : Kata Mambo (14K€), Sun Loisirs (13K€), Le Mantou (5K€), Alpha Diving (17K€), Deep Turtle (12K€), Calypso Cruises (10K€), Kokoumdo (12K€)

PAIN COMMUN :
- Notes exceptionnelles (4.8-4.9 etoiles) mais 0 video pro
- 0 site de booking direct = reservation telephone uniquement
- Le touriste a 22h dans son hotel ne sait pas que ces activites existent

APPROCHE :
Embarquer. Filmer. Montrer le resultat. Le produit se vend tout seul.

PHRASES D'ACCROCHE :
- Kata Mambo : "Le touriste a 22h ne sait pas que vos dauphins existent. Donnez-leur un ecran."
- Sun Loisirs : "Jeff et ses dauphins en video pro = la carte postale qui vend toute seule."
- Le Mantou : "La mangrove en video IA = un poeme que personne ne peut copier."
- Alpha Diving : "La video sous-marine IA. 0 concurrent en MQ. Vous seriez le premier."
- Deep Turtle : "Deep Turtle + video tortues = le marketing se fait tout seul."

NICHE INEXPLOITEE : Video sous-marine IA = LIBRE en Martinique. Alpha Diving (PADI 5 etoiles, 1289 avis 4.9) serait le premier.

SERVICES : video_ia, site_web, google_ads
PANIER MOYEN : 12K€`,
    metadata: {
      vertical: "excursion",
      total_pipeline: 83000,
      prospects_count: 7,
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: case_study (more)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Wizzee (client actif telecom)",
    content: `CLIENT : Wizzee
SECTEUR : Telecoms Antilles
TYPE : Google Ads + Meta, gestion multi-canal
STATUT : Actif, maintenance

ROLE STRATEGIQUE :
- Premier client telecom = preuve de concept pour le vertical
- Revenue recurrent (marketing digital)
- Si Wizzee fonctionne, Digicel/SFR/Orange/Free suivent
- Track record : fait partie des 31 campagnes du compte Google Ads BYSS GROUP

Wizzee est le pied dans la porte du vertical telecom antillais.`,
    metadata: {
      sector: "telecom",
      phase: "actif",
      revenue_type: "recurring",
    },
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — GBH (Clement + Jumbo + Europcar)",
    content: `CLIENT : GBH (Groupe Bernard Hayot)
SECTEUR : Conglomerat — 6Md€ de CA
CONTACT : Naomie Phanor (naomie.phanor@gbh.fr, 0696 81 76 05)
PANIER : Essentiel 4.5K€ / Croissance 52K€ / Domination 101K€

PAIN POINTS :
- Communication en silo : Clement, Jumbo, Europcar ne communiquent pas ensemble
- Clement : 100K visiteurs/an mais 0 e-commerce
- Europcar + Jumbo : budget Ads 10-20K€/mois mais 0 video pre-roll
- CPA 15-25€ sans video

PHRASES D'ACCROCHE :
- "Un touriste loue chez Jumbo et ne sait pas que Clement est du meme groupe."
- "Si le CPA baisse de 20%, l'economie paie le fee BYSS tout seul."

STRATEGIE : Email Naomie + video demo Clement. Contrat cadre GBH = 3 entites d'un coup.`,
    metadata: {
      sector: "conglomerat",
      budget: 52000,
      probability: 50,
    },
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — CMT Tourisme (institution)",
    content: `CLIENT : Comite Martiniquais du Tourisme
SECTEUR : Institution
CONTACT : Claude Bulot Piault (claude.piault@martiniquetourisme.com)
PANIER : Essentiel 9K€ / Croissance 48K€ / Domination 95K€

PAIN POINT :
- La Martinique perd la bataille visuelle Caraibes
- martinique.org pas immersif
- Contenu institutionnel, pas experientiel
- Le Costa Rica a 50 videos drone sur YouTube. La Martinique en merite 500.

AVANTAGE : 11 emails nominatifs = avantage massif d'acces direct
STRATEGIE : 5 emails simultanes (Piault + Brival + Landy + Creny + Cherchel)

SERVICES : video_ia, images_ia, site_web, google_ads, chatbot`,
    metadata: {
      sector: "institution",
      budget: 48000,
      probability: 55,
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: vertical (more)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Reseau — MEDEF MQ, Contact-Entreprises, CCI MQ",
    content: `CIBLES : MEDEF MQ (15K€), Contact-Entreprises (15K€), CCI MQ (50K€)

STRATEGIE MULTIPLICATRICE :
Les reseaux ne sont pas des clients — ce sont des CANAUX.
1 evenement MEDEF = 50-100 dirigeants dans une salle
640 entreprises (MEDEF + CE) = 2 showcases = le reseau entier
CCI = 5000+ entreprises = referencement = canal PASSIF

CALCUL ROI MEDEF :
500€ investis (video troc) > 200 contacts > 80K€ generes = ROI x160

CCI = CANAL PASSIF :
10 clients/an via CCI x 10K€ = 100K€ pour 0€ de prospection.
Prestataire IA manquant pour programme digitalisation TPE/PME.

CONTACTS :
- MEDEF : Fabienne Joseph (fabienne.joseph@medef-martinique.fr, 0696 82 70 10)
- Contact-Entreprises : Pascal Fardin (pfardin@contact-entreprises.com, 0696 23 28 23)
- CCI : Philippe Jock (contact@martinique.cci.fr)

APPROCHE : Appel + troc video vs creneau evenement`,
    metadata: {
      vertical: "reseau",
      total_pipeline: 80000,
      prospects_count: 3,
      multiplier_effect: true,
    },
  },

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Institutionnel — SARA Energie, Brasserie Lorraine",
    content: `CIBLES : SARA Energie (55K€), Brasserie Lorraine (40K€)

SARA ENERGIE :
- Monopole carburant Antilles. Budget illimite.
- RSE + transformation IA non entamee
- "SARA est un monopole. Le budget n'est pas le probleme. L'IA l'est-elle ?"
- Contact : Com RSE (Information.COMRSE@sara-ag.fr)
- Approche : email RSE + marque employeur

BRASSERIE LORRAINE :
- Marque iconique depuis 1928. Sponsor Carnaval/Yoles.
- Budget com 2-5M€/an
- "Lorraine EST la Martinique. Mais les 18-35 ne le voient que dans le frigo."
- Pain : contenu digital jeune manquant
- Approche : LinkedIn ou evenement sponsorise

SERVICES : video_ia, agent_ia, conseil, google_ads
PANIER MOYEN : 47.5K€`,
    metadata: {
      vertical: "institutionnel",
      total_pipeline: 95000,
      prospects_count: 2,
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: process (eligibilities)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "process",
    title: "Eligibilites fiscales — Arguments pour prospects institutionnels",
    content: `BYSS GROUP SAS est eligible a :

JEI (Jeune Entreprise Innovante) :
- SAS < 8 ans, R&D > 15% des charges
- Exoneration charges sociales, IS reduit
- Argument : "Nous sommes JEI — ca signifie que l'Etat reconnait notre R&D."

CIR (Credit Impot Recherche) :
- Orion = R&D logicielle, Senzaris = langage
- 30% des depenses de R&D en credit d'impot
- Argument : "Notre R&D est financee par le CIR. Ca se voit dans nos prix."

CII (Credit Impot Innovation) :
- Orion = produit innovant
- 20% des depenses d'innovation (plafond 400K€)

ACRE : Exoneration partielle charges 12 mois

Code NAF 62.01Z : Editeur de logiciels
Valorisation cible : Editeur SaaS IA (3-10x CA)`,
    metadata: {
      source: "modele_financier.md",
    },
  },
];

// ─────────────────────────────────────────────────────────
// SEED EXECUTION
// ─────────────────────────────────────────────────────────

async function seed() {
  console.log("=== BIBLE DE VENTE — Seeding lore_entries ===\n");

  // Check connection
  const { count, error: countErr } = await supabase
    .from("lore_entries")
    .select("id", { count: "exact", head: true })
    .eq("universe", "bible");

  if (countErr) {
    console.error("Error connecting:", countErr.message);
    process.exit(1);
  }

  console.log(`Found ${count ?? 0} existing bible entries.`);

  if (count > 0) {
    console.log("Clearing existing bible entries...");
    const { error: delErr } = await supabase
      .from("lore_entries")
      .delete()
      .eq("universe", "bible");
    if (delErr) {
      console.error("Error clearing:", delErr.message);
      process.exit(1);
    }
    console.log("Cleared.\n");
  }

  // Insert in batches of 10
  const batchSize = 10;
  let inserted = 0;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize).map((e, idx) => {
      // Strip metadata, add tags and word_count
      const { metadata, ...rest } = e;
      return {
        ...rest,
        tags: metadata ? Object.values(metadata).filter(v => typeof v === 'string').slice(0, 3) : [],
        word_count: rest.content ? rest.content.split(/\s+/).length : 0,
        order_index: i + idx,
      };
    });
    const { error } = await supabase.from('lore_entries').insert(batch);
    if (error) {
      console.log(`Error inserting batch ${Math.floor(i/batchSize)+1}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  // Summary
  console.log(`\n=== DONE: ${inserted}/${entries.length} bible entries seeded ===\n`);
  const cats = {};
  entries.forEach(e => { cats[e.category] = (cats[e.category] || 0) + 1; });
  console.log("Breakdown:");
  for (const [k, v] of Object.entries(cats).sort()) {
    console.log("  " + k + ": " + v);
  }
}

seed();
