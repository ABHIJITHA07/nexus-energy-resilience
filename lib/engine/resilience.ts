import { ResilienceFactor, ResilienceOption } from "../demoData";

export interface FactorResult {
  factorId: string;
  name: string;
  weightPct: number;
  baselineValue: number;
  currentValue: number;
  contributionToScore: number;
  isVulnerability: boolean;
}

export interface ResilienceScoreResult {
  totalScore: number; // 0-100
  baselineScore: number;
  factors: FactorResult[];
  topVulnerabilities: FactorResult[];
  potentialLossAvoidedUsd: number;
}

export function computeResilienceScore(
  factors: ResilienceFactor[],
  options: ResilienceOption[],
  selectedActionIds: string[],
  annualRevenueUsd: number = 2100000000,
  hormuzExposurePct: number = 64
): ResilienceScoreResult {
  const selectedOptions = options.filter((o) => selectedActionIds.includes(o.id));

  // Compute baseline weighted score
  const baselineWeightedSum = factors.reduce(
    (sum, f) => sum + (f.baselineValue * f.weightPct) / 100,
    0
  );
  const baselineScore = Math.round(baselineWeightedSum);

  // For each factor, find all contributing selected options
  const computedFactors: FactorResult[] = factors.map((factor) => {
    const contributingOptions = selectedOptions.filter((opt) =>
      opt.targetFactorIds.includes(factor.id)
    );

    let currentValue = factor.baselineValue;

    if (contributingOptions.length > 0) {
      // Diminishing returns combination: 1 - product(1 - c_i / 100)
      const nonDiminishedRemnant = contributingOptions.reduce(
        (product, opt) => product * (1 - opt.resilienceContribution / 100),
        1
      );
      const combinedContributionPct = 1 - nonDiminishedRemnant;

      const capacityHeadroom = 100 - factor.baselineValue;
      const boost = capacityHeadroom * combinedContributionPct;
      currentValue = Math.min(100, Math.round(factor.baselineValue + boost));
    }

    const contributionToScore = Number(((currentValue * factor.weightPct) / 100).toFixed(1));

    return {
      factorId: factor.id,
      name: factor.name,
      weightPct: factor.weightPct,
      baselineValue: factor.baselineValue,
      currentValue,
      contributionToScore,
      isVulnerability: false,
    };
  });

  const totalScore = Math.min(
    100,
    Math.round(computedFactors.reduce((sum, f) => sum + f.contributionToScore, 0))
  );

  // Identify top vulnerabilities (lowest factor scores)
  const minFactorVal = Math.min(...computedFactors.map((f) => f.currentValue));
  const topVulnerabilities = computedFactors.filter((f) => f.currentValue === minFactorVal);

  const markedFactors = computedFactors.map((f) => ({
    ...f,
    isVulnerability: f.currentValue === minFactorVal,
  }));

  // Potential loss avoided calculation:
  // Daily revenue at risk = (2.1B * 0.64 / 365) * 0.35 = ~$1.288M/day
  // Gain in resilience score % * 45 days assumed disruption * daily revenue at risk
  const scoreImprovementPct = Math.max(0, (totalScore - baselineScore) / 100);
  const dailyAtRiskUsd = (annualRevenueUsd * (hormuzExposurePct / 100) / 365) * 0.35;
  const potentialLossAvoidedUsd = Math.round(scoreImprovementPct * dailyAtRiskUsd * 45);

  return {
    totalScore,
    baselineScore,
    factors: markedFactors,
    topVulnerabilities,
    potentialLossAvoidedUsd,
  };
}
