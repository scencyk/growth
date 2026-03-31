"use client";

import { Check, Copy } from "lucide-react";
import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import type { IcdCode } from "@/lib/copilot/types";
import { Section } from "../Section";
import { cn } from "@/lib/utils";

interface IcdSectionProps {
  codes: IcdCode[];
}

export function IcdSection({ codes }: IcdSectionProps) {
  const { copy, isCopied } = useCopyClipboard();

  return (
    <Section label="ICD-10">
      <div className="px-3 flex flex-wrap gap-1">
        {codes.map((code) => {
          const copied = isCopied(code.code);
          return (
            <button
              key={code.code}
              onClick={() => copy(code.code, code.code)}
              className={cn(
                "inline-flex items-center gap-1.5 h-[22px] px-1.5 border text-[10px] transition-colors group",
                copied
                  ? "bg-ok/6 border-ok/20 text-ok"
                  : "bg-muted/40 border-border text-foreground hover:border-primary/30"
              )}
            >
              <code className={cn("font-mono font-medium tabular-nums", copied ? "text-ok" : "text-primary")}>
                {code.code}
              </code>
              <span className="text-muted-foreground max-w-[120px] truncate">{code.label}</span>
              {copied ? (
                <Check className="size-2.5 text-ok" />
              ) : (
                <Copy className="size-2.5 text-transparent group-hover:text-muted-foreground transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
