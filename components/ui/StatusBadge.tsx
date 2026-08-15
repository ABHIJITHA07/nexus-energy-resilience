import React from "react";
import { clsx } from "clsx";

interface StatusBadgeProps {
  status: "WAIT" | "PREPARE" | "ACT" | "POSITIVE" | "NEGATIVE" | "SIMULATED" | "NEUTRAL";
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "md",
  className,
}) => {
  const styles = {
    WAIT: "bg-status-wait/15 text-status-wait border-status-wait/30",
    PREPARE: "bg-status-prepare/15 text-status-prepare border-status-prepare/30",
    ACT: "bg-status-act/15 text-status-act border-status-act/30",
    POSITIVE: "bg-status-positive/15 text-status-positive border-status-positive/30",
    NEGATIVE: "bg-status-negative/15 text-status-negative border-status-negative/30",
    SIMULATED: "bg-slate-800 text-text-secondary border-slate-700",
    NEUTRAL: "bg-slate-800 text-text-primary border-slate-700",
  };

  const dots = {
    WAIT: "bg-status-wait",
    PREPARE: "bg-status-prepare animate-pulse",
    ACT: "bg-status-act animate-ping",
    POSITIVE: "bg-status-positive",
    NEGATIVE: "bg-status-negative",
    SIMULATED: "bg-slate-400",
    NEUTRAL: "bg-text-secondary",
  };

  const textLabel = label || status;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider rounded-full border px-2.5 py-0.5",
        size === "sm" ? "text-[10px] leading-3" : "text-xs leading-4",
        styles[status],
        className
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", dots[status])} />
      <span>{textLabel}</span>
    </span>
  );
};
