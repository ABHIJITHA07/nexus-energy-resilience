import React from "react";
import { HelpCircle } from "lucide-react";

interface ChartCaptionProps {
  question: string;
  onToggleTable?: () => void;
  showTable?: boolean;
}

export const ChartCaption: React.FC<ChartCaptionProps> = ({
  question,
  onToggleTable,
  showTable,
}) => {
  return (
    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/40 text-[11px] text-text-secondary font-mono">
      <div className="flex items-center gap-1.5">
        <HelpCircle className="h-3.5 w-3.5 text-accent shrink-0" />
        <span>Answers: <strong className="text-text-primary font-normal">{question}</strong></span>
      </div>
      {onToggleTable && (
        <button
          onClick={onToggleTable}
          className="text-accent hover:underline text-[11px] font-sans font-medium focus:outline-none"
        >
          {showTable ? "View Chart" : "View as Table"}
        </button>
      )}
    </div>
  );
};
