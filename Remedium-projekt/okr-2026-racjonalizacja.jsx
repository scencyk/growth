import { useState, useMemo } from "react";

const formatNum = (n) => n.toLocaleString("pl-PL");
const formatPLN = (n) => `${(n / 1000).toFixed(0)}K PLN`;

const CURRENT = {
  verifiedDoctors: 56854,
  optIn: 7165,
  optInRate: 12.6,
  tpi: 4568,
  bezSpecShare: 36.2,
  addressableMarket: 130000,
  penetration: 43.7,
  weeklyCohortsQ1_2026: 16949,
  weeklyCohortsQ4_2025: 16183,
  weeklyCohortsQ4_2024: 13028,
  w1Retention: 58.5,
};

const SCENARIOS = [
  {
    name: "Baseline",
    description: "Organiczny wzrost bez dodatkowych działań",
    newVerified: 5000,
    optInRate: 14,
    bezSpecShare: 35,
    color: "#94a3b8",
    confidence: 95,
  },
  {
    name: "Conservative",
    description: "Umiarkowane działania growth + opt-in campaigns",
    newVerified: 8000,
    optInRate: 17,
    bezSpecShare: 30,
    color: "#60a5fa",
    confidence: 80,
  },
  {
    name: "Commit",
    description: "Pełny plan growth z dedykowanym zespołem",
    newVerified: 12000,
    optInRate: 20,
    bezSpecShare: 25,
    color: "#34d399",
    confidence: 60,
  },
  {
    name: "Stretch",
    description: "Agresywny growth + nowe kanały akwizycji",
    newVerified: 18000,
    optInRate: 25,
    bezSpecShare: 20,
    color: "#f59e0b",
    confidence: 30,
  },
];

const SPECIALTIES_DATA = [
  { name: "Choroby Wewnętrzne", total: 4871, optin: 863, pharmaValue: 3 },
  { name: "Medycyna Rodzinna", total: 4389, optin: 703, pharmaValue: 3 },
  { name: "Pediatria", total: 3288, optin: 579, pharmaValue: 3 },
  { name: "Kardiologia", total: 1324, optin: 188, pharmaValue: 5 },
  { name: "Anestezjologia", total: 1550, optin: 195, pharmaValue: 2 },
  { name: "Psychiatria", total: 1310, optin: 119, pharmaValue: 4 },
  { name: "Położnictwo i Ginek.", total: 1277, optin: 180, pharmaValue: 3 },
  { name: "Chirurgia Ogólna", total: 1201, optin: 147, pharmaValue: 2 },
  { name: "Neurologia", total: 977, optin: 130, pharmaValue: 5 },
  { name: "Diabetologia", total: 359, optin: 66, pharmaValue: 5 },
  { name: "Onkologia Kliniczna", total: 344, optin: 40, pharmaValue: 5 },
];

const METHODOLOGY = [
  {
    id: "history",
    title: "Ekstrapolacja historyczna",
    icon: "📈",
    description: "Co mówią dane o organicznym trendzie?",
    details: [
      "Kohorty tygodniowe: 5K (2023) → 10K (Q1'24) → 13K (Q4'24) → 17K (Q1'26)",
      "Wzrost YoY kohort: +73% (2023→2024), +30% (2024→2025) — deceleracja",
      "Pageviews: +42% YoY (2024 vs 2025)",
      "Retencja W1: stabilna 55-64% — zdrowy produkt",
      "Wniosek: Organiczny wzrost ~15-20% rocznie w kohortach, decelerujący",
    ],
  },
  {
    id: "benchmark",
    title: "Benchmarki branżowe",
    icon: "🎯",
    description: "Co osiągają podobne platformy?",
    details: [
      "Doximity: 85% lekarzy USA, 720K aktywnych workflow users z 3M bazy (24%)",
      "Healthcare email opt-in: 14-37% (benchmark branżowy)",
      "Doximity revenue retention: 167% — ekspansja u istniejących klientów",
      "Remedium opt-in: 12.6% → jest PONIŻEJ benchmarku branżowego",
      "Wniosek: Ruch na 20% opt-in jest ambitny ale osiągalny vs benchmark 14-37%",
    ],
  },
  {
    id: "bottomup",
    title: "Model bottom-up",
    icon: "🔧",
    description: "Jakie działania dadzą jakie wyniki?",
    details: [
      "Weryfikacja przez Węzeł Krajowy → +5-8K nowych weryfikacji/rok",
      "Kampanie opt-in w aplikacji (pop-up + wartość) → +3-5pp opt-in rate",
      "Uzupełnianie specjalizacji (CRL lookup) → -10pp udział 'bez specjalizacji'",
      "SEO growth (Google +109% YoY) kontynuuje akwizycję top-of-funnel",
      "Wniosek: Każde działanie ma mierzalny, prognozowalny wpływ",
    ],
  },
  {
    id: "ceiling",
    title: "Analiza sufitu",
    icon: "🚧",
    description: "Gdzie są limity wzrostu?",
    details: [
      "Adresowalny rynek: ~130K praktykujących lekarzy w Polsce",
      "Aktualna penetracja: 43.7% (56,854 zweryfikowanych)",
      "Sufit realistyczny 2026: ~55% penetracji (72K zweryfikowanych)",
      "Sufit opt-in: 25-30% (benchmarki healthcare platform)",
      "Wniosek: Daleko od sufitu — room to grow jest duży",
    ],
  },
  {
    id: "revenue",
    title: "Linkowanie do revenue",
    icon: "💰",
    description: "Ile wart jest każdy przyrostowy lekarz?",
    details: [
      "TPI 4,568 → 7,000: +2,432 lekarzy × 250 PLN ARPU = +608K PLN/rok",
      "TPI 7,000 → 10,000: +3,000 lekarzy × 250 PLN ARPU = +750K PLN/rok",
      "Kardiologia (5x pharma value): 188 → 400 opt-in = ogromna wartość",
      "Premium specialties (onko, neuro, diabeto) mają najwyższy CPM",
      "Wniosek: Każdy lekarz-specjalista z opt-in to ~250-400 PLN/rok revenue",
    ],
  },
];

function BarChart({ data, maxVal, color, label }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="w-full rounded-t"
            style={{
              height: `${(val / maxVal) * 56}px`,
              backgroundColor: color || "#60a5fa",
              minHeight: "2px",
            }}
          />
          <span className="text-xs text-gray-400 mt-1">{label?.[i] || ""}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ title, current, target, unit = "", color = "#34d399" }) {
  const growth = ((target - current) / current) * 100;
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{title}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-gray-500 text-sm">{formatNum(current)}</span>
        <span className="text-gray-600">→</span>
        <span className="text-xl font-bold" style={{ color }}>
          {formatNum(target)}
        </span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className="mt-1 text-xs" style={{ color }}>
        +{growth.toFixed(0)}%
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = "#34d399", label }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function OKR2026Dashboard() {
  const [activeScenario, setActiveScenario] = useState(2);
  const [activeMethod, setActiveMethod] = useState(null);
  const [arpu, setArpu] = useState(250);
  const [view, setView] = useState("overview");

  const scenario = SCENARIOS[activeScenario];

  const projected = useMemo(() => {
    const s = SCENARIOS[activeScenario];
    const newBase = CURRENT.verifiedDoctors + s.newVerified;
    const totalOptIn = Math.round(newBase * (s.optInRate / 100));
    const tpi = Math.round(totalOptIn * (1 - s.bezSpecShare / 100));
    const penetration = ((newBase / CURRENT.addressableMarket) * 100).toFixed(1);
    const revenue = tpi * arpu;
    const revenueGrowth = ((revenue - CURRENT.tpi * arpu) / (CURRENT.tpi * arpu)) * 100;
    return { newBase, totalOptIn, tpi, penetration, revenue, revenueGrowth };
  }, [activeScenario, arpu]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Remedium Growth OKR 2026
          </h1>
          <p className="text-gray-400 text-sm">
            Racjonalizacja targetów — model oparty na danych
          </p>
        </div>

        {/* Nav */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Przegląd" },
            { id: "methodology", label: "Metodologia" },
            { id: "specialties", label: "Specjalizacje" },
            { id: "scenarios", label: "Scenariusze" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                view === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============ OVERVIEW ============ */}
        {view === "overview" && (
          <div className="space-y-6">
            {/* Scenario selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScenario(i)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    i === activeScenario
                      ? "border-2"
                      : "border-gray-700 opacity-60 hover:opacity-80"
                  }`}
                  style={{
                    borderColor: i === activeScenario ? s.color : undefined,
                  }}
                >
                  <div className="text-sm font-bold" style={{ color: s.color }}>
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Confidence: {s.confidence}%
                  </div>
                </button>
              ))}
            </div>

            {/* Description */}
            <div
              className="bg-gray-800 rounded-xl p-4 border-l-4"
              style={{ borderColor: scenario.color }}
            >
              <div className="text-sm text-gray-300">{scenario.description}</div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard
                title="Zweryfikowani lekarze"
                current={CURRENT.verifiedDoctors}
                target={projected.newBase}
                color={scenario.color}
              />
              <MetricCard
                title="Opt-in rate"
                current={CURRENT.optInRate}
                target={scenario.optInRate}
                unit="%"
                color={scenario.color}
              />
              <MetricCard
                title="TPI (North Star)"
                current={CURRENT.tpi}
                target={projected.tpi}
                color={scenario.color}
              />
              <MetricCard
                title="Pharma Revenue"
                current={CURRENT.tpi * arpu}
                target={projected.revenue}
                unit="PLN/rok"
                color={scenario.color}
              />
            </div>

            {/* ARPU slider */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">ARPU per TPI doctor</span>
                <span className="text-sm font-bold" style={{ color: scenario.color }}>
                  {arpu} PLN/rok
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={500}
                step={50}
                value={arpu}
                onChange={(e) => setArpu(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>100 PLN</span>
                <span>500 PLN</span>
              </div>
            </div>

            {/* Penetration + Opt-in bars */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="text-sm font-medium text-gray-300 mb-3">
                  Penetracja rynku
                </div>
                <ProgressBar
                  value={CURRENT.verifiedDoctors}
                  max={CURRENT.addressableMarket}
                  color="#94a3b8"
                  label={`Dziś: ${formatNum(CURRENT.verifiedDoctors)}`}
                />
                <ProgressBar
                  value={projected.newBase}
                  max={CURRENT.addressableMarket}
                  color={scenario.color}
                  label={`Target: ${formatNum(projected.newBase)}`}
                />
                <div className="text-xs text-gray-500 mt-2">
                  Adresowalny rynek: {formatNum(CURRENT.addressableMarket)} lekarzy
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="text-sm font-medium text-gray-300 mb-3">
                  Opt-in rate vs benchmark
                </div>
                <ProgressBar
                  value={CURRENT.optInRate}
                  max={37}
                  color="#94a3b8"
                  label={`Dziś: ${CURRENT.optInRate}%`}
                />
                <ProgressBar
                  value={scenario.optInRate}
                  max={37}
                  color={scenario.color}
                  label={`Target: ${scenario.optInRate}%`}
                />
                <ProgressBar
                  value={37}
                  max={37}
                  color="#374151"
                  label="Benchmark healthcare max: 37%"
                />
              </div>
            </div>

            {/* Revenue impact */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-300 mb-3">
                Revenue impact (TPI × ARPU)
              </div>
              <div className="flex items-end gap-3 h-32">
                {SCENARIOS.map((s, i) => {
                  const base = CURRENT.verifiedDoctors + s.newVerified;
                  const optins = Math.round(base * (s.optInRate / 100));
                  const tpi = Math.round(optins * (1 - s.bezSpecShare / 100));
                  const rev = tpi * arpu;
                  const maxRev = 6000000;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-400 mb-1">
                        {formatPLN(rev)}
                      </div>
                      <div
                        className="w-full rounded-t transition-all duration-300"
                        style={{
                          height: `${(rev / maxRev) * 96}px`,
                          backgroundColor: i === activeScenario ? s.color : s.color + "40",
                        }}
                      />
                      <div className="text-xs text-gray-500 mt-2">{s.name}</div>
                    </div>
                  );
                })}
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {formatPLN(CURRENT.tpi * arpu)}
                  </div>
                  <div
                    className="w-full rounded-t border border-dashed border-gray-600"
                    style={{
                      height: `${((CURRENT.tpi * arpu) / 6000000) * 96}px`,
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-2">Dziś</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ METHODOLOGY ============ */}
        {view === "methodology" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <h2 className="text-lg font-bold text-white mb-2">
                5 metod racjonalizacji targetów
              </h2>
              <p className="text-sm text-gray-400">
                Każdy target powinien być uzasadniony przynajmniej 2 z 5 metod.
                Kliknij aby rozwinąć szczegóły.
              </p>
            </div>

            {METHODOLOGY.map((m) => (
              <div
                key={m.id}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden cursor-pointer transition-all"
                onClick={() => setActiveMethod(activeMethod === m.id ? null : m.id)}
              >
                <div className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{m.title}</div>
                    <div className="text-xs text-gray-400">{m.description}</div>
                  </div>
                  <span className="text-gray-500 text-xl">
                    {activeMethod === m.id ? "−" : "+"}
                  </span>
                </div>
                {activeMethod === m.id && (
                  <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                    <ul className="space-y-2">
                      {m.details.map((d, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-gray-600 shrink-0">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Methodology matrix */}
            <div className="bg-gray-800 rounded-xl p-4 mt-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3">
                Matryca uzasadnień dla rekomendowanego scenariusza (Commit)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-700">
                      <th className="text-left py-2 pr-4">KR</th>
                      <th className="text-center px-2">Trend</th>
                      <th className="text-center px-2">Bench.</th>
                      <th className="text-center px-2">Bottom-up</th>
                      <th className="text-center px-2">Sufit</th>
                      <th className="text-center px-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { kr: "Verified doctors → 69K", checks: [true, true, true, true, false] },
                      { kr: "Opt-in rate → 20%", checks: [false, true, true, true, true] },
                      { kr: "Bez-spec share → 25%", checks: [false, false, true, true, true] },
                      { kr: "TPI → 10,327", checks: [false, true, true, true, true] },
                      { kr: "Pharma panel MVP", checks: [false, true, false, false, true] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-700/50">
                        <td className="py-2 pr-4 text-gray-300">{row.kr}</td>
                        {row.checks.map((c, j) => (
                          <td key={j} className="text-center px-2">
                            {c ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============ SPECIALTIES ============ */}
        {view === "specialties" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-1">
                Gap analysis per specjalizacja
              </h2>
              <p className="text-sm text-gray-400">
                Opt-in gap = potencjał wzrostu TPI. Pharma value = wartość monetyzacyjna.
              </p>
            </div>

            {SPECIALTIES_DATA.sort((a, b) => (b.total - b.optin) * b.pharmaValue - (a.total - a.optin) * a.pharmaValue).map((s) => {
              const rate = ((s.optin / s.total) * 100).toFixed(1);
              const gap = s.total - s.optin;
              const weightedGap = gap * s.pharmaValue;
              return (
                <div
                  key={s.name}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-bold text-white">{s.name}</span>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                i < s.pharmaValue ? "#f59e0b" : "#374151",
                            }}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">pharma value</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">opt-in rate</div>
                      <div className="text-sm font-bold text-blue-400">{rate}%</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {formatNum(s.optin)} / {formatNum(s.total)} lekarzy
                      </span>
                      <span className="text-amber-400">gap: {formatNum(gap)}</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 rounded-l-full"
                        style={{ width: `${(s.optin / s.total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-amber-500/30"
                        style={{
                          width: `${((s.total - s.optin) / s.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============ SCENARIOS ============ */}
        {view === "scenarios" && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-1">
                Porównanie scenariuszy
              </h2>
              <p className="text-sm text-gray-400">
                Baseline = robisz minimum. Commit = rekomendowany. Stretch = all-in.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-700">
                    <th className="text-left py-3 pr-3">Metryka</th>
                    <th className="text-center px-2 text-gray-600">Dziś</th>
                    {SCENARIOS.map((s) => (
                      <th
                        key={s.name}
                        className="text-center px-2"
                        style={{ color: s.color }}
                      >
                        {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Verified doctors",
                      current: CURRENT.verifiedDoctors,
                      values: SCENARIOS.map(
                        (s) => CURRENT.verifiedDoctors + s.newVerified
                      ),
                    },
                    {
                      label: "Penetracja rynku",
                      current: `${CURRENT.penetration}%`,
                      values: SCENARIOS.map(
                        (s) =>
                          `${(
                            ((CURRENT.verifiedDoctors + s.newVerified) /
                              CURRENT.addressableMarket) *
                            100
                          ).toFixed(1)}%`
                      ),
                    },
                    {
                      label: "Opt-in rate",
                      current: `${CURRENT.optInRate}%`,
                      values: SCENARIOS.map((s) => `${s.optInRate}%`),
                    },
                    {
                      label: "Total opt-ins",
                      current: CURRENT.optIn,
                      values: SCENARIOS.map((s) =>
                        Math.round(
                          (CURRENT.verifiedDoctors + s.newVerified) *
                            (s.optInRate / 100)
                        )
                      ),
                    },
                    {
                      label: "Bez-spec share",
                      current: `${CURRENT.bezSpecShare}%`,
                      values: SCENARIOS.map((s) => `${s.bezSpecShare}%`),
                    },
                    {
                      label: "TPI (North Star)",
                      current: CURRENT.tpi,
                      values: SCENARIOS.map((s) => {
                        const base = CURRENT.verifiedDoctors + s.newVerified;
                        const optins = Math.round(base * (s.optInRate / 100));
                        return Math.round(optins * (1 - s.bezSpecShare / 100));
                      }),
                    },
                    {
                      label: "TPI growth",
                      current: "—",
                      values: SCENARIOS.map((s) => {
                        const base = CURRENT.verifiedDoctors + s.newVerified;
                        const optins = Math.round(base * (s.optInRate / 100));
                        const tpi = Math.round(optins * (1 - s.bezSpecShare / 100));
                        return `+${(
                          ((tpi - CURRENT.tpi) / CURRENT.tpi) *
                          100
                        ).toFixed(0)}%`;
                      }),
                    },
                    {
                      label: `Revenue (ARPU ${arpu})`,
                      current: formatPLN(CURRENT.tpi * arpu),
                      values: SCENARIOS.map((s) => {
                        const base = CURRENT.verifiedDoctors + s.newVerified;
                        const optins = Math.round(base * (s.optInRate / 100));
                        const tpi = Math.round(optins * (1 - s.bezSpecShare / 100));
                        return formatPLN(tpi * arpu);
                      }),
                    },
                    {
                      label: "Confidence",
                      current: "—",
                      values: SCENARIOS.map((s) => `${s.confidence}%`),
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-700/50 hover:bg-gray-800/50"
                    >
                      <td className="py-2 pr-3 text-gray-400 text-xs">
                        {row.label}
                      </td>
                      <td className="text-center px-2 text-gray-600 text-xs">
                        {typeof row.current === "number"
                          ? formatNum(row.current)
                          : row.current}
                      </td>
                      {row.values.map((v, j) => (
                        <td
                          key={j}
                          className="text-center px-2 text-xs font-medium"
                          style={{ color: SCENARIOS[j].color }}
                        >
                          {typeof v === "number" ? formatNum(v) : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 mt-4">
              <div className="text-sm font-bold text-green-400 mb-2">
                Rekomendacja: Commit jako oficjalny OKR
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  Scenariusz <strong>Commit</strong> (+126% TPI) jest rekomendowany jako
                  oficjalny target, ponieważ:
                </p>
                <p>
                  1. Opt-in 20% mieści się w benchmarku branżowym (14-37%) —
                  osiągalny z dedykowanymi kampaniami.
                </p>
                <p>
                  2. +12K weryfikacji wymaga automatyzacji (Węzeł Krajowy) +
                  organic growth — ambitny ale nie wymaga cudu.
                </p>
                <p>
                  3. TPI 10K+ to próg, przy którym pharma panel staje się
                  atrakcyjny dla top 10 firm farmaceutycznych.
                </p>
                <p>
                  4. Revenue impact: z ~1.1M na ~2.6M PLN/rok (+126%) — uzasadnia
                  inwestycję w zespół growth.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600 pb-4">
          Dane: remedium.md (7 luty 2026) • Benchmarki: Doximity, healthcare industry
          2025 • Model: Remedium Growth Team
        </div>
      </div>
    </div>
  );
}
