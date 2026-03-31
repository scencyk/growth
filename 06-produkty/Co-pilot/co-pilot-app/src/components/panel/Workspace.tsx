"use client";

import { motion } from "motion/react";
import type { Patient, SymptomTag } from "@/lib/copilot/types";
import { DISCLAIMER } from "@/lib/copilot/mock-data";
import { useVisit } from "@/hooks/use-visit";
import { VisitFlow } from "./VisitFlow";
import { LiveOutput } from "./LiveOutput";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ContextSection } from "./sections/ContextSection";
import { SynthesisSection } from "./sections/SynthesisSection";
import { DataSection } from "./sections/DataSection";
import { InteractionsSection } from "./sections/InteractionsSection";
import { IcdSection } from "./sections/IcdSection";
import { ExportNote } from "./sections/ExportNote";
import { SourcesSection } from "./sections/SourcesSection";
import { FollowUpSection } from "./sections/FollowUpSection";

interface WorkspaceProps {
  patient: Patient;
  onSubmitQuery: (query: string) => void;
  onFollowUp: (query: string) => void;
  onAddTag: (tag: SymptomTag) => void;
  onRemoveTag: (tagId: string) => void;
  onUpdateTagValue: (tagId: string, value: string) => void;
  onUpdateContext: (field: string, index: number | null, value: string) => void;
}

export function Workspace({
  patient,
  onSubmitQuery,
  onFollowUp,
  onUpdateContext,
}: WorkspaceProps) {
  const r = patient.response;
  const visit = useVisit();

  /* ─── New patient: SPLIT SCREEN ─── */
  if (patient.status === "new") {
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — patient input */}
        <div className="w-1/2 border-r border-border overflow-auto">
          <VisitFlow
            state={visit.state}
            onSetSex={visit.setSex}
            onSetAge={visit.setAge}
            onSetComplaint={visit.setComplaint}
            onToggleFinding={visit.toggleFinding}
            onToggleExam={visit.toggleExam}
            onAddCustomFinding={visit.addCustomFinding}
            onRemoveCustomFinding={visit.removeCustomFinding}
            onAddCustomExam={visit.addCustomExam}
            onRemoveCustomExam={visit.removeCustomExam}
            onReset={visit.reset}
          />
        </div>

        {/* RIGHT — live output that reacts to every click */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-card">
          <div className="h-7 px-3 flex items-center border-b border-border shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Output
            </span>
          </div>
          <LiveOutput state={visit.state} />
        </div>
      </div>
    );
  }

  /* ─── Loading ─── */
  if (patient.status === "loading") {
    return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="border-b border-border px-3 py-2.5">
          <div className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-wider mb-1">Zapytanie</div>
          <p className="text-[11px] text-foreground/70 leading-relaxed">{patient.query}</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  /* ─── Response (from AI — old scenario flow via sidebar/⌘K) ─── */
  if (patient.status === "ready" && r) {
    return (
      <div className="flex-1 overflow-auto bg-background">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <div className="border-b border-border px-3 py-2.5">
            <div className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-wider mb-1">Zapytanie</div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">{patient.query}</p>
          </div>
          <ContextSection context={r.context} onUpdate={onUpdateContext} />
          <SynthesisSection text={r.synthesis} />
          {r.data && <DataSection label={r.data.label} rows={r.data.rows} note={r.data.note} />}
          {r.interactions && r.interactions.length > 0 && <InteractionsSection interactions={r.interactions} />}
          <IcdSection codes={r.icdCodes} />
          <ExportNote response={r} />
          <SourcesSection sources={r.sources} />
          <FollowUpSection questions={r.followUp} onAsk={onFollowUp} />
          <div className="px-3 py-3">
            <p className="text-[9px] text-muted-foreground/60 leading-relaxed font-mono">{DISCLAIMER}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Error — offer to start visit flow ─── */
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Show visit flow even on error — let them start fresh */}
      <div className="w-1/2 border-r border-border overflow-auto">
        <VisitFlow
          state={visit.state}
          onSetSex={visit.setSex}
          onSetAge={visit.setAge}
          onSetComplaint={visit.setComplaint}
          onToggleFinding={visit.toggleFinding}
          onToggleExam={visit.toggleExam}
          onAddCustomFinding={visit.addCustomFinding}
          onRemoveCustomFinding={visit.removeCustomFinding}
          onAddCustomExam={visit.addCustomExam}
          onRemoveCustomExam={visit.removeCustomExam}
          onReset={visit.reset}
        />
      </div>
      <div className="w-1/2 flex flex-col overflow-hidden bg-card">
        <div className="h-7 px-3 flex items-center border-b border-border shrink-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Output</span>
        </div>
        <LiveOutput state={visit.state} />
      </div>
    </div>
  );
}
