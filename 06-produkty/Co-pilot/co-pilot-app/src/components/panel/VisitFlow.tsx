"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, RotateCcw, Plus, X, Search, User, Stethoscope, MessageCircle, Activity } from "lucide-react";
import {
  type VisitState,
  type PatientSex,
  type CustomItem,
  type ExtraItem,
  COMPLAINTS,
  AGE_PRESETS,
  EXTRA_INTERVIEW_POOL,
  EXTRA_EXAM_POOL,
} from "@/lib/copilot/visit-flow";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const groupLabels: Record<string, string> = {
  wywiad: "Wywiad",
  czas: "Czas trwania",
  charakter: "Charakter",
  towarzyszące: "Objawy towarzyszące",
  przewlekłe: "Wywiad przeszły",
};

const categoryLabels: Record<string, string> = {
  symptom: "Objawy",
  history: "Wywiad",
  lifestyle: "Styl życia",
  exam: "Badanie",
};

/* ─── Searchable add-from-pool dropdown ─── */
function AddFromPool({
  pool,
  existingIds,
  onAdd,
  onClose,
  placeholder,
  anchorRef,
}: {
  pool: ExtraItem[];
  existingIds: Set<string>;
  onAdd: (item: ExtraItem) => void;
  onClose: () => void;
  placeholder: string;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 300 });

  useEffect(() => {
    inputRef.current?.focus();
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownH = 280;
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const flipUp = spaceBelow < dropdownH && rect.top > dropdownH;
      setPos({
        top: flipUp ? rect.top - dropdownH - 4 : rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 280),
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) &&
          anchorRef.current && !anchorRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  const lower = search.toLowerCase();
  const filtered = pool.filter(
    (item) => !existingIds.has(item.id) && item.label.toLowerCase().includes(lower)
  );

  const grouped = filtered.reduce<Record<string, ExtraItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleCustom = () => {
    if (!search.trim()) return;
    onAdd({
      id: `custom_${crypto.randomUUID().slice(0, 8)}`,
      label: search.trim(),
      signal: search.trim(),
      category: "symptom",
    });
    onClose();
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.1 }}
      className="fixed z-[100] border border-border bg-card shadow-xl flex flex-col max-h-[280px]"
      style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: Math.min(280, window.innerHeight - pos.top - 8) }}
    >
      {/* Search */}
      <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-border shrink-0">
        <Search className="size-3 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && filtered.length > 0) {
              onAdd(filtered[0]);
              onClose();
            } else if (e.key === "Enter" && search.trim()) {
              handleCustom();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
        />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <div className="px-2.5 pt-2 pb-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {categoryLabels[cat] || cat}
            </div>
            {items.map((item) => (
              <button
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onAdd(item);
                  onClose();
                }}
                className="w-full text-left px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {filtered.length === 0 && search.trim() && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleCustom();
            }}
            className="w-full text-left px-2.5 py-2 text-[11px] text-primary flex items-center gap-1.5"
          >
            <Plus className="size-3" />
            Dodaj &ldquo;{search.trim()}&rdquo;
          </button>
        )}

        {filtered.length === 0 && !search.trim() && (
          <div className="px-2.5 py-3 text-[10px] text-muted-foreground text-center">
            Wpisz aby wyszukać
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Removable custom chip ─── */
function CustomChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="inline-flex items-center gap-0.5 text-[10px] px-2 py-1 border border-primary/20 bg-primary/5 text-primary font-medium"
    >
      {label}
      <button onClick={onRemove} className="size-3.5 flex items-center justify-center hover:bg-primary/10 transition-colors">
        <X className="size-2.5" />
      </button>
    </motion.span>
  );
}

/* ─── Main ─── */
interface VisitFlowProps {
  state: VisitState;
  onSetSex: (sex: PatientSex) => void;
  onSetAge: (age: string) => void;
  onSetComplaint: (id: string) => void;
  onToggleFinding: (id: string) => void;
  onToggleExam: (id: string) => void;
  onAddCustomFinding: (item: CustomItem) => void;
  onRemoveCustomFinding: (id: string) => void;
  onAddCustomExam: (item: CustomItem) => void;
  onRemoveCustomExam: (id: string) => void;
  onReset: () => void;
}

export function VisitFlow({
  state,
  onSetSex,
  onSetAge,
  onSetComplaint,
  onToggleFinding,
  onToggleExam,
  onAddCustomFinding,
  onRemoveCustomFinding,
  onAddCustomExam,
  onRemoveCustomExam,
  onReset,
}: VisitFlowProps) {
  const complaint = COMPLAINTS.find((c) => c.id === state.complaintId);
  const [showInterviewPool, setShowInterviewPool] = useState(false);
  const [showExamPool, setShowExamPool] = useState(false);
  const interviewBtnRef = useRef<HTMLButtonElement>(null);
  const examBtnRef = useRef<HTMLButtonElement>(null);

  const groupedQuestions = complaint?.interviewQuestions.reduce<Record<string, typeof complaint.interviewQuestions>>((acc, q) => {
    if (!acc[q.group]) acc[q.group] = [];
    acc[q.group].push(q);
    return acc;
  }, {});

  // IDs already in use (to exclude from pool)
  const usedFindingIds = new Set([
    ...state.positiveFindings,
    ...state.customFindings.map((f) => f.id),
    ...(complaint?.interviewQuestions.map((q) => q.id) || []),
  ]);
  const usedExamIds = new Set([
    ...state.abnormalExam,
    ...state.customExams.map((e) => e.id),
    ...(complaint?.examSuggestions.map((e) => e.id) || []),
  ]);

  return (
    <div className="flex-1 overflow-auto">
      {/* ─── Pacjent ─── */}
      <div className="border-b border-border">
        <div className="px-3 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5"><User className="size-3.5 text-muted-foreground" />Pacjent</span>
          {state.sex && (
            <button onClick={onReset} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <RotateCcw className="size-2.5" />Od nowa
            </button>
          )}
        </div>
        <div className="px-3 pb-2 flex gap-1.5">
          {(["K", "M", "dziecko"] as PatientSex[]).map((sex) => (
            <motion.button key={sex} whileTap={{ scale: 0.95 }} onClick={() => onSetSex(sex)}
              className={cn("h-8 px-4 text-[12px] font-medium border transition-colors",
                state.sex === sex ? "border-primary bg-accent/20 text-primary" : "border-border text-foreground hover:border-foreground/20"
              )}>
              {sex === "K" ? "Kobieta" : sex === "M" ? "Mężczyzna" : "Dziecko"}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {state.sex && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15, ease: EASE }} className="overflow-hidden">
              <div className="px-3 pb-2">
                <div className="text-[9px] text-muted-foreground font-medium mb-1">Wiek</div>
                <div className="flex flex-wrap gap-1">
                  {AGE_PRESETS
                    .filter((a) => state.sex === "dziecko" ? ["0–1", "2–12", "13–17"].includes(a.range) : !["0–1", "2–12"].includes(a.range))
                    .map((p) => (
                      <button key={p.range} onClick={() => onSetAge(p.label)}
                        className={cn("text-[10px] px-2 py-1 border transition-colors",
                          state.age === p.label ? "border-primary bg-accent/20 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                        )}>
                        {p.label} <span className="text-muted-foreground ml-0.5">{p.range}</span>
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Po co przyszedł? ─── */}
      <AnimatePresence>
        {(state.stage === "complaint" || state.stage === "interview") && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.2, ease: EASE }} className="border-b border-border overflow-hidden">
            <div className="px-3 pt-2 pb-1">
              <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5"><Stethoscope className="size-3.5 text-muted-foreground" />Po co przyszedł?</span>
            </div>
            <div className="px-3 pb-2 grid grid-cols-2 gap-1">
              {COMPLAINTS.map((c) => (
                <motion.button key={c.id} whileTap={{ scale: 0.97 }} onClick={() => onSetComplaint(c.id)}
                  className={cn("flex items-center gap-2 px-2.5 py-2 text-left border transition-colors",
                    state.complaintId === c.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"
                  )}>
                  <span className={cn("text-[11px]", state.complaintId === c.id ? "text-primary font-medium" : "text-foreground")}>{c.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Wywiad ─── */}
      <AnimatePresence>
        {state.stage === "interview" && complaint && groupedQuestions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.2, ease: EASE }} className="overflow-hidden">
            <div className="border-b border-border">
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5"><MessageCircle className="size-3.5 text-muted-foreground" />Zapytaj pacjenta</span>
                <span className="text-[9px] text-muted-foreground">kliknij = patologia</span>
              </div>
              <div className="px-3 pb-2 space-y-2">
                {Object.entries(groupedQuestions).map(([group, questions]) => (
                  <div key={group}>
                    <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-1">{groupLabels[group] || group}</div>
                    <div className="flex flex-wrap gap-1">
                      {questions.map((q) => {
                        const isOn = state.positiveFindings.has(q.id);
                        return (
                          <motion.button key={q.id} whileTap={{ scale: 0.95 }} onClick={() => onToggleFinding(q.id)}
                            className={cn("text-[10px] px-2 py-1 border transition-all",
                              isOn ? "border-destructive/30 bg-destructive/8 text-destructive font-medium" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                            )}>
                            {q.question}
                            {isOn && <span className="text-[9px] opacity-70 ml-1">{q.positiveLabel}</span>}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom added findings */}
                {state.customFindings.length > 0 && (
                  <div>
                    <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Dodane</div>
                    <div className="flex flex-wrap gap-1">
                      <AnimatePresence initial={false}>
                        {state.customFindings.map((cf) => (
                          <CustomChip key={cf.id} label={cf.label} onRemove={() => onRemoveCustomFinding(cf.id)} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* + Add more */}
                <div>
                  <button
                    ref={interviewBtnRef}
                    onClick={() => setShowInterviewPool(!showInterviewPool)}
                    className={cn(
                      "flex items-center gap-1 text-[10px] px-2 py-1 border border-dashed transition-colors",
                      showInterviewPool
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                    )}
                  >
                    <Plus className="size-3" />
                    Więcej pytań
                  </button>
                  <AnimatePresence>
                    {showInterviewPool && (
                      <AddFromPool
                        pool={EXTRA_INTERVIEW_POOL}
                        existingIds={usedFindingIds}
                        onAdd={(item) => onAddCustomFinding({ id: item.id, label: item.label, signal: item.signal })}
                        onClose={() => setShowInterviewPool(false)}
                        placeholder="Szukaj objawu, wywiadu..."
                        anchorRef={interviewBtnRef}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ─── Badanie ─── */}
            <div className="border-b border-border">
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5"><Activity className="size-3.5 text-muted-foreground" />Badanie</span>
                <span className="text-[9px] text-muted-foreground">kliknij odchylenia</span>
              </div>
              <div className="px-3 pb-2 space-y-2">
                {complaint.examSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {complaint.examSuggestions.map((ex) => {
                      const isOn = state.abnormalExam.has(ex.id);
                      return (
                        <motion.button key={ex.id} whileTap={{ scale: 0.95 }} onClick={() => onToggleExam(ex.id)}
                          className={cn("flex items-center gap-1 text-[10px] px-2 py-1 border transition-all",
                            isOn
                              ? ex.severity === "warning" ? "border-destructive/30 bg-destructive/8 text-destructive font-medium" : "border-caution/30 bg-caution/8 text-caution font-medium"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                          )}>
                          {isOn && ex.severity === "warning" && <AlertTriangle className="size-2.5" />}
                          {ex.label}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Custom exam findings */}
                {state.customExams.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <AnimatePresence initial={false}>
                      {state.customExams.map((ce) => (
                        <CustomChip key={ce.id} label={ce.label} onRemove={() => onRemoveCustomExam(ce.id)} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* + Add exam */}
                <div>
                  <button
                    ref={examBtnRef}
                    onClick={() => setShowExamPool(!showExamPool)}
                    className={cn(
                      "flex items-center gap-1 text-[10px] px-2 py-1 border border-dashed transition-colors",
                      showExamPool
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                    )}
                  >
                    <Plus className="size-3" />
                    Więcej badań
                  </button>
                  <AnimatePresence>
                    {showExamPool && (
                      <AddFromPool
                        pool={EXTRA_EXAM_POOL}
                        existingIds={usedExamIds}
                        onAdd={(item) => onAddCustomExam({ id: item.id, label: item.label, signal: item.signal })}
                        onClose={() => setShowExamPool(false)}
                        placeholder="Szukaj badania..."
                        anchorRef={examBtnRef}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
