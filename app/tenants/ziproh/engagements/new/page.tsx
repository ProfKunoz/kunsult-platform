"use client";

import { useRouter } from "next/navigation";
import { CreateEngagementForm } from "@/components/CreateEngagementForm";

/**
 * FIX: whatever this file previously rendered, the button it produced was
 * not wired to CreateEngagementForm's handleSubmit — hence zero Network
 * activity on click; the click had nothing to call.
 *
 * This page needs "use client" itself: it passes an onCreated closure
 * (using useRouter) into CreateEngagementForm as a prop, and a Server
 * Component cannot pass a function prop to a Client Component — that's
 * a hard Next.js error, not just a lint warning. If your actual page
 * doesn't need routing logic here, it could stay a Server Component and
 * render <CreateEngagementForm /> with no onCreated prop at all; the
 * form still works standalone, it just won't redirect on success.
 *
 * If this page needs the "ziproh" tenant slug for anything (breadcrumbs,
 * a default organisation), read it from the route params — but do NOT
 * use it to set x-tenant-id or hard-code a tenant: that still comes from
 * TenantProvider via useApiClient inside the form.
 */
export default function NewEngagementPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">New Engagement</h1>
      <CreateEngagementForm
        onCreated={(engagement) => {
          router.push(`/tenants/ziproh/engagements/${engagement.id}`);
        }}
      />
    </div>
  );
}

