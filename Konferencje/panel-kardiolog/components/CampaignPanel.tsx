"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as Lucide from "lucide-react";
import { nodeProducts, getCampaignMetrics, getNodeStats, type NodeProduct } from "@/lib/products";
import type { FeatureKey } from "@/lib/types";

interface Props {
  activeNodes: FeatureKey[];
  onToggleNode: (id: FeatureKey) => void;
}

function Block({
  dot,
  kind,
  title,
  children,
}: {
  dot: string;
  kind: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E6E6E2", background: "#FFFFFF" }}>
      <div
        className="flex items-center gap-2 px-3"
        style={{ height: 30, borderBottom: "1px solid #EDEDE9", background: "#FAFAF8" }}
      >
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
        <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>{kind}</span>
        <span className="text-[11px] font-semibold ml-1" style={{ color: "#121212" }}>{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function CampaignPanel({ activeNodes, onToggleNode }: Props) {
  const metrics = getCampaignMetrics(activeNodes);

  return (
    <aside className="space-y-2">
      {/* Header block */}
      <Block dot="#ef4444" kind="Kampania" title={metrics.nodeCount === 0 ? "Brak touchpointów" : `${metrics.nodeCount} aktywne`}>
        <p className="text-[11px] leading-relaxed" style={{ color: "#6E6E68" }}>
          {metrics.nodeCount === 0
            ? "Kliknij węzeł w grafie aby odblokować touchpoint dla kampanii."
            : "Twoja marka towarzyszy lekarzowi w wybranych momentach tygodnia."}
        </p>
      </Block>

      {/* Live metrics */}
      <AnimatePresence>
        {metrics.nodeCount > 0 && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="space-y-2"
          >
            <Block dot="#f59e0b" kind="Metryki" title="Tygodniowo">
              <div className="space-y-3">
                <MetricRow icon="Zap" label="Ekspozycji / tydz." value={metrics.touchpointsPerWeek.toLocaleString("pl-PL")} sub="sesji z Twoją marką" color="#f59e0b" />
                <MetricRow icon="Clock" label="Czas z marką / tydz." value={`${metrics.hoursPerWeek} h`} sub={`${metrics.minutesPerWeek} minut ekspozycji`} color="#10b981" />
                <MetricRow icon="Users" label="Lekarzy w zasięgu" value={metrics.maxUU.toLocaleString("pl-PL")} sub={`${metrics.coveragePct}% aktywnej kohorty`} color="#3b82f6" />
              </div>
            </Block>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active touchpoints list */}
      <AnimatePresence>
        {metrics.nodeCount > 0 && (
          <motion.div key="touchpoints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Block dot="#111111" kind="Touchpointy" title={`Aktywne (${metrics.nodeCount})`}>
              <div className="space-y-2">
                <AnimatePresence>
                  {activeNodes
                    .filter((id) => nodeProducts[id])
                    .map((id) => {
                      const product = nodeProducts[id]!;
                      const stats = getNodeStats(id);
                      return (
                        <TouchpointRow key={id} product={product} stats={stats} onRemove={() => onToggleNode(id)} />
                      );
                    })}
                </AnimatePresence>
              </div>
            </Block>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-touchpoint narrative */}
      <AnimatePresence>
        {metrics.nodeCount >= 2 && (
          <motion.div
            key="narrative"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg p-3"
            style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lucide.Sparkles className="w-3 h-3" style={{ color: "#D97706" }} />
              <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#D97706" }}>Efekt multi-touchpoint</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "#78350F" }}>
              Lekarz spotyka Twoją markę w{" "}
              <span className="font-semibold">{metrics.nodeCount} różnych momentach</span>{" "}
              tygodnia pracy — każdy touchpoint wzmacnia kolejny.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function MetricRow({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const Icon = (Lucide as unknown as Record<string, React.FC<{ className?: string }>>)[icon] ?? Lucide.TrendingUp;
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-7 h-7 rounded flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <span style={{ color }}><Icon className="w-3.5 h-3.5" /></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>{label}</div>
        <div className="text-sm font-semibold tabular-nums leading-tight" style={{ color: "#121212" }}>{value}</div>
        <div className="text-[10px]" style={{ color: "#9A9A93" }}>{sub}</div>
      </div>
    </div>
  );
}

function TouchpointRow({
  product,
  stats,
  onRemove,
}: {
  product: NodeProduct;
  stats: ReturnType<typeof getNodeStats>;
  onRemove: () => void;
}) {
  const Icon = (Lucide as unknown as Record<string, React.FC<{ className?: string }>>)[product.icon] ?? Lucide.Package;
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className="flex items-start gap-2.5 py-1"
      style={{ borderBottom: "1px solid #EDEDE9" }}
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${product.color}18` }}
      >
        <span style={{ color: product.color }}><Icon className="w-3 h-3" /></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <span className="text-[11px] font-medium leading-tight" style={{ color: "#121212" }}>{product.name}</span>
          <button onClick={onRemove} className="shrink-0 mt-0.5" style={{ color: "#9A9A93" }}>
            <Lucide.X className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="mono text-[8px] uppercase tracking-wider px-1 py-0.5 rounded"
            style={{ background: `${product.color}18`, color: product.color }}
          >
            {product.format}
          </span>
          {stats && (
            <span className="mono text-[9px]" style={{ color: "#9A9A93" }}>
              {stats.sessionsPerWeek} sesji/tydz · ~{product.avgMinutes} min
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
