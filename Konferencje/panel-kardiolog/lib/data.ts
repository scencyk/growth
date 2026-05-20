import type { SpecialtyPersona, Product } from "./types";

// Heatmapa UU per (day, hour) — dane PostHog za 2026-02-19 do 2026-05-19 (90 dni)
// Index 0 = poniedziałek, 6 = niedziela. Pn-Czw to realne dane z kohorty 41 (Kardiologia).
// Pt/Sob/Nd — wzorzec proporcjonalny do udziału dziennego (262/209/227 UU vs 287 avg weekday).
const heatmap: number[][] = [
  // Pn — realne dane PostHog
  [8, 3, 1, 1, 2, 2, 15, 22, 28, 31, 47, 37, 38, 38, 34, 36, 43, 41, 37, 33, 36, 36, 41, 21],
  // Wt — realne dane PostHog (peak tygodnia 9:00 = 75 UU)
  [11, 3, 3, 1, 1, 3, 13, 14, 33, 75, 53, 65, 61, 45, 40, 36, 45, 41, 39, 37, 38, 38, 34, 25],
  // Śr — realne dane PostHog (drugi peak 21:00 = 54 UU)
  [9, 3, 1, 1, 1, 6, 14, 22, 29, 46, 44, 54, 42, 43, 32, 39, 45, 41, 34, 32, 36, 54, 34, 25],
  // Czw — realne dane PostHog
  [8, 3, 2, 3, 1, 2, 15, 14, 38, 49, 37, 25, 42, 44, 34, 36, 31, 41, 38, 36, 39, 39, 45, 21],
  // Pt — wzorzec dnia roboczego × 0.91 (262 UU vs 287 avg weekday), z lekkim spadkiem po 14
  [7, 3, 2, 2, 2, 3, 12, 19, 27, 42, 40, 45, 39, 36, 28, 28, 32, 31, 28, 25, 27, 28, 25, 17],
  // Sob — wzorzec weekendowy × 0.73 (209 UU/dzień), peak 10-13 i 19-21
  [9, 5, 3, 2, 2, 2, 4, 7, 14, 22, 33, 36, 32, 29, 24, 22, 21, 22, 24, 27, 28, 26, 22, 14],
  // Nd — wzorzec weekendowy × 0.79 (227 UU/dzień), wieczorny peak (przygotowanie do tygodnia)
  [10, 6, 3, 2, 2, 2, 5, 8, 15, 23, 28, 30, 28, 26, 24, 26, 28, 32, 34, 38, 41, 38, 30, 18],
];

const dayTotals = [275, 315, 288, 270, 262, 209, 227];

export const cardiologist: SpecialtyPersona = {
  slug: "kardiologia",
  name: "Kardiolog",
  cohortId: 41,
  totalRegistered: 1076,
  totalActive90d: 591,
  statusBreakdown: {
    specialist: 285,
    resident: 262,
    intern: 0,
    without: 44,
  },
  platformBreakdown: { web: 556, app: 129 },
  weeklyHeatmap: heatmap,
  dayTotals,
  dayLabels: ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"],
  topSections: [
    { feature: "article", label: "Publikacje", uu: 310 },
    { feature: "main-panel", label: "Panel główny", uu: 275 },
    { feature: "conference", label: "Konferencje", uu: 260 },
    { feature: "medical-calculator", label: "Kalkulatory", uu: 254 },
    { feature: "vod", label: "VOD (wideo)", uu: 205 },
    { feature: "course", label: "Kursy", uu: 152 },
    { feature: "icd-10", label: "ICD-10", uu: 95 },
    { feature: "tutorial", label: "Poradniki", uu: 89 },
    { feature: "residency-encyclopedia", label: "Encyklopedia rezydentur", uu: 84 },
    { feature: "exams", label: "Egzaminy (PES/LEK)", uu: 55 },
    { feature: "e-book", label: "E-booki", uu: 36 },
    { feature: "webinar", label: "Webinary", uu: 31 },
    { feature: "meds", label: "Wyszukiwarka leków", uu: 30 },
    { feature: "clinical-case", label: "Przypadki kliniczne", uu: 30 },
  ],
  topContent: [
    {
      title: "III Międzynarodowy Kongres Kardiomiopatii",
      type: "Konferencja",
      uu: 137,
      path: "/wideo/iii-miedzynarodowy-kongres-kardiomiopatii-237",
    },
    {
      title: "XXVI Warszawskie Dni Kardiologii Akademickiej",
      type: "Konferencja",
      uu: 105,
      path: "/wideo/xxvi-warszawskie-dni-kardiologii-akademickiej-232",
    },
    {
      title: "Kalkulator SCORE2 i SCORE2-OP",
      type: "Kalkulator",
      uu: 89,
      path: "/kalkulatory/score2",
    },
    {
      title: "Pierwsze kroki w POZ — Diabetologia (wiosna 2026)",
      type: "Kurs",
      uu: 65,
      path: "/kursy/pierwsze-kroki-w-poz-diabetologia",
    },
    {
      title: "Wstrząs kardiogenny okiem kardiologa",
      type: "VOD",
      uu: 48,
      path: "/wideo/xxvi-warszawskie-dni-kardiologii-akademickiej-232/wstrzas-kardiogenny-800",
    },
    {
      title: "Kurs Akademia Adepta Kardiologii Zabiegowej",
      type: "Kurs (płatny)",
      uu: 43,
      path: "/kursy/akademia-adepta-kardiologii-zabiegowej",
    },
    {
      title: "Kardiologia w ciąży według wytycznych ESC 2025",
      type: "Kurs (płatny)",
      uu: 41,
      path: "/kursy/kardiologia-w-ciazy-esc-2025",
    },
    {
      title: "Kalkulator zarobków na rezydenturze",
      type: "Kalkulator",
      uu: 39,
      path: "/kalkulatory/zarobki-rezydenta",
    },
    {
      title: "Choroba Fabry'ego: serce",
      type: "VOD",
      uu: 29,
      path: "/wideo/iii-miedzynarodowy-kongres-kardiomiopatii-237/choroba-fabry-ego-serce-844",
    },
    {
      title: "5 minut o leku: agomelatyna",
      type: "VOD seria",
      uu: 9,
      path: "/wideo/5-minut-o-leku-63/agomelatyna-823",
    },
  ],
  signature: [
    { feature: "main-panel", day: 1, hour: 9, label: "Wt 9:00 — Otwarcie tygodnia", uu: 75 },
    { feature: "conference", day: 2, hour: 21, label: "Śr 21:00 — Wieczorny powrót", uu: 54 },
    { feature: "medical-calculator", day: 0, hour: 10, label: "Pn 10:00 — Pierwsza dyżurka", uu: 47 },
    { feature: "vod", day: 3, hour: 22, label: "Czw 22:00 — Edukacja przed snem", uu: 45 },
    { feature: "course", day: 6, hour: 20, label: "Nd 20:00 — Przygotowanie do tygodnia", uu: 41 },
    { feature: "article", day: 1, hour: 13, label: "Wt 13:00 — Lunch break", uu: 45 },
  ],
};

export const products: Product[] = [
  {
    id: "5-minut-o-leku",
    name: "5 minut o leku",
    category: "vod-series",
    icon: "Film",
    fits: ["vod", "main-panel"],
    bestHours: [21, 23],
    bestDays: [1, 2, 3, 6],
    reach: "~200-450 UU / materiał",
    description:
      "Krótkie, 5-min wideo dot. wybranego leku. Idealne na wieczorne sesje przeglądowe lekarza.",
    pricing: "Pakiet kampanii VOD",
    color: "#ef4444",
  },
  {
    id: "medyczne-espresso",
    name: "Medyczne Espresso",
    category: "vod-series",
    icon: "Coffee",
    fits: ["vod", "main-panel"],
    bestHours: [8, 12],
    bestDays: [0, 1, 2, 3, 4],
    reach: "~250-700 UU / materiał",
    description:
      "Format długiej formy (10-15 min) — analiza przypadku, wytyczne. Pasuje na poranek/lunch break.",
    pricing: "Pakiet kampanii VOD",
    color: "#f59e0b",
  },
  {
    id: "kurs-sponsorowany",
    name: "Kurs sponsorowany",
    category: "course",
    icon: "GraduationCap",
    fits: ["course", "main-panel"],
    bestHours: [19, 23],
    bestDays: [2, 3, 6],
    reach: "~100-300 UU + quiz",
    description:
      "Wieloodcinkowy kurs z quizem. Wpięcie przed weekendem maksymalizuje completion rate.",
    pricing: "Sponsoring kursu",
    color: "#8b5cf6",
  },
  {
    id: "konferencja-live",
    name: "Konferencja LIVE + nagrania",
    category: "webinar",
    icon: "Radio",
    fits: ["conference", "webinar", "main-panel"],
    bestHours: [16, 21],
    bestDays: [3, 4],
    reach: "~100-260 UU LIVE + 3× post",
    description:
      "Transmisja live + biblioteka nagrań. Konferencje to top-3 sekcja kardiologów (260 UU).",
    pricing: "Pakiet konferencyjny",
    color: "#06b6d4",
  },
  {
    id: "banner-panel-glowny",
    name: "Banner na panelu głównym",
    category: "banner",
    icon: "Layout",
    fits: ["main-panel"],
    bestHours: [8, 13],
    bestDays: [0, 1, 2, 3],
    reach: "~275 UU / tydzień",
    description:
      "Banner na dashboardzie po zalogowaniu. Pierwszy moment kontaktu lekarza w ciągu dnia.",
    pricing: "CPM / kampania",
    color: "#3b82f6",
  },
  {
    id: "native-w-kalkulatorze",
    name: "Native ad w kalkulatorze",
    category: "native-content",
    icon: "Calculator",
    fits: ["medical-calculator"],
    bestHours: [10, 16],
    bestDays: [0, 1, 2, 3, 4],
    reach: "~89 UU (SCORE2)",
    description:
      "Natywny content w wyniku kalkulatora SCORE2 — kontekstowa rekomendacja terapeutyczna.",
    pricing: "Native placement",
    color: "#10b981",
  },
  {
    id: "artykul-sponsorowany",
    name: "Artykuł sponsorowany",
    category: "native-content",
    icon: "FileText",
    fits: ["article"],
    bestHours: [12, 14],
    bestDays: [0, 1, 2, 3],
    reach: "~310 UU / publikacja",
    description:
      "Native artykuł w sekcji publikacji — case study, wywiad z ekspertem. Top sekcja (310 UU).",
    pricing: "Native placement",
    color: "#6366f1",
  },
  {
    id: "ebook-firmowany",
    name: "E-book firmowany",
    category: "ebook",
    icon: "BookOpen",
    fits: ["e-book", "main-panel"],
    bestHours: [20, 23],
    bestDays: [4, 5, 6],
    reach: "~36 UU pobrań",
    description:
      "Pełen e-book + landing — generuje pobrania (lead-gen). Pasuje na weekend.",
    pricing: "Sponsoring e-booka",
    color: "#14b8a6",
  },
  {
    id: "push-notification",
    name: "Push notification",
    category: "push",
    icon: "Bell",
    fits: ["main-panel", "vod", "article"],
    bestHours: [9, 21],
    bestDays: [1, 2, 3, 6],
    reach: "~129 UU app users",
    description:
      "Push do użytkowników aplikacji (19% kardiologów). Wt 9:00 lub Nd 21:00 = otwarcie tygodnia.",
    pricing: "Push placement",
    color: "#ec4899",
  },
  {
    id: "newsletter-sponsoring",
    name: "Sponsoring newslettera",
    category: "newsletter",
    icon: "Mail",
    fits: ["main-panel"],
    bestHours: [8, 10],
    bestDays: [1, 2],
    reach: "~1000+ subskrybentów",
    description:
      "Sekcja sponsorowana w tygodniowym newsletterze. Wtorek rano = peak otwierania.",
    pricing: "Newsletter slot",
    color: "#f97316",
  },
  {
    id: "webinar-cme",
    name: "Webinar CME",
    category: "webinar",
    icon: "Video",
    fits: ["webinar", "course", "conference"],
    bestHours: [19, 21],
    bestDays: [2, 3],
    reach: "~100 UU LIVE + rec",
    description:
      "Webinar z punktami edukacyjnymi. Środa/czwartek wieczór = klasyczne okno CME.",
    pricing: "Pakiet webinarowy",
    color: "#a855f7",
  },
  {
    id: "case-clinical",
    name: "Case study interaktywny",
    category: "native-content",
    icon: "Stethoscope",
    fits: ["clinical-case", "article"],
    bestHours: [10, 14],
    bestDays: [0, 1, 2],
    reach: "~30-150 UU",
    description:
      "Interaktywny przypadek kliniczny prowadzony przez algorytm decyzyjny — z subtelnym productem.",
    pricing: "Custom content",
    color: "#0ea5e9",
  },
];

export const featureLabels: Record<string, string> = {
  article: "Publikacje",
  "main-panel": "Panel główny",
  conference: "Konferencje",
  "medical-calculator": "Kalkulatory",
  vod: "VOD",
  course: "Kursy",
  "icd-10": "ICD-10",
  tutorial: "Poradniki",
  "residency-encyclopedia": "Encyklopedia rezydentur",
  exams: "Egzaminy",
  meds: "Wyszukiwarka leków",
  "e-book": "E-booki",
  webinar: "Webinary",
  "clinical-case": "Przypadki kliniczne",
};
