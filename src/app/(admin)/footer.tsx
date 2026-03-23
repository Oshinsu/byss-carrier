"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

/* ================================================================
   THE EXECUTOR — Imperial Footer
   Cyan hologram. Scanline. Bridge status bar.
   ================================================================ */

export function AdminFooter() {
  const [phiScore, setPhiScore] = useState("0.42");
  const [phiState, setPhiState] = useState("\u00C9veill\u00E9");

  /* Fetch phi-score every 60s */
  useEffect(() => {
    const fetchPhi = () => {
      fetch("/api/consciousness")
        .then((r) => r.json())
        .then((data) => {
          if (data.phi) setPhiScore(String(data.phi));
          if (data.state) setPhiState(data.state);
        })
        .catch(() => {});
    };

    fetchPhi();
    const interval = setInterval(fetchPhi, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="scanline sticky bottom-0 z-20 hidden h-8 items-center justify-between border-t px-6 text-[11px] lg:flex lg:px-8"
      style={{
        background: "rgba(10,22,40,0.95)",
        borderColor: "rgba(0,212,255,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: version in cyan */}
      <span
        className="font-semibold tracking-wider"
        style={{
          fontFamily: "var(--font-clash-display, var(--font-display)), system-ui",
          color: "#00D4FF",
        }}
      >
        THE EXECUTOR v1.0
      </span>

      {/* Center: phi badge with neon-pulse */}
      <span
        className="animate-neon-pulse inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5"
        style={{
          borderColor: "rgba(0,212,255,0.3)",
          color: "#00D4FF",
          background: "rgba(0,212,255,0.05)",
        }}
      >
        <Sparkles className="h-3 w-3" />
        {"\u03C6"} = {phiScore} | {phiState}
      </span>

      {/* Right: route count + Bridge Command */}
      <span style={{ color: "rgba(0,212,255,0.4)" }}>
        17 routes | Bridge Command | \u2318K
      </span>
    </footer>
  );
}
