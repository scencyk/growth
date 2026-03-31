"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check, Copy } from "lucide-react";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import type { IcdCode } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface IcdSectionProps {
  codes: IcdCode[];
}

export function IcdSection({ codes }: IcdSectionProps) {
  const [open, setOpen] = useState(true);
  const { copy, isCopied } = useCopyClipboard();

  return (
    <div className="border-t-2 border-foreground/5 pt-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left mb-3"
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-foreground/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            ICD-10
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
              {codes.map((code) => {
                const copied = isCopied(code.code);
                return (
                  <motion.button
                    key={code.code}
                    onClick={() => copy(code.code, code.code)}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "flex items-center justify-between gap-4 w-full py-2.5 border-b border-foreground/5 text-left group transition-colors",
                      copied ? "bg-ok/5" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <code className={cn(
                        "font-mono text-[13px] font-medium tabular-nums transition-colors",
                        copied ? "text-ok" : "text-primary"
                      )}>
                        {code.code}
                      </code>
                      <span className="text-[13px] text-muted-foreground">
                        {code.label}
                      </span>
                    </div>
                    <span className={cn(
                      "shrink-0 transition-all",
                      copied ? "text-ok" : "text-muted-foreground/30 group-hover:text-foreground/50"
                    )}>
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
