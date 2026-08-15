import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20 active:scale-[0.98]",
    secondary: "bg-bg-tertiary text-text-primary hover:bg-slate-700 border border-border-subtle hover:border-slate-500",
    destructive: "border border-status-act/70 text-status-act hover:bg-status-act/10 active:bg-status-act active:text-white",
    ghost: "bg-transparent text-accent hover:bg-accent/10 hover:text-accent-hover",
    outline: "border border-border-subtle bg-transparent text-text-primary hover:bg-bg-tertiary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium gap-1.5 h-8",
    md: "px-4 py-2 text-sm font-semibold gap-2 h-10",
    lg: "px-5 py-2.5 text-base font-semibold gap-2.5 h-12",
  };

  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
