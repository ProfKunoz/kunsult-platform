import { prisma } from "@/lib/prisma";

/**
 * FOUNDATION NOTIFICATION SERVICE
 *
 * Any engine that needs to tell someone something — a Critical Override
 * on an assessment, an overdue action, a signed report — calls notify()
 * rather than writing its own Notification-shaped row or, worse, calling
 * an email provider directly from engine code.
 *
 * SPRINT 1 SCOPE: writes an in-app Notification row only. No email/SMS
 * delivery is wired — channel is stored so a delivery worker can be added
 * later without changing call sites (see docs/ENGINEERING_REVIEW.md).
 */

export interface NotifyParams {
  tenantId: string;
  userId?: string | null; // null = tenant-wide/unassigned
  eventType: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  channel?: "IN_APP" | "EMAIL";
}

export async function notify(params: NotifyParams): Promise<void> {
  await prisma.notification.create({
    data: {
      tenantId: params.tenantId,
      userId: params.userId ?? null,
      eventType: params.eventType,
      title: params.title,
      body: params.body,
      entityType: params.entityType,
      entityId: params.entityId,
      channel: params.channel ?? "IN_APP",
    },
  });
}
