import { classifyIntent, JARVIS_INTENTS, JARVIS_QUICK_ACTIONS } from '@/lib/jarvis';

describe('JARVIS Intent Classification', () => {
  test('classifies briefing intents', () => {
    expect(classifyIntent('bonjour').action).toBe('briefing');
    expect(classifyIntent('briefing du jour').action).toBe('briefing');
    expect(classifyIntent('salut').action).toBe('briefing');
    expect(classifyIntent('hey').action).toBe('briefing');
  });

  test('classifies relance with param extraction', () => {
    const result = classifyIntent('relancer Alpha Diving');
    expect(result.action).toBe('relance');
    expect(result.param).toContain('Alpha Diving');
  });

  test('classifies email with param', () => {
    const result = classifyIntent('email pour Digicel');
    expect(result.action).toBe('email');
    expect(result.param).toContain('Digicel');
  });

  test('classifies pipeline stats', () => {
    expect(classifyIntent('combien de prospects').action).toBe('pipeline_stats');
    expect(classifyIntent('pipeline').action).toBe('pipeline_stats');
  });

  test('classifies finance stats', () => {
    expect(classifyIntent('factures').action).toBe('finance_stats');
    expect(classifyIntent('chiffres').action).toBe('finance_stats');
  });

  test('classifies gulf stream', () => {
    expect(classifyIntent('gulf stream').action).toBe('gulf_stream');
    expect(classifyIntent('polymarket').action).toBe('gulf_stream');
  });

  test('classifies research with param', () => {
    const result = classifyIntent('recherche sur le telecom');
    expect(result.action).toBe('research');
    expect(result.param).toBeDefined();
  });

  test('classifies calendar', () => {
    expect(classifyIntent('calendrier').action).toBe('calendar');
    expect(classifyIntent('rdv').action).toBe('calendar');
  });

  test('classifies production', () => {
    expect(classifyIntent('production').action).toBe('production');
    expect(classifyIntent('video').action).toBe('production');
  });

  test('classifies village agent names', () => {
    expect(classifyIntent('sorel').action).toBe('village');
    expect(classifyIntent('kael').action).toBe('village');
  });

  test('strips jarvis prefix', () => {
    expect(classifyIntent('jarvis, briefing').action).toBe('briefing');
    expect(classifyIntent('Jarvis pipeline').action).toBe('pipeline_stats');
  });

  test('defaults to general chat', () => {
    expect(classifyIntent('raconte moi une blague').action).toBe('chat');
    expect(classifyIntent('quelque chose de random').action).toBe('chat');
  });

  test('preserves raw text', () => {
    const result = classifyIntent('  bonjour jarvis  ');
    expect(result.raw).toBe('bonjour jarvis');
  });

  test('JARVIS_INTENTS has 14+ patterns', () => {
    expect(JARVIS_INTENTS.length).toBeGreaterThanOrEqual(14);
  });

  test('JARVIS_QUICK_ACTIONS has 6 actions', () => {
    expect(JARVIS_QUICK_ACTIONS.length).toBe(6);
  });
});
