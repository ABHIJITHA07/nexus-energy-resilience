"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { generateCounterfactual, generateStrategyComparison } from "@/lib/engine/narrative";
import { Sparkles, ArrowRight, ShieldAlert, Sliders, CheckCircle2 } from "lucide-react";

export default function AIInsightsPage() {
  const { riskBrief, scenarioState, savedScenarios, options, applySavedScenario } = useScenario();
  const [selectedWaitHorizon, setSelectedWaitHorizon] = useState<number>(7);

  const counterfactual = generateCounterfactual(
    selectedWaitHorizon,
    scenarioState.riskLevel,
    scenarioState.disruptionDurationAssumptionDays,
    options,
    scenarioState.selectedActionIds
  );

  const strategyRankings = generateStrategyComparison(savedScenarios);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <span>AI Risk Brief & Strategic Synthesis</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Explainable narrative intelligence synthesized deterministically from core engine calculations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="SIMULATED" label="Simulated Prototype AI" />
        </div>
      </div>

      {/* Panel 1: AI Risk Brief */}
      <Card
        title={riskBrief.title}
        subtitle="Automated summary of risk signal shifts over the last assessment cycle"
        borderVariant="active"
        metaBadge={<StatusBadge status="PREPARE" />}
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-text-primary leading-relaxed bg-bg-tertiary p-4 rounded-xl border border-border-subtle">
            "{riskBrief.summary}"
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-text-muted uppercase">Key Intelligence Bulletins</h4>
            <ul className="space-y-2">
              {riskBrief.bulletPoints.map((pt, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle/70 text-xs text-text-secondary flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] font-mono text-text-muted italic pt-1">
            * {riskBrief.disclosureLabel}
          </div>
        </div>
      </Card>

      {/* Panel 2: AI Counterfactual Narrative */}
      <Card
        title="AI Counterfactual Simulation"
        subtitle={`Synthesizing financial impact of delaying action by ${selectedWaitHorizon} days`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-text-muted">Select Delay Horizon:</span>
            {[3, 5, 7, 10, 14].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedWaitHorizon(d)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  selectedWaitHorizon === d
                    ? "bg-accent text-white font-bold"
                    : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-status-act/10 border border-status-act/30 space-y-2">
            <h4 className="text-sm font-bold text-status-act">{counterfactual.headline}</h4>
            <p className="text-xs text-text-primary leading-relaxed">{counterfactual.narrativeText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
              <div className="text-text-muted">Option Cost Inflation</div>
              <div className="text-sm font-bold text-text-primary mt-1">
                +${(counterfactual.preparationCostDeltaUsd / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
              <div className="text-text-muted">Unmitigated Exposure</div>
              <div className="text-sm font-bold text-status-act mt-1">
                +${(counterfactual.expectedLossDeltaUsd / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle">
              <div className="text-text-muted">Net Penalty</div>
              <div className="text-sm font-bold text-status-act mt-1">
                +${(counterfactual.netDeltaUsd / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Panel 3: AI Strategy Comparison Table */}
      <Card
        title="Saved Strategy Efficiency Rankings"
        subtitle="Ranked by Protection Efficiency Ratio (Potential Loss Avoided ÷ Total Cost)"
      >
        {strategyRankings.length === 0 ? (
          <div className="p-8 text-center bg-bg-tertiary rounded-xl border border-border-subtle space-y-3">
            <p className="text-xs text-text-secondary">
              No custom scenarios saved yet in this session. Save scenarios in the Simulator to generate side-by-side rankings.
            </p>
            <Link href="/simulator">
              <Button variant="primary" size="sm" icon={<Sliders className="h-3.5 w-3.5" />}>
                Go to Scenario Simulator
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-bg-tertiary text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Strategy Title</th>
                  <th className="p-3">Resilience Score</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Loss Avoided</th>
                  <th className="p-3">Efficiency ($ / $)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {strategyRankings.map((st) => (
                  <tr key={st.id} className="hover:bg-bg-tertiary/50">
                    <td className="p-3 font-bold text-accent">#{st.rank}</td>
                    <td className="p-3 font-semibold text-text-primary">{st.name}</td>
                    <td className="p-3">{st.resilienceScore}/100</td>
                    <td className="p-3">${(st.totalCostUsd / 1000000).toFixed(2)}M</td>
                    <td className="p-3 text-status-positive">+${(st.potentialLossAvoidedUsd / 1000000).toFixed(2)}M</td>
                    <td className="p-3 font-bold text-accent">{st.protectionEfficiency}x</td>
                    <td className="p-3">
                      <Link href="/action-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applySavedScenario(st.id)}
                        >
                          Promote
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
