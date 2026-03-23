import { getToolsForAgent, canAgentUseTool, toolRequiresGate, getTool, TOOL_REGISTRY } from '@/lib/tools/registry';

describe('Tool Registry', () => {
  test('sorel has CRM tools', () => {
    const tools = getToolsForAgent('sorel');
    expect(tools.some(t => t.name === 'search_prospects')).toBe(true);
    expect(tools.some(t => t.name === 'draft_email')).toBe(true);
    expect(tools.some(t => t.name === 'create_invoice')).toBe(true);
  });

  test('nerel has production tools', () => {
    const tools = getToolsForAgent('nerel');
    expect(tools.some(t => t.name === 'generate_image')).toBe(true);
    expect(tools.some(t => t.name === 'generate_video')).toBe(true);
  });

  test('nerel cannot create invoices', () => {
    expect(canAgentUseTool('nerel', 'create_invoice')).toBe(false);
  });

  test('evren can analyze markets', () => {
    expect(canAgentUseTool('evren', 'analyze_market')).toBe(true);
  });

  test('draft_email requires gate', () => {
    expect(toolRequiresGate('draft_email')).toBe(true);
  });

  test('create_invoice requires gate', () => {
    expect(toolRequiresGate('create_invoice')).toBe(true);
  });

  test('execute_trade requires gate', () => {
    expect(toolRequiresGate('execute_trade')).toBe(true);
  });

  test('semantic_search does not require gate', () => {
    expect(toolRequiresGate('semantic_search')).toBe(false);
  });

  test('search_prospects does not require gate', () => {
    expect(toolRequiresGate('search_prospects')).toBe(false);
  });

  test('unknown tool defaults to requiring gate', () => {
    expect(toolRequiresGate('nonexistent_tool')).toBe(true);
  });

  test('all tools have valid structure', () => {
    for (const tool of TOOL_REGISTRY) {
      expect(tool.name).toBeTruthy();
      expect(tool.version).toBeDefined();
      expect(tool.agentAccess.length).toBeGreaterThan(0);
      expect(tool.category).toBeTruthy();
      expect(tool.handler).toBeTruthy();
    }
  });

  test('getTool returns undefined for unknown', () => {
    expect(getTool('nonexistent')).toBeUndefined();
  });

  test('registry has 12 tools', () => {
    expect(TOOL_REGISTRY.length).toBe(12);
  });
});
