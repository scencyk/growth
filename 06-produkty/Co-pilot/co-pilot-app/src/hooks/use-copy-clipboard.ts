"use client";

import { useState, useCallback, useRef } from "react";

export function useCopyClipboard(resetDelay = 1500) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    (text: string, id: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), resetDelay);
      });
    },
    [resetDelay]
  );

  const isCopied = useCallback(
    (id: string) => copiedId === id,
    [copiedId]
  );

  return { copy, isCopied };
}
