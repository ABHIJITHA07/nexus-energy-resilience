import { ResilienceFactor, ResilienceOption } from "../demoData";
import { computeResilienceScore } from "./resilience";

export interface OptimizationResult {
  recommendedOptionIds: string[];
  recommendedOptions: ResilienceOption[];
  resilienceScore: number;
  totalCostUsd: number;
  potentialLossAvoidedUsd: number;
  clearedTarget: boolean;
  targetScore: number;
  budgetCapUsd: number;
  isOverBudget: boolean;
  rationaleSummary: string;
  assumptionsUsed: string[];
  evaluatedCombinationsCount: number;
}

export function findOptimalStrategy(
  options: ResilienceOption[],
  factors: ResilienceFactor[],
  targetScore: number = 75,
  budgetCapUsd: number = 8000000,
  riskLevel: number = 55,
  durationDays: number = 45
): OptimizationResult {
  const n = options.length;
  const totalSubsets = (1 << n) - 1; // 63 combinations for 6 options

  let bestSubset: string[] = [];
  let lowestQualifyingCost = Infinity;
  let bestScoreForQualifying = 0;
  let clearedTarget = false;

  let fallbackSubset: string[] = [];
  let maxEfficiency = -1;
  let fallbackCost = 0;
  let fallbackScore = 0;

  for (let mask = 1; mask <= totalSubsets; mask++) {
    const subsetIds: string[] = [];
    let subsetCost = 0;

    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        subsetIds.push(options[i].id);
        subsetCost += options[i].baseCostUsd;
      }
    }

    const scoreResult = computeResilienceScore(factors, options, subsetIds);
    const score = scoreResult.totalScore;

    if (score >= targetScore) {
      clearedTarget = true;
      if (subsetCost < lowestQualifyingCost) {
        lowestQualifyingCost = subsetCost;
        bestSubset = subsetIds;
        bestScoreForQualifying = score;
      }
    } else {
      const efficiency = (score - scoreResult.baselineScore) / Math.max(1, subsetCost);
      if (efficiency > maxEfficiency) {
        maxEfficiency = efficiency;
        fallbackSubset = subsetIds;
        fallbackCost = subsetCost;
        fallbackScore = score;
      }
    }
  }

  const selectedIds = clearedTarget ? bestSubset : fallbackSubset;
  const recommendedOptions = options.filter((o) => selectedIds.includes(o.id));

  const finalScoreResult = computeResilienceScore(factors, options, selectedIds);
  const finalCost = recommendedOptions.reduce((sum, o) => sum + o.baseCostUsd, 0);

  const isOverBudget = finalCost > budgetCapUsd;

  const rationaleSummary = clearedTarget
    ? `This combination reaches a Resilience Score of ${finalScoreResult.totalScore}/${targetScore} at the lowest cost ($${(
        finalCost / 1000000
      ).toFixed(2)}M) out of all ${totalSubsets} combinations evaluated.`
    : `No single subset reached the target ${targetScore}/100 within constraints. Showing the highest score-per-dollar strategy reaching ${finalScoreResult.totalScore}/100.`;

  const assumptionsUsed = [
    `Strait Risk Level: ${riskLevel}/100`,
    `Disruption Duration Assumption: ${durationDays} days`,
    `Target Resilience Score: ${targetScore}/100`,
    `Budget Cap: $${(budgetCapUsd / 1000000).toFixed(1)}M`,
    `Hormuz Exposure Baseline: 64%`,
  ];

  return {
    recommendedOptionIds: selectedIds,
    recommendedOptions,
    resilienceScore: finalScoreResult.totalScore,
    totalCostUsd: finalCost,
    potentialLossAvoidedUsd: finalScoreResult.potentialLossAvoidedUsd,
    clearedTarget,
    targetScore,
    budgetCapUsd,
    isOverBudget,
    rationaleSummary,
    assumptionsUsed,
    evaluatedCombinationsCount: totalSubsets,
  };
}
