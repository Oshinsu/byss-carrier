"use client";

import { useMemo } from "react";
import { MonitorPlay } from "lucide-react";
import { useEditorStore } from "@/store/studio-store";
import type { Clip } from "@/types/studio";
import { CLIP_COLORS_HEX } from "@/types/studio";

export function PreviewCanvas() {
  const { tracks, currentTime, assets } = useEditorStore();

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

  if (!visibleClip && textClips.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
        <MonitorPlay className="w-12 h-12 mb-3 opacity-40" />
        <span className="text-xs text-center leading-relaxed">Importer ou generer<br />du contenu</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {asset && (
        asset.type === "video" ? (
          <video src={asset.url} className="w-full h-full object-contain" style={{ opacity: visibleClip?.opacity ?? 1 }} muted />
        ) : (
          <img src={asset.url} alt={asset.name} className="w-full h-full object-contain" style={{ opacity: visibleClip?.opacity ?? 1 }} />
        )
      )}
      {visibleClip && !asset && (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: CLIP_COLORS_HEX[visibleClip.type] + "22" }}>
          <span className="text-xs text-white/40">{visibleClip.name}</span>
        </div>
      )}
      {textClips.map(tc => (
        <div key={tc.id} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{
            fontSize: tc.fontSize ?? 32, color: tc.fontColor ?? "#FFFFFF",
            fontFamily: tc.fontFamily === "ClashDisplay" ? "var(--font-clash-display, 'Inter')" : tc.fontFamily ?? "Inter",
            opacity: tc.opacity, textShadow: "0 2px 8px rgba(0,0,0,0.7)", fontWeight: 700,
          }}>{tc.text ?? "Text"}</span>
        </div>
      ))}
    </div>
  );
}
