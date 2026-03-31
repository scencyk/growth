/**
 * Structured examination presets — nested categories for "Badanie" section.
 * Mirrors the Remedium dokumentacja pattern: category → options → sub-options.
 */

export interface ExamOption {
  label: string;
  icon?: string;
  children?: ExamOption[];
  value?: string; // pre-filled value for parameters
}

export interface ExamCategory {
  label: string;
  options: ExamOption[];
  hasValue?: boolean; // e.g. "Ciśnienie" needs a numeric value
  unit?: string;
  placeholder?: string;
}

export const EXAM_CATEGORIES: ExamCategory[] = [
  {
    label: "Temp. ciała",
    hasValue: true,
    unit: "°C",
    placeholder: "36.6",
    options: [
      { label: "Norma (36.0–37.0°C)" },
      { label: "Stan podgorączkowy (37.1–38.0°C)" },
      { label: "Gorączka (>38.0°C)" },
      { label: "Gorączka wysoka (>39.0°C)" },
    ],
  },
  {
    label: "Ciśnienie",
    hasValue: true,
    unit: "mmHg",
    placeholder: "120/80",
    options: [
      { label: "Norma" },
      { label: "Nadciśnienie st. 1 (140-159/90-99)" },
      { label: "Nadciśnienie st. 2 (≥160/≥100)" },
      { label: "Hipotonia (<90/60)" },
    ],
  },
  {
    label: "Tętno",
    hasValue: true,
    unit: "/min",
    placeholder: "80",
    options: [
      { label: "Norma (60–100/min)" },
      { label: "Tachykardia (>100/min)" },
      { label: "Bradykardia (<60/min)" },
      { label: "Niemiarowe" },
    ],
  },
  {
    label: "Saturacja",
    hasValue: true,
    unit: "%",
    placeholder: "98",
    options: [
      { label: "Norma (≥95%)" },
      { label: "Obniżona (90–94%)" },
      { label: "Krytyczna (<90%)" },
    ],
  },
  {
    label: "Gardło",
    options: [
      { label: "Bez zmian" },
      { label: "Przekrwione" },
      { label: "Nalot ropny" },
      { label: "Powiększone migdałki" },
    ],
  },
  {
    label: "Osłuchiwanie płuc",
    options: [
      { label: "Bez odchyleń" },
      {
        label: "Świsty",
        children: [
          { label: "Po stronie lewej" },
          { label: "Po stronie prawej" },
          { label: "Obustronnie" },
        ],
      },
      {
        label: "Furczenia",
        children: [
          { label: "Po stronie lewej" },
          { label: "Po stronie prawej" },
          { label: "Obustronnie" },
        ],
      },
      {
        label: "Trzeszczenia",
        children: [
          { label: "Po stronie lewej" },
          { label: "Po stronie prawej" },
          { label: "Obustronnie" },
        ],
      },
    ],
  },
  {
    label: "Nos i zatoki",
    options: [
      { label: "Bez zmian" },
      { label: "Obrzęk błony śluzowej" },
      { label: "Wydzielina śluzowa" },
      { label: "Wydzielina ropna" },
      { label: "Bolesność zatok" },
    ],
  },
  {
    label: "Stawy obwodowe",
    options: [
      { label: "Bez odchyleń" },
      { label: "Obrzęk stawów" },
      { label: "Bolesność palpacyjna" },
      { label: "Ograniczenie ruchomości" },
      { label: "Deformacje" },
    ],
  },
  {
    label: "Brzuch",
    options: [
      { label: "Miękki, niebolesny" },
      { label: "Bolesny palpacyjnie" },
      { label: "Wzdęty" },
      { label: "Obrona mięśniowa" },
      { label: "Perystaltyka prawidłowa" },
      { label: "Perystaltyka osłabiona" },
    ],
  },
  {
    label: "Skóra",
    options: [
      { label: "Bez zmian" },
      { label: "Wysypka" },
      { label: "Rumień" },
      { label: "Obrzęk" },
      { label: "Sucha" },
      { label: "Żółtaczka" },
    ],
  },
];

/** Quick symptom presets for "Wywiad" section */
export const SYMPTOM_PRESETS = [
  "Gorączka",
  "Kaszel",
  "Duszność",
  "Ból głowy",
  "Ból gardła",
  "Ból brzucha",
  "Nudności",
  "Biegunka",
  "Bóle stawów",
  "Zmęczenie",
  "Kołatanie serca",
  "Zawroty głowy",
  "Ból w klatce piersiowej",
  "Obrzęki",
  "Wysypka",
];
