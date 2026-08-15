"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { CircleDollarSign, ArrowRight, TrendingUp, AlertTriangle, Check } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

export default function CostOfWaitingPage() {
  const { options, scenarioState, waitingResult, resetToRecommended } = useScenario();
  const [customWaitDays, setCustomWaitDays] = useState<number>(5);

  const activeWaiting = waitingResult;

  // Generate curve data points for 0 to 14 days
  const curveData = Array.from({ length: 15 }, (_, d) => {
    const activeOpts = scenarioState.selectedActionIds.length > 0
      ? options.filter((o) => scenarioState.selectedActionIds.includes(o.id))
      : options;

    const prepCostDay0 = activeOpts.reduce((sum, o) => sum + o.baseCostUsd, 0);

    const riskMult = 1 + (scenarioState.riskLevel / 100) * 1.5;
    const prepCost = activeOpts.reduce((sum, o) => {
      const rate = o.costGrowthRatePctPerDay * riskMult;
      return sum + Math.round(o.baseCostUsd * Math.pow(1 + rate / 100, d));
    }, 0);

    const shortfallDays = d * (scenarioState.riskLevel / 100) * 0.45 * (scenarioState.disruptionDurationAssumptionDays / 45);
    const expectedLoss = Math.round(activeWaiting.dailyRevenueAtRiskUsd * shortfallDays);
    const netOutcome = prepCost + expectedLoss - prepCostDay0;

    return {
      day: d,
      prepCostUsd: prepCost,
      expectedLossUsd: expectedLoss,
      netOutcomeUsd: netOutcome,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <CircleDollarSign className="h-6 w-6 text-accent" />
            <span>Cost of Waiting Financial Analysis</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Quantifying the net financial impact of delaying preparation decisions versus acting today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/simulator">
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              onClick={() => resetToRecommended()}
            >
              Lock in Act Now Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Way Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeWaiting.horizons.map((pt, idx) => {
          const isActNow = idx === 0;

          return (
            <Card
              key={pt.label}
              title={pt.label}
              borderVariant={isActNow ? "success" : pt.netOutcomeUsd > 2000000 ? "danger" : "warning"}
              metaBadge={
                isActNow ? (
                  <span className="text-[10px] font-mono text-status-positive bg-status-positive/10 px-2 py-0.5 rounded border border-status-positive/30">
                    Optimal Posture
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-status-act bg-status-act/10 px-2 py-0.5 rounded border border-status-act/30">
                    Wait Penalty
                  </span>
                )
              }
            >
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-mono text-text-muted">Preparation Spend</div>
                  <div className="text-xl font-mono font-bold text-text-primary">
                    ${(pt.preparationCostUsd / 1000000).toFixed(2)}M
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle/60 space-y-1">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Unmitigated Exposure:</span>
                    <span className="font-mono text-text-primary">${(pt.expectedLossExposureUsd / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-primary">Net Cost vs Today:</span>
                    <span className={`font-mono ${isActNow ? "text-status-positive" : "text-status-act"}`}>
                      {isActNow ? "$0.00 (Baseline)" : `+$${(pt.netOutcomeUsd / 1000000).toFixed(2)}M`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Custom Wait Slider Card (5th Card Generator) */}
      <Card title="Custom Delay Simulation" subtitle="Drag the slider to test any intermediate decision meeting timeline">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <Slider
              label="Select Custom Delay Horizon"
              value={customWaitDays}
              min={0}
              max={14}
              unit=" Days"
              onChange={setCustomWaitDays}
              description="Interpolates prep cost growth and unmitigated exposure day-by-day."
            />
          </div>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-accent/40 space-y-2">
            <div className="text-xs font-mono text-accent font-semibold uppercase">
              Simulated {activeWaiting.customWait.label} Outcome
            </div>
            <div className="text-2xl font-mono font-extrabold text-text-primary">
              ${(activeWaiting.customWait.preparationCostUsd / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-status-act font-mono font-semibold">
              Net Delay Penalty: +${(activeWaiting.customWait.netOutcomeUsd / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>
      </Card>

      {/* Main Financial Curve Chart */}
      <Card title="Net Downside Trajectory vs. Days Delayed" subtitle="Breakeven point shows the day beyond which waiting is net-negative">
        <div className="space-y-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={curveData}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9534F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D9534F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262C3A" />
                <XAxis dataKey="day" stroke="#9AA3B5" fontSize={11} tickFormatter={(d) => `Day ${d}`} />
                <YAxis stroke="#9AA3B5" fontSize={11} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#12161F", borderColor: "#262C3A", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: any) => [`$${(Number(value) / 1000000).toFixed(2)}M`, "Net Cost Penalty"]}
                  labelFormatter={(label) => `Day ${label} Delay`}
                />
                <ReferenceLine x={activeWaiting.breakevenDay} stroke="#E0A32C" strokeDasharray="4 4" label={{ value: `Breakeven: Day ${activeWaiting.breakevenDay}`, fill: "#E0A32C", fontSize: 11 }} />
                <Area type="monotone" dataKey="netOutcomeUsd" stroke="#D9534F" fillOpacity={1} fill="url(#colorNet)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <ChartCaption question="At what day does delaying resilience action become net-negative for Aurelia Energy?" />
        </div>
      </Card>
    </div>
  );
}
