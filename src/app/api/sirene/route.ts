import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════
// API Sirene — Recherche entreprises via API gouv.fr
// Gratuit, aucune cle requise
// Source: https://recherche-entreprises.api.gouv.fr
// ═══════════════════════════════════════════════════════

const BASE_URL = "https://recherche-entreprises.api.gouv.fr/search";

interface SireneResult {
  siret: string | null;
  siren: string;
  denomination: string;
  activitePrincipale: string | null;
  codeNAF: string | null;
  adresse: string | null;
  codePostal: string | null;
  commune: string | null;
  effectif: string | null;
  dateCreation: string | null;
  categorieJuridique: string | null;
  trancheEffectif: string | null;
}

function parseEntreprise(raw: any): SireneResult {
  const siege = raw.siege || {};
  return {
    siret: siege.siret || null,
    siren: raw.siren || "",
    denomination: raw.nom_complet || raw.nom_raison_sociale || "",
    activitePrincipale: siege.activite_principale || raw.activite_principale || null,
    codeNAF: siege.activite_principale || raw.activite_principale || null,
    adresse: [siege.numero_voie, siege.type_voie, siege.libelle_voie]
      .filter(Boolean)
      .join(" ") || null,
    codePostal: siege.code_postal || null,
    commune: siege.libelle_commune || null,
    effectif: raw.tranche_effectif_salarie || null,
    dateCreation: raw.date_creation || null,
    categorieJuridique: raw.nature_juridique || null,
    trancheEffectif: raw.tranche_effectif_salarie || null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const siret = searchParams.get("siret");
  const dep = searchParams.get("dep") || "972"; // Martinique par defaut

  if (!q && !siret) {
    return NextResponse.json(
      { error: "Parametre requis: q (nom entreprise) ou siret (numero)" },
      { status: 400 }
    );
  }

  try {
    let url: string;

    if (siret) {
      // Recherche directe par SIRET
      url = `${BASE_URL}?q=${encodeURIComponent(siret)}&mtm_campaign=byss-carrier`;
    } else {
      // Recherche par nom avec filtre departement
      url = `${BASE_URL}?q=${encodeURIComponent(q!)}&department=${dep}&per_page=5&mtm_campaign=byss-carrier`;
    }

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // Cache 1h
    });

    if (!res.ok) {
      throw new Error(`API Recherche Entreprises: ${res.status}`);
    }

    const data = await res.json();
    const results: SireneResult[] = (data.results || []).map(parseEntreprise);

    return NextResponse.json({
      results,
      total: data.total_results || results.length,
      source: "recherche-entreprises.api.gouv.fr",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur API Sirene" },
      { status: 500 }
    );
  }
}
