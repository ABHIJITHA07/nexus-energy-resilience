export interface CustomerSegment {
  name: string;
  pctOfRevenue: number;
}

export interface Company {
  id: string;
  name: string;
  dailyThroughputBbl: number;
  hormuzExposurePct: number;
  annualRevenueUsd: number;
  customerSegments: CustomerSegment[];
}

export interface Supplier {
  id: string;
  name: string;
  region: string;
  hormuzDependent: boolean;
  volumeSharePct: number;
  contractType: "spot" | "term";
  alternativeLeadTimeDays: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  mode: "tanker" | "pipeline" | "rail";
  hormuzDependent: boolean;
  normalCapacityKbd: number;
  currentUtilizationPct: number;
  altModeAvailable: boolean;
}

export interface StorageSite {
  id: string;
  name: string;
  capacityKb: number;
  currentFillPct: number;
  drawdownRateKbPerDay: number;
}

export interface InventoryPosition {
  id: string;
  productType: string;
  currentVolumeKb: number;
  dailyConsumptionKb: number;
  targetRunwayDays: number;
}

export interface RiskIndicator {
  id: string;
  name: string;
  currentLevel: number; // 0-100
  trend: "rising" | "stable" | "falling";
  lastUpdatedLabel: string;
}

export interface ResilienceOption {
  id: string;
  name: string;
  category: string;
  baseCostUsd: number;
  costGrowthRatePctPerDay: number;
  daysUntilImpractical: number;
  resilienceContribution: number;
  leadTimeDays: number;
  description: string;
  targetFactorIds: string[];
}

export interface ScenarioState {
  disruptionDurationAssumptionDays: number; // 15-180, default 45
  riskLevel: number; // 0-100, default 55
  currentInventoryKb: number;
  supplierAvailabilityPct: number; // default 70
  transportCapacityPct: number; // default 60
  demandLevelPct: number; // default 100
  budgetCapUsd: number; // default 8,000,000
  targetThresholdScore: number; // default 75
  selectedActionIds: string[];
}

export interface ResilienceFactor {
  id: string;
  name: string;
  weightPct: number;
  baselineValue: number; // 0-100
  description: string;
}

export interface SupplyNetworkNode {
  id: string;
  type: "supplier" | "route" | "storage" | "company";
  label: string;
  hormuzDependent: boolean;
  volumeSharePct?: number;
  regionOrMode?: string;
}

export interface SupplyNetworkEdge {
  from: string;
  to: string;
  volumeSharePct: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  state: ScenarioState;
  resilienceScore: number;
  totalCostUsd: number;
  potentialLossAvoidedUsd: number;
  protectionEfficiency: number;
  selectedOptionIds: string[];
}

export interface DecisionLogEntry {
  id: string;
  timestampLabel: string;
  actor: "System" | "User (COO role)";
  action: string;
  fromState: string;
  toState: string;
  notes?: string;
}

export interface RecommendationState {
  recommendedActionIds: string[];
  state: "Recommended" | "Under Review" | "Approved" | "Executed";
  rationaleSummary: string;
  assumptionsUsed: string[];
  lastUpdated: string;
  explanationOpened?: boolean;
}

// Baseline Seed Data
export const DEMO_COMPANY: Company = {
  id: "AURELIA-01",
  name: "Aurelia Energy",
  dailyThroughputBbl: 180000,
  hormuzExposurePct: 64,
  annualRevenueUsd: 2100000000,
  customerSegments: [
    { name: "Industrial Manufacturing", pctOfRevenue: 41 },
    { name: "Retail Fuel Network", pctOfRevenue: 33 },
    { name: "Power Generation Contracts", pctOfRevenue: 26 },
  ],
};

export const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-1",
    name: "Al-Rashid National Crude",
    region: "Persian Gulf",
    hormuzDependent: true,
    volumeSharePct: 38,
    contractType: "term",
    alternativeLeadTimeDays: 14,
  },
  {
    id: "SUP-2",
    name: "Straitline Petroleum Co.",
    region: "Persian Gulf",
    hormuzDependent: true,
    volumeSharePct: 26,
    contractType: "spot",
    alternativeLeadTimeDays: 7,
  },
  {
    id: "SUP-3",
    name: "Aurelia West Terminal",
    region: "West Africa",
    hormuzDependent: false,
    volumeSharePct: 14,
    contractType: "term",
    alternativeLeadTimeDays: 21,
  },
  {
    id: "SUP-4",
    name: "Pacific Rim Fuels",
    region: "SE Asia",
    hormuzDependent: false,
    volumeSharePct: 12,
    contractType: "spot",
    alternativeLeadTimeDays: 10,
  },
  {
    id: "SUP-5",
    name: "Northshore Crude Alliance",
    region: "Non-Gulf domestic",
    hormuzDependent: false,
    volumeSharePct: 10,
    contractType: "term",
    alternativeLeadTimeDays: 15,
  },
];

export const DEMO_ROUTES: Route[] = [
  {
    id: "RT-1",
    from: "Persian Gulf Terminals",
    to: "Aurelia Main Hub",
    mode: "tanker",
    hormuzDependent: true,
    normalCapacityKbd: 120,
    currentUtilizationPct: 88,
    altModeAvailable: false,
  },
  {
    id: "RT-2",
    from: "West Africa Coastal",
    to: "Aurelia Main Hub",
    mode: "tanker",
    hormuzDependent: false,
    normalCapacityKbd: 40,
    currentUtilizationPct: 55,
    altModeAvailable: true,
  },
  {
    id: "RT-3",
    from: "Domestic Rail Spur",
    to: "Aurelia Inland Terminal",
    mode: "rail",
    hormuzDependent: false,
    normalCapacityKbd: 15,
    currentUtilizationPct: 20,
    altModeAvailable: true,
  },
];

export const DEMO_STORAGE_SITES: StorageSite[] = [
  {
    id: "ST-1",
    name: "Aurelia Terminal Tank Farm",
    capacityKb: 2400,
    currentFillPct: 61,
    drawdownRateKbPerDay: 80,
  },
  {
    id: "ST-2",
    name: "Leased Coastal Reserve",
    capacityKb: 800,
    currentFillPct: 20,
    drawdownRateKbPerDay: 40,
  },
];

export const DEMO_INVENTORY: InventoryPosition = {
  id: "INV-1",
  productType: "Crude & Refined Blend",
  currentVolumeKb: 1464,
  dailyConsumptionKb: 180,
  targetRunwayDays: 30,
};

export const DEMO_RISK_INDICATORS: RiskIndicator[] = [
  {
    id: "RI-1",
    name: "Strait Transit Disruption Index",
    currentLevel: 62,
    trend: "rising",
    lastUpdatedLabel: "Simulated — updates on scenario change",
  },
  {
    id: "RI-2",
    name: "Freight & Insurance Premium Index",
    currentLevel: 74,
    trend: "rising",
    lastUpdatedLabel: "Simulated — updates on scenario change",
  },
  {
    id: "RI-3",
    name: "Regional Escalation Signal",
    currentLevel: 55,
    trend: "stable",
    lastUpdatedLabel: "Simulated — updates on scenario change",
  },
];

export const DEMO_RESILIENCE_OPTIONS: ResilienceOption[] = [
  {
    id: "OPT-1",
    name: "Stockpile Inventory",
    category: "Inventory",
    baseCostUsd: 4200000,
    costGrowthRatePctPerDay: 1.8,
    daysUntilImpractical: 12,
    resilienceContribution: 22,
    leadTimeDays: 5,
    description: "Procure and store 15 days of additional crude inventory before spot rates surge.",
    targetFactorIds: ["RF-2"],
  },
  {
    id: "OPT-2",
    name: "Diversify Supplier",
    category: "Sourcing",
    baseCostUsd: 2600000,
    costGrowthRatePctPerDay: 2.4,
    daysUntilImpractical: 18,
    resilienceContribution: 28,
    leadTimeDays: 14,
    description: "Activate term supply contracts with SE Asia and Domestic producers.",
    targetFactorIds: ["RF-1"],
  },
  {
    id: "OPT-3",
    name: "Reserve Transport",
    category: "Logistics",
    baseCostUsd: 3100000,
    costGrowthRatePctPerDay: 3.6,
    daysUntilImpractical: 9,
    resilienceContribution: 18,
    leadTimeDays: 7,
    description: "Lock in non-Hormuz tanker charters and reserve domestic rail slots.",
    targetFactorIds: ["RF-3"],
  },
  {
    id: "OPT-4",
    name: "Reserve Storage",
    category: "Storage",
    baseCostUsd: 1400000,
    costGrowthRatePctPerDay: 1.1,
    daysUntilImpractical: 20,
    resilienceContribution: 12,
    leadTimeDays: 5,
    description: "Activate lease options for 800,000 barrels at Coastal Reserve ST-2.",
    targetFactorIds: ["RF-4"],
  },
  {
    id: "OPT-5",
    name: "Pre-position Inventory",
    category: "Inventory",
    baseCostUsd: 2000000,
    costGrowthRatePctPerDay: 2.0,
    daysUntilImpractical: 14,
    resilienceContribution: 15,
    leadTimeDays: 8,
    description: "Forward-stage refined product at regional distribution hubs.",
    targetFactorIds: ["RF-2", "RF-4"],
  },
  {
    id: "OPT-6",
    name: "Reduce Non-Critical Demand",
    category: "Demand",
    baseCostUsd: 600000,
    costGrowthRatePctPerDay: 0.4,
    daysUntilImpractical: 30,
    resilienceContribution: 10,
    leadTimeDays: 3,
    description: "Renegotiate delivery schedules for low-margin interruptible industrial contracts.",
    targetFactorIds: ["RF-5"],
  },
];

export const DEMO_RESILIENCE_FACTORS: ResilienceFactor[] = [
  {
    id: "RF-1",
    name: "Supplier Concentration",
    weightPct: 25,
    baselineValue: 32,
    description: "Percentage of supply sourced outside Persian Gulf / Hormuz choke point.",
  },
  {
    id: "RF-2",
    name: "Inventory Runway",
    weightPct: 20,
    baselineValue: 27,
    description: "Days of operational fuel buffer at current throughput rates.",
  },
  {
    id: "RF-3",
    name: "Transport Flexibility",
    weightPct: 20,
    baselineValue: 38,
    description: "Availability of alternative non-Hormuz charter vessels and rail corridors.",
  },
  {
    id: "RF-4",
    name: "Storage Buffer",
    weightPct: 20,
    baselineValue: 42,
    description: "Uncommitted secondary tank farm capacity accessible within 5 days.",
  },
  {
    id: "RF-5",
    name: "Demand Flexibility",
    weightPct: 15,
    baselineValue: 40,
    description: "Share of supply contracts with clauses allowing non-penalty delivery shifts.",
  },
];

export const DEMO_NETWORK_NODES: SupplyNetworkNode[] = [
  { id: "company", type: "company", label: "Aurelia Energy Hub", hormuzDependent: false },
  { id: "sup-1", type: "supplier", label: "Al-Rashid National (38%)", hormuzDependent: true, volumeSharePct: 38, regionOrMode: "Persian Gulf" },
  { id: "sup-2", type: "supplier", label: "Straitline Petroleum (26%)", hormuzDependent: true, volumeSharePct: 26, regionOrMode: "Persian Gulf" },
  { id: "sup-3", type: "supplier", label: "Aurelia West Africa (14%)", hormuzDependent: false, volumeSharePct: 14, regionOrMode: "West Africa" },
  { id: "sup-4", type: "supplier", label: "Pacific Rim SE Asia (12%)", hormuzDependent: false, volumeSharePct: 12, regionOrMode: "SE Asia" },
  { id: "sup-5", type: "supplier", label: "Northshore Domestic (10%)", hormuzDependent: false, volumeSharePct: 10, regionOrMode: "Domestic" },
  { id: "rt-1", type: "route", label: "Hormuz Tanker Corridor RT-1", hormuzDependent: true, regionOrMode: "120 kbd" },
  { id: "rt-2", type: "route", label: "West Africa Ocean Route RT-2", hormuzDependent: false, regionOrMode: "40 kbd" },
  { id: "rt-3", type: "route", label: "Domestic Rail Spur RT-3", hormuzDependent: false, regionOrMode: "15 kbd" },
  { id: "st-1", type: "storage", label: "Terminal Tank Farm ST-1", hormuzDependent: false, regionOrMode: "2.4M kb" },
  { id: "st-2", type: "storage", label: "Coastal Reserve ST-2", hormuzDependent: false, regionOrMode: "0.8M kb" },
];

export const DEMO_NETWORK_EDGES: SupplyNetworkEdge[] = [
  { from: "sup-1", to: "rt-1", volumeSharePct: 38 },
  { from: "sup-2", to: "rt-1", volumeSharePct: 26 },
  { from: "sup-3", to: "rt-2", volumeSharePct: 14 },
  { from: "sup-4", to: "rt-2", volumeSharePct: 12 },
  { from: "sup-5", to: "rt-3", volumeSharePct: 10 },
  { from: "rt-1", to: "st-1", volumeSharePct: 64 },
  { from: "rt-2", to: "st-1", volumeSharePct: 26 },
  { from: "rt-3", to: "st-2", volumeSharePct: 10 },
  { from: "st-1", to: "company", volumeSharePct: 90 },
  { from: "st-2", to: "company", volumeSharePct: 10 },
];

export const DEFAULT_SCENARIO_STATE: ScenarioState = {
  disruptionDurationAssumptionDays: 45,
  riskLevel: 55,
  currentInventoryKb: 1464,
  supplierAvailabilityPct: 70,
  transportCapacityPct: 60,
  demandLevelPct: 100,
  budgetCapUsd: 8000000,
  targetThresholdScore: 75,
  selectedActionIds: [],
};
