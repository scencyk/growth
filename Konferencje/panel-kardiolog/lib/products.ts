// Per-node product definitions and campaign metric helpers.
// Each node on the flow graph has exactly ONE product type that maps to it.
// A pharma company "activates" nodes (touchpoints) to build their campaign.

import type { FeatureKey } from "./types";
import { flowNodes } from "./flow";
import { cardiologist } from "./data";

const WEEKS_IN_PERIOD = 89 / 7; // Feb 19 – May 19, 2026 ≈ 12.7 weeks

export interface NodeProduct {
  nodeId: FeatureKey;
  name: string;    // Commercial product name shown to pharma client
  format: string;  // Format category (VOD, Native, Display, etc.)
  avgMinutes: number; // Avg brand exposure time per session
  icon: string;    // Lucide icon name
  color: string;   // Accent color
}

// One product per node — you can't put VOD on a calculator or vice versa.
export const nodeProducts: Partial<Record<FeatureKey, NodeProduct>> = {
  "main-panel":         { nodeId: "main-panel",         name: "Banner na panelu głównym",          format: "Display",   avgMinutes: 2,  icon: "LayoutDashboard", color: "#ef4444" },
  "medical-calculator": { nodeId: "medical-calculator",  name: "Native w kalkulatorze",             format: "Native",    avgMinutes: 4,  icon: "Calculator",      color: "#10b981" },
  "article":            { nodeId: "article",             name: "Artykuł sponsorowany",              format: "Content",   avgMinutes: 4,  icon: "FileText",        color: "#f59e0b" },
  "vod":                { nodeId: "vod",                 name: "5 minut o leku / Medyczne Espresso", format: "VOD",      avgMinutes: 6,  icon: "Play",            color: "#f59e0b" },
  "conference":         { nodeId: "conference",          name: "Patronat konferencji",               format: "Event",     avgMinutes: 20, icon: "Mic2",            color: "#f59e0b" },
  "course":             { nodeId: "course",              name: "Kurs sponsorowany",                  format: "Education", avgMinutes: 15, icon: "GraduationCap",   color: "#8b5cf6" },
  "meds":               { nodeId: "meds",                name: "Wpis w wyszukiwarce leków",          format: "Native",    avgMinutes: 3,  icon: "Pill",            color: "#10b981" },
  "e-book":             { nodeId: "e-book",              name: "E-book firmowany",                   format: "Content",   avgMinutes: 10, icon: "BookOpen",        color: "#f59e0b" },
  "webinar":            { nodeId: "webinar",             name: "Webinar CME",                        format: "Live",      avgMinutes: 25, icon: "Video",           color: "#3b82f6" },
  "clinical-case":      { nodeId: "clinical-case",       name: "Case study sponsorowany",            format: "Content",   avgMinutes: 5,  icon: "ClipboardList",   color: "#f59e0b" },
};

export function getNodeStats(nodeId: FeatureKey) {
  const node = flowNodes.find((n) => n.id === nodeId);
  const product = nodeProducts[nodeId];
  const section = cardiologist.topSections.find((s) => s.feature === nodeId);
  if (!node || !product) return null;

  const sessionsPerWeek = node.sessions / WEEKS_IN_PERIOD;
  const minutesPerWeek = sessionsPerWeek * product.avgMinutes;
  const uuPer90d = section?.uu ?? 0;

  return {
    sessionsPerWeek: Math.round(sessionsPerWeek),
    minutesPerWeek: Math.round(minutesPerWeek),
    uuPer90d,
  };
}

export function getCampaignMetrics(activeNodeIds: FeatureKey[]) {
  const withProduct = activeNodeIds.filter((id) => nodeProducts[id]);

  let touchpointsPerWeek = 0;
  let minutesPerWeek = 0;
  let maxUU = 0;

  for (const id of withProduct) {
    const stats = getNodeStats(id);
    if (!stats) continue;
    touchpointsPerWeek += stats.sessionsPerWeek;
    minutesPerWeek += stats.minutesPerWeek;
    if (stats.uuPer90d > maxUU) maxUU = stats.uuPer90d;
  }

  const totalCohort = cardiologist.totalActive90d; // 591 active cardiologists
  const coveragePct = Math.round((maxUU / totalCohort) * 100);

  return {
    touchpointsPerWeek: Math.round(touchpointsPerWeek),
    minutesPerWeek: Math.round(minutesPerWeek),
    hoursPerWeek: Math.round((minutesPerWeek / 60) * 10) / 10,
    maxUU,
    coveragePct,
    nodeCount: withProduct.length,
    totalCohort,
  };
}
