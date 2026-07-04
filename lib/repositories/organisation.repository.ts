import { prisma } from "@/lib/prisma";
import { createTenantRepository } from "./base.repository";

// Foundation-backed: create/update/softDelete on this object automatically
// go through the Permission and Audit Foundation Services (see
// base.repository.ts). Commercial Engine adds no logic beyond that.
export const organisationRepository = createTenantRepository(prisma.organisation, "Organisation");

export async function findOrganisationWithDetail(tenantId: string, id: string) {
  return prisma.organisation.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: {
      contacts: { where: { deletedAt: null } },
      opportunities: { where: { deletedAt: null }, include: { proposals: true, quotes: true } },
      contracts: { where: { deletedAt: null } },
      engagements: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
    },
  });
}
