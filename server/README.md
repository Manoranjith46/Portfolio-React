# Portfolio OS — Backend Developer Documentation

> **Single-user CMS Platform** | Express · TypeScript · Firebase · Claude AI  
> Built across **10 steps** — from project scaffold to full admin analytics dashboard.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Complete Folder Structure](#complete-folder-structure)
3. [Folder & File Explanations](#folder--file-explanations)
4. [All Packages Explained](#all-packages-explained)
5. [Advanced Pipelines (Non-CRUD)](#advanced-pipelines-non-crud)
6. [API Endpoint Reference](#api-endpoint-reference)
7. [Development History — Step by Step](#development-history--step-by-step)
8. [Errors Faced & Fixes](#errors-faced--fixes)

---

## System Overview

The Portfolio OS backend is a **modular REST API** that powers a single-admin portfolio CMS. Rather than a plain CRUD app, it ships several sophisticated pipelines:

- **OCR → AI → Diff → Approval** pipeline for resume processing
- **RFC 6902 JSON Patch** delta versioning system with snapshot rollbacks
- **Sharp in-memory image processing** with WebP conversion
- **HMAC-SHA256 verified GitHub Webhooks** for push-based sync
- **Anthropic Claude** for project summaries and change classification
- **Zod** runtime validation on every API input and AI output
- **In-memory TTL cache** to reduce Firestore reads for public visitors
- **Append-only audit log** tracing every admin action

---

## Complete Folder Structure

```
server/
├── package.json                  # Node.js project config + npm scripts
├── tsconfig.json                 # TypeScript strict config (NodeNext + ESM)
├── .env.example                  # Environment variables template
├── .gitignore
├── README.md
│
├── scripts/
│   └── seed.ts                   # One-time Firestore seeder
│
└── src/
    ├── app.ts                    # Express app factory (Helmet, CORS, middlewares)
    ├── server.ts                 # HTTP listen entrypoint on PORT 5000
    │
    ├── config/
    │   ├── env.ts                # Zod-validated environment variable loader
    │   └── firebase.ts           # Firebase Admin + GCS bucket lazy initialiser
    │
    ├── middleware/
    │   ├── asyncHandler.ts       # Wraps async route functions, forwards errors
    │   ├── errorHandler.ts       # Global error handler + 404 catcher
    │   ├── requireAdmin.ts       # JWT Bearer token verification guard
    │   ├── optionalAdmin.ts      # Soft admin detection (preview mode)
    │   └── rateLimit.ts          # Login (5/15min) + Public (60/min) rate limiters
    │
    ├── types/
    │   ├── collections.ts        # Firestore collection name + doc ID constants
    │   ├── firestore.ts          # TypeScript document shape definitions
    │   └── index.ts              # Barrel re-export
    │
    ├── constants/
    │   └── seedData.ts           # Portfolio seed data (mirrors frontend fallbackData)
    │
    ├── utils/
    │   ├── AppError.ts           # Custom typed error class with error codes
    │   ├── response.ts           # Standard { success, data, meta } response shape
    │   ├── firestoreService.ts   # Typed Firestore get/set/query/batch/clear helpers
    │   ├── jwt.ts                # JWT sign/verify/refresh token utilities
    │   ├── cache.ts              # In-memory TTL cache (5-minute expiry)
    │   ├── storageService.ts     # Firebase GCS upload + delete helpers
    │   ├── imageProcessor.ts     # Sharp: WebP conversion + thumbnail generation
    │   ├── ocrService.ts         # Google Document AI REST caller + mock fallback
    │   ├── diffEngine.ts         # RFC 6902 JSON Patch create + apply (fast-json-patch)
    │   ├── auditLog.ts           # Append-only event logger to auditLogs collection
    │   └── notificationEmitter.ts# Admin notification creator (unread alerts)
    │
    ├── modules/
    │   ├── auth/
    │   │   ├── authController.ts      # Login, logout, refresh, OAuth redirect handlers
    │   │   ├── authService.ts         # bcrypt verify, JWT issue, DB user lookup
    │   │   └── passportStrategies.ts  # Google + GitHub OAuth2 strategy config
    │   │
    │   ├── portfolio/
    │   │   ├── portfolioController.ts # Public getProfile/Skills/Experience/Projects handlers
    │   │   └── portfolioService.ts    # Cache-first Firestore read + optionalAdmin preview
    │   │
    │   ├── draft/
    │   │   ├── draftController.ts     # GET/PATCH /admin/draft + POST /admin/draft/publish
    │   │   └── draftService.ts        # Dot-notation deep merge + atomic batch publish
    │   │
    │   ├── media/
    │   │   └── mediaController.ts     # Upload (multer + sharp), list, delete handlers
    │   │
    │   ├── ai/
    │   │   └── aiService.ts           # Claude 3.5 Sonnet: resume structure, summaries,
    │   │                              #   version classification, description improve
    │   │
    │   ├── resume/
    │   │   ├── diffEngine.ts          # Slugify-based skill/exp/edu diff comparator
    │   │   ├── resumeWorker.ts        # Background job: OCR → AI → diff → write status
    │   │   └── resumeController.ts    # Upload, status, diff, approve handlers
    │   │
    │   ├── github/
    │   │   ├── githubService.ts       # GitHub API fetch, README parser, AI summarizer
    │   │   └── githubController.ts    # Sync, list repos, update settings, webhook handler
    │   │
    │   ├── versions/
    │   │   └── versionsController.ts  # List versions, rollback to snapshot
    │   │
    │   ├── audit/
    │   │   └── auditController.ts     # GET /admin/audit (immutable log reader)
    │   │
    │   ├── notifications/
    │   │   └── notificationsController.ts  # List, mark-read, mark-all-read
    │   │
    │   ├── settings/
    │   │   └── settingsController.ts  # Get/update site config + theme
    │   │
    │   ├── analytics/
    │   │   └── analyticsController.ts # Pageview/event ingest + aggregated dashboard
    │   │
    │   └── health/
    │       └── healthController.ts    # Parallel ping: Firestore, GCS, GitHub, Anthropic
    │
    ├── routes/
    │   ├── index.ts              # Master router (mounts all sub-routers under /api)
    │   ├── health.routes.ts      # GET /api/health
    │   ├── auth.routes.ts        # /api/auth/* (login, logout, OAuth)
    │   ├── public.routes.ts      # /api/profile, /skills, /experience, /analytics/...
    │   ├── admin.routes.ts       # /api/admin/* (all protected admin endpoints)
    │   └── webhook.routes.ts     # POST /api/github/webhook
    │
    └── test/
        ├── auth.test.ts          # MOD-AUTH integration test stubs
        ├── public.test.ts        # MOD-API integration test stubs
        ├── draft.test.ts         # MOD-DRAFT integration test stubs
        ├── media.test.ts         # MOD-MEDIA integration test stubs
        ├── resume.test.ts        # MOD-RESUME integration test stubs
        ├── github.test.ts        # MOD-GITHUB integration test stubs
        ├── history.test.ts       # MOD-VERSION/AUDIT/NOTIFY test stubs
        └── analytics.test.ts     # MOD-ANALYTICS/SETTINGS/HEALTH test stubs
```

---

## Folder & File Explanations

### `config/`
| File | Purpose |
|---|---|
| `env.ts` | Uses **Zod** to parse `process.env` at startup. If a required variable (e.g. `JWT_ACCESS_SECRET`) is missing, the server refuses to start with a clear error message rather than crashing at runtime. |
| `firebase.ts` | Lazy-initialises Firebase Admin SDK using a service account key from env vars. If credentials are missing, the file returns null-safe stubs so the server can start in dev mode without Firebase. Also exports the `getBucket()` helper for Firebase Storage access. |

### `middleware/`
| File | Purpose |
|---|---|
| `asyncHandler.ts` | A higher-order function that wraps every async route so uncaught promise rejections are forwarded to Express's `next(err)` chain automatically. |
| `errorHandler.ts` | The global Express error handler. Checks for `AppError` instances (structured errors) vs unexpected crashes, then responds with `{ success: false, code, message }`. Also handles the 404 fallthrough catch. |
| `requireAdmin.ts` | Extracts the `Authorization: Bearer <token>` header, verifies the JWT using `jwt.ts`, loads the user doc from Firestore, and attaches `req.user` for downstream handlers. Returns `401` if any step fails. |
| `optionalAdmin.ts` | Same flow as `requireAdmin` but non-blocking — if auth fails, it simply sets `req.user = null` and calls `next()`. Used on public routes so that when the admin views the site they see draft preview data. |
| `rateLimit.ts` | Exports two rate limiters: `loginRateLimiter` (5 requests / 15 min per IP, used on login endpoint) and `publicRateLimiter` (60 requests / 1 min per IP, used on all public visitor routes). |

### `types/`
| File | Purpose |
|---|---|
| `collections.ts` | Single source of truth for all Firestore collection names and singleton document IDs. Using constants (e.g. `Collections.SKILLS`) means refactoring a collection name is a one-line change. |
| `firestore.ts` | TypeScript interfaces matching the shape of every Firestore document (e.g. `PortfolioProfileDoc`, `PortfolioDraftDoc`). These types are used as generics in `firestoreService.ts`. |

### `utils/`
| File | Purpose |
|---|---|
| `AppError.ts` | Custom error class. Constructor: `new AppError(statusCode, code, message, details?)`. The `code` is a string enum (e.g. `ERR_AUTH_FAILED`, `ERR_NOT_FOUND`) that the frontend maps to user-facing messages. |
| `response.ts` | `sendSuccess(res, data, meta?)` helper that wraps all successful responses in `{ success: true, data, meta }` to match the frontend `ApiResponse<T>` type. |
| `firestoreService.ts` | Typed wrappers around the Firestore Admin SDK: `getDocument`, `setDocument`, `deleteDocument`, `getAllDocuments`, `queryDocuments`, `createBatch`, `commitBatch`, `docRef`, `collectionRef`. Also re-exports `FieldValue.serverTimestamp()`. |
| `jwt.ts` | `signAccessToken(payload)` — 15 min expiry. `signRefreshToken(payload)` — 7 day expiry. `verifyAccessToken(token)` — throws `AppError` on failure. Refresh token is set as HttpOnly cookie. |
| `cache.ts` | A simple in-memory `Map<string, { data, expiresAt }>` store with a 5-minute TTL. Used by public portfolio endpoints to avoid billing Firestore reads on every visitor page load. |
| `storageService.ts` | `uploadToStorage(buffer, destPath, contentType)` — saves to GCS and calls `makePublic()`, returns the public CDN URL. `deleteFromStorage(destPath)` — deletes the file (ignores missing files). |
| `imageProcessor.ts` | Uses **Sharp** to process image buffers in-memory. `processImage(buffer)` returns `{ main, thumbnail }` — main is resized to 1600×1600 bounding box and converted to WebP (80% quality); thumbnail is a 200×200 square crop (75% quality). |
| `ocrService.ts` | `performOcr(pdfBuffer)` — acquires an OAuth2 access token from the Firebase Admin credential object, then POSTs the base64-encoded PDF to the Google Document AI REST endpoint. Falls back to a mocked resume text if credentials are missing. Uses native Node.js `fetch` (no axios needed). |
| `diffEngine.ts` | `createPatch(before, after)` — uses `fast-json-patch` to compute an RFC 6902 delta array. `applyPatch(before, patch)` — re-applies a patch to reconstruct an older state for rollbacks. |
| `auditLog.ts` | `auditLog(action, metadata, source, adminId?)` — writes a new document with a unique timestamp-based ID to the `auditLogs` collection. Documents are never updated or deleted. |
| `notificationEmitter.ts` | `createNotification(type, message, adminId?)` — writes a new unread notification to the `notifications` collection. Types include `github_sync`, `resume_ready`, `contact_submit`, etc. |

---

## All Packages Explained

### Core Framework
| Package | Why Used |
|---|---|
| `express` | HTTP request router. Chosen for its maturity, middleware ecosystem, and team familiarity. |
| `typescript` | Static types across the entire codebase. Catches integration bugs at compile time. |
| `tsx` | TypeScript runtime for development. Supports native ESM and hot-reloading via `tsx watch`. |

### Firebase & Cloud
| Package | Why Used |
|---|---|
| `firebase-admin` | Server-side Firestore operations (reads/writes/batches), Firebase Storage access, and OAuth token generation for Document AI calls. |

### Security & Auth
| Package | Why Used |
|---|---|
| `passport` | Authentication middleware orchestrator. Manages strategy lifecycle for OAuth flows. |
| `passport-google-oauth20` | Google OAuth 2.0 strategy. Redirects to Google, handles callback, extracts user profile. |
| `passport-github2` | GitHub OAuth 2.0 strategy. Same pattern as Google but for GitHub accounts. |
| `jsonwebtoken` | Signs and verifies JWTs for stateless admin authentication. Access token: 15 min. Refresh token: 7 days. |
| `bcrypt` | One-way hashing for the admin password in the seed script. Verified on login without ever storing the plaintext. |
| `express-rate-limit` | Protects login from brute-force (5 attempts/15 min) and public routes from scraping (60/min). |
| `helmet` | Sets HTTP response headers like `X-Frame-Options`, `Content-Security-Policy`, and `X-XSS-Protection`. |
| `cors` | Restricts API access to the `CLIENT_URL` origin only, with credentials (cookies) allowed. |
| `cookie-parser` | Parses the `Set-Cookie` header so `req.cookies.refreshToken` is available for token rotation. |

### AI & OCR
| Package | Why Used |
|---|---|
| `@anthropic-ai/sdk` | Official Node.js SDK for the Anthropic Messages API. Used to call Claude 3.5 Sonnet for resume structuring, project summaries, and version change classification. |

### Media Processing
| Package | Why Used |
|---|---|
| `sharp` | High-performance native image processing. Resizes, crops, and converts images to WebP without writing to disk — all done in-memory with `Buffer`. |
| `multer` | Multipart form-data file parser for Express. Configured with `memoryStorage()` so files arrive as `Buffer` objects ready for Sharp and GCS upload. |

### Validation
| Package | Why Used |
|---|---|
| `zod` | Runtime schema validation for env vars, API request bodies, and all AI/LLM outputs. Prevents malformed data from ever reaching the database. |

### Versioning
| Package | Why Used |
|---|---|
| `fast-json-patch` | Implements RFC 6902 JSON Patch standard. `compare(before, after)` generates an array of atomic operations (add, remove, replace). Used to store minimal version deltas. |

---

## Advanced Pipelines (Non-CRUD)

### Pipeline 1 — Resume OCR → AI → Diff → Approval

```
Admin uploads PDF
  │
  ▼
[ocrService.ts]
Firebase Admin token → Google Document AI REST API
Returns raw text string
(Falls back to mock text if no credentials)
  │
  ▼
[aiService.ts → structureResume()]
Raw text + system prompt → Claude 3.5 Sonnet
Returns JSON → Zod ResumeSchema validation
  │
  ▼
[resume/diffEngine.ts → diffResume()]
Slugify-compare extracted vs current DB data:
  • Slugify: "NodeJS" = "node.js" = "nodejs"
  • Produces flat { added[], changed[], removed[] }
  • Each entry has a dot-notation `path` field
  │
  ▼
[Firestore] Resume diff saved to resumeDiffs/latest
  │
  ▼
Admin reviews diff UI → selects which changes to approve
  │
  ▼
[resumeController.ts → approveResumeHandler()]
Merges selected changes into portfolioDrafts/{adminId}.content
Removals sorted DESC by index before splicing
  → Prevents array index-shifting bug
```

### Pipeline 2 — Publish → Version → Audit

```
Admin clicks Publish
  │
  ▼
[draftService.ts → publishDraft()]
Reads current published state (beforeState)
Reads current draft content (afterState)
  │
  ▼
[aiService.ts → classifyVersionChange()]
Compares before vs after:
  - Profile changed? Experience changed? Projects changed?
  → Returns "major" or "minor"
  │
  ▼ (if "major")
[diffEngine.ts → createPatch()]
fast-json-patch.compare(beforeState, afterState)
Returns RFC 6902 patch array
  │
  ▼
Saves to versions/{ver-N}:
  { number, label, patch, snapshot: fullContent }
  │
  ▼
[auditLog.ts]
Writes VERSION_CREATED + DRAFT_PUBLISHED events
  │
  ▼
Batch writes all collections:
profile → portfolioPublished/main
skills, experience, education, projects, services → individual collections
Cache cleared → visitors see new content
```

### Pipeline 3 — GitHub Webhook → AI Summary → Draft

```
GitHub push event
  │
  ▼
POST /api/github/webhook
[githubController.ts]
Verify X-Hub-Signature-256 (HMAC-SHA256 + GITHUB_WEBHOOK_SECRET)
  │
  ▼ (if valid)
[githubService.ts → syncAllRepos()]
Fetch top 15 repos from GitHub API
For each repo:
  - description < 50 chars?
    → fetchRepoReadme() → Claude generateProjectSummary()
    → Returns { overview, features, techStack, challenges }
  - Save to githubRepos/{repoName} (never overwrite admin fields)
  │
  ▼
[githubController.ts → updateRepoSettingsHandler()]
Admin toggles published = true
  → Maps repo to Project object
  → Appends to portfolioDrafts/{adminId}.content.projects
```

### Pipeline 4 — Dot-Notation Deep Merge

The draft patch system accepts granular field paths to prevent overwriting unrelated data:

```typescript
PATCH /api/admin/draft
{ "socialLinks.github": "https://github.com/newurl" }

// Internally:
mergeChanges(content, { "socialLinks.github": "https://..." })
// Only updates content.socialLinks.github
// content.socialLinks.linkedin remains untouched
```

### Pipeline 5 — Rollback Engine

```
Admin selects Version N → POST /api/admin/versions/ver-N/rollback
  │
  ▼
[versionsController.ts → rollbackVersionHandler()]
Reads versions/ver-N.snapshot (the full content object)
  │
  ▼
Overwrites portfolioDrafts/{adminId}.content with snapshot
  │
  ▼
auditLog → VERSION_ROLLED_BACK
  │
  ▼
Admin previews via optionalAdmin preview mode
Admin clicks Publish → live site updates
```

---

## API Endpoint Reference

### Public Routes (no auth required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server + Firebase health status |
| GET | `/api/profile` | Published portfolio profile |
| GET | `/api/skills` | Published skills list |
| GET | `/api/experience` | Published experience list |
| GET | `/api/education` | Published education list |
| GET | `/api/projects` | Published projects list |
| POST | `/api/analytics/pageview` | Track visitor page navigation |
| POST | `/api/analytics/event` | Track visitor interactions |
| POST | `/api/github/webhook` | GitHub push webhook (HMAC verified) |

### Auth Routes
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Email + password login, returns JWT |
| POST | `/api/auth/logout` | Clears refresh token cookie |
| POST | `/api/auth/refresh` | Issues new access token from refresh cookie |
| GET | `/api/auth/google` | Redirect to Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/github` | Redirect to GitHub OAuth |
| GET | `/api/auth/github/callback` | GitHub OAuth callback |

### Admin Routes (Bearer token required)
| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/draft` | Get current draft state |
| PATCH | `/api/admin/draft` | Deep-merge changes using dot-notation |
| POST | `/api/admin/draft/publish` | Publish draft to live site |
| POST | `/api/admin/media/upload` | Upload + process image/file |
| GET | `/api/admin/media` | List media library items |
| DELETE | `/api/admin/media/:id` | Delete media item + storage file |
| POST | `/api/admin/resume/upload` | Upload PDF, run OCR + AI structuring |
| GET | `/api/admin/resume/status/:jobId` | Check processing job status |
| GET | `/api/admin/resume/diff` | Retrieve pending resume diff |
| POST | `/api/admin/resume/approve` | Apply approved changes to draft |
| POST | `/api/admin/github/sync` | Manual GitHub repo sync |
| GET | `/api/admin/github/repos` | List synced repositories |
| PATCH | `/api/admin/github/repos/:repoName` | Toggle publish/pin/feature |
| GET | `/api/admin/versions` | List major publish versions |
| POST | `/api/admin/versions/:id/rollback` | Rollback draft to version snapshot |
| GET | `/api/admin/audit` | Read-only activity audit log |
| GET | `/api/admin/notifications` | List admin notification alerts |
| PATCH | `/api/admin/notifications/:id/read` | Mark single notification read |
| POST | `/api/admin/notifications/read-all` | Batch mark all notifications read |
| GET | `/api/admin/settings` | Get global site settings |
| PATCH | `/api/admin/settings` | Update feature flags, SEO, social links |
| PATCH | `/api/admin/settings/theme` | Update theme colors/fonts |
| GET | `/api/admin/analytics` | Visitor analytics dashboard data |
| GET | `/api/admin/health` | Dependency health latency report |

---

## Development History — Step by Step

### Step 1 — Project Foundation
**Date**: 2026-06-30 | **Module**: Infrastructure

Scaffolded the Express + TypeScript project with Firebase Admin initialization, CORS locked to `CLIENT_URL`, global error handling, and a `/api/health` endpoint.

**Key Decisions:**
- Used `tsx watch` for hot-reload development with native ESM modules
- Firebase init is optional — server starts without credentials (health reports `firebase: not_configured`)
- All environment variables parsed through Zod at startup to fail-fast on misconfiguration

---

### Step 2 — Firestore Schema + Seed Script
**Date**: 2026-06-30 | **Module**: Data Layer

Defined all TypeScript types for Firestore documents and built a seed script that pre-populates the database with portfolio data matching the frontend's fallback content.

**Key Decisions:**
- Fixed document IDs for singletons: `users/admin`, `portfolioPublished/main`, `settings/global`
- Collection docs use prefixed IDs (`skill-0`, `exp-1`) with a `displayOrder` field for frontend ordering
- Default admin credentials seeded as `manoranjithd46@gmail.com` / `admin123` (overridden via env)

---

### Step 3 — MOD-AUTH: Authentication
**Date**: 2026-06-30 | **Module**: Auth

Full authentication system: email/password login, Google OAuth, GitHub OAuth, JWT rotation.

**Key Decisions:**
- OAuth callback URLs use relative paths (e.g. `/api/auth/google/callback`) to resolve dynamically across environments
- JWT access token: 15 min expiry in `Authorization` header
- Refresh token: 7-day expiry stored as HttpOnly cookie
- Rate limit: 5 login attempts per 15 minutes per IP

---

### Step 4 — MOD-API: Public Read Endpoints
**Date**: 2026-06-30 | **Module**: Public API

Public portfolio data endpoints with in-memory caching to avoid excessive Firestore reads.

**Key Decisions:**
- In-memory TTL cache (5-minute expiry) serves repeat visitor requests without DB calls
- Hidden projects (`hidden === true`) filtered in-memory to avoid Firestore composite index requirements
- Private fields (email, phone) stripped from `/api/profile` response for public callers

---

### Step 5 — MOD-DRAFT: Draft & Publish
**Date**: 2026-06-30 | **Module**: CMS Core

The heart of the inline CMS. Admin edits are stored as a single-document snapshot in `portfolioDrafts`. Atomic batch write publishes all collections at once.

**Key Decisions:**
- Draft stored as a single JSON document (`content` field) to prevent partial-edit fragmentation
- Deep merge via dot-notation paths (e.g. `"socialLinks.github"`) allows precision edits from the frontend editor
- `optionalAdmin` middleware auto-serves draft content to authenticated admin for live preview

---

### Step 6 — MOD-MEDIA: Firebase Storage Pipeline
**Date**: 2026-06-30 | **Module**: Media Library

Image upload pipeline using Sharp for in-memory processing before GCS storage.

**Key Decisions:**
- MIME type check: image files go through Sharp; non-image files (PDFs) bypass Sharp and upload directly
- Firestore timestamps converted to ISO strings in list handler to prevent client-side parsing crashes
- GCS files made public immediately on upload to avoid signed-URL complexity

---

### Step 7 — MOD-RESUME + MOD-AI: Resume Pipeline
**Date**: 2026-06-30 | **Module**: AI + Resume

The most sophisticated pipeline in the system: PDF → OCR → Claude → Diff → Selective Approval.

**Key Decisions:**
- Native `fetch` + Firebase Admin access token for Document AI (avoids `@google-cloud/documentai` package bloat)
- Processing runs synchronously in the upload handler (not background queue) for simpler frontend integration
- Descending index sort before array splicing prevents index-shifting bugs on multi-item removals

---

### Step 8 — MOD-GITHUB: GitHub Sync
**Date**: 2026-06-30 | **Module**: GitHub Integration

Event-driven (webhook) and manual sync of GitHub repository data into the portfolio.

**Key Decisions:**
- HMAC-SHA256 signature verification on every webhook request
- AI summaries auto-generated for repos with descriptions shorter than 50 chars
- Repository `published` toggle directly maps the repo to a Project entry in the admin's draft

---

### Step 9 — MOD-VERSION + MOD-AUDIT + MOD-NOTIFY: History & Events
**Date**: 2026-06-30 | **Module**: Version Control & Observability

Publish-time change detection, RFC 6902 patch storage, immutable audit log, and admin notifications.

**Key Decisions:**
- Full content snapshot stored alongside the patch for fast, reliable rollbacks (no patch-replay chain needed)
- AI `classifyVersionChange` determines if changes are major (new version) or minor (skipped)
- Batch `WriteBatch.update()` used to mark-all-read notifications atomically

---

### Step 10 — MOD-ANALYTICS + MOD-SETTINGS + MOD-HEALTH: Dashboard
**Date**: 2026-06-30 | **Module**: Analytics & Settings

Visitor tracking, aggregated analytics dashboard, site configuration, and service health diagnostics.

**Key Decisions:**
- Pageview and event data separated into two collections to partition high-frequency from action data
- Analytics fall back to dynamically seeded mock charts when the events collection is empty
- Health checks run in parallel using `Promise.allSettled`-style try-catch blocks to avoid one failure blocking others

---

## Errors Faced & Fixes

### Error 1 — `AppError` Constructor Signature
- **Problem**: Multiple files called `new AppError('message', 400)` (wrong argument order)
- **Root Cause**: The custom `AppError` class requires `(statusCode, code, message)` not `(message, statusCode)`
- **Fix**: Refactored every `AppError` call to `new AppError(400, ErrorCodes.ERR_VALIDATION, 'message')`

### Error 2 — TypeScript Test File Compilation Failure
- **Problem**: `tsc --noEmit` failed with `Cannot find name 'describe'` in test files
- **Root Cause**: No Mocha/Jest `@types` package was installed, so testing globals were unknown
- **Fix**: Added `declare const describe: any; declare const it: any;` at the top of every test file

### Error 3 — Axios Module Not Found
- **Problem**: `ocrService.ts` imported `axios` which was not installed
- **Root Cause**: Axios was never added to `package.json`
- **Fix**: Replaced `axios.post(...)` with native Node.js `fetch(url, { method: 'POST', ... })` — no external dependency needed

### Error 4 — Import Declarations After Executable Code
- **Problem**: TypeScript compilation rejected files where `import` statements appeared after function definitions
- **Root Cause**: During incremental development, imports were added at the bottom of files instead of the top
- **Fix**: Moved all `import` statements to the top of each file (ESM requirement)

### Error 5 — `req.params` Type Mismatch
- **Problem**: TypeScript rejected passing `req.params.id` to functions expecting `string` because Express types `req.params` as `Record<string, string | string[]>`
- **Fix**: Explicitly cast the value: `const id = req.params.id as string;`

### Error 6 — `z` (Zod) Declared But Never Used
- **Problem**: `mediaController.ts` imported `zod` but never used it (leftover from initial scaffold)
- **Root Cause**: Removed input validation code before landing on multer-only validation
- **Fix**: Removed the `import { z } from 'zod'` line

### Error 7 — `Collections.PAGEVIEWS` Not Found
- **Problem**: `analyticsController.ts` referenced `Collections.PAGEVIEWS` which did not exist
- **Root Cause**: The `pageviews` collection was added in the analytics controller without adding its constant to the types file
- **Fix**: Added `PAGEVIEWS: 'pageviews'` to `collections.ts`

### Error 8 — Unused `next` Parameter Warning as Error
- **Problem**: `healthController.ts` declared `next: NextFunction` in the handler signature but never called it, causing `TS6133: 'next' is declared but its value is never read`
- **Fix**: Renamed to `_next: NextFunction` — TypeScript ignores unused parameters prefixed with `_`

---

## Running the Server

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Fill in FIREBASE_*, JWT_*, ADMIN_* variables

# Seed Firestore (requires valid Firebase credentials)
npm run seed

# Type-check (must pass with 0 errors)
npm run typecheck

# Start development server with hot-reload
npm run dev
# Server starts at http://localhost:5000
# Health check: GET http://localhost:5000/api/health
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=

# AI / OCR
ANTHROPIC_API_KEY=
GOOGLE_DOCUMENT_AI_PROJECT=
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=

# Admin seed credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=
```
