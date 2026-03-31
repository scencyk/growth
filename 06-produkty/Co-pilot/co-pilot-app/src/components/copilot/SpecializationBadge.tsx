"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import type { Specialization } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const SPECIALIZATIONS: { value: Specialization; label: string }[] = [
  { value: "kardiologia", label: "Kardiologia" },
  { value: "diabetologia", label: "Diabetologia" },
  { value: "interna", label: "Interna" },
  { value: "pediatria", label: "Pediatria" },
  { value: "reumatologia", label: "Reumatologia" },
  { value: "neurologia", label: "Neurologia" },
];

interface SpecializationBadgeProps {
  value: Specialization;
  onChange: (spec: Specialization) => void;
}

export function SpecializationBadge({ value, onChange }: SpecializationBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = SPECIALIZATIONS.find((s) => s.value === value);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Kontekst: <span className="text-primary">{current?.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1 z-50 border-2 border-foreground/10 bg-card p-1 min-w-[160px]"
          >
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.value}
                onClick={() => {
                  onChange(spec.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-1.5 text-[12px] transition-colors",
                  spec.value === value
                    ? "text-primary font-medium bg-primary/5"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {spec.label}
                {spec.value === value && <Check className="size-3" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
