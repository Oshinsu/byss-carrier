import { semanticSearch, type SearchResult } from "./embeddings";

export async function buildRAGContext(
  query: string,
  options?: { sourceTable?: string; maxTokens?: number; limit?: number }
): Promise<string> {
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
