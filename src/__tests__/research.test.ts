import {
  RESEARCH_STAGES,
  RESEARCH_MODES,
  DEPTH_CONFIG,
  RESEARCH_DOMAINS,
  DOMAIN_AGENTS,
  getDepthModel,
  resolveAgent,
  createStageMap,
  mergeIntoGraph,
  type KnowledgeGraph,
  type KnowledgeNode,
  type KnowledgeEdge,
} from '@/lib/research';

describe('Research — Configuration', () => {
  test('has 7 research stages', () => {
    expect(RESEARCH_STAGES.length).toBe(7);
  });

  test('stages follow EurekaClaw pipeline order', () => {
    expect(RESEARCH_STAGES[0].id).toBe('question');
    expect(RESEARCH_STAGES[6].id).toBe('report');
  });

  test('has 3 research modes', () => {
    expect(RESEARCH_MODES.length).toBe(3);
  });

  test('has 3 depth levels', () => {
    expect(Object.keys(DEPTH_CONFIG).length).toBe(3);
    expect(DEPTH_CONFIG.quick.model).toBe('haiku');
    expect(DEPTH_CONFIG.deep.model).toBe('opus');
  });

  test('has 7 research domains', () => {
    expect(RESEARCH_DOMAINS.length).toBe(7);
  });

  test('each domain maps to an agent', () => {
    for (const domain of RESEARCH_DOMAINS) {
      const agent = DOMAIN_AGENTS[domain.id];
      expect(agent).toBeDefined();
      expect(agent.agent).toBeTruthy();
      expect(agent.model).toBeTruthy();
    }
  });
});

describe('Research — getDepthModel', () => {
  test('deep geopolitics returns opus', () => {
    expect(getDepthModel('deep', 'geopolitics')).toBe('opus');
  });

  test('deep legal returns opus', () => {
    expect(getDepthModel('deep', 'legal')).toBe('opus');
  });

  test('medium finance returns deepseek', () => {
    expect(getDepthModel('medium', 'finance')).toBe('deepseek-v3.2');
  });

  test('quick finance returns haiku', () => {
    expect(getDepthModel('quick', 'finance')).toBe('haiku');
  });

  test('medium technology returns sonnet', () => {
    expect(getDepthModel('medium', 'technology')).toBe('sonnet');
  });
});

describe('Research — resolveAgent', () => {
  test('technology maps to evren', () => {
    expect(resolveAgent('technology').agent).toBe('evren');
  });

  test('market maps to sorel', () => {
    expect(resolveAgent('market').agent).toBe('sorel');
  });

  test('geopolitics maps to kael', () => {
    expect(resolveAgent('geopolitics').agent).toBe('kael');
  });
});

describe('Research — createStageMap', () => {
  test('creates map with all stages pending', () => {
    const map = createStageMap();
    expect(Object.keys(map).length).toBe(7);
    expect(map.question).toBe('pending');
    expect(map.report).toBe('pending');
  });

  test('creates map with custom initial status', () => {
    const map = createStageMap('active');
    expect(map.question).toBe('active');
  });
});

describe('Research — mergeIntoGraph', () => {
  test('merges new nodes without duplicates', () => {
    const existing: KnowledgeGraph = {
      nodes: [{ id: 'a', label: 'A', x: 0, y: 0, size: 10, color: '#fff' }],
      edges: [],
    };
    const newNodes: KnowledgeNode[] = [
      { id: 'a', label: 'A-dup', x: 1, y: 1, size: 10, color: '#fff' },
      { id: 'b', label: 'B', x: 2, y: 2, size: 10, color: '#fff' },
    ];
    const result = mergeIntoGraph(existing, newNodes, []);
    expect(result.nodes.length).toBe(2);
  });

  test('merges new edges without duplicates', () => {
    const existing: KnowledgeGraph = {
      nodes: [],
      edges: [{ source: 'a', target: 'b', weight: 1 }],
    };
    const newEdges: KnowledgeEdge[] = [
      { source: 'a', target: 'b', weight: 2 },
      { source: 'b', target: 'c', weight: 1 },
    ];
    const result = mergeIntoGraph(existing, [], newEdges);
    expect(result.edges.length).toBe(2);
  });
});
