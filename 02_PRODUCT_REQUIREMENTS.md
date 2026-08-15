# 02_PRODUCT_REQUIREMENTS.md

## Scope

This document defines what the Antigravity-built prototype must functionally do. All data is simulated/demo data for the fictional company **Meridian Fuels** (see 06_DATA_MODEL.md). No real-time external APIs are required; all "live" behavior is driven by local state and deterministic simulation functions.

## Functional Requirements

### FR1 — Exposure Overview
- FR1.1: The system must display Meridian Fuels' current Hormuz-linked supply exposure as a percentage of total crude/fuel input.
- FR1.2: The system must display a single top-line status: Decision Window (days remaining), current Resilience Score (0–100), and current recommended posture (WAIT / PREPARE / ACT).
- FR1.3: Status must be derived from underlying simulation state, not hardcoded — changing scenario inputs elsewhere in the app must update this screen.

### FR2 — Decision Window
- FR2.1: The system must render a timeline showing each resilience option's remaining viability window (days until cost/availability crosses an "impractical" threshold).
- FR2.2: The system must compute an aggregate Decision Window as the minimum viable window across the options required to reach the target Resilience Score.
- FR2.3: Adjusting risk level or disruption duration assumption must recompute all option windows and the aggregate window.

### FR3 — Cost of Waiting
- FR3.1: The system must let the user compare four waiting postures: Act Now, Wait 3 Days, Wait 7 Days, Wait 14 Days.
- FR3.2: Each posture must display: preparation cost, expected potential loss if disruption continues, and net financial outcome.
- FR3.3: The comparison must update when scenario inputs (risk level, disruption duration, demand) change.

### FR4 — Scenario Simulator / Strategy Builder
- FR4.1: The user must be able to adjust: disruption duration, risk level, current inventory, supplier availability, transport capacity, demand level, and budget cap.
- FR4.2: The user must be able to select one or more strategy actions (stockpile, diversify supplier, reserve transport, reserve storage, pre-position inventory, reduce non-critical demand).
- FR4.3: Selecting/deselecting actions must recompute, in real time (no page reload): total Cost, resulting Resilience Score, and Potential Loss Avoided.
- FR4.4: The system must flag when selected actions exceed the budget cap.
- FR4.5: The system must support saving a scenario as a named comparison for later reference within the session.

### FR5 — Recommendation Engine
- FR5.1: Given current scenario inputs, the system must compute and display the lowest-cost combination of actions that reaches a target Resilience Score (default target configurable, e.g., 75/100).
- FR5.2: The recommendation must update automatically when scenario inputs change.
- FR5.3: Every recommendation must expose: "Why," "What changed since last assessment," and "Assumptions used" in an expandable panel.

### FR6 — Resilience Assessment
- FR6.1: The system must compute a Resilience Score from a transparent weighted formula over: supplier concentration, inventory runway, transport flexibility, storage buffer, and demand flexibility.
- FR6.2: The system must show which factor(s) are the largest drag on the score ("Top Vulnerability").
- FR6.3: The system must offer at least one concrete "Improvement Plan" action per identified vulnerability.

### FR7 — Supply Network View
- FR7.1: The system must visualize Meridian Fuels' supplier/route/storage network as a dependency graph or structured list, with Hormuz-dependent nodes clearly marked.
- FR7.2: Selecting a node must show its concentration risk and contribution to total exposure.

### FR8 — AI Layer
- FR8.1: The system must provide an "AI Risk Brief" summarizing what changed in the simulated risk indicators over the last cycle.
- FR8.2: The system must provide an "AI Counterfactual" answering "what happens if we wait N days" using the same engine as Cost of Waiting.
- FR8.3: The system must provide an "AI Strategy Comparison" ranking saved scenarios by protected business value per dollar spent.
- FR8.4: All AI outputs must be generated from the deterministic simulation engine's outputs (not free-form hallucinated numbers) and must never claim real-world predictive accuracy. Every AI panel must carry a visible "Simulated / Prototype Data" label.

### FR9 — Action Center / Approval Workflow
- FR9.1: A recommended strategy must move through explicit states: Recommended → Under Review → Approved → Executed (simulated).
- FR9.2: Only a human action (button click by the user acting as the executive) can move a recommendation from Recommended to Approved.
- FR9.3: Every state transition must be timestamped and logged in a visible Decision Log.

### FR10 — Reports
- FR10.1: The system must generate a summary view (screen, not necessarily exportable file) suitable for board reporting: current posture, decision window, recommended strategy, cost, and rationale.

### FR11 — Settings
- FR11.1: The user must be able to adjust the target Resilience Score threshold and risk tolerance, and see downstream screens update accordingly.

## Non-Functional Requirements

- NFR1: All interactions (sliders, toggles, action selection) must update dependent visuals within the same render cycle — no artificial loading delay beyond a brief, intentional simulated-compute indicator (<600ms) for perceived depth on the Recommendation Engine only.
- NFR2: The application must be a single deployable Next.js app, buildable and deployable to Vercel with no required external services or API keys.
- NFR3: The app must be responsive from 360px (mobile) to desktop widths, with charts that reflow rather than overflow.
- NFR4: All interactive elements must be keyboard-operable and carry accessible labels (see 04_UX_SPECIFICATION.md accessibility section).
- NFR5: All simulated/demo data and AI outputs must be visibly labeled as such at least once per screen where they appear.
- NFR6: No screen may allow an "Execute" action without a preceding "Approve" state.
- NFR7: The app must have zero console errors and zero broken links in its primary navigation.

## Acceptance Criteria (Representative)

- AC1: Moving the "Disruption Duration" slider on Scenario Simulator from 30 to 90 days visibly changes the Decision Window value on that screen and, on revisit, the Overview screen.
- AC2: Selecting "Stockpile" + "Diversify Supplier" in Strategy Builder produces a Resilience Score and Cost different from either action alone, and the numbers are internally consistent with the additive/diminishing-returns logic defined in 07_AI_AND_DECISION_ENGINE.md.
- AC3: The Recommendation Engine's suggested strategy, if the user selects exactly those actions in Strategy Builder, must produce a Resilience Score ≥ the configured target threshold.
- AC4: Clicking "Approve" on Action Center without first viewing "Why" is allowed, but the Decision Log must record whether the explanation panel was opened before approval (for realism/audit framing).
- AC5: Every chart on Decision Window and Cost of Waiting has a visible axis label and a one-line "what this answers" caption.
