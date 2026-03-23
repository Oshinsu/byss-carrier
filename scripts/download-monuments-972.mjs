/**
 * download-monuments-972.mjs — Fetch Monuments Historiques de Martinique
 *
 * Source: data.culture.gouv.fr (open data, no auth)
 * Tries multiple filter strategies to find Martinique records.
 * Inserts into Supabase lore_entries (universe='eveil', category='patrimoine').
 *
 * Usage: node scripts/download-monuments-972.mjs
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
// DATASET CONFIG
// ═══════════════════════════════════════════════════════
const DATASET = 'liste-des-immeubles-proteges-au-titre-des-monuments-historiques';
const BASE_URL = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/${DATASET}/records`;

// Multiple filter strategies (API field names vary)
const FILTER_STRATEGIES = [
  { where: "reg_code='02'", label: "reg_code='02' (Martinique)" },
  { where: "departement='Martinique'", label: "departement='Martinique'" },
  { where: "code_departement='972'", label: "code_departement='972'" },
  { where: "dpt_lettre='Martinique'", label: "dpt_lettre='Martinique'" },
  { where: "reg_name='Martinique'", label: "reg_name='Martinique'" },
  { where: "dept='972'", label: "dept='972'" },
  { where: "codedept='972'", label: "codedept='972'" },
  { where: "search(commune, 'Fort-de-France') OR search(commune, 'Saint-Pierre')", label: "search commune FdF/StP" },
];

// ═══════════════════════════════════════════════════════
// FETCH MONUMENTS
// ═══════════════════════════════════════════════════════
async function fetchMonuments() {
  console.log('\n══════════════════════════════════════');
  console.log('  MONUMENTS HISTORIQUES — MARTINIQUE');
  console.log('══════════════════════════════════════\n');

  let allRecords = [];

  // Try each filter strategy
  for (const strategy of FILTER_STRATEGIES) {
    try {
      console.log(`Trying: ${strategy.label}`);
      const url = `${BASE_URL}?where=${encodeURIComponent(strategy.where)}&limit=100`;
      const res = await fetch(url);

      if (!res.ok) {
        console.log(`  HTTP ${res.status} — skipping`);
        await delay(300);
        continue;
      }

      const data = await res.json();
      const count = data.total_count || data.results?.length || 0;
      console.log(`  Found ${count} records`);

      if (count > 0 && data.results?.length > 0) {
        allRecords = data.results;

        // If more than 100, paginate
        if (count > 100) {
          let offset = 100;
          while (offset < count) {
            await delay(200);
            const pageUrl = `${BASE_URL}?where=${encodeURIComponent(strategy.where)}&limit=100&offset=${offset}`;
            const pageRes = await fetch(pageUrl);
            if (pageRes.ok) {
              const pageData = await pageRes.json();
              if (pageData.results?.length) {
                allRecords.push(...pageData.results);
              }
            }
            offset += 100;
          }
        }

        console.log(`  Total collected: ${allRecords.length}`);
        break; // Found data, stop trying
      }

      await delay(300);
    } catch (err) {
      console.log(`  Error: ${err.message}`);
      await delay(300);
    }
  }

  // If still nothing, try getting the schema first
  if (allRecords.length === 0) {
    console.log('\nAll filters failed. Fetching dataset schema to find correct field names...');
    try {
      const schemaUrl = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/${DATASET}`;
      const schemaRes = await fetch(schemaUrl);
      if (schemaRes.ok) {
        const schema = await schemaRes.json();
        const fields = schema.fields?.map((f) => f.name) || [];
        console.log('Available fields:', fields.join(', '));

        // Try any department-like field
        const deptField = fields.find((f) =>
          f.toLowerCase().includes('dept') ||
          f.toLowerCase().includes('departement') ||
          f.toLowerCase().includes('dep')
        );

        if (deptField) {
          console.log(`\nTrying field: ${deptField}='972'`);
          const url = `${BASE_URL}?where=${encodeURIComponent(`${deptField}='972'`)}&limit=100`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.results?.length) {
              allRecords = data.results;
              console.log(`  Found ${allRecords.length} records!`);
            }
          }
        }

        // Also try region field with code '02' (Martinique = Region 02)
        const regField = fields.find((f) =>
          f.toLowerCase().includes('reg') ||
          f.toLowerCase().includes('region')
        );

        if (regField && allRecords.length === 0) {
          console.log(`\nTrying field: ${regField}='02'`);
          const url = `${BASE_URL}?where=${encodeURIComponent(`${regField}='02'`)}&limit=100`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.results?.length) {
              allRecords = data.results;
              console.log(`  Found ${allRecords.length} records!`);
            }
          }
        }
      }
    } catch (err) {
      console.error('Schema fetch error:', err.message);
    }
  }

  if (allRecords.length === 0) {
    console.log('\nNo monuments found via API. The dataset may not contain Martinique data or field names changed.');
    console.log('The existing seed-patrimoine-martinique.mjs contains 122 hardcoded monuments as fallback.');
    return [];
  }

  return allRecords;
}

// ═══════════════════════════════════════════════════════
// NORMALIZE RECORD
// ═══════════════════════════════════════════════════════
function normalizeRecord(record) {
  // Field names vary across datasets. Try common variants.
  const r = record;
  return {
    name: r.appellation_courante || r.tico || r.titre || r.denomination || r.nom || '',
    commune: r.commune || r.com_name || r.libelle_commune || r.ville || '',
    department: r.departement || r.dpt_lettre || r.dept || r.code_departement || '972',
    type_protection: r.type_protection || r.prot || r.protection || '',
    date_protection: r.date_protection || r.dpro || r.annee_protection || '',
    description: r.precision_protection || r.description || r.historique || '',
    adresse: r.adresse || r.lieu_dit || r.localisation || '',
    siecle: r.siecle || r.epoque || '',
    latitude: r.latitude || r.geo_point_2d?.lat || null,
    longitude: r.longitude || r.geo_point_2d?.lon || null,
  };
}

// ═══════════════════════════════════════════════════════
// INSERT INTO SUPABASE
// ═══════════════════════════════════════════════════════
async function insertMonuments(records) {
  console.log(`\n── Inserting ${records.length} monuments into lore_entries ──\n`);

  const rows = records.map((raw, i) => {
    const m = normalizeRecord(raw);
    const title = m.name || `Monument ${i + 1}`;
    const commune = m.commune || 'Martinique';
    const typeProtection = m.type_protection || 'Monument Historique';
    const dateProtection = m.date_protection || '';
    const desc = m.description || '';
    const adresse = m.adresse || '';
    const siecle = m.siecle || '';

    const contentParts = [
      `${title} — ${commune}`,
      typeProtection && `Protection: ${typeProtection}`,
      dateProtection && `Date: ${dateProtection}`,
      siecle && `Siecle: ${siecle}`,
      adresse && `Adresse: ${adresse}`,
      desc && desc,
    ].filter(Boolean);

    const content = contentParts.join('\n');

    return {
      universe: 'eveil',
      category: 'patrimoine',
      title,
      content,
      tags: ['patrimoine', '972', commune.toLowerCase(), typeProtection.toLowerCase()].filter(Boolean),
      word_count: content.split(/\s+/).length,
      order_index: i + 1,
    };
  });

  // Insert in batches of 50
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { error } = await supabase.from('lore_entries').insert(batch);
    if (error) {
      console.error(`  Batch ${Math.floor(i / 50) + 1} error: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`  Inserted batch ${Math.floor(i / 50) + 1}: ${batch.length} entries (total: ${inserted})`);
    }
  }

  console.log(`\nTotal inserted: ${inserted} lore entries`);
  return inserted;
}

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
function printSummary(records) {
  const normalized = records.map(normalizeRecord);

  console.log('\n══════════════════════════════════════');
  console.log('  RAPPORT MONUMENTS 972');
  console.log('══════════════════════════════════════\n');

  console.log(`Total monuments: ${records.length}\n`);

  // By commune
  const byCommune = {};
  for (const m of normalized) {
    const c = m.commune || 'Inconnu';
    byCommune[c] = (byCommune[c] || 0) + 1;
  }

  const sorted = Object.entries(byCommune).sort((a, b) => b[1] - a[1]);
  console.log('Par commune:');
  console.log('─'.repeat(40));
  for (const [commune, count] of sorted.slice(0, 15)) {
    console.log(`  ${commune.padEnd(25)} ${String(count).padStart(4)}`);
  }
  if (sorted.length > 15) console.log(`  ... et ${sorted.length - 15} autres communes`);

  // By type
  const byType = {};
  for (const m of normalized) {
    const t = m.type_protection || 'Inconnu';
    byType[t] = (byType[t] || 0) + 1;
  }

  console.log('\nPar type de protection:');
  console.log('─'.repeat(40));
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type.padEnd(30)} ${String(count).padStart(4)}`);
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  try {
    const records = await fetchMonuments();

    if (records.length === 0) {
      console.log('\nNo data to insert. Use seed-patrimoine-martinique.mjs for hardcoded fallback.');
      process.exit(0);
    }

    printSummary(records);
    await insertMonuments(records);

    console.log('\nMonuments 972 import complete.');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
