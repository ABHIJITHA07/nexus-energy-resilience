"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import {
  CheckSquare,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  History,
  AlertTriangle,
} from "lucide-react";

export default function ActionCenterPage() {
  const {
    optimizationResult,
    recommendationState,
    markExplanationOpened,
    approveRecommendation,
    executeRecommendation,
    decisionLog,
    scenarioState,
  } = useScenario();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(recommendationState.explanationOpened || false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (!recommendationState.explanationOpened) {
      markExplanationOpened();
    }
  };

  const steps = ["Recommended", "Under Review", "Approved", "Executed"];

  const getStepIndex = (st: string) => {
    switch (st) {
      case "Recommended":
        return 0;
      case "Under Review":
        return 1;
      case "Approved":
        return 2;
      case "Executed":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(recommendationState.state);
  const canApprove = recommendationState.explanationOpened && recommendationState.state !== "Approved" && recommendationState.state !== "Executed";
  const canExecute = recommendationState.state === "Approved";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-accent" />
            <span>Action Center & Governance Workflow</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Human-in-the-loop governance: AI recommends, executive reviews and approves before execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            status={
              recommendationState.state === "Executed"
                ? "POSITIVE"
                : recommendationState.state === "Approved"
                ? "WAIT"
                : "PREPARE"
            }
            label={`State: ${recommendationState.state}`}
          />
        </div>
      </div>

      {/* State Stepper Visualizer */}
      <Card title="Governance Workflow Stepper" subtitle="Mandatory state transition pipeline">
        <div className="flex items-center justify-between py-4 px-2">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isDone
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "bg-bg-tertiary text-text-muted border border-border-subtle"
                    } ${isCurrent ? "ring-4 ring-accent/30" : ""}`}
                  >
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isDone ? "text-text-primary" : "text-text-muted"}`}>
                    {step}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      idx < currentStepIdx ? "bg-accent" : "bg-bg-tertiary"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Main Active Recommendation Card */}
      <Card
        title="Active Strategic Recommendation"
        subtitle="Lowest-cost strategy clearing configured resilience threshold"
        borderVariant={recommendationState.state === "Approved" ? "success" : "active"}
      >
        <div className="space-y-5">
          {/* Action List Summary */}
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-text-muted">Recommended Portfolio ({optimizationResult.recommendedOptions.length} Actions):</span>
              <span className="font-bold text-accent">Total Capital: ${(optimizationResult.totalCostUsd / 1000000).toFixed(2)}M</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {optimizationResult.recommendedOptions.map((opt) => (
                <li key={opt.id} className="p-2.5 rounded-lg bg-bg-primary border border-border-subtle/80 text-xs flex items-center justify-between">
                  <span className="font-semibold text-text-primary">{opt.name}</span>
                  <span className="font-mono text-text-muted">${(opt.baseCostUsd / 1000000).toFixed(2)}M</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable Why / What Changed / Assumptions Panel */}
          <div className="rounded-xl border border-border-subtle bg-bg-tertiary/50 overflow-hidden">
            <button
              onClick={toggleDrawer}
              className="w-full p-4 flex items-center justify-between text-xs font-semibold text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                <span>Explainability Panel (Why / What Changed / Assumptions)</span>
                {recommendationState.explanationOpened && (
                  <span className="text-[10px] font-mono text-status-positive bg-status-positive/10 px-2 py-0.5 rounded">
                    ✓ Reviewed
                  </span>
                )}
              </span>
              {drawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {drawerOpen && (
              <div className="p-4 border-t border-border-subtle bg-bg-primary space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-accent mb-1">Why this strategy was selected:</h4>
                  <p className="text-text-secondary leading-relaxed">{optimizationResult.rationaleSummary}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-status-prepare mb-1">What changed since last assessment:</h4>
                  <p className="text-text-secondary leading-relaxed">
                    Strait disruption risk level is currently set to {scenarioState.riskLevel}/100. Disruption duration assumption is {scenarioState.disruptionDurationAssumptionDays} days.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-muted mb-1">Explicit Model Assumptions Used:</h4>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary font-mono">
                    {optimizationResult.assumptionsUsed.map((asm, idx) => (
                      <li key={idx}>{asm}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Governance Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-text-muted font-mono">
              {!recommendationState.explanationOpened
                ? "ⓘ Open the explainability panel above to unlock the Approve button."
                : "✓ Explanation opened. Executive approval unlocked."}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                disabled={!canApprove}
                icon={<UserCheck className="h-4 w-4" />}
                onClick={approveRecommendation}
              >
                Approve Strategy (COO Role)
              </Button>

              <Button
                variant="outline"
                size="md"
                disabled={!canExecute}
                icon={<CheckCircle2 className="h-4 w-4" />}
                onClick={executeRecommendation}
              >
                Mark Executed (Simulated)
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Decision Log (Append-Only Audit Trail) */}
      <Card title="Append-Only Audit Decision Log" subtitle="Timestamped log of state transitions for board and risk compliance">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-bg-tertiary text-text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">State Transition</th>
                <th className="p-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono">
              {decisionLog.map((log) => (
                <tr key={log.id} className="hover:bg-bg-tertiary/50">
                  <td className="p-3 text-text-muted">{log.timestampLabel}</td>
                  <td className="p-3 font-semibold text-accent">{log.actor}</td>
                  <td className="p-3 font-medium text-text-primary">{log.action}</td>
                  <td className="p-3">
                    <span className="text-text-muted">{log.fromState}</span> → <span className="text-status-positive font-bold">{log.toState}</span>
                  </td>
                  <td className="p-3 text-text-secondary">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
