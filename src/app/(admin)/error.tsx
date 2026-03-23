"use client";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL ERROR PAGE — Admin Layout
   MODE_CADIFOR: "Le systeme a flanche. Pas le vaisseau."
   ═══════════════════════════════════════════════════════════════ */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-6"
      style={{ background: "var(--color-bg, #06080F)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-10 text-center"
        style={{
          borderColor: "rgba(0,212,255,0.15)",
          background:
            "linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(6,8,15,0.95) 100%)",
          boxShadow: "0 0 60px rgba(0,212,255,0.04)",
        }}
      >
        {/* Sigil */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{
            background: "rgba(255,45,45,0.08)",
            border: "1px solid rgba(255,45,45,0.15)",
          }}
        >
          <span style={{ color: "#FF2D2D" }}>&#x2715;</span>
        </div>

        {/* Title */}
        <h1
          className="mb-2 text-2xl font-bold"
          style={{
            fontFamily: "var(--font-clash-display, system-ui)",
            color: "#E8ECF4",
          }}
        >
          Le systeme a flanche.
        </h1>
        <p
          className="mb-6 text-sm"
          style={{ color: "rgba(0,212,255,0.6)" }}
        >
          Pas le vaisseau.
        </p>

        {/* Dev error details */}
        {isDev && error?.message && (
          <pre
            className="mb-6 max-h-[140px] overflow-auto rounded-xl p-4 text-left text-xs"
            style={{
              background: "rgba(255,45,45,0.05)",
              border: "1px solid rgba(255,45,45,0.12)",
              color: "#FF6B6B",
            }}
          >
            {error.message}
          </pre>
        )}

        {/* Reset button */}
        <button
          onClick={reset}
          className="rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
          style={{
            background: "rgba(0,212,255,0.12)",
            color: "#00D4FF",
            border: "1px solid rgba(0,212,255,0.25)",
            boxShadow: "0 0 20px rgba(0,212,255,0.08)",
          }}
        >
          Recharger
        </button>
      </div>
    </div>
  );
}
