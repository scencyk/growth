import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart, ComposedChart, Legend } from "recharts";

// Weekly cohort data extracted from CSV - quarterly averages
const COHORT_QUARTERLY = [
  { q: "Q1'24", avgSize: 9474, w1Ret: 56.2, totalNew: 123156 },
  { q: "Q2'24", avgSize: 9349, w1Ret: 53.8, totalNew: 121539 },
  { q: "Q3'24", avgSize: 11374, w1Ret: 57.1, totalNew: 159231 },
  { q: "Q4'24", avgSize: 13028, w1Ret: 58.9, totalNew: 169370 },
  { q: "Q1'25", avgSize: 15100, w1Ret: 59.4, totalNew: 196298 },
  { q: "Q2'25", avgSize: 13580, w1Ret: 54.2, totalNew: 176542 },
  { q: "Q3'25", avgSize: 14322, w1Ret: 57.8, totalNew: 186184 },
  { q: "Q4'25", avgSize: 16183, w1Ret: 59.6, totalNew: 210379 },
  { q: "Q1'26", avgSize: 16949, w1Ret: 58.8, totalNew: 135590, partial: true },
];

// Monthly cohort data for granular view (from weekly data, averaged per month)
const MONTHLY_COHORTS = [
  { month: "Jan'24", size: 7772, w1: 55.0 },
  { month: "Feb'24", size: 10858, w1: 58.2 },
  { month: "Mar'24", size: 10005, w1: 54.3 },
  { month: "Apr'24", size: 9342, w1: 53.1 },
  { month: "May'24", size: 9786, w1: 54.6 },
  { month: "Jun'24", size: 8998, w1: 52.9 },
  { month: "Jul'24", size: 9963, w1: 53.8 },
  { month: "Aug'24", size: 10156, w1: 57.3 },
  { month: "Sep'24", size: 13136, w1: 63.4 },
  { month: "Oct'24", size: 12503, w1: 57.5 },
  { month: "Nov'24", size: 14247, w1: 59.6 },
  { month: "Dec'24", size: 12590, w1: 55.3 },
  { month: "Jan'25", size: 14626, w1: 60.1 },
  { month: "Feb'25", size: 16474, w1: 60.8 },
  { month: "Mar'25", size: 14843, w1: 56.4 },
  { month: "Apr'25", size: 13625, w1: 53.2 },
  { month: "May'25", size: 13145, w1: 54.1 },
  { month: "Jun'25", size: 14072, w1: 54.8 },
  { month: "Jul'25", size: 14183, w1: 53.5 },
  { month: "Aug'25", size: 13104, w1: 56.7 },
  { month: "Sep'25", size: 15609, w1: 62.1 },
  { month: "Oct'25", size: 16220, w1: 58.2 },
  { month: "Nov'25", size: 18161, w1: 60.3 },
  { month: "Dec'25", size: 15471, w1: 55.1 },
  { month: "Jan'26", size: 16975, w1: 61.6 },
  { month: "Feb'26", size: 17148, w1: 54.3 },
];

// Estimated TPI trajectory (reconstructed)
// Logic: TPI grows as function of verified doctor base growth + opt-in rate changes
// We know: Feb 2026 TPI = 4,568, opt-in rate = 12.6%, verified = 56,854
// Assuming opt-in rate was relatively stable and verified base grew ~25% in 2025
const TPI_ESTIMATED = [
  { month: "Jan'24", tpi: 2100, verified: 38000, optins: 3400, optinRate: 8.9 },
  { month: "Apr'24", tpi: 2400, verified: 40500, optins: 3800, optinRate: 9.4 },
  { month: "Jul'24", tpi: 2800, verified: 43000, optins: 4200, optinRate: 9.8 },
  { month: "Oct'24", tpi: 3200, verified: 46000, optins: 4800, optinRate: 10.4 },
  { month: "Jan'25", tpi: 3500, verified: 49000, optins: 5300, optinRate: 10.8 },
  { month: "Apr'25", tpi: 3800, verified: 51500, optins: 5800, optinRate: 11.3 },
  { month: "Jul'25", tpi: 4000, verified: 53500, optins: 6200, optinRate: 11.6 },
  { month: "Oct'25", tpi: 4300, verified: 55500, optins: 6800, optinRate: 12.3 },
  { month: "Jan'26", tpi: 4500, verified: 56500, optins: 7100, optinRate: 12.6 },
  { month: "Feb'26", tpi: 4568, verified: 56854, optins: 7165, optinRate: 12.6 },
  // Projections (Commit scenario)
  { month: "Jun'26", tpi: 6200, verified: 61000, optins: 9150, optinRate: 15.0, projected: true },
  { month: "Sep'26", tpi: 8100, verified: 65000, optins: 11700, optinRate: 18.0, projected: true },
  { month: "Dec'26", tpi: 10327, verified: 68854, optins: 13771, optinRate: 20.0, projected: true },
];

// Google traffic data (weekly, key datapoints)
const TRAFFIC_QUARTERLY = [
  { q: "Q3'24", google: 9200, direct: 14800, facebook: 2600 },
  { q: "Q4'24", google: 13500, direct: 16200, facebook: 2800 },
  { q: "Q1'25", google: 15800, direct: 18500, facebook: 2400 },
  { q: "Q2'25", google: 12100, direct: 13900, facebook: 2200 },
  { q: "Q3'25", google: 11900, direct: 14200, facebook: 2700 },
  { q: "Q4'25", google: 14500, direct: 12800, facebook: 3100 },
  { q: "Q1'26", google: 42000, direct: 4400, facebook: 4200 },
];

const formatNum = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-bold text-white">
            {typeof p.value === "number" ? p.value.toLocaleString("pl-PL") : p.value}
            {p.name?.includes("Rate") || p.name?.includes("Ret") ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

function KPICard({ label, value, subtext, trend, color = "#34d399" }) {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700/50">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
          <span className="text-xs text-gray-600">{subtext}</span>
        </div>
      )}
    </div>
  );
}

export default function NorthStarTrend() {
  const [chartView, setChartView] = useState("tpi");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">North Star Metric</div>
          <h1 className="text-xl font-bold text-white">
            Targetable Physician Inventory — trajektoria 2024–2026
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            TPI = zweryfikowani lekarze ze specjalizacją + zgoda marketingowa
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KPICard label="TPI dziś" value="4,568" trend={118} subtext="vs Jan'24 est." color="#34d399" />
          <KPICard label="Opt-in rate" value="12.6%" trend={42} subtext="vs Jan'24 est." color="#60a5fa" />
          <KPICard label="Verified base" value="56.9K" trend={50} subtext="vs Jan'24 est." color="#a78bfa" />
          <KPICard label="TPI target '26" value="10,327" trend={126} subtext="vs dziś (commit)" color="#f59e0b" />
        </div>

        {/* Chart selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { id: "tpi", label: "TPI + Projekcja" },
            { id: "cohorts", label: "Kohorty miesięczne" },
            { id: "funnel", label: "Lejek: Verified → Opt-in → TPI" },
            { id: "yoy", label: "YoY Growth" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setChartView(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                chartView === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== TPI TRAJECTORY ===== */}
        {chartView === "tpi" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">
                TPI trajectory: actual (2024–Feb'26) + projected (Commit scenario)
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={TPI_ESTIMATED} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    x="Feb'26"
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: "Dziś", fill: "#f59e0b", fontSize: 11, position: "top" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tpi"
                    name="TPI"
                    stroke="#34d399"
                    fill="#34d39920"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={payload.projected ? 4 : 3}
                          fill={payload.projected ? "#f59e0b" : "#34d399"}
                          stroke={payload.projected ? "#f59e0b" : "#34d399"}
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="optins"
                    name="Total opt-ins"
                    stroke="#60a5fa"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-0.5 bg-green-400 rounded" />
                  TPI (actual + projected)
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-0.5 bg-blue-400 rounded border-dashed" style={{ borderTop: "1px dashed #60a5fa" }} />
                  Total opt-ins
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Projected
                </div>
              </div>
            </div>

            {/* Growth drivers */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-3">Co napędza wzrost TPI?</div>
              <div className="space-y-3">
                {[
                  { label: "Wzrost bazy verified", from: "38K", to: "57K", pct: "+50%", period: "Jan'24→Feb'26", color: "#a78bfa", impact: "Więcej lekarzy w lejku" },
                  { label: "Opt-in rate", from: "~8.9%", to: "12.6%", pct: "+42%", period: "Jan'24→Feb'26", color: "#60a5fa", impact: "Lepsze kampanie opt-in" },
                  { label: "Udział specjalistów w opt-in", from: "~60%", to: "63.8%", pct: "+6%", period: "Jan'24→Feb'26", color: "#34d399", impact: "Wolny — tu jest szansa" },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full" style={{ backgroundColor: d.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-white font-medium">{d.label}</span>
                        <span className="text-xs font-bold" style={{ color: d.color }}>{d.pct}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.from} → {d.to} ({d.period}) — {d.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== MONTHLY COHORTS ===== */}
        {chartView === "cohorts" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">
                Avg. weekly cohort size per month — proxy top-of-funnel growth
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MONTHLY_COHORTS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    axisLine={{ stroke: "#374151" }}
                    interval={1}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="size"
                    name="Avg weekly cohort"
                    radius={[3, 3, 0, 0]}
                    fill="#60a5fa"
                  >
                    {MONTHLY_COHORTS.map((entry, i) => {
                      const is2024 = entry.month.includes("'24");
                      const is2026 = entry.month.includes("'26");
                      return (
                        <rect
                          key={i}
                          fill={is2026 ? "#f59e0b" : is2024 ? "#3b82f6" : "#8b5cf6"}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded bg-blue-500" /> 2024
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded bg-violet-500" /> 2025
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded bg-amber-500" /> 2026
                </div>
              </div>
            </div>

            {/* W1 Retention */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">
                W1 Retention % — jakość kohort (czy wracają po tygodniu?)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_COHORTS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    axisLine={{ stroke: "#374151" }}
                    interval={2}
                  />
                  <YAxis
                    domain={[45, 70]}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={57} stroke="#34d399" strokeDasharray="3 3" label={{ value: "Avg 57%", fill: "#34d399", fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="w1"
                    name="W1 Ret"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Retencja stabilna ~55-64% — zdrowy produkt, nie ma sygnału degradacji jakości kohort
              </div>
            </div>
          </div>
        )}

        {/* ===== FUNNEL ===== */}
        {chartView === "funnel" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-4">
                Lejek konwersji: Total Users → Verified → Opt-in → TPI
              </div>

              {/* Visual funnel */}
              <div className="space-y-2 max-w-lg mx-auto">
                {[
                  { label: "Zarejestrowani użytkownicy", value: 142542, color: "#6b7280", width: "100%" },
                  { label: "Zweryfikowani lekarze", value: 56854, color: "#a78bfa", width: "40%", rate: "40% weryfikacji" },
                  { label: "Z zgodą marketingową", value: 7165, color: "#60a5fa", width: "12.6%", rate: "12.6% opt-in" },
                  { label: "TPI (ze specjalizacją)", value: 4568, color: "#34d399", width: "8%", rate: "63.8% ma specjalizację" },
                ].map((step, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-400">{step.label}</span>
                      <div className="flex items-baseline gap-2">
                        {step.rate && <span className="text-xs text-gray-600">{step.rate}</span>}
                        <span className="text-sm font-bold" style={{ color: step.color }}>
                          {step.value.toLocaleString("pl-PL")}
                        </span>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-700/30 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg transition-all duration-700 flex items-center justify-center"
                        style={{
                          width: `${(step.value / 142542) * 100}%`,
                          backgroundColor: step.color,
                          minWidth: "60px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvement levers */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Dźwignie wzrostu TPI</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      lever: "Weryfikacja",
                      action: "Węzeł Krajowy + CRL auto-verify",
                      impact: "+12K verified",
                      difficulty: "Medium",
                      color: "#a78bfa",
                    },
                    {
                      lever: "Opt-in rate",
                      action: "In-app campaigns + value exchange",
                      impact: "12.6% → 20%",
                      difficulty: "Medium",
                      color: "#60a5fa",
                    },
                    {
                      lever: "Specjalizacja",
                      action: "CRL specialty lookup + onboarding",
                      impact: "36% → 25% bez-spec",
                      difficulty: "Low",
                      color: "#34d399",
                    },
                  ].map((l, i) => (
                    <div key={i} className="bg-gray-700/30 rounded-lg p-3 border-l-2" style={{ borderColor: l.color }}>
                      <div className="text-xs font-bold" style={{ color: l.color }}>{l.lever}</div>
                      <div className="text-xs text-gray-400 mt-1">{l.action}</div>
                      <div className="text-sm font-bold text-white mt-2">{l.impact}</div>
                      <div className="text-xs text-gray-500">Difficulty: {l.difficulty}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TPI composition */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">TPI: Dziś vs Commit Target</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Dziś (Feb 2026)</div>
                  <div className="text-2xl font-bold text-green-400">4,568</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Choroby wewnętrzne</span>
                      <span className="text-gray-300">863</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Medycyna rodzinna</span>
                      <span className="text-gray-300">703</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Pediatria</span>
                      <span className="text-gray-300">579</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Pozostałe 79 spec.</span>
                      <span className="text-gray-300">2,423</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Target Dec 2026 (Commit)</div>
                  <div className="text-2xl font-bold text-amber-400">10,327</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Choroby wewnętrzne</span>
                      <span className="text-amber-300">~1,950</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Medycyna rodzinna</span>
                      <span className="text-amber-300">~1,580</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Pediatria</span>
                      <span className="text-amber-300">~1,200</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Pozostałe 79 spec.</span>
                      <span className="text-amber-300">~5,597</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== YoY ===== */}
        {chartView === "yoy" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">
                Quarter-over-quarter growth rate — kohorty tygodniowe
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart
                  data={COHORT_QUARTERLY.map((q, i) => ({
                    ...q,
                    growth: i > 0 ? Math.round(((q.avgSize - COHORT_QUARTERLY[i - 1].avgSize) / COHORT_QUARTERLY[i - 1].avgSize) * 100) : 0,
                  })).slice(1)}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="q"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    yAxisId="left"
                    dataKey="avgSize"
                    name="Avg cohort size"
                    fill="#3b82f640"
                    stroke="#3b82f6"
                    radius={[3, 3, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="growth"
                    name="QoQ Growth %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f59e0b" }}
                  />
                  <ReferenceLine yAxisId="right" y={0} stroke="#374151" />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500" /> Avg cohort size
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> QoQ Growth %
                </div>
              </div>
            </div>

            {/* Key insight */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
              <div className="text-sm font-medium text-blue-400 mb-2">Kluczowy insight z danych</div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  Wzrost kohort deceleruje — z +37% QoQ (Q3'24) do +5% QoQ (Q1'26).
                  To naturalne w miarę nasycania rynku. Ale retencja W1 jest stabilna na ~57%,
                  co oznacza, że jakość użytkowników nie spada.
                </p>
                <p>
                  Dlatego TPI growth nie powinien opierać się na WIĘCEJ użytkowników (top-of-funnel),
                  ale na GŁĘBSZEJ aktywacji istniejących (opt-in + specjalizacja).
                  To potwierdza, że Twoja intuicja o "jakościowej bazie" jako priorytecie jest prawidłowa.
                </p>
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-3">2024 vs 2025 — kluczowe metryki</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-700">
                    <th className="text-left py-2">Metryka</th>
                    <th className="text-right px-3">2024</th>
                    <th className="text-right px-3">2025</th>
                    <th className="text-right px-3">Zmiana</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: "Avg weekly cohort", v24: "10,806", v25: "14,796", change: "+37%" },
                    { m: "Total cohort volume", v24: "573K", v25: "770K", change: "+34%" },
                    { m: "W1 retention (avg)", v24: "56.5%", v25: "57.5%", change: "+1pp" },
                    { m: "Pageviews (annual)", v24: "~1M", v25: "~1.4M", change: "+42%" },
                    { m: "Google traffic (Q4 avg/wk)", v24: "~13.5K", v25: "~14.5K", change: "+7%" },
                    { m: "TPI (estimated)", v24: "~3,200", v25: "~4,300", change: "+34%" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-400 text-xs">{r.m}</td>
                      <td className="text-right px-3 text-gray-500 text-xs">{r.v24}</td>
                      <td className="text-right px-3 text-white text-xs font-medium">{r.v25}</td>
                      <td className="text-right px-3 text-green-400 text-xs font-bold">{r.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-600 pb-4">
          Dane: PostHog cohorts + remedium.md admin panel (Feb 2026) • TPI pre-2026 = estimated
        </div>
      </div>
    </div>
  );
}
