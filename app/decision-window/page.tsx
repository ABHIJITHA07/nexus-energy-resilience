"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { computeOptionDecay } from "@/lib/engine/decay";
import { Clock, Sliders, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DecisionWindowPage() {
  const { options, scenarioState, setRiskLevel, setDisruptionDuration, decisionWindow } = useScenario();
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>("OPT-3");
  const [showCostOverlay, setShowCostOverlay] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Clock className="h-6 w-6 text-accent" />
            <span>Decision Window & Option Decay</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Visualizing option decay rates and the time remaining before cheapest resilience actions disappear.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/simulator">
            <Button variant="primary" size="sm" icon={<Sliders className="h-3.5 w-3.5" />}>
              Simulate Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Panel Card: Live Risk Sliders */}
      <Card title="Live Risk & Scenario Drivers" subtitle="Adjusting risk level recomputes option viability windows instantly">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Slider
            label="Strait Disruption Risk Index"
            value={scenarioState.riskLevel}
            min={0}
            max={100}
            unit="/100"
            onChange={setRiskLevel}
            description="Higher risk accelerates spot price escalation and compresses viability windows."
          />
          <Slider
            label="Disruption Duration Assumption"
            value={scenarioState.disruptionDurationAssumptionDays}
            min={15}
            max={180}
            step={5}
            unit=" Days"
            onChange={setDisruptionDuration}
            description="Longer duration assumptions compound market tightness beyond 60 days."
          />
        </div>
      </Card>

      {/* Aggregate Countdown Hero Card */}
      <Card
        title="Aggregate Strategic Window"
        subtitle="Bounded by the fastest decaying required resilience option"
        borderVariant={decisionWindow.posture === "ACT" ? "danger" : "active"}
        metaBadge={<StatusBadge status={decisionWindow.posture} />}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 rounded-lg bg-bg-tertiary border border-border-subtle">
          <div className="space-y-1">
            <div className="text-xs text-text-muted font-mono uppercase">Limiting Binding Constraint</div>
            <div className="text-lg font-bold text-text-primary flex items-center gap-2">
              <span>{decisionWindow.limitingOptionName}</span>
              <span className="text-xs font-mono text-status-act bg-status-act/10 px-2 py-0.5 rounded border border-status-act/30">
                Compresses fastest
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Further waiting beyond {decisionWindow.aggregateDaysRemaining} days causes this option to cross its impractical cost threshold.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-5xl font-extrabold text-text-primary tracking-tight">
              {decisionWindow.aggregateDaysRemaining}
            </div>
            <div className="text-xs font-mono text-text-muted uppercase">Days Remaining</div>
          </div>
        </div>
      </Card>

      {/* Main Timeline Visualization */}
      <Card
        title="Option Viability Timeline"
        subtitle="Click any option lane to inspect its underlying cost-over-time decay curve"
        headerAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCostOverlay(!showCostOverlay)}
          >
            {showCostOverlay ? "Hide Cost Overlay" : "Show Cost Overlay"}
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Timeline Header Markers */}
          <div className="hidden sm:flex justify-between items-center text-[11px] font-mono text-text-muted px-4 py-2 bg-bg-tertiary rounded-lg border border-border-subtle">
            <span>Today (Day 0)</span>
            <span>Day 7</span>
            <span>Day 14</span>
            <span>Day 21</span>
            <span>Day 30+ (Impractical Window)</span>
          </div>

          {/* Option Lanes */}
          <div className="space-y-3">
            {options.map((option) => {
              const decay = computeOptionDecay(
                option,
                scenarioState.riskLevel,
                scenarioState.disruptionDurationAssumptionDays
              );
              const isExpanded = expandedOptionId === option.id;
              const isBinding = decisionWindow.limitingOptionId === option.id;
              const daysRemaining = decay.effectiveDaysUntilImpractical;
              const isImpractical = daysRemaining <= 0;

              // Timeline bar percentage out of max 30 days
              const widthPct = Math.min(100, Math.max(8, (daysRemaining / 30) * 100));

              return (
                <div
                  key={option.id}
                  className={`rounded-xl border transition-all duration-200 ${
                    isBinding
                      ? "border-accent/80 bg-accent/5"
                      : isImpractical
                      ? "border-border-subtle bg-bg-tertiary/40 opacity-60"
                      : "border-border-subtle bg-bg-tertiary/80 hover:border-slate-600"
                  }`}
                >
                  {/* Lane Row Header */}
                  <div
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedOptionId(isExpanded ? null : option.id)}
                  >
                    <div className="flex items-center gap-3 sm:w-1/3">
                      <div className="p-2 rounded-lg bg-bg-primary border border-border-subtle text-accent font-mono text-xs font-bold">
                        {option.id}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                          {option.name}
                          {isBinding && (
                            <span className="text-[10px] font-mono text-accent bg-accent/15 px-1.5 py-0.2 rounded">
                              BINDING
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-text-secondary">{option.category} · Base ${ (option.baseCostUsd / 1000000).toFixed(1) }M</span>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-text-muted">
                        <span>Viable Window: {daysRemaining} days</span>
                        <span>Decay: +{decay.effectiveGrowthRatePctPerDay}%/day</span>
                      </div>
                      <div className="w-full bg-bg-primary h-3 rounded-full overflow-hidden border border-border-subtle p-0.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isBinding
                              ? "bg-status-act"
                              : daysRemaining <= 10
                              ? "bg-status-prepare"
                              : "bg-accent"
                          }`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Expand Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-text-primary">
                        ${(decay.costTodayUsd / 1000000).toFixed(2)}M
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-text-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-muted" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel (Recharts Overlay) */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border-subtle bg-bg-primary/80 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-primary">
                          Decay Trajectory: {option.name}
                        </span>
                        <span className="text-text-muted font-mono">
                          Growth Rate: +{decay.effectiveGrowthRatePctPerDay}% per day
                        </span>
                      </div>

                      {/* Recharts Line Chart */}
                      <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={decay.decayCurve}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#262C3A" />
                            <XAxis dataKey="day" stroke="#9AA3B5" fontSize={11} tickFormatter={(d) => `Day ${d}`} />
                            <YAxis
                              stroke="#9AA3B5"
                              fontSize={11}
                              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#12161F", borderColor: "#262C3A", borderRadius: "8px", fontSize: "12px" }}
                              formatter={(value: any) => [`$${(Number(value) / 1000000).toFixed(2)}M`, "Cost"]}
                              labelFormatter={(label) => `Day ${label}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="costUsd"
                              stroke="#3E7BFA"
                              strokeWidth={2.5}
                              dot={{ fill: "#3E7BFA", r: 3 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="p-3 rounded-lg bg-bg-tertiary text-xs text-text-secondary flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>
                          {option.description} Lead time required: {option.leadTimeDays} days.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <ChartCaption question="How fast does each resilience option become financially impractical as Strait disruption risk persists?" />
        </div>
      </Card>
    </div>
  );
}
