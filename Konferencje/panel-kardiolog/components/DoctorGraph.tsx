"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { flowNodes, flowEdges, nodeColors, type FlowNode } from "@/lib/flow";
import { nodeProducts, getNodeStats } from "@/lib/products";
import { cardiologist } from "@/lib/data";
import type { FeatureKey } from "@/lib/types";

const VIEW = { w: 1200, h: 760 };
const CX = VIEW.w / 2;
const CY = VIEW.h / 2;

export function DoctorGraph() {
  const [drugName, setDrugName] = useState("Twój lek");
  const [editing, setEditing] = useState(false);
  const [activated, setActivated] = useState<FeatureKey[]>([]);

  // Pan + zoom — same pattern as FlowGraph / TouchpointGraph
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
        const cx2 = (svgX - panRef.current.x) / scaleRef.current;
        const cy2 = (svgY - panRef.current.y) / scaleRef.current;
        panRef.current.x = svgX - cx2 * newScale;
        panRef.current.y = svgY - cy2 * newScale;
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

  // All nodes except main-panel (replaced by doctor avatar)
  const nodes = useMemo(
    () => flowNodes.filter(n => n.id !== "main-panel").map(n => ({ ...n, vx: CX + n.x, vy: CY + n.y })),
    []
  );
  const byId = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
  const maxSessions = Math.max(...nodes.map(n => n.sessions));
  const maxWeight = Math.max(...flowEdges.map(e => e.weight));

  const activatedSet = useMemo(() => new Set(activated), [activated]);

  const toggleNode = (id: FeatureKey) => {
    if (!nodeProducts[id]) return;
    setActivated(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Build drug-to-doctor paths for activated nodes (direct arc toward center)
  const drugPaths = useMemo(() =>
    activated.map(id => {
      const n = byId.get(id);
      if (!n) return null;
      const mx = (n.vx + CX) / 2;
      const my = (n.vy + CY) / 2;
      const dx = CX - n.vx, dy = CY - n.vy;
      const len = Math.hypot(dx, dy) || 1;
      const cpx = mx + (-dy / len) * 40;
      const cpy = my + (dx / len) * 40;
      return { id, path: `M${n.vx},${n.vy} Q${cpx},${cpy} ${CX},${CY}`, color: nodeProducts[id]!.color };
    }).filter(Boolean) as { id: FeatureKey; path: string; color: string }[],
    [activated, byId]
  );

  const activatedCount = activated.length;
  const totalUU = useMemo(() => {
    const uus = activated.map(id => getNodeStats(id)?.uuPer90d ?? 0);
    return uus.length ? Math.max(...uus) : 0;
  }, [activated]);
  const totalSessions = useMemo(() =>
    activated.reduce((s, id) => s + (getNodeStats(id)?.sessionsPerWeek ?? 0), 0),
    [activated]
  );

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg" style={{ background: "#FFFFFF", border: "1px solid #E6E6E2" }}>

      {/* Header */}
      <div className="absolute top-3 left-4 right-4 flex items-start justify-between z-10 pointer-events-none">
        <div>
          <div className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>
            Widok lekarza · schemat tygodnia
          </div>
          <h2 className="text-base font-semibold mt-0.5" style={{ color: "#121212" }}>
            Gdzie{" "}
            <span style={{ color: "#D97706" }}>{drugName}</span>
            {" "}wchodzi w schemat pracy kardiologa
          </h2>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ cursor: "grab" }}
        onClick={() => { if (draggedRef.current) { draggedRef.current = false; return; } }}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
      >
        <defs>
          <filter id="dg-glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dg-doctor-glow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dg-amber-glow">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="dg-doctor-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
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

          {/* Flow edges */}
          {flowEdges.map((e, idx) => {
            const src = e.src === "main-panel" ? { vx: CX, vy: CY } : byId.get(e.src as FeatureKey);
            const dst = e.dst === "main-panel" ? { vx: CX, vy: CY } : byId.get(e.dst as FeatureKey);
            if (!src || !dst) return null;
            const w = 0.4 + (e.weight / maxWeight) * 3.5;
            const isHot = activatedSet.has(e.src as FeatureKey) || activatedSet.has(e.dst as FeatureKey);
            const opacity = activatedCount > 0 ? (isHot ? 0.55 : 0.06) : 0.18 + (e.weight / maxWeight) * 0.35;
            const mx = (src.vx + dst.vx) / 2, my = (src.vy + dst.vy) / 2;
            const dx = dst.vx - src.vx, dy = dst.vy - src.vy;
            const len = Math.hypot(dx, dy) || 1;
            const curve = 0.15 * len;
            const cpx = mx + (-dy / len) * curve;
            const cpy = my + (dx / len) * curve;
            const path = `M${src.vx},${src.vy} Q${cpx},${cpy} ${dst.vx},${dst.vy}`;
            return (
              <path key={idx} d={path} stroke={isHot ? "#fbbf24" : "#ef4444"} strokeOpacity={opacity} strokeWidth={w} fill="none" strokeLinecap="round" />
            );
          })}

          {/* Drug-to-doctor animated paths — appear when touchpoint activated */}
          {drugPaths.map((dp, idx) => (
            <g key={dp.id}>
              <path d={dp.path} stroke="#fbbf24" strokeWidth={1.5} strokeOpacity={0.35} fill="none" strokeDasharray="6 5" />
              {[0, 1].map(j => (
                <circle key={j} r={2.8} fill="#fbbf24" opacity={0.9} filter="url(#dg-amber-glow)">
                  <animateMotion
                    dur={`${1.8 + idx * 0.25}s`}
                    repeatCount="indefinite"
                    path={dp.path}
                    begin={`${(idx * 0.5 + j * 0.9) % 3}s`}
                  />
                </circle>
              ))}
            </g>
          ))}

          {/* Regular flow nodes */}
          {nodes.map(n => {
            const base = Math.sqrt(n.sessions / maxSessions);
            const r = 13 + base * 35;
            const color = nodeColors[n.category] ?? "#9A9A93";
            const hasProduct = !!nodeProducts[n.id as FeatureKey];
            const isActive = activatedSet.has(n.id as FeatureKey);
            const isDim = activatedCount > 0 && !isActive && !hasProduct;
            const labelSize = 10 + base * 3;

            return (
              <g
                key={n.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (draggedRef.current) return;
                  toggleNode(n.id as FeatureKey);
                }}
                style={{
                  cursor: hasProduct ? "pointer" : "default",
                  opacity: isDim ? 0.18 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                {/* Pulse for active nodes */}
                {isActive && (
                  <motion.circle
                    cx={n.vx} cy={n.vy} r={r + 4}
                    fill="#fbbf24" opacity={0}
                    animate={{ opacity: [0, 0.2, 0], r: [r + 2, r + r * 0.4, r + r * 0.55] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                {/* Dashed hint ring on touchpoint-capable nodes */}
                {hasProduct && !isActive && (
                  <circle cx={n.vx} cy={n.vy} r={r + 8} fill="none"
                    stroke="#fbbf24" strokeWidth={1} strokeDasharray="4 4" opacity={0.3} />
                )}

                {/* Active ring */}
                {isActive && (
                  <circle cx={n.vx} cy={n.vy} r={r + 10} fill="none"
                    stroke="#fbbf24" strokeWidth={2.5} opacity={0.8} filter="url(#dg-amber-glow)" />
                )}

                {/* Main circle */}
                <motion.circle
                  cx={n.vx} cy={n.vy} r={r}
                  fill={isActive ? "#fbbf24" : color}
                  fillOpacity={isActive ? 0.22 : 0.15}
                  stroke={isActive ? "#fbbf24" : color}
                  strokeWidth={isActive ? 2.5 : 1.2}
                  filter={isActive ? "url(#dg-glow)" : undefined}
                  whileHover={hasProduct ? { scale: 1.07 } : undefined}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <circle cx={n.vx} cy={n.vy} r={r * 0.42}
                  fill={isActive ? "#fbbf24" : color}
                  fillOpacity={isActive ? 0.85 : 0.55}
                />

                {/* Drug badge: ✓ + "LEK" when active */}
                {isActive && (
                  <g transform={`translate(${n.vx + r * 0.72},${n.vy - r * 0.72})`}>
                    <circle r={9} fill="#fbbf24" />
                    <text x={0} y={4} textAnchor="middle" fontSize={10} fontWeight={800} fill="#78350F" style={{ pointerEvents: "none" }}>✓</text>
                  </g>
                )}

                {/* Dot indicator: drug can be placed here */}
                {hasProduct && !isActive && (
                  <circle cx={n.vx + r * 0.72} cy={n.vy - r * 0.72} r={5}
                    fill="#fbbf24" fillOpacity={0.45} stroke="#fbbf24" strokeWidth={1} />
                )}

                {/* Label */}
                <text x={n.vx} y={n.vy + r + 14} textAnchor="middle" fontSize={labelSize}
                  fontWeight={isActive ? 600 : 500}
                  fill={isActive ? "#92400E" : "#3A3A38"}
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {n.label}
                </text>
                <text x={n.vx} y={n.vy + r + 14 + labelSize + 2} textAnchor="middle" fontSize={labelSize - 2}
                  fill="#9A9A93" style={{ pointerEvents: "none", userSelect: "none" }}>
                  {n.sessions.toLocaleString("pl-PL")} sesji
                </text>
              </g>
            );
          })}

          {/* Doctor avatar — center, on top */}
          <g style={{ pointerEvents: "none" }}>
            <circle cx={CX} cy={CY} r={100} fill="url(#dg-doctor-aura)" />
            {/* Breathing pulse */}
            <motion.circle cx={CX} cy={CY} r={54} fill="none" stroke="#ef4444" strokeWidth={1}
              animate={{ r: [50, 66], opacity: [0.35, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
            />
            {/* Background fill */}
            <circle cx={CX} cy={CY} r={46} fill="#FFFFFF" stroke="#ef4444" strokeWidth={2}
              filter="url(#dg-doctor-glow)" />
            <circle cx={CX} cy={CY} r={46} fill="#FEF2F2" stroke="#ef4444" strokeWidth={2} />
            {/* Inner accent */}
            <circle cx={CX} cy={CY} r={28} fill="#ef4444" fillOpacity={0.12} />
            {/* Stethoscope symbol — stylized text */}
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize={22} fontWeight={800} fill="#ef4444"
              fontFamily="Georgia, serif" style={{ userSelect: "none" }}>Dr.</text>
            <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444"
              style={{ userSelect: "none" }}>Kardio</text>
            {/* Cohort label */}
            <text x={CX} y={CY + 62} textAnchor="middle" fontSize={8} fill="#9A9A93"
              fontFamily="'JetBrains Mono', monospace" style={{ userSelect: "none" }}>
              {cardiologist.totalActive90d} aktywnych · kohorta 41
            </text>
          </g>
        </g>
      </svg>

      {/* Activated touchpoints summary card */}
      <AnimatePresence>
        {activatedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute z-20"
            style={{ top: 60, right: 12, width: 284, background: "#FFFFFF", border: "1px solid #E6E6E2", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}
          >
            <div className="flex items-center gap-2 px-3" style={{ height: 30, borderBottom: "1px solid #EDEDE9", background: "#FAFAF8" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#fbbf24" }} />
              <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Lek w schemacie</span>
              <span className="text-[11px] font-semibold ml-1" style={{ color: "#D97706" }}>{drugName}</span>
            </div>
            <div className="p-3 space-y-2">
              {/* Aggregate metrics */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "Touchpointy", value: String(activatedCount) },
                  { label: "Sesji / tydz.", value: String(totalSessions) },
                  { label: "Max UU", value: totalUU.toLocaleString("pl-PL") },
                ].map(s => (
                  <div key={s.label} className="rounded py-1.5 px-2 text-center" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <div className="mono text-[8px] uppercase tracking-wider" style={{ color: "#D97706" }}>{s.label}</div>
                    <div className="text-sm font-semibold tabular-nums" style={{ color: "#92400E" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* List of activated */}
              <div className="space-y-1.5">
                {activated.map(id => {
                  const product = nodeProducts[id]!;
                  const stats = getNodeStats(id);
                  return (
                    <div key={id} className="flex items-center justify-between gap-2 py-1"
                      style={{ borderBottom: "1px solid #EDEDE9" }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: product.color }} />
                        <span className="text-[11px] truncate" style={{ color: "#3A3A38" }}>{product.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="mono text-[9px]" style={{ color: "#9A9A93" }}>
                          {stats ? `${stats.sessionsPerWeek} sesji` : "—"}
                        </span>
                        <button
                          onClick={() => toggleNode(id)}
                          style={{ color: "#9A9A93" }}
                          className="pointer-events-auto"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" /><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drug name edit */}
      <div className="absolute z-20 pointer-events-auto" style={{ bottom: 12, right: 12 }}>
        {editing ? (
          <form onSubmit={(e) => { e.preventDefault(); setEditing(false); }} className="flex items-center gap-2">
            <input autoFocus value={drugName} onChange={e => setDrugName(e.target.value)}
              className="rounded px-2 py-1 text-sm outline-none"
              style={{ background: "#FFFFFF", border: "1px solid #E6E6E2", color: "#121212", width: 160 }} />
            <button type="submit" className="rounded px-2.5 py-1 text-xs font-medium"
              style={{ background: "#111111", color: "#fff" }}>OK</button>
          </form>
        ) : (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 mono uppercase tracking-wide"
            style={{ fontSize: 11, background: "#FAFAF8", border: "1px solid #E6E6E2", color: "#6E6E68" }}>
            <Pencil className="w-3 h-3" />
            Zmień nazwę leku
          </button>
        )}
      </div>
    </div>
  );
}
