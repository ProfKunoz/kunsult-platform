import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant-context";
import { withApiErrorHandling } from "@/lib/api-helpers";

const createSchema = z.object({
  organisationId: z.string().min(1),
  title: z.string().min(1),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"]).optional(),
  estimatedValue: z.number().optional(),
  source: z.string().optional(),
  regulatoryUrgency: z.boolean().optional(),
  closeDate: z.string().datetime().optional(),
});

// GET /api/opportunities?organisationId=&stage=
export async function GET(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getTenantContext(req);
    const organisationId = req.nextUrl.searchParams.get("organisationId") ?? undefined;
    const stage = req.nextUrl.searchParams.get("stage") ?? undefined;

    const opportunities = await prisma.opportunity.findMany({
      where: { tenantId, organisationId, stage: stage as never, deletedAt: null },
      include: { organisation: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(opportunities);
  });
}

// POST /api/opportunities
export async function POST(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const opportunity = await prisma.opportunity.create({
      data: { ...parsed.data, tenantId, createdBy: userId, updatedBy: userId },
    });

    return NextResponse.json(opportunity, { status: 201 });
  });
}
