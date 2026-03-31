"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import {
  findCatalogEntry,
  type DrugCatalogEntry,
  type DrugSelection,
} from "@/lib/copilot/drug-catalog";
import type { DrugSuggestion } from "@/lib/copilot/visit-flow";
import { cn } from "@/lib/utils";

interface DrugDialogProps {
  drug: DrugSuggestion;
  open: boolean;
  onClose: () => void;
  onSelect: (selection: DrugSelection) => void;
  currentSelection?: DrugSelection;
}

export function DrugDialog({ drug, open, onClose, onSelect, currentSelection }: DrugDialogProps) {
  const catalog = findCatalogEntry(drug.id);
  const [formId, setFormId] = useState<string>("");
  const [doseId, setDoseId] = useState<string>("");

  // Init from catalog or current selection
  useEffect(() => {
    if (!catalog || !open) return;
    const firstForm = catalog.forms[0];
    setFormId(firstForm?.id || "");
    setDoseId(firstForm?.doses[0]?.id || "");
  }, [catalog, open]);

  if (!open || !catalog) return null;

  const activeForm = catalog.forms.find((f) => f.id === formId) || catalog.forms[0];
  const activeDose = activeForm?.doses.find((d) => d.id === doseId) || activeForm?.doses[0];
  const packages = activeDose?.packages || [];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="fixed inset-0 z-50 bg-foreground/10"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="fixed left-1/2 top-[15vh] z-50 w-full max-w-md -translate-x-1/2 border border-border bg-card shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <div className="text-[13px] font-semibold text-foreground">{drug.name}</div>
            <div className="text-[10px] text-muted-foreground">{drug.dose}</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={catalog.chplUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              ChPL
              <ExternalLink className="size-2.5" />
            </a>
            <button onClick={onClose} className="size-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Form selector */}
        {catalog.forms.length > 1 && (
          <div className="px-4 pt-3 pb-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Postac</div>
            <div className="flex gap-1.5">
              {catalog.forms.map((form) => (
                <button
                  key={form.id}
                  onClick={() => {
                    setFormId(form.id);
                    setDoseId(form.doses[0]?.id || "");
                  }}
                  className={cn(
                    "px-3 py-1.5 text-[11px] border transition-colors",
                    form.id === formId
                      ? "border-primary bg-accent/20 text-primary font-medium"
                      : "border-border text-foreground hover:border-foreground/20"
                  )}
                >
                  {form.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dose selector */}
        {activeForm && activeForm.doses.length > 1 && (
          <div className="px-4 pt-2 pb-1">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Dawka</div>
            <div className="flex gap-1.5">
              {activeForm.doses.map((dose) => (
                <button
                  key={dose.id}
                  onClick={() => setDoseId(dose.id)}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-mono border transition-colors",
                    dose.id === doseId
                      ? "border-primary bg-accent/20 text-primary font-medium"
                      : "border-border text-foreground hover:border-foreground/20"
                  )}
                >
                  {dose.value}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Packages */}
        <div className="px-4 pt-2 pb-1">
          <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Opakowania
          </div>
        </div>

        <div className="max-h-[240px] overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${formId}-${doseId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {/* Table header */}
              <div className="flex items-center gap-2 px-4 py-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                <span className="flex-1">Preparat</span>
                <span className="w-16 text-right">Pełna</span>
                <span className="w-16 text-right">NFZ</span>
              </div>

              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    onSelect({
                      formLabel: activeForm?.label || "",
                      doseValue: activeDose?.value || "",
                      packageSize: pkg.size,
                      tradeName: pkg.tradeName,
                      manufacturer: pkg.manufacturer,
                      priceGross: pkg.priceGross,
                      priceRefunded: pkg.priceRefunded,
                      refundLevel: pkg.refundLevel,
                    });
                    onClose();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-left border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-foreground">{pkg.tradeName}</div>
                    <div className="text-[9px] text-muted-foreground">
                      {pkg.manufacturer} / {pkg.size}
                    </div>
                  </div>
                  <div className="w-16 text-right text-[11px] font-mono tabular-nums text-foreground">
                    {pkg.priceGross.toFixed(2)} zł
                  </div>
                  <div className="w-16 text-right">
                    {pkg.priceRefunded !== null ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono tabular-nums text-ok font-medium">
                        {pkg.priceRefunded.toFixed(2)} zł
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Refund info */}
        {packages.some((p) => p.priceRefunded !== null) && (
          <div className="px-4 py-2 border-t border-border">
            <div className="text-[9px] text-muted-foreground">
              NFZ = cena po refundacji. Kliknij aby wybrać.
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
