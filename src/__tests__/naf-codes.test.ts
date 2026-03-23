import { nafToSector, NAF_TO_SECTOR, BYSS_VERTICALS } from '@/lib/data/naf-codes';

describe('NAF Code Mapping', () => {
  test('maps telecom codes', () => {
    expect(nafToSector('61.10Z')).toBe('Telecom');
    expect(nafToSector('61.20Z')).toBe('Telecom');
    expect(nafToSector('61.30Z')).toBe('Telecom');
    expect(nafToSector('61.90Z')).toBe('Telecom');
  });

  test('maps hotel codes', () => {
    expect(nafToSector('55.10Z')).toBe('Hotellerie');
    expect(nafToSector('55.20Z')).toBe('Hotellerie');
  });

  test('maps restaurant codes', () => {
    expect(nafToSector('56.10A')).toBe('Restauration');
    expect(nafToSector('56.10B')).toBe('Restauration');
  });

  test('maps BTP codes', () => {
    expect(nafToSector('41.20A')).toBe('BTP');
    expect(nafToSector('43.11Z')).toBe('BTP');
  });

  test('maps tech codes', () => {
    expect(nafToSector('62.01Z')).toBe('Tech');
    expect(nafToSector('62.02A')).toBe('Tech');
  });

  test('maps transport maritime', () => {
    expect(nafToSector('50.10Z')).toBe('Transport Maritime');
  });

  test('maps distillerie codes', () => {
    expect(nafToSector('11.01Z')).toBe('Distillerie');
    expect(nafToSector('11.02A')).toBe('Distillerie');
  });

  test('returns Autre for unknown codes', () => {
    expect(nafToSector('99.99Z')).toBe('Autre');
    expect(nafToSector('00.00A')).toBe('Autre');
  });

  test('returns Autre for null/undefined', () => {
    expect(nafToSector(null)).toBe('Autre');
    expect(nafToSector(undefined)).toBe('Autre');
    expect(nafToSector('')).toBe('Autre');
  });

  test('has all BYSS verticals', () => {
    expect(BYSS_VERTICALS.length).toBe(19);
  });

  test('verticals include key sectors', () => {
    expect(BYSS_VERTICALS).toContain('Telecom');
    expect(BYSS_VERTICALS).toContain('Hotellerie');
    expect(BYSS_VERTICALS).toContain('Tech');
    expect(BYSS_VERTICALS).toContain('BTP');
    expect(BYSS_VERTICALS).toContain('Autre');
  });

  test('has 300+ NAF mappings', () => {
    expect(Object.keys(NAF_TO_SECTOR).length).toBeGreaterThanOrEqual(300);
  });
});
