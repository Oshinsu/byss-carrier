// ═══════════════════════════════════════════════════════
// CPV Codes — BYSS GROUP Public Procurement Mapping
// Codes correspondant aux capacités du groupe
// ═══════════════════════════════════════════════════════

export const BYSS_CPV_CODES = {
  primary: [
    { code: "72000000", label: "Services TI, conseil, développement logiciels" },
    { code: "72200000", label: "Programmation et conseil en logiciels" },
    { code: "72212900", label: "Développement logiciels divers" },
    { code: "72222300", label: "Services de technologies de l'information" },
    { code: "72415000", label: "Hébergement exploitation sites WWW" },
    { code: "48000000", label: "Logiciels et systèmes d'information" },
  ],
  secondary: [
    { code: "79000000", label: "Services aux entreprises (marketing, conseil)" },
    { code: "79340000", label: "Services de publicité et de marketing" },
    { code: "80500000", label: "Services de formation" },
  ],
} as const;

/** All CPV code prefixes BYSS can respond to */
export const BYSS_CPV_PREFIXES = ["72", "48", "79", "80"];

/** Keywords scored for relevance matching */
const RELEVANCE_KEYWORDS = [
  { word: "informatique", weight: 10 },
  { word: "numérique", weight: 9 },
  { word: "digital", weight: 9 },
  { word: "intelligence artificielle", weight: 12 },
  { word: "ia", weight: 10 },
  { word: "site web", weight: 10 },
  { word: "application", weight: 8 },
  { word: "logiciel", weight: 10 },
  { word: "développement", weight: 7 },
  { word: "communication", weight: 7 },
  { word: "vidéo", weight: 6 },
  { word: "marketing", weight: 7 },
  { word: "data", weight: 8 },
  { word: "crm", weight: 9 },
  { word: "formation", weight: 6 },
  { word: "innovation", weight: 8 },
  { word: "cloud", weight: 8 },
  { word: "hébergement", weight: 7 },
  { word: "cybersécurité", weight: 7 },
  { word: "transformation digitale", weight: 11 },
  { word: "dématérialisation", weight: 8 },
  { word: "système d'information", weight: 10 },
  { word: "api", weight: 7 },
  { word: "saas", weight: 8 },
  { word: "audiovisuel", weight: 6 },
  { word: "identité visuelle", weight: 6 },
  { word: "stratégie digitale", weight: 9 },
];

/**
 * Score 0-100 — relevance of a tender to BYSS GROUP capabilities.
 * Higher = stronger match.
 */
export function scoreTenderRelevance(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;

  for (const { word, weight } of RELEVANCE_KEYWORDS) {
    if (text.includes(word.toLowerCase())) score += weight;
  }

  // Bonus for CPV code prefixes in text
  for (const prefix of BYSS_CPV_PREFIXES) {
    if (text.includes(prefix)) score += 3;
  }

  return Math.min(score, 100);
}

/** Platforms de marchés publics */
export const MARCHES_PLATFORMS = [
  { name: "BOAMP", url: "https://www.boamp.fr", description: "Bulletin Officiel des Annonces de Marchés Publics" },
  { name: "PLACE", url: "https://www.marches-publics.gouv.fr", description: "Plateforme des Achats de l'État" },
  { name: "CTM", url: "https://www.collectivitedemartinique.mq/marches-publics", description: "Collectivité Territoriale de Martinique" },
  { name: "France Marchés", url: "https://www.francemarches.com", description: "Portail national des marchés publics" },
  { name: "TED", url: "https://ted.europa.eu", description: "Tenders Electronic Daily — appels d'offres européens" },
  { name: "Mégalis", url: "https://www.megalisbretagne.org", description: "Plateforme de dématérialisation" },
  { name: "AWS-Achat", url: "https://www.achatpublic.com", description: "Portail de dématérialisation" },
  { name: "Maximilien", url: "https://marches.maximilien.fr", description: "Plateforme marchés Île-de-France" },
  { name: "e-Marchés Publics", url: "https://www.e-marchespublics.com", description: "Annonces marchés publics DOM-TOM" },
] as const;

/** Organisations cibles achat innovant Martinique (< 100K HT) */
export const ACHAT_INNOVANT_TARGETS = [
  { name: "CTM", fullName: "Collectivité Territoriale de Martinique", type: "collectivite" },
  { name: "Préfecture 972", fullName: "Préfecture de la Martinique", type: "etat" },
  { name: "Mairie FdF", fullName: "Mairie de Fort-de-France", type: "commune" },
  { name: "CACEM", fullName: "CA du Centre de la Martinique", type: "epci" },
  { name: "CHU Martinique", fullName: "Centre Hospitalier Universitaire", type: "sante" },
  { name: "Espace Sud", fullName: "Communauté d'Agglomération Espace Sud", type: "epci" },
  { name: "Cap Nord", fullName: "Communauté d'Agglomération Cap Nord", type: "epci" },
  { name: "Rectorat", fullName: "Rectorat de la Martinique", type: "education" },
  { name: "ARS", fullName: "Agence Régionale de Santé", type: "sante" },
] as const;

/** Category filter definitions */
export const TENDER_CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "informatique", label: "Informatique", keywords: ["informatique", "numérique", "digital", "logiciel", "développement", "système d'information"] },
  { id: "communication", label: "Communication", keywords: ["communication", "vidéo", "audiovisuel", "marketing", "publicité", "identité visuelle"] },
  { id: "formation", label: "Formation", keywords: ["formation", "éducation", "pédagogique", "e-learning"] },
  { id: "conseil", label: "Conseil", keywords: ["conseil", "étude", "audit", "stratégie", "accompagnement"] },
] as const;
