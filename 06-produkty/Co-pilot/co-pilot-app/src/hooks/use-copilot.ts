"use client";

import { useState, useCallback, useRef } from "react";
import type { CoPilotState, CoPilotResponse, HistoryEntry, Specialization } from "@/lib/copilot/types";
import { matchScenario } from "@/lib/copilot/mock-data";

const LOADING_DELAY_MIN = 1500;
const LOADING_DELAY_MAX = 2500;

function randomDelay() {
  return Math.floor(
    Math.random() * (LOADING_DELAY_MAX - LOADING_DELAY_MIN) + LOADING_DELAY_MIN
  );
}

export function useCoPilot() {
  const [state, setState] = useState<CoPilotState>("empty");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<CoPilotResponse | null>(null);
  const [specialization, setSpecialization] = useState<Specialization>("kardiologia");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setQuery(trimmed);
      setState("loading");

      // Add to history
      setHistory((prev) => {
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          query: trimmed,
          timestamp: new Date(),
        };
        return [entry, ...prev].slice(0, 10);
      });

      // Clear any pending timer
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const matched = matchScenario(trimmed);
        if (matched) {
          setResponse(matched);
          setState("response");
        } else {
          // Fallback: use therapeutic scenario as default demo
          setResponse(null);
          setState("response");
        }
      }, randomDelay());
    },
    []
  );

  const reset = useCallback(() => {
    setState("empty");
    setQuery("");
    setResponse(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const askFollowUp = useCallback(
    (followUpQuery: string) => {
      submit(followUpQuery);
    },
    [submit]
  );

  return {
    state,
    query,
    response,
    specialization,
    history,
    setSpecialization,
    submit,
    reset,
    askFollowUp,
  };
}
