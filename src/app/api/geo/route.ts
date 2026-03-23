import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// API Geo — Communes, departements, regions
// Gratuit, aucune cle requise
// Source: https://geo.api.gouv.fr
// ═══════════════════════════════════════════════════════

const BASE_URL = "https://geo.api.gouv.fr";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dep = searchParams.get("dep") || "972"; // Martinique par defaut
  const commune = searchParams.get("commune");
  const format = searchParams.get("format") || "geojson";

  try {
    let url: string;

    if (commune) {
      // Recherche par nom de commune
      url = `${BASE_URL}/communes?nom=${encodeURIComponent(commune)}&fields=nom,code,population,codesPostaux,centre,departement&limit=10`;
    } else {
      // Toutes les communes d'un departement
      url = `${BASE_URL}/departements/${encodeURIComponent(dep)}/communes?fields=nom,code,population,codesPostaux,centre&format=${format}`;
    }

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // Cache 24h — communes ne changent pas souvent
    });

    if (!res.ok) {
      throw new Error(`API Geo: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      data,
      total: Array.isArray(data) ? data.length : data.features?.length || 0,
      departement: dep,
      source: "geo.api.gouv.fr",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur API Geo" },
      { status: 500 }
    );
  }
}
