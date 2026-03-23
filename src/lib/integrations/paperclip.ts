/**
 * Paperclip API client
 * Communicates with the Paperclip agent orchestrator on localhost:3100.
 */

const PAPERCLIP_URL = process.env.PAPERCLIP_URL ?? "http://localhost:3100";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AgentConfig {
  name: string;
  model: string;
  role: string;
  systemPrompt?: string;
  tools?: string[];
  maxTokens?: number;
}

export interface GoalConfig {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  deadline?: string;
  assignedAgents?: string[];
}

export interface TaskConfig {
  title: string;
  description: string;
  agentId: string;
  input?: Record<string, unknown>;
  dependsOn?: string[];
}

export interface CompanyConfig {
  name: string;
  domain: string;
  agents: AgentConfig[];
  goals: GoalConfig[];
  metadata?: Record<string, unknown>;
}

interface Agent {
  id: string;
  name: string;
  model: string;
  role: string;
  status: "idle" | "running" | "error";
  lastActive?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  priority: string;
  progress: number;
  tasks: Task[];
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  agentId: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: unknown;
}

interface PaperclipError {
  error: string;
  status: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function paperclipFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${PAPERCLIP_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let body: PaperclipError | null = null;
    try {
      body = (await res.json()) as PaperclipError;
    } catch {
      // ignore parse failure
    }
    throw new Error(
      body?.error ?? `Paperclip request failed: ${res.status} ${res.statusText}`
    );
  }

  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List all registered agents.
 */
export async function getAgents(): Promise<Agent[]> {
  return paperclipFetch<Agent[]>("/api/agents");
}

/**
 * Register a new agent.
 */
export async function createAgent(config: AgentConfig): Promise<Agent> {
  return paperclipFetch<Agent>("/api/agents", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

/**
 * List all goals.
 */
export async function getGoals(): Promise<Goal[]> {
  return paperclipFetch<Goal[]>("/api/goals");
}

/**
 * Create a new goal.
 */
export async function createGoal(goal: GoalConfig): Promise<Goal> {
  return paperclipFetch<Goal>("/api/goals", {
    method: "POST",
    body: JSON.stringify(goal),
  });
}

/**
 * Assign a task to a goal.
 */
export async function assignTask(
  goalId: string,
  task: TaskConfig
): Promise<Task> {
  return paperclipFetch<Task>(`/api/goals/${goalId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

/**
 * Get the current company configuration.
 */
export async function getCompanyConfig(): Promise<CompanyConfig> {
  return paperclipFetch<CompanyConfig>("/api/company");
}

/**
 * Sync (upsert) the company configuration.
 */
export async function syncCompanyConfig(
  config: CompanyConfig
): Promise<CompanyConfig> {
  return paperclipFetch<CompanyConfig>("/api/company", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}
