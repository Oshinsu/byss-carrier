"use client";

import { motion } from "motion/react";
import { X, Check, Trash2, CalendarDays, Users, Phone, Flag, Briefcase, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  { value: "event", label: "\u00c9v\u00e9nement", icon: CalendarDays, dotColor: "bg-cyan-400" },
  { value: "rdv", label: "RDV", icon: Users, dotColor: "bg-emerald-400" },
  { value: "relance", label: "Relance", icon: Phone, dotColor: "bg-orange-400" },
  { value: "deadline", label: "Deadline", icon: Flag, dotColor: "bg-red-400" },
  { value: "production", label: "Production", icon: Briefcase, dotColor: "bg-purple-400" },
  { value: "meeting", label: "Meeting", icon: Target, dotColor: "bg-blue-400" },
] as const;

const PRESET_COLORS = [
  { value: "#00B4D8", label: "Cyan", className: "bg-cyan-400" },
  { value: "#EF4444", label: "Rouge", className: "bg-red-400" },
  { value: "#22C55E", label: "Vert", className: "bg-emerald-400" },
  { value: "#A855F7", label: "Violet", className: "bg-purple-400" },
  { value: "#F97316", label: "Orange", className: "bg-orange-400" },
  { value: "#E2E8F0", label: "Blanc", className: "bg-slate-200" },
] as const;

export interface EventFormData {
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  type: string;
  description: string;
  prospect_id: string;
  color: string;
}

export const EMPTY_FORM: EventFormData = {
  title: "", date: "", time_start: "", time_end: "",
  type: "event", description: "", prospect_id: "", color: "#00B4D8",
};

export interface ProspectOption {
  id: string;
  name: string;
}

export function EventModal({
  form, setForm, onSubmit, onClose, onDelete, isEditing, prospects, saving,
}: {
  form: EventFormData;
  setForm: (f: EventFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  prospects: ProspectOption[];
  saving: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            {isEditing ? "Modifier l\u2019\u00e9v\u00e9nement" : "Nouvel \u00e9v\u00e9nement"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Titre <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Call client, Livraison..."
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 outline-none transition-colors focus:border-cyan-400/60" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Date <span className="text-red-400">*</span></label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">D\u00e9but</label>
              <input type="time" value={form.time_start} onChange={(e) => setForm({ ...form, time_start: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Fin</label>
              <input type="time" value={form.time_end} onChange={(e) => setForm({ ...form, time_end: e.target.value })}
                className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map((t) => {
                const Icon = t.icon;
                const active = form.type === t.value;
                return (
                  <button key={t.value} onClick={() => setForm({ ...form, type: t.value })}
                    className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      active ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-400" : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-white/20 hover:text-[var(--color-text)]")}>
                    <Icon className="h-3.5 w-3.5" />{t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Notes, d\u00e9tails..."
              className="w-full resize-none rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 outline-none transition-colors focus:border-cyan-400/60" />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Prospect li\u00e9</label>
            <select value={form.prospect_id} onChange={(e) => setForm({ ...form, prospect_id: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-cyan-400/60 [color-scheme:dark]">
              <option value="">Aucun</option>
              {prospects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Couleur</label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button key={c.value} onClick={() => setForm({ ...form, color: c.value })}
                  className={cn("h-8 w-8 rounded-full transition-all", c.className,
                    form.color === c.value ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0F0F1A] scale-110" : "opacity-60 hover:opacity-100"
                  )} title={c.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            {isEditing && onDelete && (
              <button onClick={onDelete} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10">
                <Trash2 className="h-3.5 w-3.5" />Supprimer
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-[var(--color-border-subtle)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">Annuler</button>
            <button onClick={onSubmit} disabled={!form.title.trim() || !form.date || saving}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Check className="h-3.5 w-3.5" />}
              {isEditing ? "Mettre \u00e0 jour" : "Cr\u00e9er"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
