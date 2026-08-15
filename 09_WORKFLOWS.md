# 09_WORKFLOWS.md

## Workflow 1 — Risk Escalation → Decision Window → Recommendation

**Trigger:** User increases Risk Level (on Decision Window page or Scenario Simulator).
**Steps:**
1. User drags Risk Level slider from 55 → 75.
2. Engine recomputes `effectiveGrowthRate` and `effectiveDaysUntilImpractical` for all 6 options (07 §1).
3. Decision Window timeline (Screen 2) visibly compresses; at least one lane's bar shortens noticeably.
4. Aggregate Decision Window countdown (top bar + Overview) updates, e.g., 18 days → 11 days.
5. Recommendation Engine re-runs the brute-force search (07 §5) against the new cost curves; if the previously recommended set no longer clears the threshold at the new decay rate, a new (likely more expensive, more urgent) recommendation is produced.
6. Overview posture badge may transition WAIT → PREPARE or PREPARE → ACT.
**Outcome:** user sees, causally and immediately, that rising risk shrinks their runway and changes what they should do.

## Workflow 2 — Scenario Simulation → Strategy Comparison → Action

**Trigger:** User builds and saves 2–3 strategies in Scenario Simulator.
**Steps:**
1. User selects Stockpile + Reserve Storage, saves as "Conservative Plan."
2. User clears selections, selects Diversify Supplier + Reserve Transport, saves as "Aggressive Diversification."
3. User navigates to AI Insights → Strategy Comparison.
4. Table ranks both saved scenarios by `protectionEfficiency` (07 §9).
5. User clicks "Promote to Recommendation" on the higher-ranked scenario.
6. Redirects to Action Center with that scenario pre-loaded as the active recommendation, state = Recommended.
**Outcome:** structured, side-by-side comparison replaces gut-feel choice between strategies.

## Workflow 3 — Cost of Waiting → Executive Decision

**Trigger:** CFO persona opens Cost of Waiting screen.
**Steps:**
1. Four comparison cards render (Act Now / Wait 3 / 7 / 14) using current `ScenarioState`.
2. CFO drags the custom-wait slider to day 5 to check an intermediate point relevant to an internal approval-meeting timeline.
3. Net outcome for day 5 renders in the fifth card, interpolated from the same curve.
4. CFO clicks "Lock in Act Now plan" → Scenario Simulator opens pre-loaded with the Act Now action set for final review before approval.
**Outcome:** the financial argument for urgency is self-contained and doesn't require the CFO to trust a black-box score — every number traces to the same visible curve.

## Workflow 4 — Resilience Assessment → Vulnerability → Improvement Plan

**Trigger:** Risk Manager reviews Resilience screen.
**Steps:**
1. Screen shows Resilience Score breakdown; Supplier Concentration is lowest factor value.
2. "Top Vulnerability: Supplier Concentration" callout renders with an Improvement Plan card: "Diversify Supplier (OPT-2) would raise this factor by an estimated +28 pts."
3. User clicks "Address Top Vulnerability" → Scenario Simulator opens with Diversify Supplier pre-selected and the resulting score/cost visible immediately.
**Outcome:** vulnerability identification and remediation are one click apart, not two separate mental exercises.

## Workflow 5 — AI Recommendation → Explanation → Approval → Action

**Trigger:** A recommendation exists in `RecommendationState` (either from initial load or Workflow 2/4).
**Steps:**
1. User opens Action Center; recommendation card shows state = Recommended.
2. User expands "Why / What changed / Assumptions" (07 §6) — required before Approve is enabled (04 Screen 8, AC4).
3. User clicks Approve → state transitions to Approved, `DecisionLogEntry` appended with timestamp and actor "User (COO role)."
4. User clicks "Mark Executed" (simulated) → state transitions to Executed, second log entry appended.
5. If the user had changed any `ScenarioState` input between Approve and Execute, the system instead shows "Assumptions changed since approval — recommend re-review" and blocks direct execution until re-approved.
**Outcome:** the governance pattern required by the challenge (AI recommends, human approves) is enforced structurally, not just described.

## Workflow 6 — "What if Hormuz remains unavailable for 90 days?"

**Trigger:** Deep-dive scenario, the canonical demo question.
**Steps:**
1. User sets Disruption Duration Assumption = 90 days in Scenario Simulator.
2. `expectedLossExposure` recalculates using the longer horizon (07 §4), increasing meaningfully vs. the 45-day baseline.
3. Decision Window and option decay curves recompute (duration assumption feeds into how aggressively the model treats persistent risk — configured as a secondary multiplier on `riskMultiplier(R)` when `disruptionDurationAssumptionDays` exceeds 60, reflecting that sustained disruption compounds market tightness beyond the raw risk-level effect).
4. Recommendation Engine re-optimizes; typically produces a higher-cost, higher-resilience recommended set than the baseline, since the 90-day exposure justifies more upfront spend.
5. User visits AI Insights → Counterfactual, which narrates the 90-day outcome explicitly.
6. User visits Reports to see the 90-day scenario summarized in board-ready form.
**Outcome:** this workflow is the single best "wow" path for the demo video — it shows the entire system responding coherently to one meaningful assumption change.
