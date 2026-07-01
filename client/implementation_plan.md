# Implementation Plan — Frontend (Updated)

> Plan has been written to [Frontend_Plan.md](file:///e:/Projects/Portfolio-React/client/Frontend_Plan.md) in the project.

## Decisions Applied

| # | Decision |
|---|----------|
| 1 | ✅ Add Experience section (between Education & Contact) |
| 2 | ❌ Testimonials — feature flag later |
| 3 | Login as **modal overlay** — no React Router |
| 4 | **GSAP** — keep it (smoother scroll animations, already integrated) |

## Corrected Tech Stack

- React **19** (not 18) + TypeScript
- Vite **7** (not older)
- **Vanilla CSS** (not Tailwind — the codebase doesn't use it)
- **GSAP** + ScrollTrigger (not Framer Motion)
- TanStack Query v5, Zustand, React Hook Form + Zod, Axios
- **No React Router** (single-page, login = modal)

## 10-Step Breakdown

| Step | Scope | Key Deliverables |
|------|-------|-----------------|
| **1** | TypeScript + deps + config | tsconfig, vite.config.ts, dependency install |
| **2** | Types + constants | ~11 type files, 3 constant files |
| **3** | Decompose monolith | 9 visitor components, 1 shared, Portfolio page |
| **4** | Zustand stores + hooks | authStore, editorStore, useScrollSpy, useTheme |
| **5** | API layer | Axios client, 12 API modules, QueryClientProvider |
| **6** | Data-driven components + Experience | Hook up queries, add Experience section |
| **7** | Login modal + auth | LoginModal, Modal, Toast, auth flow |
| **8** | Inline editor + draft | OverlayEditor, EditModeBar, useInlineEdit |
| **9** | Admin panels (Resume, GitHub, Media, Versions, Audit) | 9 admin components |
| **10** | Analytics, Theme, Settings, Health, Notifications | 7 admin components, tracking hook |

**Each step = one turn. Verify before proceeding to the next.**

See [Frontend_Plan.md](file:///e:/Projects/Portfolio-React/client/Frontend_Plan.md) for full details including file lists, verification commands, and execution rules.
