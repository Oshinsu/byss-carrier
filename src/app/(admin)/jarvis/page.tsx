"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic, MicOff, Zap, Send, Volume2, VolumeX, Bot, Loader2,
  ArrowLeft, Check, X, ChevronDown, ChevronUp, Clock,
  Sparkles, Navigation, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  matchAction,
  getSuggestionsForPage,
  getPageName,
  type JarvisAction,
  type QuickSuggestion,
} from "@/lib/jarvis";

// ═══════════════════════════════════════════════════════
// JARVIS — SOTA Voice Agent
// Full app navigation. Action dispatch. Orb UI.
// Web Speech (default) + OpenAI Realtime (opt-in).
// ═══════════════════════════════════════════════════════

type JarvisMode = "idle" | "listening" | "processing" | "speaking";
type VoiceEngine = "web-speech" | "openai-realtime";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  action?: {
    id: string;
    name: string;
    type: string;
    details: string;
    navigate?: string;
  };
}

interface ActionHistoryEntry {
  id: string;
  timestamp: Date;
  actionName: string;
  actionId: string;
  result: "success" | "error" | "pending" | "confirmed" | "cancelled";
  navigate?: string;
  details?: string;
}

interface ConfirmationRequest {
  action: JarvisAction;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ── Dynamic icon resolver ────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Send, Mic, Bot, Sparkles, Navigation, Clock, Check, X,
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon className={className} />;
  return <Zap className={className} />;
}

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

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
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
    isSupported, isListening, transcript, interimTranscript,
    startListening, stopListening,
    resetTranscript: () => { setTranscript(""); setInterimTranscript(""); },
  };
}

// ── TTS Hook ─────────────────────────────────────────

function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === "undefined") return;
    window.speechSynthesis.cancel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const utterance = new (window as any).SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(
      (v: SpeechSynthesisVoice) => v.lang.startsWith("fr") && v.name.includes("Google"),
    ) || voices.find(
      (v: SpeechSynthesisVoice) => v.lang.startsWith("fr"),
    );
    if (frVoice) utterance.voice = frVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, ttsEnabled, setTtsEnabled, speak, stop };
}

// ── OpenAI Realtime Hook (WebRTC) ────────────────────

function useOpenAIRealtime() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check if API key is configured
  useEffect(() => {
    fetch("/api/jarvis/realtime-token", { method: "POST" })
      .then((r) => { if (r.ok) setIsAvailable(true); })
      .catch(() => {});
  }, []);

  const connect = useCallback(async (onMessage: (text: string) => void) => {
    try {
      // Get ephemeral token from our API
      const tokenRes = await fetch("/api/jarvis/realtime-token", { method: "POST" });
      if (!tokenRes.ok) return false;
      const { token } = await tokenRes.json();

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up audio playback
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };

      // Add local audio track
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === "response.audio_transcript.done") {
            onMessage(event.transcript || "");
          }
        } catch { /* ignore parse errors */ }
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send to OpenAI
      const sdpRes = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpRes.text(),
      };
      await pc.setRemoteDescription(answer);

      // Configure session
      dc.onopen = () => {
        setIsConnected(true);
        dc.send(JSON.stringify({
          type: "session.update",
          session: {
            instructions: "Tu es JARVIS, assistant vocal du BYSS EMPIRE. Reponds en francais, 2-3 phrases max. MODE_CADIFOR: compression souveraine, stichomythie, humour comme preuve.",
            voice: "alloy",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: { type: "server_vad", threshold: 0.5 },
          },
        }));
      };

      return true;
    } catch (err) {
      console.error("OpenAI Realtime connection failed:", err);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    setIsConnected(false);
  }, []);

  return { isAvailable, isConnected, connect, disconnect };
}

// ── Main Page ────────────────────────────────────────

export default function JarvisPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [mode, setMode] = useState<JarvisMode>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [handsFreeModeOn, setHandsFreeModeOn] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceEngine, setVoiceEngine] = useState<VoiceEngine>("web-speech");
  const [actionHistory, setActionHistory] = useState<ActionHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);
  const [currentPage, setCurrentPage] = useState("/jarvis");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  const speech = useSpeechRecognition();
  const tts = useSpeechSynthesis();
  const realtime = useOpenAIRealtime();

  // Track the page that was navigated from
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer) {
      try {
        const url = new URL(referrer);
        setCurrentPage(url.pathname);
      } catch { /* ignore */ }
    }
  }, []);

  // Get contextual suggestions
  const suggestions = useMemo(
    () => getSuggestionsForPage(currentPage),
    [currentPage],
  );

  const pageName = useMemo(() => getPageName(currentPage), [currentPage]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio level monitoring
  useEffect(() => {
    if (!speech.isListening) { setAudioLevel(0); return; }
    let mounted = true;
    let audioCtx: AudioContext | null = null;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
      audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!mounted) return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(avg / 128, 1));
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      return () => { mounted = false; stream.getTracks().forEach((t) => t.stop()); audioCtx?.close(); };
    }).catch(() => {});

    return () => {
      mounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [speech.isListening]);

  // ── Add to action history ──

  const addToHistory = useCallback((entry: Omit<ActionHistoryEntry, "id" | "timestamp">) => {
    setActionHistory((prev) => [
      { ...entry, id: crypto.randomUUID(), timestamp: new Date() },
      ...prev,
    ].slice(0, 20));
  }, []);

  // ── Handle navigation action ──

  const handleNavigation = useCallback((navigateTo: string, actionName: string) => {
    toast(`Navigation vers ${actionName}`, "info");
    addToHistory({
      actionName,
      actionId: "nav",
      result: "success",
      navigate: navigateTo,
    });
    // Small delay so toast shows before route change
    setTimeout(() => router.push(navigateTo), 300);
  }, [router, toast, addToHistory]);

  // ── Send message to JARVIS API ──

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
        body: JSON.stringify({
          text: text.trim(),
          currentPage: currentPage,
        }),
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

      // Handle action from API response
      if (data.action) {
        const action = data.action;

        // Add action system message
        const actionMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: action.details || action.name,
          timestamp: new Date(),
          action: {
            id: action.id,
            name: action.name,
            type: action.type || action.id,
            details: action.details || "",
            navigate: action.navigate,
          },
        };
        setMessages((prev) => [...prev, actionMsg]);

        // Handle confirmation
        if (action.requiresConfirmation) {
          setConfirmation({
            action: action,
            message: action.confirmationMessage || `JARVIS veut executer ${action.name}. Confirmer ?`,
            onConfirm: () => {
              if (action.navigate) {
                handleNavigation(action.navigate, action.name);
              }
              addToHistory({
                actionName: action.name,
                actionId: action.id,
                result: "confirmed",
                navigate: action.navigate,
                details: action.details,
              });
              setConfirmation(null);
            },
            onCancel: () => {
              addToHistory({
                actionName: action.name,
                actionId: action.id,
                result: "cancelled",
              });
              setConfirmation(null);
              toast("Action annulee.", "info");
            },
          });
        } else if (action.navigate) {
          // Auto-navigate for non-confirmation actions
          handleNavigation(action.navigate, action.name);
        } else {
          // Log non-navigation action
          addToHistory({
            actionName: action.name,
            actionId: action.id,
            result: "success",
            details: action.details,
          });
        }
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

      setTimeout(() => {
        setMode((m) => (m === "speaking" ? "idle" : m));
      }, Math.max(data.response.length * 60, 3000));
    } catch {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: "Le systeme a flanche. Pas le vaisseau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setMode("idle");
    }
  }, [tts, currentPage, handleNavigation, addToHistory, toast]);

  // ── Handle voice input complete ──

  const handleVoiceSubmit = useCallback(() => {
    speech.stopListening();
    const text = speech.transcript.trim();
    if (text) {
      // Check for voice confirmation/cancellation
      if (confirmation) {
        const lower = text.toLowerCase();
        if (lower.includes("confirme") || lower.includes("oui") || lower.includes("yes")) {
          confirmation.onConfirm();
          speech.resetTranscript();
          setMode("idle");
          return;
        }
        if (lower.includes("annule") || lower.includes("non") || lower.includes("cancel")) {
          confirmation.onCancel();
          speech.resetTranscript();
          setMode("idle");
          return;
        }
      }
      sendToJarvis(text);
    } else {
      setMode("idle");
    }
    speech.resetTranscript();
  }, [speech, sendToJarvis, confirmation]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (speech.isListening) {
      handleVoiceSubmit();
    } else {
      tts.stop();
      setMode("listening");
      speech.startListening();
    }
  }, [speech, tts, handleVoiceSubmit]);

  // Hands-free auto-submit
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

  // Toggle voice engine
  const toggleVoiceEngine = useCallback(async () => {
    if (voiceEngine === "web-speech") {
      // Switch to OpenAI Realtime
      const connected = await realtime.connect((text) => {
        // Handle realtime transcript
        const msg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, msg]);

        // Check for actions in realtime response
        const action = matchAction(text);
        if (action?.navigate) {
          handleNavigation(action.navigate, action.name);
        }
      });
      if (connected) {
        setVoiceEngine("openai-realtime");
        toast("Mode OpenAI Realtime actif", "success");
      } else {
        toast("Connexion OpenAI Realtime echouee", "error");
      }
    } else {
      realtime.disconnect();
      setVoiceEngine("web-speech");
      toast("Mode Web Speech actif", "info");
    }
  }, [voiceEngine, realtime, toast, handleNavigation]);

  // ── Orb config ──

  const orbColors: Record<JarvisMode, { glow: string; ring: string; bg: string }> = {
    idle: { glow: "rgba(0,180,216,0.15)", ring: "rgba(0,180,216,0.4)", bg: "rgba(0,180,216,0.08)" },
    listening: { glow: "rgba(0,212,255,0.4)", ring: "rgba(0,212,255,0.8)", bg: "rgba(0,212,255,0.15)" },
    processing: { glow: "rgba(239,68,68,0.3)", ring: "rgba(239,68,68,0.7)", bg: "rgba(239,68,68,0.1)" },
    speaking: { glow: "rgba(34,197,94,0.3)", ring: "rgba(34,197,94,0.7)", bg: "rgba(34,197,94,0.1)" },
  };

  const modeLabels: Record<JarvisMode, string> = {
    idle: "En attente",
    listening: "Ecoute...",
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

        <div className="flex flex-col items-center">
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#00D4FF]">
            JARVIS
          </h1>
          <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
            {pageName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice engine toggle */}
          {realtime.isAvailable && (
            <button
              onClick={toggleVoiceEngine}
              className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-mono transition-all ${
                voiceEngine === "openai-realtime"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
              }`}
              title={voiceEngine === "openai-realtime" ? "Mode OpenAI Realtime" : "Mode Web Speech"}
            >
              <Sparkles className="h-3 w-3" />
              {voiceEngine === "openai-realtime" ? "RT" : "WS"}
            </button>
          )}

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
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 overflow-hidden">

        {/* ── Confirmation Card ── */}
        <AnimatePresence>
          {confirmation && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-200">
                    {confirmation.message}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={confirmation.onConfirm}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Confirmer
                    </button>
                    <button
                      onClick={confirmation.onCancel}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ORB ── */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: mode === "listening" ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-48 w-48 rounded-full"
            style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
          />
          <motion.div
            animate={{
              scale: mode === "listening" ? [1, 1.1 + audioLevel * 0.2, 1] : [1, 1.05, 1],
              opacity: mode === "idle" ? 0.3 : 0.6,
            }}
            transition={{ duration: mode === "listening" ? 0.3 : 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-36 w-36 rounded-full border"
            style={{ borderColor: colors.ring }}
          />
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
                <motion.div key="loader" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, rotate: 360 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}>
                  <Loader2 className="h-10 w-10 text-white/80" />
                </motion.div>
              ) : speech.isListening ? (
                <motion.div key="mic-on" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Mic className="h-10 w-10 text-white" />
                </motion.div>
              ) : (
                <motion.div key="mic-off" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <MicOff className="h-10 w-10 text-white/60" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Status ── */}
        <div className="text-center">
          <motion.p key={mode} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-[var(--color-text-muted)]">
            {modeLabels[mode]}
          </motion.p>
          {speech.isListening && (speech.transcript || speech.interimTranscript) && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 max-w-md text-sm text-[var(--color-text)] font-[family-name:var(--font-satoshi)]">
              {speech.transcript}
              <span className="text-[var(--color-text-muted)]">{speech.interimTranscript}</span>
            </motion.p>
          )}
          {voiceEngine === "openai-realtime" && realtime.isConnected && (
            <p className="mt-1 text-[10px] text-emerald-400/60 font-mono">OpenAI Realtime connecte</p>
          )}
        </div>

        {/* ── Quick Suggestions ── */}
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {suggestions.map((s: QuickSuggestion) => (
            <button
              key={s.id}
              onClick={() => handleQuickAction(s.command)}
              disabled={mode === "processing"}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-all hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <DynIcon name={s.icon} className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
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
                      {msg.action?.navigate ? (
                        <Navigation className="h-3 w-3 text-cyan-400 shrink-0" />
                      ) : (
                        <Zap className="h-3 w-3 text-cyan-400 shrink-0" />
                      )}
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

        {/* ── Action History Panel ── */}
        {actionHistory.length > 0 && (
          <div className="w-full max-w-2xl">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-mono"
            >
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Historique ({actionHistory.length})
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2 rounded-lg border border-[var(--color-border-subtle)] bg-[#0A0A14]/60"
                >
                  <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                    {actionHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-2 text-[10px] font-mono px-2 py-1 rounded hover:bg-[var(--color-surface)]/30">
                        <Clock className="h-2.5 w-2.5 text-[var(--color-text-muted)] shrink-0" />
                        <span className="text-[var(--color-text-muted)]">
                          {entry.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className={`${
                          entry.result === "success" || entry.result === "confirmed" ? "text-emerald-400" :
                          entry.result === "error" ? "text-red-400" :
                          entry.result === "cancelled" ? "text-amber-400" :
                          "text-[var(--color-text-muted)]"
                        }`}>
                          {entry.actionName}
                        </span>
                        {entry.navigate && (
                          <span className="text-cyan-400/50">{entry.navigate}</span>
                        )}
                        <span className={`ml-auto text-[8px] px-1.5 py-0.5 rounded ${
                          entry.result === "success" || entry.result === "confirmed" ? "bg-emerald-500/10 text-emerald-400" :
                          entry.result === "error" ? "bg-red-500/10 text-red-400" :
                          entry.result === "cancelled" ? "bg-amber-500/10 text-amber-400" :
                          "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                        }`}>
                          {entry.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
