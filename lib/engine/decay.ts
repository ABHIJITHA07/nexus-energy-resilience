import { ResilienceOption } from "../demoData";

export interface OptionDecayPoint {
  day: number;
  costUsd: number;
  costMultiplier: number;
  isImpractical: boolean;
}

export interface ComputedOptionDecay {
  optionId: string;
  name: string;
  category: string;
  costTodayUsd: number;
  effectiveDaysUntilImpractical: number;
  effectiveGrowthRatePctPerDay: number;
  isCurrentlyImpractical: boolean;
  decayCurve: OptionDecayPoint[];
}

export function computeRiskMultiplier(riskLevel: number, durationDays: number = 45): number {
  const baseRiskMult = 1 + (riskLevel / 100) * 1.5;
  const durationMult = durationDays > 60 ? 1 + ((durationDays - 60) / 120) * 0.4 : 1.0;
  return baseRiskMult * durationMult;
}

export function computeOptionDecay(
  option: ResilienceOption,
  riskLevel: number,
  durationDays: number = 45
): ComputedOptionDecay {
  const riskMult = computeRiskMultiplier(riskLevel, durationDays);
  const effectiveGrowthRate = option.costGrowthRatePctPerDay * riskMult;
  const effectiveDaysUntilImpractical = Math.max(1, Math.round(option.daysUntilImpractical / riskMult));

  const costTodayUsd = Math.round(option.baseCostUsd);

  const decayCurve: OptionDecayPoint[] = [];
  const maxDays = 30;

  for (let day = 0; day <= maxDays; day++) {
    const costAtDay = Math.round(option.baseCostUsd * Math.pow(1 + effectiveGrowthRate / 100, day));
    const costMultiplier = Number((costAtDay / option.baseCostUsd).toFixed(2));
    const isImpractical = day >= effectiveDaysUntilImpractical;

    decayCurve.push({
      day,
      costUsd: costAtDay,
      costMultiplier,
      isImpractical,
    });
  }

  return {
    optionId: option.id,
    name: option.name,
    category: option.category,
    costTodayUsd,
    effectiveDaysUntilImpractical,
    effectiveGrowthRatePctPerDay: Number(effectiveGrowthRate.toFixed(2)),
    isCurrentlyImpractical: effectiveDaysUntilImpractical <= 0,
    decayCurve,
  };
}

export function computeOptionCostAtDay(
  option: ResilienceOption,
  day: number,
  riskLevel: number,
  durationDays: number = 45
): number {
  const riskMult = computeRiskMultiplier(riskLevel, durationDays);
  const effectiveGrowthRate = option.costGrowthRatePctPerDay * riskMult;
  return Math.round(option.baseCostUsd * Math.pow(1 + effectiveGrowthRate / 100, day));
}
