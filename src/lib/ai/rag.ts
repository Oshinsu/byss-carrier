import { semanticSearch, type SearchResult } from "./embeddings";

// ── Conditional RAG (Berkeley) ──────────────────────
// Skip expensive semantic search for simple queries
// that don't need database context.

const SKIP_PATTERNS = [
  /^(bonjour|salut|hello|hi|hey|ciao)/i,
  /^(ouvre|va|navigue|montre|affiche)/i,
  /^(status|health|ping|test)/i,
  /^(aide|help|comment\s*$)/i,
];

const USE_PATTERNS = [
  /prospect|client|facture|devis|pipeline|bible|prix|tarif/i,
  /combien|quel|qui|pourquoi|comment.*(?:vendre|pitcher|relancer)/i,
  /martinique|antilles|972|digicel|wizzee|orange|gbh/i,
  /rhum|hotel|restaurant|telecom|tourisme|excursion/i,
];

export function shouldUseRAG(query: string): boolean {
  if (query.length < 10) return false;
  if (SKIP_PATTERNS.some((p) => p.test(query.trim()))) return false;
  return USE_PATTERNS.some((p) => p.test(query));
}

export async function buildRAGContext(
  query: string,
  options?: { sourceTable?: string; maxTokens?: number; limit?: number }
): Promise<string> {
  // Conditional RAG: skip semantic search for simple queries
  if (!shouldUseRAG(query)) return "";

  const results = await semanticSearch(query, {
    sourceTable: options?.sourceTable,
    limit: options?.limit || 8,
    threshold: 0.65,
  });

  if (results.length === 0) return "";

  const context = results
    .map((r, i) => `[${i + 1}] (${r.sourceTable}/${r.similarity.toFixed(2)}) ${r.contentPreview}`)
    .join("\n\n");

  return `--- CONTEXTE RAG (${results.length} sources, similarite ${results[0].similarity.toFixed(2)}) ---\n${context}\n--- FIN CONTEXTE ---`;
}
