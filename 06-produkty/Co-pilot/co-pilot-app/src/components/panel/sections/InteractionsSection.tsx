"use client";

import type { DrugInteraction, InteractionStatus } from "@/lib/copilot/types";
import { Section } from "../Section";
import { cn } from "@/lib/utils";

const cfg: Record<InteractionStatus, { dot: string; text: string; label: string }> = {
  safe: { dot: "bg-ok", text: "text-ok", label: "OK" },
  caution: { dot: "bg-caution", text: "text-caution", label: "!" },
  danger: { dot: "bg-destructive", text: "text-destructive", label: "✕" },
};

interface InteractionsSectionProps {
  interactions: DrugInteraction[];
}

export function InteractionsSection({ interactions }: InteractionsSectionProps) {
  const allSafe = interactions.every((i) => i.status === "safe");

  return (
    <Section
      label="Interakcje"
      badge={
        allSafe ? (
          <span className="text-[9px] font-bold text-ok">OK</span>
        ) : null
      }
    >
      <div className="px-3 space-y-0.5">
        {interactions.map((ix, i) => {
          const c = cfg[ix.status];
          return (
            <div key={i} className="flex items-start gap-1.5 py-[2px] min-h-[20px]">
              <div className={cn("size-[5px] rounded-full mt-[5px] shrink-0", c.dot)} />
              <span className="text-[10px] text-foreground">
                <span className="font-medium">{ix.drug}</span>
                <span className="text-muted-foreground"> — {ix.note}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
