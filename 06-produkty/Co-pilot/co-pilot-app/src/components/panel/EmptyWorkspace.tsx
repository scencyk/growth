"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface EmptyWorkspaceProps {
  onCreatePatient: () => void;
}

export function EmptyWorkspace({ onCreatePatient }: EmptyWorkspaceProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-xs"
      >
        <div className="flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-foreground">
            <path d="M19 10.8944C15.7495 10.8944 13.1056 8.25045 13.1056 5H10.8944C10.8944 8.25045 8.25045 10.8944 5 10.8944V13.1056C8.25045 13.1056 10.8944 15.7495 10.8944 19H13.1056C13.1056 15.7495 15.7495 13.1056 19 13.1056V10.8944ZM12 14.9219C11.2956 13.7153 10.2847 12.7044 9.07807 12C10.2847 11.2924 11.2924 10.2847 12 9.07807C12.7076 10.2847 13.7153 11.2924 14.9219 12C13.7153 12.7076 12.7076 13.7153 12 14.9219Z" fill="currentColor" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Co-Pilot AI
          </span>
        </div>

        <h2 className="text-[15px] font-semibold text-foreground mb-1">
          Panel wizytowy POZ
        </h2>
        <p className="text-[12px] text-muted-foreground mb-6 leading-relaxed">
          Utwórz kartę pacjenta, prowadź wizytę kliknięciami.
          <br />
          Recepta, ICD i dokumentacja generują się na bieżąco.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreatePatient}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-3.5" />
          Nowy pacjent
        </motion.button>
      </motion.div>
    </div>
  );
}
