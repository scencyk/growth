"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, Search } from "lucide-react";
import { EXAMPLE_QUERIES } from "@/lib/copilot/mock-data";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
}

export function CommandPalette({ open, onClose, onSubmit }: CommandPaletteProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
      onClose();
    }
  }, [value, onSubmit, onClose]);

  const handleSelect = useCallback(
    (query: string) => {
      onSubmit(query);
      setValue("");
      onClose();
    },
    [onSubmit, onClose]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 bg-foreground/10"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="fixed left-1/2 top-[20vh] z-50 w-full max-w-md -translate-x-1/2 px-4"
          >
            <div className="border border-border bg-card shadow-lg overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Opisz sytuację kliniczną..."
                  autoFocus
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  className="size-6 flex items-center justify-center bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  <ArrowUp className="size-3" />
                </button>
              </div>

              {/* Scenarios */}
              <div className="max-h-[30vh] overflow-auto">
                {EXAMPLE_QUERIES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelect(ex.query)}
                    className="w-full text-left px-3 py-2 flex items-baseline gap-2 border-b border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-primary shrink-0">
                      {ex.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground truncate transition-colors">
                      {ex.query}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-3 py-1.5 text-[9px] font-mono text-muted-foreground/40 flex justify-between border-t border-border">
                <span>Co-Pilot AI</span>
                <span>Esc &middot; &#8984;K</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
