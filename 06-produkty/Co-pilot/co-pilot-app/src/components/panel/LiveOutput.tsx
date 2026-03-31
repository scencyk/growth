"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, ChevronRight, X, Pencil, AlertTriangle, ExternalLink, FileText, Lightbulb, Pill, Hash, FileDown } from "lucide-react";
import {
  type VisitState,
  type DrugSuggestion,
  COMPLAINTS,
  getActiveDrugs,
  buildVisitNote,
} from "@/lib/copilot/visit-flow";
import { findCatalogEntry, type DrugSelection } from "@/lib/copilot/drug-catalog";
import { DrugDialog } from "./DrugDialog";
import { cn } from "@/lib/utils";

/* ─── Collapsible section ─── */
function Sec({ title, icon: Icon, badge, children, defaultOpen = true }: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full h-7 px-3 flex items-center gap-1.5 text-left hover:bg-muted/40 transition-colors">
        <ChevronRight className={cn("size-2.5 text-muted-foreground transition-transform duration-100", open && "rotate-90")} />
        {Icon && <Icon className="size-3 text-muted-foreground" />}
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{title}</span>
        {badge && <span className="ml-auto">{badge}</span>}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.12 }} className="overflow-hidden">
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Editable drug row ─── */
function DrugRow({ drug, onRemove, onEditDose, selection, onSelectProduct }: {
  drug: DrugSuggestion;
  onRemove: () => void;
  onEditDose: (dose: string) => void;
  selection?: DrugSelection;
  onSelectProduct: (sel: DrugSelection) => void;
}) {
  const [editingDose, setEditingDose] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dose, setDose] = useState(drug.dose);
  const ref = useRef<HTMLInputElement>(null);
  const catalog = findCatalogEntry(drug.id);

  useEffect(() => setDose(drug.dose), [drug.dose]);
  useEffect(() => { if (editingDose) { ref.current?.focus(); ref.current?.select(); } }, [editingDose]);

  const commit = () => {
    if (dose.trim()) onEditDose(dose.trim());
    setEditingDose(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
      className="px-3 py-2 group hover:bg-muted/30 transition-colors"
    >
      {/* Name + ChPL + remove */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => catalog && setDialogOpen(true)}
          className={cn(
            "text-[11px] font-medium text-left",
            catalog ? "text-foreground hover:text-primary cursor-pointer underline-offset-2 hover:underline" : "text-foreground"
          )}
        >
          {drug.name}
        </button>
        {catalog && (
          <a
            href={catalog.chplUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary border border-border px-1 py-px transition-colors shrink-0"
            title="Charakterystyka Produktu Leczniczego"
          >
            ChPL
          </a>
        )}
        <button onClick={onRemove} className="size-4 flex items-center justify-center text-transparent group-hover:text-muted-foreground hover:!text-destructive transition-colors shrink-0 ml-auto">
          <X className="size-2.5" />
        </button>
      </div>

      {/* Selected product info */}
      {selection ? (
        <div className="mt-1 space-y-0.5">
          <div className="text-[10px] text-foreground">
            <span className="font-medium">{selection.tradeName}</span>
            <span className="text-muted-foreground"> {selection.doseValue} / {selection.formLabel} / {selection.packageSize}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">{selection.manufacturer}</div>
          <div className="flex items-center gap-2 text-[10px] font-mono tabular-nums">
            <span className="text-foreground">{selection.priceGross.toFixed(2)} zl</span>
            {selection.priceRefunded !== null && (
              <span className="text-ok font-medium">
                NFZ {selection.priceRefunded.toFixed(2)} zl
                {selection.refundLevel && <span className="text-[8px] ml-0.5">({selection.refundLevel})</span>}
              </span>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Dose — editable */}
          {editingDose ? (
            <input
              ref={ref}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditingDose(false); }}
              className="w-full text-[10px] font-mono text-foreground bg-transparent border-b border-primary/30 outline-none mt-0.5"
            />
          ) : (
            <div
              onClick={() => setEditingDose(true)}
              className="text-[10px] font-mono text-foreground/80 mt-0.5 cursor-text"
            >
              {dose}
              <Pencil className="inline size-2 ml-1 text-transparent group-hover:text-muted-foreground/70 transition-colors" />
            </div>
          )}
        </>
      )}

      {drug.note && (
        <div className="text-[9px] text-muted-foreground mt-0.5">{drug.note}</div>
      )}
      {drug.alternatives && drug.alternatives.length > 0 && (
        <div className="text-[9px] text-muted-foreground mt-0.5">
          Alternatywy: {drug.alternatives.join(" / ")}
        </div>
      )}

      {/* Drug catalog dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <DrugDialog
            drug={drug}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSelect={onSelectProduct}
            currentSelection={selection}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main LiveOutput ─── */
interface LiveOutputProps {
  state: VisitState;
}

export function LiveOutput({ state }: LiveOutputProps) {
  const complaint = COMPLAINTS.find((c) => c.id === state.complaintId);
  const activeDrugs = useMemo(() => getActiveDrugs(state), [state]);
  const [removedDrugs, setRemovedDrugs] = useState<Set<string>>(new Set());
  const [editedDoses, setEditedDoses] = useState<Map<string, string>>(new Map());
  const [drugSelections, setDrugSelections] = useState<Map<string, DrugSelection>>(new Map());
  const [copied, setCopied] = useState(false);
  const [notePreview, setNotePreview] = useState(false);

  // Reset removed/edited when complaint changes
  useEffect(() => {
    setRemovedDrugs(new Set());
    setEditedDoses(new Map());
    setDrugSelections(new Map());
  }, [state.complaintId]);

  const visibleDrugs = activeDrugs.filter((d) => !removedDrugs.has(d.id));
  const note = useMemo(() => buildVisitNote(state, removedDrugs, editedDoses), [state, removedDrugs, editedDoses]);

  const handleCopy = () => {
    navigator.clipboard.writeText(note).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const signals = (state.sex ? 1 : 0) + (state.age ? 1 : 0) + (state.complaintId ? 1 : 0) + state.positiveFindings.size + state.abnormalExam.size;

  // Empty state — before complaint selection
  if (!complaint) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <div className="size-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="size-2 bg-muted-foreground/30 rounded-full" />
          </div>
          <p className="text-[12px] text-muted-foreground">
            Wybierz pacjenta i powód wizyty
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Zalecenia pojawią się tutaj w czasie rzeczywistym
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Signal strength */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-300",
                  i < Math.min(signals, 5) ? "bg-accent h-3" : "bg-border h-2"
                )}
              />
            ))}
          </div>
          <span className="text-[9px] text-muted-foreground">
            {signals < 3 ? "Mało danych" : signals < 6 ? "Dobry obraz" : "Precyzyjny obraz"}
          </span>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">
          {signals} sygnałów
        </span>
      </div>

      {/* Live description — grows with every click */}
      <Sec title="Opis" icon={FileText}>
        <div className="px-3">
          <p className="text-[11px] text-foreground leading-[1.7] whitespace-pre-line">
            {[
              // Demographics
              state.sex === "K" ? "Pacjentka" : state.sex === "M" ? "Pacjent" : state.sex === "dziecko" ? "Dziecko" : null,
              state.age ? `${state.age.toLowerCase()}.` : null,
              // Complaint
              complaint ? `Zgłasza się z powodu: ${complaint.label.toLowerCase()}.` : null,
              // Interview findings as sentences
              ...complaint.interviewQuestions
                .filter((q) => state.positiveFindings.has(q.id))
                .map((q) => `${q.signal}.`),
              // Custom findings
              ...state.customFindings.map((f) => `${f.signal}.`),
              // Exam
              ...(complaint.examSuggestions.filter((e) => state.abnormalExam.has(e.id)).length > 0
                ? [`W badaniu fizykalnym: ${complaint.examSuggestions.filter((e) => state.abnormalExam.has(e.id)).map((e) => e.finding.toLowerCase()).join(", ")}.`]
                : []),
              // Custom exams
              ...(state.customExams.length > 0
                ? [state.customExams.map((e) => e.signal).join(", ") + "."]
                : []),
            ]
              .filter(Boolean)
              .join(" ")}
          </p>
        </div>
      </Sec>

      {/* Recommendation */}
      <Sec title="Zalecenia" icon={Lightbulb}>
        <div className="px-3">
          <p className="text-[11px] text-foreground leading-[1.6]">
            {complaint.baseRecommendation}
          </p>
          {/* Warnings from findings */}
          {complaint.examSuggestions
            .filter((e) => state.abnormalExam.has(e.id) && e.severity === "warning")
            .map((e) => (
              <div key={e.id} className="flex items-start gap-1.5 mt-1.5 text-[10px] text-destructive">
                <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                <span>{e.finding}</span>
              </div>
            ))}
        </div>
      </Sec>

      {/* Drugs */}
      {visibleDrugs.length > 0 && (
        <Sec
          title="Recepta"
          icon={Pill}
          badge={<span className="text-[9px] font-mono text-muted-foreground">{visibleDrugs.length}</span>}
        >
          <AnimatePresence initial={false}>
            {visibleDrugs.map((drug) => (
              <DrugRow
                key={drug.id}
                drug={{ ...drug, dose: editedDoses.get(drug.id) || drug.dose }}
                onRemove={() => setRemovedDrugs((s) => new Set([...s, drug.id]))}
                onEditDose={(d) => setEditedDoses((m) => new Map(m).set(drug.id, d))}
                selection={drugSelections.get(drug.id)}
                onSelectProduct={(sel) => setDrugSelections((m) => new Map(m).set(drug.id, sel))}
              />
            ))}
          </AnimatePresence>
        </Sec>
      )}

      {/* ICD-10 */}
      <Sec title="ICD-10" icon={Hash}>
        <div className="px-3 space-y-0">
          {complaint.icdHints.map((hint, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-[3px] text-[10px] group cursor-pointer hover:bg-muted/30 -mx-3 px-3 transition-colors"
            >
              <span className="text-foreground">{hint}</span>
              <CopyBtn text={hint.split(" — ")[0]} />
            </div>
          ))}
        </div>
      </Sec>

      {/* Export */}
      <Sec title="Dokumentacja" icon={FileDown} defaultOpen={false}>
        <div className="px-3 space-y-1.5">
          <div className="flex gap-1.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={cn(
                "flex-1 h-7 flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors",
                copied ? "bg-ok/10 text-ok border border-ok/20" : "bg-primary text-primary-foreground"
              )}
            >
              {copied ? <><Check className="size-3" />Skopiowano</> : <><Copy className="size-3" />Kopiuj opis</>}
            </motion.button>
            <button
              onClick={() => setNotePreview(!notePreview)}
              className={cn(
                "h-7 px-2 flex items-center gap-1 text-[10px] border transition-colors",
                notePreview ? "border-primary/20 text-primary bg-primary/5" : "border-border text-muted-foreground"
              )}
            >
              Podgląd
            </button>
          </div>
          <AnimatePresence>
            {notePreview && (
              <motion.pre
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden text-[9px] font-mono text-foreground leading-[1.6] bg-muted/30 border border-border p-2 whitespace-pre-wrap max-h-[250px] overflow-auto"
              >
                {note}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      </Sec>
    </div>
  );
}

/* ─── Tiny copy button ─── */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        });
      }}
      className="shrink-0 text-transparent group-hover:text-muted-foreground transition-colors"
    >
      {ok ? <Check className="size-3 text-ok" /> : <Copy className="size-3" />}
    </button>
  );
}
