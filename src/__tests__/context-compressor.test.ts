import {
  compressBibleEntries,
  compressProspectContext,
  estimateTokens,
  compressToTokenBudget,
} from '@/lib/ai/context-compressor';

describe('Context Compressor — estimateTokens', () => {
  test('estimates roughly 1 token per 4 chars', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('12345678')).toBe(2);
  });

  test('empty string returns 0', () => {
    expect(estimateTokens('')).toBe(0);
  });

  test('long text scales correctly', () => {
    const text = 'a'.repeat(400);
    expect(estimateTokens(text)).toBe(100);
  });
});

describe('Context Compressor — compressProspectContext', () => {
  test('includes prospect name', () => {
    const result = compressProspectContext({ name: 'Digicel' });
    expect(result).toContain('Digicel');
  });

  test('includes sector when provided', () => {
    const result = compressProspectContext({ name: 'Test', sector: 'Telecom' });
    expect(result).toContain('Telecom');
  });

  test('includes phase when provided', () => {
    const result = compressProspectContext({ name: 'Test', phase: 'proposition' });
    expect(result).toContain('proposition');
  });

  test('includes AI score when provided', () => {
    const result = compressProspectContext({ name: 'Test', ai_score: 85 });
    expect(result).toContain('85');
  });

  test('truncates pain points to 50 words', () => {
    const longPain = Array.from({ length: 100 }, (_, i) => `word${i}`).join(' ');
    const result = compressProspectContext({ name: 'Test', pain_points: longPain });
    const words = result.split(/\s+/);
    // Should be significantly shorter than 100 words
    expect(words.length).toBeLessThan(70);
  });
});

describe('Context Compressor — compressBibleEntries', () => {
  const entries = [
    { title: 'Article 1', content: 'Client Digicel avec budget de 50000 EUR. Conversion pipeline importante. Le prospect veut une demo rapide.', category: 'vente' },
    { title: 'Article 2', content: 'Les meilleurs horaires pour les appels en Martinique sont le matin. Fort-de-France a un rythme different.', category: 'vente' },
    { title: 'Article 3', content: 'Strategie pricing pour les hotels 4 etoiles. Marge entre 30 et 45 pourcent.', category: 'pricing' },
  ];

  test('returns non-empty string', () => {
    const result = compressBibleEntries(entries);
    expect(result.length).toBeGreaterThan(0);
  });

  test('includes category headers', () => {
    const result = compressBibleEntries(entries);
    expect(result).toContain('[VENTE]');
    expect(result).toContain('[PRICING]');
  });

  test('output is shorter than concatenated input', () => {
    const fullLength = entries.reduce((sum, e) => sum + e.content.length, 0);
    const result = compressBibleEntries(entries, 1);
    expect(result.length).toBeLessThan(fullLength);
  });
});

describe('Context Compressor — compressToTokenBudget', () => {
  const entries = Array.from({ length: 20 }, (_, i) => ({
    title: `Article ${i}`,
    content: `Contenu business important numero ${i}. Client avec budget de ${i * 1000} EUR. Pipeline conversion.`,
    category: i % 2 === 0 ? 'vente' : 'pricing',
  }));

  test('respects token budget', () => {
    const result = compressToTokenBudget(entries, 100);
    expect(estimateTokens(result)).toBeLessThanOrEqual(150); // some tolerance
  });

  test('returns content even with tight budget', () => {
    const result = compressToTokenBudget(entries, 50);
    expect(result.length).toBeGreaterThan(0);
  });
});
