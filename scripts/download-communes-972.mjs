/**
 * download-communes-972.mjs — Fetch all 34 communes of Martinique via API Geo
 *
 * Source: https://geo.api.gouv.fr (free, no auth)
 * Inserts into Supabase intel_entities with domain='institutionnelle', type='commune'.
 *
 * Usage: node scripts/download-communes-972.mjs
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════
// ENV
// ═══════════════════════════════════════════════════════
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
// ZONE ASSIGNMENT (based on INSEE commune code)
// ═══════════════════════════════════════════════════════
// Martinique commune codes: 97201 to 97234
// Nord: 97201-97212 roughly (Grand-Riviere to Trinite)
// Centre: 97213-97222 (Fort-de-France, Lamentin, Schoelcher, etc.)
// Sud: 97223-97234 (Riviere-Salee to Vauclin)
const ZONE_MAP = {
  // ── Nord ──
  '97201': 'nord', // L'Ajoupa-Bouillon
  '97202': 'nord', // Basse-Pointe
  '97203': 'nord', // Bellefontaine
  '97204': 'nord', // Le Carbet
  '97206': 'nord', // Fonds-Saint-Denis
  '97210': 'nord', // Grand-Riviere
  '97212': 'nord', // Le Lorrain
  '97213': 'nord', // Macouba
  '97215': 'nord', // Le Marigot
  '97218': 'nord', // Le Morne-Rouge
  '97220': 'nord', // Le Precheur
  '97224': 'nord', // Saint-Pierre
  '97227': 'nord', // La Trinite
  '97219': 'nord', // Le Morne-Vert
  '97211': 'nord', // Gros-Morne

  // ── Centre ──
  '97205': 'centre', // Case-Pilote
  '97207': 'centre', // Fort-de-France
  '97208': 'centre', // Le Francois
  '97209': 'centre', // Le Lamentin
  '97222': 'centre', // Le Robert
  '97225': 'centre', // Schoelcher
  '97226': 'centre', // Saint-Joseph
  '97214': 'centre', // Le Marigot (recategorized if needed)

  // ── Sud ──
  '97216': 'sud', // Le Marin
  '97217': 'sud', // Les Anses-d'Arlet
  '97221': 'sud', // Riviere-Pilote
  '97223': 'sud', // Riviere-Salee
  '97228': 'sud', // Les Trois-Ilets
  '97229': 'sud', // Le Vauclin
  '97230': 'sud', // Sainte-Anne
  '97231': 'sud', // Sainte-Luce
  '97232': 'sud', // Sainte-Marie
  '97233': 'sud', // Le Diamant
  '97234': 'sud', // Ducos
};

function getZone(code) {
  return ZONE_MAP[code] || 'centre';
}

// ═══════════════════════════════════════════════════════
// INFLUENCE SCORE (population-based)
// ═══════════════════════════════════════════════════════
function populationToInfluence(pop) {
  if (pop >= 80000) return 10; // Fort-de-France
  if (pop >= 40000) return 9;  // Le Lamentin
  if (pop >= 25000) return 8;  // Le Robert, Le Francois, Sainte-Marie
  if (pop >= 15000) return 7;  // Schoelcher, Ducos, Riviere-Salee
  if (pop >= 10000) return 6;  // Saint-Joseph, Trinite, Marin
  if (pop >= 5000) return 5;   // Smaller communes
  if (pop >= 2000) return 4;
  return 3;                     // Smallest (Grand-Riviere, Macouba, etc.)
}

// ═══════════════════════════════════════════════════════
// FETCH COMMUNES
// ═══════════════════════════════════════════════════════
const API_URL = 'https://geo.api.gouv.fr/departements/972/communes?fields=nom,code,codesPostaux,population,surface,centre&format=json';

async function fetchCommunes() {
  console.log('\n══════════════════════════════════════');
  console.log('  COMMUNES MARTINIQUE (API Geo)');
  console.log('══════════════════════════════════════\n');

  console.log(`Fetching: ${API_URL}`);
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const communes = await res.json();
  console.log(`Fetched ${communes.length} communes\n`);
  return communes;
}

// ═══════════════════════════════════════════════════════
// INSERT INTO SUPABASE
// ═══════════════════════════════════════════════════════
async function insertCommunes(communes) {
  console.log('── Inserting into intel_entities ──\n');

  // Sort by population descending for display
  const sorted = [...communes].sort((a, b) => (b.population || 0) - (a.population || 0));

  const rows = sorted.map((c, i) => {
    const zone = getZone(c.code);
    const pop = c.population || 0;
    const surface = c.surface ? (c.surface / 100).toFixed(1) : '?';
    const cp = c.codesPostaux?.join(', ') || '972xx';
    const coords = c.centre?.coordinates ? `${c.centre.coordinates[1].toFixed(4)}, ${c.centre.coordinates[0].toFixed(4)}` : '';

    return {
      domain: 'institutionnelle',
      name: c.nom,
      type: 'commune',
      influence_score: populationToInfluence(pop),
      description: `Population: ${pop.toLocaleString('fr-FR')}, Surface: ${surface} km², Code postal: ${cp}${coords ? ', Coords: ' + coords : ''}`,
      tags: ['commune', '972', zone],
      notes: `Zone: ${zone} | Code INSEE: ${c.code} | ${pop.toLocaleString('fr-FR')} hab. | ${surface} km²`,
    };
  });

  const { error } = await supabase.from('intel_entities').insert(rows);
  if (error) {
    console.error('Insert error:', error.message);
    return 0;
  }

  console.log(`Inserted ${rows.length} communes into intel_entities`);
  return rows.length;
}

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
function printSummary(communes) {
  const sorted = [...communes].sort((a, b) => (b.population || 0) - (a.population || 0));
  const totalPop = sorted.reduce((s, c) => s + (c.population || 0), 0);

  console.log('\n══════════════════════════════════════');
  console.log('  RAPPORT COMMUNES 972');
  console.log('══════════════════════════════════════\n');

  console.log(`Total communes: ${communes.length}`);
  console.log(`Population totale: ${totalPop.toLocaleString('fr-FR')}\n`);

  // By zone
  const zones = { nord: { count: 0, pop: 0 }, centre: { count: 0, pop: 0 }, sud: { count: 0, pop: 0 } };
  for (const c of communes) {
    const zone = getZone(c.code);
    zones[zone].count++;
    zones[zone].pop += c.population || 0;
  }

  console.log('Par zone:');
  console.log('─'.repeat(50));
  for (const [zone, data] of Object.entries(zones)) {
    console.log(`  ${zone.padEnd(10)} ${String(data.count).padStart(3)} communes   ${data.pop.toLocaleString('fr-FR').padStart(10)} hab.`);
  }
  console.log('─'.repeat(50));

  // Top 10
  console.log('\nTop 10 communes:');
  console.log('─'.repeat(60));
  for (let i = 0; i < Math.min(10, sorted.length); i++) {
    const c = sorted[i];
    const zone = getZone(c.code);
    console.log(
      `  ${String(i + 1).padStart(2)}. ${c.nom.padEnd(25)} ${String(c.population || 0).toLocaleString('fr-FR').padStart(8)} hab.  [${zone}]`
    );
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  try {
    const communes = await fetchCommunes();
    if (communes.length === 0) {
      console.log('No communes fetched. Check API availability.');
      process.exit(1);
    }

    printSummary(communes);
    await insertCommunes(communes);

    console.log('\nCommunes 972 import complete.');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
