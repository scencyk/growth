"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, ChevronDown, Pencil } from "lucide-react";
import type { CoPilotResponse, PatientContext } from "@/lib/copilot/types";
import { Section } from "../Section";
import { cn } from "@/lib/utils";

/* ─── Plain-text note builder ─── */
function buildNote(r: CoPilotResponse, ctx?: PatientContext): string {
  const lines: string[] = [];
  const date = new Date().toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Header
  lines.push(`OPIS WIZYTY — ${date}`);
  lines.push("─".repeat(40));

  // Patient
  if (ctx) {
    const parts: string[] = [];
    if (ctx.sex) parts.push(ctx.sex);
    if (ctx.age) parts.push(ctx.age);
    if (parts.length) lines.push(`Pacjent: ${parts.join(", ")}`);

    if (ctx.conditions?.length) lines.push(`Rozpoznania: ${ctx.conditions.join(", ")}`);
    if (ctx.symptoms?.length) lines.push(`Objawy: ${ctx.symptoms.join(", ")}`);
    if (ctx.medications?.length) lines.push(`Leki dotychczasowe: ${ctx.medications.join(", ")}`);
    if (ctx.parameters?.length) {
      lines.push(`Parametry: ${ctx.parameters.map((p) => `${p.key} ${p.value}`).join(", ")}`);
    }
    lines.push("");
  }

  // ICD
  if (r.icdCodes.length) {
    lines.push("Rozpoznanie (ICD-10):");
    r.icdCodes.forEach((c) => lines.push(`  ${c.code} — ${c.label}`));
    lines.push("");
  }

  // Synthesis
  lines.push("Opis:");
  lines.push(r.synthesis);
  lines.push("");

  // Data / recommendations
  if (r.data) {
    lines.push(`${r.data.label}:`);
    r.data.rows.forEach((row) => {
      lines.push(`  ${row.key}: ${row.value}`);
    });
    if (r.data.note) lines.push(`  Uwaga: ${r.data.note}`);
    lines.push("");
  }

  // Interactions
  if (r.interactions?.length) {
    lines.push("Interakcje:");
    r.interactions.forEach((ix) => {
      const status = ix.status === "safe" ? "OK" : ix.status === "caution" ? "UWAGA" : "STOP";
      lines.push(`  [${status}] ${ix.drug} — ${ix.note}`);
    });
    lines.push("");
  }

  // Zalecenia
  lines.push("Zalecenia:");
  if (r.data?.rows) {
    const highlights = r.data.rows.filter((row) => row.highlight);
    highlights.forEach((row) => lines.push(`  • ${row.key}: ${row.value}`));
  }
  if (r.interactions?.some((ix) => ix.status === "caution" || ix.status === "danger")) {
    r.interactions
      .filter((ix) => ix.status !== "safe")
      .forEach((ix) => lines.push(`  • ${ix.note}`));
  }
  lines.push("");

  lines.push("─".repeat(40));
  lines.push("Wygenerowano z Co-Pilot AI / Remedium.md");

  return lines.join("\n");
}

interface ExportNoteProps {
  response: CoPilotResponse;
}

export function ExportNote({ response }: ExportNoteProps) {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const generated = useMemo(
    () => buildNote(response, response.context),
    [response]
  );
  const [draft, setDraft] = useState(generated);

  // Sync when response changes
  useMemo(() => setDraft(generated), [generated]);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Section label="Opis wizyty">
      <div className="px-3 space-y-1.5">
        {/* Actions row */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={cn(
              "flex-1 h-7 flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors",
              copied
                ? "bg-ok/10 text-ok border border-ok/20"
                : "bg-primary text-primary-foreground"
            )}
          >
            {copied ? (
              <>
                <Check className="size-3" />
                Skopiowano
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Kopiuj do systemu
              </>
            )}
          </motion.button>

          <button
            onClick={() => { setPreview(!preview); setEditMode(false); }}
            className={cn(
              "h-7 px-2 flex items-center gap-1 text-[10px] border transition-colors",
              preview
                ? "border-primary/20 text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronDown className={cn("size-2.5 transition-transform", preview && "rotate-180")} />
            Podgląd
          </button>

          <button
            onClick={() => { setEditMode(!editMode); setPreview(true); }}
            className={cn(
              "h-7 px-2 flex items-center gap-1 text-[10px] border transition-colors",
              editMode
                ? "border-primary/20 text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Pencil className="size-2.5" />
            Edytuj
          </button>
        </div>

        {/* Preview / Edit */}
        <AnimatePresence initial={false}>
          {preview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {editMode ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full min-h-[200px] bg-muted/30 border border-border p-2 text-[10px] font-mono text-foreground leading-[1.6] resize-y focus:outline-none focus:border-primary/30"
                />
              ) : (
                <pre className="w-full bg-muted/30 border border-border p-2 text-[10px] font-mono text-foreground/80 leading-[1.6] whitespace-pre-wrap overflow-auto max-h-[300px]">
                  {draft}
                </pre>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
