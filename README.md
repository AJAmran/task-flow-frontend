# TaskFlow — Project Management SaaS (Frontend)

A production-grade **Next.js 16** frontend for TaskFlow: workspaces own
projects, teams deliver sprints, and members move tasks from backlog to done —
behind secure role-based access and real **bKash sandbox billing**.

> **Live:** _(paste Vercel URL after deploy)_ · **Backend:** `https://task-flow-backend-flax.vercel.app/api/v1`

---

## ✨ Highlights

- **3 roles, 3 dashboards** — Super Admin (platform governance), Org Owner
  (workspaces, billing), Member (delivery) with route + UI level enforcement
- **Full delivery loop** — organizations → invitations → teams → projects →
  sprints → Kanban board / list / calendar → subtasks, comments, attachments
- **Real payments** — bKash tokenized checkout (sandbox) with initiate →
  gateway → confirm flow, success/cancel handling, per-org payment history
- **Platform analytics** — org dashboards and admin overview powered by
  Recharts (status mix, revenue, overdue tracking)
- **Modern UX** — context-aware sidebar, guided onboarding checklist,
  URL-synced filters everywhere, skeletons, toasts, dark mode, responsive

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling / UI | Tailwind CSS v4, shadcn/ui (Base UI), Lucide icons |
| Data | ofetch client + TanStack Query 5 (cache + optimistic updates) |
| Forms | TanStack Form + Zod (backend-matched schemas) |
| Auth | Custom JWT (httpOnly cookies) + Google OAuth, proxy route guard |
| Charts / Dates | Recharts, date-fns, react-day-picker |
| Billing | bKash tokenized sandbox |

## 🚀 Getting Started

```bash
bun install
cp .env.example .env.local   # then fill the two keys below
bun run dev                  # http://localhost:3000
```

### Environment

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `https://task-flow-backend-flax.vercel.app/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client | `*.apps.googleusercontent.com` |

```bash
bun run build    # production build (runs type-check)
bun run lint     # biome check
```

## 🔑 Demo Accounts

| Role | Email | Password | Lands on |
|---|---|---|---|
| Super Admin | `superadmin@gmail.com` | `Super@admin12345` | `/admin` |
| Org Owner | `amran.xgroup@gmail.com` | `Owner@123` | `/dashboard` |
| Member | `firoz03dec@gmail.com` | `Member@123` | `/dashboard` |

> Sandbox wallets for payment testing live in [`testguide.md`](../testguide.md).

## 🗂️ Project Structure

```text
src/
├── api/          # thin ofetch wrappers, one file per domain
├── hooks/        # TanStack Query hooks (queries + mutations + invalidation)
├── types/        # Payload / response interfaces (no `any`)
├── validation/   # Zod schemas mirroring backend rules
├── components/
│   ├── form/     # TanStack Form + shadcn Field forms & wizards
│   ├── modules/  # domain UI: organization, project, task, admin, billing…
│   ├── auth/     # AuthGuard, RoleGuard, access-denied, loading
│   ├── dashboard/# context-aware sidebar + shell
│   ├── layout/   # marketing header / footer
│   └── ui/       # shadcn primitives (+ auto Link-button fix)
├── routes/       # sidebar route configs incl. workspace builders
├── lib/          # apiClient, session marker, formatting utils
├── providers/    # query, google-auth, theme composition
└── app/
    ├── (marketing)/  # home, features, pricing, about, contact
    ├── (auth)/       # login, register, verify, forgot, reset, invitation
    ├── (dashboard)/  # dashboard, workspaces, projects, tasks
    ├── admin/        # platform overview, users, orgs, audit logs
    ├── payment/      # success + cancel redirects
    └── proxy.ts      # cookie-presence route protection
```

### Conventions (must-follow)

- Server Components by default; `"use client"` only for interactivity
- Every data page: `loading.tsx` skeleton (or Suspense fallback) + error
  boundary + empty state; filters/sort/search/page live in the URL
- Mutations invalidate scoped query keys and toast success/error
- No mock data, no fake payments, no `any` types

## 🧪 Testing

Manual suites with expected results: [`testguide.md`](../testguide.md)
(AUTH · PUBLIC · DASH · ORG · TEAM · PROJ · WORK · BILL · ADMIN · NEG · RESP).

## ☁️ Deploy (Vercel)

1. Import the repo, framework preset **Next.js**, root `task-flow-frontend`
   (or deploy this directory).
2. Set **Environment Variables**: `NEXT_PUBLIC_API_URL`,
   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
3. Deploy. Then set the backend `FRONTEND_URL` to the live frontend origin
   so cross-site cookies + CORS keep working.
