"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { DrugInteraction } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const statusMap = {
  safe: { label: "OK", color: "bg-ok", textColor: "text-ok" },
  caution: { label: "UWAGA", color: "bg-caution", textColor: "text-caution" },
  danger: { label: "STOP", color: "bg-destructive", textColor: "text-destructive" },
};

interface InteractionsSectionProps {
  interactions: DrugInteraction[];
}

export function InteractionsSection({ interactions }: InteractionsSectionProps) {
  const [open, setOpen] = useState(true);
  const allSafe = interactions.every((i) => i.status === "safe");

  return (
    <div className="border-t-2 border-foreground/5 pt-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left mb-3"
      >
        <div className="flex items-center gap-2">
          <div className={cn("size-2", allSafe ? "bg-ok" : "bg-caution")} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Interakcje
          </span>
          {allSafe && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-ok ml-1">
              — brak istotnych
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-foreground/10">
              {interactions.map((interaction, i) => {
                const status = statusMap[interaction.status];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3 border-b border-foreground/5"
                  >
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      <div className={cn("size-2 rounded-full", status.color)} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", status.textColor)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-foreground">
                        {interaction.drug}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                        {interaction.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
