"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Play, Pause, Square, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore, saveToStorage } from "@/store/studio-store";
import { useToast } from "@/hooks/use-toast";
import { formatTimecode } from "@/types/studio";

import { Toolbar } from "@/components/studio/toolbar";
import { MediaPanel } from "@/components/studio/media-panel";
import { PreviewCanvas } from "@/components/studio/preview-canvas";
import { PropertiesInspector } from "@/components/studio/properties-inspector";
import { Timeline } from "@/components/studio/timeline";

/* ═══════════════════════════════════════════════════════════════
   BYSS STUDIO — AI Video Editor
   Montage IA — Kling 3.0 x Remotion x Claude
   ═══════════════════════════════════════════════════════════════ */

export default function StudioPage() {
  const store = useEditorStore();
  const { toast } = useToast();
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Auto-save ── */
  useEffect(() => {
    const unsub = useEditorStore.subscribe((state) => saveToStorage(state));
    return unsub;
  }, []);

  /* ── Playback loop ── */
  useEffect(() => {
    if (store.isPlaying) {
      playIntervalRef.current = setInterval(() => {
        const s = useEditorStore.getState();
        const next = s.currentTime + (1 / s.fps);
        if (next >= s.duration) { s.setCurrentTime(0); s.setIsPlaying(false); }
        else s.setCurrentTime(next);
      }, 1000 / store.fps);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [store.isPlaying, store.fps, store.duration]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const s = useEditorStore.getState();
      switch (e.key) {
        case " ": e.preventDefault(); s.setIsPlaying(!s.isPlaying); break;
        case "j": s.setCurrentTime(s.currentTime - 5); break;
        case "k": s.setIsPlaying(false); break;
        case "l": s.setCurrentTime(s.currentTime + 5); break;
        case "c": if (!e.ctrlKey && !e.metaKey) s.cutAtPlayhead(); break;
        case "Delete": case "Backspace": s.deleteSelected(); break;
        case "z": if (e.ctrlKey || e.metaKey) { e.preventDefault(); s.undo(); } break;
        case "y": if (e.ctrlKey || e.metaKey) { e.preventDefault(); s.redo(); } break;
        case "+": case "=": s.setZoom(s.zoom + 10); break;
        case "-": s.setZoom(s.zoom - 10); break;
        case "i": toast("In point: " + formatTimecode(s.currentTime), "info"); break;
        case "o": toast("Out point: " + formatTimecode(s.currentTime), "info"); break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toast]);

  /* ── Find selected clip ── */
  const selectedClip = useMemo(() => {
    if (!store.selectedClipId) return null;
    for (const track of store.tracks) {
      const clip = track.clips.find(c => c.id === store.selectedClipId);
      if (clip) return clip;
    }
    return null;
  }, [store.selectedClipId, store.tracks]);

  /* ── Render ── */
  return (
    <div className="fixed inset-0 flex flex-col bg-[#0A0A0F] text-white overflow-hidden select-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ═══ HEADER BAR ═══ */}
      <Toolbar />

      {/* ═══ MAIN BODY ═══ */}
      <div className="flex flex-1 min-h-0">
        {/* ═══ LEFT: MEDIA PANEL ═══ */}
        <MediaPanel />

        {/* ═══ CENTER + RIGHT ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-1 min-h-0">
            {/* ═══ PREVIEW ═══ */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0F] p-4 min-w-0">
              <div
                className="relative bg-black rounded-lg overflow-hidden border border-white/5 shadow-2xl shadow-black/50 w-full"
                style={{
                  maxWidth: store.format === "9:16" ? "280px" : "640px",
                  aspectRatio: store.format === "16:9" ? "16/9" : store.format === "9:16" ? "9/16" : "1/1",
                }}
              >
                <PreviewCanvas />
                <div className="absolute top-2 right-2 text-[9px] font-mono bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-white/40">
                  {store.resolution.w}x{store.resolution.h} · {store.fps}fps
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => store.setCurrentTime(0)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => store.setIsPlaying(!store.isPlaying)}
                  className={cn("p-3 rounded-xl transition", store.isPlaying ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" : "bg-white/5 text-white hover:bg-white/10")}
                >
                  {store.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={() => { store.setIsPlaying(false); store.setCurrentTime(0); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
                  <Square className="w-4 h-4" />
                </button>
                <button onClick={() => store.setCurrentTime(Math.min(store.currentTime + 5, store.duration))} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition">
                  <SkipForward className="w-4 h-4" />
                </button>
                <div className="ml-3 font-mono text-xs text-white/50 tabular-nums">
                  {formatTimecode(store.currentTime)}
                  <span className="text-white/20 mx-1">/</span>
                  {formatTimecode(store.duration || 10)}
                </div>
              </div>
            </div>

            {/* ═══ INSPECTOR ═══ */}
            <PropertiesInspector selectedClip={selectedClip} />
          </div>

          {/* ═══ TIMELINE ═══ */}
          <Timeline />
        </div>
      </div>
    </div>
  );
}
