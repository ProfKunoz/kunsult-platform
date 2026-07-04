import { NextResponse } from "next/server";
import { MissingTenantError } from "./foundation/auth/auth.service";
import { ForbiddenError } from "./foundation/permissions/permission.service";

/**
 * Wraps a route handler so tenant/permission/validation/not-found errors
 * map to consistent HTTP responses without every route repeating the same
 * try/catch. Keep route handlers focused on "what"; this owns "how errors
 * become responses."
 */
export async function withApiErrorHandling(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof MissingTenantError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof Error && err.message.includes("not found for this tenant")) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
