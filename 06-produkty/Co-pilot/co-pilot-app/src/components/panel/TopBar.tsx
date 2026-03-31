"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import type { Patient, PatientStatus, Specialization } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<PatientStatus, string> = {
  new: "Nowy",
  loading: "Analizuję...",
  ready: "Gotowe",
  error: "Błąd",
};

const statusColor: Record<PatientStatus, string> = {
  new: "bg-muted-foreground/30",
  loading: "bg-primary animate-pulse-dot",
  ready: "bg-ok",
  error: "bg-destructive",
};

const SPECIALIZATIONS: { value: Specialization; label: string }[] = [
  { value: "kardiologia", label: "Kardiologia" },
  { value: "diabetologia", label: "Diabetologia" },
  { value: "interna", label: "Interna" },
  { value: "pediatria", label: "Pediatria" },
  { value: "reumatologia", label: "Reumatologia" },
  { value: "neurologia", label: "Neurologia" },
];

interface TopBarProps {
  patient: Patient;
  onUpdateLabel: (label: string) => void;
  onSetSpecialization: (spec: Specialization) => void;
  onClose: () => void;
}

export function TopBar({ patient, onUpdateLabel, onSetSpecialization, onClose }: TopBarProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(patient.label);
  const [specOpen, setSpecOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(patient.label);
  }, [patient.label]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (specRef.current && !specRef.current.contains(e.target as Node)) {
        setSpecOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const commitLabel = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdateLabel(trimmed);
    setEditing(false);
  };

  const currentSpec = SPECIALIZATIONS.find((s) => s.value === patient.specialization);

  return (
    <div className="h-10 px-3 flex items-center gap-2 border-b border-border bg-card shrink-0">
      {/* Status dot */}
      <div className={cn("size-[6px] rounded-full shrink-0", statusColor[patient.status])} />
      <span className="text-[9px] font-mono text-muted-foreground shrink-0 w-16">
        {statusLabel[patient.status]}
      </span>

      {/* Divider */}
      <div className="w-px h-4 bg-border" />

      {/* Patient label — editable */}
      {editing ? (
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitLabel();
              if (e.key === "Escape") setEditing(false);
            }}
            onBlur={commitLabel}
            className="flex-1 min-w-0 text-[12px] font-medium text-foreground bg-transparent border-b border-primary/40 outline-none py-0.5"
          />
        </div>
      ) : (
        <button
          onDoubleClick={() => setEditing(true)}
          className="flex-1 min-w-0 text-left text-[12px] font-medium text-foreground truncate hover:text-primary transition-colors"
          title="Kliknij dwukrotnie aby edytować"
        >
          {patient.label}
        </button>
      )}

      {/* Specialization */}
      <div ref={specRef} className="relative shrink-0">
        <button
          onClick={() => setSpecOpen(!specOpen)}
          className="text-[10px] text-muted-foreground hover:text-primary transition-colors px-1.5 py-0.5 border border-transparent hover:border-border"
        >
          {currentSpec?.label}
        </button>

        {specOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 border border-border bg-card shadow-sm min-w-[140px]">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.value}
                onClick={() => {
                  onSetSpecialization(spec.value);
                  setSpecOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] transition-colors",
                  spec.value === patient.specialization
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {spec.label}
                {spec.value === patient.specialization && <Check className="size-3" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="size-6 flex items-center justify-center text-muted-foreground/40 hover:text-destructive transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
