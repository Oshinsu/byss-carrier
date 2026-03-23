import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// Transport Martinique — GTFS Networks
// Source: transport.data.gouv.fr
// Cache: 24h
// ═══════════════════════════════════════════════════════

const TRANSPORT_API = "https://transport.data.gouv.fr/api";

const MARTINIQUE_NETWORKS = {
  maritime: {
    id: "gtfs-du-reseau-maritime-de-martinique",
    name: "Réseau Maritime",
    operator: "Vedettes Tropicales",
    zone: "Inter-communal",
    routes: ["Trois-Îlets ↔ Fort-de-France", "Case-Pilote ↔ Fort-de-France"],
    lines: 2,
  },
  centre: {
    id: "gtfs-urbain-de-la-zone-centre",
    name: "Réseau Centre (CACEM)",
    operator: "Mozaïk",
    zone: "Fort-de-France, Schœlcher, Le Lamentin, Saint-Joseph",
    lines: 61,
  },
  sud: {
    id: "gtfs-urbain-de-la-zone-sud",
    name: "Réseau Sud (Sud Lib)",
    operator: "CAESM",
    zone: "12 communes sud",
    lines: 81,
  },
  nord: {
    id: "gtfs-urbain-de-la-zone-nord-cap-nord",
    name: "Réseau Nord (CAP NORD)",
    operator: "CAP NORD",
    zone: "Grand-Rivière → Le Robert",
    lines: 9,
  },
} as const;

type NetworkKey = keyof typeof MARTINIQUE_NETWORKS;

// 24h cache
let cache: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000;

function cached(key: string): unknown | null {
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key: string, data: unknown) {
  cache[key] = { data, ts: Date.now() };
}

async function fetchDataset(slug: string) {
  const cacheKey = `dataset:${slug}`;
  const hit = cached(cacheKey);
  if (hit) return hit;

  const res = await fetch(`${TRANSPORT_API}/datasets/${slug}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`transport.data.gouv.fr ${res.status}: ${slug}`);
  }

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

function extractGtfsResources(dataset: any) {
  const resources = (dataset.resources || []).filter(
    (r: any) =>
      r.format === "GTFS" ||
      r.format === "gtfs" ||
      (r.url && r.url.endsWith(".zip"))
  );

  return resources.map((r: any) => ({
    id: r.id,
    title: r.title,
    format: r.format,
    url: r.url,
    updated: r.last_update,
    filesize: r.filesize,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const network = searchParams.get("network") as NetworkKey | null;

  try {
    switch (action) {
      case "networks": {
        return NextResponse.json({
          data: Object.entries(MARTINIQUE_NETWORKS).map(([key, net]) => ({
            key,
            ...net,
            datasetUrl: `https://transport.data.gouv.fr/datasets/${net.id}`,
          })),
          total_lines: Object.values(MARTINIQUE_NETWORKS).reduce(
            (sum, n) => sum + n.lines,
            0
          ),
        });
      }

      case "stops":
      case "routes":
      case "schedules": {
        if (!network || !MARTINIQUE_NETWORKS[network]) {
          return NextResponse.json(
            {
              error: `Réseau invalide. Valeurs: ${Object.keys(MARTINIQUE_NETWORKS).join(", ")}`,
            },
            { status: 400 }
          );
        }

        const net = MARTINIQUE_NETWORKS[network];
        const dataset = await fetchDataset(net.id);
        const resources = extractGtfsResources(dataset);

        return NextResponse.json({
          data: {
            network: { key: network, name: net.name, operator: net.operator },
            gtfs_resources: resources,
            dataset_url: `https://transport.data.gouv.fr/datasets/${net.id}`,
            note: "GTFS files contain stops, routes, and schedules. Download the ZIP to parse locally.",
          },
        });
      }

      default:
        return NextResponse.json(
          {
            error: "Action requise: networks | stops | routes | schedules",
            usage: {
              networks: "/api/transport?action=networks",
              stops: "/api/transport?action=stops&network=centre",
              routes: "/api/transport?action=routes&network=sud",
              schedules: "/api/transport?action=schedules&network=maritime",
            },
          },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error("[transport]", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur transport API" },
      { status: 500 }
    );
  }
}
