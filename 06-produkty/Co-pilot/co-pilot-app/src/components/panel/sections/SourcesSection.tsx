"use client";

import type { Source } from "@/lib/copilot/types";
import { Section } from "../Section";

const typeLabel: Record<Source["type"], string> = {
  guideline: "WYT",
  study: "BAD",
  spc: "ChPL",
};

interface SourcesSectionProps {
  sources: Source[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  return (
    <Section label="Źródła" defaultOpen={false} badge={<span className="text-[9px] font-mono text-muted-foreground/50">{sources.length}</span>}>
      <div className="px-3 space-y-0">
        {sources.map((s) => (
          <div
            key={s.id}
            className="flex items-baseline gap-1.5 py-[2px] min-h-[18px] text-[10px] hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <span className="font-mono text-muted-foreground/40 w-3 text-right tabular-nums shrink-0">{s.id}</span>
            <span className="text-foreground/70 leading-snug flex-1">{s.title}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/40 shrink-0">{typeLabel[s.type]}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
