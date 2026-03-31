"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { HistoryEntry } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (query: string) => void;
}

export function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Historia ({history.length})
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 z-50 border-2 border-foreground/10 bg-card min-w-[280px] max-h-[200px] overflow-auto"
          >
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  onSelect(entry.query);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors truncate border-b border-foreground/5 last:border-b-0"
              >
                {entry.query}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
