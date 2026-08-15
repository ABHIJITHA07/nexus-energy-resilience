import { ResilienceOption, SavedScenario } from "../demoData";
import { OptimizationResult } from "./optimizer";
import { computeCostOfWaiting } from "./waiting";

export interface RiskBriefNarrative {
  title: string;
  summary: string;
  bulletPoints: string[];
  disclosureLabel: string;
}

export interface CounterfactualNarrative {
  waitDays: number;
  headline: string;
  narrativeText: string;
  preparationCostDeltaUsd: number;
  expectedLossDeltaUsd: number;
  netDeltaUsd: number;
  disclosureLabel: string;
}

export interface StrategyRankingItem {
  rank: number;
  id: string;
  name: string;
  resilienceScore: number;
  totalCostUsd: number;
  potentialLossAvoidedUsd: number;
  protectionEfficiency: number; // Loss Avoided / Cost
  selectedOptionNames: string[];
}

export function generateRiskBrief(
  riskLevel: number,
  durationDays: number = 45,
  options: ResilienceOption[]
): RiskBriefNarrative {
  const isHighRisk = riskLevel >= 65;
  const isSustained = durationDays >= 60;

  const points: string[] = [];

  points.push(
    `Strait Transit Disruption Index is currently at ${riskLevel}/100 (${
      isHighRisk ? "Elevated Risk Zone" : "Moderate Alert"
    }).`
  );

  points.push(
    `Assumed disruption horizon of ${durationDays} days ${
      isSustained ? "compounds regional spot charter rates and accelerates option decay." : "leaves moderate flexibility on secondary routes."
    }`
  );

  const fastestDecayOpt = [...options].sort(
    (a, b) => a.daysUntilImpractical - b.daysUntilImpractical
  )[0];

  points.push(
    `Binding constraint: '${fastestDecayOpt.name}' is decaying at ${fastestDecayOpt.costGrowthRatePctPerDay}%/day, with effective viability window compressed to ~${Math.round(
      fastestDecayOpt.daysUntilImpractical / (1 + (riskLevel / 100) * 1.5)
    )} days.`
  );

  return {
    title: "AI Risk Intelligence Brief",
    summary: `Simulated risk signals reflect ${
      isHighRisk ? "acute market tightness" : "moderate escalation"
    } across Hormuz transit corridors. Strategic decision window is actively decaying.`,
    bulletPoints: points,
    disclosureLabel: "Simulated Indicators — Prototype Data, not a live geopolitical feed.",
  };
}

export function generateCounterfactual(
  waitDays: number,
  riskLevel: number,
  durationDays: number,
  options: ResilienceOption[],
  selectedActionIds: string[]
): CounterfactualNarrative {
  const waitingResult = computeCostOfWaiting(
    options,
    selectedActionIds,
    riskLevel,
    durationDays,
    waitDays
  );

  const pt = waitingResult.customWait;
  const pt0 = waitingResult.horizons[0];

  const prepDelta = pt.preparationCostUsd - pt0.preparationCostUsd;
  const lossDelta = pt.expectedLossExposureUsd;
  const netDelta = pt.netOutcomeUsd;

  return {
    waitDays,
    headline: `Delaying decision by ${waitDays} days incurs an estimated $${(
      netDelta / 1000000
    ).toFixed(2)}M in net financial downside.`,
    narrativeText: `If Aurelia Energy waits ${waitDays} days before committing to resilience preparations, spot freight premiums and storage surge rates will add $${(
      prepDelta / 1000000
    ).toFixed(2)}M to execution costs. Concurrently, unmitigated supply shortfall risk accumulates $${(
      lossDelta / 1000000
    ).toFixed(2)}M in potential contract penalty exposure.`,
    preparationCostDeltaUsd: prepDelta,
    expectedLossDeltaUsd: lossDelta,
    netDeltaUsd: netDelta,
    disclosureLabel: "Simulated Counterfactual Model — Prototype Data",
  };
}

export function generateStrategyComparison(
  savedScenarios: SavedScenario[]
): StrategyRankingItem[] {
  if (savedScenarios.length === 0) return [];

  const items: StrategyRankingItem[] = savedScenarios.map((sc) => {
    const eff = sc.totalCostUsd > 0
      ? Number((sc.potentialLossAvoidedUsd / sc.totalCostUsd).toFixed(2))
      : 0;

    return {
      rank: 0,
      id: sc.id,
      name: sc.name,
      resilienceScore: sc.resilienceScore,
      totalCostUsd: sc.totalCostUsd,
      potentialLossAvoidedUsd: sc.potentialLossAvoidedUsd,
      protectionEfficiency: eff,
      selectedOptionNames: sc.selectedOptionIds,
    };
  });

  // Sort descending by protection efficiency
  items.sort((a, b) => b.protectionEfficiency - a.protectionEfficiency);

  // Assign ranks
  return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
}
