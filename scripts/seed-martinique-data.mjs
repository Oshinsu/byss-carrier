/**
 * seed-martinique-data.mjs — Seed intel_entities with Martinique economic,
 * demographic, sectoral, corporate and institutional intelligence data.
 *
 * Usage: node scripts/seed-martinique-data.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ── Load env from .env.local ────────────────────────────
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════
// ECONOMIC INDICATORS (8)
// ═══════════════════════════════════════════════════════

const economicIndicators = [
  {
    domain: 'economique',
    name: 'PIB Martinique',
    type: 'indicateur-economique',
    description: 'PIB 9.3 Md EUR (2023). Economie de transferts, dependance structurelle aux subventions metropolitaines. PIB/hab ~24 500 EUR, 70% de la moyenne metropolitaine.',
    influence_score: 9,
    tags: ['pib', 'macro', 'croissance', 'dependance'],
    notes: 'Stagnation reelle. Croissance nominale portee par inflation, pas par production.',
  },
  {
    domain: 'economique',
    name: 'Chomage Martinique',
    type: 'indicateur-economique',
    description: 'Taux de chomage 15.2% (T3 2025). Jeunes 18-25 ans: 35-40%. Chomage structurel, marche etroit, fuite des competences vers metropole.',
    influence_score: 8,
    tags: ['chomage', 'emploi', 'jeunes', 'structurel'],
    notes: 'Chomage reel (avec halo) probablement 20%+. Sous-emploi massif non comptabilise.',
  },
  {
    domain: 'economique',
    name: 'Salaire median Martinique',
    type: 'indicateur-economique',
    description: 'Salaire median net 1 850 EUR/mois. SMIC represente 60% des salaries du prive. Ecart public/prive: +40% de surrumuneration fonction publique (indexation 40%).',
    influence_score: 7,
    tags: ['salaire', 'pouvoir-achat', 'surrumuneration', 'smic'],
    notes: 'La surrumuneration gonfle artificiellement les revenus medians. Prive = precarite.',
  },
  {
    domain: 'economique',
    name: 'TVA et Octroi de Mer',
    type: 'indicateur-economique',
    description: 'TVA reduite 8.5% (vs 20% metro). Octroi de mer: taxe locale sur imports, 150-200M EUR/an pour les communes. Renegociation UE 2027. Double imposition de fait sur les imports.',
    influence_score: 8,
    tags: ['fiscalite', 'tva', 'octroi-de-mer', 'communes'],
    notes: 'Octroi de mer = levier politique majeur. Communes en dependent. Reforme UE 2027 = risque.',
  },
  {
    domain: 'economique',
    name: 'Inflation et vie chere',
    type: 'indicateur-economique',
    description: 'Cout de la vie +30 a 40% vs metropole sur alimentation, energie, transport. Inflation cumulee +40% sur produits de base 2019-2025. Crise sociale permanente.',
    influence_score: 9,
    tags: ['inflation', 'vie-chere', 'pouvoir-achat', 'crise'],
    notes: 'Declencheur de la crise sociale sept 2024. Emeutes, barrages. Theme electoral dominant.',
  },
  {
    domain: 'economique',
    name: 'Commerce exterieur Martinique',
    type: 'indicateur-economique',
    description: 'Imports 3.2 Md EUR, exports 0.4 Md EUR. Deficit commercial structurel 2.8 Md EUR. Dependance quasi-totale aux imports metropolitains (70%) et UE.',
    influence_score: 7,
    tags: ['import', 'export', 'deficit', 'dependance'],
    notes: 'Ratio couverture 12.5%. Aucune souverainete alimentaire ni energetique.',
  },
  {
    domain: 'economique',
    name: 'Secteur public emploi Martinique',
    type: 'indicateur-economique',
    description: 'Secteur public = 40% de l\'emploi salarie total. CTM, Etat, hopitaux, education, communes. Moteur economique de fait, pas de substitut prive credible.',
    influence_score: 8,
    tags: ['emploi-public', 'fonctionnaires', 'etat', 'ctm'],
    notes: 'Toute contraction de l\'emploi public = recession locale. Piege structurel.',
  },
  {
    domain: 'economique',
    name: 'Investissement et BPI',
    type: 'indicateur-economique',
    description: 'Investissement prive faible. BPI France Martinique: 50-80M EUR/an de financements (prets, garanties). Taux de creation d\'entreprise inferieur de 30% a la metro. Acces credit difficile.',
    influence_score: 6,
    tags: ['investissement', 'bpi', 'credit', 'creation-entreprise'],
    notes: 'Banques locales frileuses. Garanties excessives demandees. BPI = seul levier serieux.',
  },
];

// ═══════════════════════════════════════════════════════
// KEY SECTORS (7)
// ═══════════════════════════════════════════════════════

const keySectors = [
  {
    domain: 'sectoriel',
    name: 'Tourisme Martinique',
    type: 'secteur',
    description: '22% du PIB. 1M+ visiteurs/an (croisiere + sejour). 8 000 emplois directs. Croissance croisiere +15%/an. Pointe-du-Bout, Sainte-Anne, presqu\'ile Caravelle.',
    influence_score: 9,
    tags: ['tourisme', 'croisiere', 'emploi', 'sejour', 'hotellerie'],
    notes: 'Sous-exploite vs Guadeloupe et Republique Dominicaine. Manque hotel 4-5 etoiles.',
  },
  {
    domain: 'sectoriel',
    name: 'BTP Martinique',
    type: 'secteur',
    description: '15% du PIB. 6 000 entreprises, 12 000 salaries. Marches publics CTM/communes = 70% du CA. TCSP tram-bus, renovation urbaine FdF, Plan Seisme Antilles.',
    influence_score: 8,
    tags: ['btp', 'construction', 'marches-publics', 'tcsp'],
    notes: 'Secteur cyclique, depend des commandes publiques. Corruption endogene. Normes antisismiques couteuses.',
  },
  {
    domain: 'sectoriel',
    name: 'Agriculture et Rhum AOC',
    type: 'secteur',
    description: 'Banane (200M EUR export), canne/rhum (12 distilleries AOC, 80% rhum agricole mondial). 4 000 emplois. Label AOC Martinique depuis 1996, seul rhum AOC au monde.',
    influence_score: 8,
    tags: ['agriculture', 'rhum', 'banane', 'aoc', 'distillerie'],
    notes: '12 distilleries: Clement, JM, Neisson, Depaz, La Mauny, Trois Rivieres, HSE, Saint-James, Dillon, La Favorite, Simon, Hardy.',
  },
  {
    domain: 'sectoriel',
    name: 'Numerique Martinique',
    type: 'secteur',
    description: '200+ entreprises, ~1 500 emplois. 85% couverture fibre optique. French Tech Martinique labellisee. Startups: fintech, edtech, agritech. Retard vs metro mais acceleration.',
    influence_score: 7,
    tags: ['numerique', 'fibre', 'startup', 'french-tech', 'innovation'],
    notes: 'Byss Group positionne ici. Marche etroit mais sous-exploite. Peu de concurrence serieuse en IA/data.',
  },
  {
    domain: 'sectoriel',
    name: 'Commerce et grande distribution Martinique',
    type: 'secteur',
    description: 'GBH domine (Carrefour, ~30% PDM). Leader Price, Euromarche, marches locaux. Oligopole de fait sur l\'import-distribution. Marges +10% vs metro.',
    influence_score: 8,
    tags: ['commerce', 'distribution', 'gbh', 'oligopole', 'marges'],
    notes: 'Enquete PNF sur GBH. Vie chere = sujet politique n1. Structure oligopolistique inchangee depuis 30 ans.',
  },
  {
    domain: 'sectoriel',
    name: 'Transport Martinique',
    type: 'secteur',
    description: 'Reseau Mozaik (bus CTM), TCSP en construction, vedettes maritimes, taxis collectifs. 180 000 vehicules pour 350K habitants. Congestion FdF-Lamentin chronique.',
    influence_score: 6,
    tags: ['transport', 'tcsp', 'mobilite', 'congestion', 'maritime'],
    notes: 'TCSP = mega-projet CTM. Retards multiples. Vedettes maritimes sous-utilisees.',
  },
  {
    domain: 'sectoriel',
    name: 'Sante Martinique',
    type: 'secteur',
    description: 'CHU Martinique (2 sites), 15 cliniques privees. Desert medical zones rurales. Fuite des medecins. Chlordecone = crise sanitaire (cancer prostate +50%). ARS sous pression.',
    influence_score: 7,
    tags: ['sante', 'chu', 'chlordecone', 'desert-medical', 'ars'],
    notes: 'Chlordecone: contamination sols 90% de la population exposee. Scandale sanitaire national.',
  },
];

// ═══════════════════════════════════════════════════════
// KEY COMPANIES / INTEL TARGETS (5)
// ═══════════════════════════════════════════════════════

const keyCompanies = [
  {
    domain: 'economique',
    name: 'GBH — Cible Intel',
    type: 'entreprise-cible',
    description: 'Groupe Bernard Hayot. CA 5+ Md EUR, 18 000 salaries. Distribution (Carrefour), automobile, rhum. Position dominante Martinique/DOM. Enquete PNF 2025.',
    influence_score: 10,
    tags: ['gbh', 'cible', 'distribution', 'monopole', 'pnf'],
    notes: 'Surveiller: resultats enquete PNF, reaction marche, communication de crise. Premier compte 2025 publie.',
  },
  {
    domain: 'economique',
    name: 'Digicel Martinique',
    type: 'entreprise-cible',
    description: 'Operateur telecom caribeen. Presence Martinique en mobile et fixe. Concurrent Orange/SFR. Groupe en restructuration financiere (dette 7Md USD).',
    influence_score: 6,
    tags: ['telecom', 'mobile', 'caraibe', 'dette'],
    notes: 'Risque de retrait du marche. Restructuration Denis O\'Brien. Surveiller perennite.',
  },
  {
    domain: 'economique',
    name: 'Orange Martinique',
    type: 'entreprise-cible',
    description: 'Premier operateur fixe+mobile Martinique. Deploiement fibre FTTH 85%. Infrastructure critique. Partenariats CTM sur numerique.',
    influence_score: 7,
    tags: ['telecom', 'fibre', 'infrastructure', 'orange'],
    notes: 'Partenaire potentiel BYSS GROUP sur projets numeriques territoriaux.',
  },
  {
    domain: 'economique',
    name: 'Grand Port Maritime de Martinique',
    type: 'entreprise-cible',
    description: 'Port de Fort-de-France. 3.18M tonnes/an. 95% des imports passent par le port. 200+ emplois directs. Projet extension terminal croisiere.',
    influence_score: 8,
    tags: ['port', 'maritime', 'import', 'croisiere', 'infrastructure'],
    notes: 'Goulot d\'etranglement strategique. Qui controle le port controle l\'approvisionnement.',
  },
  {
    domain: 'economique',
    name: 'Aeroport Aime Cesaire',
    type: 'entreprise-cible',
    description: 'Aeroport international Le Lamentin. 2.1M passagers/an. Air France, Air Caraibes, Corsair, American Airlines. Liaison Miami directe.',
    influence_score: 7,
    tags: ['aeroport', 'aviation', 'tourisme', 'cesaire', 'lamentin'],
    notes: 'Concession SAMAC (GBH actionnaire). Capacite saturee en haute saison.',
  },
];

// ═══════════════════════════════════════════════════════
// DEMOGRAPHICS (3)
// ═══════════════════════════════════════════════════════

const demographics = [
  {
    domain: 'demographique',
    name: 'Population Martinique',
    type: 'indicateur-demographique',
    description: 'Population 350 000 habitants (2025). Decroissance -0.8%/an depuis 2010. Projection 300K en 2035. Exode jeunes 18-30 ans vers metropole.',
    influence_score: 9,
    tags: ['population', 'decroissance', 'exode', 'vieillissement'],
    notes: 'Perte 5 000 habitants/an. Si tendance continue: 250K en 2045. Urgence demographique absolue.',
  },
  {
    domain: 'demographique',
    name: 'Diaspora martiniquaise',
    type: 'indicateur-demographique',
    description: '400 000+ Martiniquais en metropole (IDF, Bordeaux, Toulouse, Lyon). Plus nombreux que la population locale. Associations, vote, transferts financiers.',
    influence_score: 8,
    tags: ['diaspora', 'metropole', 'idf', 'vote', 'transferts'],
    notes: 'Marche inexploite pour BYSS. La diaspora vote, achete, investit. 150K en IDF seul.',
  },
  {
    domain: 'demographique',
    name: 'Vieillissement Martinique',
    type: 'indicateur-demographique',
    description: 'Age median 47 ans (vs 41 en metro). 25% de 60+ ans. Martinique = departement le plus vieux de France. Dependance, silver economy, EHPAD satures.',
    influence_score: 7,
    tags: ['vieillissement', 'age-median', 'silver-economy', 'dependance'],
    notes: 'Silver economy = opportunite. Telemedecine, aide a domicile, services numeriques seniors.',
  },
];

// ═══════════════════════════════════════════════════════
// BYSS TARGETS / INSTITUTIONS (5)
// ═══════════════════════════════════════════════════════

const byssTargets = [
  {
    domain: 'institutionnelle',
    name: 'CCI Martinique — Cible BYSS',
    type: 'institution-cible',
    description: 'Chambre de Commerce et d\'Industrie. 15 000 entreprises immatriculees. Budget 12M EUR. Programmes: creation entreprise, export, numerique. Interlocuteur PME/TPE obligatoire.',
    influence_score: 7,
    tags: ['cci', 'cible-byss', 'pme', 'numerique', 'export'],
    notes: 'BYSS doit etre dans le radar CCI. Programmes numeriques = porte d\'entree. President a identifier.',
  },
  {
    domain: 'institutionnelle',
    name: 'MEDEF Martinique — Cible BYSS',
    type: 'institution-cible',
    description: 'Patronat martiniquais. 300+ entreprises adherentes. Lobbying fiscal, emploi, competitivite. Interlocuteur pouvoir public sur economie.',
    influence_score: 6,
    tags: ['medef', 'cible-byss', 'patronat', 'lobbying', 'entreprises'],
    notes: 'Reseau de dirigeants. Evenements = occasions de contact. Position sur vie chere ambigue.',
  },
  {
    domain: 'institutionnelle',
    name: 'IEDOM Martinique — Source Intel',
    type: 'institution-cible',
    description: 'Institut d\'Emission des DOM. Banque de France locale. Rapports trimestriels conjoncture, indicateurs credit, statistiques bancaires. Source de donnees economiques la plus fiable.',
    influence_score: 7,
    tags: ['iedom', 'cible-byss', 'donnees', 'conjoncture', 'banque-de-france'],
    notes: 'Rapports publics = mine d\'or pour intelligence economique. Scraper les publications.',
  },
  {
    domain: 'institutionnelle',
    name: 'CTM Budget et Marches — Cible BYSS',
    type: 'institution-cible',
    description: 'Budget CTM 1.3 Md EUR (2025). Marches publics: numerique, communication, formation, BTP. Appels d\'offres BOAMP + profil acheteur CTM.',
    influence_score: 9,
    tags: ['ctm', 'cible-byss', 'marches-publics', 'budget', 'appels-offres'],
    notes: 'Objectif BYSS: remporter un marche CTM numerique/IA d\'ici 2027. Surveiller BOAMP quotidiennement.',
  },
  {
    domain: 'institutionnelle',
    name: 'Prefecture SGAR Martinique — Cible BYSS',
    type: 'institution-cible',
    description: 'Prefecture + Secretariat General aux Affaires Regionales. Pilotage fonds europeens (FEDER, FSE), contrat de plan Etat-Region, programmes France 2030.',
    influence_score: 8,
    tags: ['prefecture', 'sgar', 'cible-byss', 'fonds-europeens', 'france-2030'],
    notes: 'SGAR distribue les fonds europeens. France 2030 = subventions innovation. BYSS eligible potentiellement.',
  },
];

// ═══════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════

function prepareEntities(entries) {
  return entries.map((e) => ({
    domain: e.domain,
    name: e.name,
    type: e.type,
    description: e.description || null,
    influence_score: e.influence_score ?? 0,
    contacts: JSON.stringify([]),
    relationships: JSON.stringify(e.relationships || []),
    notes: e.notes || null,
    tags: e.tags || [],
  }));
}

async function seed() {
  const allEntities = prepareEntities([
    ...economicIndicators,
    ...keySectors,
    ...keyCompanies,
    ...demographics,
    ...byssTargets,
  ]);

  console.log(`\n[seed-martinique-data] ${allEntities.length} entities to INSERT across multiple domains\n`);

  // ── Summary by domain ──
  const domainStats = {};
  const typeStats = {};
  for (const e of allEntities) {
    domainStats[e.domain] = (domainStats[e.domain] || 0) + 1;
    typeStats[e.type] = (typeStats[e.type] || 0) + 1;
  }

  console.log('=== BREAKDOWN BY DOMAIN ===');
  for (const [domain, count] of Object.entries(domainStats)) {
    console.log(`  ${domain}: ${count}`);
  }

  console.log('\n=== BREAKDOWN BY TYPE ===');
  for (const [type, count] of Object.entries(typeStats)) {
    console.log(`  ${type}: ${count}`);
  }
  console.log('');

  // ── Insert (NOT upsert) in batches of 15 ──
  const batchSize = 15;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < allEntities.length; i += batchSize) {
    const batch = allEntities.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    const { data, error } = await supabase
      .from('intel_entities')
      .insert(batch);

    if (error) {
      console.error(`[batch ${batchNum}] ERROR: ${error.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
      console.log(`[batch ${batchNum}] OK — ${batch.length} entities inserted`);
    }
  }

  console.log(`\n[seed-martinique-data] DONE — ${inserted} inserted, ${errors} errors\n`);

  // ── Verify final counts ──
  console.log('=== FINAL TABLE COUNTS ===');

  const { count: intelCount, error: intelErr } = await supabase
    .from('intel_entities')
    .select('*', { count: 'exact', head: true });

  if (intelErr) {
    console.error('  intel_entities count error:', intelErr.message);
  } else {
    console.log(`  intel_entities: ${intelCount} total rows`);
  }

  const { count: contactsCount, error: contactsErr } = await supabase
    .from('contacts_directory')
    .select('*', { count: 'exact', head: true });

  if (contactsErr) {
    console.error('  contacts_directory count error:', contactsErr.message);
  } else {
    console.log(`  contacts_directory: ${contactsCount} total rows`);
  }

  // ── Domain breakdown in DB ──
  console.log('\n=== INTEL_ENTITIES BY DOMAIN (in DB) ===');
  const { data: domainData, error: domainErr } = await supabase
    .from('intel_entities')
    .select('domain');

  if (domainErr) {
    console.error('  domain query error:', domainErr.message);
  } else {
    const dbDomains = {};
    for (const row of domainData) {
      dbDomains[row.domain] = (dbDomains[row.domain] || 0) + 1;
    }
    for (const [domain, count] of Object.entries(dbDomains).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${domain}: ${count}`);
    }
  }

  console.log('');
}

seed().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
