/**
 * download-sirene-972.mjs — Fetch ALL active companies in Martinique (972) via SIRENE API
 *
 * Source: https://recherche-entreprises.api.gouv.fr (free, no auth)
 * Rate limit: 7 req/s max — we use 150ms delay between requests.
 *
 * Paginates through all results, groups by NAF sector,
 * inserts top 200 companies (by workforce) into Supabase contacts_directory.
 *
 * Usage: node scripts/download-sirene-972.mjs
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
// NAF → SECTOR MAPPING (inline for standalone script)
// ═══════════════════════════════════════════════════════
const NAF_TO_SECTOR = {
  '55.10Z': 'Hotellerie', '55.20Z': 'Hotellerie', '55.30Z': 'Hotellerie',
  '56.10A': 'Restauration', '56.10B': 'Restauration', '56.10C': 'Restauration',
  '56.21Z': 'Restauration', '56.29A': 'Restauration', '56.29B': 'Restauration', '56.30Z': 'Restauration',
  '11.01Z': 'Distillerie', '11.02A': 'Distillerie', '11.02B': 'Distillerie',
  '11.03Z': 'Distillerie', '11.04Z': 'Distillerie', '11.05Z': 'Distillerie',
  '61.10Z': 'Telecom', '61.20Z': 'Telecom', '61.30Z': 'Telecom', '61.90Z': 'Telecom',
  '79.11Z': 'Tourisme', '79.12Z': 'Tourisme', '79.90Z': 'Tourisme',
  '49.31Z': 'Transport', '49.32Z': 'Transport', '49.39A': 'Transport',
  '49.39B': 'Transport', '49.39C': 'Transport', '49.41A': 'Transport', '49.41B': 'Transport',
  '50.10Z': 'Transport Maritime', '50.20Z': 'Transport Maritime', '50.40Z': 'Transport Maritime',
  '47.11A': 'Commerce', '47.11B': 'Commerce', '47.11C': 'Commerce', '47.11D': 'Commerce',
  '47.11E': 'Commerce', '47.11F': 'Commerce', '47.19A': 'Commerce', '47.19B': 'Commerce',
  '68.10Z': 'Immobilier', '68.20A': 'Immobilier', '68.20B': 'Immobilier',
  '68.31Z': 'Immobilier', '68.32A': 'Immobilier', '68.32B': 'Immobilier',
  '41.20A': 'BTP', '41.20B': 'BTP', '42.11Z': 'BTP', '42.12Z': 'BTP',
  '42.21Z': 'BTP', '42.22Z': 'BTP', '43.11Z': 'BTP', '43.12A': 'BTP',
  '43.21A': 'BTP', '43.22A': 'BTP', '43.31Z': 'BTP', '43.32A': 'BTP',
  '43.34Z': 'BTP', '43.39Z': 'BTP', '43.91A': 'BTP', '43.91B': 'BTP',
  '43.99A': 'BTP', '43.99B': 'BTP', '43.99C': 'BTP', '43.99D': 'BTP', '43.99E': 'BTP',
  '62.01Z': 'Tech', '62.02A': 'Tech', '62.02B': 'Tech', '62.03Z': 'Tech',
  '62.09Z': 'Tech', '63.11Z': 'Tech', '63.12Z': 'Tech',
  '58.11Z': 'Media', '59.11A': 'Media', '59.11B': 'Media', '59.14Z': 'Media',
  '60.10Z': 'Media', '60.20A': 'Media', '60.20B': 'Media',
  '73.11Z': 'Media', '73.12Z': 'Media', '74.10Z': 'Media', '74.20Z': 'Media',
  '84.11Z': 'Institutionnel', '84.12Z': 'Institutionnel', '84.13Z': 'Institutionnel',
  '84.21Z': 'Institutionnel', '84.22Z': 'Institutionnel', '84.23Z': 'Institutionnel',
  '86.10Z': 'Sante', '86.21Z': 'Sante', '86.22A': 'Sante', '86.22B': 'Sante',
  '86.23Z': 'Sante', '86.90A': 'Sante', '86.90B': 'Sante',
  '85.10Z': 'Education', '85.20Z': 'Education', '85.31Z': 'Education',
  '85.32Z': 'Education', '85.41Z': 'Education', '85.42Z': 'Education',
  '64.11Z': 'Finance', '64.19Z': 'Finance', '64.20Z': 'Finance',
  '65.11Z': 'Finance', '65.12Z': 'Finance', '65.20Z': 'Finance',
  '01.11Z': 'Agriculture', '01.13Z': 'Agriculture', '01.21Z': 'Agriculture',
  '01.22Z': 'Agriculture', '01.25Z': 'Agriculture', '01.27Z': 'Agriculture',
  '03.11Z': 'Agriculture', '03.12Z': 'Agriculture',
  '35.11Z': 'Energie', '35.14Z': 'Energie', '35.30Z': 'Energie',
};

function nafToSector(naf) {
  if (!naf) return 'Autre';
  return NAF_TO_SECTOR[naf] || 'Autre';
}

// ═══════════════════════════════════════════════════════
// WORKFORCE TRANCHE MAPPING (INSEE codes → estimated headcount)
// ═══════════════════════════════════════════════════════
const TRANCHE_TO_EFFECTIF = {
  '00': 0,      // 0 salarie
  '01': 1,      // 1-2
  '02': 4,      // 3-5
  '03': 8,      // 6-9
  '11': 15,     // 10-19
  '12': 35,     // 20-49
  '21': 75,     // 50-99
  '22': 150,    // 100-199
  '31': 350,    // 200-499
  '32': 750,    // 500-999
  '41': 1500,   // 1000-1999
  '42': 3500,   // 2000-4999
  '51': 7500,   // 5000-9999
  '52': 15000,  // 10000+
};

const TRANCHE_LABELS = {
  '00': '0 salarie',
  '01': '1-2',
  '02': '3-5',
  '03': '6-9',
  '11': '10-19',
  '12': '20-49',
  '21': '50-99',
  '22': '100-199',
  '31': '200-499',
  '32': '500-999',
  '41': '1000-1999',
  '42': '2000-4999',
  '51': '5000-9999',
  '52': '10000+',
};

function trancheToEstimate(code) {
  return TRANCHE_TO_EFFECTIF[code] || 0;
}

// ═══════════════════════════════════════════════════════
// DELAY
// ═══════════════════════════════════════════════════════
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════
// FETCH ALL PAGES
// ═══════════════════════════════════════════════════════
const BASE_URL = 'https://recherche-entreprises.api.gouv.fr/search';

async function fetchAllCompanies() {
  const companies = [];
  let page = 1;
  let totalPages = 1;
  let totalResults = 0;

  console.log('\n══════════════════════════════════════');
  console.log('  SIRENE 972 — Entreprises Martinique');
  console.log('══════════════════════════════════════\n');

  // First request to get total
  const firstUrl = `${BASE_URL}?departement=972&page=1&per_page=25`;
  console.log(`Fetching page 1...`);
  const firstRes = await fetch(firstUrl);
  if (!firstRes.ok) {
    throw new Error(`API error: ${firstRes.status} ${firstRes.statusText}`);
  }
  const firstData = await firstRes.json();
  totalResults = firstData.total_results || 0;
  totalPages = Math.ceil(totalResults / 25);
  console.log(`Total results: ${totalResults} | Pages: ${totalPages}`);

  // Process first page
  for (const r of firstData.results || []) {
    companies.push(extractCompany(r));
  }

  // Paginate through the rest
  for (page = 2; page <= totalPages; page++) {
    await delay(150); // Rate limit: 150ms between requests

    const url = `${BASE_URL}?departement=972&page=${page}&per_page=25`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  Page ${page} failed: ${res.status}`);
        continue;
      }
      const data = await res.json();
      for (const r of data.results || []) {
        companies.push(extractCompany(r));
      }

      if (page % 20 === 0 || page === totalPages) {
        console.log(`  Page ${page}/${totalPages} — ${companies.length} companies collected`);
      }
    } catch (err) {
      console.error(`  Page ${page} error: ${err.message}`);
    }
  }

  console.log(`\nTotal companies fetched: ${companies.length}`);
  return companies;
}

// ═══════════════════════════════════════════════════════
// EXTRACT COMPANY DATA
// ═══════════════════════════════════════════════════════
function extractCompany(result) {
  const siege = result.siege || {};
  return {
    siren: result.siren || '',
    siret: siege.siret || '',
    nom_complet: result.nom_complet || result.nom_raison_sociale || '',
    activite_principale: result.activite_principale || siege.activite_principale || '',
    nature_juridique: result.nature_juridique || '',
    tranche_effectif: result.tranche_effectif_salarie || siege.tranche_effectif_salarie || '00',
    date_creation: result.date_creation || '',
    commune: siege.commune || siege.libelle_commune || '',
    code_postal: siege.code_postal || '',
    nombre_etablissements: result.nombre_etablissements || 1,
    effectif_estimate: trancheToEstimate(result.tranche_effectif_salarie || '00'),
  };
}

// ═══════════════════════════════════════════════════════
// GROUP BY NAF SECTOR
// ═══════════════════════════════════════════════════════
function groupBySector(companies) {
  const sectors = {};
  for (const c of companies) {
    const sector = nafToSector(c.activite_principale);
    if (!sectors[sector]) sectors[sector] = { count: 0, companies: [], totalEffectif: 0 };
    sectors[sector].count++;
    sectors[sector].totalEffectif += c.effectif_estimate;
    sectors[sector].companies.push(c);
  }
  return sectors;
}

// ═══════════════════════════════════════════════════════
// INSERT TOP 200 INTO SUPABASE
// ═══════════════════════════════════════════════════════
async function insertTop200(companies) {
  // Sort by effectif estimate (descending), take top 200
  const sorted = [...companies].sort((a, b) => b.effectif_estimate - a.effectif_estimate);
  const top200 = sorted.slice(0, 200);

  console.log(`\n── Inserting top ${top200.length} companies into contacts_directory ──`);

  const rows = top200.map((c) => ({
    name: c.nom_complet,
    organization: c.nom_complet,
    title: 'Direction',
    sector: nafToSector(c.activite_principale),
    influence_score: Math.min(10, Math.max(1, Math.round(c.effectif_estimate / 50) + 3)),
    tags: ['sirene-972', nafToSector(c.activite_principale).toLowerCase(), c.commune.toLowerCase()].filter(Boolean),
    notes: `Import SIRENE 972 — NAF: ${c.activite_principale}, SIRET: ${c.siret}, Effectif: ${TRANCHE_LABELS[c.tranche_effectif] || 'inconnu'}, Commune: ${c.commune}, CP: ${c.code_postal}, Creation: ${c.date_creation}`,
  }));

  // Insert in batches of 50
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from('contacts_directory').insert(batch);
    if (error) {
      console.error(`  Batch ${Math.floor(i / 50) + 1} error: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`  Inserted batch ${Math.floor(i / 50) + 1}: ${batch.length} contacts (total: ${inserted})`);
    }
  }

  console.log(`\nTotal inserted: ${inserted} contacts`);
  return inserted;
}

// ═══════════════════════════════════════════════════════
// SUMMARY REPORT
// ═══════════════════════════════════════════════════════
function printSummary(companies, sectors) {
  console.log('\n══════════════════════════════════════');
  console.log('  RAPPORT SIRENE 972');
  console.log('══════════════════════════════════════\n');

  console.log(`Total entreprises actives: ${companies.length}`);
  console.log('');

  // Sort sectors by count
  const sorted = Object.entries(sectors).sort((a, b) => b[1].count - a[1].count);
  console.log('Repartition par secteur:');
  console.log('─'.repeat(60));
  console.log(`${'Secteur'.padEnd(25)} ${'Nb'.padStart(6)} ${'Effectif est.'.padStart(15)} ${'%'.padStart(6)}`);
  console.log('─'.repeat(60));

  for (const [sector, data] of sorted) {
    const pct = ((data.count / companies.length) * 100).toFixed(1);
    console.log(
      `${sector.padEnd(25)} ${String(data.count).padStart(6)} ${String(data.totalEffectif).padStart(15)} ${pct.padStart(5)}%`
    );
  }
  console.log('─'.repeat(60));

  // Top 20 companies by workforce
  console.log('\nTop 20 entreprises par effectif:');
  console.log('─'.repeat(80));
  const top20 = [...companies].sort((a, b) => b.effectif_estimate - a.effectif_estimate).slice(0, 20);
  for (let i = 0; i < top20.length; i++) {
    const c = top20[i];
    console.log(
      `  ${String(i + 1).padStart(2)}. ${c.nom_complet.slice(0, 40).padEnd(42)} ${nafToSector(c.activite_principale).padEnd(18)} ~${c.effectif_estimate} sal.`
    );
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  try {
    const companies = await fetchAllCompanies();
    if (companies.length === 0) {
      console.log('No companies fetched. Check API availability.');
      process.exit(1);
    }

    const sectors = groupBySector(companies);
    printSummary(companies, sectors);
    await insertTop200(companies);

    console.log('\nSIRENE 972 import complete.');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
