import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   404 — NOT FOUND (Admin Layout)
   MODE_CADIFOR: "Cette route n'existe pas. Encore."
   ═══════════════════════════════════════════════════════════════ */

export default function NotFound() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-6"
      style={{ background: "var(--color-bg, #06080F)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-10 text-center"
        style={{
          borderColor: "rgba(0,212,255,0.12)",
          background:
            "linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(6,8,15,0.95) 100%)",
          boxShadow: "0 0 40px rgba(0,212,255,0.03)",
        }}
      >
        {/* 404 badge */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold"
          style={{
            background: "rgba(0,212,255,0.06)",
            border: "1px solid rgba(0,212,255,0.12)",
            fontFamily: "var(--font-clash-display, system-ui)",
            color: "#00D4FF",
          }}
        >
          404
        </div>

        {/* Title */}
        <h1
          className="mb-2 text-xl font-bold"
          style={{
            fontFamily: "var(--font-clash-display, system-ui)",
            color: "#E8ECF4",
          }}
        >
          Cette route n&apos;existe pas.
        </h1>
        <p
          className="mb-8 text-sm italic"
          style={{ color: "rgba(0,212,255,0.5)" }}
        >
          Encore.
        </p>

        {/* Return link */}
        <Link
          href="/"
          className="inline-block rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110"
          style={{
            background: "rgba(0,212,255,0.12)",
            color: "#00D4FF",
            border: "1px solid rgba(0,212,255,0.25)",
            boxShadow: "0 0 20px rgba(0,212,255,0.08)",
          }}
        >
          Retour au Pont
        </Link>
      </div>
    </div>
  );
}
