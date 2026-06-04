# AWAAS — VR Real Estate Web Dashboard

A web dashboard for a VR-based real estate sales platform. Builders, sales teams,
and platform admins log in to manage their organization and review buyer-behavior
analytics captured from VR property walkthroughs.

Built with **React 19 + Vite 8 + Tailwind CSS 3** and **shadcn/ui** (Radix-based)
components, with a dark/light theme.

---

## What it does

The app is a single, **role-based dashboard** ([src/pages/Dashboard.jsx](src/pages/Dashboard.jsx))
that renders different content per role and per selected tab:

- **User management** — hierarchical CRUD: `awaas_admin → builder → sales_manager → member`.
  Create/list/delete users, scoped to who created them.
- **VR Players** — read-only table of VR session players, with a per-player detail
  sheet (spawn-point totals + gaze-object dwell times).
- **Builder / CXO analytics** ([BuilderOverview](src/pages/BuilderOverview.jsx)) — project
  KPI cards, inventory heatmap, per-flat deep-dive panel, buyer-segment insight
  matrices, feature-sensitivity bars, and action recommendations.
- **Sales analytics** ([SalesPerformance](src/pages/SalesPerformance.jsx)) — individual
  and team sales summaries.
- **Platform admin** ([AdminDashboard](src/pages/AdminDashboard.jsx)) — data-health and
  render-comparison views.
- **Public landing page** + **login** with role-based redirect, plus CSV export of
  sessions/events.

### Roles & demo login

Authentication currently runs against an in-app **mock layer**, so the app is fully
usable with no backend. Use the demo credentials (all password: `password`):

| Email                | Role          |
|----------------------|---------------|
| `cxo@awaas.com`      | `cxo`         |
| `builder@awaas.com`  | `builder`     |
| `saleshead@awaas.com`| `sales_head`  |
| `salesexec@awaas.com`| `sales_exec`  |
| `admin@awaas.com`    | `awaas_admin` |

---

## Architecture / data layer

The frontend uses a hybrid data setup:

- **Auth + analytics data** — served by an in-app mock API client
  ([src/api/client.js](src/api/client.js)) that mirrors the REST contract in
  [api-contract.yaml](api-contract.yaml). Controlled by `VITE_USE_MOCK`
  (defaults to mock-on). No backend is required to run or demo the app.
- **User management + VR player data** — backed directly by **Firebase Firestore**
  ([src/firebase/](src/firebase/)). The web config in
  [src/firebase/config.js](src/firebase/config.js) is a public Firebase web key
  (safe to ship; access is governed by Firestore security rules).

A separate Node backend is scaffolded under [awaas-api/](awaas-api/) (JWT +
firebase-admin) but is **not yet implemented** and the frontend does not depend on it.
Its secrets are git-ignored — see [Security](#security).

---

## Project structure

```
src/
  api/            Mock API client, endpoints, config, mock data
  components/     Shared UI: Sidebar, Layout, charts, tables, modals
    ui/           shadcn/ui primitives (button, dialog, table, ...)
  context/        AuthContext, ThemeContext
  firebase/       Firestore config + auth/user/player services
  pages/          Landing, Login, Dashboard, BuilderOverview,
                  SalesPerformance, AdminDashboard, NotFound
  lib/            utils (cn helper)
public/           favicon.svg, icons.svg
```

Path alias: `@` → `src/` (configured in [vite.config.js](vite.config.js) /
[jsconfig.json](jsconfig.json)).

### Routes

| Path         | Page                              |
|--------------|-----------------------------------|
| `/`          | Public landing                    |
| `/login`     | Login                             |
| `/dashboard` | Role-based dashboard (protected)  |
| `*`          | Not found                         |

---

## Getting started

Prerequisites: **Node `^20.19` or `>=22.12`** (Vite 8 requirement).

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

### Environment variables

All are optional — see [.env.example](.env.example). Copy it to `.env` to override.

| Variable             | Default                          | Purpose                                  |
|----------------------|----------------------------------|------------------------------------------|
| `VITE_USE_MOCK`      | `true`                           | Set to `false` to call a real backend.   |
| `VITE_API_BASE_URL`  | `https://api.awaas.example/v1`   | Backend base URL when mock is disabled.  |

---

## Deployment (Netlify)

Configured in [netlify.toml](netlify.toml):

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** `22.12.0`
- **SPA redirect:** `/*` → `/index.html` (200) so client-side routes resolve.

Connect the repo in Netlify (**Add new site → Import from GitHub**); the config is
auto-detected, and no environment variables are required for the default mock setup.

---

## Security

Never commit secrets. The following are git-ignored ([.gitignore](.gitignore)):

- `.env`, `.env.*` (except `.env.example`)
- `service-account.json` and other service-account key files

The backend service-account key and JWT secret live under `awaas-api/` locally and
must stay out of version control.

---

## Status / roadmap

The analytics products are specified in
[ANALYTICS_DASHBOARD_PRD.md](ANALYTICS_DASHBOARD_PRD.md). Current analytics views run
on mock data; the next phase is wiring them to live Firestore analytics collections
and implementing the [awaas-api/](awaas-api/) backend.
