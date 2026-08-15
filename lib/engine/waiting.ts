import { ResilienceOption } from "../demoData";
import { computeOptionCostAtDay } from "./decay";

export interface WaitingPoint {
  label: string;
  waitDays: number;
  preparationCostUsd: number;
  expectedLossExposureUsd: number;
  netOutcomeUsd: number; // preparationCost(d) + expectedLossExposure(d) - preparationCost(0)
  deltaVsActNowUsd: number;
}

export interface WaitingComparisonResult {
  horizons: WaitingPoint[];
  customWait: WaitingPoint;
  breakevenDay: number;
  isActNowCheapestAlways: boolean;
  dailyRevenueAtRiskUsd: number;
}

export function computeCostOfWaiting(
  options: ResilienceOption[],
  selectedActionIds: string[],
  riskLevel: number,
  durationDays: number = 45,
  customWaitDays: number = 5,
  annualRevenueUsd: number = 2100000000,
  hormuzExposurePct: number = 64
): WaitingComparisonResult {
  const activeOptions = selectedActionIds.length > 0
    ? options.filter((o) => selectedActionIds.includes(o.id))
    : options;

  const dailyRevenueAtRiskUsd = Math.round(
    (annualRevenueUsd * (hormuzExposurePct / 100) / 365) * 0.35
  );

  const computePointForDay = (d: number, labelText: string): WaitingPoint => {
    const prepCost = activeOptions.reduce(
      (sum, opt) => sum + computeOptionCostAtDay(opt, d, riskLevel, durationDays),
      0
    );

    const shortfallDays = d * (riskLevel / 100) * 0.45 * (durationDays / 45);
    const expectedLoss = Math.round(dailyRevenueAtRiskUsd * shortfallDays);

    const prepCostDay0 = activeOptions.reduce(
      (sum, opt) => sum + computeOptionCostAtDay(opt, 0, riskLevel, durationDays),
      0
    );

    const netOutcomeUsd = prepCost + expectedLoss - prepCostDay0;
    const deltaVsActNowUsd = netOutcomeUsd;

    return {
      label: labelText,
      waitDays: d,
      preparationCostUsd: prepCost,
      expectedLossExposureUsd: expectedLoss,
      netOutcomeUsd,
      deltaVsActNowUsd,
    };
  };

  const horizons: WaitingPoint[] = [
    computePointForDay(0, "Act Now"),
    computePointForDay(3, "Wait 3 Days"),
    computePointForDay(7, "Wait 7 Days"),
    computePointForDay(14, "Wait 14 Days"),
  ];

  const customWait = computePointForDay(customWaitDays, `Wait ${customWaitDays} Days`);

  let breakevenDay = 0;
  let isActNowCheapestAlways = true;

  for (let day = 1; day <= 30; day++) {
    const pt = computePointForDay(day, `Wait ${day}`);
    if (pt.netOutcomeUsd > 0) {
      breakevenDay = day;
      isActNowCheapestAlways = false;
      break;
    }
  }

  if (isActNowCheapestAlways && horizons[1].netOutcomeUsd > 0) {
    breakevenDay = 0;
  }

  return {
    horizons,
    customWait,
    breakevenDay,
    isActNowCheapestAlways,
    dailyRevenueAtRiskUsd,
  };
}
