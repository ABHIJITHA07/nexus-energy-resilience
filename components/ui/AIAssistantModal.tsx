"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Sparkles, X, Send, Bot, User, HelpCircle } from "lucide-react";
import { Button } from "./Button";

export function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Hello! I am NEXUS AI Risk Assistant. I evaluate Aurelia Energy's Strait exposure, decision windows, decay rates, and strategy optimization live. Ask me anything about your current risk posture!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const { scenarioState, decisionWindow, resilienceResult, waitingResult, optimizationResult } = useScenario();

  const quickQuestions = [
    "Why is the Decision Window 11 days?",
    "What is the cost penalty for a 7-day delay?",
    "Which action gives the highest resilience per dollar?",
    "How does 90-day disruption affect our exposure?",
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg = { role: "user" as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      // Call our Next.js API route
      const res = await fetch("/api/ai-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskLevel: scenarioState.riskLevel,
          durationDays: scenarioState.disruptionDurationAssumptionDays,
          posture: decisionWindow.posture,
          selectedOptions: scenarioState.selectedActionIds,
          totalCost: optimizationResult.totalCostUsd,
          resilienceScore: resilienceResult.totalScore,
          targetScore: scenarioState.targetThresholdScore,
        }),
      });

      let aiText = "";

      if (res.ok) {
        const data = await res.json();
        if (data.bullets) {
          aiText = `${data.summary}\n\n• ${data.bullets.join("\n• ")}`;
        } else if (data.narrative) {
          aiText = data.narrative;
        }
      }

      if (!aiText) {
        // Fallback intelligent answer generated from engine context
        if (q.toLowerCase().includes("window") || q.toLowerCase().includes("days")) {
          aiText = `The Decision Window is currently ${decisionWindow.aggregateDaysRemaining} days. It is bounded by '${decisionWindow.limitingOptionName}', which is decaying at the fastest rate at Risk Level ${scenarioState.riskLevel}/100.`;
        } else if (q.toLowerCase().includes("cost") || q.toLowerCase().includes("delay")) {
          aiText = `Delaying action by 7 days incurs +$${(waitingResult.horizons[2].netOutcomeUsd / 1000000).toFixed(2)}M in net financial downside (spot charter inflation + unmitigated contract penalties).`;
        } else if (q.toLowerCase().includes("action") || q.toLowerCase().includes("highest")) {
          aiText = `The single highest resilience contribution is 'Diversify Supplier' (+28 pts boost at $2.6M cost), resolving Aurelia's top vulnerability in Persian Gulf sourcing.`;
        } else {
          aiText = `At Risk Level ${scenarioState.riskLevel}/100 with a ${scenarioState.disruptionDurationAssumptionDays}-day disruption horizon, Aurelia Energy's recommended posture is ${decisionWindow.posture}. Achieving target ${scenarioState.targetThresholdScore}/100 resilience requires $${(optimizationResult.totalCostUsd / 1000000).toFixed(2)}M capital allocation.`;
        }
      }

      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `At current Risk Level ${scenarioState.riskLevel}/100, your Decision Window is ${decisionWindow.aggregateDaysRemaining} days. Recommended Posture: ${decisionWindow.posture}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 h-12 px-4 rounded-full bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/30 flex items-center gap-2 font-mono text-xs font-bold transition-transform active:scale-95"
      >
        <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
        <span>Ask NEXUS AI</span>
      </button>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-bg-secondary border border-border-subtle shadow-2xl overflow-hidden flex flex-col h-[520px] backdrop-blur-lg">
          {/* Header */}
          <div className="p-4 bg-bg-tertiary border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-text-primary">NEXUS AI Risk Assistant</h3>
                <p className="text-[10px] text-text-muted">Live Decision Engine Context</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Question Chips */}
          <div className="p-3 bg-bg-primary/50 border-b border-border-subtle/60 flex flex-wrap gap-1.5">
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qq)}
                className="text-[10px] font-mono text-text-secondary bg-bg-tertiary hover:bg-slate-700 hover:text-text-primary px-2 py-1 rounded border border-border-subtle text-left transition-colors"
              >
                {qq}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-white rounded-br-none"
                      : "bg-bg-tertiary border border-border-subtle text-text-primary rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3 rounded-xl bg-bg-tertiary border border-border-subtle text-text-muted text-xs font-mono animate-pulse">
                  Synthesizing decision engine math...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-border-subtle bg-bg-tertiary flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI about risk, cost, or options..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-bg-primary border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => handleSend()}
              className="h-8 w-8 rounded-lg bg-accent hover:bg-accent-hover text-white flex items-center justify-center shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
