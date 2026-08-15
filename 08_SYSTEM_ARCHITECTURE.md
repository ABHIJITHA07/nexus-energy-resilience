# 08_SYSTEM_ARCHITECTURE.md

## Conceptual Pipeline (Challenge-Level Framing)

```
Data Sources
   ↓
Data Ingestion
   ↓
Risk Intelligence
   ↓
Business Exposure Model
   ↓
Scenario Engine
   ↓
Optimization Engine
   ↓
Recommendation Engine
   ↓
User Interface
   ↓
Business Action
```

- **Data Sources:** in production — freight indices, insurance/war-risk premiums, AIS vessel tracking, geopolitical risk feeds, company ERP/inventory systems, supplier contracts. In the **prototype**, this layer is entirely replaced by the static/seeded `06_DATA_MODEL.md` demo dataset, clearly labeled.
- **Data Ingestion:** normalizes heterogeneous feeds into `RiskIndicator` and exposure records. Prototype: a static TypeScript module exporting the demo dataset (`/lib/demoData.ts`).
- **Risk Intelligence:** converts raw signals into a risk level (0–100) and trend. Prototype: a pure function `computeRiskLevel(scenarioState)`.
- **Business Exposure Model:** maps company-specific structure (suppliers, routes, storage, contracts) onto the risk level to determine what's actually at stake. Prototype: `computeExposure(company, riskLevel)`.
- **Scenario Engine:** applies the option decay model (07 §1) to produce live `OptionDecayCurve`s and the aggregate Decision Window.
- **Optimization Engine:** brute-force constrained search (07 §5) producing the lowest-cost qualifying action set.
- **Recommendation Engine:** wraps the optimization output with explainability text (07 §6) and manages `RecommendationState`.
- **User Interface:** Next.js app rendering all of the above, with all interactivity driven by local/shared React state — no round trip required for any core interaction.
- **Business Action:** the Action Center's Recommend → Review → Approve → Execute workflow (simulated in prototype; in production this is where the system would trigger real procurement/logistics workflows or API calls to supplier/charter marketplaces).

## Prototype Architecture (What Actually Gets Built)

```
┌─────────────────────────────────────────────┐
│  Next.js 14+ (App Router) + TypeScript       │
│  Tailwind CSS + Recharts + Lucide icons      │
│                                                │
│  /app                                         │
│    /                    → Overview            │
│    /decision-window                           │
│    /cost-of-waiting                           │
│    /simulator                                 │
│    /resilience                                │
│    /network                                   │
│    /ai-insights                               │
│    /action-center                             │
│    /reports                                   │
│    /settings                                  │
│                                                │
│  /lib                                         │
│    demoData.ts        → seeded entities        │
│    engine/                                    │
│      decay.ts         → §1 option decay        │
│      resilience.ts    → §3 score formula        │
│      waiting.ts       → §4 cost of waiting       │
│      optimizer.ts     → §5 brute-force search    │
│      narrative.ts     → §7-9 templated AI text    │
│                                                │
│  /components           → shared UI primitives  │
│  /context              → ScenarioContext (global │
│                           scenario state, React   │
│                           Context + useReducer)   │
└─────────────────────────────────────────────┘
              ↓ deploy
        Vercel (static + serverless, zero config)
```

### Frontend
Next.js App Router, TypeScript throughout for type-safe entity contracts matching 06_DATA_MODEL.md. Tailwind CSS implementing the design tokens in 05_UI_DESIGN_SYSTEM.md as a `tailwind.config.ts` theme extension (colors, spacing, font scale mapped 1:1 to the documented tokens). Recharts for standard charts; bespoke SVG/CSS component for the Decision Window timeline (signature visual, not a stock chart type).

### State Management
A single `ScenarioContext` (React Context + `useReducer`) holds `ScenarioState` and derived results are computed via `useMemo` on every state change — this is what gives "instant recompute" without a backend. `savedScenarios` and `DecisionLogEntry[]` live in the same context, session-scoped (in-memory; no persistence required for the prototype — reset on page reload is acceptable and should be stated in the app, e.g., a small "Demo session — resets on reload" note in Settings).

### Backend
**None required.** All computation in §"Optimization Engine" is fast enough (≤63 subset evaluations) to run client-side in well under the 600ms UX budget. This is a deliberate architecture decision: a backend would add deployment risk and latency for zero functional benefit in a prototype whose entire dataset is static and whose entire "AI" layer is templated/deterministic.

**Optional enhancement (not required for MVP):** a single Next.js API route (`/app/api/ai-narrative/route.ts`) that, given the engine's structured JSON output, calls the Anthropic Messages API to produce more varied narrative phrasing for the Risk Brief/Counterfactual, per `anthropic_api_in_artifacts` guidance — model set to `claude-sonnet-4-6`, structured JSON in, prose out, never asked to invent numbers. This should be built only after the deterministic-template version is fully working, and must have a graceful fallback to the deterministic text if the API call fails or no key is configured (Vercel deployment must not depend on this).

### Data Layer
Static/seeded TypeScript objects (06_DATA_MODEL.md), no database. This is appropriate for a prototype: the objective is decision-model credibility, not data infrastructure.

### AI Layer
Deterministic templated narrative generation (07 §7–9) as the default and required implementation; optional LLM-phrased enhancement as described above. Both paths consume only the Decision Engine's structured output — never independently sourced numbers.

### Simulation Layer
Pure, side-effect-free TypeScript functions in `/lib/engine/`, independently unit-testable, each taking `ScenarioState` (+ static demo data) and returning derived results. This separation (engine vs. UI) is what makes the acceptance criteria in 02_PRODUCT_REQUIREMENTS.md verifiable — the engine can be tested in isolation from rendering.

### Optimization Layer
`optimizer.ts` — brute-force subset search as specified in 07 §5. At 6 candidate actions this is O(2^6), trivially fast; documented as intentionally simple and exhaustive (correct-by-construction) rather than a heuristic, which is itself a defensible design choice to explain to judges: "we chose a provably optimal small search over a black-box heuristic because explainability mattered more than scale, and at this problem size we don't need to trade one for the other."

### APIs
None required for MVP. If the optional LLM narrative route is added, it is the only API surface, and it is server-side only (API key never exposed to client), configured via a Vercel environment variable.

### Authentication
Not required for the prototype (single-tenant demo, no real user data). If desired for realism, a lightweight cosmetic "Signed in as: [Role] — Meridian Fuels" indicator in the top bar can simulate a logged-in state without real auth — explicitly noted in code comments as prototype-only.

### Storage
None required (in-memory React state only). Production evolution would introduce a database (see below) for persisted scenarios, decision logs, and real ingested data.

## Production Evolution (What Changes for a Real Deployment)

| Layer | Prototype | Production |
|---|---|---|
| Data Sources | Static demo dataset | Real feeds: AIS/vessel tracking, freight & war-risk indices, geopolitical risk providers, customer ERP/inventory integration |
| Data Ingestion | None (pre-seeded) | Scheduled ingestion jobs, schema normalization, data quality checks |
| Storage | In-memory | Postgres (entities, scenarios, decision logs) + object storage for reports |
| Auth | Cosmetic only | SSO/enterprise auth (SAML/OIDC), role-based access (COO/CFO/Procurement/Risk roles map to different write permissions) |
| Optimization | Client-side brute force | Server-side; brute force still viable at this problem size, but could scale to a proper MILP solver as option catalogs grow beyond ~20 options |
| AI Layer | Templated / optional LLM phrasing | LLM narrative generation as default, with retrieval over real risk feeds, plus human-review gating before any narrative reaches an executive |
| Business Action | Simulated Execute button | Integration hooks into procurement systems, charter marketplaces, or ERP purchase orders — still gated behind human approval per the same Recommend→Review→Approve→Execute pattern |
| Audit | In-memory Decision Log | Immutable, exportable audit log meeting enterprise compliance requirements |

## Deployment (Vercel)

- Framework preset: Next.js (auto-detected).
- Build command: `next build`; no custom build steps required.
- Environment variables: none required for MVP; `ANTHROPIC_API_KEY` optional only if the enhancement route is implemented, and the app must build and run correctly with it unset.
- No serverless function cold-start risk for core flows since all core computation is client-side.
- Static assets (fonts, icons) bundled, no external CDN dependency beyond standard Next.js font optimization (self-hosted Inter via `next/font`).
