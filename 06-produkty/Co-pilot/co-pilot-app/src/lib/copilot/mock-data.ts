import type { CoPilotResponse, PatientContext } from "./types";

interface Scenario {
  triggers: string[];
  autoLabel: string;
  response: CoPilotResponse;
}

export const DISCLAIMER =
  "To narzędzie wspiera decyzje kliniczne, ale nie zastępuje oceny lekarza. Zawsze weryfikuj dane z aktualnymi wytycznymi i ChPL.";

export const EXAMPLE_QUERIES = [
  {
    id: "therapeutic",
    label: "Decyzja terapeutyczna",
    query:
      "Pacjent 67 lat, cukrzyca typu 2, nadciśnienie, eGFR 45, duszności przy wysiłku. Przyjmuje metforminę 1000mg 2× i ramipril 5mg. Co rozważyć?",
  },
  {
    id: "dose",
    label: "Dawka leku",
    query: "dawka amoksycyliny dziecko 23kg zapalenie ucha",
  },
  {
    id: "differential",
    label: "Diagnoza różnicowa",
    query:
      "Kobieta 45 lat, bóle stawów rąk (symetryczne, małe stawy), sztywność poranna >1h, zmęczenie, OB 48. Co w kierunku?",
  },
];

export const INTENT_CHIPS = [
  "Dawka leku",
  "Interakcje",
  "Diagnoza różnicowa",
  "ICD-10",
];

const SCENARIOS: Record<string, Scenario> = {
  therapeutic: {
    triggers: ["cukrzyca", "nadciśnienie", "eGFR", "duszności", "67 lat", "metformin", "ramipril"],
    autoLabel: "67M — Cukrzyca, HF",
    response: {
      scenarioId: "therapeutic",
      synthesis:
        "Pacjent 67-letni z cukrzycą typu 2, nadciśnieniem i eGFR 45 ml/min kwalifikuje się do grupy wysokiego ryzyka sercowo-naczyniowego (SCORE2-OP: 12%). Zalecana empagliflozyna 10 mg — udowodnione korzyści nefro- i kardioprotekcyjne niezależnie od kontroli glikemii. Duszności wymagają pilnej echokardiografii w celu wykluczenia HFpEF.",
      context: {
        age: "67 lat",
        sex: "M",
        conditions: ["Cukrzyca typu 2", "Nadciśnienie tętnicze"],
        medications: ["Metformina 1000 mg 2×/d", "Ramipril 5 mg"],
        symptoms: ["Duszności przy wysiłku"],
        parameters: [{ key: "eGFR", value: "45 ml/min/1.73m²" }],
      },
      data: {
        label: "Ocena ryzyka i parametry",
        rows: [
          { key: "SCORE2-OP", value: "12% (wysokie ryzyko)", highlight: true },
          { key: "eGFR", value: "45 ml/min/1.73m² (CKD G3b)" },
          { key: "Empagliflozyna", value: "10 mg 1× dziennie" },
          { key: "Cel HbA1c", value: "< 8.0% (zindywidualizowany)" },
          { key: "Cel RR", value: "< 130/80 mmHg" },
          { key: "Uwaga eGFR", value: "Metformina: zmniejszyć do 1000 mg/d", highlight: true },
        ],
        note: "Empagliflozyna nie wymaga modyfikacji dawki przy eGFR ≥ 20 ml/min.",
      },
      interactions: [
        { drug: "Empagliflozyna + Metformina", status: "safe", note: "Bezpieczne połączenie, zmniejszyć dawkę Met przy eGFR < 45" },
        { drug: "Empagliflozyna + Ramipril", status: "safe", note: "Synergistyczny efekt nefroprotekcyjny" },
        { drug: "Empagliflozyna + Furosemid", status: "caution", note: "Ryzyko odwodnienia i hipotonii — monitorować bilans płynów" },
      ],
      icdCodes: [
        { code: "E11.65", label: "Cukrzyca typu 2 z hiperglikemią" },
        { code: "I10", label: "Nadciśnienie tętnicze pierwotne" },
        { code: "N18.3", label: "Przewlekła choroba nerek, stadium 3" },
        { code: "R06.0", label: "Duszność" },
      ],
      sources: [
        { id: 1, title: "Wytyczne ESC 2023 — Cukrzyca i choroby sercowo-naczyniowe", url: "#", type: "guideline" },
        { id: 2, title: "EMPA-REG OUTCOME Trial (NEJM 2015)", url: "#", type: "study" },
        { id: 3, title: "KDIGO 2024 — CKD Management Guidelines", url: "#", type: "guideline" },
        { id: 4, title: "ChPL Jardiance (Empagliflozyna) — EMA", url: "#", type: "spc" },
      ],
      followUp: [
        "Jakie badania kontrolne zlecić przy eGFR 45?",
        "Schemat dawkowania insuliny przy włączeniu empagliflozyny",
        "Kryteria rozpoznania HFpEF u tego pacjenta",
      ],
    },
  },

  dose: {
    triggers: ["amoksycylina", "dawka", "dziecko", "23kg", "zapalenie ucha", "dawkowanie"],
    autoLabel: "Dziecko 23 kg — Amoksycylina",
    response: {
      scenarioId: "dose",
      synthesis:
        "Amoksycylina w ostrym zapaleniu ucha środkowego u dziecka 23 kg: dawka wysoka 80–90 mg/kg/dobę w 2–3 dawkach podzielonych. Przy 23 kg zalecana dawka: 2070 mg/dobę, tj. ok. 690 mg co 8h. Czas leczenia: 7–10 dni.",
      context: {
        age: "Dziecko",
        parameters: [{ key: "Masa ciała", value: "23 kg" }],
        conditions: ["Zapalenie ucha środkowego"],
      },
      data: {
        label: "Kalkulator dawki",
        rows: [
          { key: "Masa ciała", value: "23 kg" },
          { key: "Dawka standardowa (50 mg/kg/d)", value: "1150 mg/dobę → 380 mg co 8h" },
          { key: "Dawka wysoka (90 mg/kg/d)", value: "2070 mg/dobę → 690 mg co 8h", highlight: true },
          { key: "Postać", value: "Zawiesina 250 mg/5 ml → 13.8 ml co 8h" },
          { key: "Alternatywa", value: "Tabletki 500 mg → 1 tab co 8h" },
          { key: "Czas leczenia", value: "7–10 dni (< 2 lat lub ciężki: 10 dni)" },
        ],
        note: "Dawka wysoka rekomendowana jako pierwsza linia w AOM wg AAP 2013 i PTOiL 2024.",
      },
      icdCodes: [
        { code: "H66.0", label: "Ostre ropne zapalenie ucha środkowego" },
        { code: "H66.9", label: "Zapalenie ucha środkowego, nieokreślone" },
      ],
      sources: [
        { id: 1, title: "Rekomendacje PTOiL 2024 — Ostre zapalenie ucha środkowego", url: "#", type: "guideline" },
        { id: 2, title: "AAP Clinical Practice Guideline — AOM (2013, updated 2023)", url: "#", type: "guideline" },
        { id: 3, title: "ChPL Amoksycylina — URPL", url: "#", type: "spc" },
      ],
      followUp: [
        "Co jeśli brak poprawy po 48–72h?",
        "Dawkowanie amoksycyliny z kwasem klawulanowym u tego dziecka",
        "Profilaktyka nawracających zapaleń ucha",
      ],
    },
  },

  differential: {
    triggers: ["bóle stawów", "sztywność poranna", "kobieta", "45 lat", "ręce", "ręka", "OB 48", "symetryczne"],
    autoLabel: "45K — Bóle stawów, RZS?",
    response: {
      scenarioId: "differential",
      synthesis:
        "U 45-letniej kobiety z symetrycznymi bólami małych stawów rąk i sztywnością poranną >1h najprawdopodobniejsze rozpoznanie to reumatoidalne zapalenie stawów (RZS). Konieczne pilne oznaczenie RF, anty-CCP, CRP oraz RTG rąk. Wczesne wdrożenie DMARD (metotreksatu) istotnie poprawia rokowanie.",
      context: {
        age: "45 lat",
        sex: "K",
        symptoms: ["Bóle stawów rąk (symetryczne, małe stawy)", "Sztywność poranna >1h", "Zmęczenie"],
        parameters: [{ key: "OB", value: "48 mm/h" }],
      },
      data: {
        label: "Diagnostyka różnicowa — ranking",
        rows: [
          { key: "1. RZS", value: "Bardzo prawdopodobne (85%)", highlight: true },
          { key: "2. SLE (toczeń)", value: "Możliwe (8%)" },
          { key: "3. ŁZS (łuszczycowe)", value: "Mniej prawdopodobne (5%)" },
          { key: "Sugerowane badania", value: "RF, anty-CCP, ANA, OB, CRP, RTG rąk", highlight: true },
          { key: "Kryteria ACR/EULAR", value: "≥ 6/10 pkt = pewne RZS" },
          { key: "Konsultacja", value: "Reumatolog — pilna (do 6 tyg.)" },
        ],
      },
      icdCodes: [
        { code: "M05.79", label: "RZS seropozytywne, nieokreślone miejsce" },
        { code: "M06.09", label: "RZS seronegatywne, nieokreślone miejsce" },
        { code: "M32.9", label: "Toczeń rumieniowaty układowy, nieokreślony" },
      ],
      sources: [
        { id: 1, title: "Kryteria klasyfikacyjne ACR/EULAR 2010 dla RZS", url: "#", type: "guideline" },
        { id: 2, title: "Rekomendacje PTR 2023 — Diagnostyka i leczenie RZS", url: "#", type: "guideline" },
        { id: 3, title: "EULAR 2022 — Management of early RA", url: "#", type: "guideline" },
      ],
      followUp: [
        "Schemat wdrożenia metotreksatu w RZS",
        "Kryteria ACR/EULAR 2010 — punktacja szczegółowa",
        "Różnicowanie RZS vs toczeń — kluczowe różnice",
      ],
    },
  },
};

export function matchScenario(query: string): CoPilotResponse | null {
  const lower = query.toLowerCase();
  let bestMatch: { key: string; score: number } | null = null;

  for (const [key, scenario] of Object.entries(SCENARIOS)) {
    const score = scenario.triggers.filter((t) => lower.includes(t.toLowerCase())).length;
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score };
    }
  }

  return bestMatch ? SCENARIOS[bestMatch.key].response : null;
}

export function getAutoLabel(scenarioId: string): string | null {
  for (const scenario of Object.values(SCENARIOS)) {
    if (scenario.response.scenarioId === scenarioId) return scenario.autoLabel;
  }
  return null;
}
