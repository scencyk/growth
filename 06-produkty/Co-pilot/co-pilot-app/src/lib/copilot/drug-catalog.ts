/**
 * Drug catalog — forms, doses, packages, prices, ChPL links.
 * Mock data with real Polish trade names, manufacturers and realistic prices.
 */

export interface DrugPackage {
  id: string;
  size: string;
  tradeName: string;
  manufacturer: string;
  priceGross: number;
  priceRefunded: number | null;
  refundLevel?: string;
}

export interface DrugDose {
  id: string;
  value: string;
  packages: DrugPackage[];
}

export interface DrugForm {
  id: string;
  label: string;
  doses: DrugDose[];
}

export interface DrugSelection {
  formLabel: string;
  doseValue: string;
  packageSize: string;
  tradeName: string;
  manufacturer: string;
  priceGross: number;
  priceRefunded: number | null;
  refundLevel?: string;
}

export interface DrugCatalogEntry {
  inn: string;
  /** Which DrugSuggestion.id values map to this catalog entry */
  suggestionIds: string[];
  chplUrl: string;
  forms: DrugForm[];
}

export const DRUG_CATALOG: DrugCatalogEntry[] = [
  {
    inn: "Metformina",
    suggestionIds: ["dm_d_metformin"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=metformina",
    forms: [
      {
        id: "met_tab", label: "tabl. powl.",
        doses: [
          {
            id: "met_500", value: "500 mg",
            packages: [
              { id: "met_500_30_pol", size: "30 tabl.", tradeName: "Metformax", manufacturer: "Polpharma", priceGross: 4.20, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "met_500_60_pol", size: "60 tabl.", tradeName: "Metformax", manufacturer: "Polpharma", priceGross: 7.80, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "met_500_60_san", size: "60 tabl.", tradeName: "Siofor", manufacturer: "Berlin-Chemie", priceGross: 8.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "met_850", value: "850 mg",
            packages: [
              { id: "met_850_60_pol", size: "60 tabl.", tradeName: "Metformax", manufacturer: "Polpharma", priceGross: 9.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "met_850_60_san", size: "60 tabl.", tradeName: "Siofor", manufacturer: "Berlin-Chemie", priceGross: 11.20, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "met_1000", value: "1000 mg",
            packages: [
              { id: "met_1000_60_pol", size: "60 tabl.", tradeName: "Metformax", manufacturer: "Polpharma", priceGross: 11.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "met_1000_90_pol", size: "90 tabl.", tradeName: "Metformax", manufacturer: "Polpharma", priceGross: 15.80, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "met_1000_60_glu", size: "60 tabl.", tradeName: "Glucophage XR", manufacturer: "Merck", priceGross: 18.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Ramipril",
    suggestionIds: ["ht_d_ramipril"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=ramipril",
    forms: [
      {
        id: "ram_tab", label: "tabl.",
        doses: [
          {
            id: "ram_2_5", value: "2,5 mg",
            packages: [
              { id: "ram_2_5_28", size: "28 tabl.", tradeName: "Tritace", manufacturer: "Sanofi", priceGross: 8.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "ram_2_5_28_pol", size: "28 tabl.", tradeName: "Ramipril Polpharma", manufacturer: "Polpharma", priceGross: 5.20, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "ram_5", value: "5 mg",
            packages: [
              { id: "ram_5_28", size: "28 tabl.", tradeName: "Tritace", manufacturer: "Sanofi", priceGross: 12.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "ram_5_28_pol", size: "28 tabl.", tradeName: "Ramipril Polpharma", manufacturer: "Polpharma", priceGross: 7.80, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "ram_10", value: "10 mg",
            packages: [
              { id: "ram_10_28", size: "28 tabl.", tradeName: "Tritace", manufacturer: "Sanofi", priceGross: 18.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "ram_10_28_zen", size: "28 tabl.", tradeName: "Ramipril Zentiva", manufacturer: "Zentiva", priceGross: 9.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Amoksycylina",
    suggestionIds: ["ri_d_amoxicillin"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=amoksycylina",
    forms: [
      {
        id: "amox_tab", label: "tabl.",
        doses: [
          {
            id: "amox_500", value: "500 mg",
            packages: [
              { id: "amox_500_16", size: "16 tabl.", tradeName: "Ospamox", manufacturer: "Sandoz", priceGross: 12.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "amox_500_16_pol", size: "16 tabl.", tradeName: "Amotaks", manufacturer: "Polpharma", priceGross: 9.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "amox_1000", value: "1000 mg",
            packages: [
              { id: "amox_1000_16", size: "16 tabl.", tradeName: "Ospamox", manufacturer: "Sandoz", priceGross: 18.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
      {
        id: "amox_susp", label: "zawiesina",
        doses: [
          {
            id: "amox_susp_250", value: "250 mg/5 ml",
            packages: [
              { id: "amox_susp_250_100", size: "100 ml", tradeName: "Ospamox", manufacturer: "Sandoz", priceGross: 11.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Ibuprofen",
    suggestionIds: ["ri_d_ibuprofen", "ha_d_ibuprofen", "jp_d_ibuprofen"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=ibuprofen",
    forms: [
      {
        id: "ibu_tab", label: "tabl. powl.",
        doses: [
          {
            id: "ibu_200", value: "200 mg",
            packages: [
              { id: "ibu_200_20", size: "20 tabl.", tradeName: "Ibuprom", manufacturer: "US Pharmacia", priceGross: 8.90, priceRefunded: null },
              { id: "ibu_200_60", size: "60 tabl.", tradeName: "Nurofen", manufacturer: "Reckitt", priceGross: 22.50, priceRefunded: null },
            ],
          },
          {
            id: "ibu_400", value: "400 mg",
            packages: [
              { id: "ibu_400_20", size: "20 tabl.", tradeName: "Ibuprom MAX", manufacturer: "US Pharmacia", priceGross: 14.90, priceRefunded: null },
              { id: "ibu_400_20_pol", size: "20 tabl.", tradeName: "Ibuprofen Polpharma", manufacturer: "Polpharma", priceGross: 6.50, priceRefunded: null },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Paracetamol",
    suggestionIds: ["ri_d_paracetamol", "ha_d_paracetamol"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=paracetamol",
    forms: [
      {
        id: "para_tab", label: "tabl.",
        doses: [
          {
            id: "para_500", value: "500 mg",
            packages: [
              { id: "para_500_20", size: "20 tabl.", tradeName: "Apap", manufacturer: "US Pharmacia", priceGross: 6.90, priceRefunded: null },
              { id: "para_500_50", size: "50 tabl.", tradeName: "Paracetamol Polpharma", manufacturer: "Polpharma", priceGross: 8.50, priceRefunded: null },
            ],
          },
          {
            id: "para_1000", value: "1000 mg",
            packages: [
              { id: "para_1000_10", size: "10 tabl.", tradeName: "Apap Extra", manufacturer: "US Pharmacia", priceGross: 7.50, priceRefunded: null },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Bisoprolol",
    suggestionIds: ["ht_d_bisoprolol"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=bisoprolol",
    forms: [
      {
        id: "bis_tab", label: "tabl. powl.",
        doses: [
          {
            id: "bis_2_5", value: "2,5 mg",
            packages: [
              { id: "bis_2_5_28", size: "28 tabl.", tradeName: "Concor COR", manufacturer: "Merck", priceGross: 9.80, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "bis_5", value: "5 mg",
            packages: [
              { id: "bis_5_28", size: "28 tabl.", tradeName: "Concor", manufacturer: "Merck", priceGross: 12.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "bis_5_28_pol", size: "28 tabl.", tradeName: "Bisoprolol Polpharma", manufacturer: "Polpharma", priceGross: 5.80, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "bis_10", value: "10 mg",
            packages: [
              { id: "bis_10_28", size: "28 tabl.", tradeName: "Concor", manufacturer: "Merck", priceGross: 16.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Losartan",
    suggestionIds: ["ht_d_losartan"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=losartan",
    forms: [
      {
        id: "los_tab", label: "tabl. powl.",
        doses: [
          {
            id: "los_50", value: "50 mg",
            packages: [
              { id: "los_50_28", size: "28 tabl.", tradeName: "Cozaar", manufacturer: "MSD", priceGross: 14.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "los_50_28_krka", size: "28 tabl.", tradeName: "Lorista", manufacturer: "KRKA", priceGross: 7.20, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "los_100", value: "100 mg",
            packages: [
              { id: "los_100_28", size: "28 tabl.", tradeName: "Lorista", manufacturer: "KRKA", priceGross: 11.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Empagliflozyna",
    suggestionIds: ["dm_d_empagliflozin"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=empagliflozyna",
    forms: [
      {
        id: "empa_tab", label: "tabl. powl.",
        doses: [
          {
            id: "empa_10", value: "10 mg",
            packages: [
              { id: "empa_10_28", size: "28 tabl.", tradeName: "Jardiance", manufacturer: "Boehringer Ingelheim", priceGross: 189.00, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "empa_25", value: "25 mg",
            packages: [
              { id: "empa_25_28", size: "28 tabl.", tradeName: "Jardiance", manufacturer: "Boehringer Ingelheim", priceGross: 189.00, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Omeprazol",
    suggestionIds: ["ab_d_ppi"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=omeprazol",
    forms: [
      {
        id: "ome_caps", label: "kaps.",
        doses: [
          {
            id: "ome_20", value: "20 mg",
            packages: [
              { id: "ome_20_28", size: "28 kaps.", tradeName: "Polprazol", manufacturer: "Polpharma", priceGross: 8.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "ome_20_28_san", size: "28 kaps.", tradeName: "Omeprazol Sandoz", manufacturer: "Sandoz", priceGross: 7.20, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
  {
    inn: "Amlodypina",
    suggestionIds: ["ht_d_amlodipine"],
    chplUrl: "https://rejestrymedyczne.ezdrowie.gov.pl/rpl/search/public?productName=amlodypina",
    forms: [
      {
        id: "amlo_tab", label: "tabl.",
        doses: [
          {
            id: "amlo_5", value: "5 mg",
            packages: [
              { id: "amlo_5_30", size: "30 tabl.", tradeName: "Norvasc", manufacturer: "Pfizer", priceGross: 14.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "amlo_5_30_pol", size: "30 tabl.", tradeName: "Amlodipine Polpharma", manufacturer: "Polpharma", priceGross: 5.90, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
          {
            id: "amlo_10", value: "10 mg",
            packages: [
              { id: "amlo_10_30", size: "30 tabl.", tradeName: "Norvasc", manufacturer: "Pfizer", priceGross: 22.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
              { id: "amlo_10_30_pol", size: "30 tabl.", tradeName: "Amlodipine Polpharma", manufacturer: "Polpharma", priceGross: 8.50, priceRefunded: 3.20, refundLevel: "Ryczałt" },
            ],
          },
        ],
      },
    ],
  },
];

/** Find catalog entry for a given DrugSuggestion.id */
export function findCatalogEntry(suggestionId: string): DrugCatalogEntry | null {
  return DRUG_CATALOG.find((e) => e.suggestionIds.includes(suggestionId)) ?? null;
}
