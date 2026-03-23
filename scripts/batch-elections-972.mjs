/**
 * batch-elections-972.mjs — Download presidential election results 2022 for Martinique (972)
 *
 * Fetches CSV data from data.gouv.fr for:
 *   - Presidentielle 2022 Tour 1 (dataset 62581fdf02e05e365ea227a1)
 *   - Presidentielle 2022 Tour 2 (dataset 626a86215fb310e32b48b137)
 *
 * Filters to department 972 (Martinique), parses results, inserts into Supabase intel_entities.
 *
 * Usage: node scripts/batch-elections-972.mjs
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
// DATASET IDs
// ═══════════════════════════════════════════════════════
const DATASETS = [
  { id: '62581fdf02e05e365ea227a1', tour: 1, label: 'Presidentielle 2022 Tour 1' },
  { id: '626a86215fb310e32b48b137', tour: 2, label: 'Presidentielle 2022 Tour 2' },
];

// ═══════════════════════════════════════════════════════
// CSV PARSER (simple, handles quoted fields)
// ═══════════════════════════════════════════════════════
function parseCSV(text, delimiter = ';') {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0], delimiter);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function parseCSVLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === delimiter && !inQuotes) { result.push(current); current = ''; continue; }
    current += ch;
  }
  result.push(current);
  return result;
}

// ═══════════════════════════════════════════════════════
// FETCH DATASET METADATA → get CSV resource URL
// ═══════════════════════════════════════════════════════
async function getCSVUrl(datasetId) {
  const url = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/`;
  console.log(`  Fetching metadata: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Metadata fetch failed: ${res.status}`);
  const data = await res.json();

  // Find the CSV resource
  const csvResource = data.resources?.find(r =>
    r.format?.toLowerCase() === 'csv' ||
    r.url?.endsWith('.csv') ||
    r.mime?.includes('csv')
  );

  if (!csvResource) {
    // Fallback: try first resource
    console.log('  No explicit CSV found, trying first resource...');
    return data.resources?.[0]?.url;
  }
  return csvResource.url;
}

// ═══════════════════════════════════════════════════════
// DETECT COLUMN NAMES (they vary between datasets)
// ═══════════════════════════════════════════════════════
function findColumn(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c.toLowerCase()));
    if (idx >= 0) return headers[idx].trim();
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// PROCESS ONE DATASET
// ═══════════════════════════════════════════════════════
async function processDataset({ id, tour, label }) {
  console.log(`\n══════════════════════════════════════`);
  console.log(`  ${label}`);
  console.log(`══════════════════════════════════════`);

  // 1. Get CSV URL from dataset metadata
  const csvUrl = await getCSVUrl(id);
  if (!csvUrl) { console.error('  No CSV URL found!'); return []; }
  console.log(`  CSV URL: ${csvUrl}`);

  // 2. Download CSV
  console.log('  Downloading CSV...');
  const csvRes = await fetch(csvUrl);
  if (!csvRes.ok) throw new Error(`CSV download failed: ${csvRes.status}`);
  const csvText = await csvRes.text();
  console.log(`  Downloaded ${(csvText.length / 1024).toFixed(0)} KB`);

  // 3. Detect delimiter (try ; then ,)
  const firstLine = csvText.split('\n')[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';
  console.log(`  Delimiter: "${delimiter}"`);

  // 4. Parse
  const allRows = parseCSV(csvText, delimiter);
  console.log(`  Total rows: ${allRows.length}`);

  if (allRows.length === 0) { console.error('  No data parsed!'); return []; }

  // 5. Detect column names
  const headers = Object.keys(allRows[0]);
  console.log(`  Columns: ${headers.join(', ')}`);

  const colDept = findColumn(headers, ['code du departement', 'code_departement', 'dep', 'departement']);
  const colCommune = findColumn(headers, ['libelle de la commune', 'lib_commune', 'commune']);
  const colInscrits = findColumn(headers, ['inscrits']);
  const colVotants = findColumn(headers, ['votants']);
  const colAbstentions = findColumn(headers, ['abstentions']);
  const colBureau = findColumn(headers, ['code du b.vote', 'bureau', 'bv']);
  const colCandidat = findColumn(headers, ['nom', 'candidat']);
  const colPrenom = findColumn(headers, ['prenom', 'prenom']);
  const colVoix = findColumn(headers, ['voix']);
  const colPct = findColumn(headers, ['% voix/ins', '% voix/exp', 'pct']);

  console.log(`  Dept col: ${colDept}, Commune col: ${colCommune}`);

  // 6. Filter to 972
  const martinique = allRows.filter(r => {
    const dept = (r[colDept] || '').trim();
    return dept === '972' || dept === '9A' || dept === 'ZA';
  });
  console.log(`  Martinique rows: ${martinique.length}`);

  if (martinique.length === 0) {
    console.log('  Trying alternate filter (first 3 chars of code commune)...');
    const byCodeCommune = allRows.filter(r => {
      const cc = Object.values(r).find(v => typeof v === 'string' && v.startsWith('972'));
      return !!cc;
    });
    console.log(`  Alternate filter: ${byCodeCommune.length} rows`);
    if (byCodeCommune.length > 0) martinique.push(...byCodeCommune);
  }

  // 7. Build entities for insertion
  const entities = [];
  const communeAgg = {};

  for (const row of martinique) {
    const commune = row[colCommune] || 'Inconnue';
    const candidat = [row[colPrenom], row[colCandidat]].filter(Boolean).join(' ');
    const voix = parseInt(row[colVoix]) || 0;
    const pct = row[colPct] || '';
    const inscrits = parseInt(row[colInscrits]) || 0;
    const votants = parseInt(row[colVotants]) || 0;
    const abstentions = parseInt(row[colAbstentions]) || 0;
    const bureau = row[colBureau] || '';

    // Aggregate per commune + candidat
    const key = `${commune}|${candidat}`;
    if (!communeAgg[key]) {
      communeAgg[key] = { commune, candidat, voix: 0, inscrits: 0, votants: 0, abstentions: 0, bureaux: 0 };
    }
    communeAgg[key].voix += voix;
    communeAgg[key].inscrits += inscrits;
    communeAgg[key].votants += votants;
    communeAgg[key].abstentions += abstentions;
    communeAgg[key].bureaux += 1;
  }

  for (const [, agg] of Object.entries(communeAgg)) {
    const pctCalc = agg.inscrits > 0 ? ((agg.voix / agg.inscrits) * 100).toFixed(2) : '0';
    entities.push({
      name: `${agg.candidat} — ${agg.commune}`,
      type: 'election',
      domain: 'politique',
      influence_score: Math.min(10, Math.round((agg.voix / Math.max(agg.inscrits, 1)) * 20)),
      description: `Presidentielle 2022 Tour ${tour} | ${agg.commune} | ${agg.candidat} | ${agg.voix} voix (${pctCalc}% inscrits) | ${agg.votants} votants / ${agg.inscrits} inscrits | ${agg.abstentions} abstentions | ${agg.bureaux} bureaux`,
      tags: ['election', `tour-${tour}`, 'presidentielle-2022', agg.commune.toLowerCase(), '972'],
      contacts: null,
      notes: JSON.stringify({
        tour,
        commune: agg.commune,
        candidat: agg.candidat,
        voix: agg.voix,
        inscrits: agg.inscrits,
        votants: agg.votants,
        abstentions: agg.abstentions,
        pct_inscrits: pctCalc,
        bureaux: agg.bureaux,
      }),
    });
  }

  console.log(`  Aggregated entities: ${entities.length}`);
  return entities;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  BATCH ELECTIONS 972 — Martinique     ║');
  console.log('╚══════════════════════════════════════╝');

  let allEntities = [];

  for (const ds of DATASETS) {
    try {
      const ents = await processDataset(ds);
      allEntities.push(...ents);
    } catch (err) {
      console.error(`  ERROR processing ${ds.label}:`, err.message);
    }
  }

  if (allEntities.length === 0) {
    console.log('\nNo entities to insert. Check CSV format.');
    return;
  }

  // Insert in batches of 50
  console.log(`\nInserting ${allEntities.length} entities into intel_entities...`);
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < allEntities.length; i += BATCH) {
    const batch = allEntities.slice(i, i + BATCH);
    const { error } = await supabase.from('intel_entities').insert(batch);
    if (error) {
      console.error(`  Batch ${i}-${i + batch.length} error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${allEntities.length}`);
    }
  }

  console.log(`\nDone. ${inserted} election results inserted for Martinique.`);
}

main().catch(console.error);
