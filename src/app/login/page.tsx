"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, #00D4FF 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Subtle radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 600px 400px at 50% 40%, rgba(0,180,216,0.06), transparent)",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] font-[family-name:var(--font-clash-display)] text-sm font-bold text-[#0A0A0F] shadow-lg shadow-cyan-500/20">
              BG
            </div>
          </div>
          <h1 className="text-3xl font-[family-name:var(--font-clash-display)] font-bold bg-gradient-to-r from-[#00B4D8] to-[#00D4FF] bg-clip-text text-transparent">
            BYSS GROUP
          </h1>
          <p className="text-[11px] font-[family-name:var(--font-clash-display)] font-semibold uppercase tracking-[0.25em] mt-2" style={{ color: "rgba(0,212,255,0.4)" }}>
            THE EXECUTOR
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border p-8" style={{
          background: "rgba(15,15,26,0.8)",
          borderColor: "rgba(0,212,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 80px rgba(0,180,216,0.03), inset 0 1px 0 rgba(0,212,255,0.05)",
        }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)" }}>
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-[family-name:var(--font-clash-display)] font-semibold text-white mb-2">
                Lien envoye
              </h2>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Verifie ta boite. Le lien expire dans 1 heure.
              </p>
              <p className="text-sm font-mono mt-4" style={{ color: "#00D4FF" }}>
                {email}
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-6 text-xs underline transition-colors"
                style={{ color: "rgba(0,212,255,0.5)" }}
              >
                Utiliser une autre adresse
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4" style={{ color: "rgba(0,212,255,0.6)" }} />
                <h2 className="text-lg font-[family-name:var(--font-clash-display)] font-semibold text-white">
                  Acceder au Pont
                </h2>
              </div>
              <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                Le Pont ne s&apos;ouvre qu&apos;aux autorises.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(0,212,255,0.4)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gary@byss-group.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder:text-white/20 focus:outline-none transition-all text-sm"
                    style={{
                      background: "rgba(0,212,255,0.04)",
                      border: "1px solid rgba(0,212,255,0.12)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(0,212,255,0.4)";
                      e.target.style.boxShadow = "0 0 20px rgba(0,180,216,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,212,255,0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-[family-name:var(--font-clash-display)] font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #00B4D8, #00D4FF)",
                    color: "#0A0A0F",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(0,180,216,0.25)",
                  }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Acceder au Pont
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] mt-5" style={{ color: "rgba(255,255,255,0.2)" }}>
                Magic Link — pas de mot de passe.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] mt-8 font-mono" style={{ color: "rgba(0,212,255,0.2)" }}>
          BYSS GROUP SAS — Fort-de-France, Martinique
        </p>
      </motion.div>
    </div>
  );
}
