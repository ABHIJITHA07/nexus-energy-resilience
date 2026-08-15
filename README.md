# NEXUS — AI-Assisted Supply Resilience Decision Engine

> **"Know when to act before your options disappear."**

NEXUS is an enterprise-grade decision support platform built for **Meridian Fuels** to navigate sustained chokepoint disruptions (such as the Strait of Hormuz). Rather than treating supply continuity as a static routing problem, NEXUS models resilience as a **decaying portfolio of real options under time pressure and uncertainty**.

## Quick Start

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the NEXUS Decision Console.

## Core Features & Architecture

1. **Exposure Overview (`/`)**: Situation report detailing Meridian's 64% Hormuz supply exposure, composite resilience score, aggregate countdown window, and top vulnerability remediation.
2. **Decision Window (`/decision-window`)**: Interactive horizontal option decay timeline rendering viability compression ($cost(t) = base \times (1 + growth)^t$).
3. **Cost of Waiting (`/cost-of-waiting`)**: 4-horizon financial comparison (Act Now vs Wait 3/7/14 days) and custom delay simulation with breakeven curve.
4. **Scenario Simulator (`/simulator`)**: 3-column strategy builder with 7 interactive scenario sliders, 6 action selections, live budget meter, and non-linear diminishing-returns score math.
5. **Resilience Assessment (`/resilience`)**: 5-factor weighted breakdown (Supplier Concentration, Inventory Runway, Transport Flexibility, Storage Buffer, Demand Flexibility).
6. **Supply Network (`/network`)**: Dependency map highlighting Hormuz transit corridors with accessible mobile table fallbacks.
7. **AI Insights (`/ai-insights`)**: Deterministic AI Risk Brief narrative, counterfactual model, and saved scenario efficiency rankings.
8. **Action Center (`/action-center`)**: Recommend $\rightarrow$ Review $\rightarrow$ Approve $\rightarrow$ Execute state machine with audit decision log.
9. **Board Summary (`/reports`)**: Executive board memorandum with print styling.
10. **Model Settings (`/settings`)**: Configurable target thresholds and capital budget caps.

## Built With

- **Next.js 14+** (App Router, React 18, TypeScript Strict Mode)
- **Tailwind CSS** (Custom terminal visual theme `#0B0E14` dark palette)
- **Recharts** & Bespoke SVG Visualizers
- **Lucide React** Icons
