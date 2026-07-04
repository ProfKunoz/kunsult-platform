# KUNSULT Platform — Release 0.1

Multi-tenant operating system for professional service organisations.
This is the platform itself, not a single business's site — ZIPROH is
provisioned as **Tenant 001** running on top of it.

All data in this build is fictional demonstration data. No real client,
patient, or organisational records are represented.

## What's in Release 0.1

| Page | Route |
|---|---|
| Login | `/login` |
| Operations Centre | `/operations` |
| Tenant Factory | `/tenant-factory` |
| ZIPROH Tenant (T-001) | `/tenants/ziproh` |
| New Engagement | `/tenants/ziproh/engagements/new` |
| Intelligence Engine | `/intelligence` |
| Data Lake | `/data-lake` |
| Knowledge Lake | `/knowledge-lake` |
| QA Centre | `/qa-centre` |
| Product Apps | `/apps` |

Stack: Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS ·
lucide-react. No backend/database in this release — all data is served
from `lib/data.ts` as static fictional records, ready to be swapped for
real data sources in Release 0.2.

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/login`. Credentials
are pre-filled; there's no real auth yet in this release.

## Verify the build

```bash
npm run build
```

> **Note on how this was produced:** this codebase was hand-written
> directly (not scaffolded with `create-next-app`) in an environment
> without outbound network access, so `npm install` / `next build`
> could not be executed to verify the build in that environment. Every
> file was checked for syntax correctness with the TypeScript compiler,
> and the code follows standard Next.js 14 App Router conventions
> throughout. Please run `npm install && npm run build` locally (or let
> Vercel run it) as the first real build check before treating this as
> final — if anything fails, send me the error and I'll fix it
> immediately.

## Ship it — push into `ProfKunoz/kunsult-platform`

From this folder:

```bash
git init
git remote add origin https://github.com/ProfKunoz/kunsult-platform.git
git add .
git commit -m "Release 0.1: KUNSULT Platform MVP with ZIPROH as Tenant 001"
git branch -M main
git push -u origin main
```

If the repo already has commits (non-empty), pull first to avoid a
force-push:

```bash
git pull origin main --allow-unrelated-histories
# resolve any conflicts, then:
git push -u origin main
```

Since the repo is already connected to Vercel, this push triggers an
automatic production deploy — no extra steps needed on Vercel's side.

## Next steps for Release 0.2

- Real authentication (NextAuth or Vercel's auth integrations)
- Replace `lib/data.ts` with a real database (Postgres via Vercel
  Postgres, or Supabase) behind API routes / server actions
- Wire the "New engagement" and "Provision tenant" forms to actually
  write data
- Second tenant (KunCoach) fully provisioned as a second reference
  implementation, proving out multi-tenancy beyond ZIPROH
