# Platform Foundation Services

Added before continuing engine work, per instruction: engines depend on
these rather than each implementing auth, audit, permissions, storage,
notifications, or multi-tenancy independently.

## The six services

| Service | File | What it owns |
|---|---|---|
| Auth | `lib/foundation/auth/auth.service.ts` | Resolves `{ tenantId, userId, role }` for every request. No engine reads headers/session directly. |
| Audit | `lib/foundation/audit/audit.service.ts` | Records CREATE/UPDATE/SOFT_DELETE with before/after state, generic across every entity. |
| Permissions | `lib/foundation/permissions/permission.service.ts` | Role → action grants (`"Report.signOff"`, `"*.delete"`, etc.), wildcard-matched. |
| Storage | `lib/foundation/storage/storage.service.ts` | Single file-registration interface; stub provider today, swap for real blob storage later without touching engines. |
| Notifications | `lib/foundation/notifications/notification.service.ts` | Single `notify()` call; in-app row today, delivery channel field ready for email/SMS later. |
| Search | `lib/foundation/search/search.service.ts` | One text-search filter builder instead of each list endpoint writing its own `contains` clause. |

## How engines actually depend on this (not just import it)

The leverage point is `lib/repositories/base.repository.ts`. Any engine
that builds its repository through `createTenantRepository(delegate,
entityName)` — Organisation and Engagement today — gets permission checks
and audit logging as **part of create/update/softDelete itself**, not as a
step the engine author remembers to add. That's the difference between
"depends on Foundation" and "imports Foundation sometimes":

```ts
export const organisationRepository = createTenantRepository(prisma.organisation, "Organisation");
// .create() / .update() / .softDelete() on this are permission-checked
// and audit-logged automatically — no engine code decides that.
```

Evidence Engine's version history (`lib/repositories/evidence.repository.ts`)
goes through Storage (`storageService.registerFile`) and Audit directly,
since it doesn't fit the generic CRUD shape.

Assurance Engine's Critical Override rollup (`lib/assurance-engine.ts`)
fires a Notification and writes an Audit entry on the transition into
Critical — this is generic Assurance Engine behaviour (works for any
template), not a per-product rule, so it belongs in engine code, not in
a Product App's configuration.

## What's NOT yet migrated

`Contact`, `Opportunity`, and `Risk` routes still call Prisma directly
with inline tenant/soft-delete filters — they predate this layer and
haven't been retrofitted onto `createTenantRepository` yet. They are
correctly tenant-scoped and soft-deleting, but they bypass audit logging
and permission checks. This is real, tracked technical debt — see
`docs/ENGINEERING_REVIEW.md` — not an oversight being glossed over.

## What's still a stub, deliberately

- **Auth**: reads `x-tenant-id` / `x-user-id` / `x-user-role` headers.
  No session verification exists. Replace `auth.service.ts` first when
  wiring real auth — every downstream call site keeps working unchanged.
- **Storage**: `StubStorageProvider` returns a fake deterministic URL.
  Swap the exported `storageService` for a real provider implementing
  the same `StorageProvider` interface.
- **Notifications**: writes to the database only. No email/SMS delivery
  worker exists yet.
