"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Landmark, Users, Search, X, Eye, EyeOff } from "lucide-react";

const CITIES = [
  // Empire Pangeen (8)
  { name: "Mwamba", faction: "Empire Pangeen", pop: "800K", type: "Capitale imperiale", color: "text-amber-400" },
  { name: "Pangara", faction: "Empire Pangeen", pop: "520K", type: "Cite marchande", color: "text-amber-400" },
  { name: "Ossara", faction: "Empire Pangeen", pop: "410K", type: "Cite ossuaire", color: "text-amber-400" },
  { name: "Titanis", faction: "Empire Pangeen", pop: "350K", type: "Forteresse", color: "text-amber-400" },
  { name: "Kradoria", faction: "Empire Pangeen", pop: "280K", type: "Village", color: "text-amber-400" },
  { name: "Vertholm", faction: "Empire Pangeen", pop: "190K", type: "Mine", color: "text-amber-400" },
  { name: "Senathal", faction: "Empire Pangeen", pop: "230K", type: "Temple", color: "text-amber-400" },
  { name: "Brachifort", faction: "Empire Pangeen", pop: "145K", type: "Forteresse", color: "text-amber-400" },
  // Volonia (7)
  { name: "Volonis", faction: "Volonia", pop: "320K", type: "Port", color: "text-blue-400" },
  { name: "Volomare", faction: "Volonia", pop: "210K", type: "Capitale", color: "text-blue-400" },
  { name: "Tidalis", faction: "Volonia", pop: "175K", type: "Port", color: "text-blue-400" },
  { name: "Marevoss", faction: "Volonia", pop: "140K", type: "Village", color: "text-blue-400" },
  { name: "Coralhaven", faction: "Volonia", pop: "95K", type: "Port", color: "text-blue-400" },
  { name: "Thessalia", faction: "Volonia", pop: "260K", type: "Forteresse", color: "text-blue-400" },
  { name: "Abyssara", faction: "Volonia", pop: "110K", type: "Temple", color: "text-blue-400" },
  // Ishtir (7)
  { name: "Ishtara", faction: "Ishtir", pop: "450K", type: "Capitale", color: "text-purple-400" },
  { name: "Nakhir", faction: "Ishtir", pop: "270K", type: "Temple", color: "text-purple-400" },
  { name: "Zephyris", faction: "Ishtir", pop: "185K", type: "Temple", color: "text-purple-400" },
  { name: "Oraklos", faction: "Ishtir", pop: "130K", type: "Village", color: "text-purple-400" },
  { name: "Frillgate", faction: "Ishtir", pop: "210K", type: "Forteresse", color: "text-purple-400" },
  { name: "Ambralis", faction: "Ishtir", pop: "155K", type: "Mine", color: "text-purple-400" },
  { name: "Pteronost", faction: "Ishtir", pop: "90K", type: "Village", color: "text-purple-400" },
  // Morkthal (5)
  { name: "Karthok", faction: "Morkthal", pop: "180K", type: "Capitale", color: "text-red-400" },
  { name: "Ashkral", faction: "Morkthal", pop: "95K", type: "Forteresse", color: "text-red-400" },
  { name: "Vorrekhan", faction: "Morkthal", pop: "120K", type: "Village", color: "text-red-400" },
  { name: "Rapthor", faction: "Morkthal", pop: "75K", type: "Mine", color: "text-red-400" },
  { name: "Skarneth", faction: "Morkthal", pop: "60K", type: "Village", color: "text-red-400" },
  // Dravenkhor (4)
  { name: "Dravenhold", faction: "Dravenkhor", pop: "290K", type: "Capitale", color: "text-emerald-400" },
  { name: "Feronis", faction: "Dravenkhor", pop: "340K", type: "Forteresse", color: "text-emerald-400" },
  { name: "Dhaalgor", faction: "Dravenkhor", pop: "160K", type: "Mine", color: "text-emerald-400" },
  { name: "Osstheim", faction: "Dravenkhor", pop: "105K", type: "Mine", color: "text-emerald-400" },
];

const LS_KEY = "jw-cites-visited";

export default function CitesPage() {
  const [search, setSearch] = useState("");
  const [visited, setVisited] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setVisited(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleVisited = (name: string) => {
    setVisited((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const filtered = search.trim()
    ? CITIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.faction.toLowerCase().includes(search.toLowerCase()))
    : CITIES;

  const visitedCount = CITIES.filter((c) => visited[c.name]).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Landmark className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Cites
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            {CITIES.length} cites a travers les territoires — {visitedCount} explorees
          </p>
        </div>
      </div>

      {/* Exploration progress */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Exploration</span>
          <span className="font-mono text-xs text-[var(--color-gold)]">{visitedCount}/{CITIES.length}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${CITIES.length > 0 ? (visitedCount / CITIES.length) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Rechercher une cite..."
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

      {/* Cities table */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]/30">
              <th className="py-2 pl-4 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Cite</th>
              <th className="py-2 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Faction</th>
              <th className="py-2 pr-3 text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
              <th className="py-2 pr-3 text-right text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Population</th>
              <th className="py-2 pr-4 text-center text-[9px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Visite</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((city, i) => (
              <motion.tr
                key={city.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`border-b border-[var(--color-border-subtle)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30 ${visited[city.name] ? "opacity-70" : ""}`}
              >
                <td className="py-2.5 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                    <span className="text-sm font-medium text-[var(--color-text)]">{city.name}</span>
                  </div>
                </td>
                <td className={`py-2.5 pr-3 text-xs font-medium ${city.color}`}>{city.faction}</td>
                <td className="py-2.5 pr-3 text-xs text-[var(--color-text-muted)]">{city.type}</td>
                <td className="py-2.5 pr-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="h-3 w-3 text-[var(--color-text-muted)]" />
                    <span className="font-mono text-xs text-[var(--color-text-secondary)]">{city.pop}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-center">
                  <button
                    onClick={() => toggleVisited(city.name)}
                    className="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[var(--color-surface-raised)]"
                    title={visited[city.name] ? "Marquer non-exploree" : "Marquer exploree"}
                  >
                    {visited[city.name] ? (
                      <Eye className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
