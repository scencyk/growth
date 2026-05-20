"use client";

import { useEffect, useState } from "react";
import { cardiologist } from "@/lib/data";

function AnimatedCounter({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCurrent(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="mono">{current.toLocaleString("pl-PL")}</span>;
}

export function Header() {
  const c = cardiologist;
  const appShare = Math.round(
    (c.platformBreakdown.app / (c.platformBreakdown.web + c.platformBreakdown.app)) * 100
  );
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const hm = now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="sticky top-0 z-30 flex flex-col">
      {/* ── Titlebar (dark, macOS-style) ── */}
      <div
        style={{ height: 36, background: "#1A1A1A", borderBottom: "1px solid #000" }}
        className="flex items-center px-3 gap-3 text-[11px] select-none shrink-0"
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E16B5D" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E0B24E" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#4CAE65" }} />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mono" style={{ color: "#8C8C86" }}>
          <div
            className="flex items-center justify-center rounded"
            style={{ width: 14, height: 14, border: "1.5px solid #D9D9D4" }}
          >
            <div style={{ width: 4, height: 4, background: "#D9D9D4" }} />
          </div>
          <span style={{ color: "#D9D9D4" }}>Remedium</span>
          <span>›</span>
          <span>Sprzedaż</span>
          <span>›</span>
          <span style={{ color: "#fff" }}>Panel kardiologa</span>
        </div>

        <div className="flex-1" />

        {/* LIVE indicator */}
        <div className="flex items-center gap-1.5" style={{ color: "#8C8C86" }}>
          <div className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: "#4CAE65" }} />
          <span className="mono">LIVE</span>
        </div>

        <span className="mono" style={{ color: "#8C8C86", paddingLeft: 12, borderLeft: "1px solid #2C2C2C" }}>
          {hm}
        </span>

        {/* User */}
        <div
          className="flex items-center gap-1.5 mono"
          style={{ paddingLeft: 12, borderLeft: "1px solid #2C2C2C", color: "#8C8C86" }}
        >
          <div
            className="flex items-center justify-center rounded text-[9px] font-bold"
            style={{ width: 18, height: 18, background: "#3A3A38", color: "#D9D9D4" }}
          >
            B
          </div>
          <span style={{ color: "#D9D9D4" }}>Brandmed</span>
        </div>
      </div>

      {/* ── Stats bar (light) ── */}
      <div
        className="flex items-center gap-5 px-5 border-b"
        style={{ height: 44, background: "#FFFFFF", borderColor: "#E6E6E2" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#ef4444" }}
          />
          <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#6E6E68" }}>
            Kardiologia · kohorta 41
          </span>
        </div>

        <div style={{ width: 1, height: 16, background: "#E6E6E2" }} />

        <StatItem label="Zarejestrowanych" value={c.totalRegistered} />
        <StatItem label="Aktywnych / 90d" value={c.totalActive90d} accent />
        <StatItem label="Specjalistów" value={c.statusBreakdown.specialist} />
        <StatItem label="Rezydentów" value={c.statusBreakdown.resident} />

        <div style={{ width: 1, height: 16, background: "#E6E6E2" }} />

        <span className="mono text-[10px]" style={{ color: "#6E6E68" }}>
          {appShare}% app · {100 - appShare}% web
        </span>
      </div>
    </header>
  );
}

function StatItem({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mono text-[9px] uppercase tracking-widest" style={{ color: "#9A9A93" }}>
        {label}
      </span>
      <span
        className="text-sm font-semibold tabular-nums"
        style={{ color: accent ? "#ef4444" : "#121212" }}
      >
        <AnimatedCounter value={value} />
      </span>
    </div>
  );
}
