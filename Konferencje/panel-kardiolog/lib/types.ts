export type FeatureKey =
  | "article"
  | "main-panel"
  | "conference"
  | "medical-calculator"
  | "vod"
  | "course"
  | "icd-10"
  | "tutorial"
  | "residency-encyclopedia"
  | "residency-map"
  | "exams"
  | "meds"
  | "e-book"
  | "webinar"
  | "clinical-case"
  | "profile"
  | "security"
  | "club";

export type ProductCategory =
  | "vod-series"
  | "vod-single"
  | "course"
  | "webinar"
  | "banner"
  | "native-content"
  | "ebook"
  | "push"
  | "newsletter";

export interface SpecialtyPersona {
  slug: string;
  name: string;
  cohortId: number;
  totalRegistered: number;
  totalActive90d: number;
  statusBreakdown: {
    specialist: number;
    resident: number;
    intern: number;
    without: number;
  };
  platformBreakdown: { web: number; app: number };
  weeklyHeatmap: number[][];
  dayTotals: number[];
  dayLabels: string[];
  topSections: { feature: FeatureKey; label: string; uu: number }[];
  topContent: { title: string; type: string; uu: number; path: string }[];
  signature: { feature: FeatureKey; day: number; hour: number; label: string; uu: number }[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  icon: string;
  fits: FeatureKey[];
  bestHours: [number, number];
  bestDays: number[];
  reach: string;
  description: string;
  pricing: string;
  color: string;
}

export interface Placement {
  id: string;
  productId: string;
  // Either bound to a heatmap cell (day+hour) or to a flow-graph node — never both.
  day?: number;
  hour?: number;
  nodeId?: FeatureKey;
  note?: string;
}

export interface Touchpoint {
  day: number;
  hour: number;
  uu: number;
  intensity: number;
  feature?: FeatureKey;
  label?: string;
}
