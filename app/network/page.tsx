"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScenario } from "@/context/ScenarioContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCaption } from "@/components/ui/ChartCaption";
import { Network, Filter, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { DEMO_NETWORK_NODES, DEMO_NETWORK_EDGES, SupplyNetworkNode } from "@/lib/demoData";

export default function SupplyNetworkPage() {
  const { suppliers } = useScenario();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("sup-1");
  const [filterHormuzOnly, setFilterHormuzOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");

  const selectedNode = DEMO_NETWORK_NODES.find((n) => n.id === selectedNodeId) || DEMO_NETWORK_NODES[0];

  const displayedNodes = filterHormuzOnly
    ? DEMO_NETWORK_NODES.filter((n) => n.hormuzDependent || n.id === "company")
    : DEMO_NETWORK_NODES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Network className="h-6 w-6 text-accent" />
            <span>Supply Network & Physical Dependency Map</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Visualizing physical concentration of crude imports across Persian Gulf choke points and alternative routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "graph" ? "table" : "graph")}
          >
            {viewMode === "graph" ? "Switch to Table View" : "Switch to Graph View"}
          </Button>
          <Button
            variant={filterHormuzOnly ? "primary" : "secondary"}
            size="sm"
            icon={<Filter className="h-3.5 w-3.5" />}
            onClick={() => setFilterHormuzOnly(!filterHormuzOnly)}
          >
            {filterHormuzOnly ? "Showing Hormuz Only" : "Filter Hormuz Only"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Dependency Visualizer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card
            title="Interactive Network Dependency Graph"
            subtitle="Click any supplier, route, or storage node to inspect concentration exposure"
            metaBadge={
              <span className="text-xs font-mono text-status-act bg-status-act/10 px-2.5 py-0.5 rounded border border-status-act/30">
                64% Hormuz Dependent
              </span>
            }
          >
            {viewMode === "graph" ? (
              <div className="relative w-full min-h-[420px] bg-bg-primary rounded-xl border border-border-subtle p-6 overflow-hidden flex flex-col justify-between">
                {/* Visual SVG Connections Background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-border-subtle/60 stroke-[1.5]">
                  <line x1="20%" y1="20%" x2="50%" y2="35%" stroke="#D9534F" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="20%" y1="50%" x2="50%" y2="35%" stroke="#D9534F" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="20%" y1="80%" x2="50%" y2="70%" stroke="#3FB27F" strokeWidth="1.5" />
                  <line x1="50%" y1="35%" x2="80%" y2="50%" stroke="#D9534F" strokeWidth="2.5" />
                  <line x1="50%" y1="70%" x2="80%" y2="50%" stroke="#3E7BFA" strokeWidth="1.5" />
                </svg>

                {/* Layer 1: Suppliers */}
                <div className="relative z-10 space-y-3 w-48">
                  <div className="text-[10px] font-mono text-text-muted uppercase">Suppliers (Origin)</div>
                  {displayedNodes.filter((n) => n.type === "supplier").map((n) => (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNodeId(n.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedNodeId === n.id
                          ? "border-accent bg-accent/15 shadow-md"
                          : n.hormuzDependent
                          ? "border-status-act/60 bg-status-act/10 hover:border-status-act"
                          : "border-border-subtle bg-bg-tertiary hover:border-slate-600"
                      }`}
                    >
                      <div className="font-semibold text-text-primary flex items-center justify-between">
                        <span>{n.label}</span>
                        {n.hormuzDependent && <span className="h-2 w-2 rounded-full bg-status-act animate-pulse" />}
                      </div>
                      <div className="text-[10px] font-mono text-text-muted mt-1">{n.regionOrMode}</div>
                    </div>
                  ))}
                </div>

                {/* Layer 2: Corridors & Storage */}
                <div className="relative z-10 flex justify-center gap-6 w-full my-6">
                  {displayedNodes.filter((n) => n.type === "route" || n.type === "storage").map((n) => (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNodeId(n.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all max-w-[200px] ${
                        selectedNodeId === n.id
                          ? "border-accent bg-accent/15"
                          : n.hormuzDependent
                          ? "border-status-act/60 bg-status-act/10"
                          : "border-border-subtle bg-bg-tertiary"
                      }`}
                    >
                      <div className="font-semibold text-text-primary text-center">{n.label}</div>
                      <div className="text-[10px] font-mono text-text-muted text-center mt-1">{n.regionOrMode}</div>
                    </div>
                  ))}
                </div>

                {/* Layer 3: Aurelia Destination */}
                <div className="relative z-10 flex justify-end">
                  <div
                    onClick={() => setSelectedNodeId("company")}
                    className="p-4 rounded-xl border-2 border-accent bg-accent/10 text-center cursor-pointer shadow-lg w-56"
                  >
                    <div className="font-bold text-sm text-text-primary">Aurelia Energy Hub</div>
                    <div className="text-[10px] font-mono text-accent mt-1">Daily Throughput: 180,000 bbl</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Accessible Table Fallback */
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-bg-tertiary text-text-muted uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Node Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Hormuz Dependent</th>
                      <th className="p-3">Volume Share</th>
                      <th className="p-3">Region / Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-mono">
                    {displayedNodes.map((n) => (
                      <tr
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className="hover:bg-bg-tertiary/50 cursor-pointer"
                      >
                        <td className="p-3 font-semibold text-text-primary">{n.label}</td>
                        <td className="p-3 uppercase text-text-secondary">{n.type}</td>
                        <td className="p-3">
                          {n.hormuzDependent ? (
                            <span className="text-status-act font-bold">YES (HIGH RISK)</span>
                          ) : (
                            <span className="text-status-positive">NO</span>
                          )}
                        </td>
                        <td className="p-3">{n.volumeSharePct ? `${n.volumeSharePct}%` : "N/A"}</td>
                        <td className="p-3 text-text-secondary">{n.regionOrMode || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <ChartCaption question="Where are Aurelia Energy's physical supply dependencies and chokepoint vulnerabilities concentrated?" />
          </Card>
        </div>

        {/* Node Inspector Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Node Detail Inspector" subtitle="Selected network component parameters">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-bg-tertiary border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text-primary">{selectedNode.label}</h3>
                  <StatusBadge status={selectedNode.hormuzDependent ? "ACT" : "POSITIVE"} label={selectedNode.hormuzDependent ? "Hormuz Vulnerable" : "Non-Hormuz"} />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-text-secondary">
                    <span>Node Type:</span>
                    <span className="font-mono font-semibold text-text-primary uppercase">{selectedNode.type}</span>
                  </div>
                  {selectedNode.volumeSharePct && (
                    <div className="flex justify-between text-text-secondary">
                      <span>Input Volume Share:</span>
                      <span className="font-mono font-bold text-accent">{selectedNode.volumeSharePct}% of total</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Region / Operating Mode:</span>
                    <span className="font-mono text-text-primary">{selectedNode.regionOrMode || "Gulf Terminal"}</span>
                  </div>
                </div>
              </div>

              {selectedNode.hormuzDependent && (
                <div className="p-3.5 rounded-lg bg-status-act/10 border border-status-act/30 space-y-2 text-xs">
                  <div className="font-semibold text-status-act flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Concentration Vulnerability</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    This node requires passage through the Strait of Hormuz. Sustained disruption will interrupt this volume stream within 10–14 days.
                  </p>
                </div>
              )}

              <Link href="/simulator">
                <Button variant="primary" size="md" className="w-full justify-between" icon={<ArrowRight className="h-4 w-4" />}>
                  <span>Diversify This Dependency</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
