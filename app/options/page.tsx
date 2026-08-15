"use client";

import React from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { computeOptionDecay } from "@/lib/engine/decay";
import { Layers, CheckCircle2, Square, Plus, ShieldCheck, ArrowRight, Clock, AlertTriangle } from "lucide-react";

export default function OptionsPage() {
  const {
    options,
    scenarioState,
    toggleAction,
    resilienceResult,
    waitingResult,
  } = useScenario();

  const selectedActionIds = scenarioState.selectedActionIds;

  // Calculate option metrics
  const activeOpts = options.filter((o) => selectedActionIds.includes(o.id));
  const totalCost = activeOpts.reduce((sum, o) => sum + o.baseCostUsd, 0);
  const isOverBudget = totalCost > scenarioState.budgetCapUsd;

  // Calculate options count at Day 0, Day 7, and Day 14
  const getViableOptionsAtDay = (day: number) => {
    return options.filter((opt) => {
      const decay = computeOptionDecay(opt, scenarioState.riskLevel, scenarioState.disruptionDurationAssumptionDays);
      return decay.effectiveDaysUntilImpractical > day;
    });
  };

  const viableToday = getViableOptionsAtDay(0);
  const viableDay7 = getViableOptionsAtDay(7);
  const viableDay14 = getViableOptionsAtDay(14);

  const optionValuePct = Math.round((viableToday.length / options.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Layers className="h-6 w-6 text-accent" />
            <span>Resilience Options Portfolio Builder</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Build your resilience portfolio from standard options. Watch option availability shrink as risk persists.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/simulator">
            <Button variant="outline" size="sm" icon={<Clock className="h-3.5 w-3.5" />}>
              Simulator Workspace
            </Button>
          </Link>
        </div>
      </div>

      {/* Headline Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Option Value Runway" subtitle="Share of options currently viable at reasonable rates">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold text-text-primary">
                {optionValuePct}%
              </span>
              <span className="text-xs text-text-muted font-mono">Option Value</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {viableToday.length} of {options.length} options are currently viable. High strait risk shortens option lifetimes.
            </p>
          </div>
        </Card>

        <Card title="Portfolio Cost" subtitle="Capital allocation of selected resilience assets">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`font-mono text-5xl font-extrabold ${isOverBudget ? "text-status-act" : "text-text-primary"}`}>
                ${(totalCost / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs text-text-muted font-mono">Allocated</span>
            </div>
            <p className="text-xs text-text-secondary">
              Budget Cap: ${(scenarioState.budgetCapUsd / 1000000).toFixed(1)}M. {isOverBudget ? "Over budget limit!" : "Within safe limits."}
            </p>
          </div>
        </Card>

        <Card title="Resilience Contribution" subtitle="Aggregate prepared score with active options">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold text-status-positive">
                {resilienceResult.totalScore}
              </span>
              <span className="text-xs text-text-muted font-mono">/100 Score</span>
            </div>
            <p className="text-xs text-text-secondary">
              Baseline: {resilienceResult.baselineScore}/100. Target threshold is set to {scenarioState.targetThresholdScore}/100.
            </p>
          </div>
        </Card>
      </div>

      {/* Visual Timeline Card: Option Decay/Shrinking Over Time */}
      <Card title="Options Decay Timeline" subtitle="Visualizing options disappearing over delay horizons">
        <div className="space-y-6">
          <p className="text-xs text-text-secondary leading-relaxed">
            As disruption risk escalates, available supply chain options become fewer, slower, and more expensive.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Horizon 1: Today */}
            <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                <span className="text-xs font-bold text-text-primary">TODAY (Day 0)</span>
                <span className="text-xs font-mono font-bold text-status-positive">
                  {viableToday.length} Viable
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {options.map((opt) => {
                  const isViable = viableToday.some((v) => v.id === opt.id);
                  return (
                    <li key={opt.id} className="flex justify-between items-center">
                      <span className={isViable ? "text-text-primary" : "text-text-muted line-through"}>
                        {opt.name}
                      </span>
                      <span className={`font-mono text-[10px] ${isViable ? "text-status-positive" : "text-status-act font-bold"}`}>
                        {isViable ? "Available" : "Expired"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Horizon 2: +7 Days */}
            <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                <span className="text-xs font-bold text-text-primary">IN 7 DAYS (+7d)</span>
                <span className="text-xs font-mono font-bold text-status-prepare">
                  {viableDay7.length} Viable
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {options.map((opt) => {
                  const isViable = viableDay7.some((v) => v.id === opt.id);
                  return (
                    <li key={opt.id} className="flex justify-between items-center">
                      <span className={isViable ? "text-text-primary" : "text-text-muted line-through"}>
                        {opt.name}
                      </span>
                      <span className={`font-mono text-[10px] ${isViable ? "text-status-positive" : "text-status-act font-bold"}`}>
                        {isViable ? "Available" : "Expired"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Horizon 3: +14 Days */}
            <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-2">
                <span className="text-xs font-bold text-text-primary">IN 14 DAYS (+14d)</span>
                <span className="text-xs font-mono font-bold text-status-act">
                  {viableDay14.length} Viable
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {options.map((opt) => {
                  const isViable = viableDay14.some((v) => v.id === opt.id);
                  return (
                    <li key={opt.id} className="flex justify-between items-center">
                      <span className={isViable ? "text-text-primary" : "text-text-muted line-through"}>
                        {opt.name}
                      </span>
                      <span className={`font-mono text-[10px] ${isViable ? "text-status-positive" : "text-status-act font-bold"}`}>
                        {isViable ? "Available" : "Expired"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <ChartCaption question="How fast do Aurelia's supply chain backup alternatives disappear as transit risk persists?" />
        </div>
      </Card>

      {/* Option Selection Grid */}
      <Card title="Build Resilience Portfolio" subtitle="Click any option to add it to your active continuity portfolio">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => {
            const isSelected = selectedActionIds.includes(opt.id);
            const decay = computeOptionDecay(opt, scenarioState.riskLevel, scenarioState.disruptionDurationAssumptionDays);
            const isViable = decay.effectiveDaysUntilImpractical > 0;

            return (
              <div
                key={opt.id}
                onClick={() => isViable && toggleAction(opt.id)}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-[200px] ${
                  !isViable
                    ? "border-border-subtle bg-bg-tertiary/40 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "border-accent bg-accent/5 cursor-pointer shadow-md"
                    : "border-border-subtle bg-bg-tertiary hover:border-slate-600 cursor-pointer"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] bg-bg-primary px-2 py-0.5 rounded text-text-muted">
                      {opt.id}
                    </span>
                    <StatusBadge
                      status={!isViable ? "ACT" : isSelected ? "POSITIVE" : "WAIT"}
                      label={!isViable ? "Impractical" : isSelected ? "In Portfolio" : "Unselected"}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mt-2 flex items-center gap-2">
                    {opt.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/50 flex justify-between items-center text-xs font-mono mt-auto">
                  <div>
                    <span className="text-text-muted">Cost: </span>
                    <span className="font-bold text-text-primary">
                      ${(opt.baseCostUsd / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Boost: </span>
                    <span className="font-bold text-status-positive">
                      +{opt.resilienceContribution} pts
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
