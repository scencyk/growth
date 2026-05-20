"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { cardiologist, products } from "@/lib/data";
import type { Placement } from "@/lib/types";

interface Props {
  cell: { day: number; hour: number } | null;
  placements: Placement[];
  onClose: () => void;
  onRemovePlacement: (id: string) => void;
}

export function TouchpointDetail({ cell, placements, onClose, onRemovePlacement }: Props) {
  const c = cardiologist;

  return (
    <AnimatePresence>
      {cell && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-panel border-t border-border shadow-2xl"
        >
          <Content cell={cell} placements={placements} onClose={onClose} onRemovePlacement={onRemovePlacement} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Content({
  cell,
  placements,
  onClose,
  onRemovePlacement,
}: {
  cell: { day: number; hour: number };
  placements: Placement[];
  onClose: () => void;
  onRemovePlacement: (id: string) => void;
}) {
  const c = cardiologist;
  const dayLabel = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"][cell.day];
  const uu = c.weeklyHeatmap[cell.day][cell.hour];
  const max = Math.max(...c.weeklyHeatmap.flat());
  const intensity = Math.round((uu / max) * 100);
  const placed = placements.filter((p) => p.day === cell.day && p.hour === cell.hour);

  // Recommended products for this touchpoint
  const recommended = products
    .map((p) => {
      let score = 0;
      const inBestHours = cell.hour >= p.bestHours[0] && cell.hour <= p.bestHours[1];
      const inBestDays = p.bestDays.includes(cell.day);
      if (inBestHours) score += 2;
      if (inBestDays) score += 2;
      return { product: p, score, inBestHours, inBestDays };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // Find signature label if matches
  const sig = c.signature.find((s) => s.day === cell.day && s.hour === cell.hour);

  return (
    <div className="px-6 py-3 max-w-[1800px] mx-auto max-h-[40vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">
            Touchpoint · {dayLabel} {cell.hour.toString().padStart(2, "0")}:00
          </div>
          <div className="text-xl font-semibold mt-0.5 flex items-baseline gap-3 flex-wrap">
            <span className="tabular-nums text-red-400">{uu} UU</span>
            <span className="text-sm text-muted font-normal">aktywnych kardiologów</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-panel-2 text-muted tabular-nums">{intensity}% peak</span>
            {sig && (
              <span className="text-xs text-orange-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {sig.label}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-panel-2 transition"
          aria-label="Zamknij"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted">Wpięte produkty ({placed.length})</div>
          {placed.length === 0 ? (
            <div className="text-sm text-muted/70 italic">
              Przeciągnij produkt z prawej kolumny w tę komórkę żeby zaplanować placement.
            </div>
          ) : (
            <div className="space-y-1.5">
              {placed.map((p) => {
                const prod = products.find((pr) => pr.id === p.productId);
                if (!prod) return null;
                return (
                  <motion.div
                    layout
                    key={p.id}
                    className="flex items-center justify-between gap-2 bg-panel-2 rounded-lg px-3 py-2 border border-border"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prod.color }} />
                      <div>
                        <div className="text-sm font-medium">{prod.name}</div>
                        <div className="text-[11px] text-muted">{prod.reach} · {prod.pricing}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemovePlacement(p.id)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-muted hover:text-red-300 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Pasują do tego touchpointu
          </div>
          {recommended.length === 0 ? (
            <div className="text-sm text-muted/70 italic">Brak silnych dopasowań w tej godzinie.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {recommended.map(({ product: prod, inBestHours, inBestDays }) => (
                <div key={prod.id} className="bg-panel-2 rounded-lg px-3 py-2 border border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: prod.color }} />
                    <span className="text-sm font-medium truncate">{prod.name}</span>
                  </div>
                  <div className="text-[10px] text-muted mt-0.5 flex gap-1.5">
                    {inBestHours && <span className="text-emerald-300">✓ godzina</span>}
                    {inBestDays && <span className="text-emerald-300">✓ dzień</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
