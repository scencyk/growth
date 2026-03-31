"use client";

import { DISCLAIMER } from "@/lib/copilot/mock-data";

export function DisclaimerBar() {
  return (
    <div className="mt-6 pt-4 border-t border-foreground/5">
      <p className="text-[10px] leading-relaxed text-muted-foreground font-mono">
        {DISCLAIMER}
      </p>
    </div>
  );
}
