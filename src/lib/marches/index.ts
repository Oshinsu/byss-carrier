// ═══════════════════════════════════════════════════════
// MARCHÉS PUBLICS — Lib
// Statuses, pipeline phases, scoring weights, types
// ═══════════════════════════════════════════════════════

export const MARCHE_STATUSES = [
  { id: 'detected', label: 'Détecté', color: 'gray', icon: 'Search' },
  { id: 'analyzing', label: 'En analyse', color: 'blue', icon: 'Brain' },
  { id: 'go', label: 'GO', color: 'green', icon: 'CheckCircle2' },
  { id: 'no_go', label: 'NO GO', color: 'red', icon: 'XCircle' },
  { id: 'drafting', label: 'Rédaction', color: 'purple', icon: 'FileEdit' },
  { id: 'submitted', label: 'Soumis', color: 'cyan', icon: 'Send' },
  { id: 'won', label: 'Gagné', color: 'green', icon: 'Trophy' },
  { id: 'lost', label: 'Perdu', color: 'red', icon: 'X' },
] as const;

export type MarcheStatus = typeof MARCHE_STATUSES[number]['id'];

/** Pipeline phases for Kanban view (excludes no_go and lost) */
export const MARCHE_PIPELINE = [
  { id: 'detected', label: 'Détectés' },
  { id: 'analyzing', label: 'En analyse' },
  { id: 'go', label: 'GO — À rédiger' },
  { id: 'drafting', label: 'Rédaction en cours' },
  { id: 'submitted', label: 'Soumis' },
  { id: 'won', label: 'Gagnés' },
] as const;

/** Scoring weights for tender relevance */
export const SCORING_WEIGHTS = {
  keyword_match: 40,    // Keywords in title/description
  cpv_match: 25,        // CPV code in BYSS primary list
  budget_fit: 15,       // Budget in BYSS sweet spot (10K-100K)
  deadline_ok: 10,      // > 14 days remaining
  local_buyer: 10,      // Known Martinique buyer
} as const;

/** Status color mapping for UI */
export function getStatusColor(status: MarcheStatus): string {
  switch (status) {
    case 'detected': return 'text-gray-400 bg-gray-500/10';
    case 'analyzing': return 'text-blue-400 bg-blue-500/10';
    case 'go': return 'text-emerald-400 bg-emerald-500/10';
    case 'no_go': return 'text-red-400 bg-red-500/10';
    case 'drafting': return 'text-purple-400 bg-purple-500/10';
    case 'submitted': return 'text-cyan-400 bg-cyan-500/10';
    case 'won': return 'text-emerald-400 bg-emerald-500/10';
    case 'lost': return 'text-red-400 bg-red-500/10';
    default: return 'text-gray-400 bg-gray-500/10';
  }
}

/** Supabase row shape */
export interface MarcheRow {
  id: string;
  boamp_id: string | null;
  title: string;
  acheteur: string | null;
  nature: string | null;
  date_publication: string | null;
  date_limite: string | null;
  cpv_codes: string[] | null;
  description: string | null;
  url_source: string | null;
  platform: string;
  status: MarcheStatus;
  relevance_score: number;
  ai_analysis: string | null;
  go_no_go: string | null;
  assigned_to: string | null;
  prospect_id: string | null;
  invoice_id: string | null;
  budget_estimated: number | null;
  budget_proposed: number | null;
  memoire_technique: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Mémoire technique sections */
export const MEMOIRE_SECTIONS = [
  { id: 'presentation', label: 'Présentation BYSS GROUP', placeholder: 'Historique, valeurs, positionnement...' },
  { id: 'comprehension', label: 'Compréhension du besoin', placeholder: 'Analyse du CCTP, enjeux identifiés...' },
  { id: 'methodologie', label: 'Méthodologie proposée', placeholder: 'Phases, livrables, jalons...' },
  { id: 'moyens', label: 'Moyens humains et matériels', placeholder: 'Équipe projet, compétences, outils...' },
  { id: 'planning', label: 'Planning prévisionnel', placeholder: 'Macro-planning, jalons clés...' },
  { id: 'references', label: 'Références et expériences', placeholder: 'Projets similaires, clients publics...' },
  { id: 'innovation', label: 'Innovation et valeur ajoutée', placeholder: 'IA, automatisation, différenciation...' },
  { id: 'rse', label: 'Développement durable / RSE', placeholder: 'Impact environnemental, inclusion, local...' },
] as const;
