# AWAAS Analytics Dashboard — Product Requirements Document
**Project:** RealEstate_VR_Dev (NB Dashboard)  
**Source Spec:** "Database and dashboard spec_doc.pdf"  
**Date:** 2026-05-19  
**Status:** Draft — for discussion

---

## 1. Context & Purpose

This document compares what is currently built in the NB Dashboard against the full product spec, identifies every gap, and defines what needs to be built as the analytics layer of the AWAAS platform.

---

## 2. What Is Currently Built

The existing application (`src/`) is a **User Management Admin Panel** — not an analytics dashboard. It maps exactly to **Section 9.4 of the spec** (Admin / Config Panel — Builder Onboarding):

| Current Feature | Spec Section |
|---|---|
| Admin creates Builders | §9.4 Salesperson account creation |
| Builder creates Sales Managers | §9.4 Salesperson account creation |
| Sales Manager creates Members | §9.4 Salesperson account creation |
| Players read-only table | Partial §9.4 (player registry view) |
| Spawn point + gaze object viewer per player | Partial §9.4 (flat/room data view) |
| Role-based login (admin/builder/sales_manager/member) | §3.1 Role-based access (mapped below) |
| CSV export of player + gaze data | Internal tooling |
| Public landing page at `/` | Marketing (not in spec) |

**Current role mapping to spec roles:**

| Current Role | Spec Role Equivalent |
|---|---|
| `admin` | AWAAS internal team |
| `builder` | CXO / Owner |
| `sales_manager` | Sales Head |
| `member` | Sales Executive |

**Tech already in place (relevant to analytics build):**
- `recharts` v2.15.2 — installed, ready for charts
- `shadcn/ui` — 10+ components installed, CSS variable dark theme
- Firebase Firestore — currently only used for user management
- `react-hook-form` — forms
- Path alias `@` → `src/`

---

## 3. What Needs to Be Built

Three dashboard products from the spec are **entirely missing**:

| Product | Spec Section | Priority |
|---|---|---|
| Builder / CXO Analytics Dashboard | §3 | P0 — core product |
| Sales Dashboard (individual + manager view) | §4 | P1 |
| Post-Session Summary Screen | §2.3 | P1 |
| AWAAS Internal Intelligence Dashboard | §5 | P2 — internal only |

---

## 4. Builder / CXO Analytics Dashboard (P0)

**Spec reference:** Section 3. Primary audience: Builder owners, CXOs (maps to current `builder` role).

### 4.1 Navigation Structure

**Top Navigation Bar** (sticky, 72px height):
- Left: Project Name dropdown, Location tag, Price Band tag
- Centre: Global filters — Date Range picker, Unit Type (2BHK / 3BHK / All), Buyer Segment selector
- Right: Export Report button, Notification bell, User profile avatar

**Left Sidebar** (240px, persistent — replaces current `Dashboard` single-page nav):
| Item | Icon | Description |
|---|---|---|
| Overview | LayoutDashboard | Default landing — KPI strip + heatmap |
| Inventory Intelligence | BarChart2 | Full flat engagement heatmap + deep dives |
| Buyer Insights | Users | Segment matrix + feature sensitivity |
| Sales Performance | TrendingUp | Sales team overlay |
| Settings | Settings | Project config |

> **Integration note:** The current `Sidebar.jsx` uses role-based `navItems`. The analytics sidebar needs to be a separate sidebar config, shown only when `activePage` is inside the analytics module, or it can be a new route entirely (`/analytics`).

---

### 4.2 Overview Screen

**Row 1 — KPI Strip (4 equal-width cards):**

| Card | Value | Sub-text | Hover |
|---|---|---|---|
| Project Engagement Score | 0–100 number | ↑/↓ % vs last 7 days + sparkline | Mini trend line |
| Drop-off Risk | LOW / MEDIUM / HIGH badge | % of sessions exiting early | Breakdown detail |
| Top Buyer Driver | Feature name (e.g. "Sunlight") | % of sessions influenced | Feature breakdown |
| Weakest Area | Room name (e.g. "Kitchen") | Avg dwell % vs baseline | Room comparison |

All 4 cards: click opens a deep-dive panel for that metric.

**Row 2 — Inventory Heatmap (8-col) + List View toggle (4-col):**

Heatmap: grid of flat tiles. Each tile shows:
- Flat ID (e.g. 3BHK-1302)
- Engagement score (large number)
- Colour-coded risk badge: GREEN (70+) / AMBER (40–70) / RED (<40)

On hover: tooltip with engagement score, drop-off risk, top liked room.  
On click: opens **Flat Deep-Dive Panel** (right slide, see §4.3).

List view alternative shows same data as a sortable table:

| Flat ID | Engagement Score | Risk Level | Trend | Primary Issue | Suggested Action |
|---|---|---|---|---|---|

**Row 3 — Buyer Insights (two-column):**
- Left (6-col): Segment Behaviour Matrix — cross-tab table of buyer segment × room preference %
  - Segments: Lifestyle, Investors, Families (at minimum)
  - Rooms: Living, Kitchen, Balcony, Vastu
- Right (6-col): Feature Sensitivity Chart — horizontal bar chart (recharts)
  - Bars: Sunlight, Vastu, Layout, View
  - Each bar shows % impact on engagement

**Row 4 — Action Panel (full width, CXO Priority):**

Rule-based suggestion cards. Each card:
- Problem: flat ID + signal (e.g. "3BHK-1204 — High drop-off, 4 early exits")
- Suggested Fix: 1–2 lines (e.g. "Reposition as value unit; avoid kitchen pitch")
- Action buttons: **Mark as Actioned** | **Assign to Sales Team**

---

### 4.3 Flat Deep-Dive Panel (Right Slide Panel)

Triggered by clicking any flat tile in the heatmap. Uses existing `Sheet` component (`side="right"`).

**Section 1 — Flat Summary:**
- Engagement trend line (last 30 sessions) — recharts LineChart
- Drop-off rate %, session count, avg session duration

**Section 2 — Room-Level Breakdown:**
- Horizontal bar chart (recharts BarChart) — Living, Bedroom, Balcony, Kitchen, Other
- Each bar shows % of total session dwell time

**Section 3 — Issues Detected:**
- Bullet list of rule-triggered issues (e.g. "Kitchen ignored by 72% of visitors")

**Section 4 — Suggested Actions:**
- Ranked action items with impact labels
- Same "Mark as Actioned / Assign to Sales Team" buttons as Row 4

---

### 4.4 Inventory Intelligence Screen

Full-page version of the heatmap from Overview Row 2, with:
- Filtering by Unit Type, Risk Level, Engagement range slider
- Sortable columns in list view
- Bulk action: "Assign flagged flats to sales team"

---

### 4.5 Buyer Insights Screen

Full-page expansion of Overview Row 3, with:
- Segment drill-down: click a segment row → see all sessions from that segment
- Feature Impact Score trend lines (recharts) — how feature sensitivity changes over time
- Session Archetype Distribution — donut chart (Exploratory / Comparative / Confirmatory / Disengaged)
- Cross-navigation: from segment → see which flats that segment prefers/avoids

---

### 4.6 Sales Performance Overlay

- Engagement vs conversion scatter plot (recharts ScatterChart)
- Per-salesperson rows: sessions handled, avg engagement score, conversion correlation
- Sales Head can see full team; Sales Executive sees own rows only

---

## 5. Sales Dashboard (P1)

**Spec reference:** Section 4. Two modes: individual salesperson and sales manager team view.

### 5.1 Individual Salesperson View

KPI cards:
| Metric | Calculation | Display |
|---|---|---|
| Sessions Handled | Count | KPI card |
| Avg Engagement Score | Mean of session scores | KPI card + trend arrow |
| Conversion Correlation | High-engagement sessions / total conversions | Trend graph |
| Top Objection Patterns | Drop-off trigger frequency by room/feature | Ranked list |
| Pitch Prompt Usage | Prompts acted on / prompts shown | % card |
| Session Archetype Breakdown | Count per type | Donut chart (recharts PieChart) |

### 5.2 Sales Manager Team View

Team table: each row is a salesperson. Columns: Name, Sessions, Avg Engagement, Prompt Usage %, Conversion Rate, Training Flag.

Highlights top performer and flags training needs (lowest engagement + lowest prompt usage).

---

## 6. Post-Session Summary Screen (P1)

**Spec reference:** Section 2.3. Auto-generated after each VR session ends.

Accessible via: Players table → click session → view summary.

Sections:
1. **Header:** Flat ID, duration, salesperson, timestamp. Buttons: Export PDF, Log to CRM
2. **Score Strip:** Engagement Score (0–100), Session Archetype badge, Drop-off Risk badge, Walkthrough Completion %
3. **Room Preference Breakdown:** Horizontal bar chart per room with % dwell
4. **Buyer Sensitivity Profile:** Sunlight / View+Openness / Layout Size / Vastu / Kitchen Utility — each with HIGH/MEDIUM/LOW/VERY LOW label
5. **Buyer Classification Tags:** e.g. "Lifestyle Maximiser", "Sunlight-Driven", "End-User Upgrader", "Non-Vastu", age band, work profile
6. **Objection Indicators:** Rule-triggered flags (e.g. "Kitchen concern — likely")
7. **Recommended Follow-Up:** Flat ID + pitch angle + evening/morning slot suggestion
8. **Pitch Angle:** Pre-written 1-line follow-up script

---

## 7. AWAAS Internal Intelligence Dashboard (P2)

**Spec reference:** Section 5. Not visible to builders. AWAAS team only.

This maps to the `admin` role in the current system.

Sections:
1. **Data Health:** Sessions per project (count + trend), event completeness %, sync failure rate
2. **Buyer Behaviour Clusters:** 5 cluster cards (Lifestyle Maximiser, Vastu-Driven Conservative, Investor Quick Scanner, Analytical Upgrader, Emotionally Disengaged) — each showing defining signals, session %, example profile
3. **Signal Reliability:** Engagement score vs observed conversion, drop-off prediction confidence, cluster stability index
4. **Cross-Project Trends (Anonymised):** National sunlight sensitivity, vastu importance by geography, kitchen engagement by price band

---

## 8. Data Requirements

### 8.1 What Data Exists in Firestore Today

| Collection | Current Fields | Analytics Use |
|---|---|---|
| `players` | name, phoneNumber, bhk, building, totalSessions, createdAt | Player registry only |
| `players/{id}/spawnPointTotals` | spawn metrics, lastVisit | Basis for room-level engagement |
| `players/{id}/spawnPointTotals/{id}/gazeObjects` | objectName, gazeTimeFormatted | Gaze interest data |
| `players/{id}/sessionData` | (not yet read) | Session-level data |

### 8.2 What Data Is Missing / Not Yet In Firestore

The spec's full data model requires data that comes from the VR headset pipeline (Section 6). The analytics dashboard **cannot be built from Firestore alone**. The spec defines three backend layers:

| Layer | Technology | Status |
|---|---|---|
| Live / Ephemeral | Firebase Firestore | Partially exists (player sessions) |
| Raw + Structured | PostgreSQL | **Not built** |
| Analytics Engine | ClickHouse | **Not built** |

For the dashboard MVP, we have two options:

**Option A — Build with mock/static data first**  
Design all screens with hardcoded sample data. Wire up Firestore reads as backend data becomes available. Fastest path to a demo-ready product.

**Option B — Extend Firestore as interim analytics store**  
Add derived analytics collections to Firestore (e.g. `flat_metrics`, `session_summaries`, `project_overview`) that get written by a backend process after each session. Dashboard reads from these. Works as an interim before the full PostgreSQL → ClickHouse pipeline is ready.

> **Recommendation:** Phase 1 builds with mock data to validate UI/UX. Phase 2 wires to a Firestore analytics schema. Phase 3 wires to ClickHouse when the pipeline exists.

### 8.3 Proposed Firestore Collections for Analytics MVP

```
project_overview/{projectId}
  engagement_score: number
  drop_off_risk: "LOW" | "MEDIUM" | "HIGH"
  top_buyer_driver: string
  weakest_area: string
  last_updated: Timestamp

flat_metrics/{flatId}
  project_id: string
  flat_number: string
  configuration: "2BHK" | "3BHK"
  avg_engagement: number
  drop_off_rate: number
  total_sessions: number
  risk_level: "LOW" | "AMBER" | "RED"
  room_breakdown: { living: %, bedroom: %, balcony: %, kitchen: %, other: % }
  issues: string[]
  suggested_actions: string[]
  trend_data: [{ date, score }]  // last 30 sessions

session_summaries/{sessionId}
  flat_id: string
  player_id: string
  salesperson_id: string
  engagement_score: number
  session_archetype: "Exploratory" | "Comparative" | "Confirmatory" | "Disengaged"
  drop_off_risk: "LOW" | "MEDIUM" | "HIGH"
  completion_percentage: number
  room_preferences: { roomName: dwell_pct }
  feature_sensitivity: { sunlight: 0-1, vastu: 0-1, layout: 0-1, view: 0-1 }
  buyer_type: string
  objection_flags: string[]
  recommended_next_flat: string
  follow_up_pitch: string
  created_at: Timestamp
```

---

## 9. Role Access Matrix for Analytics

| Screen | admin | builder | sales_manager | member |
|---|---|---|---|---|
| Builder/CXO Overview | Read-only all projects | Own projects | Own sessions only | — |
| Inventory Heatmap | All projects | Own projects | — | — |
| Buyer Insights | All | Own project | — | — |
| Sales Performance | All | Own team | Own + team below | Own only |
| Post-Session Summary | All | Own project | Own sessions | Own sessions |
| AWAAS Internal Dashboard | Full access | — | — | — |
| Action Panel (assign/mark) | — | Yes | — | — |

---

## 10. Technical Approach

### Routes to Add
```
/analytics                → redirect to /analytics/overview
/analytics/overview       → Builder/CXO Overview screen
/analytics/inventory      → Inventory Intelligence screen
/analytics/buyers         → Buyer Insights screen
/analytics/sales          → Sales Performance screen
/analytics/session/:id    → Post-Session Summary
/analytics/internal       → AWAAS Internal Dashboard (admin only)
```

### New Components Needed

| Component | Purpose | Reuses |
|---|---|---|
| `AnalyticsLayout.jsx` | Top navbar + analytics sidebar shell | `Sidebar.jsx` pattern |
| `KpiStrip.jsx` | 4-card KPI row | `StatsCard.jsx` (extend) |
| `InventoryHeatmap.jsx` | Flat tile grid + list toggle | — |
| `FlatTile.jsx` | Single flat tile with risk badge | `Card`, `Badge` |
| `FlatDeepDiveSheet.jsx` | Right slide panel for flat detail | `PlayerDetailSheet.jsx` pattern |
| `RoomBreakdownChart.jsx` | Horizontal bar chart | recharts `BarChart` |
| `EngagementTrendChart.jsx` | Line chart for 30-session trend | recharts `LineChart` |
| `FeatureSensitivityBars.jsx` | Feature sensitivity bar chart | recharts `BarChart` |
| `BuyerSegmentMatrix.jsx` | Cross-tab table with heat fill | `table` (shadcn) |
| `SessionArchetypeDonut.jsx` | Archetype distribution donut | recharts `PieChart` |
| `ActionCard.jsx` | Rule-based suggestion card | `Card`, `Button` |
| `PostSessionSummary.jsx` | Full session summary page | — |

### New Service Functions Needed (userService.js or new analyticsService.js)

```js
getProjectOverview(projectId)         // reads project_overview collection
getFlatMetrics(projectId)             // reads all flat_metrics for a project
getSessionSummary(sessionId)          // reads session_summaries/{id}
getSessionsByFlat(flatId)             // queries session_summaries where flat_id
getSessionsBySalesperson(email)       // queries session_summaries where salesperson_id
```

### Charting Library
`recharts` v2.15.2 is already installed. Use:
- `BarChart` + `Bar` → room breakdown, feature sensitivity, buyer segment matrix
- `LineChart` + `Line` → engagement trend, sparklines
- `PieChart` + `Pie` → session archetype donut
- `ScatterChart` → engagement vs conversion (sales performance)

### No New Packages Required
All needed packages are already installed: `recharts`, `shadcn/ui`, `lucide-react`, `react-hook-form`.

---

## 11. Phased Build Plan

### Phase 1 — UI Shell + Mock Data (current sprint candidate)
- Analytics routing (`/analytics/*`)
- `AnalyticsLayout` with top navbar + sidebar
- Builder/CXO Overview screen with all 4 rows — mock data hardcoded
- `FlatDeepDiveSheet` with mock flat data
- KPI cards with sparklines

**Goal:** Stakeholder demo-ready. No Firestore dependency.

### Phase 2 — Firestore Analytics Collections
- Define and seed `flat_metrics`, `project_overview`, `session_summaries` collections
- Wire `analyticsService.js` functions
- Replace mock data in Overview, Inventory, Buyer Insights screens
- Post-Session Summary screen (reads `session_summaries`)

**Goal:** Live data from real sessions replaces mock data.

### Phase 3 — Sales Dashboard + AWAAS Internal
- Individual + team sales performance views
- AWAAS Internal Dashboard (admin role only)
- Action Panel "Assign to Sales Team" flow

**Goal:** Full spec coverage.

### Phase 4 — PostgreSQL / ClickHouse Pipeline (future)
- Backend ETL feeds ClickHouse
- Dashboard queries switch from Firestore to ClickHouse API
- No UI change required if service layer is abstracted correctly

---

## 12. Open Questions (To Discuss Before Building)

1. **Route strategy:** Does analytics live at `/analytics` (separate from current `/dashboard`) or does it extend the current dashboard with new `activePage` values?
   - Recommendation: Separate route `/analytics` to keep concerns clean. Current `/dashboard` remains the user management panel.

2. **Data seeding for Phase 1:** Do we seed realistic mock data directly in component files, or create a `mockData.js` file under `src/data/`?

3. **Project selector:** In Phase 1, do we show a single hardcoded project ("Emerald Heights") or wire a real project dropdown immediately?

4. **Firestore schema ownership:** Who writes to `flat_metrics` / `session_summaries`? Is it the VR backend, or do we build a manual admin seeding tool first?

5. **Export PDF for Post-Session Summary:** Is this in scope for Phase 1? (Requires `jsPDF` or similar — new package, needs discussion per CLAUDE.md Rule 4.)

6. **"Log to CRM" button:** Is there a CRM integration in scope, or is this a placeholder for Phase 3+?

---

## 13. What Does NOT Need to Change

- Existing user management dashboard at `/dashboard` — stays as-is
- Current role hierarchy (admin/builder/sales_manager/member) — reused for access control
- Firebase config, authService.js, AuthContext — unchanged
- All `src/components/ui/` shadcn components — reused
- `PlayerDetailSheet.jsx` and player data reading — foundation for Post-Session Summary

---

*End of PRD — v1.0 draft*
