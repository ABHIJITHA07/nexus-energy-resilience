# 01_PRODUCT_VISION.md

## The Problem (Restated at the Right Depth)

The challenge prompt asks "what would you design if the Strait of Hormuz were unavailable for a sustained period?" The naive answer is a **routing problem**: find another way to move the oil. That is not the problem an energy-dependent business actually has.

A company that depends on Hormuz-transited energy does not lack *a* route. It lacks **certainty about which route, supplier, storage position, or contract will still be available — and at what price — by the time it is forced to decide.**

Every day a business waits without acting:

- Spot charter capacity on alternative routes gets booked by faster-moving competitors.
- Storage capacity fills up.
- Alternative suppliers sign contracts with someone else.
- Insurance and freight premiums rise as risk persists.
- The set of remaining options shrinks *and* the remaining options get more expensive.

This is not a routing problem. It is a **time-and-optionality problem under uncertainty** — closer to real-options finance than to logistics planning. The real question executives face is:

> "Given what I know today, and given that my options are decaying, should I WAIT, PREPARE, or ACT — and what is the cheapest way to reach an acceptable level of resilience before my options run out?"

No dashboard answers that question. A dashboard shows you *what is happening*. NEXUS answers *what you should do about it, and how urgently.*

## User

**Primary:** Chief Supply Chain / Operations Executive at a mid-size energy-dependent company (refiner, fuel distributor, petrochemical manufacturer, or large industrial energy buyer). Owns continuity of supply and carries the political and financial consequences of getting the timing wrong.

**Secondary:** CFO (cares about cost of preparation vs. cost of disruption), Procurement Manager (executes supplier diversification), Logistics Manager (executes transport/storage reservations), Risk Manager (owns the risk model and audit trail), CEO/Board (needs a defensible narrative for a costly decision).

## The Insight

**Resilience is not a state, it is a decaying option.** The value of "being able to act" shrinks every day a crisis persists, and it shrinks at different rates for different options (chartering a tanker decays faster than negotiating a new supplier contract, which decays faster than building a strategic reserve). A company's real decision is a **portfolio allocation problem across decaying options, under a shrinking time budget.**

NEXUS makes that decay visible, quantifies the cost of waiting against it, and recommends the cheapest combination of actions that gets the business to an acceptable resilience level before the window closes.

## Solution Summary

NEXUS is an **AI-assisted Supply Resilience Decision Engine.** It does not track ships or predict geopolitics. It:

1. Ingests a small set of labeled, simulated risk signals related to Hormuz disruption.
2. Translates those signals into **business exposure** for a specific fictional company (Meridian Fuels).
3. Models each resilience **option** (stockpile, alt-supplier, reserve transport, reserve storage, pre-position inventory, demand reduction) as an asset with a **decay curve** — its cost and availability worsen over time.
4. Computes a live **Decision Window** — the number of days before further waiting no longer produces a better outcome than acting today.
5. Lets the executive simulate strategies (single actions or combinations) and see resulting **Cost, Resilience Score, and Potential Loss Avoided** recompute instantly.
6. Recommends the lowest-cost strategy that clears a target resilience threshold, with a plain-language explanation of *why*, *what changed*, and *what assumptions were used*.
7. Routes every recommendation through a **Recommend → Review → Approve → Execute** workflow — the AI never autonomously commits money.

## Differentiation (One Sentence)

Competitors show you the map. NEXUS shows you the clock.

## Product Principles

1. **Time is the primary variable, not risk alone.** Every screen should answer "what does this mean for how long I have to decide?"
2. **No fake omniscience.** NEXUS never claims to predict geopolitical events. All risk indicators are explicitly labeled as simulated/prototype signals, and every AI output states its assumptions.
3. **Explainability is not optional.** Every recommendation carries a "why," a "what changed," and an "assumptions used" — visible in one click, not buried in a settings page.
4. **Humans approve, AI recommends.** No screen allows the AI to execute a financial commitment without explicit human approval.
5. **Depth over breadth.** Every option decay curve, every score, every chart must trace back to a concrete, inspectable number in the demo data model — nothing is decorative.
6. **The product must be understandable in 10 seconds per screen** and defensible in 10 minutes of executive scrutiny.

## Value Proposition by User

| User | What they get |
|---|---|
| COO/Supply Chain Exec | A single number and countdown that tells them how much runway remains before the cheapest options disappear |
| CFO | A cost curve proving that waiting has a quantifiable price, and a lowest-cost path to an acceptable resilience level |
| Procurement | A ranked action list telling them exactly what to lock in today and why |
| Logistics | Visibility into which transport/storage options are decaying fastest |
| Risk Manager | A fully logged, explainable decision trail suitable for board and audit review |
| CEO/Board | A defensible narrative: "here is why we acted on day 9, not day 30" |

## Success Metrics (Prototype-Framed)

Since this is a prototype, "success" is measured as **demonstrated decision quality**, not real revenue:

- Time-to-understanding: a new user can state the company's current recommended action within 30 seconds of landing on Overview.
- Decision defensibility: every recommendation is traceable to inputs a reviewer can inspect and challenge.
- Scenario responsiveness: changing any single input (risk level, budget, duration) visibly and correctly changes the Decision Window, Cost of Waiting, and Recommendation within one interaction.
- Memorability: a judge who sees 20 submissions should recall NEXUS as "the one with the countdown," not "another AI dashboard."

*(A companion Business & GTM document, 10_BUSINESS_AND_GTM.md, translates this into a real-world ROI model for a production version.)*
