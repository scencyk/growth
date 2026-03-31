"use client";

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

function Bar({ w, delay }: { w: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      style={{ width: w, transformOrigin: "left" }}
      className="h-3.5 skeleton-bar"
    />
  );
}

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="space-y-6"
    >
      {/* Status */}
      <div className="flex items-center gap-3">
        <div className="size-2 bg-primary animate-pulse-dot" />
        <span className="text-[14px] font-medium animate-shimmer-wave">
          Analizuję pytanie
        </span>
      </div>

      {/* Skeleton card */}
      <div className="border-2 border-foreground/5 bg-card p-6 sm:p-8 space-y-6">
        {/* Synthesis */}
        <div className="space-y-2.5">
          <Bar w="60px" delay={0.05} />
          <Bar w="100%" delay={0.1} />
          <Bar w="92%" delay={0.15} />
          <Bar w="72%" delay={0.2} />
        </div>

        {/* Data */}
        <div className="border-t-2 border-foreground/5 pt-5 space-y-2.5">
          <Bar w="140px" delay={0.25} />
          {[0.3, 0.34, 0.38, 0.42].map((d, i) => (
            <div key={i} className="flex justify-between gap-8">
              <Bar w="120px" delay={d} />
              <Bar w="80px" delay={d + 0.02} />
            </div>
          ))}
        </div>

        {/* Interactions */}
        <div className="border-t-2 border-foreground/5 pt-5 space-y-2.5">
          <Bar w="100px" delay={0.48} />
          {[0.52, 0.56].map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: d }}
                className="size-2 rounded-full skeleton-bar"
              />
              <Bar w="200px" delay={d} />
            </div>
          ))}
        </div>

        {/* ICD */}
        <div className="border-t-2 border-foreground/5 pt-5 space-y-2.5">
          <Bar w="50px" delay={0.6} />
          <div className="flex gap-4">
            {[0.64, 0.67, 0.7].map((d, i) => (
              <Bar key={i} w="70px" delay={d} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
