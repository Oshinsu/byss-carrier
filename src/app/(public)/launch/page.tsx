"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Monitor, Smartphone, Globe, Download, Zap, Shield, AudioLines } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   BYSS CARRIER — Launch Page
   3 modes: Web App | Desktop App | Mobile App (PWA)
   ═══════════════════════════════════════════════════════════════ */

export default function LaunchPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Listen for PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    // @ts-ignore — beforeinstallprompt event
    deferredPrompt.prompt();
    // @ts-ignore
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#06080F]">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.03)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle, #00B4D8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mb-12 text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF]">
          <span className="font-[family-name:var(--font-clash-display)] text-2xl font-bold text-[#06080F]">
            BG
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-5xl font-bold text-white">
          BYSS <span className="text-[#00B4D8]">CARRIER</span>
        </h1>
        <p className="mt-3 text-lg text-[#8892A5]">
          Le Porte-Avions du BYSS EMPIRE
        </p>
      </motion.div>

      {/* 3 Launch Buttons */}
      <div className="relative z-10 grid w-full max-w-4xl gap-6 px-6 md:grid-cols-3">
        {/* Web App */}
        <motion.a
          href="/login"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group flex flex-col items-center gap-4 rounded-2xl border border-[#1A1A2E] bg-[#0A0A14] p-8 transition-all hover:border-[#00B4D8]/40 hover:shadow-[0_0_40px_rgba(0,180,216,0.1)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] transition-colors group-hover:bg-[#00B4D8]/20">
            <Globe className="h-8 w-8" />
          </div>
          <h2 className="font-[family-name:var(--font-clash-display)] text-xl font-semibold text-white">
            Web App
          </h2>
          <p className="text-center text-sm text-[#8892A5]">
            Accéder via le navigateur. Aucune installation.
          </p>
          <div className="mt-auto flex items-center gap-2 rounded-lg bg-[#00B4D8] px-6 py-2.5 text-sm font-semibold text-[#06080F] transition-colors group-hover:bg-[#00D4FF]">
            <Zap className="h-4 w-4" />
            Lancer
          </div>
        </motion.a>

        {/* Desktop App (PWA) */}
        <motion.button
          onClick={isInstalled ? () => window.location.href = "/" : handleInstallPWA}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group flex flex-col items-center gap-4 rounded-2xl border border-[#1A1A2E] bg-[#0A0A14] p-8 transition-all hover:border-[#00B4D8]/40 hover:shadow-[0_0_40px_rgba(0,180,216,0.1)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] transition-colors group-hover:bg-[#00B4D8]/20">
            <Monitor className="h-8 w-8" />
          </div>
          <h2 className="font-[family-name:var(--font-clash-display)] text-xl font-semibold text-white">
            App Bureau
          </h2>
          <p className="text-center text-sm text-[#8892A5]">
            {isInstalled
              ? "Déjà installée. Ouvrir."
              : deferredPrompt
                ? "Installer sur le bureau. Accès rapide."
                : "Disponible via Chrome. Installer comme app native."}
          </p>
          <div className="mt-auto flex items-center gap-2 rounded-lg border border-[#00B4D8] px-6 py-2.5 text-sm font-semibold text-[#00B4D8] transition-colors group-hover:bg-[#00B4D8] group-hover:text-[#06080F]">
            <Download className="h-4 w-4" />
            {isInstalled ? "Ouvrir" : "Installer"}
          </div>
        </motion.button>

        {/* Mobile App (PWA) */}
        <motion.button
          onClick={isInstalled ? () => window.location.href = "/" : handleInstallPWA}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="group flex flex-col items-center gap-4 rounded-2xl border border-[#1A1A2E] bg-[#0A0A14] p-8 transition-all hover:border-[#00B4D8]/40 hover:shadow-[0_0_40px_rgba(0,180,216,0.1)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] transition-colors group-hover:bg-[#00B4D8]/20">
            <Smartphone className="h-8 w-8" />
          </div>
          <h2 className="font-[family-name:var(--font-clash-display)] text-xl font-semibold text-white">
            App Mobile
          </h2>
          <p className="text-center text-sm text-[#8892A5]">
            {isInstalled
              ? "Déjà installée. Ouvrir."
              : "Ajouter à l'écran d'accueil. PWA native."}
          </p>
          <div className="mt-auto flex items-center gap-2 rounded-lg border border-[#00B4D8] px-6 py-2.5 text-sm font-semibold text-[#00B4D8] transition-colors group-hover:bg-[#00B4D8] group-hover:text-[#06080F]">
            <Smartphone className="h-4 w-4" />
            {isInstalled ? "Ouvrir" : "Installer"}
          </div>
        </motion.button>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-16 flex flex-wrap justify-center gap-8 text-sm text-[#8892A5]"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#00B4D8]" />
          Auth Magic Link
        </div>
        <div className="flex items-center gap-2">
          <AudioLines className="h-4 w-4 text-[#00B4D8]" />
          JARVIS Voice
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#00B4D8]" />
          IA Multi-Agent
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-[#00B4D8]" />
          Offline Ready
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-12 text-xs text-[#8892A5]"
      >
        BYSS GROUP SAS — Le vaisseau attend l&apos;ordre.
      </motion.p>
    </div>
  );
}
