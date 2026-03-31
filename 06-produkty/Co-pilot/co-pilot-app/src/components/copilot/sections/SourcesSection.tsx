"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { Source } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const typeLabel = { guideline: "WYT", study: "BAD", spc: "ChPL" };

interface SourcesSectionProps {
  sources: Source[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t-2 border-foreground/5 pt-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-foreground/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Źródła
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            ({sources.length})
          </span>
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
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-baseline gap-3 py-2.5 border-b border-foreground/5 group hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground w-5 text-right tabular-nums">
                    [{source.id}]
                  </span>
                  <span className="text-[13px] text-foreground/80 leading-snug group-hover:text-foreground transition-colors flex-1">
                    {source.title}
                  </span>
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5">
                    {typeLabel[source.type]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
