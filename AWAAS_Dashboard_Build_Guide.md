# AWAAS Web Dashboard — Engineering Build Guide

**For:** Web Dashboard scope only (VR app, tablet app, rendering pipeline are out of scope here)
**Audience:** You + Claude Code
**Date:** 2026-05-25
**Status of inputs:** NB Dashboard (built), Database/Dashboard spec (PRD #2), AWAAS PRD v3.0 (current target)

---

## 0. Read this first — the one decision that drives everything

The three documents describe the same product at three stages, and they **conflict**. You must consciously resolve the conflicts before writing code. Here is the resolution table — treat it as law for this build:

| Topic | NB Dashboard (built) | PRD #2 | AWAAS PRD v3.0 (current) | **What we do** |
|---|---|---|---|---|
| Auth | Plaintext pw in Firestore, 4-collection lookup | Firebase Auth, no pw in DB | REST API + RBAC (Builder/Sales/Admin/AWAAS) | **API token auth.** Stop trusting Firestore for login. |
| Source of truth | Firestore | Firestore | **PostgreSQL** (immutable events) | Dashboard reads the **API**, never Postgres directly. |
| Analytics store | Firestore subcollections | Firestore | **ClickHouse** (pre-aggregated) | Dashboard reads the **API**, never ClickHouse directly. |
| Firebase role | Everything | Everything | **Ephemeral only** — live session, flushed at end. **Never historical/analytics.** | Dashboard uses Firebase ONLY for the live sales tablet panel (if at all). All dashboard analytics come from the API. |
| Data isolation | `created_by` string parsing | `parentId` filtering | Builder-isolated by `project_id`, enforced server-side | Enforce in API; dashboard sends token, server scopes data. |

**The headline:** Your current dashboard reads VR analytics straight out of Firestore. AWAAS v3.0 says that is architecturally forbidden. So the **data layer must be rebuilt to talk to a REST API.** Everything else you built (auth flow shape, hierarchy concept, tables, modals, role gating, CSV export, design system) is reusable.

---

## 1. What we are actually building (web scope)

From AWAAS PRD **Section 8** (Web Dashboards) + **Section 5.3** (Annotation Tool) + **Section 7.5** (API). Four web deliverables, in priority order:

1. **Builder / CXO Dashboard** — the revenue product. Project overview, inventory (per-flat engagement + drop-off risk + completion + gaze heatmap), segment view. *Highest priority.*
2. **Sales Dashboard** — Individual salesperson view + Sales Manager team view. Pitch effectiveness, engagement quality, conversion correlation.
3. **AWAAS Admin Dashboard** — internal: data health, ingestion monitoring, zone attention, render-mode A/B comparison. *Can be stubbed this month.*
4. **Web Annotation Tool** (Section 5.3) — standalone browser app to draw ROI zones on panoramas / tag 3D meshes, export JSON. *Separate app; likely out of this month's scope but note it exists.*

**Explicitly NOT web scope:** VR rendering (Modules 1–2), gaze capture (Module 2.4), tablet *VR control* (the teleport/session-control surface lives on the tablet, not the browser). The Sales Dashboard's *analytics* are web; the live session *control* is tablet.

> The "Sales Control Tablet" in the spec docs is a **tablet app**, not your web dashboard. The web Sales Dashboard shows *post-hoc analytics* about sales performance. Don't conflate them. Live-session panels (engagement updating every 5s) are Phase 2.5 and tablet-side.

---

## 2. The clean separation: Database ↔ API ↔ Dashboard

This is the mental model. Three tiers, and **the dashboard only ever touches the middle tier.**

```
┌─────────────────────────────────────────────────────────────┐
│  DATA TIER  (you do NOT connect to these from the browser)    │
│                                                               │
│  Firebase Firestore  →  live session only, flushed at end     │
│  PostgreSQL          →  source of truth, raw immutable events │
│  ClickHouse          →  pre-aggregated analytics tables       │
│  S3/GCS              →  voice audio files                     │
└───────────────────────────┬───────────────────────────────────┘
                            │  (server-side only)
┌───────────────────────────▼───────────────────────────────────┐
│  API TIER  (REST, HTTPS, RBAC, builder-isolated, OpenAPI)     │
│                                                               │
│  /auth/login          /projects        /flats/:id/metrics     │
│  /projects/:id/overview  /segments     /sales/...   /export   │
│  Token carries role + project scope. Server enforces isolation.│
└───────────────────────────┬───────────────────────────────────┘
                            │  HTTPS + Bearer token (the ONLY line the browser crosses)
┌───────────────────────────▼───────────────────────────────────┐
│  DASHBOARD TIER  (React SPA — what you build)                 │
│                                                               │
│  Pages → hooks (useQuery) → apiClient → fetch(API)            │
│  Never imports firebase/firestore for analytics.              │
│  ONE adapter module is the only thing that knows the API URL. │
└───────────────────────────────────────────────────────────────┘
```

**Why this matters for you specifically:** because the backend (Postgres/ClickHouse/API) probably isn't ready this month, you build the dashboard against a **mock implementation of the API contract**. When the real API lands, you flip one env flag. The dashboard code doesn't change. This is the whole trick to not being blocked.

---

## 3. The API contract (build the dashboard against THIS, not against a database)

Define the contract first; it's the seam between you and the backend team. Below is the minimum viable contract derived from PRD Section 8 + the data-point tables in spec doc Section 7C.

### Auth
```
POST /auth/login            { email, password } → { token, role, scope }
                            role ∈ {builder, cxo, sales_exec, sales_head, awaas_admin}
                            scope = { project_ids: [...], salesperson_id? }
GET  /auth/me               → { user, role, scope }   (validate token on load)
```

### Builder / CXO
```
GET /projects                                  → [{ project_id, name, location, price_band, flat_count }]
GET /projects/:id/overview                     → {
        engagement_score, engagement_trend_pct,
        drop_off_risk: "LOW|MEDIUM|HIGH", drop_off_pct,
        top_buyer_driver: { feature, influence_pct },
        weakest_area: { room, avg_dwell_pct },
        session_count, avg_duration_sec, sparkline: [...]
     }
GET /projects/:id/flats                        → [{ flat_id, flat_number, config, engagement_score,
                                                    risk: "GREEN|AMBER|RED", trend_pct,
                                                    primary_issue, suggested_action }]
GET /flats/:id/deep-dive                       → {
        engagement_trend: [...], drop_off_rate, session_count,
        room_breakdown: [{ room, pct }],          // for heatmap/bars
        issues: [string], suggested_actions: [{ text, impact }]
     }
GET /projects/:id/segments                     → {
        matrix: [{ segment, rooms: { living, balcony, kitchen, vastu } }],
        feature_sensitivity: [{ feature, score_pct }]
     }
GET /projects/:id/action-recommendations       → [{ flat_id, problem, fix, priority, status }]
POST /action-recommendations/:id/status        { status: "actioned|assigned" }
```

### Sales
```
GET /sales/me/summary                          → { sessions_handled, avg_engagement, conversion_corr,
                                                    prompt_usage_pct, archetype_breakdown: {...},
                                                    top_objections: [...] }
GET /sales/team/summary       (sales_head only) → { reps: [{ id, name, sessions, avg_engagement,
                                                    prompt_usage_pct, completion_pct, conversion_corr }] }
GET /sessions/:id/summary                      → { full post-session summary object }
```

### AWAAS Admin (stub OK this month)
```
GET /admin/data-health      → { sessions_per_project, event_completeness_pct, sync_failure_rate, alerts }
GET /admin/render-comparison → { panoramic: {...}, threeD: {...} }   // pilot A/B
```

### Export (PRD 7.8)
```
GET /export/sessions.csv?project_id=...   → session-level CSV
GET /export/events.csv?project_id=...     → event-level CSV
```

**Action for Claude Code:** generate an OpenAPI/Swagger YAML from this contract and commit it as `api-contract.yaml`. It becomes the shared truth for both frontend and backend, and you can generate mock responses + TypeScript-style JSDoc types from it.

---

## 4. Frontend architecture (React — reusing your NB stack)

Keep your proven stack: **React 19 + Vite + Tailwind v3 + shadcn/ui + react-router v7 + react-hook-form + Sonner + lucide + motion**. Two changes:

1. **Add a server-state library: TanStack Query (React Query).** Your NB app used raw `useState` + manual `Promise.all`. For a dashboard with caching, loading/error states, refetch, and many endpoints, React Query removes a huge amount of boilerplate and gives you the skeleton-loader / error-retry behaviour the PRD mandates (Section 8.4) for free.
2. **One data-access seam.** All network access goes through `src/api/`. Nothing else imports `fetch` or `firebase`.

### Folder structure
```
src/
├── api/
│   ├── client.js          # base fetch wrapper: baseURL, Bearer token, error normalise
│   ├── endpoints.js       # one function per API route (typed via JSDoc)
│   ├── mock/              # mock JSON + a mock adapter (MSW or simple switch)
│   │   ├── overview.json
│   │   ├── flats.json
│   │   └── handlers.js
│   └── config.js          # VITE_USE_MOCK flag, VITE_API_BASE_URL
├── hooks/                 # useProjectOverview, useFlats, useFlatDeepDive, useSalesSummary...
├── context/
│   └── AuthContext.jsx    # token-based (reuse your shape, drop Firestore lookup)
├── components/
│   ├── ui/                # shadcn (reuse as-is)
│   ├── KpiCard.jsx        # evolve from StatsCard.jsx
│   ├── InventoryHeatmap.jsx
│   ├── FlatDeepDivePanel.jsx   # evolve from PlayerDetailSheet.jsx (it's a Sheet — perfect)
│   ├── SegmentMatrix.jsx
│   ├── FeatureSensitivityBars.jsx
│   ├── ActionRecommendationCard.jsx
│   ├── DataTable.jsx      # evolve from UserTable.jsx (sort/search/paginate already done)
│   ├── Sidebar.jsx        # reuse, swap nav items
│   └── Layout.jsx         # reuse
├── pages/
│   ├── Login.jsx          # reuse layout, swap auth call
│   ├── BuilderOverview.jsx
│   ├── InventoryIntelligence.jsx
│   ├── BuyerInsights.jsx
│   ├── SalesPerformance.jsx
│   ├── SalesExecDashboard.jsx
│   ├── AdminDashboard.jsx      # stub
│   └── NotFound.jsx
├── lib/
│   ├── format.js          # number/%/duration/date formatters
│   ├── risk.js            # risk → colour mapping (GREEN/AMBER/RED)
│   └── csv.js             # reuse your CSV export logic
└── charts/                # recharts wrappers: TrendLine, BarH, Donut, Scatter, HeatMatrix
```

### Charting
PRD needs: sparklines, horizontal bars (room breakdown), donut (archetypes), scatter (engagement vs conversion), trend lines, heat-matrix (segment × room). **Use `recharts`** — it covers all of these, plays well with React 19, and is one dependency. Wrap each chart type once in `src/charts/` so pages stay clean.

### What to literally reuse from NB (do not rewrite)
- `UserTable.jsx` → `DataTable.jsx`: the sort/search/paginate/skeleton/empty-state logic is exactly what the inventory and sales tables need.
- `PlayerDetailSheet.jsx` → `FlatDeepDivePanel.jsx`: PRD 3.4 *is* a right-slide panel. You already built one.
- `StatsCard.jsx` → `KpiCard.jsx`: add hover sparkline + click-to-deep-dive (PRD 3.3).
- `Sidebar.jsx` / `Layout.jsx`: reuse wholesale, change nav arrays per role.
- `Login.jsx`: reuse the two-panel layout; replace the Firestore lookup with `POST /auth/login`.
- CSV export from `Dashboard.jsx`: reuse, point at `/export` endpoints.

### What to delete / not carry over
- `firebase/authService.js` plaintext login → gone.
- `firebase/userService.js` Firestore reads for analytics → gone (replaced by `api/endpoints.js`).
- `config.js` Firestore `db` export → keep ONLY if you implement the live tablet panel; otherwise remove.

---

## 5. Auth & RBAC (fixing the security holes)

The current "search 4 collections for a plaintext password" is a security liability and contradicts both later specs. New flow:

1. `Login.jsx` posts `{email, password}` to `/auth/login`.
2. Server verifies (bcrypt/argon2 server-side), returns `{ token, role, scope }`.
3. Store token in memory + (optionally) `httpOnly` cookie set by the server. **Avoid localStorage for the token** if you can use a cookie — XSS-safer. If the API can't set cookies, localStorage is the fallback, same as NB.
4. `AuthContext` exposes `{ user, role, scope, login, logout }` — same shape you already have, so your `ProtectedRoute` and role-gated nav barely change.
5. **RBAC is enforced server-side** (the token's scope decides what data returns). Frontend role checks are *only* for hiding UI (PRD 7.1) — never for security.

Role → nav map (replaces your admin/builder/sales_manager/member map):

| Role | Nav |
|---|---|
| `cxo` / `builder` | Overview, Inventory Intelligence, Buyer Insights, Sales Performance, Settings |
| `sales_head` | Sales (team), own sessions |
| `sales_exec` | Own sessions + post-session summaries |
| `awaas_admin` | Data Health, Render Comparison, Zone Attention |

---

## 6. How data flows end-to-end (one concrete trace)

Builder opens the dashboard and clicks flat 3BHK-1204:

```
1. App loads → AuthContext calls GET /auth/me with stored token → {role:cxo, scope:{project_ids:[Z1]}}
2. BuilderOverview mounts → useProjectOverview("Z1") → React Query → apiClient.get("/projects/Z1/overview")
       → (mock mode) returns overview.json   |   (real mode) hits API → API queries ClickHouse flat_metrics
3. KPI cards + InventoryHeatmap render. Skeleton loaders show while pending (React Query isLoading).
4. User clicks the 3BHK-1204 tile → opens FlatDeepDivePanel (Sheet) → useFlatDeepDive("1204")
       → GET /flats/1204/deep-dive → room_breakdown + issues + suggested_actions
5. User clicks "Assign to sales team" → POST /action-recommendations/:id/status {status:"assigned"}
       → React Query invalidates the recommendations query → card updates.
6. Export → GET /export/sessions.csv?project_id=Z1 → browser downloads CSV.
```

At no point does the browser see Postgres, ClickHouse, or Firestore. **That is the architecture working correctly.**

The backend's job (not yours this month, but for the contract): on each request, validate token → translate to a scoped SQL/ClickHouse query → return JSON. Raw events live in Postgres `session_events` (immutable). ETL (every 15–30 min) rolls them into ClickHouse `flat_metrics`, `segment_metrics`, `session_metrics`. The API reads ClickHouse for dashboards (fast, pre-aggregated) and Postgres for drill-downs.

---

## 7. Build order (sprint plan for Claude Code)

Work in this sequence; each step is independently demoable.

**Phase 0 — Scaffold (½ day)**
- Vite + React 19 + Tailwind + shadcn (copy your 11 components). Install `@tanstack/react-query`, `recharts`.
- Set up `src/api/client.js`, `config.js` with `VITE_USE_MOCK=true`, and MSW (or a simple fetch-switch) for mocks.
- Commit `api-contract.yaml`.

**Phase 1 — Auth shell (½ day)**
- Token-based `AuthContext`, `ProtectedRoute`, role-based `Sidebar`/`Layout`, `Login.jsx`. Mock `/auth/login`.

**Phase 2 — Builder Overview (2 days)** ← the money screen
- KPI strip (4 cards, hover sparkline, click deep-dive).
- Inventory heatmap (flat tiles, risk colours) + list view toggle.
- Wire to mock `/projects/:id/overview` + `/flats`.

**Phase 3 — Flat Deep-Dive panel (1 day)**
- Right-slide Sheet: engagement trend, room breakdown bars, issues, ranked actions, action buttons.

**Phase 4 — Buyer Insights (1 day)**
- Segment × room matrix (heat fill) + feature sensitivity bars. Action recommendation cards.

**Phase 5 — Sales Dashboards (1.5 days)**
- Individual: KPIs, archetype donut, objection list, prompt usage. Team view for sales_head.

**Phase 6 — Export + polish (1 day)**
- CSV export endpoints, loading/error states everywhere, responsive, AWAAS white theme.

**Phase 7 — AWAAS Admin stub + swap to real API (when ready)**
- Flip `VITE_USE_MOCK=false`, set `VITE_API_BASE_URL`. Fix any contract drift. Done.

---

## 8. Design system shift (important)

NB Dashboard is **dark theme** (Slate). **AWAAS PRD Section 8.4 / 9.5 mandates WHITE background, single AWAAS accent, clean typography (Arial or Inter), no dark mode.** So:
- New shadcn theme: light base, one accent (pick AWAAS brand colour — the sample screens use a blue/indigo).
- Keep the CSS-variable approach (no hardcoded hex) you already follow.
- Risk colours are semantic, not theme: GREEN ≥70, AMBER 40–70, RED <40 (engagement); LOW/MEDIUM/HIGH for drop-off. Centralise in `lib/risk.js`.
- Keep `motion/react` with `reducedMotion="user"`.

---

## 9. Open questions to lock before/while building

1. **Backend reality this month?** (Drives mock-vs-real. Default assumption: build on mock against the contract.)
2. **Which dashboards ship this month?** (Default: Builder + Sales; Admin stubbed.)
3. **Is the live sales-tablet panel (Firebase, 5s updates) in web scope at all?** PRD marks it Phase 2.5 and tablet-side — recommend excluding from web now.
4. **Auth token transport** — can the API set httpOnly cookies, or must the SPA hold the token (localStorage)? Affects security posture.
5. **Multi-project** — does a CXO switch between projects (project dropdown in navbar, PRD 3.2)? If yes, project_id is a global filter in context.
6. **Annotation tool** — separate app, this month or later?

---

## 10. TL;DR

- You built a Firestore CRUD app. The new PRD needs an **API-fed analytics dashboard**. Rebuild the **data layer only**; reuse ~70% of your UI.
- **Dashboard talks to a REST API. Full stop.** Never Postgres, never ClickHouse, never Firestore-for-analytics. Firebase is live-session-only and probably out of web scope.
- **Build against the API contract with mocks now**, swap to the real API with one flag later — so a missing backend never blocks you.
- Add **React Query + recharts**; keep the rest of your stack.
- **Switch to white/light theme**, fix the **plaintext-auth security hole**, enforce **RBAC server-side**.
- Ship in this order: scaffold → auth → Builder Overview → Flat Deep-Dive → Buyer Insights → Sales → export → swap-to-real.
