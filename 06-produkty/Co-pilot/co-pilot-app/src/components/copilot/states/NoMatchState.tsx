"use client";

import { motion } from "motion/react";

interface NoMatchStateProps {
  onReset: () => void;
}

export function NoMatchState({ onReset }: NoMatchStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-2 border-foreground/5 bg-card p-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="size-2 bg-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Brak dopasowania
        </span>
      </div>
      <p className="text-[14px] text-foreground mb-2">
        Nie rozpoznałem kontekstu klinicznego.
      </p>
      <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
        Podaj szczegóły — wiek, objawy, leki, parametry.
      </p>
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="text-[12px] font-semibold uppercase tracking-[0.15em] text-primary hover:underline"
      >
        &larr; Zacznij od nowa
      </motion.button>
    </motion.div>
  );
}
