"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Music, Sparkles, Play, Copy, Mic, Radio, Headphones, Loader2, Check,
  ExternalLink, Trash2, Link, CheckCircle2, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   MUSIC PIPELINE — MiniMax Music 2.5+ via Replicate / Suno
   All generation routed through Replicate API
   Genres: OST, jingle, zouk, shatta, instrumental, SFX
   ═══════════════════════════════════════════════════════ */

const GENRES = [
  { key: "ost", label: "OST Cinematique", desc: "Bande originale pour video/film", icon: Headphones },
  { key: "jingle", label: "Jingle Commercial", desc: "15-30s identite sonore marque", icon: Radio },
  { key: "zouk", label: "Zouk / Bouyon", desc: "Musique caribbeenne traditionnelle + moderne", icon: Music },
  { key: "shatta", label: "Shatta", desc: "90-110 BPM, fusion biguine + electronique", icon: Mic },
  { key: "instrumental", label: "Instrumental", desc: "Piano, cordes, ambient, lo-fi", icon: Music },
  { key: "sfx", label: "SFX / Bruitage", desc: "Effets sonores pour video/jeu", icon: Radio },
];

type MusicJobStatus = "prompt_copied" | "generating" | "generated" | "approved" | "published";

interface MusicJob {
  id: string;
  prompt: string;
  genre: string;
  provider: string;
  status: MusicJobStatus;
  resultUrl: string;
  createdAt: string;
}

const STORAGE_KEY = "byss-music-jobs";

const STATUS_CONFIG: Record<MusicJobStatus, { label: string; bg: string; color: string }> = {
  prompt_copied: { label: "Prompt copi\u00E9", bg: "#F59E0B15", color: "#F59E0B" },
  generating: { label: "En cours", bg: "#00D4FF15", color: "#00D4FF" },
  generated: { label: "G\u00E9n\u00E9r\u00E9", bg: "#8B5CF615", color: "#8B5CF6" },
  approved: { label: "Approuv\u00E9", bg: "#10B98115", color: "#10B981" },
  published: { label: "Publi\u00E9", bg: "#00B4D815", color: "#00B4D8" },
};

const STATUS_FLOW: MusicJobStatus[] = ["prompt_copied", "generating", "generated", "approved", "published"];

function loadJobs(): MusicJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveJobs(jobs: MusicJob[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

/* ═══════════════════════════════════════════════════════
   SUNO PRODUCTION PROMPTS — An Tan Lontan + Cesaire Pixar
   Source: SUNO_MUSIQUE_ATL_CESAIRE.md
   ═══════════════════════════════════════════════════════ */

interface SunoPrompt {
  id: string;
  title: string;
  usage: string;
  genre: string;
  bpm: string;
  emotion: string;
  stylePrompt: string;
  lyrics: string;
}

const SUNO_ATL: SunoPrompt[] = [
  {
    id: "atl-01", title: "Theme principal (generique)", usage: "Ouverture de chaque episode, 2 min",
    genre: "Orchestre + percussions caribbeennes", bpm: "72", emotion: "Majestueux",
    stylePrompt: "Cinematic orchestral with Caribbean percussion, emotional and majestic, cello lead, tanbou drums, warm strings, French horn, gentle marimba, slow build to triumphant, 72 BPM, wide cinematic mix",
    lyrics: "[Instrumental Intro]\n[Slow Build]\n[Instrumental Break]\n[Climax]\n[Gentle Outro]",
  },
  {
    id: "atl-02", title: "L'arrivee des navires (XVIe)", usage: "Premier contact, tension et mystere",
    genre: "Ambient orchestral sombre", bpm: "60", emotion: "Mystere, menace",
    stylePrompt: "Dark ambient orchestral, mysterious and foreboding, deep cello drone, distant war drums, ocean wave textures, wooden ship creaks, low brass, sparse haunting flute, 60 BPM, vast atmospheric reverb, instrumental",
    lyrics: "[Ambient Intro]\n[Slow Tension Build]\n[Instrumental Break]\n[Dark Crescendo]\n[Fade to Silence]",
  },
  {
    id: "atl-03", title: "Les champs de canne (esclavage)", usage: "L'habitation sucriere, travail force",
    genre: "Work song africain", bpm: "80", emotion: "Douleur, dignite",
    stylePrompt: "African spiritual work song meets dark cinematic score, call-and-response chant, deep male chorus humming, tanbou bele drum, sparse cello, mournful and powerful, raw field recording texture, 80 BPM, no modern instruments",
    lyrics: "[Deep Humming Chorus]\nHe ho, he ho\n[Call and Response]\nHe ho, he ho\n[Tanbou Solo]\n[Humming Rises]\nHe ho, he ho\n[Fades to Single Voice]",
  },
  {
    id: "atl-04", title: "Saint-Pierre la magnifique (XIXe)", usage: "Le Petit Paris des Antilles, prosperite",
    genre: "Valse creole / mazurka", bpm: "108", emotion: "Elegance, nostalgie",
    stylePrompt: "Elegant Caribbean waltz, mazurka creole, refined and nostalgic, accordion musette, clarinet lead, upright bass, brushed snare, gentle piano, warm salon atmosphere, 108 BPM, vintage warm mix",
    lyrics: "[Instrumental Intro]\n[Waltz Theme]\n[Clarinet Solo]\n[Full Ensemble]\n[Gentle Ritardando]",
  },
  {
    id: "atl-05", title: "La catastrophe (1902)", usage: "Eruption Pelee, destruction de Saint-Pierre",
    genre: "Orchestral apocalyptique", bpm: "90+", emotion: "Devastation",
    stylePrompt: "Epic dark orchestral, catastrophic and devastating, massive timpani rolls, dissonant brass stabs, shrieking strings, rumbling sub bass, volcanic intensity, chaotic then sudden silence, 90 BPM accelerating, cinematic disaster score",
    lyrics: "[Rumbling Bass Intro]\n[Strings Build Rapidly]\n[Brass Explosion]\n[Chaotic Crescendo]\n[Sudden Complete Silence]\n[Single Piano Note Fading]",
  },
  {
    id: "atl-06", title: "Le marche aux epices (reconstruction)", usage: "Fort-de-France devient capitale, vie quotidienne",
    genre: "Biguine traditionnelle", bpm: "126", emotion: "Joie, vie",
    stylePrompt: "Upbeat Caribbean folk, biguine traditionnelle, joyful and bustling, clarinet lead, trombone, banjo creole, tanbou, shaker, lively street market energy, 126 BPM, live recording feel, warm analog mix",
    lyrics: "[Lively Instrumental Intro]\n[Clarinet Theme]\n[Trombone Response]\n[Full Band Groove]\n[Instrumental Break]\n[Clarinet Reprise]\n[Joyful Outro]",
  },
  {
    id: "atl-07", title: "La case creole (intimite domestique)", usage: "Interieur de case, pas de personnage, nostalgie",
    genre: "Guitare solo acoustique", bpm: "66", emotion: "Intimite, absence",
    stylePrompt: "Intimate acoustic guitar solo, creole lullaby, tender and melancholic, nylon string classical guitar, gentle fingerpicking, occasional soft humming, very sparse, room ambiance, 66 BPM, lo-fi warmth, close-mic intimacy",
    lyrics: "[Solo Guitar Intro]\n[Gentle Theme]\n[Soft Humming]\nMmm mmm mmm\n[Guitar Continues Alone]\n[Fade with Room Tone]",
  },
  {
    id: "atl-08", title: "La route vers l'interieur", usage: "La Trace, foret tropicale, brume",
    genre: "Ambient tropical", bpm: "70", emotion: "Contemplation",
    stylePrompt: "Ambient tropical soundscape, mysterious and contemplative, distant bird calls, rain forest atmosphere, soft marimba, ethereal pad, gentle percussion, misty and organic, 70 BPM, wide stereo field, cinematic nature documentary",
    lyrics: "[Nature Ambiance Intro]\n[Marimba Enters Softly]\n[Ethereal Pad Build]\n[Instrumental Break]\n[Rain Sound Texture]\n[Gentle Fade]",
  },
  {
    id: "atl-09", title: "Le Carnaval", usage: "Vide dans les rues, Mardi Gras",
    genre: "Vide martiniquais", bpm: "140", emotion: "Euphorie",
    stylePrompt: "High-energy Martiniquais carnival, vide rhythm, tanbou bele ensemble, chacha shakers, ti-bwa sticks, brass section, conch shell horn, euphoric crowd energy, 140 BPM, raw street recording feel, powerful and joyful, maximum energy",
    lyrics: "[Tanbou Explosion]\n[Full Percussion Groove]\n[Brass Fanfare]\n[Crowd Energy Peak]\n[Ti-bwa Solo]\n[Everyone Back In]\n[Builds to Maximum]\n[Final Hit]",
  },
  {
    id: "atl-10", title: "L'heritage (aujourd'hui)", usage: "Pecheur d'Anse Dufour, crepuscule, fin de serie",
    genre: "Steel pan + orchestre", bpm: "64", emotion: "Paix, espoir",
    stylePrompt: "Gentle Caribbean sunset score, peaceful and reflective, solo steel pan melody over soft orchestral strings, ocean wave texture, warm cello, distant conch shell, bittersweet and hopeful, 64 BPM, golden hour warmth, cinematic emotional close",
    lyrics: "[Ocean Waves Intro]\n[Steel Pan Theme Enters]\n[Strings Join Softly]\n[Emotional Swell]\n[Steel Pan Reprises Main Theme from ATL-01]\n[Gentle Fade to Waves]",
  },
];

const SUNO_CP: SunoPrompt[] = [
  {
    id: "cp-01", title: "Mamie Nini lit (enfance)", usage: "La grand-mere apprend a lire au petit Aime",
    genre: "Piano Pixar", bpm: "76", emotion: "Innocence, emerveillement",
    stylePrompt: "Warm Pixar piano theme, gentle and innocent, solo piano with soft celesta accents, tender and curious, child-like wonder, subtle strings entering midway, 76 BPM, intimate warm mix, emotional animated film score",
    lyrics: "[Solo Piano Intro \u2014 Simple Theme]\n[Celesta Sparkle]\n[Theme Repeats with Soft Strings]\n[Gentle Emotional Swell]\n[Piano Returns Alone]\n[Last Note Lingers]",
  },
  {
    id: "cp-02", title: "Le boursier (espoir)", usage: "Le garcon au pied du Lycee Schoelcher",
    genre: "Orchestre aventure", bpm: "92", emotion: "Espoir, courage",
    stylePrompt: "Hopeful orchestral Pixar score, building courage, pizzicato strings, gentle oboe melody, snare drum march undertone, growing brass warmth, determined and uplifting, 92 BPM, animated film adventure theme",
    lyrics: "[Pizzicato Intro \u2014 Tentative Steps]\n[Oboe Theme \u2014 Curiosity]\n[Strings Build \u2014 Determination]\n[Full Orchestra \u2014 Arrival]\n[Gentle Landing]",
  },
  {
    id: "cp-03", title: "La rencontre avec Senghor (amitie)", usage: "Deux jeunes hommes dans le couloir froid de Louis-le-Grand",
    genre: "Duo comique", bpm: "100", emotion: "Amitie, jeu",
    stylePrompt: "Warm buddy theme, Pixar friendship score, playful clarinet duet with bassoon, gentle pizzicato, cozy and heartfelt, two melodies intertwining, 100 BPM, whimsical yet sincere, animated comedy-drama",
    lyrics: "[Solo Clarinet \u2014 Aime's Theme]\n[Bassoon Enters \u2014 Senghor's Theme]\n[Both Melodies Dance Together]\n[Playful Back and Forth]\n[Harmonize on Same Note]\n[Warm Resolution]",
  },
  {
    id: "cp-04", title: "Negritude (revelation)", usage: "Aime ecrit le mot pour la premiere fois, nuit, lampe",
    genre: "Piano \u2192 orchestre", bpm: "68\u219284", emotion: "Revelation",
    stylePrompt: "Intimate piano solo building to cinematic revelation, dark room atmosphere, single piano in minor key, contemplative then inspired, sudden orchestral bloom at the moment of creation, 68 BPM building to 84, emotional Pixar pivot moment",
    lyrics: "[Piano Alone \u2014 Searching]\n[Hesitation]\n[Piano Finds the Note]\n[Pause]\n[Full Orchestra Blooms \u2014 The Word Is Written]\n[Strings Hold the Moment]\n[Piano Returns \u2014 Now Certain]",
  },
  {
    id: "cp-05", title: "Le Cahier (exil et memoire)", usage: "Cesaire en Dalmatie, yeux fermes, vision de la Martinique",
    genre: "Accordeon + steel pan", bpm: "72", emotion: "Nostalgie, deux mondes",
    stylePrompt: "Melancholic Mediterranean-Caribbean fusion, nostalgic and yearning, solo accordion with distant steel pan echo, strings in minor key, ocean breeze texture, two worlds in one piece, 72 BPM, bittersweet Pixar homesickness score",
    lyrics: "[Accordion Solo \u2014 Europe]\n[Distant Steel Pan Echo \u2014 Martinique Memory]\n[Both Instruments Reaching for Each Other]\n[Strings Swell \u2014 The Vision]\n[Accordion Fades]\n[Steel Pan Alone \u2014 Home]",
  },
  {
    id: "cp-06", title: "Le professeur (transmission)", usage: "Cesaire enseigne, Glissant et Fanon dans la classe",
    genre: "Orchestre inspirant", bpm: "108", emotion: "Transmission, passion",
    stylePrompt: "Inspiring educational score, Pixar montage energy, uplifting strings with rhythmic percussion, French horn lead, determined and passionate, building momentum, 108 BPM, animated inspiration sequence, warm brass",
    lyrics: "[Rhythmic Strings Intro \u2014 The Lesson Begins]\n[French Horn \u2014 Cesaire's Voice]\n[Percussion Builds \u2014 Ideas Spreading]\n[Full Orchestra \u2014 Minds Opening]\n[Brief Pause]\n[Theme Returns Stronger \u2014 The Students Carry It Now]",
  },
  {
    id: "cp-07", title: "L'election (triomphe populaire)", usage: "Cesaire porte en triomphe, foule en joie",
    genre: "Fanfare caribbeenne", bpm: "120", emotion: "Triomphe, joie",
    stylePrompt: "Triumphant Caribbean orchestral celebration, joyful and powerful, brass fanfare with tanbou drums, full orchestra crescendo, crowd cheering texture, majestic and emotional, 120 BPM, Pixar victory moment, exuberant",
    lyrics: "[Tanbou Rhythm Starts]\n[Brass Fanfare Enters]\n[Full Orchestra Joins]\n[Crowd Sound Texture]\n[Emotional Peak \u2014 Lifted on Shoulders]\n[Brass Theme Soars]\n[Gentle Wind Down to Warmth]",
  },
  {
    id: "cp-08", title: "Le Discours (colere sacree)", usage: "Ecriture du Discours sur le colonialisme, pluie, nuit",
    genre: "Underscore sombre", bpm: "85", emotion: "Rage controlee",
    stylePrompt: "Dark intense orchestral underscore, furious pen on paper, tense cello and viola, aggressive piano stabs, rain ambiance, building rage held under control, 85 BPM, cinematic thriller energy, Pixar dark moment before resolution",
    lyrics: "[Rain and Piano \u2014 Sparse]\n[Cello Enters \u2014 Anger Rising]\n[Viola Joins \u2014 Controlled Fury]\n[Piano Stabs \u2014 Words Hitting Paper]\n[Full Strings Crescendo]\n[Sudden Stop]\n[Single Cello Note \u2014 The Ink Dries]",
  },
  {
    id: "cp-09", title: "Le crepuscule (vieillesse sage)", usage: "Le vieux Cesaire marche seul dans Fort-de-France",
    genre: "Piano + clarinette", bpm: "58", emotion: "Sagesse, tendresse",
    stylePrompt: "Tender elderly character theme, slow solo piano with soft strings, gentle and wise, autumn-of-life warmth, slight melancholy, Pixar emotional quiet moment, 58 BPM, sparse and beautiful, solo clarinet joins at end",
    lyrics: "[Solo Piano \u2014 The Walk]\n[Soft Strings \u2014 Evening Light]\n[Piano Theme from CP-01 Returns \u2014 Aged, Slower]\n[Clarinet Enters \u2014 Memory of Youth]\n[Together They Play the Childhood Theme]\n[Piano Alone]\n[Last Note \u2014 A Streetlamp Turning On]",
  },
  {
    id: "cp-10", title: "L'heritage (obseques et eternite)", usage: "Stade de Dillon, foule en blanc, esprits dans le ciel",
    genre: "Finale epique", bpm: "72", emotion: "Eternite",
    stylePrompt: "Epic emotional Pixar finale, massive orchestral with Caribbean soul, full choir humming, tanbou heartbeat rhythm, sweeping strings, solo piano reprises childhood theme, builds from silence to overwhelming beauty, 72 BPM, tears and triumph, animated film final scene",
    lyrics: "[Silence]\n[Single Tanbou Beat \u2014 A Heartbeat]\n[Piano \u2014 CP-01 Childhood Theme, Very Slow]\n[Choir Humming Joins]\n[Strings Build \u2014 The Life Flashing]\n[Brass Enters \u2014 The Triumph]\n[Full Orchestra + Choir + Tanbou \u2014 Maximum Emotion]\n[Everything Drops Except Piano]\n[Piano Plays Theme One Last Time]\n[Tanbou Fades Like a Heart Stopping]\n[Silence]\n[Single Distant Steel Pan Note \u2014 Eternity]",
  },
];

function SunoPromptCard({ p, onCopy, copiedId }: { p: SunoPrompt; onCopy: (text: string, id: string) => void; copiedId: string | null }) {
  const fullPrompt = `Style: ${p.stylePrompt}\n\nLyrics:\n${p.lyrics}`;
  const isCopied = copiedId === p.id;
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[var(--color-gold)]">{p.id.toUpperCase()}</span>
            <h4 className="text-xs font-bold text-[var(--color-text)]">{p.title}</h4>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{p.usage}</p>
        </div>
        <button
          onClick={() => onCopy(fullPrompt, p.id)}
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all",
            isCopied
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-[var(--color-gold-glow)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black"
          )}
        >
          {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {isCopied ? "Copie !" : "Copier"}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-[var(--color-surface-raised)] px-2 py-0.5 text-[9px] text-[var(--color-text-muted)]">{p.genre}</span>
        <span className="rounded-full bg-[var(--color-surface-raised)] px-2 py-0.5 text-[9px] text-[var(--color-gold)]">{p.bpm} BPM</span>
        <span className="rounded-full bg-[var(--color-surface-raised)] px-2 py-0.5 text-[9px] text-purple-400">{p.emotion}</span>
      </div>
      <div className="mt-3 space-y-2">
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[var(--color-gold-muted)]">Style Prompt</p>
          <p className="rounded-lg bg-[var(--color-bg)] p-2.5 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">{p.stylePrompt}</p>
        </div>
        <div>
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400/70">Lyrics</p>
          <pre className="rounded-lg bg-[var(--color-bg)] p-2.5 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">{p.lyrics}</pre>
        </div>
      </div>
    </div>
  );
}

function SunoPromptsSota() {
  const [activeSection, setActiveSection] = useState<"atl" | "cp">("atl");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const prompts = activeSection === "atl" ? SUNO_ATL : SUNO_CP;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
          <h2 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Prompts <span className="text-[var(--color-gold)]">SOTA</span>
          </h2>
          <span className="rounded-full bg-[var(--color-gold-glow)] px-2.5 py-0.5 text-[9px] font-bold text-[var(--color-gold)]">
            Suno v4.5
          </span>
        </div>
        <div className="flex rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <button
            onClick={() => setActiveSection("atl")}
            className={cn(
              "rounded-l-lg px-3 py-1.5 text-[10px] font-bold transition-all",
              activeSection === "atl"
                ? "bg-[var(--color-gold)] text-black"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            An Tan Lontan (10)
          </button>
          <button
            onClick={() => setActiveSection("cp")}
            className={cn(
              "rounded-r-lg px-3 py-1.5 text-[10px] font-bold transition-all",
              activeSection === "cp"
                ? "bg-[var(--color-gold)] text-black"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            Cesaire Pixar (10)
          </button>
        </div>
      </div>
      <p className="mb-4 text-[10px] text-[var(--color-text-muted)]">
        Chaque carte = un prompt Suno pret a coller. Mode Custom. Style prompt dans &quot;Style of Music&quot;, Lyrics dans &quot;Lyrics&quot;.
      </p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {prompts.map((p) => (
          <SunoPromptCard key={p.id} p={p} onCopy={handleCopy} copiedId={copiedId} />
        ))}
      </div>
    </div>
  );
}

export default function MusicPage() {
  const [selectedGenre, setSelectedGenre] = useState("ost");
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [replicateLoading, setReplicateLoading] = useState(false);
  const [replicateSuccess, setReplicateSuccess] = useState(false);
  const [jobs, setJobs] = useState<MusicJob[]>([]);
  const [mounted, setMounted] = useState(false);

  const genreConfig = GENRES.find((g) => g.key === selectedGenre)!;

  // Load jobs from localStorage on mount
  useEffect(() => {
    setJobs(loadJobs());
    setMounted(true);
  }, []);

  // Persist jobs whenever they change (after initial mount)
  const updateJobs = useCallback((updater: MusicJob[] | ((prev: MusicJob[]) => MusicJob[])) => {
    setJobs((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveJobs(next);
      return next;
    });
  }, []);

  const generateMusicPrompt = () => {
    const base = prompt || `${genreConfig.label} pour BYSS GROUP`;
    const fullPrompt = `Genre: ${genreConfig.label}. Style: ${genreConfig.desc}. ${base}. High quality, professional mastering, stereo, 44.1kHz.`;
    setGeneratedPrompt(fullPrompt);
  };

  const handleLaunchReplicate = async () => {
    if (!generatedPrompt || replicateLoading) return;
    setReplicateLoading(true);
    try {
      // Launch generation via Replicate API route
      const res = await fetch("/api/replicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-music", prompt: generatedPrompt }),
      });
      const data = await res.json();

      // Add job to history
      const job: MusicJob = {
        id: data.id || `mus_${Date.now()}`,
        prompt: generatedPrompt,
        genre: genreConfig.label,
        provider: "replicate/minimax-music-2.5",
        status: "generating",
        resultUrl: "",
        createdAt: new Date().toISOString(),
      };
      updateJobs((prev) => [job, ...prev]);

      setReplicateSuccess(true);
      setTimeout(() => {
        setReplicateSuccess(false);
        setReplicateLoading(false);
      }, 4000);
    } catch {
      setReplicateLoading(false);
    }
  };

  const advanceJobStatus = (id: string) => {
    updateJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const currentIdx = STATUS_FLOW.indexOf(j.status);
        if (currentIdx < STATUS_FLOW.length - 1) {
          return { ...j, status: STATUS_FLOW[currentIdx + 1] };
        }
        return j;
      })
    );
  };

  const updateJobUrl = (id: string, resultUrl: string) => {
    updateJobs((prev) => prev.map((j) => (j.id === id ? { ...j, resultUrl } : j)));
  };

  const deleteJob = (id: string) => {
    if (!window.confirm("Supprimer ce job ?")) return;
    updateJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            Music <span className="text-[var(--color-gold)]">Pipeline</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            MiniMax Music 2.5+ via Replicate — Generation unifiee
          </p>
        </div>
        {mounted && jobs.length > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] px-4 py-1.5">
            <Music className="h-3.5 w-3.5 text-[var(--color-gold)]" />
            <span className="text-xs font-bold text-[var(--color-gold)]">{jobs.length} job{jobs.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Models */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "MiniMax Music 2.5+ (Replicate)", desc: "Meilleure qualite generation musicale. Lyrics, instrumental, SFX.", cost: "$0.075/run", primary: true },
          { name: "Suno", desc: "Alternative rapide pour prototypage. Full songs.", cost: "$0.05/run", primary: false },
        ].map((m) => (
          <div key={m.name} className={cn("rounded-xl border p-4", m.primary ? "border-[var(--color-gold)] bg-[oklch(0.75_0.12_85/0.04)]" : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]")}>
            <h3 className="text-sm font-bold" style={{ color: m.primary ? "var(--color-gold)" : "var(--color-text)" }}>{m.name}</h3>
            <p className="text-[10px] text-[var(--color-text-muted)]">{m.desc}</p>
            <p className="mt-1 font-mono text-xs" style={{ color: m.primary ? "var(--color-gold)" : "var(--color-cyan)" }}>{m.cost}</p>
          </div>
        ))}
      </div>

      {/* Genre Selection */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Genre</h2>
        <div className="grid grid-cols-3 gap-3">
          {GENRES.map((g) => {
            const Icon = g.icon;
            const isSelected = selectedGenre === g.key;
            return (
              <button
                key={g.key}
                onClick={() => setSelectedGenre(g.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-gold-muted)]"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" style={{ color: isSelected ? "var(--color-gold)" : "var(--color-text-muted)" }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: isSelected ? "var(--color-gold)" : "var(--color-text)" }}>{g.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{g.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Description (ex: "ambiance tropicale, piano doux, sunset vibes, tempo lent")`}
          className="flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
        />
        <button onClick={generateMusicPrompt} className="flex items-center gap-2 rounded-xl bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-black">
          <Sparkles className="h-4 w-4" />
          Generer
        </button>
      </div>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <Music className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">Prompt Music</span>
          </div>
          <p className="font-mono text-xs leading-relaxed text-[var(--color-text-muted)]">{generatedPrompt}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <Copy className="h-3 w-3" />Copier
            </button>
            <button
              onClick={handleLaunchReplicate}
              disabled={replicateLoading}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] transition-all",
                replicateSuccess
                  ? "bg-[oklch(0.72_0.19_155/0.15)] text-[var(--color-green)]"
                  : "bg-[#00D4FF15] text-[var(--color-cyan)] hover:bg-[#00D4FF25]",
                replicateLoading && !replicateSuccess && "cursor-not-allowed opacity-60"
              )}
            >
              {replicateLoading && !replicateSuccess ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : replicateSuccess ? (
                <Check className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              {replicateSuccess ? "Generation lancee via Replicate" : "Lancer via Replicate"}
            </button>
            {replicateSuccess && (
              <a
                href="https://replicate.com/predictions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg bg-[var(--color-gold-glow)] px-3 py-1.5 text-[10px] font-medium text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)] hover:text-black"
              >
                <ExternalLink className="h-3 w-3" />
                Voir sur Replicate
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* ═══ PROMPTS SOTA — Suno Production Prompts ═══ */}
      <SunoPromptsSota />

      {/* Job History */}
      {mounted && jobs.length > 0 && (
        <div>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            <Music className="mr-1.5 inline h-3 w-3" />
            Historique ({jobs.length} job{jobs.length > 1 ? "s" : ""})
          </h2>
          <div className="space-y-3">
            {jobs.map((job) => {
              const statusCfg = STATUS_CONFIG[job.status];
              const currentIdx = STATUS_FLOW.indexOf(job.status);
              const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;
              const nextLabel = nextStatus ? STATUS_CONFIG[nextStatus].label : null;

              return (
                <div
                  key={job.id}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3">
                    <Music className="h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                    <span className="flex-1 text-xs font-medium text-[var(--color-text)]">
                      {job.genre}
                    </span>
                    <span className="text-[9px] text-[var(--color-text-muted)]">
                      {job.provider}
                    </span>
                    <span className="text-[9px] text-[var(--color-text-muted)]">
                      {new Date(job.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Prompt excerpt */}
                  <p className="mt-2 line-clamp-2 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                    {job.prompt}
                  </p>

                  {/* URL input */}
                  <div className="mt-3 flex items-center gap-2">
                    <Link className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                    <input
                      type="url"
                      value={job.resultUrl}
                      onChange={(e) => updateJobUrl(job.id, e.target.value)}
                      placeholder="Coller l'URL audio r\u00E9sultat..."
                      className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-1.5 text-[10px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nextStatus && (
                      <button
                        onClick={() => advanceJobStatus(job.id)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1 text-[10px] font-medium transition-all"
                        style={{
                          backgroundColor: STATUS_CONFIG[nextStatus].bg,
                          color: STATUS_CONFIG[nextStatus].color,
                        }}
                      >
                        {nextStatus === "published" ? <Upload className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        Marquer : {nextLabel}
                      </button>
                    )}
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="flex items-center gap-1 rounded-lg bg-[#EF444410] px-3 py-1 text-[10px] font-medium text-red-400 transition-all hover:bg-[#EF444420]"
                    >
                      <Trash2 className="h-3 w-3" />
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
