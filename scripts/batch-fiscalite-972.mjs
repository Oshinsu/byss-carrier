/**
 * batch-fiscalite-972.mjs — Download fiscalite locale data for Martinique (972)
 *
 * Dataset: REI elements d'imposition (6657c57abbefc8869c7c6364)
 * Extracts: commune, taxe fonciere bati, taxe fonciere non bati, CFE, taux
 *
 * Usage: node scripts/batch-fiscalite-972.mjs
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

const DATASET_ID = '6657c57abbefc8869c7c6364';

// ═══════════════════════════════════════════════════════
// CSV PARSER
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

function findColumn(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex(h => h.includes(c.toLowerCase()));
    if (idx >= 0) return headers[idx].trim();
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// FETCH DATASET METADATA
// ═══════════════════════════════════════════════════════
async function getCSVUrl(datasetId) {
  const url = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/`;
  console.log(`  Fetching metadata: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Metadata fetch failed: ${res.status}`);
  const data = await res.json();

  const csvResource = data.resources?.find(r =>
    r.format?.toLowerCase() === 'csv' ||
    r.url?.endsWith('.csv') ||
    r.mime?.includes('csv')
  );
  return csvResource?.url || data.resources?.[0]?.url;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  BATCH FISCALITE 972 — Martinique     ║');
  console.log('╚══════════════════════════════════════╝');

  // 1. Get CSV URL
  const csvUrl = await getCSVUrl(DATASET_ID);
  if (!csvUrl) { console.error('No CSV URL found!'); return; }
  console.log(`  CSV URL: ${csvUrl}`);

  // 2. Download
  console.log('  Downloading CSV...');
  const csvRes = await fetch(csvUrl);
  if (!csvRes.ok) throw new Error(`CSV download failed: ${csvRes.status}`);
  const csvText = await csvRes.text();
  console.log(`  Downloaded ${(csvText.length / 1024).toFixed(0)} KB`);

  // 3. Detect delimiter
  const firstLine = csvText.split('\n')[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  // 4. Parse
  const allRows = parseCSV(csvText, delimiter);
  console.log(`  Total rows: ${allRows.length}`);
  if (allRows.length === 0) { console.error('No data parsed!'); return; }

  const headers = Object.keys(allRows[0]);
  console.log(`  Columns: ${headers.join(', ')}`);

  // 5. Detect columns
  const colDept = findColumn(headers, ['dep', 'departement', 'code_dep', 'code departement']);
  const colCommune = findColumn(headers, ['libelle', 'commune', 'lib_commune', 'nom_commune']);
  const colCodeCommune = findColumn(headers, ['code commune', 'com', 'code_commune', 'codgeo']);
  const colTFB = findColumn(headers, ['tf bati', 'taxe fonciere bati', 'tfb', 'tf_bati', 'produit_tf_bati']);
  const colTFNB = findColumn(headers, ['tf non bati', 'taxe fonciere non bati', 'tfnb', 'tf_non_bati', 'produit_tf_non_bati']);
  const colCFE = findColumn(headers, ['cfe', 'cotisation fonciere']);
  const colTauxTFB = findColumn(headers, ['taux tf bati', 'taux_tf_bati', 'taux tfb']);
  const colTauxTFNB = findColumn(headers, ['taux tf non bati', 'taux_tf_non_bati', 'taux tfnb']);
  const colTauxCFE = findColumn(headers, ['taux cfe', 'taux_cfe']);
  const colTH = findColumn(headers, ['th', 'taxe habitation', 'taxe_habitation']);

  console.log(`  Dept: ${colDept}, Commune: ${colCommune}, Code: ${colCodeCommune}`);
  console.log(`  TFB: ${colTFB}, TFNB: ${colTFNB}, CFE: ${colCFE}`);

  // 6. Filter to 972
  let martinique = allRows.filter(r => {
    const dept = (r[colDept] || '').trim();
    if (dept === '972') return true;
    // Try code commune starting with 972
    if (colCodeCommune) {
      const cc = (r[colCodeCommune] || '').trim();
      if (cc.startsWith('972')) return true;
    }
    return false;
  });

  if (martinique.length === 0) {
    // Brute force: find any row with 972
    martinique = allRows.filter(r => Object.values(r).some(v => String(v).includes('972')));
  }

  console.log(`  Martinique rows: ${martinique.length}`);

  if (martinique.length === 0) {
    console.log('  No Martinique data found. Dataset may use different structure.');
    console.log('  First row sample:', JSON.stringify(allRows[0], null, 2));
    return;
  }

  // 7. Build entities
  const entities = martinique.map(row => {
    const commune = row[colCommune] || row[colCodeCommune] || 'Inconnue';
    const tfb = row[colTFB] || '';
    const tfnb = row[colTFNB] || '';
    const cfe = row[colCFE] || '';
    const tauxTfb = row[colTauxTFB] || '';
    const tauxTfnb = row[colTauxTFNB] || '';
    const tauxCfe = row[colTauxCFE] || '';
    const th = row[colTH] || '';

    const parts = [];
    if (tfb) parts.push(`TF Bati: ${tfb}`);
    if (tfnb) parts.push(`TF Non-Bati: ${tfnb}`);
    if (cfe) parts.push(`CFE: ${cfe}`);
    if (th) parts.push(`TH: ${th}`);
    if (tauxTfb) parts.push(`Taux TFB: ${tauxTfb}%`);
    if (tauxTfnb) parts.push(`Taux TFNB: ${tauxTfnb}%`);
    if (tauxCfe) parts.push(`Taux CFE: ${tauxCfe}%`);

    return {
      name: `Fiscalite — ${commune}`,
      type: 'fiscalite',
      domain: 'economique',
      influence_score: 0,
      description: `Fiscalite locale ${commune} (972) | ${parts.join(' | ')}`,
      tags: ['fiscalite', 'impots-locaux', commune.toLowerCase(), '972'],
      contacts: null,
      notes: JSON.stringify({
        commune,
        tf_bati: tfb,
        tf_non_bati: tfnb,
        cfe,
        th,
        taux_tfb: tauxTfb,
        taux_tfnb: tauxTfnb,
        taux_cfe: tauxCfe,
        raw: row,
      }),
    };
  });

  console.log(`  Entities to insert: ${entities.length}`);

  // 8. Insert
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < entities.length; i += BATCH) {
    const batch = entities.slice(i, i + BATCH);
    const { error } = await supabase.from('intel_entities').insert(batch);
    if (error) {
      console.error(`  Batch error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${entities.length}`);
    }
  }

  console.log(`\nDone. ${inserted} fiscal entries inserted for Martinique.`);
}

main().catch(console.error);
