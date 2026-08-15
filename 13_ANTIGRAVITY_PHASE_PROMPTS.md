# 13_ANTIGRAVITY_PHASE_PROMPTS.md

> Run these phases in order. Each prompt is copy-paste-ready. Do not proceed to the next phase until the current phase's output is functionally correct — verify before moving on.

---

## Phase 1 — Foundation

```
Set up a new Next.js 14+ project with App Router and TypeScript (strict mode) for a product called NEXUS.
Install and configure: Tailwind CSS, Recharts, Lucide React.
Create the folder structure exactly as specified in 08_SYSTEM_ARCHITECTURE.md:
/app (with empty placeholder pages for the 10 routes listed in 03_INFORMATION_ARCHITECTURE.md),
/lib/demoData.ts, /lib/engine/, /components/ui/, /context/.
Set up next/font with self-hosted Inter.
Confirm the project builds cleanly with `next build` and runs with `next dev` before proceeding.
Do not build any UI or logic yet beyond empty routed pages that render a placeholder heading with the page name.
```

## Phase 2 — Design System

```
Implement the full design system from 05_UI_DESIGN_SYSTEM.md as a Tailwind theme extension in tailwind.config.ts
(exact color tokens as CSS variables, font scale, spacing scale) and build the shared component library in
/components/ui/: Card, Button (primary/secondary/destructive/ghost), StatusBadge, Slider, Alert, ChartCaption,
NavRail, TopStatusBar. Build a temporary /app/style-guide page that renders every component variant so we can
visually verify the design system before using it elsewhere. Dark mode is the default and only required theme
for now. Do not proceed until every component in the style guide visually matches the tokens in 05_UI_DESIGN_SYSTEM.md.
```

## Phase 3 — Data Model & Demo Data

```
Implement /lib/demoData.ts with the exact TypeScript interfaces and seed data from 06_DATA_MODEL.md:
Company, Supplier[], Route[], StorageSite[], InventoryPosition, RiskIndicator[], ResilienceOption[],
ResilienceFactor[], SupplyNetworkNode[]/Edge[]. Use the exact demo values given in the tables in that document
(Meridian Fuels, 64% exposure, the 5 suppliers, 6 resilience options, etc.) — do not invent different numbers.
Export everything with full TypeScript types. No UI work in this phase.
```

## Phase 4 — Core Decision Engine

```
Implement /lib/engine/ as pure, side-effect-free TypeScript functions per 07_AI_AND_DECISION_ENGINE.md:
- decay.ts: option cost/decay formulas (§1)
- decisionWindow.ts: aggregate decision window (§2)
- resilience.ts: weighted resilience score with diminishing-returns multi-action combination (§3)
- waiting.ts: cost-of-waiting comparison for Act Now / Wait 3/7/14 and arbitrary custom day (§4)
- optimizer.ts: brute-force constrained subset search over the 6 ResilienceOptions producing the lowest-cost
  combination that clears a target Resilience Score, with graceful "closest option" fallback if none clears it (§5)
- narrative.ts: deterministic templated text generation for Risk Brief, Counterfactual, and recommendation
  Why/What-changed/Assumptions sections (§7, §8, §6)
Write these as pure functions taking ScenarioState (and the static demo data) and returning derived results —
no React, no UI. Add basic inline comments explaining each formula. Then write a small temporary test script
(can be a Node script or a /app/engine-test page) that calls each function with a few sample ScenarioState values
and logs the output, so we can sanity-check the numbers before wiring up the UI. Verify specifically that
optimizer.ts's recommended action set, when its resilienceScore is recomputed via resilience.ts using exactly
that action set, matches the score the optimizer itself computed (this is a hard correctness requirement).
```

## Phase 5 — Global State & Overview Page

```
Implement ScenarioContext (React Context + useReducer) in /context/ holding ScenarioState, savedScenarios,
and DecisionLogEntry[], per 06_DATA_MODEL.md and 08_SYSTEM_ARCHITECTURE.md. Wire it into the app layout so
all pages can read/write it. Build the Overview page (/) exactly per 04_UX_SPECIFICATION.md Screen 1: hero
status card (posture badge + countdown), exposure summary, Resilience Score gauge, Top Vulnerability callout,
Recommended Action card, mini cost-of-waiting sparkline. All numbers must come from calling the Phase 4 engine
functions against ScenarioContext state — none hardcoded. Also build the persistent TopStatusBar and NavRail
(collapsible per responsive rules) showing the live Decision Window countdown, Resilience Score, and posture
badge, present on every page from this point forward.
```

## Phase 6 — Decision Window Page

```
Build /decision-window exactly per 04_UX_SPECIFICATION.md Screen 2: horizontal timeline with one lane per
ResilienceOption, showing remaining viability window computed live via decay.ts; a "today" marker; an
aggregate countdown card; expandable lanes showing the full cost-over-time curve (use Recharts) when clicked;
a "Show cost overlay" toggle. Handle the edge case where an option has already crossed its impractical
threshold (grayed out, "No longer viable at reasonable cost" label, not removed). Verify that changing Risk
Level (control on this page) visibly recomputes every lane immediately.
```

## Phase 7 — Cost of Waiting Page

```
Build /cost-of-waiting exactly per 04_UX_SPECIFICATION.md Screen 3: four comparison cards (Act Now/Wait
3/7/14) using waiting.ts; a cost-of-waiting curve chart with a breakeven marker; a draggable custom-wait
slider (0-14 days) producing a live fifth card. Handle the edge case where Act Now is cheapest at all
horizons (breakeven shown at day 0 with the appropriate message). Add the "Lock in Act Now plan" action
linking to Scenario Simulator pre-loaded with that action set (Simulator built next phase — link can be
a route param or context pre-fill, implement the receiving side in Phase 8).
```

## Phase 8 — Scenario Simulator / Strategy Builder

```
Build /simulator exactly per 04_UX_SPECIFICATION.md Screen 4: left panel scenario input controls (all 7
sliders/inputs from ScenarioState), center panel 6-action selection checklist with per-unit cost and marginal
resilience shown inline, right panel live results (Resilience Score gauge, Total Cost, Potential Loss
Avoided, budget-remaining bar) recomputing on every interaction via the Phase 4 engine — no reload, no
spinner except a subtle sub-600ms indicator only when clicking "Apply as Recommendation Baseline". Implement
budget-exceeded state (red bar, disabled Apply, inline message) and the diminishing-returns behavior when
multiple actions are selected. Implement "Save Scenario" (stores to ScenarioContext.savedScenarios),
"Reset to Recommended" (auto-selects optimizer.ts's output), and "Reset to Baseline". Wire up the pre-fill
handoffs from Cost of Waiting (Act Now plan) and later from Resilience (top vulnerability action).
```

## Phase 9 — Resilience & Supply Network Pages

```
Build /resilience per 04_UX_SPECIFICATION.md Screen 5: score breakdown by the 5 ResilienceFactors, ranked
vulnerability list, Improvement Plan cards linking to Simulator with the relevant action pre-selected, tied
handling for multiple lowest factors. Build /network per Screen 6: node-link dependency graph (build with
SVG or a lightweight graph library) with Hormuz-dependent paths highlighted, node selection side panel, a
"Show only Hormuz-dependent paths" filter, and a table-view fallback that becomes the default below ~480px
width. Both pages must read live ScenarioContext state where relevant (e.g., Resilience Score breakdown
reflects currently selected Simulator actions if any).
```

## Phase 10 — AI Insights & Action Center

```
Build /ai-insights per 04_UX_SPECIFICATION.md Screen 7: Risk Brief, Counterfactual, and Strategy Comparison
panels using narrative.ts, all outputs traceable/clickable back to their source screens, empty state for
Strategy Comparison when no scenarios are saved, "Simulated Data" badges throughout. Build /action-center per
Screen 8: recommendation card with state stepper (Recommended → Under Review → Approved → Executed), the
Why/What-changed/Assumptions expandable panel (must be opened before Approve is enabled), Decision Log table
(append-only, timestamped), and the "assumptions changed since approval" edge case. This is the screen that
enforces the human-in-the-loop guarantee from 07_AI_AND_DECISION_ENGINE.md §10 — do not allow any code path
to reach Executed without a prior Approved state change initiated by a real user click.
```

## Phase 11 — Reports, Settings & Global Polish

```
Build /reports per 04_UX_SPECIFICATION.md Screen 9: single print-friendly summary layout aggregating current
posture, Decision Window, Resilience Score, recommended strategy, cost, rationale, and a Decision Log
excerpt. Build /settings: target Resilience threshold and risk tolerance controls that immediately affect
downstream Recommendation Engine output app-wide, with a toast confirming what changed. Then do a full pass
across all 10 pages verifying: consistent design system usage, all empty/loading/error states from
04_UX_SPECIFICATION.md are implemented, all charts have captions and table-view fallbacks, all interactive
elements are keyboard-operable with visible focus states, and the app is fully responsive at 360px, 768px,
1024px, and 1440px per the responsive rules in 05_UI_DESIGN_SYSTEM.md.
```

## Phase 12 — QA & Vercel Deployment

```
Run the full QA pass described in 14_ANTIGRAVITY_QA_PROMPT.md against the complete application. Fix every
issue found. Then verify the app builds cleanly with `next build` with zero TypeScript errors and zero
console errors/warnings in the browser on every page. Confirm no environment variables are required for the
app to run correctly (if an optional LLM-narrative API route was implemented, confirm it degrades gracefully
with no ANTHROPIC_API_KEY set). Prepare the project for Vercel deployment: confirm package.json scripts are
correct, add a README.md with a short project description and local run instructions, and confirm there are
no hydration mismatches (client-only values like Date.now()-based timestamps generated post-mount only).
Deploy to Vercel and perform a final smoke test of the entire demo script from 11_DEMO_SCRIPT.md on the live
deployed URL.
```
