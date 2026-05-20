"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Sparkles } from "lucide-react";
import { cardiologist } from "@/lib/data";

interface Props {
  day: number;
  hour: number;
  onChange: (day: number, hour: number) => void;
}

const DAYS = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
const TOTAL_SLOTS = 7 * 24;
const SLOTS_PER_SEC = 1000 / 380;

export function TimeScrubber({ day, hour, onChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const c = cardiologist;
  const max = Math.max(...c.weeklyHeatmap.flat());
  const slot = day * 24 + hour;

  const progressRef = useRef<number>(slot);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const lastEmittedSlotRef = useRef<number>(slot);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!playing) {
      progressRef.current = slot;
      lastEmittedSlotRef.current = slot;
      if (playheadRef.current) {
        playheadRef.current.style.left = `${((slot + 0.5) / TOTAL_SLOTS) * 100}%`;
      }
    }
  }, [slot, playing]);

  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); return; }
    lastTsRef.current = 0;
    function tick(ts: number) {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const delta = Math.min(ts - lastTsRef.current, 100);
      lastTsRef.current = ts;
      progressRef.current = (progressRef.current + (delta / 1000) * SLOTS_PER_SEC) % TOTAL_SLOTS;
      if (playheadRef.current)
        playheadRef.current.style.left = `${((progressRef.current + 0.5) / TOTAL_SLOTS) * 100}%`;
      const newSlot = Math.floor(progressRef.current);
      if (newSlot !== lastEmittedSlotRef.current) {
        lastEmittedSlotRef.current = newSlot;
        onChangeRef.current(Math.floor(newSlot / 24), newSlot % 24);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const handlePointer = (e: React.PointerEvent) => {
    if (!railRef.current) return;
    const rect = railRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const idx = Math.min(TOTAL_SLOTS - 1, Math.floor((x / rect.width) * TOTAL_SLOTS));
    progressRef.current = idx;
    lastEmittedSlotRef.current = idx;
    if (playheadRef.current)
      playheadRef.current.style.left = `${((idx + 0.5) / TOTAL_SLOTS) * 100}%`;
    onChange(Math.floor(idx / 24), idx % 24);
  };

  const bars: { d: number; h: number; uu: number; intensity: number }[] = [];
  for (let d = 0; d < 7; d++)
    for (let h = 0; h < 24; h++) {
      const uu = c.weeklyHeatmap[d][h];
      bars.push({ d, h, uu, intensity: uu / max });
    }

  const currentUU = c.weeklyHeatmap[day][hour];
  const intensity = currentUU / max;
  const sig = c.signature.find((s) => s.day === day && s.hour === hour);

  return (
    <div style={{ background: "#FFFFFF", borderTop: "1px solid #E6E6E2", padding: "10px 16px 12px" }}>
      {/* Top row */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center justify-center rounded transition-colors"
            style={{
              width: 30, height: 30,
              background: "#FFFFFF",
              border: "1px solid #E6E6E2",
              color: "#3A3A38",
            }}
            title={playing ? "Pauza" : "Auto-play"}
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div>
            <div className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Punkt w tygodniu</div>
            <div className="text-sm font-semibold flex items-baseline gap-2" style={{ color: "#121212" }}>
              {DAYS[day]} {hour.toString().padStart(2, "0")}:00
              <span className="tabular-nums font-bold" style={{ color: "#ef4444" }}>{currentUU} UU</span>
              <span className="mono text-[10px] font-normal" style={{ color: "#9A9A93" }}>
                {Math.round(intensity * 100)}% peak
              </span>
            </div>
          </div>
        </div>

        {sig && (
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#D97706" }}>
            <Sparkles className="w-3 h-3" />
            {sig.label}
          </div>
        )}

        <div className="flex items-center gap-3 ml-auto mono text-[10px]" style={{ color: "#9A9A93" }}>
          {DAYS.map((d, i) => (
            <span key={d} style={{ color: i === day ? "#121212" : undefined, fontWeight: i === day ? 600 : 400 }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        onPointerDown={(e) => { (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); handlePointer(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) handlePointer(e); }}
        className="relative rounded overflow-hidden cursor-pointer select-none"
        style={{ height: 40, background: "#F6F6F4", border: "1px solid #E6E6E2" }}
      >
        {/* Day dividers */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${((i + 1) / 7) * 100}%`, background: "#E6E6E2" }}
          />
        ))}

        {/* Hour bars */}
        <div className="absolute inset-0 flex">
          {bars.map((b, idx) => {
            const isCurrent = b.d === day && b.h === hour;
            const isWorking = b.h >= 8 && b.h <= 22;
            const alpha = isWorking ? Math.max(0.12, b.intensity * 0.8) : Math.max(0.04, b.intensity * 0.3);
            return (
              <div
                key={idx}
                className={`flex-1 transition-colors ${isCurrent ? "outline outline-1 outline-red-400" : ""}`}
                style={{ backgroundColor: `rgba(239, 68, 68, ${alpha})` }}
                title={`${DAYS[b.d]} ${b.h.toString().padStart(2, "0")}:00 · ${b.uu} UU`}
              />
            );
          })}
        </div>

        {/* Playhead */}
        <div
          ref={playheadRef}
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            width: 2,
            background: "#111111",
            boxShadow: "0 0 6px rgba(0,0,0,0.3)",
            left: `${((slot + 0.5) / TOTAL_SLOTS) * 100}%`,
            willChange: "left",
          }}
        />
      </div>

      {/* Day labels */}
      <div className="flex justify-between mt-1 mono text-[9px]" style={{ color: "#9A9A93" }}>
        {DAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
}
