/**
 * FOUNDATION PERMISSION SERVICE
 *
 * Every engine checks "can this actor do this?" here rather than each
 * engine growing its own ad hoc role checks (e.g. one engine checking
 * `role === "ADMIN"`, another checking `role !== "ASSOCIATE"` — that's how
 * eight engines end up with eight subtly different security models).
 *
 * Action keys are "{entityName}.{verb}", e.g. "Organisation.delete",
 * "Report.signOff". A role's grant list can use "*" as a wildcard for
 * either segment: "*.delete" grants delete on everything; "Report.*"
 * grants everything on Report.
 *
 * SPRINT 1 SCOPE: this is a fixed, code-defined matrix — good enough to
 * enforce real boundaries (e.g. only Lead Consultants sign reports off)
 * without building a permissions UI nobody asked for yet. If tenants need
 * custom roles, that becomes a table-backed version of the same interface
 * — see docs/ENGINEERING_REVIEW.md, Sprint 2 priorities.
 */

const ROLE_GRANTS: Record<string, string[]> = {
  ADMIN: ["*.*"],
  LEAD_CONSULTANT: ["*.create", "*.update", "*.delete", "*.signOff", "*.read"],
  DELIVERY_PARTNER: ["*.create", "*.update", "*.read"],
  ASSOCIATE: ["*.create", "*.update", "*.read"],
  MEMBER: ["*.read"],
};

export class ForbiddenError extends Error {
  constructor(action: string, role: string) {
    super(`Role "${role}" is not permitted to perform "${action}".`);
    this.name = "ForbiddenError";
  }
}

function matches(pattern: string, action: string): boolean {
  const [patEntity, patVerb] = pattern.split(".");
  const [actEntity, actVerb] = action.split(".");
  const entityOk = patEntity === "*" || patEntity === actEntity;
  const verbOk = patVerb === "*" || patVerb === actVerb;
  return entityOk && verbOk;
}

export function can(role: string, action: string): boolean {
  const grants = ROLE_GRANTS[role] ?? ROLE_GRANTS.MEMBER;
  return grants.some((pattern) => matches(pattern, action));
}

export function assertCan(role: string, action: string): void {
  if (!can(role, action)) {
    throw new ForbiddenError(action, role);
  }
}
