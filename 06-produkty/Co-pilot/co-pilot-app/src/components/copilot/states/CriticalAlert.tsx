"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";

interface CriticalAlertProps {
  message: string;
}

export function CriticalAlert({ message }: CriticalAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="border-2 border-destructive bg-destructive/5 px-5 py-4 mb-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive mb-1.5">
            Interakcja krytyczna
          </div>
          <p className="text-[13px] text-destructive/80 leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-destructive/40 hover:text-destructive transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}
