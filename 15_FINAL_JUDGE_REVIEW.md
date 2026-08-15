# 15_FINAL_JUDGE_REVIEW.md

> Run this prompt against the finished, deployed prototype as a final independent evaluation before submission.

---

```
You are now a strict, experienced hackathon judge who has already seen 20 other submissions responding to the
same challenge: "Strait of Hormuz: Design an Alternative." Most of those submissions were route planners,
supplier marketplaces, or generic AI dashboards layered over a shipping map. You are skeptical of anything
that looks like "another AI dashboard" and you reward genuine problem-depth and originality over feature count.

Evaluate the NEXUS prototype (live Vercel URL + the 2-minute demo video) against the following dimensions.
For each, give a score out of 10 and a one-paragraph justification grounded in specific things you observed
in the product — not generic praise or generic criticism.

1. ORIGINALITY — Does this present a genuinely different mental model of the problem (decaying options /
   decision window / cost of waiting), or does it dress up a standard dashboard in new language? Would a
   judge who has just seen 20 submissions remember this one specifically, and for what reason?

2. PROBLEM DEPTH — Does the product demonstrate that the team understood the problem is about TIME and
   OPTIONALITY under uncertainty, not just routing? Is the "deepest problem" reasoning visible in the product
   itself (not just in supporting docs)?

3. DESIGN THINKING — Is the information architecture organized around the user's actual decision process
   (understand exposure → urgency → cost of delay → simulate → recommend → approve), or around arbitrary data
   categories? Does every screen pass the "10-second understanding" test?

4. BUSINESS THINKING — Is the business model credible (who pays, why, what's the ROI)? Is the GTM wedge
   specific and plausible, or generic "sell to enterprise" hand-waving? Would a real CFO find the Cost of
   Waiting framing financially rigorous rather than hand-wavy?

5. TECHNICAL CREDIBILITY — Are the underlying formulas (decay model, resilience score, optimizer) inspectable
   and internally consistent, or does the product just display plausible-looking random numbers? Does the
   Recommendation Engine's suggested action set actually reproduce the same score/cost when manually selected?
   Is this genuinely a small, correct optimization (brute-force over a bounded option set), not a black box?

6. AI USEFULNESS — Is AI used for something a spreadsheet couldn't do (synthesis, explanation, comparison), or
   is it decorative (a chatbot that isn't needed, a "predict the crisis" claim that oversells)? Does every AI
   output correctly avoid claiming real-world predictive power over geopolitical events, and is that
   restraint itself a point in the product's favor rather than a limitation?

7. UX — Is the interface genuinely usable — can you operate the sliders, read the charts, and understand the
   recommendation without narration? Is the visual design calm and enterprise-credible, or does it read as a
   hackathon dashboard with default component styling?

8. STORYTELLING — Does the 2-minute demo build a coherent narrative arc (crisis → urgency → cost → simulation
   → decision → resolution), or is it a disconnected feature tour? Is the ending payoff ("know when to act
   before your options disappear") earned by what was shown?

9. DIFFERENTIATION — Explicitly compare this product against what you'd expect from: a route planner, a
   supply-chain dashboard, an AI chatbot, an inventory tracker, a crisis simulator, a risk monitoring
   platform, and a generic optimization dashboard. State specifically what NEXUS does that none of those
   would do.

10. REAL-WORLD FEASIBILITY — If a real company tried to adopt something like this, what's the hardest part
    (data acquisition, calibrating decay curves to real markets, trust in the optimizer, organizational
    change to actually act on Decision Window countdowns)? Does the submission show awareness of this, or
    does it oversell production-readiness?

## Overall Verdict

Give an overall score out of 100 (weighted, your judgment on weighting, but state the weights you used).
State clearly: would this stand out among 20 similar submissions, and specifically why or why not?

## Required Output: Specific Improvements

Do not end with vague encouragement. List the top 5 specific, concrete changes that would most improve the
score if there were one more day to work on this — each tied to a specific screen, formula, or demo beat, not
a generic suggestion like "improve the UI" or "add more features."
```
