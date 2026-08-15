"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { StatusBadge } from "./StatusBadge";
import { Clock, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export function TopStatusBar() {
  const { decisionWindow, resilienceResult, company, recommendationState } = useScenario();

  return (
    <header className="h-14 bg-bg-primary border-b border-border-subtle px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
      {/* Left: Key Metrics (Countdown + Score + Posture) */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Countdown Chip */}
        <Link href="/decision-window" className="flex items-center gap-2.5 group cursor-pointer hover:opacity-90 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-bg-tertiary border border-border-subtle flex items-center justify-center text-accent group-hover:border-accent/50">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-mono leading-3">Decision Window</div>
            <div className="text-sm font-mono font-bold text-text-primary flex items-center gap-1">
              {decisionWindow.aggregateDaysRemaining} <span className="text-xs font-normal text-text-secondary">days remaining</span>
            </div>
          </div>
        </Link>

        <div className="h-6 w-px bg-border-subtle/80 hidden sm:block" />

        {/* Resilience Score Chip */}
        <Link href="/resilience" className="flex items-center gap-2.5 group cursor-pointer hover:opacity-90 transition-opacity hidden sm:flex">
          <div className="h-8 w-8 rounded-lg bg-bg-tertiary border border-border-subtle flex items-center justify-center text-status-positive group-hover:border-status-positive/50">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted font-mono leading-3">Resilience Score</div>
            <div className="text-sm font-mono font-bold text-text-primary">
              {resilienceResult.totalScore}<span className="text-xs font-normal text-text-muted">/100</span>
            </div>
          </div>
        </Link>

        <div className="h-6 w-px bg-border-subtle/80 hidden md:block" />

        {/* Posture Badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Posture:</span>
          <StatusBadge status={decisionWindow.posture} />
        </div>
      </div>

      {/* Right: Simulation Label & Persona Context */}
      <div className="flex items-center gap-3">
        {/* Prototype Disclosure Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-tertiary border border-border-subtle text-[11px] font-mono text-text-secondary">
          <AlertCircle className="h-3 w-3 text-status-prepare" />
          <span>Simulated Prototype Data</span>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-border-subtle/80 text-xs text-text-secondary">
          <div className="h-7 w-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div className="hidden xl:block">
            <div className="font-semibold text-text-primary text-xs leading-4">{company.name}</div>
            <div className="text-[10px] text-text-muted font-mono leading-3">Role: Chief Supply Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
