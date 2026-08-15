import { ResilienceOption } from "../demoData";
import { computeOptionDecay } from "./decay";

export interface DecisionWindowSummary {
  aggregateDaysRemaining: number;
  limitingOptionId: string;
  limitingOptionName: string;
  posture: "WAIT" | "PREPARE" | "ACT";
  optionWindows: {
    optionId: string;
    optionName: string;
    daysRemaining: number;
    isBinding: boolean;
  }[];
}

export function computeDecisionWindow(
  options: ResilienceOption[],
  selectedActionIds: string[],
  riskLevel: number,
  durationDays: number = 45
): DecisionWindowSummary {
  const activeOptions = selectedActionIds.length > 0
    ? options.filter((o) => selectedActionIds.includes(o.id))
    : options;

  const optionWindows = activeOptions.map((opt) => {
    const decay = computeOptionDecay(opt, riskLevel, durationDays);
    return {
      optionId: opt.id,
      optionName: opt.name,
      daysRemaining: decay.effectiveDaysUntilImpractical,
      isBinding: false,
    };
  });

  if (optionWindows.length === 0) {
    return {
      aggregateDaysRemaining: 30,
      limitingOptionId: "",
      limitingOptionName: "None",
      posture: "WAIT",
      optionWindows: [],
    };
  }

  const minDays = Math.min(...optionWindows.map((o) => o.daysRemaining));
  const limiting = optionWindows.find((o) => o.daysRemaining === minDays) || optionWindows[0];

  const markedWindows = optionWindows.map((o) => ({
    ...o,
    isBinding: o.optionId === limiting.optionId,
  }));

  let posture: "WAIT" | "PREPARE" | "ACT" = "WAIT";
  if (minDays <= 5) {
    posture = "ACT";
  } else if (minDays <= 14) {
    posture = "PREPARE";
  }

  return {
    aggregateDaysRemaining: minDays,
    limitingOptionId: limiting.optionId,
    limitingOptionName: limiting.optionName,
    posture,
    optionWindows: markedWindows,
  };
}
