import React from "react";
import { clsx } from "clsx";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
  variant?: "warning" | "error" | "success" | "info";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "warning",
  title,
  children,
  className,
}) => {
  const styles = {
    warning: "border-l-4 border-status-prepare bg-bg-tertiary text-text-primary",
    error: "border-l-4 border-status-act bg-bg-tertiary text-text-primary",
    success: "border-l-4 border-status-positive bg-bg-tertiary text-text-primary",
    info: "border-l-4 border-accent bg-bg-tertiary text-text-primary",
  };

  const icons = {
    warning: <AlertTriangle className="h-4 w-4 text-status-prepare shrink-0 mt-0.5" />,
    error: <XCircle className="h-4 w-4 text-status-act shrink-0 mt-0.5" />,
    success: <CheckCircle className="h-4 w-4 text-status-positive shrink-0 mt-0.5" />,
    info: <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />,
  };

  return (
    <div className={clsx("p-3.5 rounded-r-lg flex items-start gap-3 text-xs leading-relaxed border border-border-subtle/40", styles[variant], className)}>
      {icons[variant]}
      <div className="flex-1">
        {title && <h4 className="font-semibold text-text-primary mb-1 text-xs">{title}</h4>}
        <div className="text-text-secondary">{children}</div>
      </div>
    </div>
  );
};
