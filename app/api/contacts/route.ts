import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant-context";
import { withApiErrorHandling } from "@/lib/api-helpers";

const createSchema = z.object({
  organisationId: z.string().min(1),
  name: z.string().min(1),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// GET /api/contacts?organisationId=
export async function GET(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId } = getTenantContext(req);
    const organisationId = req.nextUrl.searchParams.get("organisationId") ?? undefined;

    const contacts = await prisma.contact.findMany({
      where: { tenantId, organisationId, deletedAt: null },
      orderBy: { isPrimary: "desc" },
    });

    return NextResponse.json(contacts);
  });
}

// POST /api/contacts
export async function POST(req: NextRequest) {
  return withApiErrorHandling(async () => {
    const { tenantId, userId } = getTenantContext(req);
    const parsed = createSchema.safeParse(await req.json());

    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const contact = await prisma.contact.create({
      data: { ...parsed.data, tenantId, createdBy: userId, updatedBy: userId },
    });

    return NextResponse.json(contact, { status: 201 });
  });
}
