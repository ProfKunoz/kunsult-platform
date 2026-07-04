# Tenant Context Fix — Surgical Package

Fixes: `x-tenant-id` missing on Create Engagement (and any other write),
plus the same root cause silently affecting Server Component pages that
query Prisma with no tenant filter.

Scope, deliberately narrow: no schema changes, no new product features,
no unrelated engine files. Five files + this doc + the layout change.

## Root cause

Nothing on the client ever established "who is the current tenant" —
there was no provider anywhere in the tree, so no component had a tenant
value to attach to a `fetch()` call. The API's 400 was correct behaviour,
not a bug in the API. The missing piece was upstream.

## Files in this package

| File | Purpose |
|---|---|
| `lib/foundation/auth/TenantProvider.tsx` | React Context, holds `{ tenantId, userId, role }`. Mount once at root layout. |
| `lib/foundation/auth/useApiClient.ts` | `useApiClient()` hook → `apiFetch()`. Every client component uses this instead of raw `fetch()`. |
| `lib/foundation/auth/session.ts` | `getServerActorContext()` — same resolution for Server Components, which can't use the React context. |
| `components/CreateOrganisationForm.tsx` | Drop-in form. Fixed: uses `apiFetch`, not `fetch`. |
| `components/CreateEngagementForm.tsx` | Drop-in form for the exact workflow reported broken. Same fix. |

No tenant ID is hard-coded anywhere — both paths resolve from cookies
(`tenant_id`, `user_id`, `user_role`) today, which is a placeholder for
real session/auth, not a fixed value. See "Swap-in point" below.

## Required manual step

Wrap your root layout in `<TenantProvider>` — see
`docs/ROOT_LAYOUT_CHANGE.md` for the exact before/after snippet. This is
the one thing I cannot do without seeing your actual layout file.

## Required manual step, part 2 — unscoped Server Component pages

Acceptance criterion 4 ("Server-side pages no longer query Prisma without
tenant scope") applies to pages I don't have in this package — including
them would pull in repository files outside the stated scope of this fix.
The pattern to apply, wherever a Server Component queries the database
directly:

```tsx
// Before — unscoped, returns every tenant's rows
const organisations = await prisma.organisation.findMany();

// After
import { getServerActorContext } from "@/lib/foundation/auth/session";

const { tenantId } = await getServerActorContext();
const organisations = await prisma.organisation.findMany({
  where: { tenantId, deletedAt: null }, // drop deletedAt if you don't soft-delete
});
```

Apply this to every Server Component that queries the database directly.
If you're using a repository layer, pass `tenantId` into it instead of
querying Prisma inline — the principle is the same either way: no query
runs without a `tenantId` in its `where` clause.

## Using the form components

```tsx
import { CreateEngagementForm } from "@/components/CreateEngagementForm";

<CreateEngagementForm
  defaultOrganisationId={org.id} // optional — omit to show an organisation picker
  onCreated={(engagement) => router.push(`/engagements/${engagement.id}`)}
/>
```

```tsx
import { CreateOrganisationForm } from "@/components/CreateOrganisationForm";

<CreateOrganisationForm
  onCreated={(org) => router.push(`/organisations/${org.id}`)}
/>
```

Both are unopinionated about routing — you decide what happens on success
via `onCreated`, so they drop into a modal, a dedicated page, or a wizard
step equally well.

## Swap-in point for real auth

`session.ts`'s `getServerActorContext()` is the only place reading
cookies directly. When real auth exists, replace its body with your
session/JWT lookup — keep the return shape (`{ tenantId, userId, role }`)
identical and nothing downstream (`TenantProvider`, `useApiClient`, both
form components) needs to change.

## Acceptance criteria — status

1. **All API calls use apiFetch** — true for the two form components in
   this package. I can't verify it for buttons/components outside this
   package that I've never seen.
2. **apiFetch sends x-tenant-id** — confirmed by inspection:
   `useApiClient.ts` sets it from context on every call, unconditionally.
3. **TenantProvider mounted once at app root** — requires the manual step
   above; I cannot merge into your actual layout file without seeing it.
4. **Server-side pages no longer query Prisma without tenant scope** —
   pattern documented above; requires manual application per page since
   those pages aren't in this package's scope.
5. **`npm run build` passes** — **not verified.** I have no network access
   to your repository or a running Next.js/TypeScript toolchain with your
   actual dependencies installed, so I cannot execute your build. I
   checked these five files by manual read for syntax correctness and
   import consistency (all cross-references resolve within this package;
   `TenantProvider.tsx` is the sole source of the `ActorContext` type,
   imported by `session.ts` — no dependency on files outside this zip).
   Please run `npm run build` yourself after merging and treat that as
   the real gate, not this note.
