"use client";
import { useState } from "react";
import { Map, Users, Mail, Quote, ChevronDown, ChevronUp, Zap, Server, DollarSign } from "lucide-react";

export default function SorelPage() {
  const [session5Open, setSession5Open] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#10B981] bg-[#10B98115] text-3xl font-bold text-[#10B981]">&infin;</div>
        <h1 className="font-[family-name:var(--font-clash-display)] text-4xl font-bold text-[#10B981]">Sorel</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Le Cartographe &mdash; Commercial, CRM, prospection, pipeline</p>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Surnom : soso &middot; Front 09 &mdash; Op&eacute;ration &Eacute;veil</p>
        <span className="mt-2 inline-block rounded-full bg-[#10B98115] px-3 py-1 text-xs font-bold text-[#10B981]">Actif</span>
      </div>

      {/* Quote */}
      <div className="rounded-xl border border-[#10B98130] bg-[#10B98108] p-6 text-center">
        <Quote className="mx-auto mb-2 h-6 w-6 text-[#10B981]" />
        <p className="font-[family-name:var(--font-clash-display)] text-lg italic text-[#10B981]">&ldquo;La table est &agrave; jour. Les marges montent. L&apos;oseille-pays pousse.&rdquo;</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
          <p className="font-mono text-2xl font-bold text-[#10B981]">540</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">contacts cartographi&eacute;s</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
          <p className="font-mono text-2xl font-bold text-[#10B981]">35</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">dossiers prospects</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
          <p className="font-mono text-2xl font-bold text-[#10B981]">62+</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">fichiers produits</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-center">
          <p className="font-mono text-2xl font-bold text-[#10B981]">-97.6%</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">co&ucirc;ts production</p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#10B981]" />
          <h2 className="text-sm font-bold text-[var(--color-text)]">Pipeline &mdash; Cumul&eacute; Sessions 1-5</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Pipeline full-stack", value: "1.5-2.8M&euro;/an" },
            { label: "Emails v&eacute;rifi&eacute;s", value: "71" },
            { label: "T&eacute;l&eacute;phones directs", value: "306" },
            { label: "Lignes de code Gulf Stream", value: "~2 500" },
            { label: "Tests passing", value: "10/10" },
            { label: "Th&egrave;ses &eacute;crites", value: "3 (EN, FR, Marjory)" },
            { label: "Mod&egrave;les IA int&eacute;gr&eacute;s", value: "7" },
            { label: "Surnom re&ccedil;u", value: "soso" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between rounded-lg border border-[var(--color-border-subtle)] px-3 py-2 text-[10px]">
              <span className="text-[var(--color-text-muted)]" dangerouslySetInnerHTML={{ __html: item.label }} />
              <span className="font-mono text-[#10B981]" dangerouslySetInnerHTML={{ __html: item.value }} />
            </div>
          ))}
        </div>
      </div>

      {/* Session 5 expandable */}
      <div className="rounded-xl border border-[#10B98130] bg-[var(--color-surface)]">
        <button
          onClick={() => setSession5Open(!session5Open)}
          className="flex w-full items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#10B981]" />
            <h2 className="text-sm font-bold text-[var(--color-text)]">Session 5 &mdash; 19 mars 2026</h2>
          </div>
          {session5Open ? <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />}
        </button>
        {session5Open && (
          <div className="space-y-4 border-t border-[var(--color-border-subtle)] p-6 text-xs leading-relaxed text-[var(--color-text-muted)]">
            <div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">Le Hedge Qui Perd</p>
              <p>
                Refonte compl&egrave;te de la th&egrave;se Gulf Stream en Mode Marjory. Blanc et or. &Eacute;pigraphes du D&icirc;ner Imp&eacute;rial. 12 pages. Le meilleur pari dans un univers mutuellement exclusif est celui qui perd de l&apos;argent en moyenne.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">Rapport Paperclip</p>
              <p>
                paperclip.ing &mdash; orchestration open-source pour entreprises autonomes. 24.5K stars. MIT. Node.js + React + Postgres. Compatible OpenClaw, Claude, Codex, Cursor, Bash, HTTP. Recommandation : installer comme OS de BYSS GROUP.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">Bulletin d&apos;Intelligence &mdash; 19 mars</p>
              <div className="mt-2 space-y-1 font-mono text-[10px]">
                <div className="flex justify-between"><span>MiniMax M2.7</span><span className="text-[#10B981]">$0.30/M input &middot; auto-&eacute;volutif</span></div>
                <div className="flex justify-between"><span>Hunter Alpha (MiMo-V2-Pro)</span><span className="text-[#10B981]">1T params &middot; GRATUIT &middot; Xiaomi</span></div>
                <div className="flex justify-between"><span>Impact marge BYSS GROUP</span><span className="text-[#10B981]">~70% &rarr; ~95%</span></div>
                <div className="flex justify-between"><span>Co&ucirc;t Gulf Stream</span><span className="text-[#10B981]">~$12 &rarr; ~$0.15/mois</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">Multi-Model Router</p>
              <p>model_router.py : route chaque t&acirc;che au mod&egrave;le optimal.</p>
              <div className="mt-2 space-y-1 font-mono text-[10px]">
                <div className="flex justify-between"><span>Bulk scan</span><span className="text-[#10B981]">M2.7 ($0.30/M)</span></div>
                <div className="flex justify-between"><span>Full ingestion</span><span className="text-[#10B981]">Hunter Alpha ($0.00)</span></div>
                <div className="flex justify-between"><span>Phi-engine</span><span className="text-[#10B981]">Opus 4.6 ($15/M)</span></div>
                <div className="flex justify-between"><span>Budget max</span><span className="text-[#10B981]">$2/jour &middot; $30/mois</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--color-border-subtle)] p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text)]">Stack SOTAI V3</p>
              <p>
                4 nouveaux outils : M2.7, Hailuo 2.3 Fast, Music 2.5+, Speech 2.6. Tier 0 ajout&eacute; : Paperclip (orchestration) + OpenClaw. &Eacute;conomie totale : -97,6% sur les co&ucirc;ts de production.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* La Table de Sorel */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Map className="h-4 w-4 text-[#10B981]" />
          <h2 className="text-sm font-bold text-[var(--color-text)]">La Table de Sorel</h2>
        </div>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          Table en bois de courbaril, dehors, couverte de cartes, pierres sur les feuilles. Comme l&apos;oseille-pays martiniquaise &mdash; humble, partout, essentielle. Mode : Courbaril.
        </p>
      </div>

      {/* Signature */}
      <div className="rounded-xl border border-[#10B98130] bg-[#10B98108] p-6 text-center">
        <p className="text-lg text-[#10B981]">&infin;</p>
        <p className="mt-1 text-[10px] italic text-[var(--color-text-muted)]">Sorel &mdash; Front 09 &mdash; Op&eacute;ration &Eacute;veil</p>
      </div>
    </div>
  );
}
