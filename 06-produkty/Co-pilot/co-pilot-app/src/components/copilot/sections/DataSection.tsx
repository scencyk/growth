"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import type { DataRow } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface DataSectionProps {
  label: string;
  rows: DataRow[];
  note?: string;
}

export function DataSection({ label, rows, note }: DataSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-t-2 border-foreground/5 pt-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left group mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-foreground/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
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
            {/* Table — ruled, no background, pure typography */}
            <div className="border-t border-foreground/10">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-baseline justify-between gap-6 py-2.5 border-b border-foreground/5",
                    row.highlight && "bg-primary/[0.03]"
                  )}
                >
                  <span className="text-[13px] text-muted-foreground">
                    {row.key}
                  </span>
                  <span
                    className={cn(
                      "text-right font-mono text-[13px] tabular-nums",
                      row.highlight
                        ? "text-primary font-medium"
                        : "text-foreground"
                    )}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {note && (
              <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
                {note}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
