"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Clock,
  CircleDollarSign,
  Sliders,
  ShieldCheck,
  Network,
  Layers,
  Award,
  Activity,
  FileText,
  Settings,
  Flame,
  ChevronRight,
} from "lucide-react";

export function NavRail() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/decision-window", label: "Decision Window", icon: Clock },
    { href: "/cost-of-waiting", label: "Cost of Waiting", icon: CircleDollarSign },
    { href: "/simulator", label: "Scenarios", icon: Sliders },
    { href: "/resilience", label: "Resilience", icon: ShieldCheck },
    { href: "/network", label: "Supply Network", icon: Network },
    { href: "/options", label: "Options", icon: Layers },
    { href: "/recommendations", label: "Recommendations", icon: Award },
    { href: "/risk-intelligence", label: "Risk Intelligence", icon: Activity },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-60 bg-bg-secondary border-r border-border-subtle flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 z-30">
      <div className="p-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-border-subtle/60">
          <div className="h-9 w-9 rounded-lg bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-[0_0_12px_rgba(62,123,250,0.3)]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono font-extrabold text-base tracking-wider text-text-primary flex items-center gap-1">
              NEXUS <span className="text-[10px] font-sans font-normal text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/30">DECISION</span>
            </h1>
            <p className="text-[11px] text-text-muted font-mono">Aurelia Energy Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group relative",
                  isActive
                    ? "text-text-primary bg-bg-tertiary font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-accent rounded-r" />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-accent opacity-70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Context Info */}
      <div className="p-4 border-t border-border-subtle/60 bg-bg-primary/40">
        <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono mb-1">
          <span className="h-2 w-2 rounded-full bg-status-positive animate-pulse" />
          <span>Simulation Active</span>
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed">
          Strait of Hormuz Disruption Scenario · Prototype V1.0
        </p>
      </div>
    </aside>
  );
}
