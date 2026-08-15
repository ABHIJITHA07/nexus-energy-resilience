# 06_DATA_MODEL.md

## Demo Company: Meridian Fuels

**Meridian Fuels** is a fictional mid-size fuel distributor and light refiner based in a Gulf-of-Oman-adjacent Asian market. It imports crude and refined products, blends and stores them, and distributes to industrial and retail customers. All figures below are illustrative prototype data, clearly not real.

- Annual revenue: $2.1B (fictional)
- Daily throughput: ~180,000 barrels/day equivalent
- Hormuz-linked supply share: **64%** of total crude/fuel input (the core exposure number)
- Primary customers: industrial manufacturing (41%), retail fuel network (33%), power generation contracts (26%)
- Contractual exposure: 3 long-term offtake contracts with penalty clauses for supply interruption >10 days

All figures are labeled `Prototype Data` in the UI wherever displayed.

## Core Entities

### `Company`
```
{
  id, name: "Meridian Fuels",
  dailyThroughputBbl: 180000,
  hormuzExposurePct: 64,
  annualRevenueUsd: 2100000000,
  customerSegments: [{ name, pctOfRevenue }]
}
```

### `Supplier`
```
{
  id, name, region, hormuzDependent: boolean,
  volumeSharePct,      // % of Meridian's total input from this supplier
  contractType: "spot" | "term",
  alternativeLeadTimeDays  // time to stand up as emergency alt-supplier if not currently used
}
```
Demo suppliers:
| id | name | region | hormuzDependent | volumeSharePct | contractType |
|---|---|---|---|---|---|
| SUP-1 | Al-Rashid National Crude | Persian Gulf | true | 38% | term |
| SUP-2 | Straitline Petroleum Co. | Persian Gulf | true | 26% | spot |
| SUP-3 | Meridian West Terminal | West Africa | false | 14% | term |
| SUP-4 | Pacific Rim Fuels | SE Asia | false | 12% | spot |
| SUP-5 | Northshore Crude Alliance | Non-Gulf domestic | false | 10% | term |

### `Route`
```
{ id, from, to, mode: "tanker" | "pipeline" | "rail",
  hormuzDependent: boolean, normalCapacityKbd, currentUtilizationPct,
  altModeAvailable: boolean }
```
Demo routes: `RT-1` Gulf→Meridian Terminal (tanker, Hormuz, 120 kbd, 88% utilized), `RT-2` West Africa→Meridian (tanker, non-Hormuz, 40 kbd, 55%), `RT-3` Domestic rail spur (rail, non-Hormuz, 15 kbd capacity, 20% utilized, expandable).

### `StorageSite`
```
{ id, name, capacityKb, currentFillPct, drawdownRateKbPerDay }
```
Demo: `ST-1` Meridian Terminal Tank Farm (2,400 kb capacity, 61% full), `ST-2` Leased Coastal Reserve (800 kb capacity, 20% full, lease-activation lead time 5 days).

### `InventoryPosition`
```
{ id, productType, currentVolumeKb, dailyConsumptionKb, runwayDays (derived) }
```

### `RiskIndicator` (simulated, explicitly prototype-labeled)
```
{ id, name, currentLevel: 0-100, trend: "rising"|"stable"|"falling",
  lastUpdatedLabel: "Simulated — updates on scenario change" }
```
Demo indicators: "Strait Transit Disruption Index" (simulated 0–100 composite, not tied to any real feed), "Freight & Insurance Premium Index", "Regional Escalation Signal" — all clearly labeled `Simulated Indicator — Prototype Data, not a live feed.`

### `ResilienceOption` (the core decay-modeled entity)
```
{
  id, name, category,
  baseCostUsd,             // cost if acted on today
  costGrowthRatePctPerDay, // how fast cost rises as time passes / risk persists
  daysUntilImpractical,    // baseline window before this option is effectively gone
  resilienceContribution,  // 0-100 scale marginal contribution if fully executed alone
  leadTimeDays
}
```
Demo options (baseline, at current risk level):

| id | name | baseCostUsd | costGrowthRate/day | daysUntilImpractical | resilienceContribution |
|---|---|---|---|---|---|
| OPT-1 | Stockpile (buy + store 15 days extra inventory) | $4.2M | 1.8% | 12 | 22 |
| OPT-2 | Diversify Supplier (activate SUP-4/SUP-5 as term contracts) | $2.6M | 2.4% | 18 | 28 |
| OPT-3 | Reserve Transport (charter non-Hormuz tanker capacity) | $3.1M | 3.6% | 9 | 18 |
| OPT-4 | Reserve Storage (activate ST-2 lease) | $1.4M | 1.1% | 20 | 12 |
| OPT-5 | Pre-position Inventory (forward-stage at ST-2) | $2.0M | 2.0% | 14 | 15 |
| OPT-6 | Reduce Non-Critical Demand (renegotiate 2 lowest-margin contracts) | $0.6M | 0.4% | 30 | 10 |

*Cost growth and decay are modeled as `cost(t) = baseCostUsd * (1 + costGrowthRatePctPerDay/100)^t`, capped at "impractical" (treated as unavailable) once `t ≥ daysUntilImpractical` at the current risk level. Risk level scales `costGrowthRatePctPerDay` and shortens `daysUntilImpractical` — see 07_AI_AND_DECISION_ENGINE.md for the full formula.*

### `ScenarioState` (global, session-persisted)
```
{
  disruptionDurationAssumptionDays,  // slider: 15-180, default 45
  riskLevel,                          // slider: 0-100, default 55
  currentInventoryKb,                 // slider, default = InventoryPosition value
  supplierAvailabilityPct,            // slider: how much of alt-supplier capacity is assumed available, default 70
  transportCapacityPct,               // slider: default 60
  demandLevelPct,                     // slider: default 100
  budgetCapUsd,                       // input, default $8M
  selectedActionIds: string[]
}
```

### `ScenarioResult` (derived, not stored — recomputed)
```
{
  totalCostUsd, resilienceScore (0-100), potentialLossAvoidedUsd,
  decisionWindowDays, postureRecommendation: "WAIT"|"PREPARE"|"ACT"
}
```

### `WaitingComparison`
```
{ label: "Act Now"|"Wait 3"|"Wait 7"|"Wait 14",
  waitDays, preparationCostUsd, expectedLossExposureUsd, netOutcomeUsd }
```

### `ResilienceFactor`
```
{ id, name, weightPct, currentValue0to100, contributionToScore }
```
Demo factors: Supplier Concentration (weight 25%), Inventory Runway (weight 20%), Transport Flexibility (weight 20%), Storage Buffer (weight 20%), Demand Flexibility (weight 15%).

### `SupplyNetworkNode` / `SupplyNetworkEdge`
```
Node: { id, type: "supplier"|"route"|"storage"|"company", label, hormuzDependent }
Edge: { from, to, volumeSharePct }
```

### `RecommendationState`
```
{ recommendedActionIds: string[], state: "Recommended"|"UnderReview"|"Approved"|"Executed",
  rationaleSummary, assumptionsUsed: string[], lastUpdated }
```

### `DecisionLogEntry`
```
{ id, timestampLabel, actor: "System"|"User (COO role)", action, fromState, toState }
```

## Relationships

```
Company 1---* Supplier
Company 1---* Route
Company 1---* StorageSite
Company 1---* InventoryPosition
Company 1---* RiskIndicator
Company 1---* ResilienceOption
Supplier *---* Route (a route moves volume from a supplier)
Route *---* StorageSite (a route delivers into a storage site)
ScenarioState 1---1 ScenarioResult (derived)
ScenarioState 1---* WaitingComparison (derived, 4 fixed points)
ScenarioState 1---1 RecommendationState (derived, then user-mutated via Action Center)
RecommendationState 1---* DecisionLogEntry
```

## Data Labeling Requirement

Every screen displaying `RiskIndicator`, AI-generated narrative, or any figure derived from the simulation engine must show a small "Prototype / Simulated Data" tag. This is a hard UI requirement, not optional polish — it is what keeps the product honest about not predicting real geopolitical events.
