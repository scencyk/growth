"use client";

import { useState, useRef, useEffect } from "react";
import type { PatientContext } from "@/lib/copilot/types";
import { Section } from "../Section";
import { cn } from "@/lib/utils";

/**
 * Stacked field — Remedium style:
 * Small label above, value below. Looks like text, editable on click.
 */
function Field({
  label,
  value,
  onSave,
  mono,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  mono?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) { ref.current?.focus(); ref.current?.select(); }
  }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t && t !== value) onSave(t);
    setEditing(false);
  };

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      className={cn(
        "px-2.5 py-1.5 rounded-sm cursor-text transition-colors",
        editing ? "bg-primary/[0.04]" : "hover:bg-muted/50"
      )}
    >
      <div className="text-[9px] text-muted-foreground/70 font-medium leading-none mb-0.5 select-none">
        {label}
      </div>
      {editing ? (
        <input
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(value); setEditing(false); }
          }}
          className={cn(
            "w-full bg-transparent text-[11px] text-foreground leading-snug outline-none border-b border-primary/30 pb-px",
            mono && "font-mono tabular-nums"
          )}
        />
      ) : (
        <div className={cn(
          "text-[11px] text-foreground leading-snug",
          mono && "font-mono tabular-nums"
        )}>
          {value}
        </div>
      )}
    </div>
  );
}

function ListField({
  label,
  values,
  onSave,
  dotColor,
}: {
  label: string;
  values: string[];
  onSave: (index: number, v: string) => void;
  dotColor?: string;
}) {
  return (
    <div className="px-2.5 py-1.5">
      <div className="text-[9px] text-muted-foreground/70 font-medium leading-none mb-1 select-none">
        {label}
      </div>
      {values.map((val, i) => (
        <InlineEdit key={`${label}-${i}`} value={val} onSave={(v) => onSave(i, v)} dotColor={dotColor} />
      ))}
    </div>
  );
}

function InlineEdit({ value, onSave, dotColor }: { value: string; onSave: (v: string) => void; dotColor?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing) { ref.current?.focus(); ref.current?.select(); }
  }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t && t !== value) onSave(t);
    setEditing(false);
  };

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      className={cn(
        "flex items-center gap-1.5 py-[2px] -mx-1 px-1 rounded-sm cursor-text transition-colors",
        editing ? "bg-primary/[0.04]" : "hover:bg-muted/50"
      )}
    >
      {dotColor && <div className={cn("size-[4px] rounded-full shrink-0", dotColor)} />}
      {editing ? (
        <input
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setDraft(value); setEditing(false); }
          }}
          className="flex-1 bg-transparent text-[11px] text-foreground outline-none border-b border-primary/30 pb-px min-w-0"
        />
      ) : (
        <span className="text-[11px] text-foreground leading-snug">{value}</span>
      )}
    </div>
  );
}

interface ContextSectionProps {
  context?: PatientContext;
  onUpdate?: (field: string, index: number | null, newValue: string) => void;
}

export function ContextSection({ context, onUpdate }: ContextSectionProps) {
  if (!context) return null;

  const has = context.age || context.sex || context.conditions?.length ||
    context.symptoms?.length || context.medications?.length || context.parameters?.length;
  if (!has) return null;

  return (
    <Section label="Kontekst pacjenta">
      <div className="px-1 grid grid-cols-2 gap-x-1 gap-y-0">
        {context.age && (
          <Field label="Wiek" value={context.age} onSave={(v) => onUpdate?.("age", null, v)} />
        )}
        {context.sex && (
          <Field label="Płeć" value={context.sex} onSave={(v) => onUpdate?.("sex", null, v)} />
        )}
        {context.parameters?.map((p, i) => (
          <Field key={`p-${i}`} label={p.key} value={p.value} mono onSave={(v) => onUpdate?.("parameters", i, v)} />
        ))}
      </div>
      {context.conditions && context.conditions.length > 0 && (
        <ListField label="Rozpoznania" values={context.conditions} onSave={(i, v) => onUpdate?.("conditions", i, v)} dotColor="bg-primary" />
      )}
      {context.symptoms && context.symptoms.length > 0 && (
        <ListField label="Objawy" values={context.symptoms} onSave={(i, v) => onUpdate?.("symptoms", i, v)} dotColor="bg-destructive" />
      )}
      {context.medications && context.medications.length > 0 && (
        <ListField label="Leki" values={context.medications} onSave={(i, v) => onUpdate?.("medications", i, v)} dotColor="bg-ok" />
      )}
    </Section>
  );
}
