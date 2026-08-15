import React from "react";
import { clsx } from "clsx";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  description?: string;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  description,
  valueFormatter,
  className,
}) => {
  const displayVal = valueFormatter ? valueFormatter(value) : `${value}${unit}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-primary tracking-wide">{label}</label>
        <span className="font-mono text-xs font-bold text-accent bg-bg-tertiary px-2 py-0.5 rounded border border-border-subtle">
          {displayVal}
        </span>
      </div>
      {description && <p className="text-[11px] text-text-muted">{description}</p>}
      <div className="relative flex items-center h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={displayVal}
          style={{
            background: `linear-gradient(to right, #3E7BFA 0%, #3E7BFA ${percentage}%, #1A1F2B ${percentage}%, #1A1F2B 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
