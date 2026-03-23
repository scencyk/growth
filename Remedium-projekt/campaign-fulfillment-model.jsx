import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const COLORS = {
  green: "#10B981", red: "#EF4444", yellow: "#F59E0B", blue: "#3B82F6",
  purple: "#8B5CF6", gray: "#6B7280", darkBg: "#0F172A", cardBg: "#1E293B",
  cardBorder: "#334155", lightText: "#94A3B8", white: "#F8FAFC",
  emerald: "#34D399", amber: "#FBBF24", rose: "#FB7185"
};

// === DATA ===
const specialtyData = [
  { name: "ALL / Lekarze", remedium: 22733, nil: 91100, cover: 25.0, pvOffer: 20000, avgPv2024: 17889, campaigns2024: 87, price: 8000, category: "broad", canFulfill: "yes" },
  { name: "POZ", remedium: 7036, nil: 29000, cover: 24.3, pvOffer: 20000, avgPv2024: 16916, campaigns2024: 27, price: 8000, category: "broad", canFulfill: "yes" },
  { name: "Kardiologia", remedium: 1896, nil: 6411, cover: 29.6, pvOffer: 2900, avgPv2024: 1463, campaigns2024: 26, price: 1392, category: "duza", canFulfill: "marginal" },
  { name: "Ginekologia", remedium: 1513, nil: 7419, cover: 20.4, pvOffer: 2900, avgPv2024: 339, campaigns2024: 9, price: 1392, category: "duza", canFulfill: "no" },
  { name: "Diabetologia", remedium: 629, nil: 3054, cover: 20.6, pvOffer: 1000, avgPv2024: 4040, campaigns2024: 2, price: 800, category: "mala", canFulfill: "yes" },
  { name: "Psychiatria", remedium: 476, nil: 4825, cover: 9.9, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "no" },
  { name: "Neurologia", remedium: 788, nil: 4120, cover: 19.1, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "unknown" },
  { name: "Pulmonologia", remedium: 557, nil: 3299, cover: 16.9, pvOffer: 1000, avgPv2024: 2062, campaigns2024: 1, price: 800, category: "mala", canFulfill: "yes" },
  { name: "Gastroenterologia", remedium: 231, nil: 1249, cover: 18.5, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "no" },
  { name: "Reumatologia", remedium: 314, nil: 1843, cover: 17.0, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "unknown" },
  { name: "Endokrynologia", remedium: 377, nil: 1828, cover: 20.6, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "unknown" },
  { name: "Nefrologia", remedium: 280, nil: 1468, cover: 19.1, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "unknown" },
  { name: "Ortopedia", remedium: 1162, nil: 3430, cover: 33.9, pvOffer: 2900, avgPv2024: 0, campaigns2024: 0, price: 1392, category: "duza", canFulfill: "unknown" },
  { name: "Onkologia", remedium: 621, nil: 1556, cover: 39.9, pvOffer: 1000, avgPv2024: 0, campaigns2024: 0, price: 800, category: "mala", canFulfill: "yes" },
];

const campaignsPace2026 = [
  { name: "Egis Xiltess (POZ)", target: "POZ + bez spec", ordered: 20000, delivered: 1525, pctTime: 7, status: "on_track" },
  { name: "Egis Xiltess (Kardio)", target: "Kardiolodzy", ordered: 2500, delivered: 224, pctTime: 7, status: "on_track" },
  { name: "Bayer Dicoflor", target: "Odb. reklam leków", ordered: 42000, delivered: 1307, pctTime: 5, status: "behind" },
  { name: "Adamed Diabetologia", target: "Lekarze", ordered: 20000, delivered: 3229, pctTime: 4, status: "on_track" },
  { name: "Chiesi Trimbow", target: "Alergol+Pulmo", ordered: 1700, delivered: 1717, pctTime: 33, status: "done" },
  { name: "Qpharma Xsysto", target: "Lekarze", ordered: 20000, delivered: 10445, pctTime: 47, status: "on_track" },
  { name: "Merck Euthyrox", target: "Lekarze", ordered: 16000, delivered: 13552, pctTime: 47, status: "on_track" },
  { name: "Adamed Ramizek", target: "Lekarze", ordered: 25000, delivered: 22219, pctTime: 47, status: "on_track" },
  { name: "Egis Agomelatyna", target: "Lekarze", ordered: 22000, delivered: 21793, pctTime: 47, status: "on_track" },
  { name: "Egis Milurit", target: "Lekarze", ordered: 20000, delivered: 20925, pctTime: 47, status: "done" },
  { name: "Glenmark", target: "Alerg+POZ", ordered: 20000, delivered: 20272, pctTime: 47, status: "done" },
  { name: "Egis Sorbifer", target: "Lekarze", ordered: 20000, delivered: 13070, pctTime: 47, status: "on_track" },
  { name: "Merck Glucophage", target: "Lekarze", ordered: 16000, delivered: 9660, pctTime: 47, status: "on_track" },
  { name: "MagnaPharm Arthryl", target: "POZ + bez spec", ordered: 21000, delivered: 8155, pctTime: 47, status: "behind" },
  { name: "Adamed Ramizek (K)", target: "Kardiolodzy", ordered: 2700, delivered: 2714, pctTime: 47, status: "done" },
  { name: "Klosterfrau NeoAngin", target: "Lekarze", ordered: 21000, delivered: 9814, pctTime: 47, status: "on_track" },
  { name: "Qpharma Urovaxom", target: "Odb. reklam leków", ordered: 20000, delivered: 11952, pctTime: 50, status: "on_track" },
  { name: "Exeltis Bonjesta", target: "Ginekologia+POZ", ordered: 20000, delivered: 18957, pctTime: 93, status: "on_track" },
  { name: "InFakt KSeF", target: "Wszyscy", ordered: 20000, delivered: 21463, pctTime: 79, status: "done" },
];

const pricingModel = {
  broad: { label: "ALL / POZ", pvMonth: 20000, price: 8000 },
  duza: { label: "Duże specjalizacje (>1200 wg NIL)", pvMonth: 2900, price: 1392 },
  mala: { label: "Małe specjalizacje (<1200 wg NIL)", pvMonth: 1000, price: 800 },
};

export default function CampaignFulfillmentModel() {
  const [tab, setTab] = useState("overview");
  const [growthTarget, setGrowthTarget] = useState(30);

  const tabs = [
    { id: "overview", label: "Model biznesowy" },
    { id: "fulfillment", label: "Realizacja kampanii" },
    { id: "bottlenecks", label: "Wąskie gardła" },
    { id: "growth", label: "Growth levers" },
  ];

  return (
    <div style={{ background: COLORS.darkBg, color: COLORS.white, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Remedium Growth Model</h1>
        <p style={{ color: COLORS.lightText, fontSize: 14, marginBottom: 24 }}>Campaign Fulfillment Rate jako North Star</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: tab === t.id ? COLORS.blue : COLORS.cardBg, color: tab === t.id ? "#fff" : COLORS.lightText }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab />}
        {tab === "fulfillment" && <FulfillmentTab />}
        {tab === "bottlenecks" && <BottlenecksTab growthTarget={growthTarget} setGrowthTarget={setGrowthTarget} />}
        {tab === "growth" && <GrowthTab />}
      </div>
    </div>
  );
}

function KPI({ label, value, sub, color }) {
  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.cardBorder}`, flex: 1, minWidth: 200 }}>
      <div style={{ color: COLORS.lightText, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || COLORS.white }}>{value}</div>
      {sub && <div style={{ color: COLORS.lightText, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, children, style }) {
  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.cardBorder}`, ...style }}>
      {title && <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: COLORS.white }}>{title}</h3>}
      {children}
    </div>
  );
}

function OverviewTab() {
  const totalCampaigns2024 = specialtyData.reduce((s, d) => s + d.campaigns2024, 0);
  const totalPv2024 = specialtyData.reduce((s, d) => s + d.avgPv2024 * d.campaigns2024, 0);
  const broadRevenue = specialtyData.filter(d => d.category === "broad").reduce((s, d) => s + d.campaigns2024 * d.price, 0);
  const specRevenue = specialtyData.filter(d => d.category !== "broad").reduce((s, d) => s + d.campaigns2024 * d.price, 0);

  const revenueByCategory = [
    { name: "ALL/POZ\n(broad)", campaigns: 114, revenue: broadRevenue, pv: specialtyData.filter(d => d.category === "broad").reduce((s, d) => s + d.avgPv2024 * d.campaigns2024, 0) },
    { name: "Duże spec.\n(>1200)", campaigns: 35, revenue: 35 * 1392, pv: specialtyData.filter(d => d.category === "duza").reduce((s, d) => s + d.avgPv2024 * d.campaigns2024, 0) },
    { name: "Małe spec.\n(<1200)", campaigns: 3, revenue: 3 * 800, pv: specialtyData.filter(d => d.category === "mala").reduce((s, d) => s + d.avgPv2024 * d.campaigns2024, 0) },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Kampanie display 2024" value={totalCampaigns2024} sub="banerów z danymi PV" />
        <KPI label="Model cenowy" value="3 tiers" sub="ALL 8K / Duże 1.4K / Małe 0.8K PLN" />
        <KPI label="Lekarze w Remedium" value="22,733" sub="specjaliści (bez dentystów)" color={COLORS.blue} />
        <KPI label="Penetracja rynku" value="25%" sub="z 91,100 specjalistów w PL" color={COLORS.amber} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card title="Model cenowy display (PLN/miesiąc)">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(pricingModel).map(([key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, background: "rgba(59,130,246,0.1)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{val.label}</div>
                  <div style={{ color: COLORS.lightText, fontSize: 12 }}>{val.pvMonth.toLocaleString()} PV/miesiąc</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue }}>{val.price.toLocaleString()} PLN</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Struktura kampanii 2024">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.cardBorder} />
              <XAxis type="number" tick={{ fill: COLORS.lightText, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fill: COLORS.lightText, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.white }} />
              <Bar dataKey="campaigns" fill={COLORS.blue} name="Liczba kampanii" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ color: COLORS.lightText, fontSize: 12, marginTop: 8 }}>
            87% kampanii to target ALL/POZ. Specjalizacje = niewykorzystany potencjał revenue.
          </p>
        </Card>
      </div>

      <Card title="Kluczowy insight: model biznesowy Remedium">
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 16px", fontSize: 14, lineHeight: 1.6 }}>
          <div style={{ color: COLORS.blue, fontWeight: 700 }}>1.</div>
          <div>Pharma płaci <strong>fix kwotę</strong> za kampanię z określonym KPI (impressions/clicks), targetowaną po specjalizacji</div>
          <div style={{ color: COLORS.blue, fontWeight: 700 }}>2.</div>
          <div><strong>Campaign Fulfillment Rate</strong> = % zrealizowanych KPI kampanii. Bezpośrednio wpływa na retencję klientów i przychód</div>
          <div style={{ color: COLORS.blue, fontWeight: 700 }}>3.</div>
          <div><strong>Active Prescribers per Specialty (APS)</strong> = MAU lekarzy z daną specjalizacją. Determinuje pojemność kampanii</div>
          <div style={{ color: COLORS.blue, fontWeight: 700 }}>4.</div>
          <div>Opt-in / zgoda marketingowa <strong>nie jest kluczowa</strong> — liczy się ruch na platformie i wyświetlenia reklam display</div>
        </div>
      </Card>
    </div>
  );
}

function FulfillmentTab() {
  const chartData = campaignsPace2026.map(c => ({
    ...c,
    fulfillment: Math.round(c.delivered / c.ordered * 100),
    expectedPct: c.pctTime,
    paceRatio: Math.round((c.delivered / c.ordered * 100) / c.pctTime * 100) / 100,
  })).sort((a, b) => b.fulfillment - a.fulfillment);

  const done = chartData.filter(c => c.status === "done").length;
  const onTrack = chartData.filter(c => c.status === "on_track").length;
  const behind = chartData.filter(c => c.status === "behind").length;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Kampanie marzec 2026" value={chartData.length} sub="aktywnych display" />
        <KPI label="Zrealizowane" value={done} sub="KPI osiągnięte" color={COLORS.green} />
        <KPI label="Na dobrej drodze" value={onTrack} sub="pace OK" color={COLORS.amber} />
        <KPI label="Opóźnione" value={behind} sub="pace poniżej oczekiwań" color={COLORS.red} />
      </div>

      <Card title="Realizacja kampanii vs upływ czasu (marzec 2026)" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 160 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.cardBorder} />
            <XAxis type="number" domain={[0, 120]} tick={{ fill: COLORS.lightText, fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" width={155} tick={{ fill: COLORS.lightText, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.white }}
              formatter={(v, n) => [`${v}%`, n === "fulfillment" ? "Realizacja KPI" : "Upływ czasu"]} />
            <Bar dataKey="fulfillment" name="Realizacja KPI" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fulfillment >= 100 ? COLORS.green : entry.fulfillment >= 60 ? COLORS.amber : COLORS.rose} />
              ))}
            </Bar>
            <Bar dataKey="expectedPct" name="Upływ czasu" fill="rgba(148,163,184,0.3)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ color: COLORS.lightText, fontSize: 12, marginTop: 8 }}>
          Zielone = KPI zrealizowane. Żółte = w trakcie, dobry pace. Różowe = realizacja poniżej 60% — ryzyko niedowiezienia.
        </p>
      </Card>

      <Card title="Pace ratio: realizacja / upływ czasu">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {chartData.map((c, i) => {
            const pace = c.paceRatio;
            const color = pace >= 1.5 ? COLORS.green : pace >= 0.8 ? COLORS.amber : COLORS.red;
            return (
              <div key={i} style={{ padding: 12, borderRadius: 8, background: "rgba(30,41,59,0.5)", border: `1px solid ${COLORS.cardBorder}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: COLORS.lightText, marginBottom: 8 }}>{c.target}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color }}>{pace.toFixed(1)}x</span>
                  <span style={{ fontSize: 11, color: COLORS.lightText }}>{c.delivered.toLocaleString()} / {c.ordered.toLocaleString()} PV</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function BottlenecksTab({ growthTarget, setGrowthTarget }) {
  const bottleneckData = specialtyData.filter(d => d.category !== "broad").map(d => {
    const mau = Math.round(d.remedium * 0.5);
    const pvCapacity = mau * 16;
    const targetDoctors = Math.round(d.remedium * (1 + growthTarget / 100));
    const targetMau = Math.round(targetDoctors * 0.5);
    const targetPvCapacity = targetMau * 16;
    return {
      ...d,
      mau,
      pvCapacity,
      fulfillsOffer: pvCapacity >= d.pvOffer,
      gap: Math.max(0, d.pvOffer - pvCapacity),
      targetDoctors,
      targetMau,
      targetPvCapacity,
      targetFulfills: targetPvCapacity >= d.pvOffer,
      doctorsNeeded: Math.max(0, Math.ceil((d.pvOffer - pvCapacity) / 16 / 0.5)),
    };
  }).sort((a, b) => a.cover - b.cover);

  const canFulfillNow = bottleneckData.filter(d => d.fulfillsOffer).length;
  const canFulfillAfter = bottleneckData.filter(d => d.targetFulfills).length;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Specjalizacje analizowane" value={bottleneckData.length} sub="poza ALL/POZ" />
        <KPI label="Spełnia PV offer dziś" value={`${canFulfillNow}/${bottleneckData.length}`} color={canFulfillNow > 8 ? COLORS.green : COLORS.amber} sub="na podstawie est. MAU" />
        <KPI label={`Po wzroście +${growthTarget}%`} value={`${canFulfillAfter}/${bottleneckData.length}`} color={canFulfillAfter > 10 ? COLORS.green : COLORS.amber} sub="specjalizacji spełni offer" />
      </div>

      <Card title="Symulacja: wzrost bazy lekarzy vs zdolność realizacji kampanii" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: COLORS.lightText }}>Cel wzrostu bazy per specjalizacja:</label>
          <input type="range" min={0} max={100} value={growthTarget} onChange={e => setGrowthTarget(Number(e.target.value))}
            style={{ flex: 1, maxWidth: 300 }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.blue }}>+{growthTarget}%</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.cardBorder}` }}>
                {["Specjalizacja", "Remedium", "Cover %", "Est. MAU", "PV cap/msc", "PV offer", "Status", `Po +${growthTarget}%`, "Nowy status"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: COLORS.lightText, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bottleneckData.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                  <td style={{ padding: "8px 10px", fontWeight: 600 }}>{d.name}</td>
                  <td style={{ padding: "8px 10px" }}>{d.remedium.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", color: d.cover < 20 ? COLORS.red : d.cover < 30 ? COLORS.amber : COLORS.green }}>{d.cover}%</td>
                  <td style={{ padding: "8px 10px" }}>{d.mau.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px" }}>{d.pvCapacity.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", fontWeight: 600 }}>{d.pvOffer.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: d.fulfillsOffer ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                      color: d.fulfillsOffer ? COLORS.green : COLORS.red }}>
                      {d.fulfillsOffer ? "OK" : `brak ${d.gap.toLocaleString()} PV`}
                    </span>
                  </td>
                  <td style={{ padding: "8px 10px", color: COLORS.blue }}>{d.targetDoctors.toLocaleString()}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: d.targetFulfills ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                      color: d.targetFulfills ? COLORS.green : COLORS.red }}>
                      {d.targetFulfills ? "OK" : "nadal brak"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: COLORS.lightText, fontSize: 11, marginTop: 12 }}>
          Est. MAU = 50% bazy. PV capacity = MAU × 16 PV/user/miesiąc (szacunek na podstawie danych 2024).
        </p>
      </Card>

      <Card title="Penetracja rynku vs pojemność PV — mapa priorytetów">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={bottleneckData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.cardBorder} />
            <XAxis dataKey="name" tick={{ fill: COLORS.lightText, fontSize: 10 }} angle={-30} textAnchor="end" height={80} />
            <YAxis tick={{ fill: COLORS.lightText, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.white }} />
            <Bar dataKey="pvCapacity" name="PV capacity/msc" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
            <Bar dataKey="pvOffer" name="PV offer (sprzedawany)" fill="rgba(239,68,68,0.5)" radius={[4, 4, 0, 0]} />
            <Legend wrapperStyle={{ color: COLORS.lightText, fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function GrowthTab() {
  const levers = [
    {
      title: "Lever 1: Zwiększ penetrację w bottleneck specialties",
      impact: "Wysoki",
      effort: "Średni",
      details: "Psychiatria (9.9%), Pulmonologia (16.9%), Reumatologia (17%), Gastroenterologia (18.5%) — kampanie akwizycyjne targetowane na te specjalizacje",
      metrics: "Cel: +50% lekarzy w bottom 5 specjalizacjach w 12 miesięcy",
      color: COLORS.green,
    },
    {
      title: "Lever 2: Zwiększ engagement (MAU) istniejącej bazy",
      impact: "Bardzo wysoki",
      effort: "Wysoki",
      details: "Jeśli MAU wzrośnie z 50% do 65%, pojemność PV rośnie o 30% bez ani jednej nowej rejestracji. Content per specialty, personalizacja dashboardu, powiadomienia push",
      metrics: "Cel: MAU/baza z 50% do 65% w 12 miesięcy",
      color: COLORS.blue,
    },
    {
      title: "Lever 3: Więcej PV per session (depth of visit)",
      impact: "Średni",
      effort: "Niski",
      details: "Optymalizacja layoutu, więcej slotów reklamowych, rekomendacje treści per specjalizacja — więcej pageviews = więcej impressions per user",
      metrics: "Cel: PV/session z 4 do 6 (+50%)",
      color: COLORS.purple,
    },
    {
      title: "Lever 4: Rezydenci → przyszli specjaliści",
      impact: "Średni (long-term)",
      effort: "Niski",
      details: "15,138 rezydentów w bazie. Za 2-5 lat to specjaliści z wypisywaniem recept. Utrzymuj retencję, buduj nawyk",
      metrics: "Cel: retencja rezydentów >80% rok do roku",
      color: COLORS.amber,
    },
  ];

  const impactMatrix = [
    { lever: "Penetracja spec.", pvImpact: 35, revenueImpact: 40, effort: 50, timeToImpact: 60 },
    { lever: "MAU engagement", pvImpact: 50, revenueImpact: 45, effort: 70, timeToImpact: 40 },
    { lever: "PV per session", pvImpact: 30, revenueImpact: 25, effort: 20, timeToImpact: 80 },
    { lever: "Retencja rezydent.", pvImpact: 15, revenueImpact: 15, effort: 15, timeToImpact: 10 },
  ];

  const scenarioData = [
    { month: "Mar 2026", base: 100, withLevers: 100 },
    { month: "Jun 2026", base: 102, withLevers: 112 },
    { month: "Sep 2026", base: 105, withLevers: 128 },
    { month: "Dec 2026", base: 108, withLevers: 148 },
    { month: "Mar 2027", base: 110, withLevers: 165 },
    { month: "Jun 2027", base: 112, withLevers: 180 },
  ];

  return (
    <div>
      <Card title="4 Growth Levers — od największego wpływu" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {levers.map((l, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 8, border: `1px solid ${l.color}33`, background: `${l.color}0D` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: l.color, margin: 0 }}>{l.title}</h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(16,185,129,0.2)", color: COLORS.green }}>
                    Impact: {l.impact}
                  </span>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(245,158,11,0.2)", color: COLORS.amber }}>
                    Effort: {l.effort}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: COLORS.lightText, margin: "0 0 8px" }}>{l.details}</p>
              <p style={{ fontSize: 12, color: COLORS.white, margin: 0, fontWeight: 600 }}>{l.metrics}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Impact matrix — radar">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={impactMatrix}>
              <PolarGrid stroke={COLORS.cardBorder} />
              <PolarAngleAxis dataKey="lever" tick={{ fill: COLORS.lightText, fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: COLORS.lightText, fontSize: 10 }} />
              <Radar name="PV Impact" dataKey="pvImpact" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.3} />
              <Radar name="Effort" dataKey="effort" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.15} />
              <Legend wrapperStyle={{ color: COLORS.lightText, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Scenariusz: Campaign Fulfillment Capacity Index (baza=100)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.cardBorder} />
              <XAxis dataKey="month" tick={{ fill: COLORS.lightText, fontSize: 11 }} />
              <YAxis domain={[90, 200]} tick={{ fill: COLORS.lightText, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.white }} />
              <Line type="monotone" dataKey="base" name="Organic only" stroke={COLORS.gray} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="withLevers" name="Z growth levers" stroke={COLORS.green} strokeWidth={3} dot={{ r: 4 }} />
              <Legend wrapperStyle={{ color: COLORS.lightText, fontSize: 12 }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ color: COLORS.lightText, fontSize: 11, marginTop: 8 }}>
            Organic: +2-3%/Q. Z levers: +10-15%/Q (engagement + penetracja + depth)
          </p>
        </Card>
      </div>

      <Card title="North Star Framework — podsumowanie" style={{ marginTop: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(59,130,246,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: COLORS.lightText, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>North Star</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blue }}>Campaign Fulfillment Rate</div>
            <div style={{ fontSize: 12, color: COLORS.lightText, marginTop: 4 }}>% KPI zrealizowanych</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(16,185,129,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: COLORS.lightText, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Input metric</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.green }}>Active Prescribers / Spec</div>
            <div style={{ fontSize: 12, color: COLORS.lightText, marginTop: 4 }}>MAU lekarzy z specjalizacją</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(139,92,246,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: COLORS.lightText, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Output metric</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.purple }}>Revenue per Specialty</div>
            <div style={{ fontSize: 12, color: COLORS.lightText, marginTop: 4 }}>kampanii × cena × fulfill%</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
