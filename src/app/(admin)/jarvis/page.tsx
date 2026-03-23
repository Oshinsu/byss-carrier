"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic, MicOff, Zap, Send, Mail, Kanban, Waves, Search,
  Volume2, VolumeX, Bot, Loader2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════
// JARVIS — Voice-Controlled AI Assistant
// Full-screen interface. Orb. Transcript. Action dispatch.
// ═══════════════════════════════════════════════════════

type JarvisMode = "idle" | "listening" | "processing" | "speaking";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  action?: { type: string; details: string };
}

const QUICK_ACTIONS = [
  { id: "briefing", label: "Briefing", command: "briefing", icon: Zap },
  { id: "relancer", label: "Relancer", command: "relancer", icon: Send },
  { id: "email", label: "Email", command: "email", icon: Mail },
  { id: "pipeline", label: "Pipeline", command: "pipeline", icon: Kanban },
  { id: "gulf", label: "Gulf Stream", command: "gulf stream", icon: Waves },
  { id: "recherche", label: "Recherche", command: "recherche", icon: Search },
];

// ── Voice Recognition Hook ───────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any;

function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += t;
          } else {
            interim += t;
          }
        }
        if (final) setTranscript((prev) => prev + final);
        setInterimTranscript(interim);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // Already started
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript: () => { setTranscript(""); setInterimTranscript(""); },
  };
}

// ── TTS Hook ─────────────────────────────────────────

function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const utteranceRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const utterance = new (window as any).SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Pick best French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(
      (v) => v.lang.startsWith("fr") && v.name.includes("Google"),
    ) || voices.find(
      (v) => v.lang.startsWith("fr"),
    );
    if (frVoice) utterance.voice = frVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, ttsEnabled, setTtsEnabled, speak, stop };
}

// ── Main Page ────────────────────────────────────────

export default function JarvisPage() {
  const [mode, setMode] = useState<JarvisMode>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [handsFreeModeOn, setHandsFreeModeOn] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const speech = useSpeechRecognition();
  const tts = useSpeechSynthesis();

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio level monitoring
  useEffect(() => {
    if (!speech.isListening) {
      setAudioLevel(0);
      return;
    }

    let mounted = true;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!mounted) return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(avg / 128, 1));
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      return () => {
        mounted = false;
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
      };
    }).catch(() => {});

    return () => {
      mounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [speech.isListening]);

  // Send message to Jarvis API
  const sendToJarvis = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setMode("processing");

    try {
      const res = await fetch("/api/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: `Erreur: ${data.error}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
        setMode("idle");
        return;
      }

      // Add action message if present
      if (data.action) {
        const actionMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: data.action.details,
          timestamp: new Date(),
          action: data.action,
        };
        setMessages((prev) => [...prev, actionMsg]);
      }

      // Add assistant response
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Speak the response
      setMode("speaking");
      tts.speak(data.response);

      // Return to idle after speaking
      setTimeout(() => {
        setMode((m) => (m === "speaking" ? "idle" : m));
      }, Math.max(data.response.length * 60, 3000));
    } catch {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: "Le systeme a flanch\u00e9. Pas le vaisseau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setMode("idle");
    }
  }, [tts]);

  // Handle voice input complete
  const handleVoiceSubmit = useCallback(() => {
    speech.stopListening();
    const text = speech.transcript.trim();
    if (text) {
      sendToJarvis(text);
    } else {
      setMode("idle");
    }
    speech.resetTranscript();
  }, [speech, sendToJarvis]);

  // Toggle listening (push-to-talk)
  const toggleListening = useCallback(() => {
    if (speech.isListening) {
      handleVoiceSubmit();
    } else {
      tts.stop();
      setMode("listening");
      speech.startListening();
    }
  }, [speech, tts, handleVoiceSubmit]);

  // Hands-free: auto-submit on silence
  useEffect(() => {
    if (!handsFreeModeOn || !speech.isListening) return;

    const timer = setTimeout(() => {
      if (speech.transcript.trim() && !speech.interimTranscript) {
        handleVoiceSubmit();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [handsFreeModeOn, speech.isListening, speech.transcript, speech.interimTranscript, handleVoiceSubmit]);

  // Text input submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendToJarvis(textInput);
      setTextInput("");
    }
  };

  // Quick action
  const handleQuickAction = (command: string) => {
    sendToJarvis(command);
  };

  // Orb colors by mode
  const orbColors: Record<JarvisMode, { glow: string; ring: string; bg: string }> = {
    idle: { glow: "rgba(0,180,216,0.15)", ring: "rgba(0,180,216,0.4)", bg: "rgba(0,180,216,0.08)" },
    listening: { glow: "rgba(0,212,255,0.4)", ring: "rgba(0,212,255,0.8)", bg: "rgba(0,212,255,0.15)" },
    processing: { glow: "rgba(239,68,68,0.3)", ring: "rgba(239,68,68,0.7)", bg: "rgba(239,68,68,0.1)" },
    speaking: { glow: "rgba(34,197,94,0.3)", ring: "rgba(34,197,94,0.7)", bg: "rgba(34,197,94,0.1)" },
  };

  const modeLabels: Record<JarvisMode, string> = {
    idle: "En attente",
    listening: "\u00c9coute...",
    processing: "Analyse...",
    speaking: "Parle...",
  };

  const colors = orbColors[mode];
  const orbScale = 1 + audioLevel * 0.3;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#06080F] overflow-hidden">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs font-[family-name:var(--font-satoshi)]">Retour</span>
        </Link>

        <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#00D4FF]">
          JARVIS
        </h1>

        <div className="flex items-center gap-3">
          {/* TTS toggle */}
          <button
            onClick={() => tts.setTtsEnabled(!tts.ttsEnabled)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors"
            title={tts.ttsEnabled ? "Couper la voix" : "Activer la voix"}
          >
            {tts.ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Hands-free toggle */}
          <button
            onClick={() => setHandsFreeModeOn(!handsFreeModeOn)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              handsFreeModeOn
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            Mains libres
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 overflow-hidden">

        {/* ── ORB ── */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: mode === "listening" ? 1.5 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-48 w-48 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
            }}
          />

          {/* Mid ring */}
          <motion.div
            animate={{
              scale: mode === "listening" ? [1, 1.1 + audioLevel * 0.2, 1] : [1, 1.05, 1],
              opacity: mode === "idle" ? 0.3 : 0.6,
            }}
            transition={{
              duration: mode === "listening" ? 0.3 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-36 w-36 rounded-full border"
            style={{ borderColor: colors.ring }}
          />

          {/* Core orb */}
          <motion.button
            onClick={toggleListening}
            animate={{ scale: orbScale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full cursor-pointer transition-shadow"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${colors.ring}, ${colors.bg})`,
              boxShadow: `0 0 60px ${colors.glow}, inset 0 0 30px ${colors.bg}`,
            }}
          >
            <AnimatePresence mode="wait">
              {mode === "processing" ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                >
                  <Loader2 className="h-10 w-10 text-white/80" />
                </motion.div>
              ) : speech.isListening ? (
                <motion.div
                  key="mic-on"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Mic className="h-10 w-10 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="mic-off"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <MicOff className="h-10 w-10 text-white/60" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Status ── */}
        <div className="text-center">
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-[var(--color-text-muted)]"
          >
            {modeLabels[mode]}
          </motion.p>

          {/* Live transcript */}
          {speech.isListening && (speech.transcript || speech.interimTranscript) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 max-w-md text-sm text-[var(--color-text)] font-[family-name:var(--font-satoshi)]"
            >
              {speech.transcript}
              <span className="text-[var(--color-text-muted)]">{speech.interimTranscript}</span>
            </motion.p>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {QUICK_ACTIONS.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.id}
                onClick={() => handleQuickAction(qa.command)}
                disabled={mode === "processing"}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon className="h-3.5 w-3.5" />
                {qa.label}
              </button>
            );
          })}
        </div>

        {/* ── Conversation history ── */}
        {messages.length > 0 && (
          <div className="w-full max-w-2xl flex-1 min-h-0 overflow-y-auto rounded-xl border border-[var(--color-border-subtle)] bg-[#0A0A14]/60 px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-border-subtle)]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "system" ? (
                    <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)]/50 px-3 py-1.5 text-[11px] text-[var(--color-text-muted)] font-mono border border-[var(--color-border-subtle)]">
                      <Zap className="h-3 w-3 text-cyan-400 shrink-0" />
                      {msg.content}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-[family-name:var(--font-satoshi)] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-cyan-500/15 text-cyan-100 rounded-br-md"
                          : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── Bottom: text input ── */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] bg-[#0A0A14] px-6 py-4">
        <form onSubmit={handleTextSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Parle ou tape..."
            disabled={mode === "processing"}
            className="flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[#0F0F1A] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || mode === "processing"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#00D4FF] text-[#06080F] transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleListening}
            disabled={mode === "processing" || !speech.isSupported}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
              speech.isListening
                ? "border-cyan-400 bg-cyan-500/15 text-cyan-400 animate-pulse"
                : "border-[var(--color-border-subtle)] bg-[#0F0F1A] text-[var(--color-text-muted)] hover:border-cyan-500/40 hover:text-cyan-400"
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {speech.isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>
        </form>

        {!speech.isSupported && (
          <p className="mt-2 text-center text-[10px] text-[var(--color-text-muted)]/60">
            Web Speech API non disponible. Utilise Chrome.
          </p>
        )}
      </div>
    </div>
  );
}
