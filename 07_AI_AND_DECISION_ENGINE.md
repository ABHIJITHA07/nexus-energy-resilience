# 07_AI_AND_DECISION_ENGINE.md

## Design Stance on "AI"

NEXUS does not use AI to predict geopolitical events, and the prototype must never imply otherwise. This document distinguishes two layers:

1. **The Decision Engine** — a fully deterministic, inspectable set of formulas (below). This is the credible, defensible core. It is not "AI" in the marketing sense; it is applied decision science (option decay + weighted scoring + constrained optimization), and it is what makes the product's numbers trustworthy rather than hand-waved.
2. **The AI Layer** — a natural-language synthesis layer that reads the Decision Engine's outputs and produces the Risk Brief, Counterfactual narrative, Strategy Comparison ranking, and recommendation rationale text. In the prototype this can be implemented either as deterministic templated generation (recommended default, since it guarantees consistency with the numbers) or, optionally, by calling the Anthropic API with the engine's structured output as context (see `anthropic_api_in_artifacts` capability) to phrase the narrative — but the underlying numbers must always come from the deterministic engine, never be invented by the language model. This is the "AI is genuinely useful, not decorative" line: AI explains and compares, it does not calculate or predict.

## 1. Option Decay Model

For each `ResilienceOption`, cost at day `t` under current risk level `R` (0–100):

```
riskMultiplier(R) = 1 + (R / 100) * 1.5
effectiveGrowthRate = baseCostGrowthRatePctPerDay * riskMultiplier(R)
cost(t) = baseCostUsd * (1 + effectiveGrowthRate/100) ^ t
effectiveDaysUntilImpractical = round(daysUntilImpractical / riskMultiplier(R))
```

An option is "impractical" (treated as unavailable, grayed out) once `t ≥ effectiveDaysUntilImpractical`.

**Rationale:** higher risk doesn't just make things scarier — it concretely compresses the window and steepens the cost curve, because everyone else in the market is reacting to the same risk simultaneously (competing for the same charters, storage, and suppliers). This is the mechanism that makes "cost of waiting" real rather than asserted.

## 2. Decision Window (Aggregate)

Given the current `selectedActionIds` needed to reach the target Resilience Score (or, if none selected, the *recommended* set), the aggregate Decision Window is:

```
DecisionWindowDays = min(effectiveDaysUntilImpractical for each required option)
```

i.e., the aggregate window is bounded by whichever *necessary* option decays fastest — you're only as un-rushed as your most time-sensitive required action. This is displayed as the headline countdown.

## 3. Resilience Score

```
ResilienceScore = Σ ( factorWeight_i * factorValue_i )   for i in ResilienceFactor[]
```

Each `factorValue_i` (0–100) is derived from underlying state:

- **Supplier Concentration** value = `100 - (topSupplierVolumeSharePct scaled)`; diversifying suppliers raises it.
- **Inventory Runway** value = `min(100, (currentInventoryKb / dailyConsumptionKb) / targetRunwayDays * 100)`.
- **Transport Flexibility** value = `100 * (nonHormuzRouteCapacity available / totalRequiredCapacity)`.
- **Storage Buffer** value = `100 * (activatable storage capacity / targetBufferKb)`.
- **Demand Flexibility** value = `100 * (reducible non-critical demand % / totalDemand)`.

When the user selects actions in Strategy Builder, each selected action moves its associated factor value(s) toward 100 by an amount equal to `resilienceContribution`, **with diminishing returns** when multiple actions affect the same factor:

```
combinedContribution = 1 - Π(1 - contribution_i/100)   for all selected actions affecting that factor
```

This multiplicative (not additive) combination is what produces the "selecting all 6 actions doesn't give a linear/absurd score" behavior required in acceptance criteria — it mirrors real diminishing returns (e.g., diversifying suppliers AND reserving transport both improve deliverability, but there's overlap in what risk they cover).

## 4. Cost of Waiting

For a wait horizon `d` (0, 3, 7, or 14 days):

```
preparationCost(d) = Σ cost(t = currentDay + d) for each option in the recommended set
                       // i.e., what it would cost to execute the SAME plan, d days later

expectedLossExposure(d) = dailyRevenueAtRiskUsd * probabilityWeightedDaysOfShortfall(d, R)
   where probabilityWeightedDaysOfShortfall scales with riskLevel R and disruptionDurationAssumption,
   representing simulated expected shortfall days if the company remains under-prepared during the wait.

netOutcome(d) = preparationCost(d) + expectedLossExposure(d) - preparationCost(0)
```

`dailyRevenueAtRiskUsd` = Company annual revenue × hormuzExposurePct ÷ 365 × a configurable shortfall-severity factor (default 35%, reflecting that a disruption reduces but does not necessarily zero out throughput). All of this is transparently shown in the "Assumptions used" panel — never hidden.

## 5. Recommendation Engine (Constrained Optimization)

**Objective:** find the subset of `ResilienceOption`s that minimizes total cost subject to `ResilienceScore ≥ targetThreshold` and `totalCost ≤ budgetCapUsd` (if a budget is set; otherwise budget is treated as a soft constraint shown as a warning, not a hard block).

This is a small, bounded combinatorial problem (6 options → 63 non-empty subsets), so the prototype computes it by **brute-force enumeration** each time inputs change — genuinely exhaustive, genuinely correct, not a black box:

```
for each non-empty subset S of the 6 ResilienceOptions:
    cost(S) = Σ cost(t=0) for options in S
    score(S) = ResilienceScore with S selected (per formula #3)
    if score(S) >= targetThreshold:
        candidate(S)
recommendation = argmin(cost(S)) over all candidates
if no candidate clears targetThreshold:
    recommendation = the single highest-score-per-dollar subset found,
    flagged "Target not fully reachable within current constraints — closest option shown"
```

This guarantees: the Recommendation Engine's suggestion, if manually selected in Strategy Builder, reproduces the exact same Resilience Score and Cost (Acceptance Criteria AC3).

## 6. Explainability Requirements (per recommendation)

Every recommendation renders three fixed sections, generated from the optimization trace itself (not free text):

- **Why:** "This combination reaches a Resilience Score of {score}/{target} at the lowest cost (${cost}) of all {N} combinations evaluated that clear the threshold."
- **What changed:** a diff against the previous computed recommendation — e.g., "Risk level rose from 45 to 62, which shortened the Reserve Transport window from 14 to 9 days and made it the binding constraint on your Decision Window."
- **Assumptions used:** explicit list — current risk level, disruption duration assumption, target threshold, budget cap, and the shortfall-severity factor used in loss exposure.

## 7. AI Risk Brief (narrative synthesis)

Deterministically generated from a diff of current vs. previous `RiskIndicator` and `ScenarioState` values:

```
Template: "Since your last review: {riskIndicatorName} moved from {old} to {new} ({trend}).
This {increased/decreased} the effective decay rate on {mostAffectedOption} by {X%},
{shortening/lengthening} its window by {Y} days."
```
Always ends with the fixed disclosure line: *"Simulated indicators for prototype purposes — not a live geopolitical feed."*

## 8. AI Counterfactual

Directly reuses the Cost of Waiting engine (#4) for arbitrary `d`, phrased as narrative: *"If you wait {d} days, preparation cost rises to ${cost}, and expected exposure grows to ${loss} — a net difference of ${delta} versus acting today."*

## 9. AI Strategy Comparison

Ranks all `savedScenarios` (from Strategy Builder "Save Scenario") by:
```
protectionEfficiency = potentialLossAvoidedUsd / totalCostUsd
```
Table shows scenario name, cost, resilience score, loss avoided, and efficiency ratio, sorted descending — directly actionable, not a vague "AI says."

## 10. Human-in-the-Loop Guarantee

The Decision Engine and AI Layer **only ever produce a recommendation state**. No code path allows a transition to `Executed` without a preceding user-initiated `Approved` transition logged with a timestamp and actor. This is enforced in UI state (buttons conditionally disabled) as specified in 04_UX_SPECIFICATION.md Screen 8.
