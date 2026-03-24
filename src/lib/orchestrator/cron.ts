// ═══════════════════════════════════════════════════════════
// BYSS GROUP — Autonomous Cron System
// Le vaisseau opère seul. Les actions sensibles passent par les gates.
// ═══════════════════════════════════════════════════════════

/* ─── Types ─────────────────────────────────────────────── */

export interface CronTask {
  id: string;
  name: string;
  schedule: string;
  description: string;
  enabled: boolean;
  lastRun?: string;
  lastStatus?: "success" | "fail";
  lastMessage?: string;
  handler: () => Promise<CronResult>;
}

export interface CronResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface CronExecution {
  taskId: string;
  taskName: string;
  timestamp: string;
  status: "success" | "fail";
  message: string;
  durationMs: number;
}

/* ─── Storage keys ─────────────────────────────────────── */

const STORAGE_KEYS = {
  autonomousMode: "byss-cron-autonomous",
  taskStates: "byss-cron-tasks",
  executionLog: "byss-cron-executions",
} as const;

/* ─── Persistence helpers ──────────────────────────────── */

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — silent */ }
}

/* ─── Task Definitions ─────────────────────────────────── */

export const CRON_TASKS: CronTask[] = [
  {
    id: "daily_insight",
    name: "Insight Quotidien",
    schedule: "6h00",
    description: "Génère un insight IA quotidien à partir des données pipeline + finance",
    enabled: true,
    handler: async () => {
      const res = await fetch("/api/insights", { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "Erreur inconnue");
        return { success: false, message: `Erreur ${res.status}: ${text}` };
      }
      const data = await res.json().catch(() => ({}));
      return { success: true, message: "Insight généré", data };
    },
  },
  {
    id: "auto_relance",
    name: "Relances Automatiques J+7",
    schedule: "9h00",
    description: "Détecte les prospects sans contact depuis 7 jours, génère des relances",
    enabled: true,
    handler: async () => {
      // Import dynamically to avoid circular deps
      const { checkStaleProspects, generateRelanceActions } = await import("./auto-relance");
      const stale = await checkStaleProspects();
      if (stale.length === 0) {
        return { success: true, message: "Aucun prospect à relancer" };
      }
      await generateRelanceActions(stale);
      return {
        success: true,
        message: `${stale.length} relance(s) créée(s)`,
        data: { count: stale.length, prospects: stale.map((p) => p.name) },
      };
    },
  },
  {
    id: "market_scan",
    name: "Scan Polymarket",
    schedule: "12h00",
    description: "Analyse les top marchés Polymarket pour Gulf Stream",
    enabled: true,
    handler: async () => {
      const res = await fetch("/api/polymarket");
      if (!res.ok) {
        return { success: false, message: `Erreur Polymarket: ${res.status}` };
      }
      const data = await res.json().catch(() => ({}));
      const count = data?.markets?.length ?? data?.length ?? 0;
      return {
        success: true,
        message: `${count} marchés analysés`,
        data,
      };
    },
  },
  {
    id: "scan_marches",
    name: "Scan Marchés Publics",
    schedule: "8h00",
    description: "Scanne les nouveaux marchés BOAMP 972 et importe les pertinents (score > 50)",
    enabled: true,
    handler: async () => {
      try {
        // Fetch latest from BOAMP
        const res = await fetch("/api/boamp?action=latest&limit=50");
        if (!res.ok) return { success: false, message: `BOAMP erreur: ${res.status}` };
        const data = await res.json();
        const tenders = data.results ?? [];

        if (tenders.length === 0) {
          return { success: true, message: "Aucun nouveau marché détecté" };
        }

        // Score each tender
        const { scoreTenderRelevance } = await import("@/lib/data/cpv-codes");
        const scored = tenders.map((t: Record<string, string>) => ({
          ...t,
          score: scoreTenderRelevance(t.intitule || "", t.descripteur || ""),
        }));

        // Import those with score > 50
        const relevant = scored.filter((t: { score: number }) => t.score > 50);
        let imported = 0;
        let notified = 0;

        for (const tender of relevant) {
          const importRes = await fetch("/api/boamp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "import",
              tender,
              relevanceScore: tender.score,
            }),
          });
          if (importRes.ok) {
            const result = await importRes.json();
            if (result.imported) imported++;
          }

          // Notify for score > 70
          if (tender.score > 70) {
            const { onTenderAnalyzed } = await import("@/lib/synergies");
            await onTenderAnalyzed(
              tender.id,
              tender.intitule,
              tender.acheteur,
              tender.score,
              "A EVALUER",
              tender.dateLimite,
            );
            notified++;
          }
        }

        return {
          success: true,
          message: `${tenders.length} marchés scannés, ${imported} importés, ${notified} alertes`,
          data: { scanned: tenders.length, imported, notified, relevant: relevant.length },
        };
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : "Erreur scan marchés",
        };
      }
    },
  },
  {
    id: "health_check",
    name: "Health Check APIs",
    schedule: "14h00",
    description: "Vérifie la santé de toutes les APIs connectées",
    enabled: true,
    handler: async () => {
      const res = await fetch("/api/health");
      if (!res.ok) {
        return { success: false, message: "Health check échoué" };
      }
      const data = await res.json().catch(() => ({}));
      const allHealthy = data?.status === "ok" || data?.healthy === true;
      return {
        success: allHealthy,
        message: allHealthy ? "Tous les systèmes nominaux" : "Systèmes dégradés",
        data,
      };
    },
  },
  {
    id: "daily_report",
    name: "Rapport Journalier",
    schedule: "18h00",
    description: "Génère un rapport de fin de journée (actions, coûts, pipeline changes)",
    enabled: true,
    handler: async () => {
      const { generateDailyReport } = await import("./daily-report");
      const report = await generateDailyReport();
      return {
        success: true,
        message: "Rapport généré",
        data: { summary: report.slice(0, 200) },
      };
    },
  },
  {
    id: "embedding_refresh",
    name: "Refresh Embeddings",
    schedule: "Dimanche 3h00",
    description: "Re-indexe les nouveaux documents dans pgvector",
    enabled: true,
    handler: async () => {
      // Check for new lore/intel entries not yet embedded
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const [lore, intel] = await Promise.all([
        supabase
          .from("lore_entries")
          .select("id", { count: "exact", head: true })
          .is("embedding", null),
        supabase
          .from("intel_entities")
          .select("id", { count: "exact", head: true })
          .is("embedding", null),
      ]);

      const loreCount = lore.count ?? 0;
      const intelCount = intel.count ?? 0;
      const total = loreCount + intelCount;

      if (total === 0) {
        return { success: true, message: "Aucun document à indexer" };
      }

      // In production, this would call an embedding endpoint
      return {
        success: true,
        message: `${total} documents à indexer (${loreCount} lore, ${intelCount} intel)`,
        data: { loreCount, intelCount },
      };
    },
  },
];

/* ─── Cron Manager ─────────────────────────────────────── */

type CronListener = () => void;

class CronManager {
  private listeners = new Set<CronListener>();
  private _autonomousMode: boolean;
  private _taskStates: Record<string, { enabled: boolean; lastRun?: string; lastStatus?: string; lastMessage?: string }>;
  private _executions: CronExecution[];

  constructor() {
    this._autonomousMode = loadJSON(STORAGE_KEYS.autonomousMode, false);
    this._taskStates = loadJSON(STORAGE_KEYS.taskStates, {});
    this._executions = loadJSON(STORAGE_KEYS.executionLog, []);
  }

  /* ── Subscriptions ── */
  subscribe(fn: CronListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    for (const fn of this.listeners) {
      try { fn(); } catch { /* ignore */ }
    }
  }

  /* ── Autonomous Mode ── */
  get autonomousMode(): boolean {
    return this._autonomousMode;
  }

  setAutonomousMode(enabled: boolean) {
    this._autonomousMode = enabled;
    saveJSON(STORAGE_KEYS.autonomousMode, enabled);
    this.emit();
  }

  /* ── Task States ── */
  isTaskEnabled(taskId: string): boolean {
    if (taskId in this._taskStates) {
      return this._taskStates[taskId].enabled;
    }
    const task = CRON_TASKS.find((t) => t.id === taskId);
    return task?.enabled ?? false;
  }

  setTaskEnabled(taskId: string, enabled: boolean) {
    if (!this._taskStates[taskId]) {
      this._taskStates[taskId] = { enabled };
    } else {
      this._taskStates[taskId].enabled = enabled;
    }
    saveJSON(STORAGE_KEYS.taskStates, this._taskStates);
    this.emit();
  }

  getTaskState(taskId: string) {
    return this._taskStates[taskId] ?? null;
  }

  /* ── Execute a task ── */
  async executeTask(taskId: string): Promise<CronResult> {
    const task = CRON_TASKS.find((t) => t.id === taskId);
    if (!task) return { success: false, message: "Tâche introuvable" };

    const start = Date.now();
    let result: CronResult;

    try {
      result = await task.handler();
    } catch (err) {
      result = {
        success: false,
        message: err instanceof Error ? err.message : "Erreur inconnue",
      };
    }

    const durationMs = Date.now() - start;
    const now = new Date().toISOString();

    // Update task state
    this._taskStates[taskId] = {
      ...this._taskStates[taskId],
      enabled: this.isTaskEnabled(taskId),
      lastRun: now,
      lastStatus: result.success ? "success" : "fail",
      lastMessage: result.message,
    };
    saveJSON(STORAGE_KEYS.taskStates, this._taskStates);

    // Log execution
    const execution: CronExecution = {
      taskId,
      taskName: task.name,
      timestamp: now,
      status: result.success ? "success" : "fail",
      message: result.message,
      durationMs,
    };
    this._executions = [execution, ...this._executions].slice(0, 100);
    saveJSON(STORAGE_KEYS.executionLog, this._executions);

    this.emit();
    return result;
  }

  /* ── Queries ── */
  getExecutions(limit = 20): CronExecution[] {
    return this._executions.slice(0, limit);
  }

  getActiveTasks(): CronTask[] {
    return CRON_TASKS.filter((t) => this.isTaskEnabled(t.id));
  }

  getActiveCount(): number {
    return CRON_TASKS.filter((t) => this.isTaskEnabled(t.id)).length;
  }

  getTasks(): Array<CronTask & { enabled: boolean; lastRun?: string; lastStatus?: string; lastMessage?: string }> {
    return CRON_TASKS.map((task) => {
      const state = this._taskStates[task.id];
      return {
        ...task,
        enabled: this.isTaskEnabled(task.id),
        lastRun: state?.lastRun,
        lastStatus: state?.lastStatus as "success" | "fail" | undefined,
        lastMessage: state?.lastMessage,
      };
    });
  }
}

/* ─── Singleton ─────────────────────────────────────────── */

export const cronManager = new CronManager();
