# 05_UI_DESIGN_SYSTEM.md

## Design Intent

NEXUS must read as a **serious enterprise decision-support tool**, closer to a trading terminal or a flight-ops console than a startup marketing dashboard. Calm, dense-but-legible, high information trust. It should look convincing in a static screenshot and even stronger in motion (screen recording) because state changes are visibly causal — a slider moves, a number recomputes, nothing else jumps around.

**Avoid:** neon glow, glassmorphism blur panels, gratuitous 3D, gradient soup, cutesy iconography, more than 2 accent colors on a single screen, chart-junk (3D pie charts, unnecessary drop shadows on data viz).

**Aim for:** the visual register of Bloomberg Terminal × Linear × a modern flight dashboard — restrained, high-contrast-where-it-matters, generous whitespace, one clear focal point per screen.

## Color System

Base neutrals (dark-mode-first, since this suits a "situation room" tool; light mode is a straightforward token swap):

- `--bg-primary`: #0B0E14 (near-black navy, not pure black)
- `--bg-secondary`: #12161F (card backgrounds)
- `--bg-tertiary`: #1A1F2B (nested cards, input backgrounds)
- `--border-subtle`: #262C3A
- `--text-primary`: #EDEFF3
- `--text-secondary`: #9AA3B5
- `--text-muted`: #5F6779

Accent (single primary accent — restraint is the point):
- `--accent-primary`: #3E7BFA (calm, confident blue — used for primary actions, links, focus rings)
- `--accent-primary-hover`: #5A8FFF

Status colors (semantic, used consistently everywhere — never repurposed for decoration):
- `--status-wait`: #3E7BFA (blue — calm, on track)
- `--status-prepare`: #E0A32C (amber — attention needed)
- `--status-act`: #D9534F (measured red, not alarm-siren red — urgent, act now)
- `--status-positive`: #3FB27F (green — resilience gained, loss avoided)
- `--status-negative`: #D9534F (loss, cost, risk)

Light mode equivalents (token swap, same semantics): background #F7F8FA / #FFFFFF / #EEF0F4, text #12161F / #4A5266 / #8A93A6, borders #DFE3EA. Accent and status colors stay the same hex values (they already pass contrast on both).

## Typography

- **Primary typeface:** Inter (UI text, labels, body) — clean, neutral, excellent at small sizes and in tabular numerals mode.
- **Numeric/data typeface:** Inter with `font-variant-numeric: tabular-nums` for all metrics, countdowns, and table figures, so numbers align and don't visually jitter on recompute.
- **Scale:**
  - Display (hero countdown, key metric): 40px / 48px line-height, weight 600
  - H1 (page title): 28px / 36px, weight 600
  - H2 (section header): 20px / 28px, weight 600
  - H3 (card title): 16px / 24px, weight 600
  - Body: 14px / 20px, weight 400
  - Caption/label: 12px / 16px, weight 500, letter-spacing 0.02em, `--text-secondary`
  - Micro (badges, tags): 11px / 14px, weight 600, uppercase, letter-spacing 0.04em

## Spacing System

8px base unit: 4, 8, 12, 16, 24, 32, 48, 64. Card internal padding: 24px (desktop), 16px (mobile). Section gaps: 32px (desktop), 20px (mobile). Never use arbitrary spacing values outside this scale.

## Components

### Cards
- Background `--bg-secondary`, 1px border `--border-subtle`, radius 12px, no drop shadow in dark mode (contrast comes from background layering, not shadow); light mode uses a subtle 1px shadow (0 1px 2px rgba(0,0,0,0.04)).
- Card header: title (H3) + optional right-aligned meta (e.g., "Simulated Data" tag) + optional overflow menu.

### Buttons
- **Primary:** filled `--accent-primary`, white text, radius 8px, height 40px, weight 600. Hover: `--accent-primary-hover`. Disabled: 40% opacity, no pointer.
- **Secondary:** transparent fill, 1px `--border-subtle`, `--text-primary` text. Hover: `--bg-tertiary` fill.
- **Destructive (Reject):** 1px `--status-act` border, `--status-act` text, transparent fill; filled only on confirm step.
- **Ghost/Text:** no border/fill, `--accent-primary` text, used for "Save Scenario," inline links.

### Status Badges
- Pill shape, 4px/10px padding, micro type, colored background at 15% opacity of the status color + full-opacity text of that color + a small dot indicator (never color alone).

### Charts
- Library: Recharts (line, area, bar) for time-series and comparisons; a lightweight custom SVG for the Decision Window timeline lanes (bespoke visualization, not a stock chart type — this is a signature visual and deserves custom construction).
- Chart gridlines: `--border-subtle` at 40% opacity, horizontal only.
- Data series colors: draw from status colors only (never introduce new hues per chart) so meaning stays consistent app-wide — e.g., a "cost" line is always `--status-negative`, "resilience gained" is always `--status-positive`.
- Every chart has a caption line beneath it in `--text-secondary`, 12px: the "what this answers" sentence required by product requirements.

### Sliders
- Track `--bg-tertiary`, filled portion `--accent-primary`, thumb 16px circle with 2px `--bg-primary` ring for contrast, focus state adds `--accent-primary` outer glow ring (2px offset).
- Current value shown as a tabular-nums label above the thumb, updates live while dragging.

### Alerts / Inline Messages
- Warning (over budget, assumptions changed): left 3px border `--status-prepare`, `--bg-tertiary` background, icon + text.
- Error (blocked action): left 3px border `--status-act`.
- Success (approved, saved): left 3px border `--status-positive`.

### Navigation
- Left rail (desktop): 240px wide, `--bg-secondary` background, icon + label per item, active item indicated by a 3px left accent bar + `--accent-primary` icon/text tint (not a filled background block — keeps it calm).
- Top status bar: 56px height, `--bg-primary` background, 1px bottom border, contains the persistent Decision Window countdown, Resilience Score chip, posture badge, right-aligned user/settings.

## Responsive Rules

- Grid: 12-column on desktop (≥1024px), 8-column on tablet (768–1023px), 4-column single-stack on mobile (<768px).
- Cards that sit side-by-side on desktop (e.g., the four Cost of Waiting comparison cards) stack vertically on mobile in priority order (Act Now first).
- Charts: fixed aspect ratio containers that scale width to parent; Decision Window timeline lanes switch from horizontal bars to a vertical stacked list below 480px, each lane becoming a compact row with a mini progress bar instead of a full-width timeline.
- Left nav collapses to icon rail at tablet width, to bottom tab bar at mobile width (see 03_INFORMATION_ARCHITECTURE.md).

## Animation Principles

- Purposeful only: animate to show causality (a number changing because of an input change), never for decoration.
- Standard transition: 160ms ease-out for hover/focus states; 240ms ease-in-out for value changes (e.g., gauge needle moving, countdown recomputing) so the user visually registers "this changed because of what I just did."
- The Recommendation Engine's ≤600ms "computing" state uses a subtle horizontal progress bar (not a spinner) to reinforce "this is doing real work," consistent with the product's decision-engine identity.
- No page-transition animations beyond a 120ms fade — navigation should feel instant, consistent with an enterprise tool, not a marketing site.

## Iconography

- Use a single consistent icon set (Lucide) at 20px default size, 1.5px stroke weight, `--text-secondary` default color, `--accent-primary` or status color only when indicating state.
