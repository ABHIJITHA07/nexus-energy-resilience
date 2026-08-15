# 11_DEMO_SCRIPT.md

## Principle

The product must be understandable **without narration** — every shot should make sense from the screen alone. Narration adds context and stakes; it does not carry information the UI fails to show. Total runtime: 2:00. Timings below are targets, not hard requirements — adjust ±5s per beat as needed.

## Sequence

### 0:00–0:15 — Introduce the crisis
**Screen:** Overview.
**Narration:** "If the Strait of Hormuz shut down for weeks, most companies wouldn't run out of oil — they'd run out of time to prepare. NEXUS is a decision engine for exactly that moment. This is Meridian Fuels: 64% of their supply moves through Hormuz."
**Visual beat:** Hero card with posture badge (PREPARE, amber) and the Decision Window countdown are the first thing on screen.

### 0:15–0:30 — Show company exposure
**Screen:** Overview → quick pan to exposure card / Supply Network preview.
**Narration:** "Right now, their model says they have 11 days before their cheapest resilience options start disappearing."
**Visual beat:** Cut briefly to Supply Network graph highlighting Hormuz-dependent suppliers in amber.

### 0:30–0:50 — Show the Decision Window
**Screen:** Decision Window.
**Narration:** "This is the core idea: every option — stockpiling, chartering ships, locking in a new supplier — decays at a different rate. NEXUS makes that decay visible instead of leaving it to gut feel."
**Visual beat:** Timeline lanes shrinking; click one lane to expand its cost curve.

### 0:50–1:05 — Show Cost of Waiting
**Screen:** Cost of Waiting.
**Narration:** "And waiting isn't free. Here's exactly what waiting 3, 7, or 14 more days would cost Meridian versus acting today."
**Visual beat:** Four comparison cards; drag the custom-wait slider once to show live recompute.

### 1:05–1:30 — Open the Scenario Simulator
**Screen:** Scenario Simulator.
**Narration:** "Before spending a dollar, they can simulate strategies. Watch what happens when I select supplier diversification and reserve transport."
**Visual beat:** Click two action checkboxes live on screen — Resilience Score gauge and Cost update instantly. Then drag Disruption Duration to 90 days to show the "what if this lasts 90 days" reflex — the single strongest "wow" moment.

### 1:30–1:45 — AI recommendation + explainability
**Screen:** AI Insights → Action Center.
**Narration:** "The recommendation engine finds the cheapest combination that hits their resilience target — and shows exactly why."
**Visual beat:** Open the "Why / What changed / Assumptions" panel briefly; click Approve, showing the state stepper move from Recommended to Approved, logged.

### 1:45–1:55 — Resilience improvement
**Screen:** Resilience.
**Narration:** "And they can see precisely which vulnerability moved the needle."
**Visual beat:** Score breakdown with Supplier Concentration highlighted as resolved/improved.

### 1:55–2:00 — Close on business impact
**Screen:** Reports (board summary) or back to Overview with the posture badge now improved (PREPARE → WAIT, or a green "on track" state).
**Narration:** "Know when to act — before your options disappear."
**Visual beat:** Final frame holds on the wordmark/tagline over the calm Overview screen.

## Shot List Summary (for editors)

1. Overview (hero) — 15s
2. Overview exposure + Network glance — 15s
3. Decision Window (timeline + one lane expand) — 20s
4. Cost of Waiting (4 cards + slider drag) — 15s
5. Simulator (2 checkbox clicks + duration slider to 90) — 25s
6. AI Insights / Action Center (why panel + approve) — 15s
7. Resilience (score breakdown) — 10s
8. Reports / Overview close — 5s

## What Must Be True On Camera

- Every number that appears must visibly change at least once during the recording as a direct result of an on-screen click or drag — this is the entire proof that the system isn't static mockups.
- No loading spinner longer than the intentional 600ms Recommendation Engine compute beat.
- The posture badge should visibly transition color/state at least once (e.g., PREPARE at the start, moving toward WAIT/resolved by the end) to give the demo a narrative arc, not just a feature tour.
