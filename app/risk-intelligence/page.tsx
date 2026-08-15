"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { Activity, ShieldAlert, AlertTriangle, Globe, Ship, Anchor, HelpCircle, ArrowUpRight, ArrowDownRight, Equal } from "lucide-react";

interface RiskIndicatorData {
  name: string;
  category: "Geopolitical" | "Logistics" | "Financial" | "Sourcing";
  status: "WAIT" | "PREPARE" | "ACT" | "POSITIVE";
  direction: "RISING" | "STABLE" | "FALLING";
  impact: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  icon: any;
}

export default function RiskIntelligencePage() {
  const { scenarioState, setRiskLevel } = useScenario();
  const [tensionLevel, setTensionLevel] = useState<number>(scenarioState.riskLevel);

  const handleTensionChange = (val: number) => {
    setTensionLevel(val);
    setRiskLevel(val); // Sync to global state
  };

  const getIndicators = (t: number): RiskIndicatorData[] => {
    const isLow = t <= 35;
    const isMid = t > 35 && t <= 65;

    return [
      {
        name: "Geopolitical Escalation Index",
        category: "Geopolitical",
        status: isLow ? "POSITIVE" : isMid ? "PREPARE" : "ACT",
        direction: isLow ? "FALLING" : isMid ? "STABLE" : "RISING",
        impact: "CRITICAL",
        confidence: "HIGH",
        explanation: isLow
          ? "Naval patrols report calm transit corridors. Geopolitical posture is stable."
          : isMid
          ? "Escalating maritime drills observed. Insurance war risk premiums under active audit."
          : "Active drone activity and naval stand-offs near Strait corridors. Heavy escort requirements.",
        icon: Globe,
      },
      {
        name: "Shipping Transit Disruption",
        category: "Logistics",
        status: isLow ? "POSITIVE" : isMid ? "WAIT" : "ACT",
        direction: isLow ? "FALLING" : isMid ? "RISING" : "RISING",
        impact: "HIGH",
        confidence: "HIGH",
        explanation: isLow
          ? "Vessels transit Strait without delay. Cargo wait times are normal."
          : isMid
          ? "Tanker speeds reduced by 15% due to security protocols. 1-2 days transit lag."
          : "Transit restricted. Vessel routing shifted to alternative African routes.",
        icon: Ship,
      },
      {
        name: "Regional Port Congestion",
        category: "Logistics",
        status: isLow ? "POSITIVE" : isMid ? "WAIT" : "PREPARE",
        direction: isLow ? "STABLE" : isMid ? "STABLE" : "RISING",
        impact: "MEDIUM",
        confidence: "MEDIUM",
        explanation: isLow
          ? "Average berth wait times remain within normal baseline bounds."
          : isMid
          ? "Alternative offloading ports show a 2-day queue increase due to rerouting."
          : "Hub ports severely backlogged. Unloading lead times exceed 8 days.",
        icon: Anchor,
      },
      {
        name: "Freight & War-Risk Premiums",
        category: "Financial",
        status: isLow ? "WAIT" : isMid ? "ACT" : "ACT",
        direction: isLow ? "FALLING" : isMid ? "RISING" : "RISING",
        impact: "HIGH",
        confidence: "HIGH",
        explanation: isLow
          ? "Freight insurance premiums flat. Tanker rates at seasonal average."
          : isMid
          ? "War-risk surcharges increased by +120%. Spot charter rates rising +3.6% daily."
          : "Spot rates spiked +300%. Alternative routes highly congested, premiums critical.",
        icon: Activity,
      },
      {
        name: "Supplier Concentration Risk",
        category: "Sourcing",
        status: isLow ? "WAIT" : isMid ? "WAIT" : "PREPARE",
        direction: "STABLE",
        impact: "HIGH",
        confidence: "HIGH",
        explanation: isLow
          ? "Diversified contract share holds sufficient non-Hormuz fallback buffer."
          : isMid
          ? "Gulf suppliers represent 64% of crude inputs. Watch on Al-Rashid term contract."
          : "Gulf supply channels restricted. Reliance on non-Gulf domestic sources is critical.",
        icon: ShieldAlert,
      },
      {
        name: "Alternative Fleet Capacity",
        category: "Logistics",
        status: isLow ? "POSITIVE" : isMid ? "PREPARE" : "ACT",
        direction: isLow ? "STABLE" : isMid ? "FALLING" : "FALLING",
        impact: "HIGH",
        confidence: "HIGH",
        explanation: isLow
          ? "Tanker charters readily available in domestic and SE Asian markets."
          : isMid
          ? "Fast-moving competitors locking in non-Hormuz tankers. Options supply declining."
          : "Extreme tanker capacity squeeze. Alternative hulls unavailable at standard rates.",
        icon: Ship,
      },
      {
        name: "Commodity Price Volatility",
        category: "Financial",
        status: isLow ? "POSITIVE" : isMid ? "WAIT" : "ACT",
        direction: isLow ? "FALLING" : isMid ? "RISING" : "RISING",
        impact: "MEDIUM",
        confidence: "MEDIUM",
        explanation: isLow
          ? "Crude spot price spread is tight. Blending feedstocks abundant."
          : isMid
          ? "Crude volatility rising. High-sulfur feedstocks pricing in transit risks."
          : "Crude indices spike +32%. Severe product pricing pressure on refining margin.",
        icon: Activity,
      },
      {
        name: "Inventory Exposure Level",
        category: "Sourcing",
        status: isLow ? "POSITIVE" : isMid ? "WAIT" : "ACT",
        direction: "STABLE",
        impact: "CRITICAL",
        confidence: "HIGH",
        explanation: isLow
          ? "Current inventory covers 20 days throughput. Terminal farms at normal levels."
          : isMid
          ? "Runway is 20 days. Risk is high if supply stops before storage reserve OPT-4 is leased."
          : "Current inventories critically exposed. Runout projected in 9 days if transit fails.",
        icon: ShieldAlert,
      },
    ];
  };

  const indicators = getIndicators(tensionLevel);

  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case "RISING":
        return <ArrowUpRight className="h-4.5 w-4.5 text-status-act" />;
      case "FALLING":
        return <ArrowDownRight className="h-4.5 w-4.5 text-status-positive" />;
      default:
        return <Equal className="h-4.5 w-4.5 text-text-muted" />;
    }
  };

  const getImpactColor = (imp: string) => {
    switch (imp) {
      case "CRITICAL":
        return "text-status-act font-extrabold";
      case "HIGH":
        return "text-status-prepare font-bold";
      case "MEDIUM":
        return "text-text-primary font-semibold";
      default:
        return "text-text-secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Activity className="h-6 w-6 text-accent" />
            <span>Risk Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Tracking simulated supply chain security, transit delays, and financial risk variables.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="SIMULATED" label="Prototype Indicators" />
        </div>
      </div>

      {/* Interactive Tension Slider */}
      <Card title="Crisis Tension Simulator" subtitle="Slide regional tension levels to recompute all risk indicators live">
        <div className="space-y-4">
          <Slider
            label="Simulate Strait Regional Tension"
            value={tensionLevel}
            min={10}
            max={90}
            unit="/100 Tension"
            onChange={handleTensionChange}
            description="Higher tension simulates drone escalation and tanker escort requirements, compounding logistics bottleneck indexes."
          />
        </div>
      </Card>

      {/* Grid of 8 Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((ind) => {
          const Icon = ind.icon;

          return (
            <Card
              key={ind.name}
              title={ind.name}
              subtitle={ind.category}
              borderVariant={ind.status === "ACT" ? "danger" : ind.status === "PREPARE" ? "warning" : "default"}
              metaBadge={<StatusBadge status={ind.status} />}
            >
              <div className="space-y-4 flex flex-col justify-between h-[210px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1 text-xs border-b border-border-subtle/50 pb-2">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-text-muted shrink-0" />
                      Direction:
                    </span>
                    <span className="font-mono flex items-center gap-1">
                      {getDirectionIcon(ind.direction)}
                      {ind.direction}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                    {ind.explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/50 flex justify-between items-center text-xs font-mono mt-auto">
                  <div>
                    <span className="text-text-muted">Impact: </span>
                    <span className={getImpactColor(ind.impact)}>{ind.impact}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Conf: </span>
                    <span className="font-bold text-text-primary">{ind.confidence}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <ChartCaption question="How does Strait geopolitical tension feed into regional freight volatility and cargo shortfall risks?" />
    </div>
  );
}
