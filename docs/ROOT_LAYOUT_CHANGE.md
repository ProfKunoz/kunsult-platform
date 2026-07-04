# Root Layout Change (required, manual)

This is the one change I can't make for you — I don't have your actual
`app/layout.tsx`. Add the `<TenantProvider>` wrapper around your existing
layout body. Everything else in your layout stays as-is; only the two
imports and the `<TenantProvider>` wrapper are new.

## Before (illustrative — your actual layout will have more in it)

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## After

```tsx
import { TenantProvider } from "@/lib/foundation/auth/TenantProvider";
import { getServerActorContext } from "@/lib/foundation/auth/session";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const actor = await getServerActorContext();

  return (
    <html lang="en">
      <body>
        <TenantProvider value={actor}>{children}</TenantProvider>
      </body>
    </html>
  );
}
```

Two changes only:

1. Layout becomes `async` (it needs to `await getServerActorContext()`).
2. `{children}` is wrapped in `<TenantProvider value={actor}>`.

## For local testing before real auth exists

`getServerActorContext()` reads three cookies. Set them once in your
browser devtools (Application → Cookies) or via a dev-only route:

```
tenant_id = <any string, e.g. "dev-tenant-1">
user_id   = <any string, e.g. "dev-user-1">
user_role = ADMIN
```

Without `tenant_id` set, `getServerActorContext()` throws intentionally —
that's the same "fail loud, not silent" behaviour as the API side, so a
missing tenant is caught at render time instead of surfacing as a
confusing empty page.
