import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// data.gouv.fr API proxy — BYSS GROUP
// Endpoints: search datasets, get organization data
// Redirects: sirene → /api/sirene, adresse → /api/adresse, geo → /api/geo
// ═══════════════════════════════════════════════════════

const BASE_URL = "https://www.data.gouv.fr/api/1";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const query = searchParams.get("q");
  const org = searchParams.get("org");

  // ── Redirects vers les routes specialisees ──
  if (action === "sirene") {
    const q = searchParams.get("q") || "";
    return NextResponse.redirect(new URL(`/api/sirene?q=${encodeURIComponent(q)}`, request.url));
  }
  if (action === "adresse") {
    const q = searchParams.get("q") || "";
    return NextResponse.redirect(new URL(`/api/adresse?q=${encodeURIComponent(q)}`, request.url));
  }
  if (action === "geo") {
    const dep = searchParams.get("dep") || "972";
    return NextResponse.redirect(new URL(`/api/geo?dep=${encodeURIComponent(dep)}`, request.url));
  }

  try {
    let url: string;

    switch (action) {
      case "search":
        url = `${BASE_URL}/datasets/?q=${encodeURIComponent(query ?? "martinique")}&page_size=10`;
        break;
      case "organization":
        url = `${BASE_URL}/organizations/${org}/`;
        break;
      case "datasets_org":
        url = `${BASE_URL}/organizations/${org}/datasets/?page_size=20`;
        break;
      case "territory":
        // Martinique specific datasets
        url = `${BASE_URL}/datasets/?q=${encodeURIComponent(query ?? "martinique")}&tag=martinique&page_size=20`;
        break;
      case "emploi":
        // France Travail / Pole Emploi data
        url = `${BASE_URL}/datasets/?q=${encodeURIComponent(query ?? "offres emploi martinique")}&page_size=10`;
        break;
      default:
        return NextResponse.json({ error: "Action requise: search, organization, territory, emploi (sirene/adresse/geo → routes dediees)" }, { status: 400 });
    }

    const apiKey = process.env.DATAGOUV_API_KEY;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (apiKey) headers["X-API-Key"] = apiKey;

    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.gouv.fr responded ${res.status}`);

    const data = await res.json();

    // Simplify response for the chatbot
    if (action === "search" || action === "territory" || action === "emploi") {
      const simplified = (data.data ?? []).map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description?.slice(0, 200),
        organization: d.organization?.name,
        frequency: d.frequency,
        last_update: d.last_update,
        url: d.page,
        resources_count: d.resources?.length ?? 0,
        tags: d.tags?.slice(0, 5),
      }));
      return NextResponse.json({ results: simplified, total: data.total });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur data.gouv.fr" },
      { status: 500 }
    );
  }
}
