# 12_ANTIGRAVITY_MASTER_BUILD_PROMPT.md

> Copy this entire prompt into Antigravity as the master build instruction. It references the other 14 files in this pack, which should be provided/attached alongside it as source-of-truth specs.

---

## PROJECT OBJECTIVE

Build **NEXUS** — "Know when to act before your options disappear" — a fully functional, deployable web prototype of an AI-assisted Supply Resilience Decision Engine, for a fictional company called **Meridian Fuels**, addressing the scenario: *the Strait of Hormuz is unavailable for a sustained period.*

This is a hackathon prototype, not a production system, but it must **behave like a real, working enterprise decision tool** — every number on screen must be computed from a real (if simulated) data model and formulas, and must visibly recompute when the user interacts with controls. No static mockups. No placeholder Lorem Ipsum. No fake "coming soon" screens.

Build strictly according to the specifications in this file pack:
- `01_PRODUCT_VISION.md` — the problem, insight, and differentiation. Read this first to understand *why* the product is shaped this way.
- `02_PRODUCT_REQUIREMENTS.md` — functional/non-functional requirements and acceptance criteria. Treat every AC as a test you must pass.
- `03_INFORMATION_ARCHITECTURE.md` — exact site map and navigation structure.
- `04_UX_SPECIFICATION.md` — screen-by-screen UX spec. Build every screen exactly to this spec, including edge cases and empty/error states.
- `05_UI_DESIGN_SYSTEM.md` — exact design tokens (colors, type, spacing, components). Implement these as a Tailwind theme, do not improvise a different visual style.
- `06_DATA_MODEL.md` — exact entities and demo data for Meridian Fuels. Use this data verbatim as your seed dataset.
- `07_AI_AND_DECISION_ENGINE.md` — exact formulas for the decay model, resilience score, cost of waiting, and optimizer. Implement these formulas precisely; do not substitute approximations.
- `08_SYSTEM_ARCHITECTURE.md` — required tech stack and file/folder structure.
- `09_WORKFLOWS.md` — the six end-to-end workflows that must work exactly as described.
- `11_DEMO_SCRIPT.md` — use this to sanity-check that the built product supports every beat of the demo.

## TECH STACK (required, do not substitute)

- Next.js 14+, App Router, TypeScript (strict mode)
- Tailwind CSS, theme extended with the exact tokens from `05_UI_DESIGN_SYSTEM.md`
- Recharts for standard charts; custom SVG/CSS for the Decision Window timeline
- Lucide React for icons
- No backend, no database, no external API calls required for core functionality (see `08_SYSTEM_ARCHITECTURE.md` for the optional LLM-narrative enhancement — build the deterministic version first and treat the LLM version as strictly optional)
- State: React Context + `useReducer` for a single global `ScenarioContext`

## PAGES TO BUILD (exact routes)

```
/                → Overview
/decision-window → Decision Window
/cost-of-waiting → Cost of Waiting
/simulator        → Scenario Simulator / Strategy Builder
/resilience        → Resilience Assessment
/network             → Supply Network
/ai-insights          → AI Risk Brief / Counterfactual / Strategy Comparison
/action-center         → Recommendation review, approval workflow, Decision Log
/reports                → Board Summary
/settings                → Thresholds & preferences
```

Each page must be built to the exact spec (goal, components, interactions, edge cases) in `04_UX_SPECIFICATION.md` — do not skip the edge-case or empty-state behavior; these are explicitly required, not optional polish.

## CORE ENGINE — BUILD FIRST, BUILD CORRECTLY

Before any UI, implement `/lib/engine/` as pure, independently testable TypeScript functions implementing the exact formulas in `07_AI_AND_DECISION_ENGINE.md`:

- `decay.ts` — option cost/decay formulas (§1)
- `decisionWindow.ts` — aggregate window (§2)
- `resilience.ts` — weighted score with diminishing-returns combination (§3)
- `waiting.ts` — cost-of-waiting comparison (§4)
- `optimizer.ts` — brute-force constrained subset search (§5), producing the exact recommendation
- `narrative.ts` — deterministic templated text generation (§7–9)

These functions are the source of truth. Every screen must derive its displayed numbers by calling these functions against the shared `ScenarioState`, never by hardcoding a number in a component.

## DEMO DATA

Seed `/lib/demoData.ts` with the exact Meridian Fuels entities from `06_DATA_MODEL.md` (company, 5 suppliers, 3 routes, 2 storage sites, 3 risk indicators, 6 resilience options, 5 resilience factors). Do not invent different numbers — use the table values given so the pack's internal consistency (acceptance criteria, demo script) holds.

## DESIGN SYSTEM IMPLEMENTATION

Implement `05_UI_DESIGN_SYSTEM.md` as:
- `tailwind.config.ts` theme extension with the exact color tokens (as CSS variables consumed by Tailwind), font scale, and spacing scale.
- Dark mode as default/primary theme; light mode token set may be added as a stretch goal but is not required for MVP.
- Shared component library in `/components/ui/`: `Card`, `Button` (primary/secondary/destructive/ghost variants), `StatusBadge`, `Slider`, `Alert`, `ChartCaption`, `NavRail`, `TopStatusBar`.
- Self-hosted Inter via `next/font`, tabular numerals on all metric displays.

## REQUIRED INTERACTIONS (must actually work, not be visual-only)

1. Every slider/control in Scenario Simulator recomputes Resilience Score, Cost, and Potential Loss Avoided live (no page reload, no server round trip).
2. Changing Risk Level or Disruption Duration anywhere updates the Decision Window countdown everywhere it's displayed (top bar, Overview, Decision Window page) — this must be driven by shared context, not per-page local state.
3. Selecting multiple Strategy Builder actions produces diminishing-returns combination per the formula, not a naive sum.
4. The Recommendation Engine reproduces exactly, when its suggested action set is manually selected in Strategy Builder, the same Resilience Score and Cost (this is a hard acceptance criterion — test it explicitly).
5. Action Center enforces Recommend → Review → Approve → Execute as a real state machine; "Execute" must be disabled until "Approve" has occurred; "Approve" must be disabled until the explanation panel has been opened at least once.
6. Every chart has a "View as table" accessible fallback and a one-line caption stating what question it answers.
7. The Decision Log is append-only and visibly grows as actions are taken.

## QUALITY REQUIREMENTS

- Zero console errors, zero TypeScript errors, zero broken internal links.
- Fully responsive from 360px to desktop widths per `05_UI_DESIGN_SYSTEM.md` responsive rules.
- Keyboard-operable: every slider, button, and nav item reachable and operable via keyboard, with visible focus states.
- Every AI-generated or simulated-data element carries a visible "Simulated / Prototype Data" label — this is a hard requirement, not optional, per the product's honesty principle in `01_PRODUCT_VISION.md`.
- No feature exists that isn't traceable to a requirement in `02_PRODUCT_REQUIREMENTS.md` — do not add decorative screens or features "to look complete."

## VERCEL DEPLOYMENT REQUIREMENTS

- Must build successfully with `next build` and deploy with zero required environment variables.
- No server-only secrets required for MVP functionality.
- If you implement the optional LLM-narrative API route, it must fail gracefully (fall back to deterministic templates) if `ANTHROPIC_API_KEY` is not set — the app must never break or show an error state because of this optional feature.
- Confirm the deployed build has no hydration mismatches (all client-only state — e.g., `Date.now()`-based log timestamps — must be generated client-side after mount, not during SSR, to avoid hydration errors).

## ACCEPTANCE CRITERIA (must all pass before considering the build complete)

Use the exact acceptance criteria list in `02_PRODUCT_REQUIREMENTS.md` §"Acceptance Criteria" as your definition of done, plus:

- AC-Master-1: A user landing on `/` for the first time understands the current posture and recommended action without needing to visit any other page.
- AC-Master-2: The 90-day disruption duration workflow (`09_WORKFLOWS.md` Workflow 6) works end-to-end and produces a visibly different recommendation than the 45-day baseline.
- AC-Master-3: The entire demo script (`11_DEMO_SCRIPT.md`) can be performed on the live deployed build without encountering a dead end, broken interaction, or static/unresponsive number.

## BUILD ORDER

Follow `13_ANTIGRAVITY_PHASE_PROMPTS.md` for the recommended incremental build sequence rather than attempting the entire app in one generation pass. Do not skip ahead to polish before the engine and core pages are functionally correct.

## OUTPUT

A complete, buildable Next.js project, ready to `git push` and deploy to Vercel with zero additional configuration, plus a short `README.md` explaining the concept (2–3 sentences, pointing to this file pack for full detail) and how to run it locally (`npm install && npm run dev`).
