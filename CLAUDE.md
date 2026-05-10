# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

NexTest is an AI-powered QA test scenario platform. The frontend is a Next.js 16 app (React 19) where users create projects, generate test scenarios from multiple sources (text, Jira, Excel, PDF), and export them in various formats. The backend runs at `localhost:3001/api`.

**Language:** All UI text, validation messages, and user-facing content is in **Turkish**.

## Critical: Next.js 16 Breaking Changes

This project uses **Next.js 16.2.6**, which has API and convention differences from earlier versions. Before writing any Next.js code, **always** read the relevant guide in `node_modules/next/dist/docs/` — do not rely on training data for Next.js APIs.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint (flat config, v9)
```

No test runner is configured.

## Architecture

### Routing & Layouts

- `app/page.tsx` — Public landing page (scroll-snap sections)
- `app/(auth)/` — Login & register (two-column layout: brand panel + form)
- `app/(dashboard)/` — Protected routes: projects, generation, results, settings, history
- `proxy.ts` — Middleware for route protection (reads `access_token` cookie). In dev mode, auth check is skipped.

All dashboard pages are `'use client'` — no SSR for protected content.

### Authentication Flow

1. Login/register forms submit via `authApi` endpoints
2. `setTokens()` stores JWT in **both** localStorage (client reads) and cookie (server-side middleware reads)
3. `AuthProvider` checks token on mount, fetches user via `/auth/me`
4. 401 responses trigger token refresh with a retry queue (`lib/api/client.ts`)
5. `proxy.ts` redirects: unauthenticated → `/login`, authenticated on public paths → `/projects`

### State Management

- **Server state:** TanStack React Query (60s stale time, 1 retry, no refetch on focus)
- **Auth state:** React Context (`AuthProvider`)
- **Form state:** React Hook Form + Zod (`@hookform/resolvers`)
- No Redux/Zustand — Context + React Query is the chosen pattern

### Design System & Styling

**Two-tier CSS variable system** in `globals.css`:

1. **Primitive palette** (`--palette-*`): Raw color values organized by role
   - `--palette-neutral-*` (warm sand, 0–950)
   - `--palette-brand-*` (forest green, 50–900)
   - `--palette-success|warning|danger|info-*`

2. **Semantic tokens** (`--background`, `--primary`, `--border`, etc.): Map primitives to UI intent. Components reference **only** semantic tokens, never primitives.

**Rules for styling:**
- Always use semantic CSS variables via Tailwind classes (`bg-primary`, `text-muted-foreground`, `border-border`), never hardcode hex values
- Tailwind v4 with `@theme inline` block in `globals.css` bridges CSS variables to Tailwind classes
- shadcn/ui (Radix) components use these tokens automatically
- Dark mode is defined but currently mirrors light mode (intentional)
- Radius tokens: `--radius-sm` (6px) through `--radius-2xl` (24px)

**Fonts** (Google Fonts, loaded in root layout):
- `--font-inter` — body text (sans)
- `--font-fraunces` — headings (serif)
- `--font-jetbrains-mono` — code (mono)

### API Layer

- `lib/api/client.ts` — Axios instance with auth interceptors and token refresh
- `lib/api/endpoints/` — Domain-specific API functions (auth, projects, scenarios, scenario-groups)
- `types/` — TypeScript interfaces matching backend DTOs
- All responses follow `ApiResponse<T>` wrapper; lists use `PaginatedData<T>` with `{ items, meta }`

### Component Organization

- `components/ui/` — shadcn/ui primitives (button, card, dialog, input, etc.)
- `components/shared/` — Reusable app components (form-field, confirm-dialog, page-header, empty-state, loading-spinner)
- `components/layout/` — Topbar, sidebar, theme toggle
- `app/_components/` — Landing page components
- Page-specific hooks live in `app/(auth)/*/_hooks/` colocated with their page

### Key Patterns

- **Form pages:** `useForm()` with Zod schema → `useMutation()` → API call → toast notification
- **Validation schemas:** `lib/validations/` with Turkish error messages
- **API endpoint functions** return `response.data` (the Axios response data), typed as `ApiResponse<T>`
- **Scenario generation** is a two-step flow: generate (AI, no save) → review → save
- **File uploads** (Excel, PDF) use `multipart/form-data` via `FormData`

### Environment

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=NexApp
```
