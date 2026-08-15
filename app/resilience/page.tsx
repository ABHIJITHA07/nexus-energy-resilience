"use client";

import React from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { ShieldCheck, AlertOctagon, Sliders, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ResiliencePage() {
  const { resilienceResult, options, scenarioState, addOptionToSelection } = useScenario();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-status-positive" />
            <span>Resilience Assessment & Factor Breakdown</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Analyzing Aurelia Energy's preparedness score across 5 weighted vulnerability dimensions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/simulator">
            <Button variant="primary" size="sm" icon={<Sliders className="h-3.5 w-3.5" />}>
              Open Strategy Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Hero Score Card */}
      <Card
        title="Composite Preparedness Score"
        subtitle={`Target threshold configured at ${scenarioState.targetThresholdScore}/100`}
        borderVariant="active"
        metaBadge={
          <span className="text-xs font-mono font-bold text-status-positive bg-status-positive/10 px-2.5 py-0.5 rounded border border-status-positive/30">
            Score: {resilienceResult.totalScore}/100
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <div className="text-xs text-text-muted font-mono uppercase">Current Composite Score</div>
            <div className="font-mono text-5xl font-extrabold text-text-primary tracking-tight">
              {resilienceResult.totalScore}
            </div>
            <div className="text-xs text-text-secondary">
              Baseline unprepared score: {resilienceResult.baselineScore}/100
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between text-xs text-text-muted font-mono">
              <span>Preparedness Progress</span>
              <span>{resilienceResult.totalScore}%</span>
            </div>
            <div className="w-full bg-bg-tertiary h-4 rounded-full overflow-hidden border border-border-subtle p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-accent to-status-positive"
                style={{ width: `${resilienceResult.totalScore}%` }}
              />
            </div>
            <div className="p-3 rounded-lg bg-bg-tertiary text-xs text-text-secondary flex items-center justify-between">
              <span>Protected Annual Value Avoided:</span>
              <strong className="font-mono text-status-positive">+${(resilienceResult.potentialLossAvoidedUsd / 1000000).toFixed(2)}M</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* 5-Factor Breakdown Section */}
      <Card title="Weighted Factor Breakdown" subtitle="Each factor contributes to the composite score according to its model weight">
        <div className="space-y-4">
          {resilienceResult.factors.map((factor) => {
            const pct = factor.currentValue;

            return (
              <div
                key={factor.factorId}
                className={`p-4 rounded-xl border transition-all ${
                  factor.isVulnerability
                    ? "border-status-prepare bg-status-prepare/5"
                    : "border-border-subtle bg-bg-tertiary"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-text-primary">{factor.name}</h4>
                    {factor.isVulnerability && (
                      <span className="text-[10px] font-mono font-bold text-status-prepare bg-status-prepare/15 px-2 py-0.5 rounded border border-status-prepare/30 flex items-center gap-1">
                        <AlertOctagon className="h-3 w-3" />
                        Top Vulnerability
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-text-muted">Weight: {factor.weightPct}%</span>
                    <span className="font-bold text-text-primary">Value: {factor.currentValue}/100</span>
                    <span className="text-accent">Contrib: +{factor.contributionToScore} pts</span>
                  </div>
                </div>

                <div className="w-full bg-bg-primary h-2.5 rounded-full overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full transition-all duration-300 ${
                      factor.isVulnerability
                        ? "bg-status-prepare"
                        : factor.currentValue >= 70
                        ? "bg-status-positive"
                        : "bg-accent"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          <ChartCaption question="Which vulnerability factor represents the primary bottleneck in Aurelia Energy's supply resilience?" />
        </div>
      </Card>

      {/* Remediation Improvement Cards */}
      <Card title="Vulnerability Remediation Action Plans" subtitle="Targeted options to resolve factor drags">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => (
            <div key={opt.id} className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-primary">{opt.name}</h4>
                <span className="font-mono text-xs font-bold text-accent">${(opt.baseCostUsd / 1000000).toFixed(2)}M</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{opt.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/60 text-xs font-mono">
                <span className="text-status-positive">+ {opt.resilienceContribution} pts score boost</span>
                <Link href="/simulator">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="h-3 w-3" />}
                    onClick={() => addOptionToSelection(opt.id)}
                  >
                    Remediate
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
