"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Video, Play, Clock, DollarSign, Check, AlertCircle,
  Plus, Filter, Search, Sparkles, Zap, Eye,
  Lock, Unlock, Image as ImageIcon, Palette, FileText, Film,
  Music, Waves, Layers, MonitorPlay, UserCheck,
  ChevronDown, Upload, Mic, Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";
import { onVideoCompleted } from "@/lib/synergies";
import { VIDEO_STATUS_CONFIG } from "@/lib/constants";
import type { VideoStatus, VideoTier } from "@/types";

/* ═══════════════════════════════════════════════════════
   VIDEO PIPELINE — Kling 3.0 / Hailuo 2.3 / MiniMax (via Replicate)
   Brief → Prompt → Generation → Review → Delivery
   Marge: 99.96% ($0.30 cost → $750 sell)
   ═══════════════════════════════════════════════════════ */

interface VideoItem {
  id: string;
  title: string | null;
  brief: string | null;
  prompt: string | null;
  status: VideoStatus;
  tier: VideoTier | null;
  api_provider: string;
  api_cost: number;
  billed_price: number;
  delivery_date: string | null;
  created_at: string;
  prospect?: { name: string } | null;
}

const TIER_CONFIG: Record<VideoTier, { label: string; price: string; color: string }> = {
  social: { label: "Social", price: "500€", color: "#6B7280" },
  standard: { label: "Standard", price: "750€", color: "#3B82F6" },
  premium: { label: "Premium", price: "1500€", color: "#00B4D8" },
  series: { label: "Serie", price: "2500€", color: "#8B5CF6" },
  pack: { label: "Pack", price: "3500€/mo", color: "#EF4444" },
};

const STATUS_ICONS: Record<VideoStatus, React.ElementType> = {
  draft: AlertCircle,
  prompt_ready: Sparkles,
  generating: Zap,
  review: Eye,
  delivered: Check,
  published: Play,
};

interface ProspectOption {
  id: string;
  name: string;
}

const INITIAL_FORM = {
  title: "",
  prospect_id: "",
  brief: "",
  tier: "standard" as VideoTier,
  api_provider: "kling",
};

/* ═══════════════════════════════════════════════════════
   PIPELINE TIMELINE — 8 Sequential Stages
   ═══════════════════════════════════════════════════════ */
type StageStatus = "locked" | "active" | "completed";

interface PipelineStage {
  id: number;
  title: string;
  description: string;
  tools: string[];
  estimatedTime: string;
  dependencies: number[];
  status: StageStatus;
  color: string;
  icon: React.ElementType;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1, title: "Context Images", description: "Generate character refs, environment refs, mood boards",
    tools: ["Nano Banana Pro", "Flux 1.1 Pro"], estimatedTime: "15-30 min", dependencies: [], status: "active",
    color: "#00D4FF", icon: ImageIcon,
  },
  {
    id: 2, title: "Style Lock", description: "Review & approve visual style, lock Element Library",
    tools: ["Element Library", "Kling Character Ref"], estimatedTime: "10 min", dependencies: [1], status: "locked",
    color: "#8B5CF6", icon: Palette,
  },
  {
    id: 3, title: "Storyboard", description: "Generate shot list with descriptions per scene",
    tools: ["Claude/Kael", "Shot List Generator"], estimatedTime: "20-45 min", dependencies: [1, 2], status: "locked",
    color: "#F59E0B", icon: FileText,
  },
  {
    id: 4, title: "Video Generation", description: "Kling 3.0 multi-shot per scene, Element Library consistency",
    tools: ["Kling 3.0 (Replicate)", "Multi-shot API"], estimatedTime: "2-8 min/shot", dependencies: [1, 2, 3], status: "locked",
    color: "#10B981", icon: Film,
  },
  {
    id: 5, title: "Audio", description: "Music generation + voice-off recording/synthesis",
    tools: ["MiniMax Music (Replicate)", "XTTS-v2 (Replicate)", "Qwen3-TTS"], estimatedTime: "5-15 min", dependencies: [3], status: "locked",
    color: "#EC4899", icon: Music,
  },
  {
    id: 6, title: "Beat Sync", description: "Align video cuts to music beats, rhythmic editing",
    tools: ["BeatSync-Engine", "Aubio BPM"], estimatedTime: "10-20 min", dependencies: [4, 5], status: "locked",
    color: "#EF4444", icon: Waves,
  },
  {
    id: 7, title: "Assembly", description: "Remotion composition, color grade, final render",
    tools: ["Remotion", "FFmpeg", "ACES Pipeline"], estimatedTime: "5-15 min", dependencies: [4, 5, 6], status: "locked",
    color: "#6366F1", icon: Layers,
  },
  {
    id: 8, title: "Review", description: "Quality check + client approval workflow",
    tools: ["Internal QA", "Client Portal"], estimatedTime: "1-24h", dependencies: [7], status: "locked",
    color: "#14B8A6", icon: UserCheck,
  },
];

/* ═══════════════════════════════════════════════════════
   KLING 3.0 CONFIGURATION — Provider Comparison
   ═══════════════════════════════════════════════════════ */
interface ProviderSpec {
  name: string;
  arena: string;
  costPerSec: number;
  costLabel: string;
  features: string[];
  color: string;
  recommended?: boolean;
}

const PROVIDER_SPECS: ProviderSpec[] = [
  {
    name: "Kling 3.0",
    arena: "#1 Arena (ELO 1248)",
    costPerSec: 0.029,
    costLabel: "$0.029/sec (Replicate)",
    features: ["Multi-shot", "Element Library", "Character Consistency", "Voice Binding", "Camera Control"],
    color: "#00B4D8",
    recommended: true,
  },
  {
    name: "Hailuo 2.3",
    arena: "Fast Alternative",
    costPerSec: 0.025,
    costLabel: "~$0.025/sec (token plan)",
    features: ["Fast generation", "Good motion", "Basic camera", "No multi-shot"],
    color: "#3B82F6",
  },
  {
    name: "MiniMax M2.7",
    arena: "Self-Evolving",
    costPerSec: 0.02,
    costLabel: "~$0.02/sec ($0.30/M tokens)",
    features: ["Music generation", "Audio synthesis", "Self-evolving", "Cheaper bulk"],
    color: "#8B5CF6",
  },
];

export default function VideoPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<VideoStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [prospects, setProspects] = useState<ProspectOption[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showKlingConfig, setShowKlingConfig] = useState(false);
  const [klingDuration, setKlingDuration] = useState(30);
  const [klingCuts, setKlingCuts] = useState(6);

  const fetchVideos = async () => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*, prospect:prospects(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setVideos(data as VideoItem[]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast("Erreur chargement videos: " + msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // Load prospects for the form select
    const supabase = createClient();
    supabase
      .from("prospects")
      .select("id, name")
      .order("name")
      .then(({ data, error }) => {
        if (error) { toast("Erreur chargement prospects: " + error.message, "error"); return; }
        if (data) setProspects(data as ProspectOption[]);
      });
  }, []);

  const handleCreateVideo = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("videos").insert({
      title: form.title,
      prospect_id: form.prospect_id || null,
      brief: form.brief || null,
      tier: form.tier,
      api_provider: form.api_provider,
      status: "draft" as VideoStatus,
      api_cost: 0,
      billed_price: Number(TIER_CONFIG[form.tier]?.price?.replace(/[^0-9]/g, "") || 0),
    });
    if (error) { toast("Erreur: " + error.message, "error"); setSubmitting(false); return; }
    toast("Video creee", "success");
    await createNotification(
      "system",
      "Nouvelle video creee",
      form.title + (form.tier ? ` — ${TIER_CONFIG[form.tier]?.label}` : ""),
      "/production/video",
    );
    setForm(INITIAL_FORM);
    setShowCreateForm(false);
    setSubmitting(false);
    await fetchVideos();
  };

  const handleStatusChange = async (video: VideoItem, newStatus: VideoStatus) => {
    const supabase = createClient();
    const { error } = await supabase.from("videos").update({ status: newStatus }).eq("id", video.id);
    if (error) { toast("Erreur: " + error.message, "error"); return; }
    toast("Statut mis a jour", "success");

    // Synergy: video delivered/published → notification
    if (newStatus === "delivered" || newStatus === "published") {
      onVideoCompleted(video.id, video.title || "Video", video.prospect?.name);
    }

    await fetchVideos();
  };

  const filtered = videos.filter((v) => {
    if (filterStatus && v.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return v.title?.toLowerCase().includes(q) || v.brief?.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: videos.length,
    inProgress: videos.filter((v) => ["generating", "review"].includes(v.status)).length,
    delivered: videos.filter((v) => v.status === "delivered" || v.status === "published").length,
    revenue: videos.reduce((s, v) => s + v.billed_price, 0),
    cost: videos.reduce((s, v) => s + v.api_cost, 0),
  };
  const margin = stats.revenue > 0 ? ((1 - stats.cost / stats.revenue) * 100).toFixed(2) : "99.96";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            Video <span className="text-[var(--color-gold)]">Pipeline</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Kling 3.0 + Hailuo 2.3 + MiniMax via Replicate — Marge {margin}%
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-bold text-black"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Video
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-5"
        >
          <h2 className="mb-4 font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">
            Nouvelle Video
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Titre *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Titre de la video..."
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Prospect</label>
              <select
                value={form.prospect_id}
                onChange={(e) => setForm((f) => ({ ...f, prospect_id: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-gold)] focus:outline-none"
              >
                <option value="">— Sans client —</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Tier / Style</label>
              <select
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as VideoTier }))}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-gold)] focus:outline-none"
              >
                {(Object.entries(TIER_CONFIG) as [VideoTier, { label: string; price: string }][]).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label} — {cfg.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Plateforme / Provider</label>
              <select
                value={form.api_provider}
                onChange={(e) => setForm((f) => ({ ...f, api_provider: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-gold)] focus:outline-none"
              >
                <option value="kling">Kling 3.0</option>
                <option value="hailuo">Hailuo 2.3 Fast</option>
                <option value="minimax">MiniMax M2.7</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Description / Brief</label>
              <textarea
                value={form.brief}
                onChange={(e) => setForm((f) => ({ ...f, brief: e.target.value }))}
                placeholder="Description du projet video..."
                rows={3}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => { setShowCreateForm(false); setForm(INITIAL_FORM); }}
              className="rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateVideo}
              disabled={submitting || !form.title.trim()}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-gold)] px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
            >
              {submitting ? <Clock className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              {submitting ? "Creation..." : "Creer la video"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, icon: Video, color: "#00D4FF" },
          { label: "En cours", value: stats.inProgress, icon: Zap, color: "#F59E0B" },
          { label: "Livrees", value: stats.delivered, icon: Check, color: "#10B981" },
          { label: "CA", value: `${(stats.revenue / 1000).toFixed(1)}K€`, icon: DollarSign, color: "#00B4D8" },
          { label: "Marge", value: `${margin}%`, icon: Sparkles, color: "#8B5CF6" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-clash-display)] text-xl font-bold text-[var(--color-text)]">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Providers */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: "Kling 3.0", arena: "#1 (ELO 1248)", cost: "$0.10/s", color: "#00B4D8" },
          { name: "Hailuo 2.3 Fast", arena: "Rapid alt", cost: "Token plan", color: "#3B82F6" },
          { name: "MiniMax M2.7", arena: "Self-evolving", cost: "$0.30/M", color: "#8B5CF6" },
        ].map((p) => (
          <div key={p.name} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3">
            <p className="text-xs font-bold" style={{ color: p.color }}>{p.name}</p>
            <p className="text-[9px] text-[var(--color-text-muted)]">{p.arena} — {p.cost}</p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          PIPELINE TIMELINE — 8 Sequential Stages
          ══════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)]">
        <button
          onClick={() => setShowTimeline((v) => !v)}
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <Layers className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-[var(--color-text)]">
                Pipeline <span className="text-cyan-400">Timeline</span>
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                8 stages s{"\u00E9"}quentiels — Context {"\u2192"} Style Lock {"\u2192"} Storyboard {"\u2192"} Video {"\u2192"} Audio {"\u2192"} Sync {"\u2192"} Assembly {"\u2192"} Review
              </p>
            </div>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", showTimeline && "rotate-180")} />
        </button>

        {showTimeline && (
          <div className="border-t border-[var(--color-border-subtle)] p-5">
            {/* Timeline visualization */}
            <div className="relative space-y-3">
              {PIPELINE_STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const isLocked = stage.status === "locked";
                const isActive = stage.status === "active";
                const isCompleted = stage.status === "completed";
                const StatusIcon = isLocked ? Lock : isCompleted ? Check : Zap;
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Connecting line */}
                    {i < PIPELINE_STAGES.length - 1 && (
                      <div
                        className="absolute left-[18px] top-[44px] h-[calc(100%-20px)] w-[2px]"
                        style={{
                          background: isLocked
                            ? "var(--color-border-subtle)"
                            : `linear-gradient(180deg, ${stage.color}, ${PIPELINE_STAGES[i + 1].color})`,
                          opacity: isLocked ? 0.3 : 0.6,
                        }}
                      />
                    )}

                    <div
                      className={cn(
                        "flex items-start gap-4 rounded-lg border p-3 transition-all",
                        isActive && "border-cyan-500/30 bg-cyan-500/5",
                        isCompleted && "border-emerald-500/30 bg-emerald-500/5",
                        isLocked && "border-[var(--color-border-subtle)] bg-[var(--color-bg)] opacity-60"
                      )}
                    >
                      {/* Stage number + icon */}
                      <div className="relative flex flex-col items-center gap-1">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-[family-name:var(--font-mono)] text-[8px] font-bold" style={{ color: stage.color }}>
                          S{stage.id}
                        </span>
                      </div>

                      {/* Stage info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-[var(--color-text)]">{stage.title}</h3>
                          <div
                            className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
                            style={{
                              backgroundColor: isCompleted ? "#10B98115" : isActive ? "#00D4FF15" : "#6B728015",
                              color: isCompleted ? "#10B981" : isActive ? "#00D4FF" : "#6B7280",
                            }}
                          >
                            <StatusIcon className="h-2.5 w-2.5" />
                            <span className="text-[8px] font-bold uppercase">
                              {isCompleted ? "Done" : isActive ? "Active" : "Locked"}
                            </span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{stage.description}</p>

                        {/* Meta row */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5 text-[var(--color-text-muted)]" />
                            <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-text-muted)]">{stage.estimatedTime}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {stage.tools.map((tool) => (
                              <span
                                key={tool}
                                className="rounded-md px-1.5 py-0.5 text-[8px] font-medium"
                                style={{ backgroundColor: `${stage.color}10`, color: stage.color }}
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dependencies */}
                        {stage.dependencies.length > 0 && (
                          <p className="mt-1 text-[8px] text-[var(--color-text-muted)]">
                            Requires: {stage.dependencies.map((d) => `S${d}`).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          KLING 3.0 CONFIGURATION PANEL
          ══════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-cyan-500/20 bg-[var(--color-surface)]">
        <button
          onClick={() => setShowKlingConfig((v) => !v)}
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <MonitorPlay className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-[var(--color-text)]">
                Kling 3.0 <span className="text-cyan-400">Config</span>
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Provider comparison, multi-shot, Element Library, cost estimator
              </p>
            </div>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", showKlingConfig && "rotate-180")} />
        </button>

        {showKlingConfig && (
          <div className="space-y-5 border-t border-[var(--color-border-subtle)] p-5">
            {/* Provider Comparison */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-cyan-400">Provider Comparison</h3>
              <div className="grid grid-cols-3 gap-3">
                {PROVIDER_SPECS.map((prov) => (
                  <div
                    key={prov.name}
                    className={cn(
                      "relative rounded-lg border p-3",
                      prov.recommended
                        ? "border-cyan-500/30 bg-cyan-500/5"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
                    )}
                  >
                    {prov.recommended && (
                      <span className="absolute -top-2 right-2 rounded-full bg-cyan-500 px-2 py-0.5 text-[8px] font-bold text-black">
                        RECOMMENDED
                      </span>
                    )}
                    <p className="text-xs font-bold" style={{ color: prov.color }}>{prov.name}</p>
                    <p className="text-[9px] text-[var(--color-text-muted)]">{prov.arena}</p>
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] font-bold text-cyan-400">{prov.costLabel}</p>
                    <div className="mt-2 space-y-0.5">
                      {prov.features.map((f) => (
                        <div key={f} className="flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" style={{ color: prov.color }} />
                          <span className="text-[9px] text-[var(--color-text-muted)]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Shot Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400">Multi-Shot Settings</h3>
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3">
                  <div className="mb-3">
                    <label className="mb-1 block text-[9px] font-bold uppercase text-[var(--color-text-muted)]">
                      Nombre de cuts: <span className="text-cyan-400">{klingCuts}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={klingCuts}
                      onChange={(e) => setKlingCuts(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-[8px] text-[var(--color-text-muted)]">
                      <span>1 cut</span><span>6 cuts</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[9px] font-bold uppercase text-[var(--color-text-muted)]">
                      Dur{"\u00E9"}e par shot: <span className="text-cyan-400">{Math.round(klingDuration / klingCuts)}s</span>
                    </label>
                    <p className="text-[9px] text-[var(--color-text-muted)]">
                      Total: {klingCuts} cuts {"\u00D7"} {Math.round(klingDuration / klingCuts)}s = {klingDuration}s
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Estimator */}
              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <Calculator className="h-3 w-3" /> Cost Estimator
                </h3>
                <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-3">
                  <div className="mb-3">
                    <label className="mb-1 block text-[9px] font-bold uppercase text-[var(--color-text-muted)]">
                      Dur{"\u00E9"}e totale: <span className="text-cyan-400">{klingDuration}s</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={300}
                      step={5}
                      value={klingDuration}
                      onChange={(e) => setKlingDuration(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-[8px] text-[var(--color-text-muted)]">
                      <span>5s</span><span>300s (5min)</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {PROVIDER_SPECS.map((prov) => (
                      <div key={prov.name} className="flex items-center justify-between rounded-md bg-[var(--color-surface)] px-2 py-1.5">
                        <span className="text-[10px] font-medium" style={{ color: prov.color }}>{prov.name}</span>
                        <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-text)]">
                          ${(prov.costPerSec * klingDuration).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Element Library + Voice Binding (placeholders) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-dashed border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
                <Upload className="mx-auto h-6 w-6 text-cyan-400/50" />
                <p className="mt-2 text-xs font-bold text-cyan-400/70">Element Library</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Upload character reference images pour Kling 3.0 consistency
                </p>
                <button className="mt-3 rounded-lg border border-cyan-500/20 px-3 py-1.5 text-[10px] font-medium text-cyan-400 hover:bg-cyan-500/10">
                  Upload refs (bient{"\u00F4"}t)
                </button>
              </div>
              <div className="rounded-lg border border-dashed border-purple-500/20 bg-purple-500/5 p-4 text-center">
                <Mic className="mx-auto h-6 w-6 text-purple-400/50" />
                <p className="mt-2 text-xs font-bold text-purple-400/70">Voice Binding</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Upload voice sample pour XTTS-v2 (Replicate) / Qwen3-TTS cloning
                </p>
                <button className="mt-3 rounded-lg border border-purple-500/20 px-3 py-1.5 text-[10px] font-medium text-purple-400 hover:bg-purple-500/10">
                  Upload voice (bient{"\u00F4"}t)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une video..."
            className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-2.5 pl-11 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterStatus(null)}
            className={cn("rounded-lg px-3 py-2 text-[10px] font-medium", !filterStatus ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}
          >
            Tous
          </button>
          {(Object.entries(VIDEO_STATUS_CONFIG) as [VideoStatus, typeof VIDEO_STATUS_CONFIG[VideoStatus]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? null : key)}
              className={cn("rounded-lg px-3 py-2 text-[10px] font-medium", filterStatus === key ? "text-black" : "bg-[var(--color-surface)] text-[var(--color-text-muted)]")}
              style={filterStatus === key ? { backgroundColor: cfg.color } : undefined}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
          <Video className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" />
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {searchQuery ? `Rien pour \u201C${searchQuery}\u201D.` : "Le pipeline attend sa premiere creation."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((video, i) => {
            const statusCfg = VIDEO_STATUS_CONFIG[video.status];
            const StatusIcon = STATUS_ICONS[video.status];
            const tierCfg = video.tier ? TIER_CONFIG[video.tier] : null;
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="flex items-center gap-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-gold-muted)]"
              >
                <StatusIcon className="h-5 w-5 shrink-0" style={{ color: statusCfg.color }} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-[var(--color-text)]">{video.title || "Sans titre"}</h3>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{video.brief || video.prompt?.slice(0, 80) || "Pas de brief"}</p>
                </div>
                {video.prospect?.name && (
                  <span className="text-[10px] text-[var(--color-text-muted)]">{video.prospect.name}</span>
                )}
                {tierCfg && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: `${tierCfg.color}15`, color: tierCfg.color }}>
                    {tierCfg.label}
                  </span>
                )}
                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: `${statusCfg.color}15`, color: statusCfg.color }}>
                  {statusCfg.label}
                </span>
                {video.status === "review" && (
                  <button
                    onClick={() => handleStatusChange(video, "delivered")}
                    title="Marquer livree"
                    className="rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:bg-green-500/10 hover:text-green-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                <span className="font-mono text-xs font-bold text-[var(--color-gold)]">
                  {video.billed_price > 0 ? `${video.billed_price}€` : "—"}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
