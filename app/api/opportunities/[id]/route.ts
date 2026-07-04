import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant-context";
import { withApiErrorHandling } from "@/lib/api-helpers";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"]).optional(),
  estimatedValue: z.number().optional(),
  source: z.string().optional(),
  regulatoryUrgency: z.boolean().optional(),
  closeDate: z.string().datetime().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getTenantContext(req);
    const opportunity = await prisma.opportunity.findFirst({
      where: { id: params.id, tenantId, deletedAt: null },
      include: { proposals: true, quotes: true, organisation: { select: { name: true } } },
    });
    if (!opportunity) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(opportunity);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const parsed = z.object({ title: z.string().min(1) }).and(updateSchema).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const existing = await prisma.opportunity.findFirst({ where: { id: params.id, tenantId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const opportunity = await prisma.opportunity.update({
      where: { id: params.id },
      data: { ...parsed.data, updatedBy: userId },
    });
    return NextResponse.json(opportunity);
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const existing = await prisma.opportunity.findFirst({ where: { id: params.id, tenantId, deletedAt: null } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.opportunity.update({ where: { id: params.id }, data: { deletedAt: new Date(), updatedBy: userId } });
    return NextResponse.json({ deleted: true, id: params.id });
  });
}
