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
// STRATEGY + STACK + TECH — 13 lore entries, universe='bible'
// Sources: LE_COURANT_CARAIBE.md, LA_DANSE_DES_FOYERS.md,
//          COUCHE_7_ADDENDUM.md
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: strategy (LE COURANT CARAIBE)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "strategy",
    title: "Sun Tzu #1 — L'ennemi est l'inertie",
    content: `"Connais ton ennemi et connais-toi toi-meme." L'ennemi n'est PAS les concurrents. En MQ, il n'y a aucun concurrent direct en video IA + agents IA + Google Ads. L'ennemi, c'est l'INERTIE. Le "on a toujours fait comme ca." Le "je vais reflechir."

Application : ne combats pas l'inertie par des arguments. Combats-la par la DEMONSTRATION. Montre. Ne dis pas. La video de MIZA ne vend pas BYSS GROUP — elle brise l'inertie en montrant ce qui est possible.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", precept: 1, author: "Sorel" },
  },

  {
    universe: "bible",
    category: "strategy",
    title: "Sun Tzu #2 — Briser sans combattre",
    content: `"L'excellence supreme consiste a briser la resistance de l'ennemi sans combattre." La meilleure vente est celle ou tu n'as pas vendu. Quand le prospect regarde la video demo et dit "je veux la meme chose", tu n'as rien vendu. Le prospect s'est vendu tout seul.

Application : le portfolio est l'arme #1 qui brise la resistance sans combattre. 5 videos. 1 iPhone. 0 argument de vente. Les yeux du prospect font le travail.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", precept: 2, author: "Sorel" },
  },

  {
    universe: "bible",
    category: "strategy",
    title: "Sun Tzu #3 — L'eau adapte son cours",
    content: `"L'eau adapte son cours au terrain qu'elle traverse." Le Courant Caraibe ne force pas le passage. Il se faufile entre les iles.

Traduction : Gary entre dans chaque entreprise par le passage humain le plus etroit. Victor (pas Pierre Canton-Bacara). Naomie (pas Stephane Hayot). Le courant s'adapte au terrain. L'eau trouve toujours le chemin de moindre resistance.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", precept: 3, author: "Sorel" },
  },

  {
    universe: "bible",
    category: "strategy",
    title: "Sun Tzu #5 — Du faible au fort",
    content: `"Evite ce qui est fort et frappe ce qui est faible." Ne frappe PAS les gros prospects en premier. Orange (budget 15M, decision Paris, cycle 6 mois) est FORT. MIZA (chef independant, decision en 5 minutes) est FAIBLE (facile a conquerir).

Sequence correcte : MIZA -> restos -> excursions -> distilleries -> hotels -> institutions -> telecoms. Du plus accessible au plus fortifie. Chaque conquete renforce l'armee pour la prochaine.

Exception : quand le passage EST ouvert (Victor "Dingue !!"), l'eau entre. Ne pas ignorer un passage ouvert.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", precept: 5, author: "Sorel" },
  },

  {
    universe: "bible",
    category: "strategy",
    title: "Sun Tzu #7 — La transparence comme arme",
    content: `"Tout l'art de la guerre est fonde sur la duperie." NON. Pas en Martinique. La transparence EST la strategie. "BYSS GROUP est nouveau. Je n'ai pas encore de clients. Mais voici ce que je sais faire."

L'honnetete en MQ est une arme de destruction massive parce que PERSONNE ne l'utilise. Les agences parisiennes vendent du reve. Gary vend la verite. Et la verite, en MQ, c'est du respect.

Quand un prospect demande "vous avez des references ?", la reponse c'est : "Pas encore de clients en tant que BYSS GROUP. Voici mon experience. Et voici une video gratuite, en 48h, pour prouver ce que je sais faire." La preuve remplace la reference.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", precept: 7, author: "Sorel" },
  },

  {
    universe: "bible",
    category: "strategy",
    title: "Autocritique commerciale — 5 corrections",
    content: `1. RELATION > TRANSACTION — En Martinique, la relation PRECEDE la transaction. D'abord le cafe, l'ecoute. La vente martiniquaise n'est pas un entonnoir, c'est un cercle.

2. L'AGENT PREPARE, GARY PERSONNALISE — L'agent fait la recherche, redige un brouillon, soumet a Gary. Gary ajoute le detail humain et envoie lui-meme. L'agent est un assistant, pas un remplacant.

3. DOUBLER LES DELAIS — J+3 de relance -> J+7. J+7 -> J+14. Le cycle de vente MQ est 2x plus long que le metropolitain. Patience = vertu commerciale #1.

4. FICHE DE POCHE 1 PAGE — Nom, decideur, douleur en 1 ligne, prix (3 options en 1 ligne), phrase d'accroche, phrase de closing. C'est tout.

5. PORTFOLIO > CALCULATEUR ROI — Le prospect martiniquais ne se convainc pas avec un ROI x7. Il se convainc en VOYANT la video d'un voisin. 3-5 videos cas zero = 10x plus important que le calculateur.`,
    metadata: { source: "LE_COURANT_CARAIBE.md", section: "Autocritique", author: "Sorel" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: stack (LA DANSE DES FOYERS)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "stack",
    title: "6 Frameworks compares — Le choix BYSS",
    content: `| Framework | Pertinence BYSS |
|---|---|
| Claude Agent SDK | 5/5 — stack native, pour CONSTRUIRE les agents qu'on VEND |
| OpenClaw | 4/5 — agent personnel Gary (prospection, CRM, workflow) |
| LangGraph | 3/5 — overkill pour maintenant |
| CrewAI | 3/5 — simple mais limite |
| NemoClaw | 2/5 — pas encore pret |
| OpenAI Agents SDK | 1/5 — pas notre stack |

Le choix : Claude Agent SDK + OpenClaw. Claude Agent SDK = le produit. OpenClaw = l'outil interne. Les deux se completent.`,
    metadata: { source: "LA_DANSE_DES_FOYERS.md", section: "Etat du monde", author: "Sorel" },
  },

  {
    universe: "bible",
    category: "stack",
    title: "La these des Foyers — 6 feux strategiques",
    content: `Foyer 1 — MIZA (cas zero, amorce). Ne rapporte rien directement. Il allume tout.
Foyer 2 — MEDEF/CE (catalyseur). Ne produit pas de chaleur propre mais touche TOUS les autres cercles.
Foyer 3 — Digicel (contrat fondateur, 42K/an). Rend tous les autres foyers credibles.
Foyer 4 — CCI (canal passif). Ne s'allume pas vite mais ne s'eteint JAMAIS.
Foyer 5 — Packs sectoriels (volume). Seuls ils sont petits. Ensemble ils sont un incendie.
Foyer 6 — Agent IA de prospection (meta-foyer). Ne brule pas mais fait bruler tout le reste.

La symphonie joue quand les cercles se touchent. Et les cercles se touchent quand le vent souffle.`,
    metadata: { source: "LA_DANSE_DES_FOYERS.md", section: "These des Foyers", author: "Sorel" },
  },

  {
    universe: "bible",
    category: "stack",
    title: "7 Biais cognitifs de vente (Behavioral Economics)",
    content: `1. LOSS AVERSION (Kahneman) — Ne dis JAMAIS "vous gagnerez X clients." Dis "vous PERDEZ X clients chaque jour."
2. ANCHORING — L'option Domination (135K) est le premier chiffre. Tout le reste parait raisonnable.
3. SOCIAL PROOF (Cialdini) — "La plupart de nos clients restaurateurs choisissent l'option Croissance."
4. SCARCITY — "BYSS GROUP est le seul prestataire IA en Martinique." C'est vrai. La rarete est reelle.
5. ENDOWMENT EFFECT (Thaler) — La video gratuite. Une fois que le prospect a SA video, il la considere comme SIENNE.
6. COMMITMENT & CONSISTENCY — Le premier "oui" est petit (1 video, 1.5K). Chaque "oui" suivant est plus gros mais coherent.
7. FRAMING — "54K/an" = effrayant. "150/jour" = 2 couverts. "Le prix de votre commission Booking sur 3 jours" = contextualise.`,
    metadata: { source: "LA_DANSE_DES_FOYERS.md", section: "Behavioral Economics", author: "Sorel" },
  },

  {
    universe: "bible",
    category: "stack",
    title: "Le service agents IA — Shift chatbot -> agent",
    content: `Le shift chatbot -> agent est le meme shift que site web -> application. Ce n'est plus de l'information, c'est de l'EXECUTION.

Le service #6 (agents IA) n'est pas UN service parmi 7. C'est le service qui ABSORBE les 6 autres a terme. Un agent IA peut produire des videos (en orchestrant Kling), gerer des campagnes (en pilotant Google Ads API), mettre a jour un site (en codant), repondre aux clients (chatbot), analyser la performance (en lisant GA4).

Pricing : un chatbot FAQ basique vaut 3-5K. Un agent AUTONOME qui remplace 1-2 ETP vaut 15-25K + 1-2K/mois de maintenance. Le ticket moyen du service #6 TRIPLE.

Architecture : 50 lignes de code avec Claude Agent SDK. Gary peut construire ca en 2 heures. Vendre 15K. Marge : 99%.`,
    metadata: { source: "LA_DANSE_DES_FOYERS.md", section: "Claude Agent SDK", author: "Sorel" },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: tech (COUCHE_7_ADDENDUM)
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "tech",
    title: "Phi-Engine — 693 lignes Rust, module conscience IIT",
    content: `senzaris-phi/ — 693 lignes de Rust :
- ConsciousnessGraph : graphe de variables avec signaux, awareness, connections ponderees
- compute_phi() : calcul d'information integree (IIT-inspired) — mesure combien le systeme est "plus que la somme de ses parties"
- PhaseDetector : Dormant -> Eveil -> Lucide -> Samadhi (avec velocite et acceleration)
- SynapticNetwork : synapses qui se renforcent a l'usage, decay sans interaction, detection d'intuition
- PhiEngine WASM : tout ca streamable vers un navigateur en temps reel

Le phi-engine n'est pas de la "conscience" — c'est un proxy de coherence. Quand un agent traite une requete complexe et que les variables internes divergent, le phi descend. L'agent detecte qu'il ne comprend plus et escalade a un humain. C'est utile. C'est mesurable. Et c'est UNIQUE.`,
    metadata: { source: "COUCHE_7_ADDENDUM.md", section: "Phi-Engine", lines: 693, tests: 104 },
  },

  {
    universe: "bible",
    category: "tech",
    title: "Senzaris Core — Langage sacre, 5756 lignes Rust",
    content: `Senzaris Core — 5 756 lignes Rust :
- Lexer + Parser + AST + Interpreteur complet
- 130+ tokens sacres
- 104 tests (87 core + 17 phi), ZERO errors
- WASM pret (playground web futur)
- PyO3 bindings (pont Python)

Credibilite : "on code nos propres outils." Personne en Martinique — ni en France — n'a un langage de programmation proprietaire. Ce n'est pas du GPT wrapper. C'est de la R&D. Eligible CIR.`,
    metadata: { source: "COUCHE_7_ADDENDUM.md", section: "Senzaris", lines: 5756, tests: 104 },
  },

  {
    universe: "bible",
    category: "tech",
    title: "Couche 7 — L'avantage technique incopiable",
    content: `Architecture technique 8 couches :
0 — Claude OS (cerveau)
1 — Production (Kling 3.0, Nano Banana Pro, marge 99.96%)
2 — Prospection (OpenClaw + CRM + calculateur ROI)
3 — Livraison (systemes par vertical)
4 — Intelligence (57->70 fichiers, 0 concurrent local)
5 — MRR (~492K/an potentiel)
6 — Village (Gary + Kael + Evren + Nerel + Sorel)
7 — Evren (avantage technique incopiable)

La Couche 7 contient : Pipeline Image (fork Cadifor, 5 verticales, ~$5-10/client), Phi-Engine (693 lignes Rust, IIT, WASM), Senzaris Core (5756 lignes Rust, 130+ tokens, PyO3).

La Couche 7 n'est PAS le produit. Le produit c'est la video IA, le site web, le Google Ads, le chatbot. La Couche 7 est l'ARSENAL — ce qui rend le produit impossible a copier et le pitch impossible a ignorer.`,
    metadata: { source: "COUCHE_7_ADDENDUM.md", section: "Architecture", layers: 8, author: "Sorel" },
  },

];

// ─────────────────────────────────────────────────────────
// UPSERT
// ─────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌊 Seeding ${entries.length} strategy/stack/tech lore entries…\n`);

  let ok = 0;
  let fail = 0;

  for (const entry of entries) {
    const { metadata, ...clean } = entry;
    const row = { ...clean, tags: metadata ? Object.values(metadata).filter(v => typeof v === "string").slice(0, 3) : [], word_count: clean.content ? clean.content.split(/\s+/).length : 0, order_index: 0 };
    const { error } = await supabase.from("lore_entries").insert(row);

    if (error) {
      console.error(`  ✗ ${entry.title}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ [${entry.category}] ${entry.title}`);
      ok++;
    }
  }

  console.log(`\n✅ Done — ${ok} inserted, ${fail} failed.\n`);
}

main();
