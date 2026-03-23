import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Logo */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] font-[family-name:var(--font-clash-display)] text-lg font-bold text-[#0A0A0F] mb-8">
        BG
      </div>

      <h1
        className="font-[family-name:var(--font-clash-display)] font-bold"
        style={{
          fontSize: "clamp(4rem, 12vw, 8rem)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #00B4D8, #00D4FF, #00B4D8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>

      <p
        className="text-lg mt-4 mb-2 font-[family-name:var(--font-clash-display)] font-semibold tracking-wide"
        style={{ color: "var(--color-text)" }}
      >
        Cette route n{"'"}existe pas encore
      </p>

      <p
        className="text-sm mb-8"
        style={{ color: "var(--color-text-muted)" }}
      >
        Le module que vous cherchez est peut-etre en cours de construction.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-[family-name:var(--font-clash-display)] font-semibold text-sm tracking-wide transition-all hover:opacity-90 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #00B4D8, #00D4FF)",
          color: "#0A0A0F",
        }}
      >
        Retour au Hub
      </Link>

      <p
        className="mt-12 text-[10px] uppercase tracking-[0.2em] font-semibold"
        style={{ color: "var(--color-text-muted)", opacity: 0.4 }}
      >
        BYSS EMPIRE
      </p>
    </div>
  );
}
