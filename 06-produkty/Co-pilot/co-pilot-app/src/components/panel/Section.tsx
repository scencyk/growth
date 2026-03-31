"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  label: string;
  defaultOpen?: boolean;
  badge?: ReactNode;
  children: ReactNode;
}

export function Section({ label, defaultOpen = true, badge, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-7 px-3 flex items-center gap-1.5 text-left hover:bg-muted/40 transition-colors"
      >
        <ChevronRight
          className={cn(
            "size-2.5 text-muted-foreground transition-transform duration-100",
            open && "rotate-90"
          )}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {label}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Compact property row: "Label  value" left-aligned, not spread ─── */
interface PropertyRowProps {
  label: string;
  value: ReactNode;
  highlight?: boolean;
  mono?: boolean;
}

export function PropertyRow({ label, value, highlight, mono }: PropertyRowProps) {
  return (
    <div className="px-3 py-[3px] min-h-[22px] flex items-baseline gap-2">
      <span className="text-[10px] text-muted-foreground shrink-0 w-[80px]">{label}</span>
      <span
        className={cn(
          "text-[10px] leading-snug",
          highlight ? "text-primary font-medium" : "text-foreground",
          mono && "font-mono tabular-nums"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Editable property row — click to inline edit ─── */
interface EditablePropertyRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
  onSave: (newValue: string) => void;
}

export function EditablePropertyRow({
  label,
  value,
  highlight,
  mono,
  onSave,
}: EditablePropertyRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) { inputRef.current?.focus(); inputRef.current?.select(); }
  }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t && t !== value) onSave(t);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="px-3 py-[2px] min-h-[22px] flex items-center gap-2 bg-primary/[0.03]">
        <span className="text-[10px] text-muted-foreground shrink-0 w-[80px]">{label}</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(value); setEditing(false); }
          }}
          className={cn(
            "flex-1 text-[10px] bg-transparent border-b border-primary/30 outline-none py-0.5 min-w-0",
            highlight ? "text-primary font-medium" : "text-foreground",
            mono && "font-mono"
          )}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="px-3 py-[3px] min-h-[22px] flex items-baseline gap-2 group cursor-pointer hover:bg-muted/30 transition-colors"
    >
      <span className="text-[10px] text-muted-foreground shrink-0 w-[80px]">{label}</span>
      <span
        className={cn(
          "text-[10px] leading-snug",
          highlight ? "text-primary font-medium" : "text-foreground",
          mono && "font-mono tabular-nums"
        )}
      >
        {value}
      </span>
      <Pencil className="size-2 text-transparent group-hover:text-muted-foreground/70 transition-colors shrink-0 ml-auto" />
    </div>
  );
}
