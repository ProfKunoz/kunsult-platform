import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant-context";
import { withApiErrorHandling } from "@/lib/api-helpers";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  likelihood: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  impact: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  mitigation: z.string().optional(),
  ownerName: z.string().optional(),
});

// GET /api/engagements/[id]/risks
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getTenantContext(req);
    const risks = await prisma.risk.findMany({
      where: { engagementId: params.id, tenantId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(risks);
  });
}

// POST /api/engagements/[id]/risks
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const risk = await prisma.risk.create({
      data: { ...parsed.data, engagementId: params.id, tenantId, createdBy: userId, updatedBy: userId },
    });

    return NextResponse.json(risk, { status: 201 });
  });
}
