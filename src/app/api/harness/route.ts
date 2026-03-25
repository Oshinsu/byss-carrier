// ═══════════════════════════════════════════════════════════
// GAN HARNESS API — Generator/Evaluator Multi-Agent
// POST: evaluate_page | plan_task | execute_sprint | full_run
// ═══════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { createClient as _createSC } from "@supabase/supabase-js";
import {
  evaluatePage,
  planSprints,
  executeSprint,
  executeWithHarness,
  DEFAULT_HARNESS_CONFIG,
  type HarnessConfig,
  type SprintContract,
  type HandoffDocument,
  type EvaluationResult,
  type HarnessRun,
} from "@/lib/harness/engine";
import { promises as fs } from "fs";
import path from "path";

function createClient() {
  return _createSC(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/* ─── Helpers ───────────────────────────────────────────── */

function parseConfig(body: Record<string, unknown>): Partial<HarnessConfig> {
  const config: Partial<HarnessConfig> = {};
  if (body.generator_model) config.generator_model = body.generator_model as string;
  if (body.evaluator_model) config.evaluator_model = body.evaluator_model as string;
  if (body.planner_model) config.planner_model = body.planner_model as string;
  if (typeof body.max_iterations === "number") config.max_iterations = body.max_iterations;
  if (typeof body.acceptance_threshold === "number") config.acceptance_threshold = body.acceptance_threshold;
  if (typeof body.enable_pivot === "boolean") config.enable_pivot = body.enable_pivot;
  return config;
}

async function logToAgentLogs(
  supabase: ReturnType<typeof createClient>,
  agent: string,
  role: "generator" | "evaluator" | "planner" | "harness",
  action: string,
  model: string,
  details: Record<string, unknown>,
) {
  try {
    await supabase.from("agent_logs").insert({
      agent_name: `harness_${agent}`,
      action,
      model,
      tokens_used: details.tokens || 0,
      cost_usd: details.cost_usd || 0,
      duration_ms: details.duration_ms || 0,
      success: details.success ?? true,
      metadata: {
        role,
        ...details,
      },
    });
  } catch {
    // Silent log failure
  }
}

async function readPageSource(pagePath: string, maxLines = 150): Promise<string> {
  try {
    const rootDir = process.cwd();
    const fullPath = path.join(rootDir, pagePath);
    const content = await fs.readFile(fullPath, "utf-8");
    const lines = content.split("\n");
    return lines.slice(0, maxLines).join("\n");
  } catch {
    return "";
  }
}

/* ─── POST Handler ──────────────────────────────────────── */

export async function POST(request: Request) {
  const start = Date.now();
  const supabase = createClient();

  try {
    const body = await request.json();
    const action = body.action as string;
    const config = parseConfig(body);

    // ── evaluate_page ─────────────────────────────────
    if (action === "evaluate_page") {
      const pagePath = body.pagePath as string;
      const pageContent = body.pageContent as string || await readPageSource(pagePath);

      if (!pageContent) {
        return NextResponse.json(
          { error: "Page vide ou introuvable", pagePath },
          { status: 400 },
        );
      }

      const evaluation = await evaluatePage(pageContent, pagePath, config);
      const duration = Date.now() - start;

      await logToAgentLogs(supabase, "evaluator", "evaluator", "evaluate_page", config.evaluator_model || DEFAULT_HARNESS_CONFIG.evaluator_model, {
        pagePath,
        score: evaluation.score,
        passed: evaluation.passed,
        issues_count: evaluation.issues.length,
        duration_ms: duration,
      });

      return NextResponse.json({
        evaluation,
        pagePath,
        duration_ms: duration,
      });
    }

    // ── plan_task ─────────────────────────────────────
    if (action === "plan_task") {
      const task = body.task as string;
      if (!task) {
        return NextResponse.json({ error: "Task requise" }, { status: 400 });
      }

      const sprints = await planSprints(task, config);
      const duration = Date.now() - start;

      await logToAgentLogs(supabase, "planner", "planner", "plan_task", config.planner_model || DEFAULT_HARNESS_CONFIG.planner_model, {
        task: task.slice(0, 200),
        sprints_count: sprints.length,
        duration_ms: duration,
      });

      return NextResponse.json({
        sprints,
        task: task.slice(0, 200),
        duration_ms: duration,
      });
    }

    // ── execute_sprint ────────────────────────────────
    if (action === "execute_sprint") {
      const sprint = body.sprint as SprintContract;
      const previousHandoff = (body.previousHandoff as HandoffDocument) || null;

      if (!sprint?.goal) {
        return NextResponse.json({ error: "Sprint goal requis" }, { status: 400 });
      }

      const result = await executeSprint(sprint, previousHandoff, config);
      const duration = Date.now() - start;

      await logToAgentLogs(supabase, "harness", "harness", "execute_sprint", sprint.model || DEFAULT_HARNESS_CONFIG.generator_model, {
        sprint_id: sprint.id,
        score: result.evaluation.score,
        passed: result.evaluation.passed,
        iterations: result.iteration,
        duration_ms: duration,
        cost_usd: result.iteration * 0.015,
      });

      return NextResponse.json({
        sprint_id: sprint.id,
        evaluation: result.evaluation,
        iteration: result.iteration,
        handoff: result.handoff,
        generator_output_preview: result.generator_output.slice(0, 500),
        duration_ms: duration,
      });
    }

    // ── full_run ──────────────────────────────────────
    if (action === "full_run") {
      const task = body.task as string;
      if (!task) {
        return NextResponse.json({ error: "Task requise" }, { status: 400 });
      }

      const run = await executeWithHarness(task, config);
      const duration = Date.now() - start;

      await logToAgentLogs(supabase, "harness", "harness", "full_run", "multi-model", {
        task: task.slice(0, 200),
        success: run.success,
        final_score: run.final_score,
        iterations: run.iterations,
        pivoted: run.pivoted,
        sprints_count: run.evaluations.length,
        duration_ms: duration,
        cost_usd: run.cost_usd,
      });

      return NextResponse.json({
        success: run.success,
        final_score: run.final_score,
        iterations: run.iterations,
        evaluations: run.evaluations,
        handoff: run.handoff,
        pivoted: run.pivoted,
        cost_usd: run.cost_usd,
        duration_ms: duration,
      });
    }

    // ── evaluate_random_pages (for cron) ──────────────
    if (action === "evaluate_random_pages") {
      const count = Math.min((body.count as number) || 5, 10);
      const rootDir = process.cwd();
      const adminDir = path.join(rootDir, "src/app/(admin)");

      // Walk to find page files
      const pages: string[] = [];
      async function walk(dir: string) {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) await walk(full);
            else if (entry.name === "page.tsx") {
              pages.push(path.relative(rootDir, full).replace(/\\/g, "/"));
            }
          }
        } catch { /* skip */ }
      }
      await walk(adminDir);

      // Pick random pages
      const shuffled = pages.sort(() => Math.random() - 0.5).slice(0, count);
      const results: Array<{ pagePath: string; evaluation: EvaluationResult }> = [];

      for (const pagePath of shuffled) {
        const content = await readPageSource(pagePath);
        if (!content) continue;
        const evaluation = await evaluatePage(content, pagePath, config);
        results.push({ pagePath, evaluation });
      }

      const avgScore = results.length > 0
        ? Math.round(results.reduce((s, r) => s + r.evaluation.score, 0) / results.length)
        : 0;

      const duration = Date.now() - start;

      await logToAgentLogs(supabase, "harness_cron", "evaluator", "evaluate_random_pages", config.evaluator_model || DEFAULT_HARNESS_CONFIG.evaluator_model, {
        pages_evaluated: results.length,
        avg_score: avgScore,
        duration_ms: duration,
      });

      return NextResponse.json({
        pages_evaluated: results.length,
        avg_score: avgScore,
        results,
        duration_ms: duration,
      });
    }

    return NextResponse.json({ error: `Action inconnue: ${action}` }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur harness";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
