"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Award, ShieldAlert, ArrowRight, Check, X, FileText, CheckCircle2 } from "lucide-react";

interface PriorityRecommendation {
  id: string;
  title: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  costUsd: number;
  resilienceGain: number;
  lossAvoidedUsd: number;
  optionIds: string[];
  reason: string;
  explanation: string;
}

export default function RecommendationsPage() {
  const {
    setSelectedActionIds,
    resilienceResult,
    approveRecommendation,
    executeRecommendation,
    scenarioState,
  } = useScenario();

  const [recommendations, setRecommendations] = useState<PriorityRecommendation[]>([
    {
      id: "REC-1",
      title: "Immediate Supply Diversification & Transport Reservation",
      urgency: "HIGH",
      costUsd: 5700000, // OPT-2 ($2.6M) + OPT-3 ($3.1M)
      resilienceGain: 46,
      lossAvoidedUsd: 31000000,
      optionIds: ["OPT-2", "OPT-3"],
      reason: "Alternative transport capacity is declining faster than inventory runway. Sourcing diversification resolves regional concentration.",
      explanation: "This plan combines supplier term contracting (OPT-2) and alternative route tanker charters (OPT-3). By locking in non-Hormuz logistics and suppliers today, we bypass spot charter rates before they rise +3.6%/day under current escalations.",
    },
    {
      id: "REC-2",
      title: "Secondary Storage Activation & Forward Stockpiling",
      urgency: "MEDIUM",
      costUsd: 3400000, // OPT-4 ($1.4M) + OPT-5 ($2.0M)
      resilienceGain: 27,
      lossAvoidedUsd: 18000000,
      optionIds: ["OPT-4", "OPT-5"],
      reason: "Sustained disruption risks demand storage buffers at regional hubs to avoid contractual penalties.",
      explanation: "Leverages leased coastal storage (OPT-4) and stages emergency inventory forward (OPT-5) at Coastal Reserve ST-2. This creates an extra 15-day runway buffer independent of main hub throughput.",
    },
    {
      id: "REC-3",
      title: "Non-Critical Demand Sidelining",
      urgency: "LOW",
      costUsd: 600000, // OPT-6
      resilienceGain: 10,
      lossAvoidedUsd: 5000000,
      optionIds: ["OPT-6"],
      reason: "Renegotiating low-margin fuel offtakes secures critical supply runway at minimal capital cost.",
      explanation: "Invokes interruptible contract clauses with retail networks (OPT-6), reducing consumption rate by 15kbd. This extends inventory runway by an extra 3.5 days under baseline disruption assumptions.",
    },
  ]);

  const [inspectReco, setInspectReco] = useState<PriorityRecommendation | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [completedRecos, setCompletedRecos] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAccept = (reco: PriorityRecommendation) => {
    setSelectedActionIds(reco.optionIds);
    approveRecommendation();
    showToast(`Recommendation accepted! Selected action items applied to active scenario.`);
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    showToast(`Recommendation dismissed.`);
  };

  const handleComplete = (reco: PriorityRecommendation) => {
    setCompletedRecos((prev) => [...prev, reco.id]);
    executeRecommendation();
    showToast(`Recommendation marked executed. Operations dispatched.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Award className="h-6 w-6 text-accent" />
            <span>Prioritized Recommendations Center</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Ranked continuity plans computed by the optimization engine to protect business value.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-status-positive/10 border border-status-positive/30 text-xs font-mono text-status-positive flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Priority List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-bg-secondary border border-border-subtle text-xs text-text-secondary">
            No active recommendations. Reset assumptions in settings or simulator to recalculate.
          </div>
        ) : (
          recommendations.map((reco) => {
            const isCompleted = completedRecos.includes(reco.id);

            return (
              <Card
                key={reco.id}
                title={reco.title}
                borderVariant={isCompleted ? "success" : reco.urgency === "HIGH" ? "danger" : "default"}
                metaBadge={
                  <StatusBadge
                    status={isCompleted ? "POSITIVE" : reco.urgency === "HIGH" ? "ACT" : reco.urgency === "MEDIUM" ? "PREPARE" : "WAIT"}
                    label={isCompleted ? "Executed" : `${reco.urgency} Urgency`}
                  />
                }
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
                      <div className="text-[10px] font-mono text-text-muted uppercase">Portfolio Cost</div>
                      <div className="text-base font-mono font-bold text-text-primary mt-0.5">
                        ${(reco.costUsd / 1000000).toFixed(2)}M
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
                      <div className="text-[10px] font-mono text-text-muted uppercase">Resilience Gain</div>
                      <div className="text-base font-mono font-bold text-status-positive mt-0.5">
                        +{reco.resilienceGain} Points
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
                      <div className="text-[10px] font-mono text-text-muted uppercase">Expected Loss Avoided</div>
                      <div className="text-base font-mono font-bold text-accent mt-0.5">
                        +${(reco.lossAvoidedUsd / 1000000).toFixed(1)}M
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle flex flex-col justify-center">
                      <div className="text-[10px] font-mono text-text-muted uppercase">Includes Options</div>
                      <div className="text-xs font-semibold text-text-primary mt-1">
                        {reco.optionIds.join(", ")}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed bg-bg-tertiary/60 p-3.5 rounded-lg border border-border-subtle/50">
                    "{reco.reason}"
                  </p>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-1 border-t border-border-subtle/40">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FileText className="h-3.5 w-3.5" />}
                      onClick={() => setInspectReco(reco)}
                    >
                      Inspect Details
                    </Button>

                    {!isCompleted && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<X className="h-3.5 w-3.5" />}
                          onClick={() => handleDismiss(reco.id)}
                        >
                          Dismiss
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Check className="h-3.5 w-3.5" />}
                          onClick={() => handleAccept(reco)}
                        >
                          Accept Plan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-status-positive text-status-positive hover:bg-status-positive/10"
                          onClick={() => handleComplete(reco)}
                        >
                          Mark Completed
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Inspect Detail Modal */}
      {inspectReco && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-secondary border border-border-subtle rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-border-subtle pb-3">
              <div>
                <h3 className="text-base font-bold text-text-primary">{inspectReco.title}</h3>
                <span className="text-[10px] font-mono text-accent bg-accent/15 px-2 py-0.5 rounded mt-1 inline-block">
                  Audit Trace ID: {inspectReco.id}
                </span>
              </div>
              <button
                onClick={() => setInspectReco(null)}
                className="text-text-muted hover:text-text-primary p-1 bg-bg-tertiary rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <h4 className="font-semibold text-accent uppercase font-mono tracking-wider">Detailed Description</h4>
                <p className="text-text-secondary mt-1">{inspectReco.explanation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle/50">
                <div>
                  <h4 className="font-semibold text-text-muted uppercase font-mono tracking-wider">Preparation Cost</h4>
                  <p className="text-sm font-mono font-bold text-text-primary mt-0.5">
                    ${(inspectReco.costUsd / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-muted uppercase font-mono tracking-wider">Loss Mitigation</h4>
                  <p className="text-sm font-mono font-bold text-status-positive mt-0.5">
                    +${(inspectReco.lossAvoidedUsd / 1000000).toFixed(1)}M protected
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button variant="secondary" size="sm" onClick={() => setInspectReco(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Check className="h-3.5 w-3.5" />}
                onClick={() => {
                  handleAccept(inspectReco);
                  setInspectReco(null);
                }}
              >
                Accept Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
