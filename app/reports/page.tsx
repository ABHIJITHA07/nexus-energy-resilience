"use client";

import React from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileText, Printer, Share2, CheckCircle2, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export default function ReportsPage() {
  const {
    company,
    decisionWindow,
    resilienceResult,
    optimizationResult,
    recommendationState,
    decisionLog,
    scenarioState,
  } = useScenario();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent" />
            <span>Executive Board Summary Report</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Print-friendly decision memo summarizing Aurelia Energy's Strait risk posture, runway, and recommended actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer className="h-3.5 w-3.5" />}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Share2 className="h-3.5 w-3.5" />}
            onClick={() => alert("Board Summary memo copied to clipboard.")}
          >
            Copy Summary Text
          </Button>
        </div>
      </div>

      {/* Main Print-Ready Document Container */}
      <div className="p-8 rounded-2xl bg-bg-secondary border border-border-subtle space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-border-subtle/80 pb-6">
          <div>
            <div className="text-xs font-mono text-accent font-bold uppercase tracking-widest">
              CONFIDENTIAL BOARD MEMORANDUM
            </div>
            <h2 className="text-2xl font-extrabold text-text-primary mt-1">
              Aurelia Energy Supply Resilience Assessment
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              Scenario: Sustained Strait of Hormuz Transit Disruption ({scenarioState.disruptionDurationAssumptionDays} Days)
            </p>
          </div>
          <div className="text-right font-mono text-xs text-text-muted">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Prepared for: Board Risk Committee</div>
            <div>Author: Chief Supply Chain Officer</div>
          </div>
        </div>

        {/* Executive Summary Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-1">
            <div className="text-[11px] font-mono text-text-muted uppercase">Recommended Posture</div>
            <div className="text-lg font-bold text-text-primary flex items-center gap-2">
              <StatusBadge status={decisionWindow.posture} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-1">
            <div className="text-[11px] font-mono text-text-muted uppercase">Decision Window Runway</div>
            <div className="text-xl font-mono font-bold text-text-primary">
              {decisionWindow.aggregateDaysRemaining} Days
            </div>
          </div>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-1">
            <div className="text-[11px] font-mono text-text-muted uppercase">Resilience Score</div>
            <div className="text-xl font-mono font-bold text-status-positive">
              {resilienceResult.totalScore}/100
            </div>
          </div>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-1">
            <div className="text-[11px] font-mono text-text-muted uppercase">Recommended Spend</div>
            <div className="text-xl font-mono font-bold text-accent">
              ${(optimizationResult.totalCostUsd / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>

        {/* Strategic Rationale & Recommended Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider border-b border-border-subtle pb-2">
            1. Recommended Strategic Portfolio
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {optimizationResult.rationaleSummary}
          </p>

          <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-2">
            <div className="text-xs font-mono font-semibold text-text-muted uppercase">Selected Resilience Actions</div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {optimizationResult.recommendedOptions.map((opt) => (
                <li key={opt.id} className="p-2 rounded bg-bg-primary border border-border-subtle/80 flex items-center justify-between">
                  <span className="font-semibold text-text-primary">{opt.name}</span>
                  <span className="font-mono text-text-muted">${(opt.baseCostUsd / 1000000).toFixed(2)}M</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cost of Waiting Financial Argument */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider border-b border-border-subtle pb-2">
            2. Cost of Waiting Analysis
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Postponing execution beyond the decision window incurs spot market rate inflation and unmitigated contract penalty risk. Acting today secures resilience capacity at baseline rates.
          </p>
        </div>

        {/* Governance Audit Log Excerpt */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text-primary uppercase font-mono tracking-wider border-b border-border-subtle pb-2">
            3. Decision Governance & Approval Trail
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-bg-tertiary text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Actor</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {decisionLog.map((log) => (
                  <tr key={log.id}>
                    <td className="p-2.5 text-text-muted">{log.timestampLabel}</td>
                    <td className="p-2.5 text-accent">{log.actor}</td>
                    <td className="p-2.5 text-text-primary">{log.action}</td>
                    <td className="p-2.5 text-status-positive font-bold">{log.toState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
