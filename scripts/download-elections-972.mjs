/**
 * download-elections-972.mjs — Fetch election results for Martinique (972)
 *
 * Strategy:
 *   1. Get dataset metadata from data.gouv.fr
 *   2. Try tabular API first (filtered server-side, fast)
 *   3. Fall back to full CSV download + local filter if tabular unavailable
 *
 * Inserts aggregated results into intel_entities (domain='politique', type='election').
 *
 * Datasets:
 *   - Presidentielle 2022 Tour 1: 62581fdf02e05e365ea227a1
 *   - Presidentielle 2022 Tour 2: 626a86215fb310e32b48b137
 *
 * Usage: node scripts/download-elections-972.mjs
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
// DELAY
// ═══════════════════════════════════════════════════════
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════
// DATASETS
// ═══════════════════════════════════════════════════════
const DATASETS = [
  { id: '62581fdf02e05e365ea227a1', tour: 1, label: 'Presidentielle 2022 Tour 1' },
  { id: '626a86215fb310e32b48b137', tour: 2, label: 'Presidentielle 2022 Tour 2' },
];

// ═══════════════════════════════════════════════════════
// CSV PARSER
// ═══════════════════════════════════════════════════════
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

function parseCSV(text, delimiter = ';') {
  const lines = text.split('\n').filter((l) => l.trim());
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

// ═══════════════════════════════════════════════════════
// FIND COLUMN (fuzzy match)
// ═══════════════════════════════════════════════════════
function findColumn(headers, candidates) {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.findIndex((h) => h.includes(c.toLowerCase()));
    if (idx >= 0) return headers[idx].trim();
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// STRATEGY 1: TABULAR API
// ═══════════════════════════════════════════════════════
async function tryTabularAPI(datasetId) {
  console.log('  Strategy 1: Tabular API...');

  // 1. Get dataset metadata to find resource ID
  const metaUrl = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/`;
  const metaRes = await fetch(metaUrl);
  if (!metaRes.ok) throw new Error(`Metadata ${metaRes.status}`);
  const meta = await metaRes.json();

  const csvResource = meta.resources?.find(
    (r) => r.format?.toLowerCase() === 'csv' || r.url?.endsWith('.csv') || r.mime?.includes('csv')
  );
  if (!csvResource) throw new Error('No CSV resource found');

  const resourceId = csvResource.id;
  console.log(`  Resource ID: ${resourceId}`);

  // 2. Try tabular API with department filter
  const filterQueries = [
    `"Code du département"='972'`,
    `"Code du departement"='972'`,
    `"code_departement"='972'`,
  ];

  for (const where of filterQueries) {
    try {
      const tabUrl = `https://tabular-api.data.gouv.fr/api/resources/${resourceId}/data/?where=${encodeURIComponent(where)}&page_size=100`;
      console.log(`  Trying: ${where}`);
      const res = await fetch(tabUrl);

      if (!res.ok) {
        console.log(`    HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (data.data?.length > 0) {
        console.log(`    Found ${data.data.length} rows (page 1), total: ${data.total || '?'}`);

        let allRows = [...data.data];

        // Paginate
        let nextUrl = data.links?.next;
        let pageNum = 2;
        while (nextUrl) {
          await delay(200);
          const pageRes = await fetch(nextUrl);
          if (!pageRes.ok) break;
          const pageData = await pageRes.json();
          if (!pageData.data?.length) break;
          allRows.push(...pageData.data);
          nextUrl = pageData.links?.next;
          if (pageNum % 5 === 0) console.log(`    Page ${pageNum}: ${allRows.length} rows`);
          pageNum++;
        }

        console.log(`    Total rows via tabular: ${allRows.length}`);
        return allRows;
      }
    } catch (err) {
      console.log(`    Error: ${err.message}`);
    }
    await delay(200);
  }

  return null; // Tabular failed
}

// ═══════════════════════════════════════════════════════
// STRATEGY 2: FULL CSV DOWNLOAD + LOCAL FILTER
// ═══════════════════════════════════════════════════════
async function downloadAndFilterCSV(datasetId) {
  console.log('  Strategy 2: Full CSV download...');

  const metaUrl = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/`;
  const metaRes = await fetch(metaUrl);
  if (!metaRes.ok) throw new Error(`Metadata ${metaRes.status}`);
  const meta = await metaRes.json();

  const csvResource = meta.resources?.find(
    (r) => r.format?.toLowerCase() === 'csv' || r.url?.endsWith('.csv')
  );
  if (!csvResource) throw new Error('No CSV resource');

  console.log(`  Downloading: ${csvResource.url}`);
  const csvRes = await fetch(csvResource.url);
  if (!csvRes.ok) throw new Error(`CSV download ${csvRes.status}`);
  const csvText = await csvRes.text();
  console.log(`  Downloaded ${(csvText.length / 1024 / 1024).toFixed(1)} MB`);

  const firstLine = csvText.split('\n')[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';
  const allRows = parseCSV(csvText, delimiter);
  console.log(`  Parsed ${allRows.length} rows`);

  if (allRows.length === 0) return [];

  const headers = Object.keys(allRows[0]);
  const colDept = findColumn(headers, ['code du departement', 'code_departement', 'dep', 'departement']);

  const filtered = allRows.filter((r) => {
    const dept = (r[colDept] || '').trim();
    return dept === '972' || dept === '9A' || dept === 'ZA';
  });

  console.log(`  Filtered to ${filtered.length} Martinique rows (col: ${colDept})`);

  // If primary filter failed, try finding any field starting with 972
  if (filtered.length === 0) {
    const alt = allRows.filter((r) =>
      Object.values(r).some((v) => typeof v === 'string' && v.startsWith('972'))
    );
    console.log(`  Alternate filter: ${alt.length} rows`);
    return alt;
  }

  return filtered;
}

// ═══════════════════════════════════════════════════════
// PROCESS ONE DATASET
// ═══════════════════════════════════════════════════════
async function processDataset({ id, tour, label }) {
  console.log(`\n══════════════════════════════════════`);
  console.log(`  ${label}`);
  console.log('══════════════════════════════════════');

  let rows;

  // Try tabular first
  try {
    rows = await tryTabularAPI(id);
  } catch (err) {
    console.log(`  Tabular API failed: ${err.message}`);
  }

  // Fall back to CSV
  if (!rows || rows.length === 0) {
    try {
      rows = await downloadAndFilterCSV(id);
    } catch (err) {
      console.error(`  CSV download failed: ${err.message}`);
      return [];
    }
  }

  if (!rows || rows.length === 0) {
    console.log('  No data found for Martinique');
    return [];
  }

  // Detect columns
  const headers = Object.keys(rows[0]);
  const colCommune = findColumn(headers, ['libelle de la commune', 'lib_commune', 'commune', 'libelle_commune']);
  const colCandidat = findColumn(headers, ['nom', 'candidat']);
  const colPrenom = findColumn(headers, ['prenom']);
  const colVoix = findColumn(headers, ['voix']);
  const colInscrits = findColumn(headers, ['inscrits']);
  const colVotants = findColumn(headers, ['votants']);
  const colAbstentions = findColumn(headers, ['abstentions']);

  // Aggregate per commune + candidat
  const communeAgg = {};
  for (const row of rows) {
    const commune = row[colCommune] || 'Inconnue';
    const candidat = [row[colPrenom], row[colCandidat]].filter(Boolean).join(' ');
    const voix = parseInt(row[colVoix]) || 0;
    const inscrits = parseInt(row[colInscrits]) || 0;
    const votants = parseInt(row[colVotants]) || 0;
    const abstentions = parseInt(row[colAbstentions]) || 0;

    const key = `${commune}|${candidat}`;
    if (!communeAgg[key]) {
      communeAgg[key] = { commune, candidat, voix: 0, inscrits: 0, votants: 0, abstentions: 0, bureaux: 0 };
    }
    communeAgg[key].voix += voix;
    communeAgg[key].inscrits += inscrits;
    communeAgg[key].votants += votants;
    communeAgg[key].abstentions += abstentions;
    communeAgg[key].bureaux++;
  }

  const entities = [];
  for (const [, agg] of Object.entries(communeAgg)) {
    const pctCalc = agg.inscrits > 0 ? ((agg.voix / agg.inscrits) * 100).toFixed(2) : '0';
    entities.push({
      name: `${agg.candidat} — ${agg.commune}`,
      type: 'election',
      domain: 'politique',
      influence_score: Math.min(10, Math.round((agg.voix / Math.max(agg.inscrits, 1)) * 20)),
      description: `Presidentielle 2022 Tour ${tour} | ${agg.commune} | ${agg.candidat} | ${agg.voix} voix (${pctCalc}% inscrits) | ${agg.votants} votants / ${agg.inscrits} inscrits`,
      tags: ['election', `tour-${tour}`, 'presidentielle-2022', agg.commune.toLowerCase(), '972'],
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
// SUMMARY
// ═══════════════════════════════════════════════════════
function printSummary(entities) {
  console.log('\n══════════════════════════════════════');
  console.log('  RAPPORT ELECTIONS 972');
  console.log('══════════════════════════════════════\n');

  console.log(`Total entities: ${entities.length}`);

  // Per tour
  for (const tour of [1, 2]) {
    const tourEntities = entities.filter((e) => e.tags.includes(`tour-${tour}`));
    if (tourEntities.length === 0) continue;

    console.log(`\n  Tour ${tour}: ${tourEntities.length} entries`);

    // Top candidates (aggregate across communes)
    const candidateAgg = {};
    for (const e of tourEntities) {
      try {
        const data = JSON.parse(e.notes);
        const name = data.candidat;
        if (!candidateAgg[name]) candidateAgg[name] = { voix: 0, inscrits: 0 };
        candidateAgg[name].voix += data.voix;
        candidateAgg[name].inscrits += data.inscrits;
      } catch { /* skip */ }
    }

    const sorted = Object.entries(candidateAgg).sort((a, b) => b[1].voix - a[1].voix);
    console.log('  ─'.repeat(30));
    for (const [name, data] of sorted.slice(0, 10)) {
      const pct = data.inscrits > 0 ? ((data.voix / data.inscrits) * 100).toFixed(1) : '0';
      console.log(`    ${name.padEnd(30)} ${String(data.voix).padStart(8)} voix (${pct}%)`);
    }
  }
}

// ═══════════════════════════════════════════════════════
// INSERT INTO SUPABASE
// ═══════════════════════════════════════════════════════
async function insertEntities(entities) {
  console.log(`\n── Inserting ${entities.length} entities into intel_entities ──\n`);

  let inserted = 0;
  for (let i = 0; i < entities.length; i += 50) {
    const batch = entities.slice(i, i + 50);
    const { error } = await supabase.from('intel_entities').insert(batch);
    if (error) {
      console.error(`  Batch ${Math.floor(i / 50) + 1} error: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`  Inserted batch ${Math.floor(i / 50) + 1}: ${batch.length} (total: ${inserted})`);
    }
  }

  console.log(`\nTotal inserted: ${inserted} entities`);
  return inserted;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  ELECTIONS 972 — Tabular + CSV       ║');
  console.log('╚══════════════════════════════════════╝');

  let allEntities = [];

  for (const ds of DATASETS) {
    try {
      const ents = await processDataset(ds);
      allEntities.push(...ents);
    } catch (err) {
      console.error(`  ERROR processing ${ds.label}:`, err.message);
    }
    await delay(500);
  }

  if (allEntities.length === 0) {
    console.log('\nNo entities to insert.');
    console.log('Note: batch-elections-972.mjs exists as an alternative full-CSV approach.');
    return;
  }

  printSummary(allEntities);
  await insertEntities(allEntities);

  console.log('\nElections 972 import complete.');
}

main();
