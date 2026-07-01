# Backend Plan — Portfolio OS (Express + Firestore + Firebase Storage)

> **Status**: Approved — Execute step-by-step  
> **Last Updated**: 2026-06-30  
> **Prerequisite**: Frontend complete ([`logs.md`](../logs.md))

---

## Resolved Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Structured database | **Firestore** (no MongoDB) |
| 2 | File storage | **Firebase Storage** (replaces Cloudinary from AgentPrompts) |
| 3 | Job queues | **Firestore `jobs/` collection** + in-process workers (MVP); Cloud Functions optional later |
| 4 | Public API cache | **In-memory LRU** (5min TTL), invalidate on publish |
| 5 | OAuth redirect | Redirect to `CLIENT_URL` — frontend uses modal, no `/login` route |
| 6 | API port | **5000** — matches [`client/src/api/client.ts`](../client/src/api/client.ts) default |
| 7 | Response format | `{ success: true, data: T, meta: { version, cachedAt } }` — matches frontend types |

---

## Corrected Tech Stack

> [`AgentPrompts.md`](../AgentPrompts.md) lists MongoDB + Cloudinary + Redis/BullMQ.  
> This plan follows the **Firestore + Firebase Storage** decision.

```
Backend (Actual)
  Node.js + Express + TypeScript
  Firestore                    (structured data — firebase-admin)
  Firebase Storage             (images, PDFs, resume uploads)
  JWT (access 15m + refresh cookie 7d)
  Passport.js (Google + GitHub OAuth)
  Zod                          (env, request bodies, AI outputs)
  Sharp                        (image processing before Storage upload)
  express-rate-limit           (public: 60/min, login: 5/15min)
  Helmet + CORS                (strict CLIENT_URL whitelist)
  fast-json-patch              (RFC 6902 versioning)
  In-memory cache              (public read endpoints, 5min TTL)

AI / OCR (unchanged from AgentPrompts)
  Anthropic claude-sonnet-4-6
  Google Document AI

DevOps
  Firebase project (Firestore + Storage rules)
  Railway / Render (Express host)
  Vercel (frontend — already deployed)
```

---

## Target Architecture

```
┌─────────────────┐     HTTP + cookies     ┌──────────────────────────────┐
│  React Client   │ ──────────────────────▶│  Express API  :5000/api      │
│  (Portfolio OS) │                        │  auth / public / admin / hook│
└─────────────────┘                        └──────────┬───────────────────┘
                                                      │
                        ┌─────────────────────────────┼─────────────────────────────┐
                        ▼                             ▼                             ▼
                 ┌─────────────┐            ┌─────────────────┐           ┌──────────────────┐
                 │  Firestore  │            │ Firebase Storage │           │ External APIs    │
                 │  (metadata) │            │ (binary files)   │           │ GitHub, Anthropic│
                 └─────────────┘            └─────────────────┘           │ Google Doc AI    │
                                                                            └──────────────────┘
```

**Rule**: Firestore stores content and metadata only. Firebase Storage stores all binaries. Never embed file bytes in Firestore documents.

---

## API Contract (Must Match Frontend)

Base URL: `http://localhost:5000/api` (prod: env `API_URL`)

### Public routes (60 req/min per IP)

| Method | Path | Frontend module |
|--------|------|-----------------|
| GET | `/profile` | `api/portfolio.ts` |
| GET | `/skills` | `api/portfolio.ts` |
| GET | `/experience` | `api/portfolio.ts` |
| GET | `/education` | `api/portfolio.ts` |
| GET | `/projects` | `api/projects.ts` |
| POST | `/analytics/pageview` | `api/analytics.ts` |
| POST | `/analytics/event` | `api/analytics.ts` |

### Auth routes

| Method | Path |
|--------|------|
| POST | `/auth/login` |
| POST | `/auth/logout` |
| POST | `/auth/refresh` |
| GET | `/auth/google` |
| GET | `/auth/google/callback` |
| GET | `/auth/github` |
| GET | `/auth/github/callback` |

### Admin routes (Bearer token + `requireAdmin`)

| Method | Path | Module |
|--------|------|--------|
| GET/PATCH | `/admin/draft` | MOD-DRAFT |
| POST | `/admin/draft/publish` | MOD-DRAFT |
| PATCH | `/admin/projects/:id` | MOD-PROJECTS |
| PUT | `/admin/projects/reorder` | MOD-PROJECTS |
| POST | `/admin/resume/upload` | MOD-RESUME |
| GET | `/admin/resume/diff` | MOD-RESUME |
| POST | `/admin/resume/approve` | MOD-RESUME |
| GET | `/admin/resume/status/:jobId` | MOD-RESUME |
| POST | `/admin/github/sync` | MOD-GITHUB |
| GET | `/admin/github/repos` | MOD-GITHUB |
| PATCH | `/admin/github/repos/:repoName` | MOD-GITHUB |
| POST | `/admin/media/upload` | MOD-MEDIA |
| GET | `/admin/media` | MOD-MEDIA |
| DELETE | `/admin/media/:id` | MOD-MEDIA |
| GET | `/admin/analytics?range=7d\|30d\|90d` | MOD-ANALYTICS |
| GET/PATCH | `/admin/settings` | MOD-SETTINGS |
| PATCH | `/admin/settings/theme` | MOD-THEME |
| GET | `/admin/health` | MOD-HEALTH |
| GET | `/admin/notifications` | MOD-NOTIFY |
| PATCH | `/admin/notifications/:id/read` | MOD-NOTIFY |
| POST | `/admin/notifications/read-all` | MOD-NOTIFY |
| GET | `/admin/versions` | MOD-VERSION |
| POST | `/admin/versions/:id/rollback` | MOD-VERSION |
| GET | `/admin/audit?limit=200` | MOD-AUDIT |

### Webhook

| Method | Path |
|--------|------|
| POST | `/github/webhook` |

---

## Firestore Collections

```
users/                  — single pre-seeded admin (email, passwordHash, role)
portfolioPublished/     — live visitor content snapshot
portfolioDrafts/        — one draft per admin (upsert)
skills/                 — ordered skill documents
experience/             — work history entries
education/              — qualification entries
projects/               — project docs + admin flags (pinned, hidden, etc.)
media/                  — upload metadata (storagePath, downloadUrl, thumbnailUrl)
resumeJobs/             — pipeline status (uploading → parsing → analyzing → ready)
resumeDiffs/            — pending diff awaiting approval
githubRepos/            — synced repo metadata
versions/               — JSON Patch + label + number
auditLogs/              — append-only (no update/delete API)
analyticsEvents/        — raw pageviews and events
notifications/          — admin alerts
settings/               — single doc: SEO, flags, theme, contact
jobs/                   — background job queue (github-sync, resume-processing)
```

**Seed source**: [`client/src/constants/fallbackData.ts`](../client/src/constants/fallbackData.ts)

---

## Firebase Storage Layout

```
portfolio-os/
  projects/           — featured project images
  profile/            — avatar, hero images
  resumes/            — uploaded PDFs
  media-library/      — admin media uploads
  certificates/       — reserved for future
```

**Upload pipeline**: multer (memory) → Sharp (WebP + 200px thumbnail) → Firebase Storage → Firestore `media/` doc.

---

## Step Breakdown (10 Steps)

Each step = one turn. Verify before proceeding. Append to [`logs.md`](../logs.md) after each step.

---

### Step 1: Project Foundation

**Goal**: Scaffold Express + TypeScript + Firebase Admin + dev tooling.

**Scope**:
- Init `server/package.json`, `tsconfig.json`
- Install deps: `express`, `firebase-admin`, `zod`, `helmet`, `cors`, `cookie-parser`, `jsonwebtoken`, `bcrypt`, `passport`, `passport-google-oauth20`, `passport-github2`, `express-rate-limit`, `multer`, `sharp`, `fast-json-patch`, `@anthropic-ai/sdk`, `tsx`
- Create `src/config/env.ts` (Zod-validated), `src/config/firebase.ts`
- Create `src/app.ts`, `src/server.ts`
- CORS: `CLIENT_URL`, `credentials: true`
- Global error handler + `asyncHandler` utility

**Files**:
```
server/
  src/app.ts
  src/server.ts
  src/config/env.ts
  src/config/firebase.ts
  src/middleware/asyncHandler.ts
  src/middleware/errorHandler.ts
  src/utils/AppError.ts
  .env.example
  package.json
  tsconfig.json
```

**Verification**:
```bash
cd server && npm run dev
curl http://localhost:5000/api/health   # { success: true, data: { status: 'ok' } }
```

---

### Step 2: Firestore Schema + Seed Script

**Goal**: Define Firestore document types and seed initial portfolio data.

**Scope**:
- `src/types/` — mirror client types + Firestore-specific fields
- `src/utils/firestoreService.ts` — typed get/set/batch/query helpers
- `scripts/seed.ts` — seed admin user, profile, skills, education, projects, settings from fallback data

**Verification**:
```bash
npm run seed
# Firestore console shows populated collections
npx tsc --noEmit
```

---

### Step 3: MOD-AUTH — Authentication

**Goal**: Login, OAuth, JWT, refresh cookies, admin middleware.

**Scope**:
- `src/modules/auth/` — controller, service, strategies, middleware
- `requireAdmin` on all `/api/admin/*`
- Pre-seeded admin only — unknown OAuth emails → 403
- Login rate limit: 5 attempts / 15 min per IP
- OAuth callbacks redirect to `CLIENT_URL`

**Verification**:
```bash
# Frontend login modal → successful auth → Edit button appears
# curl POST /api/auth/login with seeded credentials
```

---

### Step 4: MOD-API — Public Read Endpoints

**Goal**: Serve published portfolio data to visitors.

**Scope**:
- Read from `portfolioPublished` + subcollections
- Strip private fields from `/api/profile` (no email/phone)
- Response wrapper `{ success, data, meta }`
- In-memory cache (5min TTL)
- Rate limit 60/min per IP

**Verification**:
```bash
curl http://localhost:5000/api/profile
curl http://localhost:5000/api/projects
# Frontend loads live data (not just fallbacks)
```

---

### Step 5: MOD-DRAFT — Draft & Publish

**Goal**: CMS draft workflow backing the inline editor.

**Scope**:
- `PATCH /api/admin/draft` — merge `draftChanges` (upsert one draft per admin)
- `GET /api/admin/draft`
- `POST /api/admin/draft/publish` — batch write draft → published, audit log, cache invalidation

**Verification**:
```bash
# Frontend: Edit → Save Draft → Preview → Publish
```

---

### Step 6: MOD-MEDIA — Firebase Storage Pipeline

**Goal**: Image upload, list, delete with Sharp preprocessing.

**Scope**:
- `src/utils/storageService.ts` — Firebase Storage wrapper
- `src/utils/imageProcessor.ts` — Sharp → WebP + thumbnail
- Routes: upload, list, delete
- Delete Storage object before removing Firestore doc

**Verification**:
```bash
# Frontend MediaLibrary: upload, copy URL, delete
```

---

### Step 7: MOD-RESUME + MOD-AI

**Goal**: Resume OCR → AI → diff → approval pipeline.

**Scope**:
- `src/modules/ai/aiService.ts` — all LLM calls, Zod-validated outputs
- Upload PDF → Firebase Storage → `resumeJobs/` doc → in-process worker:
  1. Google Document AI OCR
  2. Anthropic structuring (ResumeSchema from AgentPrompts)
  3. Diff engine vs published data
  4. Store in `resumeDiffs/`, notify admin
- Routes: upload, status, diff, approve (approved fields only)

**Verification**:
```bash
# Frontend ResumeApproval: upload → processing → diff → approve
```

---

### Step 8: MOD-GITHUB — GitHub Sync

**Goal**: Webhook-driven and manual repo sync.

**Scope**:
- `POST /api/github/webhook` — verify HMAC signature, queue job
- `POST /api/admin/github/sync` — manual sync
- Worker: fetch repos, parse README, AI summary if description < 50 chars
- Admin-controlled fields never overwritten by sync
- Routes: repos list, repo settings patch

**Verification**:
```bash
# Frontend RepoSelector: sync, publish/hide toggles
```

---

### Step 9: MOD-VERSION + MOD-AUDIT + MOD-NOTIFY

**Goal**: Version history, activity log, admin notifications.

**Scope**:
- **Versions**: JSON Patch on major publish; rollback creates new draft
- **Audit**: `auditLog()` utility — append-only, no update/delete routes
- **Notifications**: create on contact submit, resume ready, GitHub sync; list + mark read

**Verification**:
```bash
# Frontend: VersionHistory, ActivityCenter, NotificationBell
```

---

### Step 10: MOD-ANALYTICS + MOD-SETTINGS + MOD-HEALTH

**Goal**: Analytics dashboard, global settings, service health, test stubs.

**Scope**:
- Analytics: ingest pageview/event (public, rate-limited); aggregate for `7d/30d/90d`
- Settings: SEO, social, contact, feature flags, theme (single Firestore doc)
- Health: parallel pings — Firestore, Firebase Storage, GitHub, Anthropic, Google OAuth
- Integration test stub (`describe` block) for every route

**Verification**:
```bash
npx tsc --noEmit
npm run build
npm test
# All frontend admin panels connected
```

---

## Final Directory Tree

```
server/src/
├── app.ts
├── server.ts
├── config/
│   ├── env.ts
│   └── firebase.ts
├── middleware/
│   ├── asyncHandler.ts
│   ├── errorHandler.ts
│   ├── requireAdmin.ts
│   ├── rateLimit.ts
│   └── validate.ts
├── utils/
│   ├── AppError.ts
│   ├── auditLog.ts
│   ├── cache.ts
│   ├── diffEngine.ts
│   ├── firestoreService.ts
│   ├── imageProcessor.ts
│   ├── notificationEmitter.ts
│   └── storageService.ts
├── types/
├── modules/
│   ├── auth/
│   ├── portfolio/
│   ├── projects/
│   ├── resume/
│   ├── github/
│   ├── media/
│   ├── ai/
│   ├── analytics/
│   ├── audit/
│   ├── versions/
│   ├── notifications/
│   └── settings/
├── jobs/
│   ├── jobRunner.ts
│   ├── resumeWorker.ts
│   └── githubWorker.ts
└── routes/
    ├── index.ts
    ├── public.routes.ts
    ├── auth.routes.ts
    ├── admin.routes.ts
    └── webhook.routes.ts
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=

ANTHROPIC_API_KEY=
GOOGLE_DOCUMENT_AI_PROJECT=
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=

ADMIN_EMAIL=
ADMIN_PASSWORD=          # used once by seed script to bcrypt-hash
```

---

## Execution Rules

1. **One step per turn** — complete, verify, then move to next
2. **Match frontend API exactly** — paths, methods, response shape
3. **Zod on every input** — bodies, query params, env, AI outputs
4. **Batch writes** for any multi-collection publish/approve
5. **Never write raw OCR to published** — diff + approval only
6. **Append to logs.md** after each step

---

## Deviations from AgentPrompts (log when implementing)

| AgentPrompts | This plan | Reason |
|-------------|-----------|--------|
| MongoDB + transactions | Firestore + batched writes | User chose Firestore |
| Cloudinary | Firebase Storage + Sharp | User chose Firebase for storage |
| BullMQ + Redis | Firestore jobs + in-process workers | No Redis dependency; single-admin MVP |
| WebSocket notifications | Polling on panel open | Frontend already refetches on demand |
| Health: MongoDB, Cloudinary | Health: Firestore, Firebase Storage | Stack change |

---

## Module Coverage Map

| Step | Modules |
|------|---------|
| 1–2 | Infrastructure |
| 3 | MOD-AUTH |
| 4 | MOD-API |
| 5 | MOD-DRAFT, MOD-EDITOR (backend) |
| 6 | MOD-MEDIA |
| 7 | MOD-RESUME, MOD-AI |
| 8 | MOD-GITHUB |
| 9 | MOD-VERSION, MOD-AUDIT, MOD-NOTIFY |
| 10 | MOD-ANALYTICS, MOD-SETTINGS, MOD-THEME, MOD-HEALTH |
