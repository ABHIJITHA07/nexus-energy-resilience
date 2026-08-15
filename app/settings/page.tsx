"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Settings, Save, RotateCcw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { scenarioState, setTargetThreshold, setBudgetCap, setRiskLevel, setDisruptionDuration, resetToBaseline } = useScenario();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showConfirmation = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Settings className="h-6 w-6 text-accent" />
            <span>Model Settings & Risk Preferences</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure decision engine target thresholds, budget constraints, and risk tolerance assumptions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={resetToBaseline}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-lg bg-status-positive/15 border border-status-positive/40 text-xs font-mono text-status-positive flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Decision Engine Parameters" subtitle="Downstream target thresholds">
          <div className="space-y-5">
            <Slider
              label="Target Resilience Score Threshold"
              value={scenarioState.targetThresholdScore}
              min={50}
              max={95}
              unit="/100"
              onChange={(val) => {
                setTargetThreshold(val);
                showConfirmation(`Target threshold updated to ${val}/100. Downstream engine re-optimized.`);
              }}
              description="Minimum composite preparedness score required by the optimizer."
            />

            <Slider
              label="Capital Budget Cap"
              value={scenarioState.budgetCapUsd / 1000000}
              min={2}
              max={15}
              step={0.5}
              unit="M"
              onChange={(val) => {
                setBudgetCap(val * 1000000);
                showConfirmation(`Budget cap updated to $${val.toFixed(1)}M.`);
              }}
              valueFormatter={(v) => `$${v.toFixed(1)}M`}
              description="Maximum capital allocation permitted for resilience options."
            />
          </div>
        </Card>

        <Card title="Risk Baseline Drivers" subtitle="Global scenario defaults">
          <div className="space-y-5">
            <Slider
              label="Baseline Strait Risk Level"
              value={scenarioState.riskLevel}
              min={0}
              max={100}
              unit="/100"
              onChange={(val) => {
                setRiskLevel(val);
                showConfirmation(`Risk level updated to ${val}/100. Option decay curves recomputed.`);
              }}
              description="Simulated Strait transit risk index."
            />

            <Slider
              label="Disruption Duration Assumption"
              value={scenarioState.disruptionDurationAssumptionDays}
              min={15}
              max={180}
              step={5}
              unit=" Days"
              onChange={(val) => {
                setDisruptionDuration(val);
                showConfirmation(`Disruption duration updated to ${val} days.`);
              }}
              description="Assumed period of sustained Hormuz transit vulnerability."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
