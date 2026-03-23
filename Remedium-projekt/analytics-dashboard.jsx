import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Area
} from "recharts";

const COLORS = {
  primary: "#2e35ff",
  specialist: "#10b981",
  resident: "#3b82f6",
  intern: "#f59e0b",
  noSpec: "#94a3b8",
  student: "#8b5cf6",
  doctor: "#2e35ff",
  other: "#d1d5db",
  accent1: "#ec4899",
  accent2: "#06b6d4",
};

const tabs = [
  { id: "roles", label: "Role per feature" },
  { id: "doctors", label: "Statusy lekarzy" },
  { id: "vod", label: "Trend VOD" },
  { id: "lifecycle", label: "Student lifecycle" },
  { id: "pharma", label: "Wartość dla pharmy" },
];

// === DATA ===

const featureRoles = [
  { feature: "Artykuły", doctor: 10423, student: 4882, other: 690, total: 15995 },
  { feature: "Kalkulatory", doctor: 9237, student: 3631, other: 472, total: 13340 },
  { feature: "Enc. rezydentur", doctor: 5622, student: 3978, other: 131, total: 9731 },
  { feature: "Konferencje", doctor: 6134, student: 1894, other: 389, total: 8417 },
  { feature: "ICD-10", doctor: 4999, student: 959, other: 252, total: 6210 },
  { feature: "VOD", doctor: 3930, student: 701, other: 288, total: 4919 },
  { feature: "Poradniki", doctor: 3491, student: 1037, other: 273, total: 4801 },
  { feature: "Egzaminy", doctor: 1746, student: 1834, other: 205, total: 3785 },
  { feature: "Meds (leki)", doctor: 2101, student: 780, other: 283, total: 3164 },
  { feature: "Kursy", doctor: 1687, student: 545, other: 163, total: 2395 },
  { feature: "Przypadki klin.", doctor: 957, student: 391, other: 99, total: 1447 },
];

const featureRolesPercent = featureRoles.map((f) => ({
  feature: f.feature,
  "Lekarz %": Math.round((f.doctor / f.total) * 100),
  "Student %": Math.round((f.student / f.total) * 100),
  "Inni %": Math.round((f.other / f.total) * 100),
}));

const doctorStatus = [
  { feature: "VOD", specialist: 804, resident: 984, intern: 435, noSpec: 1704, specPct: 20 },
  { feature: "Konferencje", specialist: 1084, resident: 1441, intern: 827, noSpec: 2779, specPct: 18 },
  { feature: "Kursy", specialist: 302, resident: 450, intern: 196, noSpec: 736, specPct: 18 },
  { feature: "Artykuły", specialist: 1221, resident: 2339, intern: 1609, noSpec: 5245, specPct: 12 },
  { feature: "Przypadki klin.", specialist: 118, resident: 270, intern: 146, noSpec: 423, specPct: 12 },
  { feature: "Poradniki", specialist: 393, resident: 953, intern: 413, noSpec: 1731, specPct: 11 },
  { feature: "Kalkulatory", specialist: 954, resident: 2079, intern: 1477, noSpec: 4704, specPct: 10 },
  { feature: "Egzaminy", specialist: 170, resident: 505, intern: 233, noSpec: 837, specPct: 10 },
  { feature: "ICD-10", specialist: 471, resident: 1278, intern: 520, noSpec: 2711, specPct: 9 },
  { feature: "Meds (leki)", specialist: 191, resident: 568, intern: 212, noSpec: 1129, specPct: 9 },
  { feature: "Enc. rezydentur", specialist: 159, resident: 1070, intern: 1181, noSpec: 3207, specPct: 3 },
];

const doctorStatusPercent = doctorStatus.map((d) => {
  const total = d.specialist + d.resident + d.intern + d.noSpec;
  return {
    feature: d.feature,
    "Specjalista %": Math.round((d.specialist / total) * 100),
    "Rezydent %": Math.round((d.resident / total) * 100),
    "Stażysta %": Math.round((d.intern / total) * 100),
    "Bez spec. %": Math.round((d.noSpec / total) * 100),
  };
});

const vodTrend = [
  { month: "Lip 24", pv: 9000, uu: 1500 },
  { month: "Sie 24", pv: 11000, uu: 1800 },
  { month: "Wrz 24", pv: 22000, uu: 3200 },
  { month: "Paź 24", pv: 31000, uu: 3800 },
  { month: "Lis 24", pv: 39000, uu: 4300 },
  { month: "Gru 24", pv: 28000, uu: 3400 },
  { month: "Sty 25", pv: 33000, uu: 4000 },
  { month: "Lut 25", pv: 30000, uu: 3600 },
  { month: "Mar 25", pv: 26000, uu: 3300 },
  { month: "Kwi 25", pv: 28000, uu: 3500 },
  { month: "Maj 25", pv: 30000, uu: 3700 },
  { month: "Cze 25", pv: 32000, uu: 3900 },
  { month: "Lip 25", pv: 27000, uu: 3400 },
  { month: "Sie 25", pv: 25000, uu: 3200 },
  { month: "Wrz 25", pv: 35000, uu: 4800 },
  { month: "Paź 25", pv: 42000, uu: 5400 },
  { month: "Lis 25", pv: 48000, uu: 5800 },
  { month: "Gru 25", pv: 38000, uu: 4600 },
  { month: "Sty 26", pv: 50000, uu: 5900 },
  { month: "Lut 26", pv: 46000, uu: 5500 },
];

const examsTrend = [
  { month: "Lip 24", students: 258 },
  { month: "Sie 24", students: 502 },
  { month: "Wrz 24", students: 685 },
  { month: "Paź 24", students: 569 },
  { month: "Lis 24", students: 455 },
  { month: "Gru 24", students: 511 },
  { month: "Sty 25", students: 1313 },
  { month: "Lut 25", students: 2157 },
  { month: "Mar 25", students: 1228 },
  { month: "Kwi 25", students: 1042 },
  { month: "Maj 25", students: 1255 },
  { month: "Cze 25", students: 1975 },
  { month: "Lip 25", students: 1123 },
  { month: "Sie 25", students: 1045 },
  { month: "Wrz 25", students: 1601 },
  { month: "Paź 25", students: 1851 },
  { month: "Lis 25", students: 2018 },
  { month: "Gru 25", students: 1620 },
  { month: "Sty 26", students: 3184 },
  { month: "Lut 26", students: 3208 },
];

const lifecycleData = [
  { name: "Student (nadal)", value: 4400 },
  { name: "Lekarz bez spec.", value: 4723 },
  { name: "Rezydent", value: 2071 },
  { name: "Stażysta", value: 1614 },
  { name: "Specjalista", value: 648 },
  { name: "Inni", value: 700 },
];
const lifecycleColors = [COLORS.student, COLORS.noSpec, COLORS.resident, COLORS.intern, COLORS.specialist, COLORS.other];

const exStudentFeatures = [
  { feature: "Artykuły", uu: 888 },
  { feature: "Kalkulatory", uu: 805 },
  { feature: "Enc. rezydentur", uu: 688 },
  { feature: "Konferencje", uu: 441 },
  { feature: "Mapa rezydentur", uu: 295 },
  { feature: "ICD-10", uu: 267 },
  { feature: "VOD", uu: 248 },
  { feature: "Poradniki", uu: 228 },
  { feature: "Egzaminy", uu: 139 },
  { feature: "Meds", uu: 110 },
];

const pharmaValue = [
  { feature: "Konferencje", specUU: 1084, specPct: 18, pvMonth: 16000 },
  { feature: "Artykuły", specUU: 1221, specPct: 12, pvMonth: 68000 },
  { feature: "Kalkulatory", specUU: 954, specPct: 10, pvMonth: 63000 },
  { feature: "VOD", specUU: 804, specPct: 20, pvMonth: 30000 },
  { feature: "ICD-10", specUU: 471, specPct: 9, pvMonth: 32000 },
  { feature: "Meds (leki)", specUU: 191, specPct: 9, pvMonth: 85000 },
  { feature: "Kursy", specUU: 302, specPct: 18, pvMonth: 10000 },
  { feature: "Poradniki", specUU: 393, specPct: 11, pvMonth: 25000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("pl-PL") : p.value}
          {p.name?.includes("%") ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, color = COLORS.primary }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Remedium — Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dane z PostHog · ostatnie 30 dni (trendy: 18 msc) · filtr: role IS SET
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Role per feature */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Największy reach" value="Artykuły" sub="15,995 UU" />
              <StatCard label="Najwięcej lekarzy %" value="ICD-10 (81%)" sub="4,999 lekarzy" color={COLORS.specialist} />
              <StatCard label="Najwięcej studentów %" value="Egzaminy (48%)" sub="1,834 studentów" color={COLORS.student} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rozkład ról — UU per feature</h2>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={featureRoles} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} width={95} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="doctor" name="Lekarz" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="student" name="Student" stackId="a" fill={COLORS.student} />
                  <Bar dataKey="other" name="Inni" stackId="a" fill={COLORS.other} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rozkład procentowy</h2>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={featureRolesPercent} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} width={95} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Lekarz %" stackId="a" fill={COLORS.primary} />
                  <Bar dataKey="Student %" stackId="a" fill={COLORS.student} />
                  <Bar dataKey="Inni %" stackId="a" fill={COLORS.other} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB: Statusy lekarzy */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Najwięcej specjalistów" value="Konferencje" sub="1,084 UU (18%)" color={COLORS.specialist} />
              <StatCard label="Najwyższy % spec." value="VOD (20%)" sub="804 specjalistów" color={COLORS.specialist} />
              <StatCard label="Rezydenci dominują" value="Enc. rezydentur" sub="1,070 rezydentów" color={COLORS.resident} />
              <StatCard label="Najniższy % spec." value="Enc. rez. (3%)" sub="159 specjalistów" color={COLORS.noSpec} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Statusy lekarzy — UU per feature</h2>
              <ResponsiveContainer width="100%" height={440}>
                <BarChart data={doctorStatus} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} width={95} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="specialist" name="Specjalista" stackId="a" fill={COLORS.specialist} />
                  <Bar dataKey="resident" name="Rezydent" stackId="a" fill={COLORS.resident} />
                  <Bar dataKey="intern" name="Stażysta" stackId="a" fill={COLORS.intern} />
                  <Bar dataKey="noSpec" name="Bez specjalizacji" stackId="a" fill={COLORS.noSpec} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">% specjalistów per feature</h2>
              <ResponsiveContainer width="100%" height={440}>
                <BarChart data={doctorStatusPercent} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 12 }} width={95} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Specjalista %" stackId="a" fill={COLORS.specialist} />
                  <Bar dataKey="Rezydent %" stackId="a" fill={COLORS.resident} />
                  <Bar dataKey="Stażysta %" stackId="a" fill={COLORS.intern} />
                  <Bar dataKey="Bez spec. %" stackId="a" fill={COLORS.noSpec} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB: VOD Trend */}
        {activeTab === "vod" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Szczyt PV" value="50K" sub="Styczeń 2026" />
              <StatCard label="Szczyt UU" value="5,900" sub="Styczeń 2026" color={COLORS.specialist} />
              <StatCard label="Wzrost 18 msc" value="3.5x" sub="UU: 1,500 → 5,900" color={COLORS.accent1} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">VOD — trend PV i UU (18 miesięcy)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={vodTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={1} />
                  <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area yAxisId="left" dataKey="pv" name="Pageviews" fill={COLORS.primary} fillOpacity={0.1} stroke={COLORS.primary} strokeWidth={2} />
                  <Line yAxisId="right" dataKey="uu" name="Unikalni użytkownicy" stroke={COLORS.specialist} strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB: Student Lifecycle */}
        {activeTab === "lifecycle" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Studenci na egzaminach" value="3,208" sub="Luty 2026 — rekord" color={COLORS.student} />
              <StatCard label="Wzrost 18 msc" value="12x" sub="258 → 3,208 studentów" color={COLORS.accent1} />
              <StatCard label="Konwersja → lekarz" value="~69%" sub="Ex-studenci z egzaminów teraz jako lekarze" color={COLORS.specialist} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Studenci na egzaminach — trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={examsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={1} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area dataKey="students" name="Studenci UU" fill={COLORS.student} fillOpacity={0.15} stroke={COLORS.student} strokeWidth={2.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ex-studenci egzaminów — obecne role</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={lifecycleData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={55}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {lifecycleData.map((_, i) => (
                        <Cell key={i} fill={lifecycleColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => v.toLocaleString("pl-PL")} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Co robią ex-studenci (stażyści) teraz?</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exStudentFeatures} layout="vertical" margin={{ left: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={85} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="uu" name="UU (stażyści)" fill={COLORS.intern} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Pharma value */}
        {activeTab === "pharma" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Najlepsza powierzchnia" value="VOD" sub="20% specjalistów, 30K PV/msc" color={COLORS.specialist} />
              <StatCard label="Największy wolumen spec." value="Konferencje" sub="1,084 specjalistów" color={COLORS.primary} />
              <StatCard label="Highest PV, lowest spec%" value="Meds" sub="85K PV ale 9% spec." color={COLORS.intern} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Feature'y — specjaliści UU vs % specjalistów</h2>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={pharmaValue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" label={{ value: "Specjaliści UU", angle: -90, position: "insideLeft", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: "% specjalistów", angle: 90, position: "insideRight", fontSize: 11 }} domain={[0, 25]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="specUU" name="Specjaliści UU" fill={COLORS.specialist} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" dataKey="specPct" name="% specjalistów" stroke={COLORS.accent1} strokeWidth={3} dot={{ r: 5, fill: COLORS.accent1 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">PV/miesiąc vs specjaliści — bubble map</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={pharmaValue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="pvMonth" name="PV / miesiąc" fill={COLORS.primary} fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="specUU" name="Specjaliści UU" fill={COLORS.specialist} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Rekomendacja dla handlowców</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="font-semibold text-green-800 mb-1">Tier 1 — Premium</p>
                  <p className="text-green-700">VOD (20% spec., 804 UU) + Konferencje (18%, 1,084 UU)</p>
                  <p className="text-green-600 text-xs mt-2">Najwyższy % specjalistów. Idealne dla kampanii branded content.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-1">Tier 2 — Wolumen</p>
                  <p className="text-blue-700">Artykuły (1,221 spec.) + Kalkulatory (954 spec.)</p>
                  <p className="text-blue-600 text-xs mt-2">Duży reach, niższy % specjalistów. Dobre dla awareness campaigns.</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="font-semibold text-amber-800 mb-1">Tier 3 — Potencjał</p>
                  <p className="text-amber-700">Meds (85K PV, ale 9% spec.) + Kursy (18% spec., mały wolumen)</p>
                  <p className="text-amber-600 text-xs mt-2">Meds ma wolumen ale nie specjalistów. Kursy odwrotnie. Potrzeba growth.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Źródło: PostHog · Remedium.md · Marzec 2026 · Filtr: role IS SET · SCR = North Star Growth
        </div>
      </div>
    </div>
  );
}
