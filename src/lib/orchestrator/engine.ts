// ═══════════════════════════════════════════════════════════
// BYSS GROUP — Orchestration Engine
// Connects all systems. Manages multi-step workflows.
// The brain of the EMPIRE.
// ═══════════════════════════════════════════════════════════

/* ─── Types ─────────────────────────────────────────────── */

export type StepAction =
  | "analyze"
  | "email"
  | "propose"
  | "invoice"
  | "schedule"
  | "notify"
  | "create"
  | "generate"
  | "fetch"
  | "score"
  | "track"
  | "update";

export type StepStatus = "pending" | "running" | "done" | "failed";
export type WorkflowStatus = "pending" | "running" | "done" | "failed";

export interface WorkflowStep {
  id: string;
  action: StepAction;
  label: string;
  target: string; // prospect ID, invoice ID, etc.
  params: Record<string, unknown>;
  dependsOn?: string[]; // step IDs that must complete first
  status: StepStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: unknown;
}

export interface Workflow {
  id: string;
  name: string;
  templateId?: string;
  steps: WorkflowStep[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: WorkflowStatus;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  buildSteps: (params: Record<string, unknown>) => WorkflowStep[];
}

/* ─── ID Generation ─────────────────────────────────────── */

let counter = 0;
function genId(prefix: string): string {
  counter++;
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${counter.toString(36)}`;
}

/* ─── Step Executors ────────────────────────────────────── */
// Each action type maps to an async executor.
// For now: simulated. Wire to real APIs (Supabase, Claude, Resend, etc.) as needed.

type StepExecutor = (step: WorkflowStep) => Promise<unknown>;

const executors: Record<StepAction, StepExecutor> = {
  analyze: async (step) => {
    // Claude analysis via /api/ai
    await delay(800 + Math.random() * 1200);
    return { score: Math.floor(60 + Math.random() * 40), insights: 3 };
  },
  email: async (step) => {
    // Resend / email composer
    await delay(500 + Math.random() * 500);
    return { sent: true, messageId: genId("msg") };
  },
  propose: async (step) => {
    // Generate proposal PDF via Documenso
    await delay(1200 + Math.random() * 800);
    return { pdfUrl: `/proposals/${step.target}.pdf`, pages: 4 };
  },
  invoice: async (step) => {
    // Create invoice draft in Finance module
    await delay(400 + Math.random() * 400);
    return { invoiceId: genId("inv"), amount: step.params.amount ?? 0 };
  },
  schedule: async (step) => {
    // Schedule follow-up in calendar
    await delay(300 + Math.random() * 300);
    const days = (step.params.delayDays as number) ?? 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return { scheduledFor: date.toISOString(), type: "follow-up" };
  },
  notify: async (step) => {
    // WhatsApp via OpenClaw / push notification
    await delay(300 + Math.random() * 200);
    return { delivered: true, channel: step.params.channel ?? "push" };
  },
  create: async (step) => {
    // Create entity in Supabase
    await delay(400 + Math.random() * 300);
    return { entityId: genId("ent"), type: step.params.entityType };
  },
  generate: async (step) => {
    // Generate content (Kling prompt, Claude briefing, etc.)
    await delay(1500 + Math.random() * 1500);
    return { content: "generated", tokens: Math.floor(200 + Math.random() * 800) };
  },
  fetch: async (step) => {
    // Fetch data from Supabase / external
    await delay(300 + Math.random() * 400);
    return { count: Math.floor(1 + Math.random() * 15), source: step.params.source };
  },
  score: async (step) => {
    // Score a prospect
    await delay(600 + Math.random() * 600);
    return { score: Math.floor(40 + Math.random() * 60), tier: "A" };
  },
  track: async (step) => {
    // Track status of external process
    await delay(500 + Math.random() * 1000);
    return { status: "in_progress", progress: Math.floor(30 + Math.random() * 70) };
  },
  update: async (step) => {
    // Update entity
    await delay(300 + Math.random() * 300);
    return { updated: true };
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─── Workflow Templates ────────────────────────────────── */

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "nouveau-prospect",
    name: "Nouveau Prospect",
    description: "Cr\u00e9er, analyser, scorer, email de bienvenue, relance J+3",
    icon: "UserPlus",
    buildSteps: (params) => [
      {
        id: "s1",
        action: "create",
        label: "Cr\u00e9er prospect",
        target: (params.prospectName as string) ?? "Prospect",
        params: { entityType: "prospect", ...params },
        status: "pending",
      },
      {
        id: "s2",
        action: "analyze",
        label: "Analyse Claude",
        target: (params.prospectName as string) ?? "Prospect",
        params: { depth: "full" },
        dependsOn: ["s1"],
        status: "pending",
      },
      {
        id: "s3",
        action: "score",
        label: "Scoring",
        target: (params.prospectName as string) ?? "Prospect",
        params: {},
        dependsOn: ["s2"],
        status: "pending",
      },
      {
        id: "s4",
        action: "email",
        label: "Email de bienvenue",
        target: (params.prospectName as string) ?? "Prospect",
        params: { template: "welcome", tone: "CADIFOR" },
        dependsOn: ["s3"],
        status: "pending",
      },
      {
        id: "s5",
        action: "schedule",
        label: "Relance J+3",
        target: (params.prospectName as string) ?? "Prospect",
        params: { delayDays: 3, type: "relance" },
        dependsOn: ["s4"],
        status: "pending",
      },
    ],
  },
  {
    id: "closer-deal",
    name: "Closer un deal",
    description: "Phase \u2192 proposal PDF \u2192 Documenso \u2192 facture \u2192 feedback J+1",
    icon: "Handshake",
    buildSteps: (params) => [
      {
        id: "s1",
        action: "update",
        label: "MAJ phase pipeline",
        target: (params.dealName as string) ?? "Deal",
        params: { phase: "closing", ...params },
        status: "pending",
      },
      {
        id: "s2",
        action: "generate",
        label: "G\u00e9n\u00e9rer proposal PDF",
        target: (params.dealName as string) ?? "Deal",
        params: { format: "pdf", template: "proposal-v2" },
        dependsOn: ["s1"],
        status: "pending",
      },
      {
        id: "s3",
        action: "email",
        label: "Envoi via Documenso",
        target: (params.dealName as string) ?? "Deal",
        params: { channel: "documenso", requireSign: true },
        dependsOn: ["s2"],
        status: "pending",
      },
      {
        id: "s4",
        action: "invoice",
        label: "Cr\u00e9er brouillon facture",
        target: (params.dealName as string) ?? "Deal",
        params: { amount: params.amount ?? 0 },
        dependsOn: ["s3"],
        status: "pending",
      },
      {
        id: "s5",
        action: "schedule",
        label: "Feedback J+1",
        target: (params.dealName as string) ?? "Deal",
        params: { delayDays: 1, type: "feedback" },
        dependsOn: ["s4"],
        status: "pending",
      },
    ],
  },
  {
    id: "morning-briefing",
    name: "Morning Briefing",
    description: "Relances overdue \u2192 RDVs du jour \u2192 briefing Claude \u2192 WhatsApp",
    icon: "Coffee",
    buildSteps: () => [
      {
        id: "s1",
        action: "fetch",
        label: "Relances overdue",
        target: "pipeline",
        params: { source: "supabase", filter: "overdue_relances" },
        status: "pending",
      },
      {
        id: "s2",
        action: "fetch",
        label: "RDVs du jour",
        target: "calendar",
        params: { source: "calendar", filter: "today" },
        status: "pending",
      },
      {
        id: "s3",
        action: "generate",
        label: "Briefing Claude",
        target: "briefing",
        params: { model: "claude", format: "summary" },
        dependsOn: ["s1", "s2"],
        status: "pending",
      },
      {
        id: "s4",
        action: "notify",
        label: "Envoi WhatsApp",
        target: "gary",
        params: { channel: "whatsapp", via: "openclaw" },
        dependsOn: ["s3"],
        status: "pending",
      },
    ],
  },
  {
    id: "production-video",
    name: "Production Vid\u00e9o",
    description: "Entr\u00e9e vid\u00e9o \u2192 prompt Kling \u2192 tracking \u2192 notification \u2192 feedback",
    icon: "Video",
    buildSteps: (params) => [
      {
        id: "s1",
        action: "create",
        label: "Cr\u00e9er entr\u00e9e vid\u00e9o",
        target: (params.videoTitle as string) ?? "Vid\u00e9o",
        params: { entityType: "video", ...params },
        status: "pending",
      },
      {
        id: "s2",
        action: "generate",
        label: "Prompt Kling",
        target: (params.videoTitle as string) ?? "Vid\u00e9o",
        params: { engine: "kling", style: params.style ?? "cinematic" },
        dependsOn: ["s1"],
        status: "pending",
      },
      {
        id: "s3",
        action: "track",
        label: "Suivi g\u00e9n\u00e9ration",
        target: (params.videoTitle as string) ?? "Vid\u00e9o",
        params: { pollInterval: 30 },
        dependsOn: ["s2"],
        status: "pending",
      },
      {
        id: "s4",
        action: "notify",
        label: "Notification livraison",
        target: "gary",
        params: { channel: "push", message: "Vid\u00e9o pr\u00eate" },
        dependsOn: ["s3"],
        status: "pending",
      },
      {
        id: "s5",
        action: "schedule",
        label: "Feedback loop",
        target: (params.videoTitle as string) ?? "Vid\u00e9o",
        params: { delayDays: 0, type: "review" },
        dependsOn: ["s4"],
        status: "pending",
      },
    ],
  },
];

/* ─── Orchestrator Engine ───────────────────────────────── */

type WorkflowListener = (workflow: Workflow) => void;

class OrchestrationEngine {
  private workflows: Map<string, Workflow> = new Map();
  private listeners: Set<WorkflowListener> = new Set();

  /* ── Subscribe to state changes ── */
  subscribe(fn: WorkflowListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(workflow: Workflow) {
    for (const fn of this.listeners) {
      try {
        fn(workflow);
      } catch {
        // Listener error — ignore
      }
    }
  }

  /* ── Create a workflow from template or raw steps ── */
  createWorkflow(
    name: string,
    steps: WorkflowStep[],
    templateId?: string
  ): Workflow {
    const workflow: Workflow = {
      id: genId("wf"),
      name,
      templateId,
      steps: steps.map((s) => ({ ...s })),
      createdAt: new Date(),
      status: "pending",
    };
    this.workflows.set(workflow.id, workflow);
    this.emit(workflow);
    return workflow;
  }

  /* ── Create from template ── */
  createFromTemplate(
    templateId: string,
    params: Record<string, unknown> = {}
  ): Workflow | null {
    const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return null;
    const steps = template.buildSteps(params);
    return this.createWorkflow(template.name, steps, templateId);
  }

  /* ── Execute a workflow ── */
  async executeWorkflow(workflowId: string): Promise<Workflow | null> {
    const wf = this.workflows.get(workflowId);
    if (!wf) return null;
    if (wf.status === "running") return wf;

    wf.status = "running";
    wf.startedAt = new Date();
    this.emit(wf);

    try {
      await this.runSteps(wf);
      const hasFailure = wf.steps.some((s) => s.status === "failed");
      wf.status = hasFailure ? "failed" : "done";
      wf.completedAt = new Date();
    } catch {
      wf.status = "failed";
      wf.completedAt = new Date();
    }

    this.emit(wf);
    return wf;
  }

  /* ── Run steps respecting dependency graph ── */
  private async runSteps(wf: Workflow): Promise<void> {
    const completed = new Set<string>();

    while (completed.size < wf.steps.length) {
      // Find steps ready to run (dependencies met, still pending)
      const ready = wf.steps.filter(
        (s) =>
          s.status === "pending" &&
          (!s.dependsOn || s.dependsOn.every((dep) => completed.has(dep)))
      );

      if (ready.length === 0) {
        // Check if we have running steps — if not, we're stuck
        const running = wf.steps.filter((s) => s.status === "running");
        if (running.length === 0) break; // deadlock or all done
        await delay(100);
        continue;
      }

      // Execute ready steps in parallel
      await Promise.all(
        ready.map(async (step) => {
          step.status = "running";
          step.startedAt = new Date();
          this.emit(wf);

          try {
            const executor = executors[step.action];
            step.result = await executor(step);
            step.status = "done";
            step.completedAt = new Date();
            completed.add(step.id);
          } catch (err) {
            step.status = "failed";
            step.completedAt = new Date();
            step.error =
              err instanceof Error ? err.message : "Unknown error";
            completed.add(step.id); // Mark as completed (failed) to unblock graph
          }

          this.emit(wf);
        })
      );
    }
  }

  /* ── Queries ── */
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getWorkflowStatus(id: string): WorkflowStatus | undefined {
    return this.workflows.get(id)?.status;
  }

  listActiveWorkflows(): Workflow[] {
    return Array.from(this.workflows.values()).filter(
      (w) => w.status === "pending" || w.status === "running"
    );
  }

  listAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  listCompletedWorkflows(limit = 10): Workflow[] {
    return Array.from(this.workflows.values())
      .filter((w) => w.status === "done" || w.status === "failed")
      .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
      .slice(0, limit);
  }

  /* ── Stats ── */
  getStats() {
    const all = Array.from(this.workflows.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayWf = all.filter((w) => w.createdAt >= today);
    const completed = all.filter((w) => w.status === "done");
    const totalSteps = all.reduce((sum, w) => sum + w.steps.length, 0);
    const durations = completed
      .filter((w) => w.startedAt && w.completedAt)
      .map((w) => w.completedAt!.getTime() - w.startedAt!.getTime());
    const avgDuration =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;
    const successRate =
      all.length > 0
        ? (completed.length / all.filter((w) => w.status !== "pending" && w.status !== "running").length) * 100
        : 100;

    return {
      workflowsToday: todayWf.length,
      totalSteps,
      avgDurationMs: Math.round(avgDuration),
      successRate: Math.round(successRate),
      totalWorkflows: all.length,
      activeWorkflows: all.filter(
        (w) => w.status === "pending" || w.status === "running"
      ).length,
    };
  }
}

/* ─── Singleton ─────────────────────────────────────────── */

export const orchestrator = new OrchestrationEngine();

/* ─── Helper: duration formatting ───────────────────────── */

export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m${rs > 0 ? ` ${rs}s` : ""}`;
}
