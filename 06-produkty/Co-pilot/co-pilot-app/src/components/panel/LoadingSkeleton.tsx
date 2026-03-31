"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

function Bar({ w, delay }: { w: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3, delay, ease: EASE }}
      style={{ width: w, transformOrigin: "left" }}
      className="h-3 skeleton"
    />
  );
}

function SectionSkeleton({
  label,
  rows,
  baseDelay,
}: {
  label: string;
  rows: { w1: string; w2: string }[];
  baseDelay: number;
}) {
  return (
    <div className="border-b border-border">
      <div className="h-8 px-3 flex items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: baseDelay }}
          className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
        >
          {label}
        </motion.span>
      </div>
      <div className="px-3 pb-2 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-8">
            <Bar w={row.w1} delay={baseDelay + 0.04 * (i + 1)} />
            <Bar w={row.w2} delay={baseDelay + 0.04 * (i + 1) + 0.02} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Status */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <div className="size-[6px] rounded-full bg-primary animate-pulse-dot" />
        <span className="text-[11px] shimmer-text font-medium">Analizuję zapytanie</span>
      </div>

      <SectionSkeleton
        label="Kontekst"
        baseDelay={0.05}
        rows={[
          { w1: "50px", w2: "60px" },
          { w1: "80px", w2: "120px" },
          { w1: "40px", w2: "140px" },
        ]}
      />
      <SectionSkeleton
        label="Synteza"
        baseDelay={0.2}
        rows={[
          { w1: "100%", w2: "0px" },
          { w1: "90%", w2: "0px" },
          { w1: "70%", w2: "0px" },
        ]}
      />
      <SectionSkeleton
        label="Dane"
        baseDelay={0.35}
        rows={[
          { w1: "80px", w2: "100px" },
          { w1: "60px", w2: "120px" },
          { w1: "90px", w2: "80px" },
          { w1: "70px", w2: "110px" },
        ]}
      />
      <SectionSkeleton
        label="Interakcje"
        baseDelay={0.5}
        rows={[
          { w1: "160px", w2: "30px" },
          { w1: "140px", w2: "30px" },
        ]}
      />
    </motion.div>
  );
}
