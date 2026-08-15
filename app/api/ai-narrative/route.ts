import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { riskLevel, durationDays, posture, selectedOptions, totalCost, resilienceScore, targetScore } = body;

    // Check if optional Anthropic API key is available in environment
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 500,
            messages: [
              {
                role: "user",
                content: `You are NEXUS AI Risk Synthesis Engine for Meridian Fuels.
Current Strait Risk Level: ${riskLevel}/100.
Assumed Disruption Horizon: ${durationDays} days.
Current Posture: ${posture}.
Selected Actions: ${selectedOptions?.join(", ") || "None"}.
Resilience Score: ${resilienceScore}/100 (Target: ${targetScore}/100).
Total Capital Required: $${(totalCost / 1000000).toFixed(2)}M.

Provide a 3-bullet executive AI Risk Brief summarizing:
1. Primary risk acceleration factor
2. Option decay impact on Meridian Fuels
3. Recommended posture action.

Keep tone enterprise-credible, precise, and concise.`,
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.content?.[0]?.text;
          if (text) {
            return NextResponse.json({ narrative: text, source: "anthropic-claude" });
          }
        }
      } catch (err) {
        console.warn("Anthropic API call failed, falling back to deterministic synthesis engine:", err);
      }
    }

    // Deterministic fallback response when ANTHROPIC_API_KEY is not configured
    const isHighRisk = riskLevel >= 65;
    const isSustained = durationDays >= 60;

    const bullet1 = `Strait Transit Disruption Index is at ${riskLevel}/100 (${isHighRisk ? "Acute Risk Zone" : "Moderate Risk Alert"}). Spot charter rates on non-Hormuz routes are escalating at +${(1.8 * (1 + (riskLevel/100)*1.5)).toFixed(1)}%/day.`;
    const bullet2 = `Assumed ${durationDays}-day disruption horizon ${isSustained ? "compounds market tightness past day 60, making 'Reserve Transport' the binding constraint." : "allows moderate operational flexibility across domestic rail corridors."}`;
    const bullet3 = `Executing the selected portfolio (${selectedOptions?.length || 0} actions) achieves ${resilienceScore}/100 resilience score at $${((totalCost || 0) / 1000000).toFixed(2)}M spend, protecting $${((resilienceScore - 35) * 1.288 * 0.45).toFixed(2)}M in annual contract penalties.`;

    const summaryText = `Simulated intelligence synthesis for Meridian Fuels: ${riskLevel}/100 Strait risk level with ${durationDays}-day disruption assumption indicates ${posture} posture.`;

    return NextResponse.json({
      summary: summaryText,
      bullets: [bullet1, bullet2, bullet3],
      source: "nexus-engine-deterministic",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate AI narrative" }, { status: 500 });
  }
}
