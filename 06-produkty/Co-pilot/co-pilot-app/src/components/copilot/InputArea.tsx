"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { SpecializationBadge } from "./SpecializationBadge";
import { HistoryPanel } from "./HistoryPanel";
import type { Specialization, HistoryEntry } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSubmit: (query: string) => void;
  specialization: Specialization;
  onSpecializationChange: (spec: Specialization) => void;
  history: HistoryEntry[];
  onHistorySelect: (query: string) => void;
  placeholder?: string;
  compact?: boolean;
  autoFocus?: boolean;
  initialValue?: string;
}

export function InputArea({
  onSubmit,
  specialization,
  onSpecializationChange,
  history,
  onHistorySelect,
  placeholder = "Opisz sytuację kliniczną...",
  compact = false,
  autoFocus = false,
  initialValue = "",
}: InputAreaProps) {
  const [value, setValue] = useState(initialValue);
  const { textareaRef, resize } = useAutoResize();

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue("");
    }
  }, [value, onSubmit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <motion.div
      initial={compact ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", compact ? "mt-6" : "mt-0")}
    >
      {/* Bauhaus-style input: thick bottom border, no rounded corners */}
      <div className="relative border-2 border-foreground/10 focus-within:border-primary transition-colors duration-150">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={compact ? 1 : 2}
          className={cn(
            "w-full resize-none bg-transparent px-4 py-3.5 pr-14",
            "text-[15px] text-foreground placeholder:text-muted-foreground",
            "focus:outline-none",
            compact ? "min-h-[44px] py-3 text-[14px]" : "min-h-[72px]"
          )}
        />

        {/* Submit */}
        <div className="absolute right-3 bottom-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={cn(
              "size-8 flex items-center justify-center transition-all duration-150",
              value.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <ArrowUp className="size-4" />
          </motion.button>
        </div>
      </div>

      {/* Meta row */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-3 gap-3 flex-wrap"
        >
          <SpecializationBadge
            value={specialization}
            onChange={onSpecializationChange}
          />
          <div className="flex items-center gap-3">
            <HistoryPanel history={history} onSelect={onHistorySelect} />
            <kbd className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground">
              &#8984;K
            </kbd>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
