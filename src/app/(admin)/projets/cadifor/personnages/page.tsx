"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Crown, Sword, Heart, Skull, Flame, Shield, Plus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ── Icon mapping for DB entries ─────────────────────── */
const ICON_MAP: Record<string, typeof Heart> = {
  Heart, Crown, Flame, Shield, Skull, Sword,
};

const COLOR_OPTIONS = [
  { label: "Rose", color: "text-pink-400", bg: "bg-pink-400/10" },
  { label: "Or", color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Rouge", color: "text-red-400", bg: "bg-red-400/10" },
  { label: "Bleu", color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Violet", color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Emeraude", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

/* ── Fallback data ───────────────────────────────────── */
const FALLBACK_CHARACTERS = [
  { name: "Marjory", role: "La Resiliente", arc: "Survie a Reconquete", iconName: "Heart", colorIdx: 0 },
  { name: "Rose", role: "La Stratege", arc: "Ombre a Lumiere", iconName: "Crown", colorIdx: 1 },
  { name: "Viki", role: "Le Rebelle", arc: "Destruction a Construction", iconName: "Flame", colorIdx: 2 },
  { name: "Aberthol", role: "Le Sage", arc: "Doute a Certitude", iconName: "Shield", colorIdx: 3 },
  { name: "Evil Pichon", role: "L'Antagoniste", arc: "Pouvoir a Chute", iconName: "Skull", colorIdx: 4 },
  { name: "Cadifor", role: "Le Fondateur", arc: "Mythe a Realite", iconName: "Sword", colorIdx: 5 },
];

type Character = {
  id?: string;
  name: string;
  role: string;
  arc: string;
  iconName: string;
  colorIdx: number;
};

export default function PersonnagesPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", arc: "", iconName: "Heart", colorIdx: 0 });
  const { toast } = useToast();

  /* ── Fetch from Supabase, fallback to hardcoded ───── */
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("lore_entries")
          .select("id, title, metadata")
          .eq("universe", "cadifor")
          .eq("category", "personnage")
          .order("created_at", { ascending: true });

        if (error || !data || data.length === 0) {
          setCharacters(FALLBACK_CHARACTERS);
        } else {
          setCharacters(
            data.map((d) => ({
              id: d.id,
              name: d.title,
              role: d.metadata?.role ?? "",
              arc: d.metadata?.arc ?? "",
              iconName: d.metadata?.iconName ?? "Heart",
              colorIdx: d.metadata?.colorIdx ?? 0,
            }))
          );
        }
      } catch {
        setCharacters(FALLBACK_CHARACTERS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Insert new character ─────────────────────────── */
  async function handleAdd() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("lore_entries")
        .insert({
          universe: "cadifor",
          category: "personnage",
          title: form.name.trim(),
          metadata: { role: form.role.trim(), arc: form.arc.trim(), iconName: form.iconName, colorIdx: form.colorIdx },
        })
        .select("id, title, metadata")
        .single();

      if (error) {
        toast("Erreur: " + error.message, "error");
      } else if (data) {
        setCharacters((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.title,
            role: data.metadata?.role ?? "",
            arc: data.metadata?.arc ?? "",
            iconName: data.metadata?.iconName ?? "Heart",
            colorIdx: data.metadata?.colorIdx ?? 0,
          },
        ]);
        toast(`Personnage ajouté — ${data.title}`, "success");
        setForm({ name: "", role: "", arc: "", iconName: "Heart", colorIdx: 0 });
        setShowForm(false);
      }
    } catch {
      toast("Erreur lors de l'ajout", "error");
    } finally {
      setSaving(false);
    }
  }

  function getIcon(iconName: string) {
    return ICON_MAP[iconName] ?? Heart;
  }
  function getColor(idx: number) {
    return COLOR_OPTIONS[idx] ?? COLOR_OPTIONS[0];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Users className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Personnages
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            Les figures du Cadifor — {characters.length} arcs narratifs
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] px-3 py-1.5 text-xs font-semibold text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)]/20"
        >
          {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showForm ? "Annuler" : "Ajouter personnage"}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-surface)]"
          >
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  placeholder="Nom"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                />
                <input
                  placeholder="Role (ex: Le Sage)"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                />
                <input
                  placeholder="Arc narratif"
                  value={form.arc}
                  onChange={(e) => setForm((f) => ({ ...f, arc: e.target.value }))}
                  className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Icone:</span>
                  {Object.keys(ICON_MAP).map((name) => {
                    const I = ICON_MAP[name];
                    return (
                      <button
                        key={name}
                        onClick={() => setForm((f) => ({ ...f, iconName: name }))}
                        className={`rounded-md p-1.5 transition-colors ${form.iconName === name ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
                      >
                        <I className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Couleur:</span>
                  {COLOR_OPTIONS.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setForm((f) => ({ ...f, colorIdx: idx }))}
                      className={`h-5 w-5 rounded-full border-2 transition-all ${c.bg} ${form.colorIdx === idx ? "border-white scale-110" : "border-transparent"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  disabled={saving || !form.name.trim()}
                  className="ml-auto flex items-center gap-1.5 rounded-lg bg-[var(--color-gold)] px-4 py-2 text-xs font-bold text-black transition-opacity disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Characters grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-gold)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((char, i) => {
            const Icon = getIcon(char.iconName);
            const clr = getColor(char.colorIdx);
            return (
              <motion.div
                key={char.id ?? char.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="group rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-gold)]/30"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${clr.bg}`}>
                    <Icon className={`h-5 w-5 ${clr.color}`} />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-clash-display)] text-base font-bold text-[var(--color-text)]">
                      {char.name}
                    </h3>
                    <span className={`text-xs font-medium ${clr.color}`}>{char.role}</span>
                  </div>
                </div>
                <div className="rounded-md bg-[var(--color-surface-raised)] px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Arc narratif</span>
                  <p className="mt-0.5 text-sm font-medium text-[var(--color-text-secondary)]">{char.arc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
