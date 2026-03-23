import { contentHash } from '@/lib/ai/embeddings';

describe('Embeddings — contentHash', () => {
  test('returns a 32-char hex string', () => {
    const hash = contentHash('hello world');
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });

  test('same input produces same hash', () => {
    expect(contentHash('test')).toBe(contentHash('test'));
  });

  test('different input produces different hash', () => {
    expect(contentHash('alpha')).not.toBe(contentHash('beta'));
  });

  test('handles empty string', () => {
    const hash = contentHash('');
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });

  test('handles long text', () => {
    const text = 'a'.repeat(10000);
    const hash = contentHash(text);
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });

  test('handles unicode', () => {
    const hash = contentHash('Martinique est belle.');
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });

  test('is deterministic across calls', () => {
    const input = 'BYSS CARRIER — The Executor';
    const results = Array.from({ length: 5 }, () => contentHash(input));
    expect(new Set(results).size).toBe(1);
  });
});
