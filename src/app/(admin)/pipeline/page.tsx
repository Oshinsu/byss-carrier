"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Kanban, List, BookOpen, TrendingUp, GripVertical, AlertCircle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { ProspectCard, type Prospect } from "@/components/pipeline/prospect-card";
import { AIActions } from "@/components/pipeline/ai-actions";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onProspectSigned, triggerSynergy } from "@/lib/synergies";

/* ─── Pipeline stages ────────────────────────────────── */
const STAGES = [
  { key: "prospect", label: "Prospect", color: "#6B7280", dotColor: "bg-gray-500", emptyPhrase: "L\u2019eau cherche le passage." },
  { key: "contacte", label: "Contacte", color: "#65A5FF", dotColor: "bg-blue-400", emptyPhrase: "Le premier mot est un pont." },
  { key: "rdv_planifie", label: "RDV Planifie", color: "#A855F7", dotColor: "bg-purple-500", emptyPhrase: "La table est mise." },
  { key: "demo_faite", label: "Demo Faite", color: "#F59E0B", dotColor: "bg-amber-500", emptyPhrase: "La preuve parle. Le doute recule." },
  { key: "proposition", label: "Proposition Envoyee", color: "#EC4899", dotColor: "bg-pink-500", emptyPhrase: "L\u2019offre parle. Le silence juge." },
  { key: "negociation", label: "Negociation", color: "#F97316", dotColor: "bg-orange-500", emptyPhrase: "Le prix n\u2019est jamais le sujet." },
  { key: "signe", label: "Signe", color: "#4ADE80", dotColor: "bg-green-400", emptyPhrase: "L\u2019encre seche. L\u2019empire commence." },
  { key: "perdu", label: "Perdu", color: "#EF4444", dotColor: "bg-red-500", emptyPhrase: "La defaite enseigne. La victoire oublie." },
  { key: "inactif", label: "Inactif", color: "#6B7280", dotColor: "bg-gray-400", emptyPhrase: "Silence radio. Le temps decidera." },
];

type ViewMode = "kanban" | "fiches" | "bible";

/* ─── Map DB row to ProspectCard shape ────────────────── */
function mapToCardProspect(row: Record<string, unknown>): Prospect {
  return {
    id: row.id as string,
    company: (row.name as string) || "Sans nom",
    contact: (row.key_contact as string) || "",
    sector: (row.sector as string) || "",
    score: Number(row.score) || 1,
    probability: Number(row.probability) || 0,
    basket: Number(row.estimated_basket) || 0,
    memorablePhrase: (row.memorable_phrase as string) || "",
    aiScore: (["fire", "warm", "cold"].includes(row.ai_score as string)
      ? row.ai_score
      : "cold") as "fire" | "warm" | "cold",
    stage: (row.phase as string) || "prospect",
  };
}

/* ─── Server action: update prospect phase ────────────── */
async function updateProspectPhase(id: string, newPhase: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prospects")
    .update({ phase: newPhase, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

/* ─── Sortable prospect card wrapper ──────────────────── */
function SortableProspectCard({
  prospect,
  onAction,
}: {
  prospect: Prospect;
  onAction: (action: "analyse" | "email" | "proposition" | "score" | "suggest", prospect: Prospect) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: prospect.id,
    data: { prospect, stage: prospect.stage },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="group relative">
        {/* Drag handle */}
        <div
          {...listeners}
          className="absolute left-0 top-0 z-10 flex h-full w-6 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        </div>
        <ProspectCard prospect={prospect} onAction={onAction} />
      </div>
    </div>
  );
}

/* ─── Ghost card for DragOverlay ──────────────────────── */
function DragGhostCard({ prospect }: { prospect: Prospect }) {
  return (
    <div
      className={cn(
        "w-[236px] rounded-lg p-3",
        "bg-[oklch(0.12_0.01_270/0.9)] backdrop-blur-md",
        "border-2 border-[var(--color-gold)]",
        "shadow-[0_0_30px_oklch(0.60_0.15_60/0.3)]",
        "rotate-[2deg] scale-105",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-[family-name:var(--font-clash-display)] text-sm font-semibold text-[var(--color-text)]">
            {prospect.company}
          </h4>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {prospect.contact}
          </p>
        </div>
      </div>
      <span className="inline-block rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {prospect.sector}
      </span>
      <div className="mt-2 text-xs font-medium text-[var(--color-gold)]">
        {prospect.basket.toLocaleString("fr-FR")} EUR/mois
      </div>
    </div>
  );
}

/* ─── Droppable column ────────────────────────────────── */
function DroppableColumn({
  stage,
  prospects,
  onAction,
}: {
  stage: (typeof STAGES)[number];
  prospects: Prospect[];
  onAction: (action: "analyse" | "email" | "proposition" | "score" | "suggest", prospect: Prospect) => void;
}) {
  const prospectIds = useMemo(
    () => prospects.map((p) => p.id),
    [prospects],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-[260px] shrink-0 flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
    >
      {/* Column header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-3 py-3">
        <div className={cn("h-2.5 w-2.5 rounded-full", stage.dotColor)} />
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
          {stage.label}
        </h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-surface-2)] px-1.5 text-[10px] font-bold text-[var(--color-text-muted)]">
          {prospects.length}
        </span>
      </div>

      {/* Cards — droppable zone */}
      <SortableContext items={prospectIds} strategy={verticalListSortingStrategy}>
        <div
          className="flex-1 space-y-2 overflow-y-auto p-2"
          data-stage={stage.key}
          style={{ minHeight: 80 }}
        >
          {prospects.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-[var(--color-border-subtle)] text-[10px] italic text-[var(--color-text-muted)]">
              {stage.emptyPhrase}
            </div>
          ) : (
            prospects.map((prospect) => (
              <SortableProspectCard
                key={prospect.id}
                prospect={prospect}
                onAction={onAction}
              />
            ))
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PIPELINE PAGE — Drag & Drop Kanban
   ═══════════════════════════════════════════════════════ */
export default function PipelinePage() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiModal, setAiModal] = useState<{
    prospect: Prospect;
    tab: "analyse" | "email" | "proposition";
  } | null>(null);
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);
  const { toast } = useToast();

  // ── Fetch prospects ──
  useEffect(() => {
    async function fetchProspects() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("prospects")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setProspects(data.map(mapToCardProspect));
        }
      } catch (err) {
        console.error("Pipeline fetch error:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement du pipeline.");
      } finally {
        setLoading(false);
      }
    }

    fetchProspects();
  }, []);

  // ── DnD sensors ──
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  // ── Find which stage a prospect belongs to ──
  const findStageForProspect = useCallback(
    (id: string): string | undefined => {
      const prospect = prospects.find((p) => p.id === id);
      return prospect?.stage;
    },
    [prospects],
  );

  // ── Drag start ──
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const prospect = prospects.find((p) => p.id === active.id);
      if (prospect) {
        setActiveProspect(prospect);
      }
    },
    [prospects],
  );

  // ── Drag over (for cross-column movement) ──
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find stages
      const activeStage = findStageForProspect(activeId);
      const overStage = findStageForProspect(overId);

      // If over is a stage key (droppable container)
      const targetStage = STAGES.find((s) => s.key === overId)?.key;

      if (targetStage && activeStage !== targetStage) {
        // Moving to empty column or column header
        setProspects((prev) =>
          prev.map((p) =>
            p.id === activeId ? { ...p, stage: targetStage } : p,
          ),
        );
        return;
      }

      // Moving to another card's column
      if (overStage && activeStage !== overStage) {
        setProspects((prev) =>
          prev.map((p) =>
            p.id === activeId ? { ...p, stage: overStage } : p,
          ),
        );
      }
    },
    [findStageForProspect],
  );

  // ── Drag end ──
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveProspect(null);

      if (!over) return;

      const activeId = active.id as string;
      const prospect = prospects.find((p) => p.id === activeId);
      if (!prospect) return;

      const newStage = prospect.stage;

      // Persist to Supabase (optimistic update already done in handleDragOver)
      try {
        await updateProspectPhase(activeId, newStage);
        const stageName = STAGES.find((s) => s.key === newStage)?.label ?? newStage;
        toast(`Phase mise à jour → ${stageName}`, "success");

        // ── Synergies ──
        if (newStage === "signe") {
          // Pipeline → Finance + Calendar onboarding
          onProspectSigned(activeId, prospect.company, prospect.basket);
        } else {
          // Notify key stage changes
          triggerSynergy("pipeline", "stage_changed", {
            prospectId: activeId,
            prospectName: prospect.company,
            newStage,
            stageLabel: stageName,
          });
        }
      } catch (err) {
        console.error("Failed to update prospect phase:", err);
        toast("Erreur lors du déplacement", "error");

        // Revert on error — restore the original stage from active.data
        const originalStage =
          (active.data?.current as { stage?: string } | undefined)?.stage ?? "prospect";

        setProspects((prev) =>
          prev.map((p) =>
            p.id === activeId ? { ...p, stage: originalStage } : p,
          ),
        );
      }
    },
    [prospects],
  );

  const handleAction = (
    action: "analyse" | "email" | "proposition" | "score" | "suggest",
    prospect: Prospect,
  ) => {
    setAiModal({ prospect, tab: action });
  };

  /* ── Summary calculations from live data ── */
  const totalPipeline = prospects.reduce((s, p) => s + p.basket, 0);
  const ponderedPipeline = prospects
    .filter((p) => !["perdu", "inactif"].includes(p.stage))
    .reduce((s, p) => s + (p.basket * p.probability) / 100, 0);
  const mrr = prospects
    .filter((p) => p.stage === "signe")
    .reduce((s, p) => s + p.basket, 0);

  const viewButtons: {
    key: ViewMode;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: "kanban", label: "Kanban", icon: Kanban },
    { key: "fiches", label: "Fiches", icon: List },
    { key: "bible", label: "Bible", icon: BookOpen },
  ];

  // ── Group prospects by stage ──
  const prospectsByStage = useMemo(() => {
    const grouped: Record<string, Prospect[]> = {};
    for (const stage of STAGES) {
      grouped[stage.key] = prospects.filter((p) => p.stage === stage.key);
    }
    return grouped;
  }, [prospects]);

  return (
    <div className="flex h-full flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
        <PageHeader title="Pipeline" titleAccent="CRM" />
        <div className="flex rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-0.5">
          {viewButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = view === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => setView(btn.key)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "text-[var(--color-bg)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="view-toggle"
                    className="absolute inset-0 rounded-md bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="mx-6 mt-4 flex items-center gap-3 rounded-xl border px-5 py-4"
          style={{
            borderColor: "rgba(255,45,45,0.2)",
            background: "rgba(255,45,45,0.05)",
          }}
        >
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D2D" }} />
          <p className="flex-1 text-sm" style={{ color: "#FF6B6B" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg px-3 py-1 text-xs font-semibold"
            style={{
              background: "rgba(0,212,255,0.1)",
              color: "#00D4FF",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* ── Kanban view with DnD ── */}
      {view === "kanban" && (
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex h-full gap-3 p-4" style={{ minWidth: "fit-content" }}>
              {STAGES.map((stage) => (
                <div
                  key={stage.key}
                  className="flex w-[260px] shrink-0 flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
                >
                  <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] px-3 py-3">
                    <div className={cn("h-2.5 w-2.5 rounded-full", stage.dotColor)} />
                    <h3 className="flex-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                      {stage.label}
                    </h3>
                  </div>
                  <div className="flex-1 space-y-2 p-2">
                    <div className="h-20 animate-pulse rounded-lg bg-[#1A1A2E]" />
                    <div className="h-20 animate-pulse rounded-lg bg-[#1A1A2E]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div
                className="flex h-full gap-3 p-4"
                style={{ minWidth: "fit-content" }}
              >
                {STAGES.map((stage) => (
                  <DroppableColumn
                    key={stage.key}
                    stage={stage}
                    prospects={prospectsByStage[stage.key] || []}
                    onAction={handleAction}
                  />
                ))}
              </div>

              {/* Ghost overlay while dragging */}
              <DragOverlay dropAnimation={null}>
                {activeProspect ? (
                  <DragGhostCard prospect={activeProspect} />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      )}

      {/* ── Fiches view (placeholder) ── */}
      {view === "fiches" && (
        <div className="flex flex-1 items-center justify-center text-[var(--color-text-muted)]">
          <div className="text-center">
            <List className="mx-auto mb-3 h-12 w-12 text-[var(--color-border)]" />
            <p className="text-sm">
              Vue Fiches &mdash; la forge chauffe.
            </p>
          </div>
        </div>
      )}

      {/* ── Bible view (placeholder) ── */}
      {view === "bible" && (
        <div className="flex flex-1 items-center justify-center text-[var(--color-text-muted)]">
          <div className="text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-[var(--color-border)]" />
            <p className="text-sm">
              Vue Bible &mdash; les ecritures arrivent.
            </p>
          </div>
        </div>
      )}

      {/* ── Summary bar ── */}
      <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="text-xs text-[var(--color-text-muted)]">
              Total Pipeline
            </span>
            <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
              {loading ? "..." : `${totalPipeline.toLocaleString("fr-FR")} EUR`}
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
          <div>
            <span className="text-xs text-[var(--color-text-muted)]">
              Pond{"\u00E9"}r{"\u00E9"}{" "}
            </span>
            <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-amber)]">
              {loading
                ? "..."
                : `${Math.round(ponderedPipeline).toLocaleString("fr-FR")} EUR`}
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--color-border-subtle)]" />
          <div>
            <span className="text-xs text-[var(--color-text-muted)]">MRR </span>
            <span className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-green)]">
              {loading ? "..." : `${mrr.toLocaleString("fr-FR")} EUR`}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)]">
          {loading
            ? "..."
            : `${prospects.length} prospects \u2022 ${STAGES.length} \u00E9tapes`}
        </div>
      </div>

      {/* ── AI Actions Modal ── */}
      <AnimatePresence>
        {aiModal && (
          <AIActions
            prospect={aiModal.prospect}
            initialTab={aiModal.tab}
            onClose={() => setAiModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
