import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  metaBadge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  borderVariant?: "default" | "active" | "warning" | "danger" | "success";
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  metaBadge,
  headerAction,
  children,
  className,
  borderVariant = "default",
  ...props
}) => {
  const borderClasses = {
    default: "border-border-subtle hover:border-slate-700",
    active: "border-accent shadow-[0_0_15px_rgba(62,123,250,0.15)]",
    warning: "border-status-prepare/70 shadow-[0_0_15px_rgba(224,163,44,0.15)]",
    danger: "border-status-act/70 shadow-[0_0_15px_rgba(217,83,79,0.15)]",
    success: "border-status-positive/70 shadow-[0_0_15px_rgba(63,178,127,0.15)]",
  };

  return (
    <div
      className={clsx(
        "bg-bg-secondary rounded-xl border p-5 transition-all duration-200 backdrop-blur-sm",
        borderClasses[borderVariant],
        className
      )}
      {...props}
    >
      {(title || metaBadge || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle/60">
          <div>
            {title && <h3 className="text-base font-semibold text-text-primary tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {metaBadge}
            {headerAction}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
