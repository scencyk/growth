"use client";

import { useCallback, useRef, useEffect } from "react";

export function useAutoResize() {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [resize]);

  const textareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      ref.current = node;
      if (node) {
        resize();
      }
    },
    [resize]
  );

  return { textareaRef, resize };
}
