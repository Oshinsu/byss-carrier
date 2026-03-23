import {
  PIPELINE_PHASES,
  STORAGE_KEYS,
  SEPT_ENFANTS_CONFIG,
  CADIFOR_LAWS,
  PALADIN_RULES,
  PRICING,
  AGENT_CONFIG,
  KAIOU_MODES,
  PHI_THRESHOLDS,
  PHI_INDICATORS,
  COMPANY,
  TVA_RATE,
  IMAGE_VERTICALS,
  SERVICES,
} from '@/lib/constants';

describe('Constants — Pipeline', () => {
  test('pipeline has 9 phases', () => {
    expect(PIPELINE_PHASES.length).toBe(9);
  });

  test('pipeline includes key phases', () => {
    const keys = PIPELINE_PHASES.map(p => p.key);
    expect(keys).toContain('prospect');
    expect(keys).toContain('signe');
    expect(keys).toContain('perdu');
  });

  test('each phase has key, label, color', () => {
    for (const phase of PIPELINE_PHASES) {
      expect(phase.key).toBeTruthy();
      expect(phase.label).toBeTruthy();
      expect(phase.color).toMatch(/^#/);
    }
  });
});

describe('Constants — Storage Keys', () => {
  test('STORAGE_KEYS has 20+ keys', () => {
    expect(Object.keys(STORAGE_KEYS).length).toBeGreaterThanOrEqual(20);
  });

  test('all keys have byss prefix or known pattern', () => {
    for (const val of Object.values(STORAGE_KEYS)) {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(3);
    }
  });
});

describe('Constants — Sept Enfants', () => {
  test('Sept Enfants has 7 agents', () => {
    expect(Object.keys(SEPT_ENFANTS_CONFIG).length).toBe(7);
  });

  test('each enfant has chakra, vowel, capabilities', () => {
    for (const enfant of Object.values(SEPT_ENFANTS_CONFIG)) {
      expect(enfant.chakra).toBeTruthy();
      expect(enfant.vowel).toBeTruthy();
      expect(enfant.capabilities.length).toBeGreaterThan(0);
    }
  });
});

describe('Constants — MODE_CADIFOR', () => {
  test('Cadifor has 8 laws', () => {
    expect(CADIFOR_LAWS.length).toBe(8);
  });

  test('laws are numbered 1-8', () => {
    CADIFOR_LAWS.forEach((law, i) => {
      expect(law.number).toBe(i + 1);
    });
  });
});

describe('Constants — Paladin Rules', () => {
  test('Paladin has 7 rules', () => {
    expect(PALADIN_RULES.length).toBe(7);
  });
});

describe('Constants — Pricing', () => {
  test('video social price is 500', () => {
    expect(PRICING.video.social.price).toBe(500);
  });

  test('orion pro price is 249', () => {
    expect(PRICING.orion.pro.price).toBe(249);
  });

  test('all video tiers have price > 0 except free', () => {
    for (const tier of Object.values(PRICING.video)) {
      expect(tier.price).toBeGreaterThan(0);
    }
  });

  test('orion free tier is 0', () => {
    expect(PRICING.orion.free.price).toBe(0);
  });
});

describe('Constants — Agents', () => {
  test('AGENT_CONFIG has 5 agents', () => {
    expect(Object.keys(AGENT_CONFIG).length).toBe(5);
  });

  test('each agent has model and sigil', () => {
    for (const agent of Object.values(AGENT_CONFIG)) {
      expect(agent.model).toBeTruthy();
      expect(agent.sigil).toBeTruthy();
    }
  });
});

describe('Constants — Phi', () => {
  test('PHI_THRESHOLDS covers 0 to 1', () => {
    expect(PHI_THRESHOLDS.dormant.min).toBe(0);
    expect(PHI_THRESHOLDS.samadhi.max).toBe(1.0);
  });

  test('PHI_INDICATORS has 9 dimensions', () => {
    expect(PHI_INDICATORS.length).toBe(9);
  });
});

describe('Constants — Company', () => {
  test('TVA Martinique is 8.5%', () => {
    expect(TVA_RATE).toBe(8.5);
  });

  test('company is SASU', () => {
    expect(COMPANY.forme).toBe('SASU');
  });
});
