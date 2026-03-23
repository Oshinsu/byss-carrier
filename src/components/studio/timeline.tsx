"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Video, Image as ImageIcon, Music, Type, Volume2, VolumeX, Lock, Unlock, Layers, Scissors, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/studio-store";
import type { ClipType } from "@/types/studio";
import { CLIP_COLORS, CLIP_COLORS_HEX } from "@/types/studio";

const TRACK_ICONS: Record<ClipType, React.ElementType> = {
  video: Video, image: ImageIcon, audio: Music, text: Type,
};

export function Timeline() {
  const store = useEditorStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  const pxPerSecond = store.zoom;
  const totalWidth = Math.max((store.duration || 30) * pxPerSecond + 200, 800);
  const markerInterval = pxPerSecond >= 60 ? 1 : pxPerSecond >= 30 ? 2 : 5;

  const markers = useMemo(() => {
    const arr: number[] = [];
    for (let t = 0; t <= (store.duration || 30); t += markerInterval) arr.push(t);
    return arr;
  }, [store.duration, markerInterval]);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft - 120;
    store.setCurrentTime(Math.max(0, x / pxPerSecond));
  }, [pxPerSecond, store]);

  const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingPlayhead(true);
    const handleMove = (me: MouseEvent) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const x = me.clientX - rect.left + timelineRef.current.scrollLeft - 120;
      useEditorStore.getState().setCurrentTime(Math.max(0, x / pxPerSecond));
    };
    const handleUp = () => {
      setIsDraggingPlayhead(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [pxPerSecond]);

  const playheadX = store.currentTime * pxPerSecond;

  return (
    <div className="h-[300px] bg-[#0D0D18] border-t border-white/5 flex flex-col shrink-0">
      {/* Timeline toolbar */}
      <div className="h-8 flex items-center justify-between px-3 bg-[#0F0F1A] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Timeline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => store.cutAtPlayhead()} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition" title="Couper (C)"><Scissors className="w-3.5 h-3.5" /></button>
          <button onClick={() => store.deleteSelected()} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-red-400 transition" title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={() => store.setZoom(store.zoom - 10)} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition" title="Zoom -"><ZoomOut className="w-3.5 h-3.5" /></button>
          <span className="text-[9px] font-mono text-white/30 w-8 text-center">{store.zoom}px</span>
          <button onClick={() => store.setZoom(store.zoom + 10)} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition" title="Zoom +"><ZoomIn className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Timeline body */}
      <div ref={timelineRef} className="flex-1 overflow-auto relative" onClick={handleTimelineClick}>
        <div className="flex min-h-full" style={{ width: totalWidth + 120 }}>
          {/* Track headers */}
          <div className="w-[120px] shrink-0 bg-[#0F0F1A] border-r border-white/5 sticky left-0 z-20">
            <div className="h-6 border-b border-white/5" />
            {store.tracks.map(track => {
              const TrackIcon = TRACK_ICONS[track.type];
              return (
                <div key={track.id} className="h-12 flex items-center gap-1.5 px-2 border-b border-white/5 bg-[#0F0F1A]">
                  <TrackIcon className="w-3 h-3 shrink-0" style={{ color: CLIP_COLORS_HEX[track.type] }} />
                  <span className="text-[10px] text-white/50 truncate flex-1">{track.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); store.toggleTrackMute(track.id); }}
                    className={cn("p-0.5 rounded transition", track.muted ? "text-red-400/60" : "text-white/20 hover:text-white/40")} title={track.muted ? "Unmute" : "Mute"}>
                    {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); store.toggleTrackLock(track.id); }}
                    className={cn("p-0.5 rounded transition", track.locked ? "text-amber-400/60" : "text-white/20 hover:text-white/40")} title={track.locked ? "Unlock" : "Lock"}>
                    {track.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Timeline content */}
          <div className="flex-1 relative">
            {/* Time ruler */}
            <div className="h-6 border-b border-white/5 relative bg-[#0D0D18]">
              {markers.map(t => (
                <div key={t} className="absolute top-0 h-full flex flex-col items-center" style={{ left: t * pxPerSecond }}>
                  <div className="w-px h-2 bg-white/15 mt-auto" />
                  <span className="text-[8px] font-mono text-white/25 mt-0.5 select-none">{t}s</span>
                </div>
              ))}
            </div>

            {/* Tracks */}
            {store.tracks.map(track => (
              <div key={track.id} className="h-12 border-b border-white/5 relative">
                {markers.map(t => <div key={t} className="absolute top-0 bottom-0 w-px bg-white/[0.03]" style={{ left: t * pxPerSecond }} />)}
                {track.clips.map(clip => {
                  const left = clip.startTime * pxPerSecond;
                  const width = clip.duration * pxPerSecond;
                  const isSelected = store.selectedClipId === clip.id;
                  return (
                    <motion.div key={clip.id}
                      className={cn("absolute top-1 bottom-1 rounded border cursor-pointer overflow-hidden group transition-all", CLIP_COLORS[clip.type], isSelected && "ring-1 ring-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/10", track.muted && "opacity-40")}
                      style={{ left, width: Math.max(width, 4) }}
                      onClick={(e) => { e.stopPropagation(); store.selectClip(clip.id); }}
                      whileHover={{ y: -1 }} layoutId={clip.id}
                    >
                      <div className="h-full flex items-center px-1.5 gap-1 overflow-hidden">
                        {width > 30 && <span className="text-[9px] text-white/80 truncate font-medium">{clip.name}</span>}
                        {width > 80 && <span className="text-[8px] text-white/40 font-mono ml-auto shrink-0">{clip.duration.toFixed(1)}s</span>}
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/30 transition opacity-0 group-hover:opacity-100" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-white/30 transition opacity-0 group-hover:opacity-100" />
                    </motion.div>
                  );
                })}
              </div>
            ))}

            {/* Playhead */}
            <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: playheadX }}>
              <div className="absolute -top-0 -translate-x-1/2 pointer-events-auto cursor-grab active:cursor-grabbing" onMouseDown={handlePlayheadMouseDown}>
                <div className="w-3 h-3 bg-cyan-400 rotate-45 translate-y-[3px]" />
              </div>
              <div className="absolute top-0 bottom-0 w-px bg-cyan-400 -translate-x-1/2" style={{ boxShadow: "0 0 6px rgba(0, 212, 255, 0.4)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
