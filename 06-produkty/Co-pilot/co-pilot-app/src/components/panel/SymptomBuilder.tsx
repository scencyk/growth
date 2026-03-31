"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, ChevronRight } from "lucide-react";
import type { SymptomTag, TagCategory } from "@/lib/copilot/types";
import { searchSymptoms, getCategoryLabel, type SymptomEntry } from "@/lib/copilot/symptom-db";
import {
  EXAM_CATEGORIES,
  SYMPTOM_PRESETS,
  type ExamCategory,
  type ExamOption,
} from "@/lib/copilot/examination-db";
import { cn } from "@/lib/utils";

/* ─── Tag chip (removable) ─── */
function TagChip({
  tag,
  onRemove,
  onEditValue,
}: {
  tag: SymptomTag;
  onRemove: () => void;
  onEditValue?: (v: string) => void;
}) {
  const [editingValue, setEditingValue] = useState(false);
  const [draft, setDraft] = useState(tag.value || "");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingValue) { ref.current?.focus(); ref.current?.select(); }
  }, [editingValue]);

  const commit = () => {
    if (draft.trim()) onEditValue?.(draft.trim());
    setEditingValue(false);
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.1 }}
      className="inline-flex items-center gap-0.5 h-[26px] bg-muted border border-border rounded-sm pl-2 pr-0.5 text-[11px] text-foreground"
    >
      <span className="max-w-[180px] truncate">{tag.label}</span>

      {/* Editable parameter value */}
      {tag.category === "parameter" && onEditValue && (
        editingValue ? (
          <input
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setEditingValue(false);
            }}
            className="w-12 bg-transparent text-[11px] font-mono outline-none border-b border-primary/30 mx-0.5"
          />
        ) : (
          <button
            onClick={() => setEditingValue(true)}
            className={cn(
              "font-mono text-[11px] mx-0.5",
              tag.value ? "text-primary" : "text-muted-foreground"
            )}
          >
            {tag.value || "…"}
          </button>
        )
      )}

      <button
        onClick={onRemove}
        className="size-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
      >
        <X className="size-3" />
      </button>
    </motion.span>
  );
}

/* ─── Nested dropdown for exam categories ─── */
function ExamDropdown({
  category,
  onAdd,
  onClose,
}: {
  category: ExamCategory;
  onAdd: (label: string) => void;
  onClose: () => void;
}) {
  const [subMenu, setSubMenu] = useState<ExamOption | null>(null);
  const [customValue, setCustomValue] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={dropRef} className="absolute left-0 top-full mt-0.5 z-50 flex gap-0">
      {/* Main menu */}
      <div className="border border-border bg-card shadow-lg min-w-[180px] py-0.5">
        {/* Custom value input for parameters */}
        {category.hasValue && (
          <div className="px-2 py-1.5 border-b border-border">
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customValue.trim()) {
                    onAdd(`${category.label} ${customValue.trim()}${category.unit || ""}`);
                    onClose();
                  }
                }}
                placeholder={category.placeholder}
                autoFocus
                className="flex-1 bg-transparent text-[11px] outline-none min-w-0 font-mono"
              />
              <span className="text-[10px] text-muted-foreground shrink-0">{category.unit}</span>
            </div>
          </div>
        )}

        {category.options.map((opt) => (
          <button
            key={opt.label}
            onMouseEnter={() => opt.children ? setSubMenu(opt) : setSubMenu(null)}
            onClick={() => {
              if (!opt.children) {
                onAdd(
                  category.hasValue && customValue.trim()
                    ? `${category.label} ${customValue.trim()}${category.unit || ""}`
                    : `${category.label}: ${opt.label}`
                );
                onClose();
              }
            }}
            className="flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left"
          >
            <span>{opt.label}</span>
            {opt.children && <ChevronRight className="size-3 text-muted-foreground" />}
          </button>
        ))}
      </div>

      {/* Sub menu */}
      <AnimatePresence>
        {subMenu?.children && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.1 }}
            className="border border-border bg-card shadow-lg min-w-[160px] py-0.5"
          >
            {subMenu.children.map((child) => (
              <button
                key={child.label}
                onClick={() => {
                  onAdd(`${category.label}: ${subMenu.label} — ${child.label}`);
                  onClose();
                }}
                className="flex items-center gap-2 w-full px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left"
              >
                {child.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main SymptomBuilder ─── */
interface SymptomBuilderProps {
  tags: SymptomTag[];
  onAddTag: (tag: SymptomTag) => void;
  onRemoveTag: (tagId: string) => void;
  onUpdateTagValue: (tagId: string, value: string) => void;
}

export function SymptomBuilder({ tags, onAddTag, onRemoveTag, onUpdateTagValue }: SymptomBuilderProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SymptomEntry[]>([]);
  const [focused, setFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [activeExamCat, setActiveExamCat] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Symptom tags
  const symptomTags = tags.filter((t) => t.category === "symptom" || t.category === "demographic" || t.category === "condition" || t.category === "medication");
  // Exam findings
  const examTags = tags.filter((t) => t.category === "parameter");

  useEffect(() => {
    const existing = tags.map((t) => t.label);
    setResults(searchSymptoms(search, existing));
    setHighlightIdx(0);
  }, [search, tags]);

  const addEntry = useCallback((entry: SymptomEntry) => {
    onAddTag({ id: crypto.randomUUID(), label: entry.label, category: entry.category });
    setSearch("");
    inputRef.current?.focus();
  }, [onAddTag]);

  const addCustom = useCallback((label: string, category: TagCategory = "symptom") => {
    onAddTag({ id: crypto.randomUUID(), label, category });
    setSearch("");
    inputRef.current?.focus();
  }, [onAddTag]);

  const addExamFinding = useCallback((label: string) => {
    onAddTag({ id: crypto.randomUUID(), label, category: "parameter" });
  }, [onAddTag]);

  const addPreset = useCallback((label: string) => {
    const existing = tags.find((t) => t.label === label);
    if (!existing) {
      onAddTag({ id: crypto.randomUUID(), label, category: "symptom" });
    }
  }, [tags, onAddTag]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx((p) => Math.min(p + 1, results.length)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx < results.length) addEntry(results[highlightIdx]);
      else if (search.trim()) addCustom(search.trim());
    }
    else if (e.key === "Backspace" && !search && symptomTags.length > 0) {
      onRemoveTag(symptomTags[symptomTags.length - 1].id);
    }
    else if (e.key === "Escape") setFocused(false);
  };

  return (
    <div ref={containerRef}>
      {/* ═══ Wywiad (History) ═══ */}
      <div className="border-b border-border">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[13px] font-semibold text-foreground">Wywiad</span>
        </div>

        {/* Tag container — like Remedium input field with chips */}
        <div className="mx-3 mb-2 border border-border rounded-sm p-1.5 flex flex-wrap items-center gap-1 min-h-[34px]">
          <AnimatePresence initial={false}>
            {symptomTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} onRemove={() => onRemoveTag(tag.id)} />
            ))}
          </AnimatePresence>

          {/* Inline search */}
          <div className="relative flex-1 min-w-[100px]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder={symptomTags.length === 0 ? "Dodaj objaw..." : "Dodaj..."}
              className="w-full bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/50 outline-none h-[26px] px-1"
            />

            {/* Autocomplete */}
            <AnimatePresence>
              {focused && (results.length > 0 || search.trim()) && (
                <motion.div
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.08 }}
                  className="absolute left-0 top-full mt-1 z-40 border border-border bg-card shadow-lg min-w-[200px] max-h-[180px] overflow-auto"
                >
                  {results.map((entry, i) => (
                    <button
                      key={`${entry.label}-${entry.category}`}
                      onMouseDown={(e) => { e.preventDefault(); addEntry(entry); }}
                      onMouseEnter={() => setHighlightIdx(i)}
                      className={cn(
                        "flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] text-left transition-colors",
                        i === highlightIdx ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <span className="text-foreground">{entry.label}</span>
                      <span className="text-[9px] text-muted-foreground/50 uppercase">{getCategoryLabel(entry.category)}</span>
                    </button>
                  ))}
                  {search.trim() && (
                    <button
                      onMouseDown={(e) => { e.preventDefault(); addCustom(search.trim()); }}
                      className={cn(
                        "flex items-center gap-1.5 w-full px-2.5 py-1.5 text-[11px] text-primary border-t border-border transition-colors",
                        highlightIdx === results.length ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Plus className="size-3" />
                      Dodaj &ldquo;{search.trim()}&rdquo;
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add button */}
          <button
            onClick={() => inputRef.current?.focus()}
            className="size-6 flex items-center justify-center bg-primary text-primary-foreground rounded-sm shrink-0"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {/* Quick symptom presets */}
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {SYMPTOM_PRESETS.slice(0, 8).map((preset) => {
            const isAdded = tags.some((t) => t.label === preset);
            return (
              <button
                key={preset}
                onClick={() => addPreset(preset)}
                disabled={isAdded}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 transition-colors",
                  isAdded
                    ? "text-muted-foreground/30 line-through"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {preset} +
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Badanie (Examination) ═══ */}
      <div className="border-b border-border">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[13px] font-semibold text-foreground">Badanie</span>
        </div>

        {/* Exam findings tag container */}
        {examTags.length > 0 && (
          <div className="mx-3 mb-2 border border-border rounded-sm p-1.5 flex flex-wrap items-center gap-1 min-h-[34px]">
            <AnimatePresence initial={false}>
              {examTags.map((tag) => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  onRemove={() => onRemoveTag(tag.id)}
                  onEditValue={(v) => onUpdateTagValue(tag.id, v)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Category quick-add buttons with nested dropdowns */}
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {EXAM_CATEGORIES.map((cat) => (
            <div key={cat.label} className="relative">
              <button
                onClick={() => setActiveExamCat(activeExamCat === cat.label ? null : cat.label)}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 transition-colors",
                  activeExamCat === cat.label
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {cat.label} +
              </button>

              {activeExamCat === cat.label && (
                <ExamDropdown
                  category={cat}
                  onAdd={addExamFinding}
                  onClose={() => setActiveExamCat(null)}
                />
              )}
            </div>
          ))}

          {/* Generic add */}
          <button
            onClick={() => {
              const label = prompt("Dodaj wynik badania:");
              if (label?.trim()) addExamFinding(label.trim());
            }}
            className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground rounded-sm"
          >
            Dodaj +
          </button>
        </div>
      </div>
    </div>
  );
}
