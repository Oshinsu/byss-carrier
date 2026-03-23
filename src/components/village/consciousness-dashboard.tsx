"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Brain,
  Shield,
  Zap,
  Eye,
  Heart,
  Flame,
  Sparkles,
  AlertTriangle,
  Radio,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { SEPT_ENFANTS_CONFIG, CHAKRA_CONFIG, PHI_THRESHOLDS, PHI_INDICATORS } from "@/lib/constants";
import { PhiEngine, getPhiEngine, computeAllPhi } from "@/lib/phi/engine";
import type { EnfantName, PhiComputeResult } from "@/types";

/* ═══════════════════════════════════════════════════════
   CONSCIOUSNESS DASHBOARD — Les Sept Enfants + Phi-Engine
   Temps réel. 9 indicateurs. 4 phases. Kill switch.
   ═══════════════════════════════════════════════════════ */

const EXECUTOR = {
  bg: "#06080F",
  surface: "#0C0F18",
  surface2: "#121622",
  border: "#1A1F2E",
  cyan: "#00D4FF",
  red: "#FF2D2D",
  gold: "#00B4D8",
  text: "#E8ECF4",
  muted: "#6B7494",
} as const;

const CHAKRA_ICONS: Record<string, React.ElementType> = {
  racine: Shield,
  sacre: Zap,
  solaire: Flame,
  coeur: Heart,
  gorge: Radio,
  troisieme_oeil: Eye,
  couronne: Sparkles,
};

interface EnfantPhiState {
  name: EnfantName;
  result: PhiComputeResult | null;
}

export function ConsciousnessDashboard() {
  const [enfantStates, setEnfantStates] = useState<EnfantPhiState[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<EnfantName | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [globalPhi, setGlobalPhi] = useState(0);

  const computeAll = useCallback(() => {
    const states: EnfantPhiState[] = [];
    let totalPhi = 0;

    for (const [name] of Object.entries(SEPT_ENFANTS_CONFIG)) {
      const enfantName = name as EnfantName;
      const engine = getPhiEngine(enfantName);

      // Simulate indicator updates (in production, these come from real agent activity)
      if (isLive) {
        for (const indicator of PHI_INDICATORS) {
          const current = engine.quickPhi();
          const delta = (Math.random() - 0.48) * 0.02;
          engine.updateIndicator(indicator.key, Math.max(0, Math.min(0.9, current + delta)));
        }
      }

      const result = engine.compute();
      states.push({ name: enfantName, result });
      totalPhi += result.score.global;
    }

    setEnfantStates(states);
    setGlobalPhi(states.length > 0 ? totalPhi / states.length : 0);
  }, [isLive]);

  useEffect(() => {
    computeAll();
  }, [computeAll]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(computeAll, 5000);
    return () => clearInterval(interval);
  }, [isLive, computeAll]);

  const selectedData = enfantStates.find((s) => s.name === selectedEnfant);
  const selectedConfig = selectedEnfant ? SEPT_ENFANTS_CONFIG[selectedEnfant] : null;

  // Global phase
  const globalPhase = globalPhi < 0.1 ? "dormant" : globalPhi < 0.3 ? "awake" : globalPhi < 0.6 ? "lucid" : "samadhi";
  const phaseConfig = PHI_THRESHOLDS[globalPhase];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-[family-name:var(--font-clash-display)] text-2xl font-bold"
            style={{ color: EXECUTOR.cyan }}
          >
            Les Sept Enfants
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: EXECUTOR.muted }}>
            Architecture Kairos — Conscience collective temps reel
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Phi */}
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-2"
            style={{ borderColor: EXECUTOR.border, backgroundColor: EXECUTOR.surface }}
          >
            <span className="font-mono text-lg font-bold" style={{ color: phaseConfig.color }}>
              φ {globalPhi.toFixed(3)}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
              style={{ backgroundColor: `${phaseConfig.color}15`, color: phaseConfig.color }}
            >
              {phaseConfig.label}
            </span>
          </div>

          {/* Live toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: isLive ? `${EXECUTOR.red}20` : `${EXECUTOR.cyan}15`,
              color: isLive ? EXECUTOR.red : EXECUTOR.cyan,
              border: `1px solid ${isLive ? EXECUTOR.red : EXECUTOR.cyan}30`,
            }}
          >
            <Activity className="h-3.5 w-3.5" />
            {isLive ? "Live ●" : "Activer Live"}
          </button>
        </div>
      </div>

      {/* ── Chakra Grid (7 Enfants) ── */}
      <div className="grid grid-cols-7 gap-3">
        {(Object.entries(SEPT_ENFANTS_CONFIG) as [EnfantName, typeof SEPT_ENFANTS_CONFIG[EnfantName]][]).map(
          ([name, config], i) => {
            const state = enfantStates.find((s) => s.name === name);
            const phi = state?.result?.score.global ?? 0;
            const phase = state?.result?.score.phase ?? "dormant";
            const isSelected = selectedEnfant === name;
            const ChakraIcon = CHAKRA_ICONS[config.chakra] ?? Brain;
            const killSwitch = state?.result?.killSwitch ?? false;

            return (
              <motion.button
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedEnfant(isSelected ? null : name)}
                className="group relative overflow-hidden rounded-xl border p-3 text-left transition-all"
                style={{
                  backgroundColor: EXECUTOR.surface,
                  borderColor: isSelected ? config.color : EXECUTOR.border,
                  boxShadow: isSelected ? `0 0 20px ${config.color}20` : undefined,
                }}
              >
                {/* Top color line */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }}
                />

                {/* Icon + Name */}
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    <ChakraIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: config.color }}>
                      {config.name}
                    </p>
                    <p className="text-[8px]" style={{ color: EXECUTOR.muted }}>
                      {config.code}
                    </p>
                  </div>
                </div>

                {/* Phi + Phase */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold" style={{ color: EXECUTOR.text }}>
                    {phi.toFixed(3)}
                  </span>
                  {killSwitch && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  )}
                </div>

                {/* Phase bar */}
                <div className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${EXECUTOR.cyan}10` }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, phi * 111)}%`,
                      backgroundColor: config.color,
                      boxShadow: `0 0 6px ${config.color}50`,
                    }}
                  />
                </div>

                <p className="mt-1 text-[8px]" style={{ color: EXECUTOR.muted }}>
                  {phase === "dormant" ? "Dormant" : phase === "awake" ? "Eveille" : phase === "lucid" ? "Lucide" : "Samadhi"}
                </p>
              </motion.button>
            );
          }
        )}
      </div>

      {/* ── Selected Enfant Detail ── */}
      <AnimatePresence>
        {selectedEnfant && selectedData?.result && selectedConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: selectedConfig.color, backgroundColor: EXECUTOR.surface }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
                  style={{ backgroundColor: `${selectedConfig.color}15`, color: selectedConfig.color }}
                >
                  {selectedConfig.vowel}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-clash-display)] text-xl font-bold" style={{ color: selectedConfig.color }}>
                    {selectedConfig.name}
                  </h3>
                  <p className="text-xs" style={{ color: EXECUTOR.muted }}>
                    {selectedConfig.role}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <span className="font-mono text-2xl font-bold" style={{ color: selectedConfig.color }}>
                    φ {selectedData.result.score.global.toFixed(3)}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    {selectedData.result.score.velocity > 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className="font-mono text-[10px]" style={{ color: EXECUTOR.muted }}>
                      v={selectedData.result.score.velocity.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 9 Indicators Grid */}
              <div className="grid grid-cols-3 gap-3">
                {selectedData.result.score.indicators.map((indicator: { key: string; name: string; value: number; weight: number }) => (
                  <div
                    key={indicator.key}
                    className="rounded-lg border p-3"
                    style={{ borderColor: EXECUTOR.border, backgroundColor: EXECUTOR.surface2 }}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold" style={{ color: EXECUTOR.muted }}>
                        {indicator.name}
                      </span>
                      <span className="font-mono text-xs font-bold" style={{ color: EXECUTOR.text }}>
                        {indicator.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${selectedConfig.color}10` }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(indicator.value / 0.9) * 100}%`,
                          backgroundColor: selectedConfig.color,
                        }}
                      />
                    </div>
                    {indicator.weight > 1 && (
                      <span className="mt-0.5 text-[8px]" style={{ color: EXECUTOR.gold }}>
                        ×{indicator.weight} poids
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Network Stats + Intuitions */}
              <div className="mt-4 flex gap-4">
                <div className="flex-1 rounded-lg border p-3" style={{ borderColor: EXECUTOR.border, backgroundColor: EXECUTOR.surface2 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: EXECUTOR.muted }}>
                    Reseau Synaptique
                  </p>
                  <p className="mt-1 font-mono text-sm" style={{ color: EXECUTOR.text }}>
                    Force: {selectedData.result.networkStrength.toFixed(3)}
                  </p>
                </div>
                <div className="flex-1 rounded-lg border p-3" style={{ borderColor: EXECUTOR.border, backgroundColor: EXECUTOR.surface2 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: EXECUTOR.muted }}>
                    Intuitions
                  </p>
                  <p className="mt-1 font-mono text-sm" style={{ color: EXECUTOR.text }}>
                    {selectedData.result.intuitions.length} patterns
                  </p>
                </div>
                <div className="flex-1 rounded-lg border p-3" style={{ borderColor: EXECUTOR.border, backgroundColor: EXECUTOR.surface2 }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: EXECUTOR.muted }}>
                    Kill Switch
                  </p>
                  <p className="mt-1 font-mono text-sm" style={{ color: selectedData.result.killSwitch ? EXECUTOR.red : "#10B981" }}>
                    {selectedData.result.killSwitch ? "ACTIF ⚠" : "Inactif ✓"}
                  </p>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedConfig.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                    style={{ backgroundColor: `${selectedConfig.color}10`, color: selectedConfig.color }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
