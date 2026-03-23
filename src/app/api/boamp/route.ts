import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// BOAMP API — Marchés Publics Martinique (972)
// Source: OpenDataSoft / DILA
// Cache: 1 hour — public tender data
// ═══════════════════════════════════════════════════════

const BASE_URL =
  "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";

const FIELDS = [
  "id",
  "intitule",
  "nomacheteur",
  "nature",
  "datepublicationdonnees",
  "datelimitereponse",
  "descripteur",
  "familleactivite",
  "departement",
  "typeavis",
  "codecpv",
  "procedure",
  "url_avis",
].join(",");

/** In-memory cache: key → { data, timestamp } */
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 3600_000; // 1 hour

function cached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
  // Prevent unbounded growth
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      /* ── Search tenders by keyword ── */
      case "search": {
        const q = searchParams.get("q") || "informatique";
        const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
        const cacheKey = `search:${q}:${limit}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = `departement='972' AND (intitule LIKE '%${q}%' OR descripteur LIKE '%${q}%' OR nomacheteur LIKE '%${q}%')`;
        const url = `${BASE_URL}?select=${FIELDS}&where=${encodeURIComponent(where)}&order_by=datepublicationdonnees DESC&limit=${limit}`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        const data = {
          results: (json.results ?? []).map(simplify),
          total: json.total_count ?? 0,
          query: q,
          source: "BOAMP OpenDataSoft",
        };

        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      /* ── Latest tenders in 972 ── */
      case "latest": {
        const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
        const cacheKey = `latest:${limit}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = "departement='972'";
        const url = `${BASE_URL}?select=${FIELDS}&where=${encodeURIComponent(where)}&order_by=datepublicationdonnees DESC&limit=${limit}`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        const data = {
          results: (json.results ?? []).map(simplify),
          total: json.total_count ?? 0,
          source: "BOAMP OpenDataSoft",
        };

        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      /* ── Single tender detail ── */
      case "detail": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Paramètre id requis" }, { status: 400 });

        const cacheKey = `detail:${id}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json(hit);

        const where = `id='${id}'`;
        const url = `${BASE_URL}?where=${encodeURIComponent(where)}&limit=1`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`BOAMP responded ${res.status}`);
        const json = await res.json();

        if (!json.results?.length) {
          return NextResponse.json({ error: "Marché introuvable" }, { status: 404 });
        }

        const data = { result: simplify(json.results[0]), source: "BOAMP OpenDataSoft" };
        setCache(cacheKey, data);
        return NextResponse.json(data);
      }

      default:
        return NextResponse.json(
          { error: "Action requise: search, latest, detail" },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur BOAMP" },
      { status: 500 },
    );
  }
}

/* ── Simplify a BOAMP record ── */
function simplify(record: Record<string, unknown>) {
  return {
    id: record.id,
    intitule: record.intitule || "Sans titre",
    acheteur: record.nomacheteur || "Non précisé",
    nature: record.nature || "",
    datePublication: record.datepublicationdonnees || "",
    dateLimite: record.datelimitereponse || "",
    descripteur: record.descripteur || "",
    familleActivite: record.familleactivite || "",
    departement: record.departement || "972",
    typeAvis: record.typeavis || "",
    codeCPV: record.codecpv || "",
    procedure: record.procedure || "",
    urlAvis: record.url_avis || "",
  };
}
