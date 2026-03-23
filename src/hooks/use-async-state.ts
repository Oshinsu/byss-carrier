"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  execute: (fn: () => Promise<T>) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
}

export function useAsyncState<T>(initialValue: T): AsyncState<T> {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async (fn: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialValue);
    setLoading(false);
    setError(null);
  }, [initialValue]);

  return { data, loading, error, execute, setData, reset };
}
