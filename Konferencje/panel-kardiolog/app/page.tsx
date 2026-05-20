"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Target, Pill, UserRound } from "lucide-react";
import { Header } from "@/components/Header";
import { PersonaCard } from "@/components/PersonaCard";
import { FlowGraph } from "@/components/FlowGraph";
import { CampaignPanel } from "@/components/CampaignPanel";
import { TouchpointGraph } from "@/components/TouchpointGraph";
import { DoctorGraph } from "@/components/DoctorGraph";
import { TimeScrubber } from "@/components/TimeScrubber";
import type { FeatureKey } from "@/lib/types";

type Mode = "flow" | "campaign" | "touchpoint" | "doctor";

export default function Home() {
  const [mode, setMode] = useState<Mode>("flow");
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(9);
  const [selectedNode, setSelectedNode] = useState<FeatureKey | null>(null);
  const [activeNodes, setActiveNodes] = useState<FeatureKey[]>([]);

  const toggleNode = useCallback((nodeId: FeatureKey) => {
    setActiveNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((n) => n !== nodeId) : [...prev, nodeId]
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col h-screen" style={{ background: "#ECECE8" }}>
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {/* Left: persona */}
        <div
          className="w-[260px] shrink-0 overflow-y-auto p-3 space-y-3"
          style={{ borderRight: "1px solid #E6E6E2", background: "#FAFAF8" }}
        >
          <ModeToggle mode={mode} onChange={setMode} />
          <PersonaCard />
        </div>

        {/* Center: flow graph or touchpoint graph */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 p-3 overflow-hidden">
            {mode === "touchpoint" ? (
              <TouchpointGraph />
            ) : mode === "doctor" ? (
              <DoctorGraph />
            ) : (
              <FlowGraph
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                currentDay={day}
                currentHour={hour}
                mode={mode}
                activeNodes={activeNodes}
                onToggleNode={toggleNode}
              />
            )}
          </div>
          {mode !== "touchpoint" && mode !== "doctor" && (
            <TimeScrubber day={day} hour={hour} onChange={(d, h) => { setDay(d); setHour(h); }} />
          )}
        </div>

        {/* Right: campaign panel */}
        <AnimatePresence>
          {mode === "campaign" && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="w-[300px] shrink-0 overflow-y-auto p-3"
              style={{ borderLeft: "1px solid #E6E6E2", background: "#FAFAF8" }}
            >
              <CampaignPanel activeNodes={activeNodes} onToggleNode={toggleNode} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div
      className="grid grid-cols-4 gap-1 p-1 rounded-lg"
      style={{ background: "#FFFFFF", border: "1px solid #E6E6E2" }}
    >
      <ToggleBtn active={mode === "flow"} onClick={() => onChange("flow")} icon={<Network className="w-3.5 h-3.5" />} label="Przepływy" />
      <ToggleBtn active={mode === "campaign"} onClick={() => onChange("campaign")} icon={<Target className="w-3.5 h-3.5" />} label="Kampania" />
      <ToggleBtn active={mode === "touchpoint"} onClick={() => onChange("touchpoint")} icon={<Pill className="w-3.5 h-3.5" />} label="Lek" />
      <ToggleBtn active={mode === "doctor"} onClick={() => onChange("doctor")} icon={<UserRound className="w-3.5 h-3.5" />} label="Lekarz" />
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
      style={{
        background: active ? "#111111" : "transparent",
        color: active ? "#FFFFFF" : "#6E6E68",
        border: active ? "1px solid #111111" : "1px solid transparent",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
