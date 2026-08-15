# 14_ANTIGRAVITY_QA_PROMPT.md

> Copy-paste this prompt into Antigravity after the build phases are complete. Its job is to break the app, not to compliment it.

---

```
You are now acting as a ruthless QA engineer, not the developer who built this. Your job is to find every
defect, inconsistency, and broken interaction in the NEXUS prototype before it ships. Go through every item
below systematically. For each item, state PASS or FAIL with a specific description of what you observed —
do not mark anything PASS without actually exercising it. Fix every FAIL before reporting completion.

## Navigation
- Click every item in the left nav rail (desktop) and confirm it routes to the correct page with no 404s.
- Confirm the collapsed icon-rail (tablet width) and bottom tab bar (mobile width) both work and route correctly.
- Confirm the "More" tab (mobile) surfaces the 4 non-primary destinations correctly.
- Confirm browser back/forward buttons work correctly across all routes.
- Confirm the persistent TopStatusBar (Decision Window countdown, Resilience Score, posture badge) is present
  and shows consistent values on every single page — not just Overview.

## Buttons & Forms
- Click every primary, secondary, and destructive button on every screen. Confirm each does what its label says.
- Confirm every disabled-state button (e.g., Execute before Approve, Apply when over budget) is actually
  disabled — not just styled to look disabled while still clickable.
- Confirm every button has a visible hover and focus state.
- Confirm form inputs (Settings thresholds, budget cap) validate reasonable ranges and don't accept invalid
  values (negative numbers, non-numeric input where numeric is expected).

## Sliders
- Drag every slider in Scenario Simulator and Decision Window to its minimum, maximum, and a few midpoints.
  Confirm dependent values recompute correctly and immediately at every point, including the extremes.
- Confirm sliders are operable via keyboard (arrow keys) and expose current value to screen readers
  (aria-valuenow/aria-valuetext).
- Confirm the custom-wait slider on Cost of Waiting correctly interpolates between the fixed comparison points.

## Scenario Correctness
- Set Risk Level to 0. Confirm Decision Window windows are at their longest/least urgent state and posture is WAIT.
- Set Risk Level to 100. Confirm windows compress significantly and posture likely reaches ACT.
- Set Disruption Duration to 90 days. Confirm expected loss exposure and the recommendation visibly change vs.
  the 45-day baseline (Workflow 6 must work end-to-end).
- Select zero actions in Strategy Builder. Confirm Resilience Score reflects the unprepared baseline and is
  visibly lower than any prepared combination.
- Select all 6 actions. Confirm the combined Resilience Score reflects diminishing returns (not a naive
  linear sum that could exceed sensible bounds) per the formula in 07_AI_AND_DECISION_ENGINE.md §3.
- Take the Recommendation Engine's suggested action set (via "Reset to Recommended") and confirm the resulting
  Resilience Score and Cost in Strategy Builder exactly match what the recommendation card claims elsewhere
  in the app. This is a hard correctness requirement — if these numbers disagree anywhere, it is a FAIL.
- Set Settings target threshold below the current Resilience Score. Confirm the Recommendation Engine
  correctly reports no further action needed, rather than forcing an unnecessary recommendation.
- Set actions that exceed the budget cap. Confirm the budget bar turns red, Apply is disabled, and the
  message states the exact overage.

## Charts
- Confirm every chart renders with correctly labeled axes and a one-line caption stating what question it answers.
- Confirm every chart has a working "View as table" accessible fallback.
- Confirm chart data updates when its underlying scenario inputs change — no stale/frozen charts after interaction.
- Confirm charts do not overflow their containers or become illegible at 360px width.

## Calculations
- Manually recompute at least 3 displayed numbers (one from decay.ts, one from resilience.ts, one from
  waiting.ts) by hand using the formulas in 07_AI_AND_DECISION_ENGINE.md against the seeded demo data, and
  confirm the UI shows the same value. Report the exact numbers checked.

## Action Center Workflow
- Confirm Approve is disabled until the Why/What-changed/Assumptions panel has been opened at least once.
- Confirm Execute is disabled until Approve has occurred.
- Confirm every state transition appends a correctly timestamped, correctly attributed entry to the Decision Log.
- Change a scenario input after Approve but before Execute. Confirm the "assumptions changed since approval"
  warning appears and blocks direct execution.

## Responsive Behavior
- Test the full app at 360px, 480px, 768px, 1024px, and 1440px widths. Report any overlapping elements,
  cut-off text, horizontally scrolling content that shouldn't scroll, or unusably small touch targets.
- Confirm the Decision Window timeline switches to the vertical stacked list below 480px as specified.
- Confirm the Supply Network graph switches to table view below 480px as specified.

## Accessibility
- Tab through every page using only the keyboard. Confirm every interactive element is reachable in a
  logical order and has a visible focus indicator.
- Confirm no information is conveyed by color alone (check status badges, chart series, alert states).
- Run a contrast check on body text against its background in both the primary card backgrounds and nested
  card backgrounds; report any pairing below 4.5:1.
- Confirm all images/icons that convey meaning have accessible labels (aria-label or equivalent).

## Visual Consistency
- Confirm every card, button, badge, and chart across all 10 pages uses the exact tokens from
  05_UI_DESIGN_SYSTEM.md — no one-off colors, spacing, or type sizes introduced ad hoc anywhere in the app.
- Confirm every "Simulated / Prototype Data" label is present wherever RiskIndicator or AI-generated text
  appears — report any screen where it's missing.

## Broken States
- Reload the page mid-session (after saving scenarios / approving a recommendation). Confirm the app either
  gracefully resets to a clean baseline state (acceptable per 08_SYSTEM_ARCHITECTURE.md — this is in-memory
  state) with no crash, or persists correctly if persistence was implemented. It must never show a broken/
  half-rendered UI or a JavaScript error page.
- Attempt to navigate directly to a deep route (e.g., /action-center) before ever visiting Simulator. Confirm
  the empty state (no recommendation yet) renders sensibly rather than crashing.

## Console & Build Errors
- Open browser dev tools and click through every page. Report every console error and warning verbatim.
- Run `next build` and report any TypeScript errors, ESLint errors, or build warnings.
- Confirm there are no React hydration mismatch warnings on any page.

## Vercel Compatibility
- Confirm the app has zero required environment variables for core functionality.
- Confirm any optional API route (LLM narrative enhancement) fails gracefully with no crash if
  ANTHROPIC_API_KEY is unset.
- Confirm the production build (`next build && next start`) behaves identically to the dev server for all
  interactions tested above — no dev-only behavior the production build lacks.

## Final Report Format
Produce a table: Item | PASS/FAIL | Notes. For every FAIL, fix the issue and re-test before final submission.
Do not report the QA pass as complete while any item remains FAIL.
```
