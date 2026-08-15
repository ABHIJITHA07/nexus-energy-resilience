"use client";

import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import {
  Company,
  DecisionLogEntry,
  DEFAULT_SCENARIO_STATE,
  DEMO_COMPANY,
  DEMO_RESILIENCE_FACTORS,
  DEMO_RESILIENCE_OPTIONS,
  DEMO_RISK_INDICATORS,
  DEMO_SUPPLIERS,
  RecommendationState,
  ResilienceFactor,
  ResilienceOption,
  RiskIndicator,
  SavedScenario,
  ScenarioState,
  Supplier,
} from "../lib/demoData";
import { computeDecisionWindow, DecisionWindowSummary } from "../lib/engine/decisionWindow";
import { computeResilienceScore, ResilienceScoreResult } from "../lib/engine/resilience";
import { computeCostOfWaiting, WaitingComparisonResult } from "../lib/engine/waiting";
import { findOptimalStrategy, OptimizationResult } from "../lib/engine/optimizer";
import { generateRiskBrief, RiskBriefNarrative } from "../lib/engine/narrative";

interface ScenarioContextType {
  company: Company;
  suppliers: Supplier[];
  riskIndicators: RiskIndicator[];
  options: ResilienceOption[];
  factors: ResilienceFactor[];
  scenarioState: ScenarioState;
  savedScenarios: SavedScenario[];
  decisionLog: DecisionLogEntry[];
  recommendationState: RecommendationState;
  
  // Derived state
  decisionWindow: DecisionWindowSummary;
  resilienceResult: ResilienceScoreResult;
  waitingResult: WaitingComparisonResult;
  optimizationResult: OptimizationResult;
  riskBrief: RiskBriefNarrative;

  // Actions
  setRiskLevel: (level: number) => void;
  setDisruptionDuration: (days: number) => void;
  setScenarioState: (newState: Partial<ScenarioState>) => void;
  setSelectedActionIds: (ids: string[]) => void;
  toggleAction: (id: string) => void;
  saveScenario: (name: string) => void;
  setTargetThreshold: (score: number) => void;
  setBudgetCap: (budget: number) => void;
  markExplanationOpened: () => void;
  approveRecommendation: () => void;
  executeRecommendation: () => void;
  resetToRecommended: () => void;
  resetToBaseline: () => void;
  applySavedScenario: (scenarioId: string) => void;
  applyCustomRecommendation: (actionIds: string[], customRationale?: string) => void;
  addOptionToSelection: (optionId: string) => void;
}

type Action =
  | { type: "SET_RISK_LEVEL"; payload: number }
  | { type: "SET_DISRUPTION_DURATION"; payload: number }
  | { type: "SET_SCENARIO_STATE"; payload: Partial<ScenarioState> }
  | { type: "SET_SELECTED_ACTIONS"; payload: string[] }
  | { type: "TOGGLE_ACTION"; payload: string }
  | { type: "ADD_OPTION_TO_SELECTION"; payload: string }
  | { type: "SET_TARGET_THRESHOLD"; payload: number }
  | { type: "SET_BUDGET_CAP"; payload: number }
  | { type: "SAVE_SCENARIO"; payload: { name: string; result: SavedScenario } }
  | { type: "MARK_EXPLANATION_OPENED" }
  | { type: "APPROVE_RECOMMENDATION"; payload: { timestamp: string; actor: "User (COO role)" } }
  | { type: "EXECUTE_RECOMMENDATION"; payload: { timestamp: string; actor: "User (COO role)" } }
  | { type: "RESET_TO_RECOMMENDED"; payload: string[] }
  | { type: "RESET_TO_BASELINE" }
  | { type: "APPLY_SAVED_SCENARIO"; payload: SavedScenario }
  | { type: "APPLY_CUSTOM_RECOMMENDATION"; payload: { actionIds: string[]; rationale?: string } };

interface State {
  scenarioState: ScenarioState;
  savedScenarios: SavedScenario[];
  decisionLog: DecisionLogEntry[];
  recommendationState: RecommendationState;
}

const initialRecommendationState: RecommendationState = {
  recommendedActionIds: ["OPT-1", "OPT-2", "OPT-4"],
  state: "Recommended",
  rationaleSummary: "Stockpile inventory, diversify key suppliers, and activate secondary coastal storage reserve.",
  assumptionsUsed: ["Risk Level: 55/100", "Disruption Horizon: 45 days", "Target Score: 75/100"],
  lastUpdated: "Just now",
  explanationOpened: false,
};

const initialState: State = {
  scenarioState: DEFAULT_SCENARIO_STATE,
  savedScenarios: [],
  decisionLog: [
    {
      id: "LOG-0",
      timestampLabel: "Initial Baseline Assessment",
      actor: "System",
      action: "Initial Baseline Risk Model Ingested",
      fromState: "Baseline",
      toState: "Recommended",
      notes: "Baseline Strait of Hormuz input exposure set to 64%. Initial preparedness score: 35/100.",
    },
  ],
  recommendationState: initialRecommendationState,
};

function scenarioReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_RISK_LEVEL": {
      const isApproved = state.recommendationState.state === "Approved";
      return {
        ...state,
        scenarioState: { ...state.scenarioState, riskLevel: action.payload },
        recommendationState: isApproved
          ? {
              ...state.recommendationState,
              state: "Under Review",
              rationaleSummary: "Assumptions changed post-approval (Risk Level updated). Re-review required.",
            }
          : state.recommendationState,
      };
    }
    case "SET_DISRUPTION_DURATION": {
      const isApproved = state.recommendationState.state === "Approved";
      return {
        ...state,
        scenarioState: { ...state.scenarioState, disruptionDurationAssumptionDays: action.payload },
        recommendationState: isApproved
          ? {
              ...state.recommendationState,
              state: "Under Review",
              rationaleSummary: "Assumptions changed post-approval (Disruption Duration updated). Re-review required.",
            }
          : state.recommendationState,
      };
    }
    case "SET_SCENARIO_STATE":
      return {
        ...state,
        scenarioState: { ...state.scenarioState, ...action.payload },
      };
    case "SET_SELECTED_ACTIONS":
      return {
        ...state,
        scenarioState: { ...state.scenarioState, selectedActionIds: action.payload },
      };
    case "TOGGLE_ACTION": {
      const current = state.scenarioState.selectedActionIds;
      const exists = current.includes(action.payload);
      const next = exists ? current.filter((id) => id !== action.payload) : [...current, action.payload];
      return {
        ...state,
        scenarioState: { ...state.scenarioState, selectedActionIds: next },
      };
    }
    case "ADD_OPTION_TO_SELECTION": {
      const current = state.scenarioState.selectedActionIds;
      const next = current.includes(action.payload) ? current : [...current, action.payload];
      return {
        ...state,
        scenarioState: { ...state.scenarioState, selectedActionIds: next },
      };
    }
    case "SET_TARGET_THRESHOLD":
      return {
        ...state,
        scenarioState: { ...state.scenarioState, targetThresholdScore: action.payload },
      };
    case "SET_BUDGET_CAP":
      return {
        ...state,
        scenarioState: { ...state.scenarioState, budgetCapUsd: action.payload },
      };
    case "SAVE_SCENARIO":
      return {
        ...state,
        savedScenarios: [action.payload.result, ...state.savedScenarios],
      };
    case "MARK_EXPLANATION_OPENED":
      return {
        ...state,
        recommendationState: {
          ...state.recommendationState,
          explanationOpened: true,
          state: state.recommendationState.state === "Recommended" ? "Under Review" : state.recommendationState.state,
        },
      };
    case "APPROVE_RECOMMENDATION": {
      const newLog: DecisionLogEntry = {
        id: `LOG-${Date.now()}`,
        timestampLabel: action.payload.timestamp,
        actor: action.payload.actor,
        action: "Approved Active Resilience Strategy",
        fromState: state.recommendationState.state,
        toState: "Approved",
        notes: "Executive sign-off recorded. Resilience capital allocation approved for dispatch.",
      };
      return {
        ...state,
        recommendationState: {
          ...state.recommendationState,
          state: "Approved",
        },
        decisionLog: [newLog, ...state.decisionLog],
      };
    }
    case "EXECUTE_RECOMMENDATION": {
      const newLog: DecisionLogEntry = {
        id: `LOG-${Date.now()}`,
        timestampLabel: action.payload.timestamp,
        actor: action.payload.actor,
        action: "Marked Strategy Executed (Simulated)",
        fromState: "Approved",
        toState: "Executed",
        notes: "Simulated execution initiated. Non-Hormuz charter reservations and storage leases dispatched.",
      };
      return {
        ...state,
        recommendationState: {
          ...state.recommendationState,
          state: "Executed",
        },
        decisionLog: [newLog, ...state.decisionLog],
      };
    }
    case "RESET_TO_RECOMMENDED":
      return {
        ...state,
        scenarioState: {
          ...state.scenarioState,
          selectedActionIds: action.payload,
        },
      };
    case "RESET_TO_BASELINE":
      return {
        ...state,
        scenarioState: {
          ...DEFAULT_SCENARIO_STATE,
          selectedActionIds: [],
        },
      };
    case "APPLY_SAVED_SCENARIO":
      return {
        ...state,
        scenarioState: { ...action.payload.state },
        recommendationState: {
          ...state.recommendationState,
          recommendedActionIds: action.payload.selectedOptionIds,
          state: "Recommended",
          explanationOpened: false,
          rationaleSummary: `Promoted saved scenario '${action.payload.name}' as active recommendation baseline.`,
        },
      };
    case "APPLY_CUSTOM_RECOMMENDATION":
      return {
        ...state,
        recommendationState: {
          ...state.recommendationState,
          recommendedActionIds: action.payload.actionIds,
          state: "Recommended",
          explanationOpened: false,
          rationaleSummary: action.payload.rationale || "User-configured portfolio applied as active recommendation baseline.",
        },
      };
    default:
      return state;
  }
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(scenarioReducer, initialState);

  // Derived state computations via pure engine functions
  const optimizationResult = useMemo(
    () =>
      findOptimalStrategy(
        DEMO_RESILIENCE_OPTIONS,
        DEMO_RESILIENCE_FACTORS,
        state.scenarioState.targetThresholdScore,
        state.scenarioState.budgetCapUsd,
        state.scenarioState.riskLevel,
        state.scenarioState.disruptionDurationAssumptionDays
      ),
    [
      state.scenarioState.targetThresholdScore,
      state.scenarioState.budgetCapUsd,
      state.scenarioState.riskLevel,
      state.scenarioState.disruptionDurationAssumptionDays,
    ]
  );

  const decisionWindow = useMemo(
    () =>
      computeDecisionWindow(
        DEMO_RESILIENCE_OPTIONS,
        state.scenarioState.selectedActionIds,
        state.scenarioState.riskLevel,
        state.scenarioState.disruptionDurationAssumptionDays
      ),
    [
      state.scenarioState.selectedActionIds,
      state.scenarioState.riskLevel,
      state.scenarioState.disruptionDurationAssumptionDays,
    ]
  );

  const resilienceResult = useMemo(
    () =>
      computeResilienceScore(
        DEMO_RESILIENCE_FACTORS,
        DEMO_RESILIENCE_OPTIONS,
        state.scenarioState.selectedActionIds,
        DEMO_COMPANY.annualRevenueUsd,
        DEMO_COMPANY.hormuzExposurePct
      ),
    [state.scenarioState.selectedActionIds]
  );

  const waitingResult = useMemo(
    () =>
      computeCostOfWaiting(
        DEMO_RESILIENCE_OPTIONS,
        state.scenarioState.selectedActionIds,
        state.scenarioState.riskLevel,
        state.scenarioState.disruptionDurationAssumptionDays,
        5,
        DEMO_COMPANY.annualRevenueUsd,
        DEMO_COMPANY.hormuzExposurePct
      ),
    [
      state.scenarioState.selectedActionIds,
      state.scenarioState.riskLevel,
      state.scenarioState.disruptionDurationAssumptionDays,
    ]
  );

  const riskBrief = useMemo(
    () =>
      generateRiskBrief(
        state.scenarioState.riskLevel,
        state.scenarioState.disruptionDurationAssumptionDays,
        DEMO_RESILIENCE_OPTIONS
      ),
    [state.scenarioState.riskLevel, state.scenarioState.disruptionDurationAssumptionDays]
  );

  const value: ScenarioContextType = {
    company: DEMO_COMPANY,
    suppliers: DEMO_SUPPLIERS,
    riskIndicators: DEMO_RISK_INDICATORS,
    options: DEMO_RESILIENCE_OPTIONS,
    factors: DEMO_RESILIENCE_FACTORS,
    scenarioState: state.scenarioState,
    savedScenarios: state.savedScenarios,
    decisionLog: state.decisionLog,
    recommendationState: state.recommendationState,
    decisionWindow,
    resilienceResult,
    waitingResult,
    optimizationResult,
    riskBrief,

    setRiskLevel: (level: number) => dispatch({ type: "SET_RISK_LEVEL", payload: level }),
    setDisruptionDuration: (days: number) => dispatch({ type: "SET_DISRUPTION_DURATION", payload: days }),
    setScenarioState: (newState: Partial<ScenarioState>) => dispatch({ type: "SET_SCENARIO_STATE", payload: newState }),
    setSelectedActionIds: (ids: string[]) => dispatch({ type: "SET_SELECTED_ACTIONS", payload: ids }),
    toggleAction: (id: string) => dispatch({ type: "TOGGLE_ACTION", payload: id }),
    addOptionToSelection: (id: string) => dispatch({ type: "ADD_OPTION_TO_SELECTION", payload: id }),
    setTargetThreshold: (score: number) => dispatch({ type: "SET_TARGET_THRESHOLD", payload: score }),
    setBudgetCap: (budget: number) => dispatch({ type: "SET_BUDGET_CAP", payload: budget }),
    markExplanationOpened: () => dispatch({ type: "MARK_EXPLANATION_OPENED" }),
    approveRecommendation: () =>
      dispatch({
        type: "APPROVE_RECOMMENDATION",
        payload: { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "User (COO role)" },
      }),
    executeRecommendation: () =>
      dispatch({
        type: "EXECUTE_RECOMMENDATION",
        payload: { timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), actor: "User (COO role)" },
      }),
    resetToRecommended: () =>
      dispatch({ type: "RESET_TO_RECOMMENDED", payload: optimizationResult.recommendedOptionIds }),
    resetToBaseline: () => dispatch({ type: "RESET_TO_BASELINE" }),
    saveScenario: (name: string) => {
      const selectedOpts = DEMO_RESILIENCE_OPTIONS.filter((o) =>
        state.scenarioState.selectedActionIds.includes(o.id)
      );
      const totalCost = selectedOpts.reduce((sum, o) => sum + o.baseCostUsd, 0);
      const eff = totalCost > 0 ? Number((resilienceResult.potentialLossAvoidedUsd / totalCost).toFixed(2)) : 0;

      const newSaved: SavedScenario = {
        id: `SCENARIO-${Date.now()}`,
        name: name || `Strategy ${state.savedScenarios.length + 1}`,
        createdAt: new Date().toLocaleDateString(),
        state: state.scenarioState,
        resilienceScore: resilienceResult.totalScore,
        totalCostUsd: totalCost,
        potentialLossAvoidedUsd: resilienceResult.potentialLossAvoidedUsd,
        protectionEfficiency: eff,
        selectedOptionIds: state.scenarioState.selectedActionIds,
      };
      dispatch({ type: "SAVE_SCENARIO", payload: { name, result: newSaved } });
    },
    applySavedScenario: (scenarioId: string) => {
      const sc = state.savedScenarios.find((s) => s.id === scenarioId);
      if (sc) {
        dispatch({ type: "APPLY_SAVED_SCENARIO", payload: sc });
      }
    },
    applyCustomRecommendation: (actionIds: string[], rationale?: string) => {
      dispatch({ type: "APPLY_CUSTOM_RECOMMENDATION", payload: { actionIds, rationale } });
    },
  };

  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}
