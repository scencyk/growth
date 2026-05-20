"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Lucide from "lucide-react";
import { flowNodes, flowEdges, nodeColors, type FlowNode } from "@/lib/flow";
import { nodeProducts } from "@/lib/products";
import { cardiologist } from "@/lib/data";
import type { FeatureKey } from "@/lib/types";

interface Props {
  selectedNode: FeatureKey | null;
  onSelectNode: (id: FeatureKey | null) => void;
  currentDay: number;
  currentHour: number;
  mode: "flow" | "campaign";
  activeNodes: FeatureKey[];
  onToggleNode: (id: FeatureKey) => void;
}

const VIEW = { w: 1200, h: 760, padX: 100, padY: 60 };

export function FlowGraph({
  selectedNode,
  onSelectNode,
  currentDay,
  currentHour,
  mode,
  activeNodes,
  onToggleNode,
}: Props) {
  const totalUUAtTime = cardiologist.weeklyHeatmap[currentDay][currentHour];
  const maxUUAnyTime = Math.max(...cardiologist.weeklyHeatmap.flat());
  const timeActivity = totalUUAtTime / maxUUAnyTime;

  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2;
  const positioned = useMemo(
    () => flowNodes.map((n) => ({ ...n, vx: cx + n.x, vy: cy + n.y })),
    [cx, cy]
  );
  const byId = useMemo(() => new Map(positioned.map((n) => [n.id, n])), [positioned]);

  const maxSessions = Math.max(...flowNodes.map((n) => n.sessions));
  const maxWeight = Math.max(...flowEdges.map((e) => e.weight));

  const connected = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const s = new Set<string>([selectedNode]);
    flowEdges.forEach((e) => {
      if (e.src === selectedNode) s.add(e.dst);
      if (e.dst === selectedNode) s.add(e.src);
    });
    return s;
  }, [selectedNode]);

  const activeSet = useMemo(() => new Set(activeNodes), [activeNodes]);

  // Pan + zoom state — direct DOM writes, no React re-renders
  const svgRef = useRef<SVGSVGElement>(null);
  const contentGroupRef = useRef<SVGGElement>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);

  const applyTransform = () => {
    contentGroupRef.current?.setAttribute(
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
        // Pinch → zoom towards cursor
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
        // Two-finger scroll → pan
        panRef.current.x -= e.deltaX / ctm.a;
        panRef.current.y -= e.deltaY / ctm.d;
      }
      applyTransform();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSvgPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // setPointerCapture is deferred to pointermove — calling it here would redirect
    // click events to the SVG, breaking node selection
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  };

  const onSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointerDownRef.current || !(e.buttons & 1)) return;
    const dist = Math.hypot(e.clientX - pointerDownRef.current.x, e.clientY - pointerDownRef.current.y);
    if (!hasDraggedRef.current && dist > 6) {
      hasDraggedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.style.cursor = "grabbing";
    }
    if (!hasDraggedRef.current) return;
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    panRef.current.x += e.movementX / ctm.a;
    panRef.current.y += e.movementY / ctm.d;
    applyTransform();
  };

  const onSvgPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointerDownRef.current = null;
    e.currentTarget.style.cursor = "grab";
  };

  const onSvgClick = () => {
    if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
    onSelectNode(null);
  };

  const subtitle =
    mode === "campaign"
      ? "Kliknij węzeł aby odblokować touchpoint — węzły z produktem są oznaczone"
      : "węzły = sekcje, połączenia = przejścia w sesji";

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg" style={{ background: "#FFFFFF", border: "1px solid #E6E6E2" }}>
      <div className="absolute top-3 left-4 right-4 flex items-start justify-between gap-4 z-10 pointer-events-none">
        <div>
          <div className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Mapa przepływu kardiologa</div>
          <h2 className="text-base font-semibold mt-0.5" style={{ color: "#121212" }}>
            Co robi w serwisie{" "}
            <span style={{ color: mode === "campaign" ? "#D97706" : "#ef4444" }}>
              — {subtitle}
            </span>
          </h2>
        </div>
        <Legend />
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ cursor: "grab" }}
        onClick={onSvgClick}
        onPointerDown={onSvgPointerDown}
        onPointerMove={onSvgPointerMove}
        onPointerUp={onSvgPointerUp}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowAmber">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g ref={contentGroupRef}>
        {/* Background grid */}
        <g opacity="0.04">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={(i * VIEW.w) / 20} y1={0} x2={(i * VIEW.w) / 20} y2={VIEW.h} stroke="#000" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={(i * VIEW.h) / 12} x2={VIEW.w} y2={(i * VIEW.h) / 12} stroke="#000" strokeWidth="0.5" />
          ))}
        </g>

        {/* Edges */}
        <g>
          {flowEdges.map((e, idx) => {
            const a = byId.get(e.src);
            const b = byId.get(e.dst);
            if (!a || !b) return null;

            const bothActive = activeSet.has(e.src as FeatureKey) && activeSet.has(e.dst as FeatureKey);
            const isActive = !selectedNode || e.src === selectedNode || e.dst === selectedNode;
            const w = 0.4 + (e.weight / maxWeight) * 4;
            const opacity = selectedNode
              ? isActive ? 0.9 : 0.05
              : bothActive
              ? 0 // rendered separately below
              : 0.25 + (e.weight / maxWeight) * 0.5;

            const mx = (a.vx + b.vx) / 2;
            const my = (a.vy + b.vy) / 2;
            const dx = b.vx - a.vx;
            const dy = b.vy - a.vy;
            const len = Math.hypot(dx, dy) || 1;
            const perpX = -dy / len;
            const perpY = dx / len;
            const curve = 0.18 * len;
            const cpx = mx + perpX * curve;
            const cpy = my + perpY * curve;
            const path = `M${a.vx},${a.vy} Q${cpx},${cpy} ${b.vx},${b.vy}`;

            return (
              <g key={`${e.src}-${e.dst}-${idx}`}>
                {/* Campaign mode: highlight edges between two active nodes */}
                {bothActive && (
                  <path d={path} stroke="#fbbf24" strokeOpacity={0.6} strokeWidth={w * 2} fill="none" strokeLinecap="round" />
                )}
                <path
                  d={path}
                  stroke="#ef4444"
                  strokeOpacity={opacity}
                  strokeWidth={w}
                  fill="none"
                  strokeLinecap="round"
                />
                {timeActivity > 0.05 && (
                  <circle r={1.8 + (e.weight / maxWeight) * 1.6} fill="#fbbf24" opacity={bothActive ? 0.85 : 0.55}>
                    <animateMotion
                      dur={`${4 + (1 - timeActivity) * 4}s`}
                      repeatCount="indefinite"
                      path={path}
                      begin={`${(idx * 0.31) % 6}s`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {positioned.map((n) => (
            <FlowNodeView
              key={n.id}
              node={n}
              maxSessions={maxSessions}
              selected={selectedNode === n.id}
              dim={!!selectedNode && !connected.has(n.id)}
              active={activeSet.has(n.id)}
              mode={mode}
              timeActivity={timeActivity}
              onSelect={(e) => {
                e.stopPropagation();
                if (hasDraggedRef.current) return;
                if (mode === "campaign" && nodeProducts[n.id]) {
                  onToggleNode(n.id);
                } else {
                  onSelectNode(selectedNode === n.id ? null : n.id);
                }
              }}
            />
          ))}
        </g>
        </g>{/* end pan group */}
      </svg>

      {/* Node info panel — only in flow mode */}
      <AnimatePresence>
        {selectedNode && mode === "flow" && (
          <NodePanel id={selectedNode} />
        )}
      </AnimatePresence>
    </div>
  );
}

function FlowNodeView({
  node,
  maxSessions,
  selected,
  dim,
  active,
  mode,
  timeActivity,
  onSelect,
}: {
  node: FlowNode & { vx: number; vy: number };
  maxSessions: number;
  selected: boolean;
  dim: boolean;
  active: boolean;
  mode: "flow" | "campaign";
  timeActivity: number;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const base = Math.sqrt(node.sessions / maxSessions);
  const radius = 14 + base * 38;
  const color = nodeColors[node.category] || "#ef4444";
  const labelSize = 11 + base * 4;
  const hasProduct = !!nodeProducts[node.id];

  return (
    <g
      onClick={onSelect}
      style={{
        cursor: "pointer",
        opacity: dim ? 0.25 : 1,
        transition: "opacity 0.3s",
      }}
    >
      {/* Pulse ring — only selected or active nodes */}
      {(selected || active) && (
        <motion.circle
          cx={node.vx}
          cy={node.vy}
          r={radius + 4}
          fill={active ? "#fbbf24" : color}
          opacity={0}
          animate={{
            opacity: [0, active ? 0.18 : 0.12, 0],
            r: [radius + 2, radius + radius * 0.35, radius + radius * 0.45],
          }}
          transition={{ duration: active ? 2.2 : 2.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Campaign mode: dashed hint ring on nodes with products (not yet active) */}
      {mode === "campaign" && hasProduct && !active && (
        <circle
          cx={node.vx}
          cy={node.vy}
          r={radius + 9}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.35}
        />
      )}

      {/* Active campaign ring — solid amber glow */}
      {active && (
        <circle
          cx={node.vx}
          cy={node.vy}
          r={radius + 11}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2.5}
          filter="url(#glowAmber)"
          opacity={0.85}
        />
      )}

      {/* Selection ring — appears on click */}
      {selected && (
        <circle
          cx={node.vx}
          cy={node.vy}
          r={radius + 5}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.6}
        />
      )}

      {/* Main node circle */}
      <motion.circle
        cx={node.vx}
        cy={node.vy}
        r={radius}
        fill={active ? "#fbbf24" : color}
        fillOpacity={active ? 0.25 : selected ? 0.28 : 0.15}
        stroke={active ? "#fbbf24" : color}
        strokeWidth={active ? 2.5 : selected ? 2.5 : 1.2}
        filter={selected || active ? "url(#glow)" : undefined}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Inner core */}
      <circle
        cx={node.vx}
        cy={node.vy}
        r={radius * 0.45}
        fill={active ? "#fbbf24" : color}
        fillOpacity={active ? 0.9 : selected ? 0.85 : 0.55}
      />

      {/* Label */}
      <text
        x={node.vx}
        y={node.vy + radius + 16}
        textAnchor="middle"
        fontSize={labelSize}
        fill={active ? "#92400E" : selected ? "#121212" : "#3A3A38"}
        fontWeight={active || selected ? 600 : 500}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.label}
      </text>
      <text
        x={node.vx}
        y={node.vy + radius + 16 + labelSize + 2}
        textAnchor="middle"
        fontSize={labelSize - 2}
        fill="#9A9A93"
        fontWeight={400}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {node.sessions.toLocaleString("pl-PL")} sesji
      </text>

      {/* Active badge: checkmark */}
      {active && (
        <g transform={`translate(${node.vx + radius * 0.7}, ${node.vy - radius * 0.7})`}>
          <circle r={8} fill="#fbbf24" />
          <text x={0} y={4} textAnchor="middle" fontSize={10} fill="#000" fontWeight={700} style={{ pointerEvents: "none" }}>
            ✓
          </text>
        </g>
      )}

      {/* Product indicator: small dot for campaign-mode nodes with products */}
      {mode === "campaign" && hasProduct && !active && (
        <circle
          cx={node.vx + radius * 0.7}
          cy={node.vy - radius * 0.7}
          r={5}
          fill="#fbbf24"
          fillOpacity={0.5}
          stroke="#fbbf24"
          strokeWidth={1}
        />
      )}
    </g>
  );
}

function NodePanel({ id }: { id: FeatureKey }) {
  const node = flowNodes.find((n) => n.id === id);
  if (!node) return null;
  const inflow = flowEdges.filter((e) => e.dst === id).sort((a, b) => b.weight - a.weight).slice(0, 3);
  const outflow = flowEdges.filter((e) => e.src === id).sort((a, b) => b.weight - a.weight).slice(0, 3);
  const entryShare = Math.round((node.entries / node.sessions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="absolute z-20"
      style={{
        top: 60, right: 12, width: 280,
        background: "#FFFFFF",
        border: "1px solid #E6E6E2",
        borderRadius: 8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Block header */}
      <div
        className="flex items-center gap-2 px-3"
        style={{ height: 30, borderBottom: "1px solid #EDEDE9", background: "#FAFAF8" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
        <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>Sekcja</span>
        <span className="text-[11px] font-semibold ml-1" style={{ color: "#121212" }}>{node.label}</span>
        <div className="ml-auto flex items-baseline gap-1">
          <span className="text-base font-bold tabular-nums" style={{ color: "#ef4444" }}>{node.sessions}</span>
          <span className="mono text-[9px]" style={{ color: "#9A9A93" }}>sesji/90d</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-3 gap-1.5">
          <Stat label="Entries" value={node.entries} sub={`${entryShare}%`} />
          <Stat label="Pageviews" value={node.pageviews} />
          <Stat label="Połączeń" value={inflow.length + outflow.length} />
        </div>
        <div className="space-y-2">
          <FlowList title="↘ Wchodzi z" items={inflow.map((e) => ({ label: e.src, w: e.weight }))} />
          <FlowList title="↗ Wychodzi do" items={outflow.map((e) => ({ label: e.dst, w: e.weight }))} />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded py-1.5 px-2 text-center" style={{ background: "#F6F6F4", border: "1px solid #EDEDE9" }}>
      <div className="mono text-[8px] uppercase tracking-wider" style={{ color: "#9A9A93" }}>{label}</div>
      <div className="text-sm font-semibold tabular-nums" style={{ color: "#121212" }}>{value.toLocaleString("pl-PL")}</div>
      {sub && <div className="mono text-[9px]" style={{ color: "#9A9A93" }}>{sub}</div>}
    </div>
  );
}

function FlowList({ title, items }: { title: string; items: { label: string; w: number }[] }) {
  if (items.length === 0) return null;
  const labels: Record<string, string> = Object.fromEntries(flowNodes.map((n) => [n.id, n.label]));
  return (
    <div>
      <div className="mono text-[9px] uppercase tracking-wider mb-1" style={{ color: "#9A9A93" }}>{title}</div>
      <div className="space-y-0.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between text-[11px]" style={{ color: "#3A3A38" }}>
            <span>{labels[it.label] ?? it.label}</span>
            <span className="mono tabular-nums" style={{ color: "#9A9A93" }}>{it.w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div
      className="flex items-center gap-3 pointer-events-auto rounded-full px-3 py-1.5"
      style={{ background: "#FAFAF8", border: "1px solid #E6E6E2", fontSize: 10, color: "#6E6E68" }}
    >
      {Object.entries({
        Hub: nodeColors.hub,
        Content: nodeColors.content,
        Narzędzie: nodeColors.tool,
        Edukacja: nodeColors.education,
      }).map(([k, c]) => (
        <span key={k} className="flex items-center gap-1.5 mono text-[9px] uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
          {k}
        </span>
      ))}
    </div>
  );
}
