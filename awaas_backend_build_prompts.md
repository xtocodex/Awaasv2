# AWAAS Backend Build Prompts — Node.js + Express + Firestore

**How to use:** Paste each STAGE prompt into Claude Code one at a time. Confirm the
server starts and the stage-specific verify step passes before moving to the next.
Do NOT paste all stages at once. Place `api-contract.yaml` in the repo root first.

**Stack:** Node.js 20 + Express 4 + Firebase Admin SDK (Firestore) + JWT (jsonwebtoken)

---

## PREAMBLE — paste once at the start of the session

> Context: We are building a new standalone Express backend called `awaas-api`. It must
> implement every path in `api-contract.yaml` (in the repo root). The frontend is a
> separate React SPA that currently runs against mock data; our job is to build the real
> server it will eventually point at. Rules:
>
> - Node 20, Express 4, Firebase Admin SDK for Firestore, jsonwebtoken for JWT.
> - All Firestore access goes through a single `src/db/` seam — no direct SDK calls
>   in route handlers.
> - Every route except POST /auth/login requires a valid Bearer JWT. Middleware enforces
>   this and attaches `req.user = { uid, email, role, scope }` for downstream handlers.
> - Role enforcement: route handlers check `req.user.role`; return 403 with
>   `{ code: "FORBIDDEN", message: "..." }` on mismatch. Frontend role checks are UI only.
> - Error shape must always be `{ code: string, message: string }` to match the contract.
> - Use `npm init` — no existing repo to preserve.
> - Show me the file tree you plan to touch before editing each stage.

---

## STAGE 0 — Project scaffold + Firestore connection

> Bootstrap the project:
>
> 1. `npm init -y` then install: `express`, `firebase-admin`, `jsonwebtoken`, `bcryptjs`,
>    `dotenv`, `cors`, `helmet`, `express-async-errors`.
> 2. Create this folder structure:
>    ```
>    awaas-api/
>      src/
>        db/           ← Firestore seam
>        middleware/   ← auth, error, role guards
>        routes/       ← one file per contract section
>        services/     ← business logic (no Express objects)
>        lib/          ← helpers (token.js, errors.js)
>      index.js        ← app entry point
>    ```
> 3. `src/db/firestore.js` — initialise Firebase Admin from a service account JSON path
>    in env (`FIREBASE_SERVICE_ACCOUNT_PATH`). Export `db` (Firestore instance).
> 4. `src/lib/errors.js` — export `AppError(code, message, status)` class and a set of
>    named constructors: `Unauthorized`, `Forbidden`, `NotFound`, `BadRequest`.
> 5. `src/middleware/errorHandler.js` — Express error middleware that converts AppError
>    (and unexpected errors) to `{ code, message }` JSON with correct HTTP status.
> 6. `index.js` — create Express app, mount `helmet`, `cors`, `express.json()`,
>    routes (stub `/health` returning `{ ok: true }`), and errorHandler last.
> 7. `.env.example` with: `PORT`, `JWT_SECRET`, `FIREBASE_SERVICE_ACCOUNT_PATH`.

**Verify:** `node index.js` starts; `GET /health` returns `{ ok: true }`.

---

## STAGE 1 — Auth routes + JWT middleware

> Implement authentication:
>
> 1. **Firestore seam** — `src/db/users.js`:
>    - `getUserByEmail(email)` → returns user doc `{ uid, email, passwordHash, role, scope }`
>      or null. Collection: `users`.
>    - `getUserById(uid)` → same shape by doc ID.
>
> 2. **Token helper** — `src/lib/token.js`:
>    - `signToken({ uid, email, role, scope })` → JWT signed with `JWT_SECRET`, expires 8h.
>    - `verifyToken(token)` → decoded payload or throws `Unauthorized`.
>
> 3. **Auth middleware** — `src/middleware/auth.js`:
>    - Reads `Authorization: Bearer <token>`, calls `verifyToken`, attaches `req.user`.
>    - Skips auth for `POST /auth/login`.
>    - Throws `Unauthorized` on missing/invalid token.
>
> 4. **Routes** — `src/routes/auth.js`:
>    - `POST /auth/login`: read `{ email, password }`, call `getUserByEmail`, compare
>      password with `bcryptjs.compare`, sign token, return `AuthResponse` shape from
>      the contract.
>    - `GET /auth/me`: requires auth middleware; call `getUserById(req.user.uid)`, return
>      same `AuthResponse` shape (token field is the existing token from the header).
>
> 5. Mount auth routes in `index.js` under `/auth`. Apply auth middleware globally AFTER
>    mounting auth routes so `/auth/login` stays open.
>
> 6. **Seed script** — `scripts/seed-users.js`: create 5 Firestore user docs matching the
>    frontend mock credentials (cxo@awaas.com, saleshead@awaas.com, salesexec@awaas.com,
>    admin@awaas.com, builder@awaas.com — all password `password`, hashed with bcrypt).
>    Assign roles and scope matching `api-contract.yaml`'s Role enum.

**Verify:** run seed script; `POST /auth/login` with `cxo@awaas.com/password` returns a
token; `GET /auth/me` with that token returns the user; wrong password returns 401.

---

## STAGE 2 — Projects routes

> Implement `/projects` and `/projects/:id/overview`:
>
> 1. **Firestore seam** — `src/db/projects.js`:
>    - `getProjectsByIds(ids)` → returns array of project docs from collection `projects`.
>    - `getProjectById(id)` → single project doc.
>    - `getProjectOverview(projectId, dateRange)` → returns doc from
>      `projects/{id}/overview/{dateRange}` (default `last_30_days`).
>
> 2. **Service** — `src/services/projectsService.js`:
>    - `listProjects(scope)` → filters by `scope.project_ids`; maps to `ProjectSummary` shape.
>    - `getOverview(projectId, scope, dateRange)` → checks projectId is in scope, fetches
>      and returns `ProjectOverview` shape.
>
> 3. **Routes** — `src/routes/projects.js`:
>    - `GET /projects` — calls `listProjects(req.user.scope)`.
>    - `GET /projects/:id/overview` — query param `date_range`; calls `getOverview`.
>    - Both require auth. Role gate: only `builder`, `cxo`, `awaas_admin` may access.
>
> 4. **Seed script** — `scripts/seed-projects.js`: create 2 project docs + their overview
>    subcollections using the realistic numbers from api-contract.yaml examples
>    (engagement 68, drop_off_pct 22, sunlight 61%, etc).

**Verify:** `GET /projects` with cxo token returns 2 projects; `GET /projects/p1/overview`
returns the KPI object; sales_exec token on same route returns 403.

---

## STAGE 3 — Inventory (flats) routes

> Implement `/projects/:id/flats` and `/flats/:id/deep-dive`:
>
> 1. **Firestore seam** — `src/db/flats.js`:
>    - `getFlatsByProject(projectId, filters)` → collection `projects/{id}/flats`,
>      optional filters: `unit_type`, `segment` (where clauses).
>    - `getFlatById(flatId)` → single doc from top-level `flats` collection.
>    - `getFlatDeepDive(flatId)` → doc from `flats/{id}/deepdive/current`.
>
> 2. **Service** — `src/services/flatsService.js`:
>    - `listFlats(projectId, scope, filters)` → scope check, fetch, map to `FlatTile` shape.
>    - `getDeepDive(flatId, scope)` → scope check (flat must belong to a scoped project),
>      fetch and return `FlatDeepDive` shape.
>
> 3. **Routes** — `src/routes/flats.js`:
>    - `GET /projects/:id/flats` — query params `unit_type`, `segment`.
>    - `GET /flats/:id/deep-dive`.
>    - Role gate: `builder`, `cxo`, `awaas_admin`.
>
> 4. **Seed script** — `scripts/seed-flats.js`: create 12 flat tiles for project p1
>    including flat `3BHK-1204` at engagement 42 / RED risk, and deep-dive doc for it
>    with room breakdown and suggested actions.

**Verify:** `GET /projects/p1/flats` returns 12 tiles; `GET /flats/3BHK-1204/deep-dive`
returns room breakdown + suggested actions.

---

## STAGE 4 — Segments + Recommendations routes

> Implement buyer insights and action recommendations:
>
> 1. **Firestore seam** — `src/db/insights.js`:
>    - `getSegments(projectId)` → `projects/{id}/segments/current`.
>    - `getRecommendations(projectId)` → collection `projects/{id}/recommendations`,
>      ordered by priority.
>    - `updateRecommendationStatus(recId, status)` → update `status` field on doc
>      `recommendations/{recId}`.
>
> 2. **Service** — `src/services/insightsService.js`: thin wrappers with scope checks.
>
> 3. **Routes** — `src/routes/insights.js`:
>    - `GET /projects/:id/segments`.
>    - `GET /projects/:id/action-recommendations`.
>    - `POST /action-recommendations/:id/status` — body `{ status: actioned|assigned }`;
>      validates enum; role gate: `builder`, `cxo`.
>
> 4. **Seed script** — `scripts/seed-insights.js`: create segment matrix + feature
>    sensitivity + 4 recommendation docs for project p1.

**Verify:** GET segments returns matrix + bars; POST status on a rec returns 200;
GET recommendations shows updated status.

---

## STAGE 5 — Sales routes

> Implement sales dashboards:
>
> 1. **Firestore seam** — `src/db/sales.js`:
>    - `getSalesSummary(salespersonId)` → `salespeople/{id}/summary/current`.
>    - `getTeamSummary(projectIds)` → collection `salespeople` where
>      `project_id in projectIds`, map to reps array.
>
> 2. **Routes** — `src/routes/sales.js`:
>    - `GET /sales/me/summary` — role gate: `sales_exec`, `sales_head`.
>      Uses `req.user.scope.salesperson_id` to fetch own summary.
>    - `GET /sales/team/summary` — role gate: `sales_head` only (403 for sales_exec).
>
> 3. **Seed script** — `scripts/seed-sales.js`: create 3 salesperson docs with summary
>    subcollections; one maps to saleshead@awaas.com, two are reps under them.

**Verify:** sales_exec token → GET /sales/me/summary returns own KPIs, GET team returns 403;
sales_head token → both routes return data.

---

## STAGE 6 — Admin routes + CSV export

> Implement admin-only endpoints and CSV export:
>
> 1. **Firestore seam** — `src/db/admin.js`:
>    - `getDataHealth()` → `admin/dataHealth`.
>    - `getRenderComparison()` → `admin/renderComparison`.
>
> 2. **Routes** — `src/routes/admin.js`:
>    - `GET /admin/data-health` — role gate: `awaas_admin` only.
>    - `GET /admin/render-comparison` — role gate: `awaas_admin` only.
>
> 3. **CSV export** — `src/routes/export.js`:
>    - `GET /export/sessions.csv` — query param `project_id`; scope check; fetch sessions
>      from `projects/{id}/sessions` collection; stream as CSV with headers matching the
>      frontend mock CSV shape. Set `Content-Disposition: attachment; filename=awaas-sessions-YYYY-MM-DD.csv`.
>    - `GET /export/events.csv` — same pattern for `projects/{id}/events`.
>    - Role gate: `builder`, `cxo`, `sales_head`, `awaas_admin`.
>
> 4. **Seed script** — `scripts/seed-admin.js`: create admin docs + 20 session docs and
>    30 event docs for project p1 so CSV export returns real rows.

**Verify:** admin token → both admin routes return data; GET /export/sessions.csv downloads
a .csv file with correct filename and rows; sales_exec on export returns 403.

---

## STAGE 7 — Harden + wire to frontend

> Polish before connecting to the SPA:
>
> 1. **CORS** — tighten to only allow the frontend origin via `ALLOWED_ORIGIN` env var.
> 2. **Rate limiting** — add `express-rate-limit` on `/auth/login` (10 req/15min per IP).
> 3. **Input validation** — add `zod` schemas for all request bodies and query params;
>    return `BadRequest` on invalid input.
> 4. **Logging** — add `morgan` for request logs in development.
> 5. **Health check** — extend `GET /health` to also ping Firestore and return
>    `{ ok: true, firestore: true }`.
> 6. **README.md** — document: env vars needed, how to run seed scripts in order,
>    how to start the server, how to set `VITE_API_BASE_URL` in the frontend.
>
> Then in the frontend repo: set `VITE_USE_MOCK=false` and
> `VITE_API_BASE_URL=http://localhost:3001/` (or wherever the Express server runs).
> Exercise every page and log any shape mismatches between real responses and what
> the frontend expects. For each mismatch, fix the backend response shape to match
> `api-contract.yaml` — do not silently patch the frontend.

**Verify:** Full end-to-end: frontend login with cxo@awaas.com hits real Express server,
real Firestore, returns real data. All pages load. CSV export downloads a real file.

---

## Firestore Collection Schema (reference)

```
users/                          {uid, email, passwordHash, role, scope}
projects/                       {project_id, name, location, price_band, flat_count}
  {id}/overview/                {last_30_days: ProjectOverview}
  {id}/flats/                   FlatTile docs
  {id}/segments/current         SegmentInsights
  {id}/recommendations/         ActionRecommendation docs
  {id}/sessions/                session event docs
  {id}/events/                  raw event docs
flats/                          {flat_id, ...}
  {id}/deepdive/current         FlatDeepDive
salespeople/                    {id, name, email, project_id}
  {id}/summary/current          SalesSummary
admin/
  dataHealth                    DataHealth
  renderComparison              RenderComparison
```

---

## Notes

- Keep all seed scripts idempotent (use `set` with merge, not `add`) so they can be
  re-run safely.
- JWT secret must be at least 32 chars in production. Use a strong random value.
- Never log the JWT secret or password hashes.
- Scope enforcement happens in the service layer, not just the route — a sales_exec
  should never be able to fetch another exec's summary even with a crafted URL.
- The frontend does NOT enforce data isolation — only this backend does.
- When the direction becomes clearer (client demo vs real product), Stage 7 hardening
  can be extended with refresh tokens, audit logging, and Firestore security rules.
