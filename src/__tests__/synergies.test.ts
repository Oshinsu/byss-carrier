import {
  triggerSynergy,
  onProspectSigned,
  onEmailSent,
  onInvoicePaid,
  onContactAdded,
  onSprintCompleted,
  onEventCreated,
  onVideoCompleted,
  onResearchCompleted,
  SYNERGY_RULES,
} from '@/lib/synergies';

// Mock the notifications module so Supabase calls don't fire
vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

describe('Synergy Engine', () => {
  test('all 8 convenience functions are exported', () => {
    expect(typeof onProspectSigned).toBe('function');
    expect(typeof onEmailSent).toBe('function');
    expect(typeof onInvoicePaid).toBe('function');
    expect(typeof onContactAdded).toBe('function');
    expect(typeof onSprintCompleted).toBe('function');
    expect(typeof onEventCreated).toBe('function');
    expect(typeof onVideoCompleted).toBe('function');
    expect(typeof onResearchCompleted).toBe('function');
  });

  test('triggerSynergy does not throw on valid trigger', async () => {
    await expect(
      triggerSynergy('pipeline', 'prospect_signed', { prospectId: 'test', prospectName: 'Test Corp', basket: 5000 })
    ).resolves.not.toThrow();
  });

  test('triggerSynergy silently handles unknown triggers', async () => {
    await expect(
      triggerSynergy('unknown', 'unknown_trigger', {})
    ).resolves.not.toThrow();
  });

  test('onProspectSigned does not throw', async () => {
    await expect(onProspectSigned('test', 'Test Corp', 5000)).resolves.not.toThrow();
  });

  test('onEmailSent does not throw', async () => {
    await expect(onEmailSent('test-id', 'Prospect Name', 'custom')).resolves.not.toThrow();
  });

  test('onInvoicePaid does not throw', async () => {
    await expect(onInvoicePaid('inv-1', 'Client', 1500)).resolves.not.toThrow();
  });

  test('onContactAdded does not throw', async () => {
    await expect(onContactAdded('John', 'Tech')).resolves.not.toThrow();
  });

  test('onVideoCompleted does not throw', async () => {
    await expect(onVideoCompleted('vid-1', 'Clip social', 'BYSS')).resolves.not.toThrow();
  });

  test('onResearchCompleted does not throw', async () => {
    await expect(onResearchCompleted('res-1', 'Telecom Martinique', 'market')).resolves.not.toThrow();
  });

  test('SYNERGY_RULES has 10+ rules', () => {
    expect(SYNERGY_RULES.length).toBeGreaterThanOrEqual(10);
  });

  test('each rule has required fields', () => {
    for (const rule of SYNERGY_RULES) {
      expect(rule.id).toBeTruthy();
      expect(rule.source).toBeTruthy();
      expect(rule.trigger).toBeTruthy();
      expect(typeof rule.execute).toBe('function');
    }
  });
});
