"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import {
  Sliders,
  CheckSquare,
  Square,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SimulatorPage() {
  const {
    options,
    scenarioState,
    setScenarioState,
    toggleAction,
    resilienceResult,
    optimizationResult,
    saveScenario,
    resetToRecommended,
    resetToBaseline,
    applyCustomRecommendation,
  } = useScenario();

  const [scenarioNameInput, setScenarioNameInput] = useState<string>("");
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const selectedOpts = options.filter((o) => scenarioState.selectedActionIds.includes(o.id));
  const totalCost = selectedOpts.reduce((sum, o) => sum + o.baseCostUsd, 0);
  const isOverBudget = totalCost > scenarioState.budgetCapUsd;
  const budgetOverheadUsd = totalCost - scenarioState.budgetCapUsd;
  const budgetUsagePct = Math.min(100, Math.round((totalCost / scenarioState.budgetCapUsd) * 100));

  const handleSave = () => {
    saveScenario(scenarioNameInput || `Custom Plan ${Date.now().toString().slice(-4)}`);
    setScenarioNameInput("");
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleApplyAsRecommendation = () => {
    applyCustomRecommendation(
      scenarioState.selectedActionIds,
      `User-selected portfolio producing ${resilienceResult.totalScore}/100 resilience score at $${(
        totalCost / 1000000
      ).toFixed(2)}M capital allocation.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Sliders className="h-6 w-6 text-accent" />
            <span>Scenario Simulator & Strategy Builder</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Test custom combinations of resilience actions and observe live recomputations of score, cost, and loss avoided.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={resetToRecommended}>
            Reset to Recommended
          </Button>
          <Button variant="ghost" size="sm" onClick={resetToBaseline}>
            Clear All
          </Button>
        </div>
      </div>

      {/* 3-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Scenario Control Sliders (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Scenario Driver Assumptions" subtitle="Adjust global risk parameters">
            <div className="space-y-4">
              <Slider
                label="Strait Risk Level"
                value={scenarioState.riskLevel}
                min={0}
                max={100}
                unit="/100"
                onChange={(val) => setScenarioState({ riskLevel: val })}
              />

              <Slider
                label="Disruption Horizon"
                value={scenarioState.disruptionDurationAssumptionDays}
                min={15}
                max={180}
                step={5}
                unit=" Days"
                onChange={(val) => setScenarioState({ disruptionDurationAssumptionDays: val })}
              />

              <Slider
                label="Target Resilience Score"
                value={scenarioState.targetThresholdScore}
                min={50}
                max={95}
                unit="/100"
                onChange={(val) => setScenarioState({ targetThresholdScore: val })}
              />

              <Slider
                label="Budget Cap Limit"
                value={scenarioState.budgetCapUsd / 1000000}
                min={2}
                max={15}
                step={0.5}
                unit="M"
                onChange={(val) => setScenarioState({ budgetCapUsd: val * 1000000 })}
                valueFormatter={(v) => `$${v.toFixed(1)}M`}
              />

              <Slider
                label="Supplier Availability"
                value={scenarioState.supplierAvailabilityPct}
                min={30}
                max={100}
                unit="%"
                onChange={(val) => setScenarioState({ supplierAvailabilityPct: val })}
              />

              <Slider
                label="Transport Charter Capacity"
                value={scenarioState.transportCapacityPct}
                min={20}
                max={100}
                unit="%"
                onChange={(val) => setScenarioState({ transportCapacityPct: val })}
              />
            </div>
          </Card>
        </div>

        {/* Center Column: 6 Strategy Action Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title="Resilience Action Catalog"
            subtitle="Select actions to build a custom portfolio"
            metaBadge={
              <span className="text-xs font-mono text-text-muted">
                {scenarioState.selectedActionIds.length}/6 Selected
              </span>
            }
          >
            <div className="space-y-3">
              {options.map((opt) => {
                const isSelected = scenarioState.selectedActionIds.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleAction(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border-subtle bg-bg-tertiary hover:border-slate-600"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-accent" />
                      ) : (
                        <Square className="h-4 w-4 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-text-primary">{opt.name}</h4>
                        <span className="font-mono text-xs font-bold text-accent">
                          ${(opt.baseCostUsd / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">{opt.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
                        <span>Marginal Boost: +{opt.resilienceContribution} pts</span>
                        <span>Lead: {opt.leadTimeDays}d</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Recompute Results & Budget Bar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Simulated Strategy Results" subtitle="Recomputed instantly from engine math">
            <div className="space-y-5">
              {/* Score Display */}
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Resulting Resilience Score</span>
                  <span className="font-mono">Target: {scenarioState.targetThresholdScore}/100</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-extrabold text-text-primary">
                    {resilienceResult.totalScore}
                  </span>
                  <span className="text-xs text-text-muted font-mono">/ 100</span>
                  {resilienceResult.totalScore >= scenarioState.targetThresholdScore ? (
                    <span className="text-xs font-mono font-bold text-status-positive bg-status-positive/10 px-2 py-0.5 rounded border border-status-positive/30 ml-auto">
                      Target Reached
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-status-prepare bg-status-prepare/10 px-2 py-0.5 rounded border border-status-prepare/30 ml-auto">
                      Below Target
                    </span>
                  )}
                </div>
              </div>

              {/* Total Cost & Budget Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Total Portfolio Cost:</span>
                  <span className={`font-mono font-bold ${isOverBudget ? "text-status-act" : "text-text-primary"}`}>
                    ${(totalCost / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="w-full bg-bg-tertiary h-2.5 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverBudget ? "bg-status-act" : "bg-accent"
                    }`}
                    style={{ width: `${Math.min(100, budgetUsagePct)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-text-muted">
                  <span>Cap: ${(scenarioState.budgetCapUsd / 1000000).toFixed(1)}M</span>
                  <span>{budgetUsagePct}% Used</span>
                </div>
              </div>

              {/* Protected Business Value */}
              <div className="p-3.5 rounded-lg bg-status-positive/10 border border-status-positive/30 space-y-1">
                <div className="text-[11px] font-mono text-text-muted uppercase">Potential Loss Avoided</div>
                <div className="text-xl font-mono font-bold text-status-positive">
                  +${(resilienceResult.potentialLossAvoidedUsd / 1000000).toFixed(2)}M
                </div>
              </div>

              {/* Save Scenario Form */}
              <div className="pt-2 border-t border-border-subtle space-y-2">
                <input
                  type="text"
                  placeholder="Enter scenario title..."
                  value={scenarioNameInput}
                  onChange={(e) => setScenarioNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-tertiary border border-border-subtle rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  icon={<Save className="h-3.5 w-3.5" />}
                  onClick={handleSave}
                >
                  Save Scenario for AI Comparison
                </Button>
                {saveToast && (
                  <p className="text-[11px] font-mono text-status-positive text-center">
                    ✓ Saved to session comparisons!
                  </p>
                )}
              </div>

              {/* Apply Baseline Button */}
              <Link href="/action-center" className="block pt-1" onClick={handleApplyAsRecommendation}>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-between"
                  disabled={isOverBudget}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  <span>Apply as Active Recommendation</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
