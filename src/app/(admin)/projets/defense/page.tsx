"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Shield, Sword, Lock, Eye, AlertTriangle, Server, ShieldAlert } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   LOGICIEL DEFENSIF — IA-Native Security System
   Architecture "Épée et Bouclier" synergique
   Détection comportementale > antivirus signatures
   ═══════════════════════════════════════════════════════ */

const LAYERS = [
  { name: "Detection comportementale", desc: "Remplace les signatures antivirus statiques par analyse IA temps reel", icon: Eye, color: "#3B82F6" },
  { name: "Threat modeling LLM", desc: "Claude analyse les patterns d'attaque et predit les vecteurs", icon: AlertTriangle, color: "#F59E0B" },
  { name: "Couches cryptographiques", desc: "Chiffrement quantique-ready, zero-knowledge proofs", icon: Lock, color: "#10B981" },
  { name: "Agent defense", desc: "Agents autonomes de reponse aux incidents", icon: Shield, color: "#8B5CF6" },
];

const STATUSES = ["planned", "in_progress", "done"] as const;
type Status = (typeof STATUSES)[number];

function cycleStatus(s: Status): Status {
  return STATUSES[(STATUSES.indexOf(s) + 1) % STATUSES.length];
}

function statusStyle(s: Status) {
  if (s === "done") return { bg: "#10B98120", color: "#10B981", label: "done" };
  if (s === "in_progress") return { bg: "#22D3EE20", color: "#22D3EE", label: "in progress" };
  return { bg: "#6B728020", color: "#6B7280", label: "planned" };
}

export default function DefensePage() {
  const [layers, setLayers, loaded] = useLocalStorage<Record<string, Status>>(
    STORAGE_KEYS.DEFENSE_MILESTONES,
    Object.fromEntries(LAYERS.map((l) => [l.name, "planned" as Status]))
  );

  const toggle = useCallback((name: string) => {
    setLayers((prev) => ({ ...prev, [name]: cycleStatus(prev[name] ?? "planned") }));
  }, [setLayers]);

  const vals = Object.values(layers);
  const doneCount = vals.filter((s) => s === "done").length;
  const pct = Math.round((doneCount / vals.length) * 100);

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
          Logiciel <span className="text-[var(--color-fire)]">Defensif</span>
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Architecture &ldquo;Epee et Bouclier&rdquo; — IA-native security pour entreprises telecom
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
          <span className="text-xs font-semibold text-red-400">Site : Classified — Architecture interne</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Progression globale</span>
          <span className="font-mono text-sm font-bold text-[var(--color-gold)]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{doneCount}/{vals.length} layers completed</p>
      </div>

      {/* Architecture */}
      <div className="rounded-xl border border-[var(--color-fire)] bg-[#EF444408] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sword className="h-6 w-6 text-[var(--color-fire)]" />
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-fire)]">
            Epee et Bouclier
          </h2>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Synergie attaque-defense : les agents qui simulent les attaques renforcent les agents qui defendent.
          BYSS GROUP a besoin de cette architecture enterprise-grade pour vendre l&apos;IA aux telecoms.
        </p>
      </div>

      {/* 4 Layers — clickable */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Security Layers — click to toggle status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            const s = layers[layer.name] ?? "planned";
            const st = statusStyle(s);
            return (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggle(layer.name)}
                className="cursor-pointer rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-gold)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: layer.color }} />
                    <h3 className="text-sm font-bold text-[var(--color-text)]">{layer.name}</h3>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{layer.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Research Sources */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <Server className="mb-2 h-5 w-5 text-[var(--color-gold)]" />
        <h3 className="text-sm font-bold text-[var(--color-text)]">Sources academiques</h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Harvard, MIT, Stanford, Berkeley — theses sur architecture securite, protection quantique, systemes chiffres, agent attack/defense.
        </p>
      </div>
    </div>
  );
}
