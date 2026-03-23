"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Clock, Move, Palette, Volume2, Type, Film, Hash, SlidersHorizontal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/studio-store";
import type { Clip } from "@/types/studio";
import { CLIP_COLORS_HEX } from "@/types/studio";

/* ── Shared Inspector Primitives ── */
function InspectorSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.02] hover:bg-white/[0.04] transition">
        <Icon className="w-3 h-3 text-white/30" />
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider flex-1 text-left">{title}</span>
        <ChevronRight className={cn("w-3 h-3 text-white/20 transition-transform", open && "rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-2.5 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/30">{label}</span>
      <span className="text-[10px] font-mono text-white/60">{value}</span>
    </div>
  );
}

function InspectorSlider({ label, value, min, max, step, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30">{label}</span>
        <span className="text-[10px] font-mono text-white/60">{value.toFixed(step < 1 ? 2 : 0)}{suffix ?? ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer" />
    </div>
  );
}

/* ── Clip Inspector ── */
function ClipInspector({ clip }: { clip: Clip }) {
  const updateClip = useEditorStore(s => s.updateClip);
  const update = (k: string, v: number | string) => updateClip(clip.trackId, clip.id, { [k]: v });

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CLIP_COLORS_HEX[clip.type] }} />
          <span className="text-xs font-semibold text-white/80 truncate">{clip.name}</span>
        </div>

        <InspectorSection title="Position" icon={Clock}>
          <InspectorRow label="Debut" value={`${clip.startTime.toFixed(2)}s`} />
          <InspectorRow label="Duree" value={`${clip.duration.toFixed(2)}s`} />
        </InspectorSection>

        <InspectorSection title="Transform" icon={Move}>
          <InspectorSlider label="Echelle" value={clip.scale} min={0.1} max={3} step={0.05} onChange={(v) => update("scale", v)} />
          <InspectorSlider label="Rotation" value={clip.rotation} min={-360} max={360} step={1} onChange={(v) => update("rotation", v)} suffix="deg" />
          <InspectorSlider label="Opacite" value={clip.opacity} min={0} max={1} step={0.01} onChange={(v) => update("opacity", v)} />
        </InspectorSection>

        <InspectorSection title="Effets" icon={Palette}>
          <InspectorSlider label="Flou" value={clip.blur} min={0} max={20} step={0.5} onChange={(v) => update("blur", v)} suffix="px" />
          <InspectorRow label="Color Grade" value={clip.colorGrade} />
        </InspectorSection>

        {clip.type === "text" && (
          <InspectorSection title="Texte" icon={Type}>
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30">Contenu</label>
              <input value={clip.text ?? ""} onChange={(e) => update("text", e.target.value)}
                className="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-cyan-500/30" />
            </div>
            <InspectorSlider label="Taille" value={clip.fontSize ?? 32} min={8} max={120} step={1} onChange={(v) => update("fontSize", v)} suffix="px" />
            <div className="flex items-center gap-2 mt-1">
              <label className="text-[10px] text-white/30 w-14">Couleur</label>
              <input type="color" value={clip.fontColor ?? "#FFFFFF"} onChange={(e) => update("fontColor", e.target.value)} className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent" />
              <span className="text-[10px] font-mono text-white/40">{clip.fontColor ?? "#FFFFFF"}</span>
            </div>
          </InspectorSection>
        )}

        {(clip.type === "audio" || clip.type === "video") && (
          <InspectorSection title="Audio" icon={Volume2}>
            <InspectorSlider label="Volume" value={clip.volume} min={0} max={2} step={0.01} onChange={(v) => update("volume", v)} />
            <InspectorSlider label="Fade In" value={clip.fadeIn} min={0} max={5} step={0.1} onChange={(v) => update("fadeIn", v)} suffix="s" />
            <InspectorSlider label="Fade Out" value={clip.fadeOut} min={0} max={5} step={0.1} onChange={(v) => update("fadeOut", v)} suffix="s" />
          </InspectorSection>
        )}
      </div>
    </>
  );
}

/* ── Project Inspector ── */
function ProjectInspector() {
  const { format, resolution, fps, tracks, assets, duration } = useEditorStore();
  const totalClips = tracks.reduce((sum, t) => sum + t.clips.length, 0);

  return (
    <div className="space-y-3">
      <InspectorSection title="Projet" icon={Film}>
        <InspectorRow label="Format" value={format} />
        <InspectorRow label="Resolution" value={`${resolution.w}x${resolution.h}`} />
        <InspectorRow label="FPS" value={String(fps)} />
        <InspectorRow label="Duree" value={`${duration.toFixed(1)}s`} />
      </InspectorSection>
      <InspectorSection title="Statistiques" icon={Hash}>
        <InspectorRow label="Assets" value={String(assets.length)} />
        <InspectorRow label="Clips" value={String(totalClips)} />
        <InspectorRow label="Pistes" value={String(tracks.length)} />
      </InspectorSection>
      <InspectorSection title="Cout estime" icon={SlidersHorizontal}>
        <InspectorRow label="Kling 3.0 (5s)" value="$0.30" />
        <InspectorRow label="MiniMax (30s)" value="$0.05" />
        <InspectorRow label="Replicate (img)" value="$0.01" />
        <div className="border-t border-white/5 pt-1.5 mt-1.5"><InspectorRow label="Total estime" value="$0.36" /></div>
      </InspectorSection>
      <InspectorSection title="Raccourcis" icon={Settings}>
        {[["Espace", "Play / Pause"], ["J / K / L", "Reculer / Pause / Avancer"], ["C", "Couper au playhead"], ["Suppr", "Supprimer clip"], ["Ctrl+Z / Y", "Annuler / Refaire"], ["+ / -", "Zoom timeline"], ["I / O", "Points In / Out"]].map(([key, desc]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400/60 bg-cyan-400/5 px-1 rounded">{key}</span>
            <span className="text-[10px] text-white/30">{desc}</span>
          </div>
        ))}
      </InspectorSection>
    </div>
  );
}

/* ── Main Export ── */
export function PropertiesInspector({ selectedClip }: { selectedClip: Clip | null }) {
  return (
    <aside className="w-[250px] bg-[#0F0F1A] border-l border-white/5 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-white/5">
        <h3 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" /> {selectedClip ? "Proprietes" : "Projet"}
        </h3>
      </div>
      <div className="p-3 space-y-3">
        {selectedClip ? <ClipInspector clip={selectedClip} /> : <ProjectInspector />}
      </div>
    </aside>
  );
}
