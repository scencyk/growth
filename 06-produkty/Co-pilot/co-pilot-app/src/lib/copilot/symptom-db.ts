import type { TagCategory } from "./types";

export interface SymptomEntry {
  label: string;
  category: TagCategory;
  aliases?: string[]; // for fuzzy matching
}

/**
 * Baza objawów, stanów, leków i parametrów do autocomplete.
 * W produkcji: API endpoint. Tu: statyczna lista pokrywająca scenariusze demo.
 */
export const SYMPTOM_DATABASE: SymptomEntry[] = [
  // ── Demographics ──
  { label: "Mężczyzna", category: "demographic", aliases: ["M", "mężczyzna", "płeć M"] },
  { label: "Kobieta", category: "demographic", aliases: ["K", "kobieta", "płeć K"] },
  { label: "Dziecko", category: "demographic", aliases: ["pediatria", "niemowlę"] },
  { label: "Wiek: 67 lat", category: "demographic", aliases: ["67", "starszy"] },
  { label: "Wiek: 45 lat", category: "demographic", aliases: ["45"] },
  { label: "Wiek: 23 kg (dziecko)", category: "demographic", aliases: ["23kg", "23 kg"] },

  // ── Symptoms ──
  { label: "Duszność", category: "symptom", aliases: ["duszności", "brak tchu", "dyspnea"] },
  { label: "Duszność przy wysiłku", category: "symptom", aliases: ["duszności wysiłkowe"] },
  { label: "Duszność spoczynkowa", category: "symptom", aliases: ["duszności spoczynkowe"] },
  { label: "Ból w klatce piersiowej", category: "symptom", aliases: ["ból klatki", "chest pain"] },
  { label: "Bóle stawów", category: "symptom", aliases: ["artralgia", "bol stawów", "bóle stawowe"] },
  { label: "Bóle stawów rąk", category: "symptom", aliases: ["ból rąk", "stawy rąk"] },
  { label: "Bóle symetryczne", category: "symptom", aliases: ["symetryczne"] },
  { label: "Małe stawy", category: "symptom", aliases: ["drobne stawy", "MCP", "PIP"] },
  { label: "Sztywność poranna >1h", category: "symptom", aliases: ["sztywność poranna", "morning stiffness"] },
  { label: "Zmęczenie", category: "symptom", aliases: ["fatigue", "osłabienie", "znużenie"] },
  { label: "Obrzęki kończyn dolnych", category: "symptom", aliases: ["obrzęki nóg", "edema"] },
  { label: "Gorączka", category: "symptom", aliases: ["temp", "febra", "podwyższona temperatura"] },
  { label: "Ból głowy", category: "symptom", aliases: ["cefalgia", "headache"] },
  { label: "Ból ucha", category: "symptom", aliases: ["otalgia", "ból ucha"] },
  { label: "Zapalenie ucha", category: "symptom", aliases: ["otitis", "zapalenie ucha środkowego", "AOM"] },
  { label: "Kaszel", category: "symptom", aliases: ["tussis", "kaszle"] },
  { label: "Kołatanie serca", category: "symptom", aliases: ["palpitacje", "palpitations"] },
  { label: "Zawroty głowy", category: "symptom", aliases: ["vertigo", "mroczki"] },
  { label: "Nudności", category: "symptom", aliases: ["nausea", "mdłości"] },
  { label: "Biegunka", category: "symptom", aliases: ["diarrhea", "luźne stolce"] },
  { label: "Wysypka", category: "symptom", aliases: ["rash", "osutka", "rumień"] },
  { label: "Świąd", category: "symptom", aliases: ["pruritus", "swędzenie"] },
  { label: "Poliuria", category: "symptom", aliases: ["częste oddawanie moczu", "wielomocz"] },
  { label: "Polidypsja", category: "symptom", aliases: ["wzmożone pragnienie"] },
  { label: "Utrata masy ciała", category: "symptom", aliases: ["chudnięcie", "weight loss"] },
  { label: "Nocne poty", category: "symptom", aliases: ["night sweats"] },

  // ── Conditions ──
  { label: "Cukrzyca typu 2", category: "condition", aliases: ["DM2", "cukrzyca", "diabetes"] },
  { label: "Cukrzyca typu 1", category: "condition", aliases: ["DM1", "IDDM"] },
  { label: "Nadciśnienie tętnicze", category: "condition", aliases: ["HA", "nadciśnienie", "hypertension"] },
  { label: "Niewydolność serca", category: "condition", aliases: ["HF", "heart failure", "NS"] },
  { label: "HFrEF", category: "condition", aliases: ["niewydolność z obniżoną EF"] },
  { label: "HFpEF", category: "condition", aliases: ["niewydolność z zachowaną EF"] },
  { label: "Migotanie przedsionków", category: "condition", aliases: ["AF", "atrial fibrillation"] },
  { label: "Choroba wieńcowa", category: "condition", aliases: ["CAD", "IHD", "dławica"] },
  { label: "Przewlekła choroba nerek", category: "condition", aliases: ["CKD", "PChN", "niewydolność nerek"] },
  { label: "Astma", category: "condition", aliases: ["asthma"] },
  { label: "POChP", category: "condition", aliases: ["COPD", "rozedma"] },
  { label: "RZS", category: "condition", aliases: ["reumatoidalne zapalenie stawów", "RA"] },
  { label: "Toczeń (SLE)", category: "condition", aliases: ["lupus", "SLE", "toczeń rumieniowaty"] },
  { label: "Depresja", category: "condition", aliases: ["MDD", "zaburzenie depresyjne"] },
  { label: "Hiperlipidemia", category: "condition", aliases: ["dyslipidemia", "cholesterol"] },

  // ── Medications ──
  { label: "Metformina", category: "medication", aliases: ["met", "glucophage", "siofor"] },
  { label: "Metformina 1000 mg 2×/d", category: "medication" },
  { label: "Ramipril", category: "medication", aliases: ["tritace"] },
  { label: "Ramipril 5 mg", category: "medication" },
  { label: "Empagliflozyna", category: "medication", aliases: ["jardiance", "SGLT2i"] },
  { label: "Amoksycylina", category: "medication", aliases: ["amoxicillin", "ospamox"] },
  { label: "Bisoprolol", category: "medication", aliases: ["concor"] },
  { label: "Atorwastatyna", category: "medication", aliases: ["atorvastatin", "sortis"] },
  { label: "Amlodypina", category: "medication", aliases: ["amlodipine", "norvasc"] },
  { label: "Furosemid", category: "medication", aliases: ["lasix"] },
  { label: "Spironolakton", category: "medication", aliases: ["aldactone"] },
  { label: "Metotreksat", category: "medication", aliases: ["MTX", "methotrexate"] },
  { label: "Ibuprofen", category: "medication", aliases: ["nurofen", "ibuprom"] },
  { label: "Paracetamol", category: "medication", aliases: ["acetaminophen", "apap"] },
  { label: "Insulina", category: "medication", aliases: ["insulin"] },

  // ── Parameters ──
  { label: "eGFR", category: "parameter", aliases: ["GFR", "filtracja"] },
  { label: "HbA1c", category: "parameter", aliases: ["hemoglobina glikowana"] },
  { label: "OB", category: "parameter", aliases: ["odczyn Biernackiego", "ESR"] },
  { label: "CRP", category: "parameter", aliases: ["białko C-reaktywne"] },
  { label: "RF", category: "parameter", aliases: ["czynnik reumatoidalny"] },
  { label: "Anty-CCP", category: "parameter", aliases: ["anti-CCP"] },
  { label: "ANA", category: "parameter", aliases: ["przeciwciała przeciwjądrowe"] },
  { label: "SCORE2", category: "parameter", aliases: ["ryzyko sercowo-naczyniowe"] },
  { label: "NT-proBNP", category: "parameter", aliases: ["BNP", "peptyd natriuretyczny"] },
  { label: "EF (frakcja wyrzutowa)", category: "parameter", aliases: ["LVEF", "ejection fraction"] },
  { label: "BMI", category: "parameter", aliases: ["body mass index", "wskaźnik masy ciała"] },
  { label: "Kreatynina", category: "parameter", aliases: ["creatinine", "krea"] },
  { label: "Masa ciała", category: "parameter", aliases: ["waga", "kg"] },
];

const CATEGORY_LABELS: Record<TagCategory, string> = {
  symptom: "Objawy",
  condition: "Rozpoznania",
  medication: "Leki",
  parameter: "Parametry",
  demographic: "Demograficzne",
};

export function getCategoryLabel(category: TagCategory): string {
  return CATEGORY_LABELS[category];
}

/**
 * Search symptoms — fuzzy match against label + aliases.
 * Returns grouped by category, max 8 results.
 */
export function searchSymptoms(query: string, exclude: string[] = []): SymptomEntry[] {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();
  const excludeSet = new Set(exclude.map((e) => e.toLowerCase()));

  const scored = SYMPTOM_DATABASE
    .filter((entry) => !excludeSet.has(entry.label.toLowerCase()))
    .map((entry) => {
      const labelLower = entry.label.toLowerCase();
      const aliasMatch = entry.aliases?.some((a) => a.toLowerCase().includes(lower)) ?? false;
      const labelMatch = labelLower.includes(lower);
      const startsWithLabel = labelLower.startsWith(lower);
      const exactAlias = entry.aliases?.some((a) => a.toLowerCase() === lower) ?? false;

      let score = 0;
      if (exactAlias) score = 4;
      else if (startsWithLabel) score = 3;
      else if (labelMatch) score = 2;
      else if (aliasMatch) score = 1;

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ entry }) => entry);

  return scored;
}
