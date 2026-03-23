import { sanitizeInput, isValidUUID, isValidEmail, sanitizeSearchQuery } from '@/lib/security/sanitize';
import { rateLimit } from '@/lib/security/rate-limiter';
import { maskKey } from '@/lib/security/api-guard';

describe('Security', () => {
  describe('Input Sanitization', () => {
    test('removes script tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>hello')).toBe('hello');
    });
    test('removes javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    });
    test('truncates long input', () => {
      expect(sanitizeInput('a'.repeat(20000), 100).length).toBe(100);
    });
    test('handles null/undefined', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });
  });

  describe('UUID Validation', () => {
    test('accepts valid UUID', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });
    test('rejects invalid UUID', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
    });
  });

  describe('Email Validation', () => {
    test('accepts valid email', () => {
      expect(isValidEmail('gary@byss-group.com')).toBe(true);
    });
    test('rejects invalid email', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
    });
  });

  describe('Search Query Sanitization', () => {
    test('escapes SQL wildcards', () => {
      expect(sanitizeSearchQuery('100% match_test')).toBe('100\\% match\\_test');
    });
    test('truncates long queries', () => {
      expect(sanitizeSearchQuery('a'.repeat(300)).length).toBe(200);
    });
  });

  describe('Rate Limiter', () => {
    test('allows requests under limit', () => {
      expect(rateLimit('test-1', 5, 1000).allowed).toBe(true);
    });
    test('blocks after limit', () => {
      for (let i = 0; i < 5; i++) rateLimit('test-2', 5, 60000);
      expect(rateLimit('test-2', 5, 60000).allowed).toBe(false);
    });
  });

  describe('API Key Masking', () => {
    test('masks long keys', () => {
      expect(maskKey('sk-ant-api03-abcdefghijk')).toBe('sk-a...hijk');
    });
    test('masks short keys', () => {
      expect(maskKey('abc')).toBe('***');
    });
  });
});
