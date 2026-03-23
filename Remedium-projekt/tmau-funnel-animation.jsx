import { useState, useEffect, useRef, useCallback } from "react";

const STAGES = [
  { id: "market", label: "Rynek PL", sublabel: "Lekarze w Polsce", count: 141000, color: "#94a3b8", bg: "#f1f5f9" },
  { id: "registered", label: "Zarejestrowani", sublabel: "Zweryfikowani w Remedium", count: 44085, color: "#6366f1", bg: "#eef2ff" },
  { id: "specialty", label: "Ze specjalizacją", sublabel: "Znana specjalizacja w profilu", count: 21335, color: "#2e35ff", bg: "#e0e7ff" },
  { id: "active", label: "tMAU", sublabel: "Aktywni w ostatnich 30 dni", count: 8393, color: "#059669", bg: "#ecfdf5" },
];

const TOTAL_DOTS = 280;
const DOT_RADIUS = 3;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function formatK(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return n.toString();
}

function percentOf(part, whole) {
  return ((part / whole) * 100).toFixed(0) + "%";
}

export default function TMAUFunnelAnimation() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0);
  const phaseTimerRef = useRef(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const startTimeRef = useRef(null);
  const lastTimeRef = useRef(null);

  const PHASE_DURATION = 3000;
  const TRANSITION_DURATION = 1800;

  const getStageLayout = useCallback((stageIndex, canvasW, canvasH) => {
    const padding = 40;
    const usableW = canvasW - padding * 2;
    const usableH = canvasH - 160;
    const stageW = usableW / 4;

    const cx = padding + stageW * stageIndex + stageW / 2;
    const cy = 100 + usableH / 2;

    const dotsForStage = Math.round((STAGES[stageIndex].count / STAGES[0].count) * TOTAL_DOTS);
    const cols = Math.max(4, Math.ceil(Math.sqrt(dotsForStage * (stageW * 0.7) / usableH)));
    const rows = Math.ceil(dotsForStage / cols);

    const spacingX = Math.min(12, (stageW * 0.7) / cols);
    const spacingY = Math.min(12, usableH * 0.7 / rows);
    const gridW = cols * spacingX;
    const gridH = rows * spacingY;

    return { cx, cy, cols, rows, spacingX, spacingY, gridW, gridH, dotsForStage, stageW };
  }, []);

  const getPositionInStage = useCallback((dotIndex, stageIndex, canvasW, canvasH) => {
    const layout = getStageLayout(stageIndex, canvasW, canvasH);
    const col = dotIndex % layout.cols;
    const row = Math.floor(dotIndex / layout.cols);
    const x = layout.cx - layout.gridW / 2 + col * layout.spacingX + layout.spacingX / 2;
    const y = layout.cy - layout.gridH / 2 + row * layout.spacingY + layout.spacingY / 2;
    return { x, y };
  }, [getStageLayout]);

  const initDots = useCallback((canvasW, canvasH) => {
    const dots = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
      const pos = getPositionInStage(i, 0, canvasW, canvasH);
      dots.push({
        x: pos.x + randomBetween(-2, 2),
        y: pos.y + randomBetween(-2, 2),
        targetX: pos.x,
        targetY: pos.y,
        startX: pos.x,
        startY: pos.y,
        stage: 0,
        maxStage: 0,
        opacity: 1,
        targetOpacity: 1,
        radius: DOT_RADIUS,
        delay: randomBetween(0, 0.3),
        settled: true,
      });
    }
    return dots;
  }, [getPositionInStage]);

  const transitionToPhase = useCallback((phase, canvasW, canvasH) => {
    const dots = dotsRef.current;
    if (phase === 0) {
      dots.forEach((dot, i) => {
        const pos = getPositionInStage(i, 0, canvasW, canvasH);
        dot.startX = dot.x;
        dot.startY = dot.y;
        dot.targetX = pos.x;
        dot.targetY = pos.y;
        dot.stage = 0;
        dot.maxStage = 0;
        dot.targetOpacity = 1;
        dot.delay = randomBetween(0, 0.3);
        dot.settled = false;
      });
      return;
    }

    const stageIndex = Math.min(phase, STAGES.length - 1);
    const dotCounts = STAGES.map(s => Math.round((s.count / STAGES[0].count) * TOTAL_DOTS));
    const threshold = dotCounts[stageIndex];

    let assignedInStage = 0;
    dots.forEach((dot, i) => {
      dot.startX = dot.x;
      dot.startY = dot.y;
      dot.delay = randomBetween(0, 0.4);
      dot.settled = false;

      if (i < threshold) {
        const pos = getPositionInStage(assignedInStage, stageIndex, canvasW, canvasH);
        dot.targetX = pos.x;
        dot.targetY = pos.y;
        dot.stage = stageIndex;
        dot.maxStage = stageIndex;
        dot.targetOpacity = 1;
        assignedInStage++;
      } else {
        const prevStage = stageIndex - 1;
        const prevLayout = getStageLayout(prevStage, canvasW, canvasH);
        dot.targetX = prevLayout.cx + randomBetween(-prevLayout.stageW * 0.35, prevLayout.stageW * 0.35);
        dot.targetY = dot.y + randomBetween(20, 60);
        dot.stage = prevStage;
        dot.maxStage = prevStage;
        dot.targetOpacity = 0.15;
      }
    });
  }, [getPositionInStage, getStageLayout]);

  const resetAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    dotsRef.current = initDots(canvasW, canvasH);
    phaseRef.current = 0;
    phaseTimerRef.current = 0;
    startTimeRef.current = null;
    lastTimeRef.current = null;
    setCurrentPhase(0);
  }, [initDots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const canvasW = rect.width;
    const canvasH = rect.height;

    dotsRef.current = initDots(canvasW, canvasH);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        phaseTimerRef.current += dt;

        if (phaseTimerRef.current > PHASE_DURATION + TRANSITION_DURATION) {
          phaseTimerRef.current = 0;
          phaseRef.current = (phaseRef.current + 1) % (STAGES.length + 1);
          if (phaseRef.current === STAGES.length) {
            phaseRef.current = 0;
          }
          setCurrentPhase(phaseRef.current);
          transitionToPhase(phaseRef.current, canvasW, canvasH);
        }
      }

      const transProgress = Math.min(1, phaseTimerRef.current / TRANSITION_DURATION);

      ctx.clearRect(0, 0, canvasW, canvasH);

      // Draw stage backgrounds
      for (let si = 0; si <= Math.min(phaseRef.current, STAGES.length - 1); si++) {
        const layout = getStageLayout(si, canvasW, canvasH);
        const alpha = si === phaseRef.current ? Math.min(1, transProgress * 2) : 1;

        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = STAGES[si].bg;
        ctx.beginPath();
        const rx = layout.stageW * 0.45;
        const ry = canvasH * 0.35;
        ctx.roundRect(layout.cx - rx, layout.cy - ry, rx * 2, ry * 2, 12);
        ctx.fill();
        ctx.restore();
      }

      // Draw arrows between stages
      for (let si = 0; si < Math.min(phaseRef.current, STAGES.length - 1); si++) {
        const from = getStageLayout(si, canvasW, canvasH);
        const to = getStageLayout(si + 1, canvasW, canvasH);
        const arrowAlpha = si < phaseRef.current - 1 ? 0.6 : Math.min(0.6, transProgress);

        ctx.save();
        ctx.globalAlpha = arrowAlpha;
        ctx.strokeStyle = STAGES[si + 1].color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        const startX = from.cx + from.stageW * 0.35;
        const endX = to.cx - to.stageW * 0.35;
        const midY = from.cy;

        ctx.beginPath();
        ctx.moveTo(startX, midY);
        ctx.lineTo(endX - 8, midY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = STAGES[si + 1].color;
        ctx.beginPath();
        ctx.moveTo(endX, midY);
        ctx.lineTo(endX - 10, midY - 5);
        ctx.lineTo(endX - 10, midY + 5);
        ctx.fill();
        ctx.restore();
      }

      // Draw conversion labels between stages
      if (phaseRef.current > 0) {
        for (let si = 0; si < Math.min(phaseRef.current, STAGES.length - 1); si++) {
          const from = getStageLayout(si, canvasW, canvasH);
          const to = getStageLayout(si + 1, canvasW, canvasH);
          const labelAlpha = si < phaseRef.current - 1 ? 0.8 : Math.min(0.8, transProgress * 1.5);
          const convRate = percentOf(STAGES[si + 1].count, STAGES[si].count);

          ctx.save();
          ctx.globalAlpha = labelAlpha;
          ctx.fillStyle = STAGES[si + 1].color;
          ctx.font = "bold 11px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          const midX = (from.cx + to.cx) / 2;
          ctx.fillText(convRate, midX, from.cy - 16);
          ctx.restore();
        }
      }

      // Update and draw dots
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (!dot.settled) {
          const adjustedProgress = Math.max(0, Math.min(1, (transProgress - dot.delay) / (1 - dot.delay)));
          const eased = easeInOutCubic(adjustedProgress);

          dot.x = dot.startX + (dot.targetX - dot.startX) * eased;
          dot.y = dot.startY + (dot.targetY - dot.startY) * eased;
          dot.opacity = dot.opacity + (dot.targetOpacity - dot.opacity) * eased;

          if (adjustedProgress >= 1) {
            dot.settled = true;
            dot.x = dot.targetX;
            dot.y = dot.targetY;
            dot.opacity = dot.targetOpacity;
          }
        }

        // Gentle float for settled dots
        if (dot.settled && dot.targetOpacity > 0.5) {
          const time = timestamp * 0.001;
          const floatX = Math.sin(time * 0.8 + i * 0.7) * 0.5;
          const floatY = Math.cos(time * 0.6 + i * 1.1) * 0.5;
          dot.x = dot.targetX + floatX;
          dot.y = dot.targetY + floatY;
        }

        const stageColor = STAGES[dot.maxStage].color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = stageColor;
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, initDots, transitionToPhase, getStageLayout]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-950 text-white p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white mb-1">
            Od rynku do <span className="text-emerald-400">tMAU</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Jak 141K lekarzy w Polsce przechodzi przez lejek Remedium
          </p>
        </div>

        {/* Stage indicators */}
        <div className="flex justify-between px-8 mb-3">
          {STAGES.map((stage, i) => (
            <div
              key={stage.id}
              className={`flex flex-col items-center transition-all duration-700 ${
                i <= currentPhase ? "opacity-100" : "opacity-30"
              }`}
              style={{ width: "24%" }}
            >
              <div
                className="text-xs font-bold uppercase tracking-wider mb-0.5"
                style={{ color: stage.color }}
              >
                {stage.label}
              </div>
              <div className="text-lg font-bold text-white">
                {formatK(stage.count)}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {stage.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800" style={{ height: 400 }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              {isPlaying ? "⏸ Pauza" : "▶ Play"}
            </button>
            <button
              onClick={resetAnimation}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              ↺ Od początku
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-gray-400">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span>{stage.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight box */}
        <div className="mt-6 p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-start gap-3">
            <div className="text-emerald-400 text-xl mt-0.5">→</div>
            <div>
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white">Kluczowy insight:</strong>{" "}
                Z 141K lekarzy w Polsce, tylko <strong className="text-emerald-400">~10,700</strong> przechodzi
                cały lejek do tMAU. Największy "wyciek" to nie rejestracja (34% rynku już mamy),
                ale <strong className="text-amber-400">brak danych o specjalizacji</strong> — 49% zarejestrowanych
                lekarzy jest niewidocznych dla kampanii pharma. To jest główna dźwignia growth.
              </p>
            </div>
          </div>
        </div>

        {/* Conversion funnel numbers */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rynek → Rejestracja</div>
            <div className="text-xl font-bold text-indigo-400">34%</div>
            <div className="text-xs text-gray-500">48K / 141K</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900 border border-amber-900/50 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rejestracja → Specjalizacja</div>
            <div className="text-xl font-bold text-amber-400">51%</div>
            <div className="text-xs text-amber-600">Największy bottleneck</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Specjalizacja → tMAU</div>
            <div className="text-xl font-bold text-emerald-400">44%</div>
            <div className="text-xs text-gray-500">MAU rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
