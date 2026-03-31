"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { EXAMPLE_QUERIES, INTENT_CHIPS } from "@/lib/copilot/mock-data";

const EASE = [0.16, 1, 0.3, 1] as const;

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
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="fixed left-1/2 top-[15vh] z-50 w-full max-w-lg -translate-x-1/2 px-4"
          >
            <div className="border-2 border-foreground/10 bg-card overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 border-b-2 border-foreground/5 px-5 py-4">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Opisz sytuację kliniczną..."
                  autoFocus
                  className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  className="size-7 flex items-center justify-center bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  <ArrowUp className="size-3.5" />
                </button>
              </div>

              {/* Chips */}
              <div className="px-5 py-3 border-b border-foreground/5 flex flex-wrap gap-2">
                {INTENT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSelect(chip)}
                    className="px-3 py-1.5 text-[11px] font-medium border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Examples */}
              <div className="max-h-[35vh] overflow-auto">
                {EXAMPLE_QUERIES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleSelect(ex.query)}
                    className="flex items-start gap-3 w-full px-5 py-3 text-left border-b border-foreground/5 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-0.5">
                        {ex.label}
                      </div>
                      <div className="text-[13px] text-muted-foreground group-hover:text-foreground line-clamp-1 transition-colors">
                        {ex.query}
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-transparent group-hover:text-muted-foreground mt-1 shrink-0 transition-colors" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-2 text-[10px] font-mono text-muted-foreground flex justify-between">
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
