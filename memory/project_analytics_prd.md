---
name: project-analytics-prd
description: Full analytics dashboard spec extracted from PDF; PRD created; not yet built as of 2026-05-19
metadata:
  type: project
---

A full product spec PDF ("Database and dashboard spec_doc.pdf") was shared defining 3 analytics dashboard products to build:

1. **Builder/CXO Analytics Dashboard** (P0) — `/analytics` route, KPI strip, inventory heatmap, flat deep-dive sheet, buyer insights matrix, action panel
2. **Sales Dashboard** (P1) — individual salesperson + team manager views, session archetype donut, pitch prompt usage
3. **Post-Session Summary** (P1) — auto-generated per session: buyer type, room preferences, feature sensitivity, objection flags, recommended next flat

PRD saved at `ANALYTICS_DASHBOARD_PRD.md` in project root.

**Why:** The existing app (user management panel) maps to §9.4 of the spec (admin/config panel). The analytics products (§3, §4, §5) are entirely missing.

**How to apply:** When analytics work starts, reference ANALYTICS_DASHBOARD_PRD.md for requirements. Phase 1 = UI shell with mock data. Phase 2 = wire Firestore analytics collections. `recharts` is already installed (v2.15.2).

Key open question: Route strategy — separate `/analytics` vs extending `/dashboard`. See PRD §12.
