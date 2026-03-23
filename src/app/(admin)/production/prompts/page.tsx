"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical,
  Image,
  Video,
  Music,
  FileText,
  Settings,
  Plus,
  Copy,
  Play,
  Pencil,
  X,
  Search,
  Star,
  Hash,
  Check,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

type PromptCategory = "Image" | "Video" | "Music" | "Text" | "System";

interface PromptTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  model: string;
  template: string;
  usageCount: number;
  isMaster: boolean;
}

/* ═══════════════════════════════════════════════════════
   CATEGORY CONFIG
   ═══════════════════════════════════════════════════════ */

const categoryConfig: Record<
  PromptCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    border: string;
  }
> = {
  Image: {
    icon: Image,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  Video: {
    icon: Video,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  Music: {
    icon: Music,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  Text: {
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  System: {
    icon: Settings,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
};

const MODEL_OPTIONS = [
  "Nano Banana Pro",
  "Kling 3.0",
  "Suno",
  "Claude",
  "GPT-4o",
  "Midjourney",
  "Stable Diffusion",
  "Flux Pro",
  "Runway Gen-4",
  "ElevenLabs",
];

/* ═══════════════════════════════════════════════════════
   MAP DB ROW → PromptTemplate
   ═══════════════════════════════════════════════════════ */
function mapRowToPrompt(row: Record<string, unknown>): PromptTemplate {
  const rawCategory = (row.category as string) || "System";
  // Normalize category to match our tabs
  const validCategories: PromptCategory[] = ["Image", "Video", "Music", "Text", "System"];
  const category = validCategories.find(
    (c) => c.toLowerCase() === rawCategory.toLowerCase()
  ) || "System";

  return {
    id: row.id as string,
    name: (row.name as string) || "Sans nom",
    category,
    model: (row.model as string) || "Claude",
    template: (row.template as string) || "",
    usageCount: Number(row.usage_count) || 0,
    isMaster: Boolean(row.is_master),
  };
}

/* ═══════════════════════════════════════════════════════
   HELPER — detect {{variables}} in template
   ═══════════════════════════════════════════════════════ */

function detectVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}

/* ═══════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════ */
function PromptsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border border-[#2A2A3E] bg-[#0F0F1A] p-4">
          <div className="space-y-3">
            <div className="h-5 w-40 rounded bg-[#1A1A2E] animate-pulse" />
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="h-4 w-20 rounded bg-[#1A1A2E] animate-pulse" />
            </div>
            <div className="h-16 w-full rounded bg-[#1A1A2E] animate-pulse" />
            <div className="flex gap-2 pt-2 border-t border-[#2A2A3E]/50">
              <div className="h-8 flex-1 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="h-8 flex-1 rounded bg-[#1A1A2E] animate-pulse" />
              <div className="h-8 w-8 rounded bg-[#1A1A2E] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function PromptFactoryPage() {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PromptCategory>("Image");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Modal form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<PromptCategory>("Image");
  const [formModel, setFormModel] = useState("Claude");
  const [formTemplate, setFormTemplate] = useState("");
  const [formIsMaster, setFormIsMaster] = useState(false);

  const tabs: PromptCategory[] = ["Image", "Video", "Music", "Text", "System"];

  /* ─── Fetch prompts from Supabase ─── */
  const fetchPrompts = () => {
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("prompts")
      .select("*")
      .order("usage_count", { ascending: false })
      .then(({ data }) => {
        setPrompts((data || []).map(mapRowToPrompt));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    const q = search.toLowerCase();
    return prompts.filter(
      (p) =>
        p.category === activeTab &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.template.toLowerCase().includes(q))
    );
  }, [prompts, activeTab, search]);

  const totalCount = prompts.length;

  const handleCopy = async (prompt: PromptTemplate) => {
    navigator.clipboard.writeText(prompt.template);

    // Increment usage_count in Supabase
    const supabase = createClient();
    const newCount = prompt.usageCount + 1;
    supabase
      .from("prompts")
      .update({ usage_count: newCount })
      .eq("id", prompt.id)
      .then(() => {
        setPrompts((prev) =>
          prev.map((p) =>
            p.id === prompt.id ? { ...p, usageCount: newCount } : p
          )
        );
      });

    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openNewModal = () => {
    setEditingPrompt(null);
    setFormName("");
    setFormCategory(activeTab);
    setFormModel("Claude");
    setFormTemplate("");
    setFormIsMaster(false);
    setModalOpen(true);
  };

  const openEditModal = (prompt: PromptTemplate) => {
    setEditingPrompt(prompt);
    setFormName(prompt.name);
    setFormCategory(prompt.category);
    setFormModel(prompt.model);
    setFormTemplate(prompt.template);
    setFormIsMaster(prompt.isMaster);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formTemplate.trim()) return;

    const supabase = createClient();

    if (editingPrompt) {
      const { error } = await supabase
        .from("prompts")
        .update({
          name: formName,
          category: formCategory,
          model: formModel,
          template: formTemplate,
          is_master: formIsMaster,
        })
        .eq("id", editingPrompt.id);
      if (error) { toast("Erreur: " + error.message, "error"); return; }
      toast("Prompt mis à jour", "success");
    } else {
      const { error } = await supabase.from("prompts").insert({
        name: formName,
        category: formCategory,
        model: formModel,
        template: formTemplate,
        is_master: formIsMaster,
        usage_count: 0,
      });
      if (error) { toast("Erreur: " + error.message, "error"); return; }
      toast(`Prompt créé — ${formName}`, "success");
    }

    setModalOpen(false);
    fetchPrompts();
  };

  const detectedVars = detectVariables(formTemplate);

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 lg:px-8">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF]">
            <FlaskConical className="h-5 w-5 text-[#0A0A0F]" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[#E0E0E8]">
              Prompt Factory
            </h1>
            <p className="text-sm text-[#8A8A9A]">
              {totalCount} templates disponibles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6A6A7A]" />
            <input
              type="text"
              placeholder="Rechercher un prompt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "h-9 w-64 rounded-lg border border-[#2A2A3E] bg-[#0F0F1A] pl-9 pr-3",
                "text-sm text-[#E0E0E8] placeholder-[#6A6A7A]",
                "transition-colors focus:border-[#00B4D8]/40 focus:outline-none"
              )}
            />
          </div>
          {/* New Prompt */}
          <button
            onClick={openNewModal}
            className={cn(
              "flex h-9 items-center gap-2 rounded-lg px-4",
              "bg-gradient-to-r from-[#00B4D8] to-[#00D4FF] text-[13px] font-semibold text-[#0A0A0F]",
              "transition-all hover:shadow-lg hover:shadow-[#00B4D8]/20"
            )}
          >
            <Plus className="h-4 w-4" />
            Nouveau Prompt
          </button>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="mb-6 flex gap-1 rounded-xl border border-[#2A2A3E] bg-[#0F0F1A] p-1">
        {tabs.map((tab) => {
          const config = categoryConfig[tab];
          const Icon = config.icon;
          const count = prompts.filter((p) => p.category === tab).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "text-[#E0E0E8]"
                  : "text-[#6A6A7A] hover:text-[#8A8A9A]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="prompt-tab"
                  className="absolute inset-0 rounded-lg bg-[#1A1A2E] border border-[#2A2A3E]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon className={cn("h-4 w-4", isActive && config.color)} />
                <span className="hidden sm:inline">{tab}</span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    isActive
                      ? `${config.bg} ${config.color}`
                      : "bg-[#1A1A2E] text-[#6A6A7A]"
                  )}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Loading ── */}
      {loading && <PromptsSkeleton />}

      {/* ── Prompt Grid ── */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt, index) => {
              const config = categoryConfig[prompt.category];
              const Icon = config.icon;
              const vars = detectVariables(prompt.template);

              return (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  className={cn(
                    "group relative flex flex-col rounded-xl border border-[#2A2A3E] bg-[#0F0F1A] p-4",
                    "transition-all duration-200 hover:border-[#00B4D8]/30 hover:shadow-lg hover:shadow-[#00B4D8]/5"
                  )}
                >
                  {/* Master badge */}
                  {prompt.isMaster && (
                    <div className="absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-[#00B4D8] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0A0A0F]">
                      <Star className="h-2.5 w-2.5" />
                      Master
                    </div>
                  )}

                  {/* Top row: name + badges */}
                  <div className="mb-3">
                    <h3 className="font-[family-name:var(--font-clash-display)] text-base font-semibold text-[#E0E0E8] leading-tight">
                      {prompt.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border",
                          config.bg,
                          config.color,
                          config.border
                        )}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {prompt.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#1A1A2E] px-1.5 py-0.5 text-[10px] font-medium text-[#8A8A9A]">
                        <Cpu className="h-2.5 w-2.5" />
                        {prompt.model}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#1A1A2E] px-1.5 py-0.5 text-[10px] font-medium text-[#6A6A7A]">
                        <Hash className="h-2.5 w-2.5" />
                        {prompt.usageCount} uses
                      </span>
                    </div>
                  </div>

                  {/* Template preview */}
                  <div className="mb-3 flex-1">
                    <p className="rounded-lg bg-[#0A0A0F] border border-[#2A2A3E]/50 p-3 font-mono text-[11px] leading-relaxed text-[#6A6A7A]">
                      {prompt.template.length > 100
                        ? prompt.template.slice(0, 100) + "..."
                        : prompt.template}
                    </p>
                  </div>

                  {/* Variables */}
                  {vars.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {vars.slice(0, 4).map((v) => (
                        <span
                          key={v}
                          className="rounded bg-[#00B4D8]/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#00B4D8]"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                      {vars.length > 4 && (
                        <span className="rounded bg-[#1A1A2E] px-1.5 py-0.5 text-[9px] text-[#6A6A7A]">
                          +{vars.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-[#2A2A3E]/50 pt-3">
                    <button
                      onClick={() => handleCopy(prompt)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-all",
                        copiedId === prompt.id
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-[#1A1A2E] text-[#8A8A9A] hover:bg-[#00B4D8]/10 hover:text-[#00B4D8]"
                      )}
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copie !
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copier
                        </>
                      )}
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A2E] py-2 text-[12px] font-medium text-[#8A8A9A] transition-all hover:bg-blue-500/10 hover:text-blue-400">
                      <Play className="h-3.5 w-3.5" />
                      Utiliser
                    </button>
                    <button
                      onClick={() => openEditModal(prompt)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1A2E] text-[#6A6A7A] transition-all hover:bg-purple-500/10 hover:text-purple-400"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty state */}
          {filteredPrompts.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A2E]">
                <FlaskConical className="h-8 w-8 text-[#6A6A7A]" />
              </div>
              <h3 className="mb-1 font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[#8A8A9A]">
                La forge est vide.
              </h3>
              <p className="mb-4 text-sm text-[#6A6A7A]">
                {search
                  ? "Rien ici. Cherche autrement."
                  : `Aucun template ${activeTab}. Forge le premier.`}
              </p>
              <button
                onClick={openNewModal}
                className="flex items-center gap-2 rounded-lg bg-[#00B4D8]/15 px-4 py-2 text-sm font-medium text-[#00B4D8] transition-colors hover:bg-[#00B4D8]/25"
              >
                <Plus className="h-4 w-4" />
                Creer un prompt {activeTab}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
         MODAL — New / Edit Prompt
         ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-4 z-50 m-auto flex max-h-[90vh] max-w-2xl flex-col rounded-2xl border border-[#2A2A3E] bg-[#0F0F1A] shadow-2xl shadow-black/50"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#2A2A3E] px-6 py-4">
                <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-semibold text-[#E0E0E8]">
                  {editingPrompt ? "Modifier le Prompt" : "Nouveau Prompt"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#E0E0E8]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#8A8A9A]">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Portrait Cinematique..."
                    className={cn(
                      "w-full rounded-lg border border-[#2A2A3E] bg-[#0A0A0F] px-4 py-2.5",
                      "text-sm text-[#E0E0E8] placeholder-[#6A6A7A]",
                      "focus:border-[#00B4D8]/40 focus:outline-none"
                    )}
                  />
                </div>

                {/* Category + Model row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#8A8A9A]">
                      Categorie
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as PromptCategory)
                      }
                      className={cn(
                        "w-full rounded-lg border border-[#2A2A3E] bg-[#0A0A0F] px-4 py-2.5",
                        "text-sm text-[#E0E0E8]",
                        "focus:border-[#00B4D8]/40 focus:outline-none"
                      )}
                    >
                      {tabs.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#8A8A9A]">
                      Modele
                    </label>
                    <select
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border border-[#2A2A3E] bg-[#0A0A0F] px-4 py-2.5",
                        "text-sm text-[#E0E0E8]",
                        "focus:border-[#00B4D8]/40 focus:outline-none"
                      )}
                    >
                      {MODEL_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Template */}
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#8A8A9A]">
                    Template
                  </label>
                  <textarea
                    value={formTemplate}
                    onChange={(e) => setFormTemplate(e.target.value)}
                    placeholder="Ecrivez votre prompt ici... Utilisez {{variable}} pour les placeholders."
                    rows={8}
                    className={cn(
                      "w-full rounded-lg border border-[#2A2A3E] bg-[#0A0A0F] px-4 py-3",
                      "font-mono text-sm text-[#E0E0E8] placeholder-[#6A6A7A] leading-relaxed",
                      "focus:border-[#00B4D8]/40 focus:outline-none resize-none",
                      "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2A2A3E]"
                    )}
                  />
                </div>

                {/* Detected variables */}
                {detectedVars.length > 0 && (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#8A8A9A]">
                      Variables detectees ({detectedVars.length})
                    </label>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-[#2A2A3E]/50 bg-[#0A0A0F] p-3">
                      {detectedVars.map((v) => (
                        <span
                          key={v}
                          className="rounded-md bg-[#00B4D8]/10 border border-[#00B4D8]/20 px-2.5 py-1 font-mono text-[11px] font-medium text-[#00B4D8]"
                        >
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Master toggle */}
                <div className="flex items-center justify-between rounded-lg border border-[#2A2A3E] bg-[#0A0A0F] p-4">
                  <div className="flex items-center gap-3">
                    <Star
                      className={cn(
                        "h-5 w-5",
                        formIsMaster ? "text-[#00B4D8]" : "text-[#6A6A7A]"
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#E0E0E8]">
                        Master Prompt
                      </p>
                      <p className="text-[11px] text-[#6A6A7A]">
                        Marquer comme template principal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormIsMaster(!formIsMaster)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      formIsMaster ? "bg-[#00B4D8]" : "bg-[#2A2A3E]"
                    )}
                  >
                    <motion.div
                      animate={{ x: formIsMaster ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
                    />
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[#2A2A3E] px-6 py-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#8A8A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#E0E0E8]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formName.trim() || !formTemplate.trim()}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all",
                    formName.trim() && formTemplate.trim()
                      ? "bg-gradient-to-r from-[#00B4D8] to-[#00D4FF] text-[#0A0A0F] hover:shadow-lg hover:shadow-[#00B4D8]/20"
                      : "bg-[#2A2A3E] text-[#6A6A7A] cursor-not-allowed"
                  )}
                >
                  {editingPrompt ? "Enregistrer" : "Creer le Prompt"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
