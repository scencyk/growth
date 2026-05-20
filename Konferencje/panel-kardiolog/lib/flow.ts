// Graf przepływów kardiologa w serwisie. Dane PostHog z sesji (2026-02-19 — 2026-05-19, kohorta 41).
// Pozycje (x,y) są curated dla narracji wizualnej — main-panel jako hub, dalsze sekcje na orbitach.

import type { FeatureKey } from "./types";

export interface FlowNode {
  id: FeatureKey;
  label: string;
  x: number; // -500..500 viewBox coords
  y: number;
  sessions: number;
  entries: number; // ile sesji startowało od tego node'a (deep-link)
  pageviews: number;
  category: "hub" | "content" | "tool" | "education" | "auth";
}

export interface FlowEdge {
  src: FeatureKey;
  dst: FeatureKey;
  weight: number; // transition count
}

// Node weights from PostHog (sessions, entries, pageviews)
export const flowNodes: FlowNode[] = [
  // HUB (center)
  { id: "main-panel", label: "Panel główny", x: 0, y: 0, sessions: 1672, entries: 1504, pageviews: 6238, category: "hub" },

  // Primary ring (radius ~280) — top 6 sections by connections
  { id: "medical-calculator", label: "Kalkulatory", x: 280, y: -40, sessions: 1175, entries: 901, pageviews: 1559, category: "tool" },
  { id: "article", label: "Publikacje", x: 140, y: -240, sessions: 832, entries: 578, pageviews: 1335, category: "content" },
  { id: "vod", label: "VOD", x: -140, y: -240, sessions: 690, entries: 415, pageviews: 1727, category: "content" },
  { id: "conference", label: "Konferencje", x: -280, y: -40, sessions: 625, entries: 403, pageviews: 932, category: "content" },
  { id: "course", label: "Kursy", x: -200, y: 200, sessions: 553, entries: 397, pageviews: 1193, category: "education" },
  { id: "meds", label: "Wyszukiwarka leków", x: 200, y: 200, sessions: 451, entries: 176, pageviews: 1253, category: "tool" },

  // Secondary ring (radius ~440)
  { id: "icd-10", label: "ICD-10", x: 400, y: 180, sessions: 323, entries: 254, pageviews: 471, category: "tool" },
  { id: "residency-encyclopedia", label: "Enc. rezydentur", x: 280, y: -340, sessions: 199, entries: 98, pageviews: 500, category: "education" },
  { id: "tutorial", label: "Poradniki", x: -380, y: -240, sessions: 154, entries: 77, pageviews: 288, category: "content" },
  { id: "exams", label: "Egzaminy", x: 440, y: -180, sessions: 136, entries: 56, pageviews: 1156, category: "education" },
  { id: "residency-map", label: "Mapa rezydentur", x: 380, y: -320, sessions: 85, entries: 52, pageviews: 364, category: "tool" },
  { id: "e-book", label: "E-booki", x: -400, y: 200, sessions: 53, entries: 23, pageviews: 77, category: "content" },
  { id: "webinar", label: "Webinary", x: -360, y: 320, sessions: 41, entries: 14, pageviews: 67, category: "content" },
  { id: "clinical-case", label: "Przypadki", x: -100, y: 340, sessions: 45, entries: 0, pageviews: 107, category: "education" },
];

// Top transitions (PostHog) — only kept those with both endpoints in flowNodes
export const flowEdges: FlowEdge[] = [
  // Hub spokes — outbound from main-panel
  { src: "main-panel", dst: "meds", weight: 247 },
  { src: "main-panel", dst: "article", weight: 238 },
  { src: "main-panel", dst: "vod", weight: 232 },
  { src: "main-panel", dst: "medical-calculator", weight: 225 },
  { src: "main-panel", dst: "course", weight: 109 },
  { src: "main-panel", dst: "conference", weight: 88 },
  { src: "main-panel", dst: "residency-encyclopedia", weight: 62 },
  { src: "main-panel", dst: "exams", weight: 59 },
  { src: "main-panel", dst: "icd-10", weight: 51 },
  { src: "main-panel", dst: "tutorial", weight: 42 },
  // Hub spokes — inbound to main-panel
  { src: "article", dst: "main-panel", weight: 83 },
  { src: "vod", dst: "main-panel", weight: 69 },
  { src: "conference", dst: "main-panel", weight: 66 },
  { src: "meds", dst: "main-panel", weight: 48 },
  { src: "course", dst: "main-panel", weight: 34 },
  { src: "medical-calculator", dst: "main-panel", weight: 19 },
  // Cross edges — narrative gold (kontekstowe ścieżki edukacyjne)
  { src: "article", dst: "conference", weight: 53 },
  { src: "article", dst: "vod", weight: 41 },
  { src: "vod", dst: "conference", weight: 35 },
  { src: "medical-calculator", dst: "conference", weight: 33 },
  { src: "vod", dst: "webinar", weight: 28 },
  { src: "webinar", dst: "vod", weight: 27 },
  { src: "icd-10", dst: "meds", weight: 25 },
  { src: "conference", dst: "article", weight: 24 },
  { src: "vod", dst: "article", weight: 24 },
  { src: "vod", dst: "course", weight: 24 },
  { src: "course", dst: "conference", weight: 23 },
  { src: "medical-calculator", dst: "meds", weight: 18 },
  { src: "article", dst: "residency-encyclopedia", weight: 17 },
  { src: "course", dst: "vod", weight: 16 },
  { src: "meds", dst: "medical-calculator", weight: 15 },
  { src: "residency-encyclopedia", dst: "residency-map", weight: 14 },
];

export const nodeColors: Record<string, string> = {
  hub: "#ef4444",
  content: "#f59e0b",
  tool: "#10b981",
  education: "#8b5cf6",
  auth: "#64748b",
};
