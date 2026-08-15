# 04_UX_SPECIFICATION.md

Each screen is specified with: Goal, Primary user, Key information, Main components, Main action, Secondary actions, Data shown, Interactions, Edge cases, and the 10-second takeaway.

---

## Screen 1 — Overview (`/`)

1. **Goal:** Give any user, in 10 seconds, the current situation and what to do about it.
2. **Primary user:** COO / Chief Supply Chain Executive.
3. **Key information:** Decision Window (days), Resilience Score, current posture (WAIT/PREPARE/ACT), Hormuz exposure %, top vulnerability, recommended next action.
4. **Main components:** Hero status card (posture badge + countdown), Exposure summary card, Resilience Score gauge, "Top Vulnerability" callout, Recommended Action card with "Review" button, mini Cost-of-Waiting sparkline.
5. **Main action:** "Review Recommendation" → Action Center.
6. **Secondary actions:** "Adjust Scenario" → Scenario Simulator; "See why" → AI Insights.
7. **Data shown:** Current global scenario snapshot (see 06_DATA_MODEL.md `ScenarioState`).
8. **Interactions:** Hovering the countdown shows the underlying option-window breakdown as a tooltip; posture badge color reflects state (WAIT=blue, PREPARE=amber, ACT=red).
9. **Edge cases:** If Decision Window ≤ 2 days, hero card switches to an urgent visual treatment (still calm, not alarmist — deep amber, not flashing) and the Main action label changes to "Act Now — Review Recommendation." If no scenario has been customized yet, show the default baseline scenario clearly labeled "Baseline (default assumptions)."
10. **10-second understanding:** "We have N days before our cheapest options disappear, our resilience is X/100, and the recommended move is Y."

---

## Screen 2 — Decision Window (`/decision-window`)

1. **Goal:** Make the shrinking of options visible and concrete.
2. **Primary user:** COO; secondary: Logistics Manager.
3. **Key information:** Per-option remaining viability window (days) and cost trajectory; aggregate Decision Window.
4. **Main components:** Horizontal timeline chart with one lane per option (Stockpile, Alt-Supplier, Reserve Transport, Reserve Storage, Pre-position Inventory, Demand Reduction), each lane showing a shrinking bar from "cheap/available" to "impractical"; a vertical "today" marker; an aggregate countdown card.
5. **Main action:** "Simulate a different duration/risk" → deep-links to Scenario Simulator with duration/risk pre-focused.
6. **Secondary actions:** Toggle "Show cost overlay" to switch each lane between availability-only and cost-over-time view.
7. **Data shown:** `OptionDecayCurve[]` per option (see data model), each with `daysRemaining`, `currentCostMultiplier`, `impracticalThreshold`.
8. **Interactions:** Clicking a lane expands it to show the underlying decay curve chart (cost multiplier vs. days) with the current point marked; changing risk level (control on this page, mirrored from global state) recomputes all lanes live.
9. **Edge cases:** If an option has already crossed its impractical threshold, its lane is shown grayed out with a "No longer viable at reasonable cost" label rather than removed (removing it would hide the story of decay).
10. **10-second understanding:** "These are our options, and here is how fast each one is disappearing."

---

## Screen 3 — Cost of Waiting (`/cost-of-waiting`)

1. **Goal:** Turn "waiting" into a financial decision.
2. **Primary user:** CFO; secondary: COO.
3. **Key information:** Four-way comparison — Act Now / Wait 3 / Wait 7 / Wait 14 — each with preparation cost, expected loss exposure, and net outcome.
4. **Main components:** Four comparison cards in a row (stack on mobile); a cost-of-waiting curve chart (net cost vs. days delayed); a "breakeven" marker showing the day beyond which waiting becomes net-negative.
5. **Main action:** "Lock in Act Now plan" → Scenario Simulator pre-loaded with the Act Now action set.
6. **Secondary actions:** Toggle between "Expected value" and "Worst case" framing for the loss exposure figure.
7. **Data shown:** `WaitingComparison[]` (4 entries) derived from the scenario engine.
8. **Interactions:** Dragging a slider under the chart to any day between 0–14 updates a "custom wait" fifth card in real time.
9. **Edge cases:** If Act Now is already the cheapest option at all four horizons, the breakeven marker is shown at day 0 with the label "Waiting has no financial upside in this scenario."
10. **10-second understanding:** "Waiting N more days costs us $X more than acting today."

---

## Screen 4 — Scenario Simulator / Strategy Builder (`/simulator`)

1. **Goal:** Let the user test strategies before committing money.
2. **Primary user:** COO, Procurement Manager.
3. **Key information:** Adjustable scenario inputs; selectable strategy actions; live-computed Resilience Score, Cost, Potential Loss Avoided.
4. **Main components:** Left panel — scenario input sliders/controls (disruption duration, risk level, inventory, supplier availability, transport capacity, demand, budget cap). Center — action selection checklist (6 actions, each with a per-unit cost and marginal resilience contribution shown inline). Right panel — live results card (Resilience Score gauge, Total Cost, Potential Loss Avoided, budget-remaining bar) plus a "Save Scenario" button.
5. **Main action:** "Apply as Recommendation Baseline" (feeds Action Center) — only enabled when Resilience Score ≥ target threshold or user explicitly overrides with a warning.
6. **Secondary actions:** "Save Scenario" (names and stores it for AI Strategy Comparison); "Reset to Recommended" (auto-selects the Recommendation Engine's suggested combination); "Reset to Baseline."
7. **Data shown:** `ScenarioState`, `ActionCatalog`, live-derived `ScenarioResult`.
8. **Interactions:** Every slider/checkbox change triggers immediate recompute (<100ms, no spinner) of the right panel; if selected actions exceed budget, the budget bar turns red and the Apply button disables with inline message "Over budget by $X — remove an action or raise budget cap."
9. **Edge cases:** Selecting all 6 actions simultaneously must show diminishing returns (not a linear sum) per the model in 07; selecting zero actions shows the "Wait" baseline resilience score, which should visibly be lower than any prepared scenario.
10. **10-second understanding:** "If I do these things, it costs $X and gets me to resilience Y, avoiding $Z in potential loss."

---

## Screen 5 — Resilience (`/resilience`)

1. **Goal:** Explain *why* the score is what it is and what to do about the weakest factor.
2. **Primary user:** Risk Manager, COO.
3. **Key information:** Resilience Score breakdown by factor (supplier concentration, inventory runway, transport flexibility, storage buffer, demand flexibility); top vulnerability; improvement plan.
4. **Main components:** Radial/segmented score breakdown chart (5 factors); ranked vulnerability list; "Improvement Plan" cards, one per vulnerability, each linking to the specific Scenario Simulator action that addresses it.
5. **Main action:** "Address Top Vulnerability" → Scenario Simulator with the relevant action pre-selected.
6. **Secondary actions:** "View historical trend" (sparkline of score over the simulated timeline as duration assumption changes).
7. **Data shown:** `ResilienceFactor[]` with weight, current value, contribution to score.
8. **Interactions:** Hovering a factor segment highlights its contributing data (e.g., hovering "Supplier Concentration" shows the top-3-supplier % of Meridian's Hormuz-linked volume).
9. **Edge cases:** If two factors are tied for lowest, both are shown as "Top Vulnerabilities" rather than arbitrarily picking one.
10. **10-second understanding:** "Our biggest weakness is X, and here's the specific fix."

---

## Screen 6 — Supply Network (`/network`)

1. **Goal:** Show where exposure physically concentrates.
2. **Primary user:** Logistics Manager, Procurement Manager.
3. **Key information:** Suppliers, routes, ports, storage nodes; which are Hormuz-dependent; concentration risk per node.
4. **Main components:** Node-link dependency graph (Meridian Fuels at center; suppliers → routes → ports/storage → Meridian), Hormuz-dependent path highlighted in amber/red; a side panel showing node detail on selection; a ranked "Concentration Risk" table as a non-graph fallback view.
5. **Main action:** Click a node → side panel with detail → "Diversify this dependency" → Scenario Simulator.
6. **Secondary actions:** Toggle graph/table view (table view is the accessible fallback and default on narrow screens).
7. **Data shown:** `SupplyNetworkNode[]`, `SupplyNetworkEdge[]` (see 06_DATA_MODEL.md).
8. **Interactions:** Selecting a node dims non-connected nodes/edges; a "Show only Hormuz-dependent paths" filter toggle.
9. **Edge cases:** Graph rendering on very small screens automatically switches to the table view (graphs are not usable below ~480px).
10. **10-second understanding:** "This is exactly where our dependency on Hormuz physically sits."

---

## Screen 7 — AI Insights (`/ai-insights`)

1. **Goal:** Provide synthesized, explainable narrative on top of the quantitative screens — not a chatbot.
2. **Primary user:** COO, CEO/Board (via Reports).
3. **Key information:** AI Risk Brief (what changed), AI Counterfactual (what if we wait), AI Strategy Comparison (which saved scenario protects the most value per dollar).
4. **Main components:** Three tabbed/stacked panels: Risk Brief (bullet narrative + "Simulated Data" badge), Counterfactual (reuses Cost of Waiting engine, framed as narrative + chart), Strategy Comparison (table of saved scenarios ranked by Potential Loss Avoided ÷ Cost).
5. **Main action:** "Promote to Recommendation" on the top-ranked strategy → Action Center.
6. **Secondary actions:** "Regenerate Brief" (re-runs the deterministic summarization over current scenario state — not random, but recomputed).
7. **Data shown:** Derived narrative text generated from the same engine outputs as other screens (no separate hidden model).
8. **Interactions:** Every AI-generated sentence that references a number is clickable and jumps to the source screen/chart for that number (traceability).
9. **Edge cases:** If no scenarios have been saved yet, Strategy Comparison shows an empty state prompting the user to save one from the Simulator, rather than a blank table.
10. **10-second understanding:** "Here's what changed, here's what waiting would cost, and here's our best option — and I can see exactly where each number came from."

---

## Screen 8 — Action Center (`/action-center`)

1. **Goal:** Enforce and visualize Recommend → Review → Approve → Execute, and log it.
2. **Primary user:** COO (approver), Risk Manager (auditor).
3. **Key information:** Current recommendation, its state, and the append-only Decision Log.
4. **Main components:** Recommendation card (state badge: Recommended/Under Review/Approved/Executed), expandable "Why / What changed / Assumptions" panel, action buttons gated by state, Decision Log table (timestamp, actor, action, state transition).
5. **Main action:** "Approve" (only available after "Review" has been opened at least once — enforced via UI state, not just log).
6. **Secondary actions:** "Reject and return to Simulator," "Mark Executed" (simulated — shows a confirmation, not a real transaction).
7. **Data shown:** `RecommendationState`, `DecisionLogEntry[]`.
8. **Interactions:** State transitions are animated as a horizontal stepper (Recommended → Review → Approved → Executed) with the current step highlighted.
9. **Edge cases:** If the user changes scenario inputs after a recommendation is Approved but before Executed, the system flags "Assumptions changed since approval — recommend re-review" rather than silently invalidating the approval.
10. **10-second understanding:** "Here is what we're about to commit to, why, and who approved it."

---

## Screen 9 — Reports & Settings (`/reports`, `/settings`)

1. **Goal:** Provide a board-ready summary and let the user tune the model's thresholds.
2. **Primary user:** CEO/Board (Reports), Risk Manager (Settings).
3. **Key information (Reports):** Snapshot of posture, Decision Window, Resilience Score, recommended strategy, cost, rationale, decision log excerpt. **(Settings):** target Resilience threshold, risk tolerance, default disruption duration assumption.
4. **Main components:** Reports — a single print-friendly summary layout. Settings — a form with sliders/toggles and immediate confirmation of downstream effect ("Raising your target threshold to 85 will change the current recommendation — preview updated strategy").
5. **Main action (Reports):** "Copy summary" (visual affordance only in prototype). **(Settings):** "Save preferences."
6. **Secondary actions:** Reports — "View full Decision Log." Settings — "Reset to defaults."
7. **Data shown:** Aggregated snapshot of all engine outputs; user preference values.
8. **Interactions:** Settings changes take effect immediately across the app on save, with a visible toast confirming what changed downstream.
9. **Edge cases:** If Settings threshold is set below the current Resilience Score, Recommendation Engine correctly recommends "No further action needed at this time" rather than forcing an unnecessary action.
10. **10-second understanding (Reports):** "Here is exactly what I'd tell the board today."

---

## Global UX Patterns

### Loading States
- Only the Recommendation Engine simulates a brief "computing" state (≤600ms, a subtle progress indicator, never a full-page spinner) to make the optimization feel real. All other interactions are instant.

### Empty States
- Strategy Comparison (no saved scenarios): illustration-free text empty state with a direct CTA to Scenario Simulator.
- Decision Log (no actions yet): "No decisions recorded yet. Actions taken in Action Center will appear here."

### Error States
- Over-budget selection in Simulator: inline red state on budget bar + disabled primary action + explicit message (never a modal interrupt).
- Attempting to Execute before Approve: button is disabled with a tooltip explaining the required step (never a silent no-op).

### Accessibility
- All charts have an accompanying data table or text summary reachable via a "View as table" toggle for screen reader users.
- Color is never the sole indicator of state (posture badges carry text labels: WAIT/PREPARE/ACT, not just color).
- All sliders are operable via arrow keys and expose current value via `aria-valuenow`/`aria-valuetext`.
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text/icons, verified against the palette in 05_UI_DESIGN_SYSTEM.md.
- Focus states are visible (2px offset outline in accent color) on every interactive element.
