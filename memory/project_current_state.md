---
name: project-current-state
description: What the existing NB Dashboard app actually is — user management panel, not analytics; maps to spec §9.4
metadata:
  type: project
---

The current `src/` app is a **User Management Admin Panel** (spec §9.4 — Builder Onboarding Config), not an analytics dashboard.

Built features: admin→builder→sales_manager→member CRUD, Players read-only table, spawn point + gaze object viewer, CSV export, role-based login, shadcn/ui dark theme, public landing page.

**Why this matters:** When someone asks "what analytics does the dashboard show?" — the answer is: none yet. The analytics products are defined in ANALYTICS_DASHBOARD_PRD.md and are Phase 1+ work.

**How to apply:** Don't confuse the existing `/dashboard` (user management) with the analytics dashboards to be built at `/analytics`. Both coexist — existing `/dashboard` stays as-is.
