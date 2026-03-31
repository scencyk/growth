"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface FollowUpSectionProps {
  questions: string[];
  onAsk: (query: string) => void;
}

export function FollowUpSection({ questions, onAsk }: FollowUpSectionProps) {
  return (
    <div className="border-t-2 border-foreground/5 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="size-2 bg-primary/40" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Zapytaj dalej
        </span>
      </div>
      <div className="space-y-0 border-t border-foreground/10">
        {questions.map((q, i) => (
          <motion.button
            key={i}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAsk(q)}
            className="flex items-center gap-3 w-full text-left py-2.5 border-b border-foreground/5 hover:bg-muted/20 transition-colors group"
          >
            <ArrowRight className="size-3.5 text-muted-foreground/30 group-hover:text-primary shrink-0 transition-colors" />
            <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
              {q}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
