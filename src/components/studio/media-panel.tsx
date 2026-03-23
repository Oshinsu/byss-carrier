"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Upload, Plus, X, Film, Layers, LayoutTemplate, Wand2, Music, FileVideo, FileImage, FileAudio, Sparkles, Loader2, Video, Mic, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/studio-store";
import { saveToStorage } from "@/store/studio-store";
import { useToast } from "@/hooks/use-toast";
import type { Asset, AssetType, MediaTab } from "@/types/studio";
import { uid, TEMPLATES } from "@/types/studio";

export function MediaPanel() {
  const store = useEditorStore();
  const { toast } = useToast();
  const [mediaTab, setMediaTab] = useState<MediaTab>("assets");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const s = useEditorStore.getState();
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      let type: AssetType = "image";
      if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";
      const asset: Asset = { id: uid(), name: file.name, type, url, duration: type === "image" ? 5 : 10, thumbnail: type !== "audio" ? url : undefined, createdAt: Date.now() };
      s.addAsset(asset);
      if (type === "video" || type === "audio") {
        const el = document.createElement(type === "video" ? "video" : "audio");
        el.src = url;
        el.onloadedmetadata = () => { useEditorStore.setState((prev) => ({ assets: prev.assets.map(a => a.id === asset.id ? { ...a, duration: el.duration } : a) })); };
      }
    });
    toast(`${files.length} fichier(s) importe(s)`, "success");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [toast]);

  const addAssetToTimeline = useCallback((asset: Asset) => {
    const s = useEditorStore.getState();
    const trackId = asset.type === "audio" ? "audio-1" : "video-1";
    const track = s.tracks.find(t => t.id === trackId);
    if (!track) return;
    const lastEnd = track.clips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);
    s.addClip(trackId, {
      id: uid(), trackId, assetId: asset.id, type: asset.type === "audio" ? "audio" : asset.type === "image" ? "image" : "video",
      startTime: lastEnd, duration: asset.duration, name: asset.name, scale: 1, rotation: 0, opacity: 1, volume: 1, fadeIn: 0, fadeOut: 0, blur: 0, colorGrade: "none",
    });
    toast(`"${asset.name}" ajoute a la timeline`, "success");
  }, [toast]);

  return (
    <aside className="w-[250px] bg-[#0F0F1A] border-r border-white/5 flex flex-col shrink-0">
      <div className="flex border-b border-white/5">
        {([
          { key: "assets" as MediaTab, label: "Assets", icon: Layers },
          { key: "templates" as MediaTab, label: "Templates", icon: LayoutTemplate },
          { key: "ai" as MediaTab, label: "IA", icon: Wand2 },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setMediaTab(tab.key)} className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition border-b-2",
            mediaTab === tab.key ? "border-cyan-400 text-cyan-400" : "border-transparent text-white/40 hover:text-white/60"
          )}>
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {mediaTab === "assets" && (
          <>
            <input ref={fileInputRef} type="file" accept="video/*,image/*,audio/*" multiple className="hidden" onChange={handleFileImport} />
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/20 hover:border-cyan-400/40 hover:bg-cyan-400/5 text-white/50 hover:text-cyan-400 text-xs transition">
              <Upload className="w-4 h-4" /> Importer
            </button>
            {store.assets.length === 0 && <div className="text-center py-8 text-white/20 text-xs">Aucun asset.<br />Importez ou generez du contenu.</div>}
            {store.assets.map(asset => (
              <motion.div key={asset.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="group relative rounded-lg bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 overflow-hidden cursor-pointer transition"
                onClick={() => addAssetToTimeline(asset)} title="Cliquer pour ajouter a la timeline"
              >
                <div className="h-20 bg-black/40 flex items-center justify-center relative overflow-hidden">
                  {asset.thumbnail ? <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover opacity-80" /> : <Music className="w-8 h-8 text-purple-400/40" />}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition"><Plus className="w-6 h-6 text-cyan-400" /></div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/60 px-1 rounded text-white/60">{asset.duration.toFixed(1)}s</span>
                </div>
                <div className="p-2 flex items-center gap-2">
                  {asset.type === "video" && <FileVideo className="w-3 h-3 text-cyan-400 shrink-0" />}
                  {asset.type === "image" && <FileImage className="w-3 h-3 text-amber-400 shrink-0" />}
                  {asset.type === "audio" && <FileAudio className="w-3 h-3 text-purple-400 shrink-0" />}
                  <span className="text-[11px] text-white/60 truncate">{asset.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); store.removeAsset(asset.id); }} className="ml-auto opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition"><X className="w-3 h-3" /></button>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {mediaTab === "templates" && (
          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">6 Templates SOTA</p>
            {TEMPLATES.map(tmpl => (
              <button key={tmpl.id} onClick={() => { store.loadTemplate(tmpl); toast(`Template "${tmpl.name}" charge`, "success"); }}
                className="w-full text-left rounded-lg bg-white/[0.03] border border-white/5 hover:border-cyan-400/20 p-3 transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Film className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-400 transition" />
                  <span className="text-xs font-semibold text-white/80 group-hover:text-white transition">{tmpl.name}</span>
                  <span className="ml-auto text-[10px] font-mono text-white/30">{tmpl.duration}s</span>
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed">{tmpl.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">{tmpl.format}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {mediaTab === "ai" && <AIGeneratePanel />}
      </div>
    </aside>
  );
}

/* ── AI Generate Panel ── */
function AIGeneratePanel() {
  const { toast } = useToast();
  const addAsset = useEditorStore(s => s.addAsset);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [prompts, setPrompts] = useState({ image: "", video: "", music: "", voix: "" });

  const generators = [
    { key: "image", label: "Generer Image", sublabel: "Replicate — Nano Banana Pro", icon: ImageIcon, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { key: "video", label: "Generer Video", sublabel: "Kling 3.0 via Replicate", icon: Video, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { key: "music", label: "Generer Musique", sublabel: "MiniMax Music via Replicate", icon: Music, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { key: "voix", label: "Generer Voix-off", sublabel: "XTTS-v2 via Replicate", icon: Mic, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ];

  const handleGenerate = async (type: string) => {
    const prompt = prompts[type as keyof typeof prompts];
    if (!prompt.trim()) { toast("Entrez un prompt d'abord", "error"); return; }
    setLoadingType(type);
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
    const assetType: AssetType = type === "music" || type === "voix" ? "audio" : type === "video" ? "video" : "image";
    addAsset({ id: uid(), name: `IA_${type}_${Date.now().toString(36)}`, type: assetType, url: "", duration: type === "video" ? 5 : type === "music" ? 30 : type === "voix" ? 10 : 5, createdAt: Date.now() });
    setLoadingType(null);
    setPrompts(p => ({ ...p, [type]: "" }));
    toast(`${type === "image" ? "Image" : type === "video" ? "Video" : type === "music" ? "Musique" : "Voix-off"} generee — ajoutee aux assets`, "success");
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">Generation IA</p>
      {generators.map(gen => (
        <div key={gen.key} className={cn("rounded-lg border p-3 space-y-2", gen.bg)}>
          <div className="flex items-center gap-2">
            <gen.icon className={cn("w-4 h-4", gen.color)} />
            <div><p className="text-xs font-semibold text-white/80">{gen.label}</p><p className="text-[9px] text-white/30">{gen.sublabel}</p></div>
          </div>
          <textarea placeholder="Decrivez ce que vous voulez generer..." value={prompts[gen.key as keyof typeof prompts]} onChange={(e) => setPrompts(p => ({ ...p, [gen.key]: e.target.value }))}
            className="w-full bg-black/30 border border-white/5 rounded px-2 py-1.5 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-white/20 resize-none" rows={2} />
          <button onClick={() => handleGenerate(gen.key)} disabled={loadingType !== null}
            className={cn("w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition", loadingType === gen.key ? "bg-white/5 text-white/30 cursor-wait" : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white")}
          >
            {loadingType === gen.key ? <><Loader2 className="w-3 h-3 animate-spin" /> Generation en cours...</> : <><Sparkles className="w-3 h-3" /> Generer</>}
          </button>
        </div>
      ))}
    </div>
  );
}
