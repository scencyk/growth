"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import type { Patient, PatientStatus } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

const statusColors: Record<PatientStatus, string> = {
  new: "bg-muted-foreground/30",
  loading: "bg-primary animate-pulse-dot",
  ready: "bg-ok",
  error: "bg-destructive",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}

interface PatientSidebarProps {
  patients: Patient[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRemove: (id: string) => void;
}

export function PatientSidebar({
  patients,
  activeId,
  onSelect,
  onCreate,
  onRemove,
}: PatientSidebarProps) {
  return (
    <aside className="w-60 shrink-0 panel-sidebar flex flex-col h-full select-none">
      {/* Header */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-border">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Pacjenci
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCreate}
          className="size-6 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          title="Nowa karta pacjenta"
        >
          <Plus className="size-3.5" />
        </motion.button>
      </div>

      {/* Patient list */}
      <div className="flex-1 overflow-auto py-0.5">
        <AnimatePresence initial={false}>
          {patients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <button
                onClick={() => onSelect(patient.id)}
                className={cn(
                  "w-full text-left px-3 py-2 flex items-start gap-2.5 border-l-2 transition-colors group",
                  patient.id === activeId
                    ? "border-l-primary bg-accent/10"
                    : "border-l-transparent hover:bg-muted/50"
                )}
              >
                {/* Status dot */}
                <div className={cn("size-[6px] rounded-full mt-1.5 shrink-0", statusColors[patient.status])} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-foreground truncate">
                    {patient.label}
                  </div>
                  {patient.query && (
                    <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {patient.query}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] font-mono text-muted-foreground/60">
                    {formatTime(patient.createdAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(patient.id);
                    }}
                    className="size-4 flex items-center justify-center text-transparent group-hover:text-muted-foreground hover:!text-destructive transition-colors"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {patients.length === 0 && (
          <div className="px-3 py-4 text-center">
            <p className="text-[10px] text-muted-foreground">
              Brak kart pacjentów
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2">
        <div className="text-[9px] font-mono text-muted-foreground/40">
          &#8984;K — szybkie zapytanie
        </div>
      </div>
    </aside>
  );
}
