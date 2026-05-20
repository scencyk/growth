"use client";

import { cardiologist } from "@/lib/data";

export function PersonaCard() {
  const c = cardiologist;
  const total =
    c.statusBreakdown.specialist + c.statusBreakdown.resident +
    c.statusBreakdown.without + c.statusBreakdown.intern;
  const specPct = Math.round((c.statusBreakdown.specialist / total) * 100);
  const resPct = Math.round((c.statusBreakdown.resident / total) * 100);
  const webPct = Math.round(
    (c.platformBreakdown.web / (c.platformBreakdown.web + c.platformBreakdown.app)) * 100
  );

  return (
    <aside className="space-y-2">
      {/* Identity card */}
      <Block dot="#ef4444" kind="Persona" title="Dr. Kardio">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold mono shrink-0"
            style={{ background: "#FEF2F2", color: "#ef4444", border: "1px solid #FECACA" }}
          >
            K
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "#121212" }}>Kardiolog</div>
            <div className="mono text-[10px] mt-0.5" style={{ color: "#9A9A93" }}>specjalista / rezydent</div>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "#6E6E68" }}>
          Modelowy lekarz reprezentujący kohortę{" "}
          <span className="font-semibold" style={{ color: "#121212" }}>{c.totalActive90d}</span>{" "}
          aktywnych kardiologów na Remedium (90 dni).
        </p>
      </Block>

      {/* Status */}
      <Block dot="#3A3A38" kind="Status" title="Specjalizacja">
        <div className="space-y-2">
          <BarRow label="Specjalista" pct={specPct} count={c.statusBreakdown.specialist} color="#ef4444" />
          <BarRow label="Rezydent" pct={resPct} count={c.statusBreakdown.resident} color="#f97316" />
          <BarRow
            label="Bez spec."
            pct={Math.round((c.statusBreakdown.without / total) * 100)}
            count={c.statusBreakdown.without}
            color="#9A9A93"
          />
        </div>
      </Block>

      {/* Platform */}
      <Block dot="#3b82f6" kind="Platforma" title="Dostęp">
        <div className="space-y-2">
          <PlatformRow label="Web" pct={webPct} count={c.platformBreakdown.web} color="#3b82f6" />
          <PlatformRow label="App" pct={100 - webPct} count={c.platformBreakdown.app} color="#a855f7" />
        </div>
      </Block>

      {/* Top sections */}
      <Block dot="#f59e0b" kind="Dane PostHog" title="Top sekcje · UU/90d">
        <div className="space-y-2">
          {c.topSections.slice(0, 8).map((s) => {
            const max = c.topSections[0].uu;
            const w = Math.round((s.uu / max) * 100);
            return (
              <div key={s.feature} className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: "#3A3A38" }}>{s.label}</span>
                  <span className="mono" style={{ color: "#9A9A93" }}>{s.uu}</span>
                </div>
                <div className="h-1 rounded overflow-hidden" style={{ background: "#EDEDE9" }}>
                  <div
                    className="h-full rounded transition-all duration-700"
                    style={{ width: `${w}%`, background: "linear-gradient(to right, #ef4444, #f97316)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Block>
    </aside>
  );
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
      {/* Block header */}
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

function BarRow({ label, pct, count, color }: { label: string; pct: number; count: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[11px]">
        <span style={{ color: "#3A3A38" }}>{label}</span>
        <span className="mono" style={{ color: "#9A9A93" }}>{pct}% · {count}</span>
      </div>
      <div className="h-1.5 rounded overflow-hidden" style={{ background: "#EDEDE9" }}>
        <div className="h-full rounded transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function PlatformRow({ label, pct, count, color }: { label: string; pct: number; count: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[11px]">
        <span style={{ color: "#3A3A38" }}>{label}</span>
        <span className="mono" style={{ color: "#9A9A93" }}>{pct}% · {count}</span>
      </div>
      <div className="h-1.5 rounded overflow-hidden" style={{ background: "#EDEDE9" }}>
        <div className="h-full rounded transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
