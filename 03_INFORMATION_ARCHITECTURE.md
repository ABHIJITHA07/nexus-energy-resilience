# 03_INFORMATION_ARCHITECTURE.md

## Design Rationale

The IA is organized around the **decision lifecycle**, not around data categories. A generic dashboard organizes by data type (suppliers, routes, inventory). NEXUS organizes by the sequence an executive actually moves through: understand exposure → understand urgency → understand cost of delay → simulate options → get a recommendation → approve → track. This ordering is itself part of the product's differentiation.

## Primary Navigation (9 areas)

1. **Overview** — the single-screen situation report.
2. **Decision Window** — urgency and option-decay visualization.
3. **Cost of Waiting** — financial consequence of delay.
4. **Scenario Simulator** — Strategy Builder + live recomputation.
5. **Resilience** — score, vulnerabilities, improvement plan.
6. **Supply Network** — exposure map / dependency graph.
7. **AI Insights** — Risk Brief, Counterfactual, Strategy Comparison.
8. **Action Center** — Recommend → Review → Approve → Execute log.
9. **Reports & Settings** — board summary, thresholds, decision log export view.

*(Note: "Options" and "Recommendations" are intentionally not standalone nav items — they are embedded inside Scenario Simulator and Action Center respectively, because in the real decision flow they are never viewed in isolation from a scenario. This is a deliberate IA decision, not an omission.)*

## Site Map

```
/                       → Overview
/decision-window        → Decision Window
/cost-of-waiting         → Cost of Waiting
/simulator                → Scenario Simulator (Strategy Builder)
/resilience               → Resilience Assessment
/network                  → Supply Network
/ai-insights               → AI Risk Brief / Counterfactual / Strategy Comparison
/action-center             → Recommendation review & approval workflow + Decision Log
/reports                   → Board Summary
/settings                  → Thresholds & preferences
```

## Global Elements

- **Top status bar** (persistent across all pages): Decision Window countdown (days), current Resilience Score, current posture badge (WAIT/PREPARE/ACT), "Simulated Data" indicator.
- **Left navigation rail**: the 9 primary areas, collapsible on tablet/mobile into a bottom or hamburger nav.
- **Global scenario context**: whatever scenario inputs are set in Scenario Simulator persist across the app for that session (single source of truth in shared state) so Overview, Decision Window, and Cost of Waiting always reflect the same "world."

## User Journeys

### Journey A — First-time executive orientation (primary demo path)
Overview → Decision Window → Cost of Waiting → Scenario Simulator → AI Insights (Recommendation) → Action Center (Approve)

### Journey B — "What if it lasts 90 days" deep dive
Overview → Scenario Simulator (set duration=90) → Decision Window (recomputed) → Cost of Waiting (recomputed) → AI Insights → Reports

### Journey C — Vulnerability-driven
Resilience → identify top vulnerability → Scenario Simulator (pre-filtered to address that vulnerability) → Action Center

### Journey D — Network-driven
Supply Network → click Hormuz-dependent supplier node → see concentration risk → jump to Scenario Simulator with "Diversify Supplier" pre-highlighted

### Journey E — Audit / governance
Action Center → Decision Log → Reports (board summary) → Settings (thresholds used)

## Screen Relationships

| Screen | Reads from | Writes to |
|---|---|---|
| Overview | global scenario state | — (read-only) |
| Decision Window | global scenario state | — |
| Cost of Waiting | global scenario state | — |
| Scenario Simulator | global scenario state | global scenario state (on interaction) |
| Resilience | global scenario state + selected actions | — |
| Supply Network | static demo network + global scenario state (for highlight) | navigation handoff to Simulator |
| AI Insights | global scenario state + recommendation engine output | — |
| Action Center | recommendation engine output | Decision Log (append-only) |
| Reports | all of the above (snapshot) | — |
| Settings | user preferences | target threshold, risk tolerance (feeds Recommendation Engine) |

## Responsive Navigation Behavior

- **Desktop/laptop (≥1024px):** persistent left rail + top status bar.
- **Tablet (768–1023px):** collapsible left rail (icon-only by default, expandable), top status bar retained but condensed (Decision Window number only, tap to expand).
- **Mobile (<768px):** bottom tab bar with 5 primary destinations (Overview, Decision Window, Simulator, AI Insights, Action Center); remaining 4 areas reachable via a "More" tab. Top status bar collapses to a single-line sticky strip.
