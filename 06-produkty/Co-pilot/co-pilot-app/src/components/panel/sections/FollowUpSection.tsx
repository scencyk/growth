"use client";

import { ArrowRight } from "lucide-react";
import { Section } from "../Section";

interface FollowUpSectionProps {
  questions: string[];
  onAsk: (query: string) => void;
}

export function FollowUpSection({ questions, onAsk }: FollowUpSectionProps) {
  return (
    <Section label="Dalej">
      <div className="px-3 space-y-0">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onAsk(q)}
            className="flex items-center gap-1.5 w-full py-[3px] text-left text-[10px] text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowRight className="size-2.5 text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
            <span className="leading-snug">{q}</span>
          </button>
        ))}
      </div>
    </Section>
  );
}
