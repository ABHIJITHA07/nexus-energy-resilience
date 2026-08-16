"use client";

import React from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import { ChartCaption } from "@/components/ui/ChartCaption";
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Sliders,
  DollarSign,
  Activity,
} from "lucide-react";

export default function OverviewPage() {
  const {
    company,
    decisionWindow,
    resilienceResult,
    waitingResult,
    optimizationResult,
    riskBrief,
    scenarioState,
  } = useScenario();

  const isUrgent = decisionWindow.aggregateDaysRemaining <= 2;
  const topVulnerability = resilienceResult.topVulnerabilities[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: AI Situation Brief */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-bg-secondary border border-border-subtle shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-accent shrink-0 mt-0.5">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              {riskBrief.title}
              <span className="text-[10px] font-mono font-normal text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border-subtle">
                Risk Index: {scenarioState.riskLevel}/100
              </span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              {riskBrief.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/simulator">
            <Button variant="outline" size="sm" icon={<Sliders className="h-3.5 w-3.5" />}>
              Adjust Assumptions
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Main Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Card 1: Decision Window Countdown */}
        <Card
          title="Decision Window Runway"
          subtitle="Time before cheapest resilience options decay"
          borderVariant={isUrgent ? "danger" : decisionWindow.posture === "ACT" ? "warning" : "default"}
          metaBadge={<StatusBadge status={decisionWindow.posture} />}
        >
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold text-text-primary tracking-tight">
                {decisionWindow.aggregateDaysRemaining}
              </span>
              <span className="text-sm text-text-secondary font-mono uppercase">Days Remaining</span>
            </div>

            <div className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle/80 space-y-1">
              <div className="text-[11px] font-mono text-text-muted uppercase">Binding Constraint</div>
              <div className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span>{decisionWindow.limitingOptionName}</span>
                <span className="font-mono text-status-prepare font-bold">
                  {decisionWindow.aggregateDaysRemaining} days
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-text-muted font-mono">Current Risk Posture</span>
              <span className="font-semibold text-text-primary">{decisionWindow.posture}</span>
            </div>

            <Link href="/decision-window" className="block pt-2">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>View Decay Timeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Hero Card 2: Current Resilience Score */}
        <Card
          title="Preparedness Resilience Score"
          subtitle="Weighted metric across supply, inventory, transport"
          metaBadge={
            <span className="text-xs font-mono font-bold text-status-positive bg-status-positive/10 px-2 py-0.5 rounded border border-status-positive/30">
              Target: {scenarioState.targetThresholdScore}/100
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-extrabold text-text-primary tracking-tight">
                  {resilienceResult.totalScore}
                </span>
                <span className="text-xs text-text-muted font-mono">/ 100</span>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-text-muted font-mono uppercase">Baseline</div>
                <div className="text-xs font-mono font-semibold text-text-secondary">{resilienceResult.baselineScore}/100</div>
              </div>
            </div>

            {/* Score Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-bg-tertiary h-3 rounded-full overflow-hidden border border-border-subtle p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-accent to-status-positive"
                  style={{ width: `${resilienceResult.totalScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>Unprepared (0)</span>
                <span>Threshold (75)</span>
                <span>Resilient (100)</span>
              </div>
            </div>

            {/* Potential Loss Avoided Callout */}
            <div className="p-3 rounded-lg bg-status-positive/10 border border-status-positive/30 flex items-center justify-between">
              <div className="text-xs font-medium text-text-primary">Protected Business Value</div>
              <div className="text-sm font-mono font-bold text-status-positive">
                +${(resilienceResult.potentialLossAvoidedUsd / 1000000).toFixed(2)}M
              </div>
            </div>

            <Link href="/resilience" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Score Breakdown</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Hero Card 3: Hormuz Exposure Summary */}
        <Card
          title="Aurelia Energy Exposure"
          subtitle={`64% of crude input passes Strait of Hormuz`}
          metaBadge={
            <span className="text-xs font-mono text-status-act bg-status-act/10 px-2 py-0.5 rounded border border-status-act/30">
              High Concentration
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-extrabold text-status-act tracking-tight">
                64%
              </span>
              <span className="text-xs text-text-secondary font-mono">Input Share</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Daily Throughput:</span>
                <span className="font-mono font-semibold text-text-primary">180,000 bbl/day</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Hormuz Dependent Volume:</span>
                <span className="font-mono font-semibold text-status-act">115,200 bbl/day</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Annual Revenue at Risk:</span>
                <span className="font-mono font-semibold text-text-primary">$1.34 Billion</span>
              </div>
            </div>

            <Link href="/network" className="block pt-1">
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Explore Dependency Graph</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Grid: Vulnerability Callout & Recommended Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vulnerability Callout Card */}
        {topVulnerability && (
          <Card
            title="Primary Supply Vulnerability"
            subtitle="Largest single factor drag on Aurelia's resilience score"
            borderVariant="warning"
            metaBadge={
              <span className="text-xs font-mono text-status-prepare bg-status-prepare/15 px-2.5 py-0.5 rounded-full border border-status-prepare/30 flex items-center gap-1">
                <AlertOctagon className="h-3 w-3" />
                Score: {topVulnerability.currentValue}/100
              </span>
            }
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-bg-tertiary border border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text-primary">{topVulnerability.name}</h4>
                  <span className="text-xs font-mono text-text-muted">Weight: {topVulnerability.weightPct}%</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Supplier concentration is heavily dominated by Persian Gulf Terminals (SUP-1 Al-Rashid & SUP-2 Straitline Co.).
                </p>
              </div>

              <Alert variant="warning" title="Remediation Plan Available">
                Activating alt-supplier term contracts (OPT-2) will increase this factor by +28 pts and clear the target threshold.
              </Alert>

              <div className="flex items-center justify-end gap-3 pt-1">
                <Link href="/simulator">
                  <Button variant="primary" size="sm" icon={<Sliders className="h-3.5 w-3.5" />}>
                    Remediate in Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Recommended Action Card */}
        <Card
          title="Recommended Next Action Plan"
          subtitle="Lowest-cost optimal portfolio computed by engine"
          borderVariant="active"
          metaBadge={
            <span className="text-xs font-mono font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30">
              Optimal Choice
            </span>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-bg-tertiary border border-border-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted font-mono">Recommended Actions ({optimizationResult.recommendedOptions.length}):</span>
                <span className="font-mono font-bold text-status-positive">
                  Est. Cost: ${(optimizationResult.totalCostUsd / 1000000).toFixed(2)}M
                </span>
              </div>
              <ul className="space-y-1.5 pt-1">
                {optimizationResult.recommendedOptions.map((opt) => (
                  <li key={opt.id} className="text-xs text-text-primary flex items-center justify-between border-b border-border-subtle/40 pb-1">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{opt.name}</span>
                    </span>
                    <span className="font-mono text-text-muted">${(opt.baseCostUsd / 1000000).toFixed(2)}M</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {optimizationResult.rationaleSummary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border-subtle/60">
              <div className="text-xs text-text-muted font-mono">
                Achieves <strong className="text-status-positive">{optimizationResult.resilienceScore}/100</strong> Resilience
              </div>
              <Link href="/action-center">
                <Button variant="primary" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Review & Approve
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Summary: Cost of Waiting Preview */}
      <Card title="Cost of Delay Snapshot" subtitle="Quantified price of postponing action">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          {waitingResult.horizons.map((h, i) => (
            <div key={h.label} className="p-3 rounded-lg bg-bg-tertiary border border-border-subtle space-y-1">
              <div className="text-[11px] font-mono text-text-muted">{h.label}</div>
              <div className="text-base font-mono font-bold text-text-primary">
                ${(h.preparationCostUsd / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] font-mono text-status-act">
                {i === 0 ? "Baseline Spend" : `+$${(h.netOutcomeUsd / 1000000).toFixed(2)}M net loss`}
              </div>
            </div>
          ))}
        </div>
        <ChartCaption question="What is the daily financial penalty of delaying resilience preparations?" />
      </Card>

      {/* Walkthrough Video Card */}
      <Card
        title="2-Minute Product Walkthrough"
        subtitle="See how NEXUS turns supply disruption uncertainty into a clear business decision."
        borderVariant="default"
        metaBadge={
          <span className="text-[10px] font-mono font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30 tracking-wider">
            PRODUCT WALKTHROUGH
          </span>
        }
      >
        <div className="w-full relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-bg-tertiary">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            src="/nexus-demo.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </Card>
    </div>
  );
}
