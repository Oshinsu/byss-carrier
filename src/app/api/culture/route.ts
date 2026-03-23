import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// Culture Martinique — Monuments, CNC, FAJV, Lieux
// Sources: data.culture.gouv.fr, data.gouv.fr
// Cache: monuments 24h, CNC/FAJV links static
// ═══════════════════════════════════════════════════════

const CULTURE_API = "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets";
const DATAGOUV_API = "https://www.data.gouv.fr/api/1";

// Static CNC links
const CNC_DATA = {
  name: "Centre National du Cinéma (CNC)",
  datasets: [
    {
      title: "Aides à la production cinématographique",
      url: "https://www.data.gouv.fr/fr/datasets/aides-a-la-production-cinematographique/",
    },
    {
      title: "Aides à la production audiovisuelle",
      url: "https://www.data.gouv.fr/fr/datasets/aides-a-la-production-audiovisuelle/",
    },
    {
      title: "Fréquentation cinématographique",
      url: "https://www.data.gouv.fr/fr/datasets/frequentation-cinematographique/",
    },
    {
      title: "Géographie des cinémas",
      url: "https://www.data.gouv.fr/fr/datasets/geographie-des-cinemas/",
    },
  ],
  source: "https://www.cnc.fr/professionnels/etudes-et-rapports/open-data",
};

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const dep = searchParams.get("dep") || "972";

  try {
    switch (action) {
      case "monuments": {
        const cacheKey = `monuments:${dep}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json({ data: hit });

        // reg_code='02' = Martinique (région outre-mer)
        const regCode = dep === "972" ? "02" : dep;
        const url = `${CULTURE_API}/liste-des-immeubles-proteges-au-titre-des-monuments-historiques/records?where=reg_code='${regCode}'&limit=100`;

        const res = await fetch(url, { next: { revalidate: 86400 } });

        if (!res.ok) {
          throw new Error(`data.culture.gouv.fr ${res.status}`);
        }

        const json = await res.json();
        const records = (json.results || []).map((r: any) => ({
          nom: r.appellation_courante || r.titre_editorial,
          commune: r.commune,
          protection: r.type_de_protection,
          date_protection: r.date_de_protection,
          siecle: r.siecle_de_construction,
          reference: r.reference_merimee,
          precision: r.precision_de_la_protection,
        }));

        setCache(cacheKey, records);
        return NextResponse.json({
          data: records,
          total: json.total_count || records.length,
          source: "data.culture.gouv.fr — Monuments Historiques",
        });
      }

      case "cnc": {
        return NextResponse.json({ data: CNC_DATA });
      }

      case "fajv": {
        const cacheKey = "fajv";
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json({ data: hit });

        const url = `${DATAGOUV_API}/datasets/beneficiaires-du-fonds-daide-a-la-creation-de-jeu-video/`;
        const res = await fetch(url, { next: { revalidate: 86400 } });

        if (!res.ok) {
          throw new Error(`data.gouv.fr FAJV ${res.status}`);
        }

        const dataset = await res.json();
        const resources = (dataset.resources || []).map((r: any) => ({
          title: r.title,
          format: r.format,
          url: r.url,
          updated: r.last_modified,
          filesize: r.filesize,
        }));

        const result = {
          title: dataset.title,
          description: dataset.description,
          resources,
          dataset_url: dataset.page,
          organization: dataset.organization?.name,
        };

        setCache(cacheKey, result);
        return NextResponse.json({ data: result });
      }

      case "libraries": {
        const cacheKey = `libraries:${dep}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json({ data: hit });

        const url = `${CULTURE_API}/adresse-des-bibliotheques-et-des-mediatheques/records?where=dep_code='${dep}'&limit=100`;
        const res = await fetch(url, { next: { revalidate: 86400 } });

        if (!res.ok) {
          throw new Error(`data.culture.gouv.fr bibliothèques ${res.status}`);
        }

        const json = await res.json();
        const records = (json.results || []).map((r: any) => ({
          nom: r.nom_officiel || r.libelle,
          commune: r.commune,
          adresse: r.adresse,
          code_postal: r.code_postal,
          type: r.type_etablissement,
        }));

        setCache(cacheKey, records);
        return NextResponse.json({
          data: records,
          total: json.total_count || records.length,
          source: "data.culture.gouv.fr — Bibliothèques",
        });
      }

      case "venues": {
        const cacheKey = `venues:${dep}`;
        const hit = cached(cacheKey);
        if (hit) return NextResponse.json({ data: hit });

        const url = `${CULTURE_API}/panorama-des-festivals/records?where=dep_code='${dep}'&limit=100`;
        const res = await fetch(url, { next: { revalidate: 86400 } });

        if (!res.ok) {
          throw new Error(`data.culture.gouv.fr lieux ${res.status}`);
        }

        const json = await res.json();
        const records = (json.results || []).map((r: any) => ({
          nom: r.nom_du_festival || r.nom,
          commune: r.commune,
          discipline: r.discipline_dominante,
          periode: r.periode_principale_de_deroulement_du_festival,
          site_web: r.site_internet_du_festival,
        }));

        setCache(cacheKey, records);
        return NextResponse.json({
          data: records,
          total: json.total_count || records.length,
          source: "data.culture.gouv.fr — Festivals & Lieux culturels",
        });
      }

      default:
        return NextResponse.json(
          {
            error: "Action requise: monuments | cnc | fajv | libraries | venues",
            usage: {
              monuments: "/api/culture?action=monuments&dep=972",
              cnc: "/api/culture?action=cnc",
              fajv: "/api/culture?action=fajv",
              libraries: "/api/culture?action=libraries&dep=972",
              venues: "/api/culture?action=venues&dep=972",
            },
          },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error("[culture]", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur culture API" },
      { status: 500 }
    );
  }
}
