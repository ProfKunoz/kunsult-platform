# Fix: Create Engagement button produces zero Network activity

## What I could and couldn't check

I don't have access to your repository, so I have not seen your actual
`app/tenants/ziproh/engagements/new/page.tsx`. Everything below is
diagnosis from the symptom, not a read of your file — please treat the
checklist answers as hypotheses, confirmed by the fix working, not as
things I observed directly.

## Answering your checklist

1. **Is `CreateEngagementForm` imported and rendered?** — Most likely
   answer: **no, or not correctly.** This is the only explanation
   consistent with *zero* Network and *zero* console activity. If the
   form were rendered and wired, clicking Create Engagement would at
   minimum throw a JS error into the console (e.g. if `useApiClient` threw
   because `TenantProvider` wasn't mounted) — you'd see something.
   Seeing nothing means the click handler never ran, which means the
   button on the page isn't the one `CreateEngagementForm` owns.

2. **Is the button in a real `<form onSubmit={...}>`?** — Inside
   `CreateEngagementForm.tsx` (already delivered), yes — confirmed by
   reading that file, which I do have. The open question was never that
   file; it's whether the *page* actually renders it.

3. **Does it have `"use client"`?** — Yes, in `CreateEngagementForm.tsx`
   as already delivered. Also: if it didn't, your build would have
   failed outright (Next.js errors on hooks/handlers in a Server
   Component) — you said it builds, so this one's ruled out.

4. **Does it use `apiFetch`?** — Yes, in the delivered
   `CreateEngagementForm.tsx`. A wrong-but-present `fetch()` call would
   still show *something* in the Network tab; you're seeing nothing,
   which points upstream of that call entirely.

## The fix

New `app/tenants/ziproh/engagements/new/page.tsx` in this package:
imports and renders `CreateEngagementForm` directly, with `"use client"`
on the page itself (required — see the code comment for why: it passes
a `router.push` closure into the form as a prop, and a Server Component
cannot pass a function prop to a Client Component).

If your actual routing needs the page to stay a Server Component (e.g.
you're reading the tenant slug from `params` for something), the form
still works with no `onCreated` prop at all — it just won't redirect
automatically on success. That's a one-line removal, not a redesign.

## After merging

Click Create Engagement and confirm in DevTools Network tab:

- A `POST /api/engagements` request appears.
- Its request headers include `x-tenant-id`.
- On success, the page navigates to `/tenants/ziproh/engagements/{id}`.

I can't run this myself — no access to your deployment — so this is the
real verification step, not something I can substitute for you.
