"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

/**
 * BYSS CARRIER — Hyperspace Entry
 *
 * Since auth is skipped on localhost (Gary's personal machine),
 * this page is now a CINEMATIC LAUNCH SEQUENCE.
 * On production (Netlify), the Magic Link flow is preserved.
 */

// Star field for hyperspace effect
function StarField({ active }: { active: boolean }) {
  const [stars, setStars] = useState<Array<{id:number;x:number;y:number;size:number;speed:number;delay:number}>>([]);
  useEffect(() => {
    setStars(Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 3 + 1,
      delay: Math.random() * 2,
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: `rgba(0, 212, 255, ${0.3 + star.speed * 0.2})`,
          }}
          animate={
            active
              ? {
                  x: [(star.x - 50) * 0, (star.x - 50) * 40],
                  y: [(star.y - 50) * 0, (star.y - 50) * 40],
                  scale: [1, star.speed * 3],
                  opacity: [0.8, 0],
                }
              : { opacity: [0.2, 0.8, 0.2] }
          }
          transition={
            active
              ? { duration: 1.2, ease: "easeIn", delay: star.delay * 0.3 }
              : { duration: 2 + star.delay, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

// Hyperspace tunnel lines
function HyperspaceTunnel({ active }: { active: boolean }) {
  if (!active) return null;
  const lines = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: (i / 60) * 360,
    length: Math.random() * 40 + 20,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute"
          style={{
            width: 2,
            height: line.length,
            background: `linear-gradient(to bottom, transparent, #00D4FF, transparent)`,
            transformOrigin: "center center",
            transform: `rotate(${line.angle}deg) translateY(-50%)`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0, 3, 8] }}
          transition={{ duration: 1.5, delay: line.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "engaging" | "hyperspace" | "arrived">("idle");
  const [systemsOnline, setSystemsOnline] = useState(0);

  const SYSTEMS = [
    "SUPABASE",
    "CLAUDE API",
    "RAG PIPELINE",
    "VILLAGE IA",
    "GULF STREAM",
    "JARVIS",
    "SOTAI V3",
    "SHIELDS",
  ];

  const engage = useCallback(() => {
    setPhase("engaging");

    // Boot sequence — each system comes online
    SYSTEMS.forEach((_, i) => {
      setTimeout(() => setSystemsOnline(i + 1), 300 + i * 250);
    });

    // All systems online → hyperspace
    setTimeout(() => setPhase("hyperspace"), 300 + SYSTEMS.length * 250 + 500);

    // Arrived → redirect
    setTimeout(() => {
      setPhase("arrived");
      setTimeout(() => router.push("/"), 400);
    }, 300 + SYSTEMS.length * 250 + 2000);
  }, [router]);

  // On localhost: show the button, user clicks to engage
  // The hyperspace animation plays, THEN redirects to dashboard

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#06080F" }}
    >
      {/* Star field */}
      <StarField active={phase === "hyperspace"} />

      {/* Hyperspace tunnel */}
      <HyperspaceTunnel active={phase === "hyperspace"} />

      {/* Flash white on arrival */}
      <AnimatePresence>
        {phase === "arrived" && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0, 212, 255, 0.15)" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #00D4FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow — intensifies during hyperspace */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: phase === "hyperspace" ? 1 : phase === "engaging" ? 0.5 : 0.3,
        }}
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(0,180,216,0.08), transparent)",
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{
          opacity: phase === "hyperspace" || phase === "arrived" ? 0 : 1,
          y: phase === "hyperspace" ? -100 : 0,
          scale: phase === "hyperspace" ? 0.8 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{
              boxShadow:
                phase === "engaging"
                  ? "0 0 60px rgba(0,212,255,0.3)"
                  : "0 0 0px transparent",
            }}
            style={{ borderRadius: "16px", display: "inline-flex" }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#0A0A0F] shadow-lg shadow-cyan-500/30">
              BG
            </div>
          </motion.div>
          <h1 className="text-4xl font-[family-name:var(--font-clash-display)] font-bold bg-gradient-to-r from-[#00B4D8] to-[#00D4FF] bg-clip-text text-transparent">
            BYSS CARRIER
          </h1>
          <p
            className="text-[11px] font-[family-name:var(--font-clash-display)] font-semibold uppercase tracking-[0.3em] mt-2"
            style={{ color: "rgba(0,212,255,0.4)" }}
          >
            THE EXECUTOR
          </p>
        </div>

        {/* Boot sequence */}
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "rgba(15,15,26,0.8)",
            borderColor:
              phase === "engaging"
                ? "rgba(0,212,255,0.25)"
                : "rgba(0,212,255,0.08)",
            backdropFilter: "blur(20px)",
            transition: "border-color 0.5s",
          }}
        >
          {phase === "idle" ? (
            <div className="text-center py-6">
              <motion.button
                onClick={engage}
                className="px-8 py-4 rounded-xl font-[family-name:var(--font-clash-display)] font-bold text-lg cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #00B4D8, #00D4FF)",
                  color: "#0A0A0F",
                  boxShadow: "0 4px 30px rgba(0,180,216,0.3)",
                }}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 50px rgba(0,180,216,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                ENGAGER L&apos;HYPERESPACE
              </motion.button>
              <p
                className="text-[11px] mt-4 font-mono"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                Tous les systèmes en attente.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-mono"
                style={{ color: "rgba(0,212,255,0.5)" }}
              >
                Séquence d&apos;initialisation
              </p>
              {SYSTEMS.map((sys, i) => {
                const isOnline = i < systemsOnline;
                return (
                  <motion.div
                    key={sys}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}
                    className="flex items-center gap-3 py-1"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      animate={{
                        background: isOnline ? "#00D4FF" : "rgba(255,255,255,0.1)",
                        boxShadow: isOnline
                          ? "0 0 8px rgba(0,212,255,0.6)"
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span
                      className="text-xs font-mono"
                      style={{
                        color: isOnline ? "rgba(0,212,255,0.9)" : "rgba(255,255,255,0.2)",
                        transition: "color 0.3s",
                      }}
                    >
                      {sys}
                    </span>
                    <AnimatePresence>
                      {isOnline && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] font-mono ml-auto"
                          style={{ color: "#10B981" }}
                        >
                          ONLINE
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {systemsOnline >= SYSTEMS.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-3 mt-3 text-center"
                  style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}
                >
                  <p
                    className="text-sm font-[family-name:var(--font-clash-display)] font-bold"
                    style={{ color: "#00D4FF" }}
                  >
                    TOUS SYSTÈMES NOMINAUX
                  </p>
                  <p
                    className="text-[10px] font-mono mt-1"
                    style={{ color: "rgba(0,212,255,0.4)" }}
                  >
                    Passage en hyperespace...
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="text-center text-[10px] mt-8 font-mono"
          style={{ color: "rgba(0,212,255,0.15)" }}
        >
          BYSS GROUP SAS — Fort-de-France, Martinique
        </p>
      </motion.div>
    </div>
  );
}
