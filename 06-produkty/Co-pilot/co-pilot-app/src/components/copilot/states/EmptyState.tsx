"use client";

import { motion } from "motion/react";
import { EXAMPLE_QUERIES, INTENT_CHIPS } from "@/lib/copilot/mock-data";

const EASE = [0.16, 1, 0.3, 1] as const;

interface EmptyStateProps {
  onSelectExample: (query: string) => void;
  onSelectIntent: (intent: string) => void;
}

export function EmptyState({ onSelectExample, onSelectIntent }: EmptyStateProps) {
  return (
    <div className="flex flex-col pt-6 sm:pt-12 pb-4">
      {/* Title block — Bauhaus bold */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="size-3 rounded-full bg-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Remedium
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
          Co-Pilot
        </h1>
        <p className="text-lg sm:text-xl font-light text-muted-foreground mt-1 tracking-tight">
          Asystent decyzji klinicznych
        </p>
      </motion.div>

      {/* Intent chips — geometric pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {INTENT_CHIPS.map((intent) => (
          <motion.button
            key={intent}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectIntent(intent)}
            className="px-4 py-2 text-[13px] font-medium border-2 border-foreground/10 hover:border-primary hover:text-primary transition-colors duration-150"
          >
            {intent}
          </motion.button>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Scenariusze
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Example queries — ruled list */}
      <div className="space-y-0 border-t border-foreground/10">
        {EXAMPLE_QUERIES.map((ex, i) => (
          <motion.button
            key={ex.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.07 }}
            onClick={() => onSelectExample(ex.query)}
            className="w-full text-left border-b border-foreground/10 py-4 group hover:bg-muted/30 transition-colors duration-150 -mx-4 px-4"
          >
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                {ex.label}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Enter &rarr;
              </span>
            </div>
            <p className="text-[14px] text-foreground/70 leading-relaxed group-hover:text-foreground transition-colors">
              {ex.query}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
