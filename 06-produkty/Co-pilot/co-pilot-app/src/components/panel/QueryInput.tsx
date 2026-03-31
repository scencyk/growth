"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUp, Pencil } from "lucide-react";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { INTENT_CHIPS } from "@/lib/copilot/mock-data";
import type { PatientStatus } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

interface QueryInputProps {
  query: string;
  status: PatientStatus;
  onSubmit: (query: string) => void;
}

export function QueryInput({ query, status, onSubmit }: QueryInputProps) {
  const [value, setValue] = useState(query);
  const [editMode, setEditMode] = useState(!query);
  const { textareaRef, resize } = useAutoResize();

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit(value.trim());
      setEditMode(false);
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

  // Show read-only query when we have a submitted query
  if (query && !editMode) {
    return (
      <div className="border-b border-border">
        <div className="px-3 py-2.5 flex items-start gap-2 group">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-1">
              Zapytanie
            </div>
            <p className="text-[12px] text-foreground leading-relaxed">{query}</p>
          </div>
          <button
            onClick={() => {
              setValue(query);
              setEditMode(true);
            }}
            className="size-5 flex items-center justify-center text-transparent group-hover:text-muted-foreground hover:!text-primary transition-colors shrink-0 mt-0.5"
            title="Edytuj zapytanie"
          >
            <Pencil className="size-3" />
          </button>
        </div>
      </div>
    );
  }

  // Editable input
  return (
    <div className="border-b border-border">
      <div className="px-3 pt-2 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          Zapytanie
        </span>
      </div>
      <div className="px-3 pb-2">
        <div className="relative border border-border focus-within:border-primary transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              resize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Opisz sytuację kliniczną..."
            autoFocus
            rows={2}
            className="w-full resize-none bg-transparent px-2.5 py-2 pr-9 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none min-h-[56px]"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            disabled={!value.trim()}
            className={cn(
              "absolute right-1.5 bottom-1.5 size-6 flex items-center justify-center transition-colors",
              value.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <ArrowUp className="size-3" />
          </motion.button>
        </div>

        {/* Intent chips */}
        {!query && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {INTENT_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setValue((prev) => prev ? prev : chip + ": ")}
                className="px-2 py-1 text-[10px] text-muted-foreground border border-border hover:border-primary/30 hover:text-primary transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
