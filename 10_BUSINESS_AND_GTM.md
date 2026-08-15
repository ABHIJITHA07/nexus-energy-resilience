# 10_BUSINESS_AND_GTM.md

## Business Model

**Model:** Enterprise SaaS subscription — "Supply Resilience Intelligence" — sold as an annual license per business unit, with usage-based add-ons for high-stakes simulation and emergency activation support.

### Who pays
Mid-to-large energy-dependent enterprises with concentrated chokepoint exposure: refiners, fuel distributors, petrochemical manufacturers, shipping-dependent industrials, and large institutional energy buyers (utilities, airlines, manufacturers with single-region sourcing). The buyer is typically the Chief Supply Chain Officer or VP of Procurement, with CFO sign-off given the spend size.

### Why they pay
Because the cost of a bad timing decision during a real disruption dwarfs the subscription cost. A single week of mistimed procurement during a genuine Hormuz-type event can cost a mid-size energy company tens of millions in emergency spot premiums and contractual penalties — the category NEXUS exists to prevent. The purchase is insurance-adjacent: a defensible, board-presentable decision process, not just software.

### Pricing Concept (illustrative, not a commitment)
- **Core tier** ("Resilience Monitor"): $180K/year — exposure modeling, Resilience Score, Decision Window for one chokepoint category, quarterly refresh.
- **Decision tier** ("Resilience Engine"): $420K/year — adds live scenario simulation, Strategy Builder, Recommendation Engine, unlimited saved scenarios, multi-chokepoint support.
- **Enterprise tier**: custom pricing — adds real-time data integrations (freight/insurance/AIS feeds), SSO, multi-business-unit rollup, dedicated crisis activation support (a named team on-call during active disruption events), and API access for ERP/procurement integration.
- **Emergency Activation add-on**: a per-incident retainer that guarantees analyst support and expedited data refresh during an active chokepoint disruption — this is the highest-margin, highest-relevance offering, since it monetizes exactly the moment the product's value is most obvious.

### What value they receive
1. A quantified, defensible answer to "why are we spending money on preparation now, specifically now" — replacing gut-feel timing with a documented decision window and cost-of-waiting analysis.
2. A lowest-cost path to an acceptable resilience posture, avoiding both over-preparation (wasted capex) and under-preparation (shortage exposure).
3. An audit trail suitable for board and insurer scrutiny after the fact.

### ROI Framing
`ROI = (Avoided Emergency Premium + Avoided Contractual Penalty + Avoided Production Downtime) − (Subscription Cost + Preparation Actions Taken)`
A single avoided emergency spot-charter premium event (commonly 3–8x normal freight rates during acute regional disruptions) typically exceeds the annual subscription cost outright — this is the core sales argument, not a soft "efficiency" pitch.

## Go-to-Market

### First customer segment (the wedge)
Mid-size independent fuel distributors and refiners in Hormuz-adjacent or Hormuz-dependent markets (South/Southeast Asia, parts of East Africa) — large enough to have real procurement budgets and board-level risk scrutiny, small enough to lack an internal team already building this in-house (unlike supermajors, who may have proprietary trading-desk equivalents).

### Initial wedge
Lead with **Cost of Waiting**, not the full platform. The single most viral, easy-to-demo artifact is: "here is what your specific mistimed decision would cost you, using your own numbers." This is sold initially as a **paid diagnostic engagement** (a scoped 4–6 week assessment producing a company-specific Decision Window and Cost-of-Waiting model), which converts into the subscription once the customer has seen their own exposure quantified.

### Sales motion
High-touch enterprise sales (not self-serve) — the buyer needs to trust the model's assumptions, which requires a guided onboarding where NEXUS's team encodes the customer's actual supplier/route/storage structure into the exposure model. Sales cycle target: 3–4 months from diagnostic to signed subscription, anchored to the customer's own board reporting calendar (companies are most receptive right after a risk committee meeting flags chokepoint exposure).

### Pilot structure
90-day pilot with a single business unit: Weeks 1–3 data onboarding (supplier/route/storage/contract structure), Weeks 4–6 model calibration against the customer's own historical procurement costs (to validate the decay/cost curves aren't fictional to the customer, even though seeded data is used in the sales demo), Weeks 7–12 live use during the pilot's board reporting cycle, with success measured by whether the Decision Window / Recommendation actually gets used in a real procurement conversation.

### Expansion
Land in one business unit (typically the most chokepoint-exposed one) → expand to additional chokepoints (Suez, Malacca, Panama, Bab-el-Mandeb) using the same decay/optimization engine with a different exposure map → expand to additional business units/subsidiaries → expand into the Emergency Activation retainer once the customer has lived through at least one real risk-level spike using the product.

### Customer success / measurable outcomes
- Time from risk-level increase to executive review of updated recommendation (target: same business day).
- % of board-reported resilience decisions that reference a NEXUS Decision Window / Cost of Waiting figure.
- Realized savings vs. modeled "wait" cost in any period where the customer actually faced elevated Strait risk.

### Partnerships
- **Data partners:** freight index providers, marine insurance/war-risk underwriters, AIS tracking providers — for production-grade `RiskIndicator` feeds.
- **Channel partners:** supply-chain risk consultancies and trade-credit insurers, who already sell into the same buyer and can bundle NEXUS as the quantification layer behind their advisory work.
- **Not pursued:** a supplier/marketplace matching model (connecting customers to alternate suppliers/charters directly) — deliberately excluded from the core business model because it would create a conflict of interest (NEXUS recommending options it has a commercial stake in) that undermines the trust the product is built on. NEXUS informs the decision; it does not broker the transaction.
