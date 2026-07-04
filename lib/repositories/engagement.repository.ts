import { prisma } from "@/lib/prisma";
import { createTenantRepository } from "./base.repository";

// Foundation-backed — see organisation.repository.ts for what that buys.
export const engagementRepository = createTenantRepository(prisma.engagement, "Engagement");

export async function findEngagementWithFullDetail(tenantId: string, id: string) {
  return prisma.engagement.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: {
      organisation: true,
      contract: true,
      team: { where: { deletedAt: null } },
      milestones: { where: { deletedAt: null }, orderBy: { dueDate: "asc" } },
      products: { where: { deletedAt: null } },
      risks: { where: { deletedAt: null } },
      evidenceItems: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      assessments: { where: { deletedAt: null }, include: { template: true } },
      findings: {
        where: { deletedAt: null },
        include: { recommendations: true, actions: { where: { deletedAt: null } } },
      },
      actions: { where: { deletedAt: null }, orderBy: { dueDate: "asc" } },
      reports: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
    },
  });
}
