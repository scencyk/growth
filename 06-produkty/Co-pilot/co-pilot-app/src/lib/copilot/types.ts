/* ─── Specialization ─── */
export type Specialization =
  | "kardiologia"
  | "pediatria"
  | "reumatologia"
  | "interna"
  | "diabetologia"
  | "neurologia";

/* ─── Drug Interactions ─── */
export type InteractionStatus = "safe" | "caution" | "danger";

export interface DrugInteraction {
  drug: string;
  status: InteractionStatus;
  note: string;
}

/* ─── ICD-10 ─── */
export interface IcdCode {
  code: string;
  label: string;
}

/* ─── Sources ─── */
export interface Source {
  id: number;
  title: string;
  url: string;
  type: "guideline" | "study" | "spc";
}

/* ─── Data table rows ─── */
export interface DataRow {
  key: string;
  value: string;
  highlight?: boolean;
}

/* ─── Patient context (auto-extracted from query) ─── */
export interface PatientContext {
  age?: string;
  sex?: string;
  conditions?: string[];
  medications?: string[];
  symptoms?: string[];
  parameters?: { key: string; value: string }[];
}

/* ─── AI Response ─── */
export interface CoPilotResponse {
  scenarioId: string;
  synthesis: string;
  context?: PatientContext;
  data?: {
    label: string;
    rows: DataRow[];
    note?: string;
  };
  interactions?: DrugInteraction[];
  icdCodes: IcdCode[];
  sources: Source[];
  followUp: string[];
  criticalAlert?: string;
}

/* ─── Symptom / Context tags ─── */
export type TagCategory = "symptom" | "condition" | "medication" | "parameter" | "demographic";

export interface SymptomTag {
  id: string;
  label: string;
  category: TagCategory;
  value?: string; // for parameters like "eGFR: 45"
}

/* ─── Patient Card ─── */
export type PatientStatus = "new" | "loading" | "ready" | "error";

/** @deprecated — use PatientStatus instead */
export type CoPilotState = "empty" | "input" | "loading" | "response";

export interface Patient {
  id: string;
  label: string;
  query: string;
  tags: SymptomTag[];
  status: PatientStatus;
  response: CoPilotResponse | null;
  specialization: Specialization;
  createdAt: Date;
}

/* ─── History (kept for backward compat) ─── */
export interface HistoryEntry {
  id: string;
  query: string;
  timestamp: Date;
}
