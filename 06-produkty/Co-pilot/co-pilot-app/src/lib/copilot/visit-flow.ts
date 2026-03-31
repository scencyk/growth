/**
 * POZ Visit Flow — guided clinical decision tree.
 *
 * Philosophy: start with almost nothing. Each click adds signal.
 * Default = "norma". Only pathology gets clicked.
 */

/* ─── Stage definitions ─── */
export type VisitStage = "triage" | "complaint" | "interview" | "output";

/* ─── Patient demographics ─── */
export type PatientSex = "K" | "M" | "dziecko";

export const AGE_PRESETS = [
  { label: "Niemowlę", range: "0–1" },
  { label: "Dziecko", range: "2–12" },
  { label: "Nastolatek", range: "13–17" },
  { label: "Młody dorosły", range: "18–35" },
  { label: "Dorosły", range: "36–55" },
  { label: "Senior", range: "56–75" },
  { label: "Starszy", range: "75+" },
];

/* ─── Chief complaints — top POZ reasons ─── */
export interface DrugSuggestion {
  id: string;
  name: string;
  dose: string;
  /** When is this drug relevant? List of finding IDs that activate it. Empty = always for this complaint. */
  triggers: string[];
  /** Alternative / swap options */
  alternatives?: string[];
  note?: string;
}

export interface Complaint {
  id: string;
  label: string;
  emoji: string;
  interviewQuestions: InterviewQuestion[];
  examSuggestions: ExamSuggestion[];
  icdHints: string[];
  /** Drug suggestions — shown on right panel, filtered by active findings */
  drugSuggestions: DrugSuggestion[];
  /** Short recommendation text shown immediately after complaint selection */
  baseRecommendation: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  /** Positive = pathology found. Clicking this adds context. */
  positiveLabel: string;
  /** What it means for AI when toggled ON */
  signal: string;
  /** Category for grouping */
  group: "wywiad" | "czas" | "charakter" | "towarzyszące" | "przewlekłe";
}

export interface ExamSuggestion {
  id: string;
  label: string;
  /** What gets added to findings when toggled ON (= abnormal) */
  finding: string;
  /** Severity hint */
  severity?: "info" | "warning";
}

export const COMPLAINTS: Complaint[] = [
  {
    id: "respiratory_infection",
    label: "Infekcja dróg oddechowych",
    emoji: "",
    interviewQuestions: [
      { id: "ri_onset", question: "Od kiedy?", positiveLabel: ">7 dni", signal: "Objawy trwają ponad 7 dni", group: "czas" },
      { id: "ri_fever", question: "Gorączka?", positiveLabel: "Tak, >38°C", signal: "Gorączka >38°C", group: "wywiad" },
      { id: "ri_cough_prod", question: "Kaszel produktywny?", positiveLabel: "Tak", signal: "Kaszel produktywny", group: "charakter" },
      { id: "ri_cough_dry", question: "Kaszel suchy?", positiveLabel: "Tak, dokuczliwy", signal: "Kaszel suchy, dokuczliwy", group: "charakter" },
      { id: "ri_sore_throat", question: "Ból gardła?", positiveLabel: "Tak", signal: "Ból gardła", group: "wywiad" },
      { id: "ri_runny_nose", question: "Katar ropny?", positiveLabel: "Tak", signal: "Katar ropny", group: "charakter" },
      { id: "ri_dyspnea", question: "Duszność?", positiveLabel: "Tak", signal: "Duszność", group: "towarzyszące" },
      { id: "ri_ear_pain", question: "Ból ucha?", positiveLabel: "Tak", signal: "Ból ucha", group: "towarzyszące" },
      { id: "ri_sinus", question: "Ból zatok?", positiveLabel: "Tak", signal: "Bolesność zatok", group: "towarzyszące" },
      { id: "ri_allergy_pen", question: "Alergia na penicyliny?", positiveLabel: "Tak", signal: "Alergia na penicyliny", group: "przewlekłe" },
      { id: "ri_chronic", question: "Choroby przewlekłe?", positiveLabel: "Tak", signal: "Choroby współistniejące", group: "przewlekłe" },
      { id: "ri_recurrent", question: "Nawracające infekcje?", positiveLabel: "Tak, >3×/rok", signal: "Nawracające infekcje >3×/rok", group: "przewlekłe" },
    ],
    examSuggestions: [
      { id: "ri_ex_throat", label: "Gardło przekrwione", finding: "Gardło: przekrwione" },
      { id: "ri_ex_tonsils", label: "Migdałki powiększone", finding: "Migdałki: powiększone", severity: "warning" },
      { id: "ri_ex_pus", label: "Nalot ropny", finding: "Migdałki: nalot ropny", severity: "warning" },
      { id: "ri_ex_lungs_clear", label: "Płuca — świsty", finding: "Osłuchiwanie płuc: świsty obustronnie", severity: "warning" },
      { id: "ri_ex_lungs_crackle", label: "Płuca — trzeszczenia", finding: "Osłuchiwanie płuc: trzeszczenia", severity: "warning" },
      { id: "ri_ex_lymph", label: "Węzły chłonne powiększone", finding: "Węzły chłonne szyjne: powiększone, bolesne" },
      { id: "ri_ex_ears", label: "Błona bębenkowa zmieniona", finding: "Otoskopia: błona bębenkowa przekrwiona/uwypuklona", severity: "warning" },
    ],
    icdHints: ["J06.9 — Ostre zakażenie górnych dróg oddechowych", "J02.9 — Ostre zapalenie gardła", "J01.9 — Ostre zapalenie zatok", "J20.9 — Ostre zapalenie oskrzeli"],
    baseRecommendation: "Leczenie objawowe. Nawadnianie, odpoczynek. Kontrola jeśli brak poprawy po 7 dniach.",
    drugSuggestions: [
      { id: "ri_d_paracetamol", name: "Paracetamol", dose: "500–1000 mg co 6–8h (max 4 g/d)", triggers: [], note: "Pierwsza linia — gorączka i ból" },
      { id: "ri_d_ibuprofen", name: "Ibuprofen", dose: "200–400 mg co 6–8h", triggers: ["ri_fever"], alternatives: ["Paracetamol", "Ketoprofen"], note: "Przy silnym bólu/gorączce" },
      { id: "ri_d_amoxicillin", name: "Amoksycylina", dose: "500–1000 mg co 8h × 7 dni", triggers: ["ri_ex_pus", "ri_ex_ears"], note: "Tylko przy potwierdzonym podejrzeniu infekcji bakteryjnej" },
      { id: "ri_d_azithromycin", name: "Azytromycyna", dose: "500 mg 1×/d × 3 dni", triggers: ["ri_ex_pus", "ri_ex_lungs_crackle", "ri_allergy_pen"], alternatives: ["Klarytromycyna"], note: "Alternatywa przy alergii na penicyliny lub atypowe zapalenie" },
      { id: "ri_d_ambroxol", name: "Ambroksol", dose: "30 mg 3×/d", triggers: ["ri_cough_prod"], alternatives: ["Acetylocysteina 600 mg 1×/d"], note: "Kaszel produktywny — mukolityk" },
      { id: "ri_d_dextromethorphan", name: "Dekstrometorfan", dose: "15 mg co 6–8h", triggers: ["ri_cough_dry"], note: "Kaszel suchy, dokuczliwy — antytusyk" },
      { id: "ri_d_nasal_spray", name: "Ksylometazolina", dose: "0.1% 1–2 dawki do nozdrza 2–3×/d, max 5 dni", triggers: ["ri_runny_nose", "ri_sinus"], note: "Katar/zatkany nos — krótkotrwale" },
    ],
  },
  {
    id: "headache",
    label: "Ból głowy",
    emoji: "",
    interviewQuestions: [
      { id: "ha_onset", question: "Od kiedy?", positiveLabel: "Nagły początek", signal: "Nagły początek bólu głowy (red flag)", group: "czas" },
      { id: "ha_location", question: "Gdzie boli?", positiveLabel: "Jednostronnie", signal: "Ból jednostronny", group: "charakter" },
      { id: "ha_intensity", question: "Nasilenie?", positiveLabel: "Silny (≥7/10)", signal: "Silny ból głowy ≥7/10", group: "charakter" },
      { id: "ha_nausea", question: "Nudności/wymioty?", positiveLabel: "Tak", signal: "Nudności i wymioty", group: "towarzyszące" },
      { id: "ha_aura", question: "Aura wzrokowa?", positiveLabel: "Tak", signal: "Aura wzrokowa (migrena)", group: "towarzyszące" },
      { id: "ha_neck_stiff", question: "Sztywność karku?", positiveLabel: "Tak", signal: "Sztywność karku (red flag — wykluczyć zapalenie opon)", group: "towarzyszące" },
      { id: "ha_fever", question: "Gorączka?", positiveLabel: "Tak", signal: "Gorączka z bólem głowy", group: "towarzyszące" },
      { id: "ha_recurrent", question: "Nawracający?", positiveLabel: "Tak, >4×/mies.", signal: "Nawracające bóle głowy >4×/mies.", group: "przewlekłe" },
      { id: "ha_meds", question: "Leki p/bólowe?", positiveLabel: ">10 dni/mies.", signal: "Nadużywanie leków przeciwbólowych", group: "przewlekłe" },
    ],
    examSuggestions: [
      { id: "ha_ex_bp", label: "RR podwyższone", finding: "RR podwyższone", severity: "warning" },
      { id: "ha_ex_neck", label: "Sztywność karku", finding: "Sztywność karku — pilna diagnostyka!", severity: "warning" },
      { id: "ha_ex_sinus", label: "Bolesność zatok", finding: "Bolesność palpacyjna zatok" },
      { id: "ha_ex_neuro", label: "Objawy ogniskowe", finding: "Objawy neurologiczne ogniskowe — pilna diagnostyka!", severity: "warning" },
    ],
    icdHints: ["G43.9 — Migrena", "G44.2 — Napięciowy ból głowy", "R51 — Ból głowy"],
    baseRecommendation: "Ocena red flags. Leczenie objawowe. Dzienniczek bólu głowy przy nawracających epizodach.",
    drugSuggestions: [
      { id: "ha_d_paracetamol", name: "Paracetamol", dose: "1000 mg doraźnie (max 4 g/d)", triggers: [], note: "Pierwsza linia — ból napięciowy" },
      { id: "ha_d_ibuprofen", name: "Ibuprofen", dose: "400 mg doraźnie", triggers: [], alternatives: ["Naproksen 500 mg"], note: "Pierwsza linia — ból napięciowy i migrena" },
      { id: "ha_d_sumatriptan", name: "Sumatriptan", dose: "50–100 mg doraźnie, powtórzyć po 2h (max 300 mg/d)", triggers: ["ha_location", "ha_nausea", "ha_intensity", "ha_aura"], alternatives: ["Zolmitriptan", "Rizatriptan"], note: "Migrena — tryptan, stosować po ustąpieniu aury" },
      { id: "ha_d_metoclopramide", name: "Metoklopramid", dose: "10 mg doraźnie", triggers: ["ha_nausea"], note: "Nudności/wymioty towarzyszące" },
    ],
  },
  {
    id: "joint_pain",
    label: "Bóle stawów / mięśni",
    emoji: "",
    interviewQuestions: [
      { id: "jp_onset", question: "Od kiedy?", positiveLabel: ">6 tygodni", signal: "Bóle stawów trwające >6 tygodni (sugeruje przewlekłe)", group: "czas" },
      { id: "jp_symmetric", question: "Symetryczne?", positiveLabel: "Tak", signal: "Bóle symetryczne (RZS?)", group: "charakter" },
      { id: "jp_small_joints", question: "Małe stawy?", positiveLabel: "Tak (ręce, stopy)", signal: "Małe stawy rąk/stóp zajęte", group: "charakter" },
      { id: "jp_morning", question: "Sztywność poranna?", positiveLabel: ">30 min", signal: "Sztywność poranna >30 min", group: "charakter" },
      { id: "jp_swelling", question: "Obrzęk stawów?", positiveLabel: "Tak", signal: "Obrzęk stawów", group: "towarzyszące" },
      { id: "jp_fatigue", question: "Zmęczenie?", positiveLabel: "Tak, znaczne", signal: "Znaczne zmęczenie", group: "towarzyszące" },
      { id: "jp_skin", question: "Zmiany skórne?", positiveLabel: "Tak", signal: "Zmiany skórne (łuszczyca? toczeń?)", group: "towarzyszące" },
      { id: "jp_family", question: "Wywiad rodzinny?", positiveLabel: "Choroby autoimmunologiczne", signal: "Wywiad rodzinny: choroby autoimmunologiczne", group: "przewlekłe" },
    ],
    examSuggestions: [
      { id: "jp_ex_swollen", label: "Stawy obrzęknięte", finding: "Stawy: obrzęk", severity: "warning" },
      { id: "jp_ex_tender", label: "Bolesność palpacyjna", finding: "Stawy: bolesność palpacyjna" },
      { id: "jp_ex_limited", label: "Ograniczony zakres ruchu", finding: "Ograniczony zakres ruchu w stawach" },
      { id: "jp_ex_rash", label: "Wysypka / rumień", finding: "Wysypka/rumień towarzyszący", severity: "warning" },
    ],
    icdHints: ["M25.5 — Ból stawu", "M06.9 — RZS, nieokreślone", "M10.9 — Dna moczanowa", "M79.6 — Ból kończyny"],
    baseRecommendation: "Ocena kryteriów zapalnych vs mechanicznych. Badania lab: OB, CRP. Przy podejrzeniu RZS — pilne skierowanie do reumatologa.",
    drugSuggestions: [
      { id: "jp_d_ibuprofen", name: "Ibuprofen", dose: "400 mg 2–3×/d z jedzeniem", triggers: [], note: "NLPZ — pierwsza linia bólu" },
      { id: "jp_d_diclofenac", name: "Diklofenak żel", dose: "2–4 g na bolący staw 3–4×/d", triggers: [], alternatives: ["Ketoprofen żel"], note: "NLPZ miejscowo" },
      { id: "jp_d_prednisolone", name: "Prednizon", dose: "10–15 mg/d × 5–7 dni", triggers: ["jp_ex_swollen", "jp_morning"], note: "Po wykluczeniu infekcji. Krótki kurs przy aktywnym zapaleniu" },
    ],
  },
  {
    id: "abdominal",
    label: "Ból brzucha",
    emoji: "",
    interviewQuestions: [
      { id: "ab_onset", question: "Od kiedy?", positiveLabel: "Nagły początek", signal: "Nagły początek bólu brzucha", group: "czas" },
      { id: "ab_location", question: "Lokalizacja?", positiveLabel: "Prawy dół", signal: "Ból w prawym dole brzucha (appendicitis?)", group: "charakter" },
      { id: "ab_nausea", question: "Nudności/wymioty?", positiveLabel: "Tak", signal: "Nudności i wymioty", group: "towarzyszące" },
      { id: "ab_diarrhea", question: "Biegunka?", positiveLabel: "Tak", signal: "Biegunka", group: "towarzyszące" },
      { id: "ab_blood", question: "Krew w stolcu?", positiveLabel: "Tak", signal: "Krew w stolcu (red flag)", group: "towarzyszące" },
      { id: "ab_fever", question: "Gorączka?", positiveLabel: "Tak", signal: "Gorączka", group: "towarzyszące" },
      { id: "ab_weight", question: "Utrata masy ciała?", positiveLabel: "Tak, niezamierzona", signal: "Niezamierzona utrata masy ciała (red flag)", group: "towarzyszące" },
      { id: "ab_meds", question: "NLPZ / antybiotyki?", positiveLabel: "Tak, ostatnio", signal: "Niedawne stosowanie NLPZ/antybiotyków", group: "przewlekłe" },
    ],
    examSuggestions: [
      { id: "ab_ex_tender", label: "Bolesność palpacyjna", finding: "Brzuch: bolesność palpacyjna" },
      { id: "ab_ex_guard", label: "Obrona mięśniowa", finding: "Brzuch: obrona mięśniowa (red flag)", severity: "warning" },
      { id: "ab_ex_rebound", label: "Objaw Blumberga (+)", finding: "Objaw Blumberga dodatni (red flag)", severity: "warning" },
      { id: "ab_ex_peristalsis", label: "Perystaltyka osłabiona", finding: "Perystaltyka osłabiona", severity: "warning" },
    ],
    icdHints: ["R10.4 — Ból brzucha", "K29.7 — Zapalenie żołądka", "A09 — Zapalenie żołądkowo-jelitowe"],
    baseRecommendation: "Ocena red flags (obrona mięśniowa, krew w stolcu). Nawadnianie. Dieta lekkostrawna.",
    drugSuggestions: [
      { id: "ab_d_drotaverine", name: "Drotaweryna", dose: "80 mg 2–3×/d", triggers: [], note: "Ból kurczowy" },
      { id: "ab_d_ppi", name: "Omeprazol", dose: "20 mg 1×/d rano", triggers: ["ab_meds"], alternatives: ["Pantoprazol", "Esomeprazol"], note: "Osłona żołądka / GERD" },
      { id: "ab_d_smecta", name: "Diosmektyt", dose: "3 g 3×/d", triggers: ["ab_diarrhea"], note: "Biegunka — adsorbent" },
      { id: "ab_d_metoclopramide", name: "Metoklopramid", dose: "10 mg do 3×/d", triggers: ["ab_nausea"], alternatives: ["Ondansetron 4 mg (oporny)"], note: "Nudności/wymioty" },
    ],
  },
  {
    id: "hypertension_control",
    label: "Kontrola — nadciśnienie",
    emoji: "",
    interviewQuestions: [
      { id: "ht_compliance", question: "Leki regularnie?", positiveLabel: "Nie zawsze", signal: "Niepełna adherencja do leczenia", group: "wywiad" },
      { id: "ht_bp_home", question: "Pomiary domowe?", positiveLabel: ">140/90", signal: "Pomiary domowe >140/90 mmHg", group: "wywiad" },
      { id: "ht_headache", question: "Bóle głowy?", positiveLabel: "Tak", signal: "Bóle głowy (niewyrównane RR?)", group: "towarzyszące" },
      { id: "ht_dizziness", question: "Zawroty głowy?", positiveLabel: "Tak", signal: "Zawroty głowy", group: "towarzyszące" },
      { id: "ht_edema", question: "Obrzęki?", positiveLabel: "Tak", signal: "Obrzęki kończyn dolnych", group: "towarzyszące" },
      { id: "ht_diet", question: "Dieta niskosodowa?", positiveLabel: "Nie", signal: "Brak diety niskosodowej", group: "przewlekłe" },
      { id: "ht_exercise", question: "Aktywność fizyczna?", positiveLabel: "Brak", signal: "Brak aktywności fizycznej", group: "przewlekłe" },
      { id: "ht_acei_cough", question: "Kaszel po ACEi?", positiveLabel: "Tak", signal: "Kaszel po ACEi — rozważyć zmianę na ARB", group: "towarzyszące" },
    ],
    examSuggestions: [
      { id: "ht_ex_bp_high", label: "RR ≥140/90", finding: "RR ≥140/90 mmHg — nadciśnienie niewyrównane", severity: "warning" },
      { id: "ht_ex_bp_low", label: "RR <120/80", finding: "RR <120/80 mmHg — cel osiągnięty" },
      { id: "ht_ex_edema", label: "Obrzęki", finding: "Obrzęki kończyn dolnych" },
    ],
    icdHints: ["I10 — Nadciśnienie tętnicze pierwotne", "I11.9 — Choroba nadciśnieniowa serca"],
    baseRecommendation: "Kontrola RR. Weryfikacja adherencji do leczenia. Modyfikacja stylu życia.",
    drugSuggestions: [
      { id: "ht_d_ramipril", name: "Ramipril", dose: "5–10 mg 1×/d", triggers: [], alternatives: ["Perindopril 5–10 mg", "Enalapril 10–20 mg"], note: "ACEi — pierwsza linia" },
      { id: "ht_d_losartan", name: "Losartan", dose: "50–100 mg 1×/d", triggers: [], alternatives: ["Valsartan 80–160 mg", "Telmisartan 40–80 mg"], note: "ARB — alternatywa przy kaszlu po ACEi" },
      { id: "ht_d_amlodipine", name: "Amlodypina", dose: "5–10 mg 1×/d", triggers: ["ht_ex_bp_high"], alternatives: ["Lerkanidypina"], note: "Ca-bloker — dołączenie przy niewyrównaniu" },
      { id: "ht_d_indapamide", name: "Indapamid SR", dose: "1,5 mg 1×/d rano", triggers: ["ht_ex_bp_high", "ht_edema"], alternatives: ["Hydrochlorotiazyd 12,5–25 mg"], note: "Diuretyk tiazydopodobny" },
      { id: "ht_d_bisoprolol", name: "Bisoprolol", dose: "2,5–10 mg 1×/d", triggers: ["ht_compliance"], alternatives: ["Nebivolol 5 mg", "Metoprolol ZOK 50–100 mg"], note: "Beta-bloker — przy tachykardii / HR >80" },
    ],
  },
  {
    id: "diabetes_control",
    label: "Kontrola — cukrzyca",
    emoji: "",
    interviewQuestions: [
      { id: "dm_hypo", question: "Hipoglikemie?", positiveLabel: "Tak, w ostatnim miesiącu", signal: "Epizody hipoglikemii", group: "wywiad" },
      { id: "dm_polyuria", question: "Poliuria?", positiveLabel: "Tak", signal: "Poliuria", group: "towarzyszące" },
      { id: "dm_thirst", question: "Wzmożone pragnienie?", positiveLabel: "Tak", signal: "Polidypsja", group: "towarzyszące" },
      { id: "dm_vision", question: "Pogorszenie wzroku?", positiveLabel: "Tak", signal: "Pogorszenie wzroku (retinopatia?)", group: "towarzyszące" },
      { id: "dm_feet", question: "Problemy ze stopami?", positiveLabel: "Tak", signal: "Problemy ze stopami (stopa cukrzycowa?)", group: "towarzyszące" },
      { id: "dm_compliance", question: "Leki/insulina regularnie?", positiveLabel: "Nie zawsze", signal: "Niepełna adherencja do leczenia", group: "przewlekłe" },
      { id: "dm_hba1c", question: "Ostatni HbA1c?", positiveLabel: ">7%", signal: "HbA1c >7% — niewyrównanie metaboliczne", group: "przewlekłe" },
    ],
    examSuggestions: [
      { id: "dm_ex_feet", label: "Stopy — zmiany", finding: "Stopy: zmiany skórne/neuropatia", severity: "warning" },
      { id: "dm_ex_bp", label: "RR podwyższone", finding: "RR podwyższone", severity: "warning" },
    ],
    icdHints: ["E11.9 — Cukrzyca typu 2, bez powikłań", "E11.2 — Cukrzyca typu 2 z powikłaniami nerkowymi", "E11.4 — Cukrzyca typu 2 z powikłaniami neurologicznymi"],
    baseRecommendation: "Kontrola glikemii. Ocena powikłań. Weryfikacja HbA1c, eGFR, lipidogram.",
    drugSuggestions: [
      { id: "dm_d_metformin", name: "Metformina", dose: "500–1000 mg 2×/d", triggers: [], note: "Pierwsza linia. Redukcja dawki przy eGFR 30–45. Przeciwwsk. <30" },
      { id: "dm_d_gliclazide", name: "Gliklazyd MR", dose: "30–120 mg 1×/d rano", triggers: ["dm_hba1c"], alternatives: ["Glimepiryd 1–4 mg"], note: "Sulfonylomocznik — druga linia. Ryzyko hipoglikemii" },
      { id: "dm_d_empagliflozin", name: "Empagliflozyna", dose: "10 mg 1×/d", triggers: ["dm_hba1c"], alternatives: ["Dapagliflozyna 10 mg", "Kanagliflozyna 100 mg"], note: "SGLT2i — korzyści kardio- i nefroprotekcyjne" },
      { id: "dm_d_sitagliptin", name: "Sitagliptyna", dose: "100 mg 1×/d", triggers: ["dm_hba1c"], alternatives: ["Linagliptyna 5 mg", "Wildagliptyna 50 mg 2×/d"], note: "DPP-4i — neutralna wagowo, dobrze tolerowana" },
    ],
  },
  {
    id: "prescription_renewal",
    label: "Recepta kontynuacyjna",
    emoji: "",
    interviewQuestions: [
      { id: "rx_working", question: "Lek działa dobrze?", positiveLabel: "Nie, problemy", signal: "Lek nieskuteczny / problemy", group: "wywiad" },
      { id: "rx_side_effects", question: "Objawy uboczne?", positiveLabel: "Tak", signal: "Objawy uboczne leku", group: "towarzyszące" },
      { id: "rx_new_symptoms", question: "Nowe objawy?", positiveLabel: "Tak", signal: "Nowe objawy od ostatniej wizyty", group: "towarzyszące" },
      { id: "rx_compliance", question: "Bierze regularnie?", positiveLabel: "Nie zawsze", signal: "Niepełna adherencja", group: "przewlekłe" },
    ],
    examSuggestions: [],
    icdHints: ["Z76.0 — Wypisanie recepty powtórnej"],
    baseRecommendation: "Weryfikacja skuteczności i tolerancji dotychczasowego leczenia. Kontynuacja lub modyfikacja.",
    drugSuggestions: [],
  },
  {
    id: "sick_leave",
    label: "Zwolnienie L4",
    emoji: "",
    interviewQuestions: [
      { id: "l4_reason", question: "Powód?", positiveLabel: "Infekcja", signal: "Zwolnienie z powodu infekcji", group: "wywiad" },
      { id: "l4_duration", question: "Trwa od?", positiveLabel: ">3 dni", signal: "Niezdolność do pracy >3 dni", group: "czas" },
      { id: "l4_fever", question: "Gorączka?", positiveLabel: "Tak", signal: "Gorączka", group: "towarzyszące" },
    ],
    examSuggestions: [],
    icdHints: ["J06.9 — Ostre zakażenie dróg oddechowych", "R50 — Gorączka"],
    baseRecommendation: "Ocena niezdolności do pracy. Dokumentacja objawów.",
    drugSuggestions: [],
  },
];

/* ─── Extra items pool — full list to add from ─── */
export interface ExtraItem {
  id: string;
  label: string;
  signal: string;
  category: "symptom" | "exam" | "history" | "lifestyle";
}

export const EXTRA_INTERVIEW_POOL: ExtraItem[] = [
  // Symptoms not in any complaint
  { id: "x_chest_pain", label: "Ból w klatce piersiowej", signal: "Ból w klatce piersiowej", category: "symptom" },
  { id: "x_palpitations", label: "Kołatanie serca", signal: "Kołatanie serca", category: "symptom" },
  { id: "x_syncope", label: "Omdlenia / zasłabnięcia", signal: "Omdlenia", category: "symptom" },
  { id: "x_dyspnea", label: "Duszność", signal: "Duszność", category: "symptom" },
  { id: "x_cough", label: "Kaszel", signal: "Kaszel", category: "symptom" },
  { id: "x_fever", label: "Gorączka", signal: "Gorączka", category: "symptom" },
  { id: "x_night_sweats", label: "Nocne poty", signal: "Nocne poty", category: "symptom" },
  { id: "x_weight_loss", label: "Utrata masy ciała", signal: "Niezamierzona utrata masy ciała", category: "symptom" },
  { id: "x_weight_gain", label: "Przyrost masy ciała", signal: "Przyrost masy ciała", category: "symptom" },
  { id: "x_fatigue", label: "Zmęczenie / osłabienie", signal: "Zmęczenie", category: "symptom" },
  { id: "x_insomnia", label: "Bezsenność", signal: "Bezsenność", category: "symptom" },
  { id: "x_anxiety", label: "Lęk / niepokój", signal: "Lęk", category: "symptom" },
  { id: "x_depression", label: "Obniżony nastrój", signal: "Obniżony nastrój", category: "symptom" },
  { id: "x_rash", label: "Wysypka", signal: "Wysypka", category: "symptom" },
  { id: "x_itch", label: "Świąd", signal: "Świąd", category: "symptom" },
  { id: "x_edema", label: "Obrzęki", signal: "Obrzęki", category: "symptom" },
  { id: "x_polyuria", label: "Częstomocz", signal: "Częstomocz", category: "symptom" },
  { id: "x_dysuria", label: "Ból przy oddawaniu moczu", signal: "Dysuria", category: "symptom" },
  { id: "x_back_pain", label: "Ból pleców", signal: "Ból pleców", category: "symptom" },
  { id: "x_numbness", label: "Drętwienie / mrowienie", signal: "Drętwienie kończyn", category: "symptom" },
  { id: "x_vision", label: "Zaburzenia widzenia", signal: "Zaburzenia widzenia", category: "symptom" },
  // History
  { id: "x_allergies", label: "Alergie", signal: "Alergie", category: "history" },
  { id: "x_smoking", label: "Palenie", signal: "Palenie tytoniu", category: "lifestyle" },
  { id: "x_alcohol", label: "Alkohol", signal: "Spożywanie alkoholu", category: "lifestyle" },
  { id: "x_pregnancy", label: "Ciąża", signal: "Ciąża", category: "history" },
  { id: "x_family_cv", label: "Rodzinnie: choroby serca", signal: "Wywiad rodzinny: choroby sercowo-naczyniowe", category: "history" },
  { id: "x_family_cancer", label: "Rodzinnie: nowotwory", signal: "Wywiad rodzinny: nowotwory", category: "history" },
  { id: "x_diabetes", label: "Cukrzyca", signal: "Cukrzyca w wywiadzie", category: "history" },
  { id: "x_hypertension", label: "Nadciśnienie", signal: "Nadciśnienie w wywiadzie", category: "history" },
  { id: "x_asthma", label: "Astma / POChP", signal: "Astma/POChP w wywiadzie", category: "history" },
];

export const EXTRA_EXAM_POOL: ExtraItem[] = [
  { id: "xe_bp_high", label: "RR podwyższone", signal: "RR podwyższone", category: "exam" },
  { id: "xe_bp_low", label: "RR obniżone", signal: "RR obniżone (<90/60)", category: "exam" },
  { id: "xe_hr_tachy", label: "Tachykardia", signal: "Tachykardia (>100/min)", category: "exam" },
  { id: "xe_hr_brady", label: "Bradykardia", signal: "Bradykardia (<60/min)", category: "exam" },
  { id: "xe_hr_irreg", label: "Niemiarowa akcja serca", signal: "Niemiarowa akcja serca", category: "exam" },
  { id: "xe_sat_low", label: "Saturacja <95%", signal: "Saturacja <95%", category: "exam" },
  { id: "xe_temp_high", label: "Gorączka >38°C", signal: "Temperatura >38°C", category: "exam" },
  { id: "xe_throat_red", label: "Gardło przekrwione", signal: "Gardło: przekrwione", category: "exam" },
  { id: "xe_tonsils", label: "Migdałki powiększone", signal: "Migdałki: powiększone", category: "exam" },
  { id: "xe_lungs_wheeze", label: "Świsty nad płucami", signal: "Osłuchiwanie: świsty", category: "exam" },
  { id: "xe_lungs_crackle", label: "Trzeszczenia nad płucami", signal: "Osłuchiwanie: trzeszczenia", category: "exam" },
  { id: "xe_abdomen_tender", label: "Brzuch bolesny", signal: "Brzuch: bolesność palpacyjna", category: "exam" },
  { id: "xe_abdomen_guard", label: "Obrona mięśniowa", signal: "Brzuch: obrona mięśniowa", category: "exam" },
  { id: "xe_lymph", label: "Węzły chłonne powiększone", signal: "Węzły chłonne powiększone", category: "exam" },
  { id: "xe_edema", label: "Obrzęki kończyn", signal: "Obrzęki kończyn dolnych", category: "exam" },
  { id: "xe_joint_swollen", label: "Stawy obrzęknięte", signal: "Stawy: obrzęk", category: "exam" },
  { id: "xe_skin_rash", label: "Wysypka / rumień", signal: "Wysypka / rumień", category: "exam" },
  { id: "xe_neuro_focal", label: "Objawy ogniskowe CNS", signal: "Objawy neurologiczne ogniskowe", category: "exam" },
];

/* ─── Visit state ─── */
export interface CustomItem {
  id: string;
  label: string;
  signal: string;
}

export interface VisitState {
  stage: VisitStage;
  sex: PatientSex | null;
  age: string;
  complaintId: string | null;
  positiveFindings: Set<string>;
  abnormalExam: Set<string>;
  /** Items added from the extra pool or custom typed */
  customFindings: CustomItem[];
  customExams: CustomItem[];
  notes: string;
}

export function createVisitState(): VisitState {
  return {
    stage: "triage",
    sex: null,
    age: "",
    complaintId: null,
    positiveFindings: new Set(),
    abnormalExam: new Set(),
    customFindings: [],
    customExams: [],
    notes: "",
  };
}

/** Build full context string from visit state — fed to AI */
export function buildQueryFromVisit(state: VisitState): string {
  const complaint = COMPLAINTS.find((c) => c.id === state.complaintId);
  if (!complaint) return "";

  const parts: string[] = [];

  // Demographics
  if (state.sex) parts.push(state.sex === "dziecko" ? "Dziecko" : state.sex === "K" ? "Kobieta" : "Mężczyzna");
  if (state.age) parts.push(state.age);

  // Complaint
  parts.push(complaint.label);

  // Positive findings from interview
  for (const q of complaint.interviewQuestions) {
    if (state.positiveFindings.has(q.id)) {
      parts.push(q.signal);
    }
  }

  // Abnormal exam findings
  for (const ex of complaint.examSuggestions) {
    if (state.abnormalExam.has(ex.id)) {
      parts.push(ex.finding);
    }
  }

  // Custom added items
  for (const cf of state.customFindings) parts.push(cf.signal);
  for (const ce of state.customExams) parts.push(ce.signal);

  if (state.notes.trim()) parts.push(state.notes.trim());

  parts.push("Co rozważyć?");

  return parts.join(". ");
}

/** Get drugs relevant to current state — base drugs + triggered ones */
export function getActiveDrugs(state: VisitState): DrugSuggestion[] {
  const complaint = COMPLAINTS.find((c) => c.id === state.complaintId);
  if (!complaint) return [];

  const allActive = new Set([...state.positiveFindings, ...state.abnormalExam]);

  return complaint.drugSuggestions.filter((drug) => {
    if (drug.triggers.length === 0) return true; // always shown
    return drug.triggers.some((t) => allActive.has(t));
  });
}

/** Build exportable note from visit state */
export function buildVisitNote(
  state: VisitState,
  removedDrugIds?: Set<string>,
  editedDoses?: Map<string, string>,
): string {
  const complaint = COMPLAINTS.find((c) => c.id === state.complaintId);
  if (!complaint) return "";

  const lines: string[] = [];
  const date = new Date().toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });

  lines.push(`OPIS WIZYTY — ${date}`);
  lines.push("─".repeat(40));

  // Patient
  const demo: string[] = [];
  if (state.sex) demo.push(state.sex === "K" ? "Kobieta" : state.sex === "M" ? "Mężczyzna" : "Dziecko");
  if (state.age) demo.push(state.age);
  if (demo.length) lines.push(`Pacjent: ${demo.join(", ")}`);
  lines.push(`Powód wizyty: ${complaint.label}`);
  lines.push("");

  // Findings
  const findings = complaint.interviewQuestions.filter((q) => state.positiveFindings.has(q.id));
  const allFindings = [...findings.map((f) => f.signal), ...state.customFindings.map((f) => f.signal)];
  if (allFindings.length) {
    lines.push("Wywiad:");
    allFindings.forEach((f) => lines.push(`  • ${f}`));
    lines.push("");
  }

  const exams = complaint.examSuggestions.filter((e) => state.abnormalExam.has(e.id));
  const allExams = [...exams.map((e) => e.finding), ...state.customExams.map((e) => e.signal)];
  if (allExams.length) {
    lines.push("Badanie fizykalne:");
    allExams.forEach((e) => lines.push(`  • ${e}`));
    lines.push("");
  }

  // ICD
  lines.push("Rozpoznanie (ICD-10):");
  complaint.icdHints.forEach((h) => lines.push(`  ${h}`));
  lines.push("");

  // Drugs
  const drugs = getActiveDrugs(state).filter((d) => !removedDrugIds?.has(d.id));
  if (drugs.length) {
    lines.push("Zalecono:");
    drugs.forEach((d) => {
      const dose = editedDoses?.get(d.id) || d.dose;
      lines.push(`  ${d.name} ${dose}`);
    });
    lines.push("");
  }

  // Recommendation
  lines.push("Zalecenia:");
  lines.push(`  ${complaint.baseRecommendation}`);
  if (state.notes.trim()) lines.push(`  ${state.notes.trim()}`);
  lines.push("");

  lines.push("─".repeat(40));
  lines.push("Wygenerowano z Co-Pilot AI / Remedium.md");

  return lines.join("\n");
}
