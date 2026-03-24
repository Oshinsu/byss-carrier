"use client";

import { useMemo, useRef, useEffect } from "react";
import { MonitorPlay, Play } from "lucide-react";
import { useEditorStore } from "@/store/studio-store";
import type { Clip } from "@/types/studio";
import { CLIP_COLORS_HEX, formatTimecode } from "@/types/studio";

export function PreviewCanvas() {
  const { tracks, currentTime, isPlaying, assets, duration } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Find the topmost visible video/image clip at currentTime ── */
  const visibleClip = useMemo(() => {
    const videoTracks = tracks.filter(t => (t.type === "video" || t.type === "image") && t.visible);
    for (const track of videoTracks) {
      for (const clip of track.clips) {
        if (currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration) return clip;
      }
    }
    return null;
  }, [tracks, currentTime]);

  const asset = useMemo(() => {
    if (!visibleClip?.assetId) return null;
    return assets.find(a => a.id === visibleClip.assetId) ?? null;
  }, [visibleClip, assets]);

  /* ── Text overlays ── */
  const textClips = useMemo(() => {
    const textTracks = tracks.filter(t => t.type === "text" && t.visible);
    const result: Clip[] = [];
    for (const track of textTracks) {
      for (const clip of track.clips) {
        if (currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration) result.push(clip);
      }
    }
    return result;
  }, [tracks, currentTime]);

  /* ── Sync video element with playhead ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visibleClip || !asset || asset.type !== "video") return;

    const clipTime = currentTime - visibleClip.startTime;

    if (isPlaying) {
      // If playing, let the video play and sync periodically
      if (video.paused) {
        video.currentTime = clipTime;
        video.play().catch(() => {});
      }
      // Correct drift if > 0.3s off
      if (Math.abs(video.currentTime - clipTime) > 0.3) {
        video.currentTime = clipTime;
      }
    } else {
      // If paused, seek to exact position
      video.pause();
      video.currentTime = clipTime;
    }
  }, [currentTime, isPlaying, visibleClip, asset]);

  /* ── Audio clips ── */
  const audioClip = useMemo(() => {
    const audioTracks = tracks.filter(t => t.type === "audio" && t.visible && !t.muted);
    for (const track of audioTracks) {
      for (const clip of track.clips) {
        if (currentTime >= clip.startTime && currentTime < clip.startTime + clip.duration) return clip;
      }
    }
    return null;
  }, [tracks, currentTime]);

  /* ── Progress bar ── */
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── Empty state ── */
  if (!visibleClip && textClips.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
        <MonitorPlay className="w-12 h-12 mb-3 opacity-40" />
        <span className="text-xs text-center leading-relaxed">
          Importer ou generer<br />du contenu
        </span>
        {/* Show playback indicator even without clips */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-0.5 bg-cyan-500/30">
              <div className="h-full bg-cyan-400 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between px-2 py-1">
              <span className="text-[9px] font-mono text-cyan-400/50">{formatTimecode(currentTime)}</span>
              <span className="text-[9px] font-mono text-white/20 flex items-center gap-1">
                <Play className="w-2.5 h-2.5 fill-current" /> Playing
              </span>
              <span className="text-[9px] font-mono text-white/20">{formatTimecode(duration)}</span>
            </div>
          </div>
        )}
        {/* Always show progress bar */}
        {!isPlaying && currentTime > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
            <div className="h-full bg-cyan-500/40 transition-all duration-75" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Video asset */}
      {asset && asset.type === "video" && (
        <video
          ref={videoRef}
          src={asset.url}
          className="w-full h-full object-contain"
          style={{ opacity: visibleClip?.opacity ?? 1 }}
          muted={visibleClip?.volume === 0}
          playsInline
          preload="auto"
        />
      )}

      {/* Image asset */}
      {asset && asset.type === "image" && (
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-full object-contain"
          style={{ opacity: visibleClip?.opacity ?? 1 }}
        />
      )}

      {/* Color placeholder for clips without assets */}
      {visibleClip && !asset && (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: (CLIP_COLORS_HEX[visibleClip.type] || "#00B4D8") + "22" }}
        >
          <div className="text-center">
            <span className="text-sm text-white/40 block">{visibleClip.name}</span>
            <span className="text-[10px] text-white/20 font-mono mt-1 block">
              {formatTimecode(currentTime - visibleClip.startTime)} / {formatTimecode(visibleClip.duration)}
            </span>
          </div>
        </div>
      )}

      {/* Text overlays */}
      {textClips.map(tc => (
        <div key={tc.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{
            fontSize: tc.fontSize ?? 32,
            color: tc.fontColor ?? "#FFFFFF",
            fontFamily: tc.fontFamily === "ClashDisplay" ? "var(--font-clash-display, 'Inter')" : tc.fontFamily ?? "Inter",
            opacity: tc.opacity,
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            fontWeight: 700,
          }}>
            {tc.text ?? "Text"}
          </span>
        </div>
      ))}

      {/* Progress overlay */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-0.5 bg-white/10">
          <div className="h-full bg-cyan-400 transition-all duration-75" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
