"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Search, X, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

const CATEGORIES = [
  {
    name: "Imperiales",
    color: "text-amber-400",
    structures: [
      "Palais d'Os de Titanosaure", "Arene Pangeen", "Tour du Senat", "Aqueduc de Vertebres",
      "Colisee de Femurs", "Bibliotheque Ossifiee", "Pont de Cotes", "Caserne Imperiale",
      "Grenier a Grains Pangeen", "Thermes de Vertebres", "Observatoire du Cretace",
      "Archives du Senat", "Place du Triomphe Osseux", "Marche aux Fossiles",
      "Portail d'Os Monumental", "Mausolee des Imperators",
    ],
  },
  {
    name: "Tribales",
    color: "text-red-400",
    structures: [
      "Hutte de Cuir de Raptor", "Totem Cretal", "Enclos de Dressage", "Campement Nomade",
      "Autel de Chasse", "Tannerie de Peaux", "Tour de Guet en Os",
      "Palissade de Griffes", "Foyer du Conseil Tribal", "Ecurie de Raptors",
      "Atelier de Pieges", "Fumoir a Viande", "Arene de Dressage",
      "Cache d'Armes Nomade", "Tambour de Guerre Geant",
    ],
  },
  {
    name: "Maritimes",
    color: "text-blue-400",
    structures: [
      "Cite Flottante sur Carapace", "Dock de Plesiosaure", "Phare de Corne", "Bassin d'Elevage",
      "Arsenal Maritime", "Temple de la Maree",
      "Chantier Naval d'Ecailles", "Tour de Vigie Cotiere", "Marche aux Perles",
      "Entrepot Subaquatique", "Pont-Levis de Coquillages", "Recif Fortifie",
      "Bastion des Courants", "Elevage de Mosasaures",
    ],
  },
  {
    name: "Mystiques",
    color: "text-purple-400",
    structures: [
      "Temple de Frilles", "Oracle de Fossile", "Sanctuaire de l'Ambre", "Grotte des Anciens",
      "Pyramide de Stegosaure", "Jardin Petrifie",
      "Cercle de Pierres Cretacees", "Tour de l'Oracle", "Fontaine d'Ambre Liquide",
      "Labyrinthe des Visions", "Autel des Ptero-Esprits", "Bibliotheque des Prophecies",
      "Monolithe du Temps", "Arbre Fossilise Sacre",
    ],
  },
  {
    name: "Souterraines",
    color: "text-emerald-400",
    structures: [
      "Forge de Dravenhold", "Mine de Fossiles", "Hall des Marteaux", "Caverne-Cite",
      "Fonderie d'Os Mineral", "Tunnel du Serment",
      "Puits de Magma", "Salle du Trone Souterrain", "Depot de Minerais d'Os",
      "Galerie des Cristaux", "Forge de Dhaal", "Pont Suspendu des Abysses",
      "Chambre des Echos", "Atelier de Siege",
    ],
  },
];

export default function StructuresPage() {
  const [search, setSearch] = useState("");
  const [documented, setDocumented] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.JW_STRUCTURES, {});
  const q = search.toLowerCase();

  const toggleDocumented = (name: string) => {
    setDocumented((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const totalStructures = CATEGORIES.reduce((sum, c) => sum + c.structures.length, 0);
  const documentedCount = CATEGORIES.reduce(
    (sum, c) => sum + c.structures.filter((s) => documented[s]).length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Building2 className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <PageHeader title="Structures" />
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            {totalStructures} architectures tribales et imperiales — {documentedCount} documentees
          </p>
        </div>
      </div>

      {/* Documentation progress */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Documentation</span>
          <span className="font-mono text-xs text-[var(--color-gold)]">{documentedCount}/{totalStructures}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${totalStructures > 0 ? (documentedCount / totalStructures) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Rechercher une structure..."
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

      {/* Categories */}
      {CATEGORIES.map((cat, ci) => {
        const items = q ? cat.structures.filter((s) => s.toLowerCase().includes(q)) : cat.structures;
        if (q && items.length === 0) return null;
        const catDocumented = items.filter((s) => documented[s]).length;
        return (
          <div key={cat.name}>
            <div className="mb-2 flex items-center gap-2">
              <Building2 className={`h-4 w-4 ${cat.color}`} />
              <h2 className={`text-xs font-semibold uppercase tracking-wider ${cat.color}`}>{cat.name}</h2>
              <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{catDocumented}/{items.length}</span>
            </div>
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((structure, i) => (
                <motion.button
                  key={structure}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (ci * 0.03) + (i * 0.015) }}
                  onClick={() => toggleDocumented(structure)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    documented[structure]
                      ? "border-[var(--color-gold)]/30 bg-[var(--color-gold-glow)] text-[var(--color-text)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-gold)]/30"
                  }`}
                >
                  {documented[structure] ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold)]" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
                  )}
                  <span className={documented[structure] ? "opacity-70" : ""}>{structure}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
