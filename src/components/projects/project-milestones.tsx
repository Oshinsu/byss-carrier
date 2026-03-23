"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MilestoneStatus = "done" | "in_progress" | "planned";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  progress: number;
}

export interface ProjectMilestonesProps {
  projectSlug: string;
  milestones: Milestone[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CYCLE: Record<MilestoneStatus, MilestoneStatus> = {
  planned: "in_progress",
  in_progress: "done",
  done: "planned",
};

const PROGRESS_CYCLE = [0, 25, 50, 75, 100] as const;

const STATUS_CONFIG: Record<
  MilestoneStatus,
  { label: string; dot: string; text: string; border: string; glow: string }
> = {
  done: {
    label: "Done",
    dot: "bg-[#00B4D8]",
    text: "text-[#00B4D8]",
    border: "border-[#00B4D8]/30",
    glow: "shadow-[0_0_12px_rgba(212,175,55,0.15)]",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-cyan-400",
    text: "text-cyan-400",
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.15)]",
  },
  planned: {
    label: "Planned",
    dot: "bg-gray-500",
    text: "text-gray-400",
    border: "border-[var(--color-border-subtle)]",
    glow: "",
  },
};

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function lsKey(projectSlug: string) {
  return `byss_milestones_${projectSlug}`;
}

function readLocalStorage(
  projectSlug: string,
): Record<string, { status: MilestoneStatus; progress: number }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(lsKey(projectSlug));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalStorage(
  projectSlug: string,
  data: Record<string, { status: MilestoneStatus; progress: number }>,
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(lsKey(projectSlug), JSON.stringify(data));
  } catch {
    /* quota exceeded — silent */
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectMilestones({
  projectSlug,
  milestones: initialMilestones,
}: ProjectMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [loaded, setLoaded] = useState(false);

  // ---- Hydrate from Supabase (primary) or localStorage (fallback) ---------
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      // Build a lookup from props so we always have defaults
      const lookup: Record<string, Milestone> = {};
      for (const m of initialMilestones) lookup[m.id] = { ...m };

      let usedSupabase = false;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("project_milestones")
          .select("milestone_id, status, progress")
          .eq("project_slug", projectSlug);

        if (!error && data && data.length > 0) {
          usedSupabase = true;
          for (const row of data) {
            if (lookup[row.milestone_id]) {
              lookup[row.milestone_id].status = row.status as MilestoneStatus;
              lookup[row.milestone_id].progress = row.progress;
            }
          }
        }
      } catch {
        /* Supabase unreachable — continue to fallback */
      }

      // Fallback: localStorage
      if (!usedSupabase) {
        const local = readLocalStorage(projectSlug);
        for (const [id, val] of Object.entries(local)) {
          if (lookup[id]) {
            lookup[id].status = val.status;
            lookup[id].progress = val.progress;
          }
        }
      }

      if (!cancelled) {
        setMilestones(initialMilestones.map((m) => lookup[m.id]));
        setLoaded(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [projectSlug, initialMilestones]);

  // ---- Persist helper (Supabase + localStorage) ---------------------------
  const persist = useCallback(
    async (milestoneId: string, status: MilestoneStatus, progress: number) => {
      // Always write to localStorage
      const local = readLocalStorage(projectSlug);
      local[milestoneId] = { status, progress };
      writeLocalStorage(projectSlug, local);

      // Try Supabase upsert
      try {
        const supabase = createClient();
        await supabase.from("project_milestones").upsert(
          {
            project_slug: projectSlug,
            milestone_id: milestoneId,
            status,
            progress,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "project_slug,milestone_id" },
        );
      } catch {
        /* Supabase write failed — localStorage already saved */
      }
    },
    [projectSlug],
  );

  // ---- Handlers -----------------------------------------------------------
  const cycleStatus = useCallback(
    (id: string) => {
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const next = STATUS_CYCLE[m.status];
          const newProgress = next === "done" ? 100 : next === "planned" ? 0 : m.progress;
          persist(id, next, newProgress);
          return { ...m, status: next, progress: newProgress };
        }),
      );
    },
    [persist],
  );

  const cycleProgress = useCallback(
    (id: string) => {
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const idx = PROGRESS_CYCLE.indexOf(m.progress as (typeof PROGRESS_CYCLE)[number]);
          const next = PROGRESS_CYCLE[(idx + 1) % PROGRESS_CYCLE.length];
          persist(id, m.status, next);
          return { ...m, progress: next };
        }),
      );
    },
    [persist],
  );

  // ---- Derived stats ------------------------------------------------------
  const stats = useMemo(() => {
    const total = milestones.length;
    const done = milestones.filter((m) => m.status === "done").length;
    const avgProgress =
      total > 0 ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / total) : 0;
    return { total, done, avgProgress };
  }, [milestones]);

  // ---- Render -------------------------------------------------------------
  return (
    <section className="w-full space-y-5">
      {/* Overall progress header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: loaded ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl bg-[#0F0F1A] border border-[var(--color-border-subtle)] p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[family-name:var(--font-clash-display)] text-lg text-white/90 tracking-wide">
            Project Milestones
          </h3>
          <span className="text-sm text-gray-400">
            <span className="text-[#00B4D8] font-semibold">{stats.done}</span>
            <span className="mx-1">/</span>
            <span>{stats.total}</span>
            <span className="ml-1.5 text-gray-500">completed</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#F5D76E]"
            initial={{ width: 0 }}
            animate={{ width: `${stats.avgProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 text-right">{stats.avgProgress}% overall</p>
      </motion.div>

      {/* Milestone cards */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {milestones.map((m, i) => {
            const cfg = STATUS_CONFIG[m.status];
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`group rounded-xl bg-[#0F0F1A] border ${cfg.border} ${cfg.glow} p-4 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  {/* Status dot — click to cycle status */}
                  <button
                    type="button"
                    onClick={() => cycleStatus(m.id)}
                    aria-label={`Cycle status: ${cfg.label}`}
                    className="mt-1 shrink-0"
                  >
                    <motion.span
                      whileTap={{ scale: 0.75 }}
                      className={`block h-3 w-3 rounded-full ${cfg.dot} ring-2 ring-offset-1 ring-offset-[#0F0F1A] ring-white/10 cursor-pointer transition-colors`}
                    />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`font-[family-name:var(--font-clash-display)] text-sm font-medium truncate ${
                          m.status === "done" ? "text-[#00B4D8]" : "text-white/85"
                        }`}
                      >
                        {m.title}
                      </h4>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.text} bg-white/5`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {m.description && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{m.description}</p>
                    )}

                    {/* Progress bar — click to cycle progress */}
                    <button
                      type="button"
                      onClick={() => cycleProgress(m.id)}
                      aria-label={`Cycle progress: ${m.progress}%`}
                      className="mt-3 flex w-full items-center gap-2.5 cursor-pointer group/prog"
                    >
                      <div className="relative h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            m.status === "done"
                              ? "bg-gradient-to-r from-[#00B4D8] to-[#F5D76E]"
                              : m.status === "in_progress"
                                ? "bg-gradient-to-r from-cyan-500 to-cyan-300"
                                : "bg-gray-600"
                          }`}
                          initial={false}
                          animate={{ width: `${m.progress}%` }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        />
                      </div>
                      <span
                        className={`text-[11px] tabular-nums font-medium ${cfg.text} group-hover/prog:brightness-125 transition-all`}
                      >
                        {m.progress}%
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
