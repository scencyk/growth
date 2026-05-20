"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cardiologist, products } from "@/lib/data";
import type { Placement } from "@/lib/types";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface Props {
  placements: Placement[];
  selected: { day: number; hour: number } | null;
  onSelect: (cell: { day: number; hour: number } | null) => void;
  onRemovePlacement: (id: string) => void;
}

export function WeeklyGraph({ placements, selected, onSelect, onRemovePlacement }: Props) {
  const c = cardiologist;
  const max = useMemo(() => Math.max(...c.weeklyHeatmap.flat()), [c.weeklyHeatmap]);

  return (
    <div className="bg-panel rounded-2xl border border-border p-6 flex-1 min-w-0">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">Tydzień kardiologa</div>
          <h2 className="text-xl font-semibold mt-1">
            Gdzie i kiedy jest aktywny <span className="text-red-400">— wpinaj produkty w timeline</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <Legend />
        </div>
      </div>

      {/* day totals bar above heatmap */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1 mb-2">
        <div />
        {c.dayLabels.map((d, i) => (
          <DayHeader key={d} label={d} total={c.dayTotals[i]} maxTotal={Math.max(...c.dayTotals)} day={i} />
        ))}
      </div>

      {/* heatmap */}
      <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1">
        {HOURS.map((h) => (
          <HourRow key={h} hour={h}>
            {c.dayLabels.map((_, day) => {
              const uu = c.weeklyHeatmap[day][h];
              const intensity = uu / max;
              const cellPlacements = placements.filter((p) => p.day === day && p.hour === h);
              return (
                <HeatCell
                  key={day}
                  day={day}
                  hour={h}
                  uu={uu}
                  intensity={intensity}
                  isSelected={selected?.day === day && selected?.hour === h}
                  onSelect={() => onSelect(selected?.day === day && selected?.hour === h ? null : { day, hour: h })}
                  placements={cellPlacements}
                  onRemovePlacement={onRemovePlacement}
                />
              );
            })}
          </HourRow>
        ))}
      </div>

      {/* Signature moments */}
      <div className="mt-5 pt-5 border-t border-border">
        <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-muted">
          <Sparkles className="w-3.5 h-3.5" /> Sygnaturowe momenty tygodnia
        </div>
        <div className="flex gap-2 flex-wrap">
          {c.signature.map((s) => {
            const isActive = selected?.day === s.day && selected?.hour === s.hour;
            return (
              <button
                key={s.label}
                onClick={() => onSelect(isActive ? null : { day: s.day, hour: s.hour })}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  isActive
                    ? "bg-red-500/20 border-red-500 text-red-200"
                    : "bg-panel-2 border-border text-muted hover:text-foreground hover:border-red-500/40"
                }`}
              >
                {s.label} · <span className="tabular-nums">{s.uu} UU</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayHeader({ label, total, maxTotal, day }: { label: string; total: number; maxTotal: number; day: number }) {
  const isWeekend = day >= 5;
  return (
    <div className="flex flex-col items-center pb-2">
      <div className={`text-xs font-medium ${isWeekend ? "text-orange-300" : "text-foreground"}`}>{label}</div>
      <div className="text-[10px] text-muted tabular-nums">{total} UU</div>
      <div className="w-full h-0.5 bg-panel-2 rounded overflow-hidden mt-1">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
          style={{ width: `${(total / maxTotal) * 100}%` }}
        />
      </div>
    </div>
  );
}

function HourRow({ hour, children }: { hour: number; children: React.ReactNode }) {
  const label = `${hour.toString().padStart(2, "0")}`;
  const isWorking = hour >= 8 && hour <= 18;
  return (
    <>
      <div className={`text-[10px] tabular-nums flex items-center justify-end pr-2 ${isWorking ? "text-foreground/70" : "text-muted/60"}`}>
        {label}
      </div>
      {children}
    </>
  );
}

function HeatCell({
  day,
  hour,
  uu,
  intensity,
  isSelected,
  onSelect,
  placements,
  onRemovePlacement,
}: {
  day: number;
  hour: number;
  uu: number;
  intensity: number;
  isSelected: boolean;
  onSelect: () => void;
  placements: Placement[];
  onRemovePlacement: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `cell-${day}-${hour}`, data: { day, hour } });

  // Non-linear scaling so mid-range hours are visible.
  // sqrt squashes high values, expands low — better contrast across heatmap.
  const scaled = Math.sqrt(intensity);
  // Two-stop gradient: cold blue → warm red. Hot cells get extra brightness.
  // Below ~0.35: muted dark blue tones; above: red ramp.
  let bg = "";
  if (scaled < 0.25) {
    // dead zone: dark panel with hint of red
    bg = `rgba(239, 68, 68, ${Math.max(0.04, scaled * 0.4)})`;
  } else if (scaled < 0.6) {
    // mid zone: orange tones
    const t = (scaled - 0.25) / 0.35;
    const r = Math.round(239);
    const g = Math.round(120 - 60 * t);
    const b = Math.round(80 - 50 * t);
    bg = `rgba(${r}, ${g}, ${b}, ${0.35 + 0.3 * t})`;
  } else {
    // hot zone: full red, increasing alpha
    bg = `rgba(239, 68, 68, ${0.65 + 0.3 * (scaled - 0.6) / 0.4})`;
  }
  const isHot = intensity > 0.7;
  const showNumber = scaled > 0.55 && placements.length === 0;

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      className={`relative h-6 md:h-7 rounded-md cursor-pointer transition-all group ${
        isSelected ? "ring-2 ring-red-400 z-10" : ""
      } ${isOver ? "ring-2 ring-emerald-400" : ""} ${isHot ? "hot-cell" : ""}`}
      style={{ backgroundColor: bg }}
      title={`${day}/${hour} · ${uu} UU`}
    >
      {showNumber && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/90 tabular-nums pointer-events-none">
          {uu}
        </div>
      )}
      {placements.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] p-0.5">
          {placements.slice(0, 4).map((p) => {
            const prod = products.find((pr) => pr.id === p.productId);
            if (!prod) return null;
            return (
              <motion.button
                key={p.id}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePlacement(p.id);
                }}
                className="w-2.5 h-2.5 rounded-full border border-white/60 cursor-pointer hover:scale-150 transition-transform shrink-0"
                style={{ backgroundColor: prod.color }}
                title={`${prod.name} — kliknij aby usunąć`}
              />
            );
          })}
          {placements.length > 4 && (
            <span className="text-[8px] font-bold text-white">+{placements.length - 4}</span>
          )}
        </div>
      )}
      {/* tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 border border-border text-[10px] whitespace-nowrap rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
        <span className="tabular-nums font-semibold">{uu}</span> UU
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-2">
      <span>UU/h:</span>
      <div className="flex items-center gap-0.5">
        {[0.05, 0.2, 0.4, 0.6, 0.85].map((a) => (
          <div
            key={a}
            className="w-4 h-4 rounded-sm border border-border/40"
            style={{ backgroundColor: `rgba(239, 68, 68, ${a})` }}
          />
        ))}
      </div>
      <span className="tabular-nums">0 → 75+</span>
    </div>
  );
}
