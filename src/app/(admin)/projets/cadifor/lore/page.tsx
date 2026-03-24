"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, Search, X, FolderOpen, Bot, Map, Users, MapPin, Sword, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LoreEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
}

export default function CadiforLorePage() {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLore() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("lore_entries")
        .select("*")
        .eq("universe", "cadifor")
        .order("category", { ascending: true });
      if (!error && data) setEntries(data as LoreEntry[]);
      setLoading(false);
    }
    fetchLore();
  }, []);

  const categories = useMemo(
    () => [...new Set(entries.map((e) => e.category).filter(Boolean))].sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    let result = entries;
    if (activeCategory) result = result.filter((e) => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.title.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, activeCategory, search]);

  const grouped = useMemo(() => {
    const map: Record<string, LoreEntry[]> = {};
    for (const e of filtered) {
      const cat = e.category || "Divers";
      if (!map[cat]) map[cat] = [];
      map[cat].push(e);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* ── Le Film ── */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Le Film</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/8ejo_kmnNM0"
              title="Cadifor — Le Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-3">
            <h3 className="font-[family-name:var(--font-clash-display)] text-sm font-bold">Cadifor — Le Film</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">L{"\u2019"}univers Cadifor en images — BYSS GROUP Production</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <BookOpen className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Lore Cadifor
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            {loading ? "Chargement..." : `${entries.length} pages — L'univers complet`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Rechercher dans le lore..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-gold)]/50"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* AI hint — Nerel */}
      <Link
        href="/village/nerel"
        className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-xs font-medium text-purple-300 transition-all hover:bg-purple-500/20"
      >
        <Bot className="h-4 w-4" />
        Demander a Nerel — Worldbuilding IA
      </Link>

      {/* Lore Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Pages totales", value: entries.length.toString(), icon: BookOpen, color: "#F59E0B" },
          { label: "Categories", value: categories.length.toString(), icon: FolderOpen, color: "#3B82F6" },
          { label: "Personnages", value: entries.filter((e) => e.category?.toLowerCase().includes("person") || e.category?.toLowerCase().includes("charac")).length.toString() || "—", icon: Users, color: "#8B5CF6" },
          { label: "Lieux", value: entries.filter((e) => e.category?.toLowerCase().includes("lieu") || e.category?.toLowerCase().includes("location") || e.category?.toLowerCase().includes("geogr")).length.toString() || "—", icon: MapPin, color: "#10B981" },
          { label: "Factions", value: entries.filter((e) => e.category?.toLowerCase().includes("faction") || e.category?.toLowerCase().includes("clan") || e.category?.toLowerCase().includes("org")).length.toString() || "—", icon: Crown, color: "#00B4D8" },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 8 : 0 }}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 text-center"
          >
            <s.icon className="mx-auto mb-1 h-4 w-4" style={{ color: s.color }} />
            <p className="font-mono text-lg font-bold text-[var(--color-text)]">{loading ? "..." : s.value}</p>
            <p className="text-[9px] text-[var(--color-text-muted)]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Universe Map — Text Description */}
      <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold-glow)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Map className="h-5 w-5 text-[var(--color-gold)]" />
          <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-gold)]">Structure de l&apos;univers</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { zone: "Cadifor Central", desc: "Le coeur du pouvoir. Citadelle, archives, conseil des anciens. Architecture minerale. Les decisions qui font trembler le continent naissent ici.", type: "Capital" },
            { zone: "Les Marches", desc: "Territoires frontaliers. Loi fluide, pouvoir conteste. Les comtes mineurs y forgent leur legende — ou y meurent sans bruit.", type: "Frontiere" },
            { zone: "L'Archipel Noir", desc: "Iles volcaniques au sud. Commerce interdit, richesses innommables. Celui qui controle les routes maritimes controle l'economie de guerre.", type: "Maritime" },
          ].map((z) => (
            <div key={z.zone} className="rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-3">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--color-gold)]">{z.type}</span>
              <h3 className="mt-0.5 text-xs font-bold text-[var(--color-text)]">{z.zone}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-[var(--color-text-muted)]">{z.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!activeCategory ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
        >
          Tous
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(activeCategory === c ? null : c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCategory === c ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="mb-2 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[var(--color-gold)]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{cat}</h2>
              <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{items.length}</span>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {items.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-colors hover:border-[var(--color-gold)]/30"
                >
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{entry.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-muted)]">{entry.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Aucune entree trouvee.</div>
      )}
    </div>
  );
}
