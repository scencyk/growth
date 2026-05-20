"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { nodeProducts, getNodeStats, type NodeProduct } from "@/lib/products";
import type { FeatureKey } from "@/lib/types";

const VIEW = { w: 1200, h: 760 };
const CX = 600, CY = 365;
const ORX = 275, ORY = 188; // elliptical orbit radii

const FORMAT_ABBR: Record<string, string> = {
  Display: "DSP", Native: "NAT", Content: "CTN",
  VOD: "VOD", Event: "EVT", Education: "EDU", Live: "LIV",
};

interface Entry {
  id: FeatureKey;
  product: NodeProduct;
  stats: ReturnType<typeof getNodeStats>;
  x: number;
  y: number;
  path: string; // SVG path from center → node
}

export function TouchpointGraph() {
  const [drugName, setDrugName] = useState("Twój lek");
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<FeatureKey | null>(null);

  // Pan + zoom — same pattern as FlowGraph
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const ptrRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);

  const applyTransform = () => {
    contentRef.current?.setAttribute(
      "transform",
      `translate(${panRef.current.x},${panRef.current.y}) scale(${scaleRef.current})`
    );
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      if (e.ctrlKey) {
        const svgX = (e.clientX - ctm.e) / ctm.a;
        const svgY = (e.clientY - ctm.f) / ctm.d;
        const factor = Math.exp(-e.deltaY * 0.012);
        const newScale = Math.max(0.2, Math.min(5, scaleRef.current * factor));
        const cx = (svgX - panRef.current.x) / scaleRef.current;
        const cy = (svgY - panRef.current.y) / scaleRef.current;
        panRef.current.x = svgX - cx * newScale;
        panRef.current.y = svgY - cy * newScale;
        scaleRef.current = newScale;
      } else {
        panRef.current.x -= e.deltaX / ctm.a;
        panRef.current.y -= e.deltaY / ctm.d;
      }
      applyTransform();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onPtrDown = (e: React.PointerEvent<SVGSVGElement>) => {
    ptrRef.current = { x: e.clientX, y: e.clientY };
    draggedRef.current = false;
  };
  const onPtrMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!ptrRef.current || !(e.buttons & 1)) return;
    if (!draggedRef.current && Math.hypot(e.clientX - ptrRef.current.x, e.clientY - ptrRef.current.y) > 6) {
      draggedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.cursor = "grabbing";
    }
    if (!draggedRef.current) return;
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    panRef.current.x += e.movementX / ctm.a;
    panRef.current.y += e.movementY / ctm.d;
    applyTransform();
  };
  const onPtrUp = (e: React.PointerEvent<SVGSVGElement>) => {
    ptrRef.current = null;
    e.currentTarget.style.cursor = "grab";
  };

  const entries: Entry[] = useMemo(() => {
    const all = Object.entries(nodeProducts) as [FeatureKey, NodeProduct][];
    return all.map(([id, product], i) => {
      const angle = (i / all.length) * Math.PI * 2 - Math.PI / 2;
      const x = CX + Math.cos(angle) * ORX;
      const y = CY + Math.sin(angle) * ORY;
      // Curved edge: slight perpendicular offset for visual interest
      const mx = (CX + x) / 2, my = (CY + y) / 2;
      const dx = x - CX, dy = y - CY;
      const len = Math.hypot(dx, dy) || 1;
      const curve = 0.12 * len;
      const cpx = mx + (-dy / len) * curve;
      const cpy = my + (dx / len) * curve;
      return {
        id, product,
        stats: getNodeStats(id),
        x, y,
        path: `M${CX},${CY} Q${cpx},${cpy} ${x},${y}`,
      };
    });
  }, []);

  const maxUU = useMemo(() => Math.max(...entries.map(e => e.stats?.uuPer90d ?? 1)), [entries]);
  const maxSes = useMemo(() => Math.max(...entries.map(e => e.stats?.sessionsPerWeek ?? 1)), [entries]);
  const selectedEntry = selected ? entries.find(e => e.id === selected) ?? null : null;

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg" style={{ background: "#FFFFFF", border: "1px solid #E6E6E2" }}>

      {/* Header */}
      <div className="absolute top-3 left-4 right-4 flex items-start justify-between z-10 pointer-events-none">
        <div>
          <div className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Mapa touchpointów · widok leku</div>
          <h2 className="text-base font-semibold mt-0.5" style={{ color: "#121212" }}>
            Gdzie{" "}
            <span style={{ color: "#D97706" }}>{drugName}</span>
            {" "}może towarzyszyć kardiologowi w serwisie
          </h2>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ cursor: "grab" }}
        onClick={() => { if (draggedRef.current) { draggedRef.current = false; return; } setSelected(null); }}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
      >
        <defs>
          <filter id="tpGlow">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="drugGlow">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="drugAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={contentRef}>
          {/* Background grid */}
          <g opacity="0.03">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={(i * VIEW.w) / 20} y1={0} x2={(i * VIEW.w) / 20} y2={VIEW.h} stroke="#000" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i * VIEW.h) / 12} x2={VIEW.w} y2={(i * VIEW.h) / 12} stroke="#000" strokeWidth="0.5" />
            ))}
          </g>

          {/* Orbit ellipse guide */}
          <ellipse cx={CX} cy={CY} rx={ORX} ry={ORY} fill="none" stroke="#E6E6E2" strokeWidth={0.8} strokeDasharray="4 6" />

          {/* Edges + particles */}
          {entries.map((tp, idx) => {
            const isSelected = selected === tp.id;
            const sesW = tp.stats ? tp.stats.sessionsPerWeek / maxSes : 0;
            const lw = 0.8 + sesW * 2.5;
            const opacity = selected ? (isSelected ? 0.65 : 0.06) : 0.18 + sesW * 0.22;
            return (
              <g key={tp.id}>
                <path d={tp.path} stroke={tp.product.color} strokeOpacity={opacity} strokeWidth={lw} fill="none" strokeLinecap="round" />
                <circle r={1.8 + sesW * 1.6} fill={tp.product.color} opacity={selected ? (isSelected ? 0.85 : 0.15) : 0.6}>
                  <animateMotion
                    dur={`${3.8 + (1 - sesW) * 3.8}s`}
                    repeatCount="indefinite"
                    path={tp.path}
                    begin={`${(idx * 0.45) % 7}s`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Touchpoint nodes */}
          {entries.map((tp) => {
            const uuN = tp.stats ? tp.stats.uuPer90d / maxUU : 0;
            const r = 24 + uuN * 20;
            const isSelected = selected === tp.id;
            const isDim = !!selected && !isSelected;
            const abbr = FORMAT_ABBR[tp.product.format] ?? tp.product.format.slice(0, 3).toUpperCase();

            return (
              <g
                key={tp.id}
                onClick={(e) => { e.stopPropagation(); if (draggedRef.current) return; setSelected(isSelected ? null : tp.id); }}
                style={{ cursor: "pointer", opacity: isDim ? 0.18 : 1, transition: "opacity 0.3s" }}
              >
                {isSelected && (
                  <motion.circle
                    cx={tp.x} cy={tp.y} r={r + 6}
                    fill="none" stroke={tp.product.color} strokeWidth={1.5}
                    animate={{ opacity: [0.35, 0.65, 0.35], r: [r + 4, r + 9, r + 4] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.circle
                  cx={tp.x} cy={tp.y} r={r}
                  fill={tp.product.color}
                  fillOpacity={isSelected ? 0.22 : 0.11}
                  stroke={tp.product.color}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  filter={isSelected ? "url(#tpGlow)" : undefined}
                  whileHover={{ scale: 1.07 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                {/* Format abbreviation */}
                <text
                  x={tp.x} y={tp.y + 4}
                  textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={tp.product.color}
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {abbr}
                </text>
                {/* Product name */}
                <text
                  x={tp.x} y={tp.y + r + 15}
                  textAnchor="middle" fontSize={10} fontWeight={isSelected ? 600 : 500}
                  fill={isSelected ? tp.product.color : "#3A3A38"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {tp.product.name.length > 22 ? tp.product.name.slice(0, 22) + "…" : tp.product.name}
                </text>
                {/* Reach */}
                <text
                  x={tp.x} y={tp.y + r + 27}
                  textAnchor="middle" fontSize={9} fill="#9A9A93"
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {tp.stats ? `${tp.stats.uuPer90d} UU · ${tp.product.avgMinutes} min` : "—"}
                </text>
              </g>
            );
          })}

          {/* Central drug node */}
          <g style={{ pointerEvents: "none" }}>
            <circle cx={CX} cy={CY} r={90} fill="url(#drugAura)" />
            <motion.circle
              cx={CX} cy={CY} r={58}
              fill="none" stroke="#fbbf24" strokeWidth={1}
              animate={{ r: [52, 70], opacity: [0.4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            />
            <circle cx={CX} cy={CY} r={48} fill="#fbbf24" fillOpacity={0.15} stroke="#fbbf24" strokeWidth={2} filter="url(#drugGlow)" />
            <circle cx={CX} cy={CY} r={30} fill="#fbbf24" fillOpacity={0.9} />
            {/* Rp symbol */}
            <text x={CX} y={CY + 7} textAnchor="middle" fontSize={18} fontWeight={800} fill="#78350F"
              fontFamily="Georgia, serif" style={{ userSelect: "none" }}>Rp</text>
            {/* Drug name */}
            <text x={CX} y={CY + 68} textAnchor="middle" fontSize={14} fontWeight={700} fill="#121212"
              style={{ userSelect: "none" }}>{drugName}</text>
            <text x={CX} y={CY + 84} textAnchor="middle" fontSize={8} fill="#9A9A93"
              fontFamily="'JetBrains Mono', monospace" style={{ userSelect: "none" }}>PRODUKT FARMACEUTYCZNY</text>
          </g>
        </g>
      </svg>

      {/* Selected touchpoint detail card */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            key={selectedEntry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute z-20"
            style={{ top: 60, right: 12, width: 284, background: "#FFFFFF", border: "1px solid #E6E6E2", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}
          >
            <div className="flex items-center gap-2 px-3" style={{ height: 30, borderBottom: "1px solid #EDEDE9", background: "#FAFAF8" }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selectedEntry.product.color }} />
              <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Touchpoint</span>
              <span className="text-[11px] font-semibold ml-1 truncate" style={{ color: "#121212" }}>{selectedEntry.product.name}</span>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="mono text-[9px] uppercase tracking-wider px-2 py-1 rounded" style={{ background: `${selectedEntry.product.color}18`, color: selectedEntry.product.color }}>
                  {selectedEntry.product.format}
                </span>
                <span className="text-[11px]" style={{ color: "#6E6E68" }}>~{selectedEntry.product.avgMinutes} min / kontakt</span>
              </div>
              {selectedEntry.stats && (
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "UU / 90d", value: selectedEntry.stats.uuPer90d.toLocaleString("pl-PL") },
                    { label: "Sesji / tydz.", value: selectedEntry.stats.sessionsPerWeek.toString() },
                    { label: "Min / tydz.", value: selectedEntry.stats.minutesPerWeek.toString() },
                  ].map(s => (
                    <div key={s.label} className="rounded py-1.5 px-2 text-center" style={{ background: "#F6F6F4", border: "1px solid #EDEDE9" }}>
                      <div className="mono text-[8px] uppercase tracking-wider" style={{ color: "#9A9A93" }}>{s.label}</div>
                      <div className="text-sm font-semibold tabular-nums" style={{ color: "#121212" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] leading-relaxed" style={{ color: "#6E6E68" }}>
                Format <strong style={{ color: "#3A3A38" }}>{selectedEntry.product.format}</strong> — kardiolog spędza tu ~{selectedEntry.product.avgMinutes} minut przy każdym kontakcie.
                {selectedEntry.stats && (
                  <> Tygodniowo to <strong style={{ color: "#3A3A38" }}>{selectedEntry.stats.sessionsPerWeek} sesji</strong> z Twoją marką wśród aktywnej kohorty.</>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drug name edit */}
      <div className="absolute z-20 pointer-events-auto" style={{ bottom: 12, right: 12 }}>
        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); setEditing(false); }} className="flex items-center gap-2">
            <input
              autoFocus
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              className="rounded px-2 py-1 text-sm outline-none"
              style={{ background: "#FFFFFF", border: "1px solid #E6E6E2", color: "#121212", width: 160 }}
            />
            <button type="submit" className="rounded px-2.5 py-1 text-xs font-medium" style={{ background: "#111111", color: "#fff" }}>OK</button>
          </form>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] mono uppercase tracking-wide"
            style={{ background: "#FAFAF8", border: "1px solid #E6E6E2", color: "#6E6E68" }}
          >
            <Pencil className="w-3 h-3" />
            Zmień nazwę leku
          </button>
        )}
      </div>
    </div>
  );
}
