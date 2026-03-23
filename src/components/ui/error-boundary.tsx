"use client";

import { Component, ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════
   ERROR BOUNDARY — Filet de securite global
   MODE_CADIFOR: Pas de crash silencieux. Le vaisseau signale.
   ═══════════════════════════════════════════════════════════════ */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = process.env.NODE_ENV === "development";

      return (
        <div
          className="flex min-h-[400px] items-center justify-center px-6"
          style={{ background: "var(--color-bg, #06080F)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-8 text-center"
            style={{
              borderColor: "rgba(0,212,255,0.2)",
              background: "rgba(10,22,40,0.8)",
              boxShadow: "0 0 40px rgba(0,212,255,0.05)",
            }}
          >
            {/* Sigil */}
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <span style={{ color: "#00D4FF" }}>⚠</span>
            </div>

            {/* Title */}
            <h2
              className="mb-2 text-lg font-bold"
              style={{
                fontFamily: "var(--font-clash-display, system-ui)",
                color: "#E8ECF4",
              }}
            >
              Une erreur est survenue.
            </h2>

            {/* Dev error message */}
            {isDev && this.state.error && (
              <pre
                className="mb-4 max-h-[120px] overflow-auto rounded-lg p-3 text-left text-xs"
                style={{
                  background: "rgba(255,45,45,0.06)",
                  border: "1px solid rgba(255,45,45,0.15)",
                  color: "#FF6B6B",
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            {/* Reset button */}
            <button
              onClick={this.handleReset}
              className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:brightness-110"
              style={{
                background: "rgba(0,212,255,0.12)",
                color: "#00D4FF",
                border: "1px solid rgba(0,212,255,0.25)",
              }}
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
