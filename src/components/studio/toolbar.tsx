"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Undo2, Redo2, Ratio, ChevronDown, Save, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore, saveToStorage } from "@/store/studio-store";
import { useToast } from "@/hooks/use-toast";
import type { Format } from "@/types/studio";
import { FORMAT_RESOLUTIONS } from "@/types/studio";

export function Toolbar() {
  const store = useEditorStore();
  const { toast } = useToast();
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(store.projectName);

  const handleSave = useCallback(() => {
    saveToStorage(useEditorStore.getState());
    toast("Projet sauvegarde", "success");
  }, [toast]);

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-[#0F0F1A] border-b border-white/5 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-clash-display, 'Inter')" }}>BYSS STUDIO</span>
          <span className="text-[10px] text-white/30 hidden sm:inline">Montage IA — Kling 3.0 x Remotion x Claude</span>
        </div>
        <div className="w-px h-5 bg-white/10" />
        {editingName ? (
          <input autoFocus className="bg-white/5 border border-cyan-500/40 rounded px-2 py-0.5 text-sm text-white w-48 outline-none"
            value={nameInput} onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => { store.setProjectName(nameInput || "Projet Sans Titre"); setEditingName(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") { store.setProjectName(nameInput || "Projet Sans Titre"); setEditingName(false); } }} />
        ) : (
          <button onClick={() => { setNameInput(store.projectName); setEditingName(true); }} className="text-sm text-white/60 hover:text-white transition truncate max-w-[200px]">
            {store.projectName}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => store.undo()} className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-white transition" title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
        <button onClick={() => store.redo()} className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-white transition" title="Redo (Ctrl+Y)"><Redo2 className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-white/10" />

        {/* Format Selector */}
        <div className="relative">
          <button onClick={() => setShowFormatDropdown(!showFormatDropdown)} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono transition">
            <Ratio className="w-3.5 h-3.5 text-cyan-400" /> {store.format} <ChevronDown className="w-3 h-3 text-white/40" />
          </button>
          <AnimatePresence>
            {showFormatDropdown && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 bg-[#1A1A2E] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl">
                {(["16:9", "9:16", "1:1"] as Format[]).map(f => (
                  <button key={f} onClick={() => { store.setFormat(f); setShowFormatDropdown(false); }}
                    className={cn("block w-full text-left px-4 py-2 text-xs font-mono hover:bg-white/5 transition", f === store.format && "text-cyan-400 bg-cyan-400/5")}>
                    {f} — {FORMAT_RESOLUTIONS[f].w}x{FORMAT_RESOLUTIONS[f].h}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs transition">
          <Save className="w-3.5 h-3.5" /> Sauvegarder
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-semibold transition border border-cyan-500/20">
          <Download className="w-3.5 h-3.5" /> Exporter
        </button>
      </div>
    </header>
  );
}
