import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// API Adresse BAN — Geocodage et reverse geocodage
// Gratuit, aucune cle requise
// Source: https://api-adresse.data.gouv.fr
// ═══════════════════════════════════════════════════════

const SEARCH_URL = "https://api-adresse.data.gouv.fr/search";
const REVERSE_URL = "https://api-adresse.data.gouv.fr/reverse";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const limit = searchParams.get("limit") || "5";

  if (!q && (!lat || !lon)) {
    return NextResponse.json(
      { error: "Parametre requis: q (adresse) ou lat+lon (reverse geocode)" },
      { status: 400 }
    );
  }

  try {
    let url: string;

    if (lat && lon) {
      // Reverse geocode
      url = `${REVERSE_URL}/?lon=${encodeURIComponent(lon)}&lat=${encodeURIComponent(lat)}`;
    } else {
      // Forward search
      url = `${SEARCH_URL}/?q=${encodeURIComponent(q!)}&limit=${limit}`;
    }

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // Cache 1h
    });

    if (!res.ok) {
      throw new Error(`API Adresse BAN: ${res.status}`);
    }

    const data = await res.json();

    // Simplifier la reponse GeoJSON
    const features = (data.features || []).map((f: any) => ({
      properties: {
        label: f.properties?.label,
        housenumber: f.properties?.housenumber,
        street: f.properties?.street,
        postcode: f.properties?.postcode,
        city: f.properties?.city,
        context: f.properties?.context,
        type: f.properties?.type,
        score: f.properties?.score,
      },
      geometry: {
        type: f.geometry?.type,
        coordinates: f.geometry?.coordinates,
      },
    }));

    return NextResponse.json({
      features,
      total: features.length,
      source: "api-adresse.data.gouv.fr",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur API Adresse" },
      { status: 500 }
    );
  }
}
