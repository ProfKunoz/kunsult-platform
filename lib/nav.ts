export interface NavItem {
  href: string;
  label: string;
  group: "platform" | "tenant";
}

export const platformNav: NavItem[] = [
  { href: "/operations", label: "Operations Centre", group: "platform" },
  { href: "/tenant-factory", label: "Tenant Factory", group: "platform" },
  { href: "/intelligence", label: "Intelligence Engine", group: "platform" },
  { href: "/data-lake", label: "Data Lake", group: "platform" },
  { href: "/knowledge-lake", label: "Knowledge Lake", group: "platform" },
  { href: "/qa-centre", label: "QA Centre", group: "platform" },
  { href: "/apps", label: "Product Apps", group: "platform" },
];

export const tenantNav: NavItem[] = [
  { href: "/tenants/ziproh", label: "ZIPROH · T-001", group: "tenant" },
];

/**
 * Resolves a human-readable breadcrumb trail for the Tenant Rail based on
 * the current path. Falls back gracefully for unknown segments.
 */
export function resolveTrail(pathname: string): string[] {
  if (pathname.startsWith("/tenants/ziproh/engagements/new")) {
    return ["KUNSULT PLATFORM", "ZIPROH · T-001", "New Engagement"];
  }
  if (pathname.startsWith("/tenants/ziproh")) {
    return ["KUNSULT PLATFORM", "ZIPROH · T-001"];
  }
  if (pathname.startsWith("/tenant-factory")) {
    return ["KUNSULT PLATFORM", "Tenant Factory"];
  }
  if (pathname.startsWith("/operations")) {
    return ["KUNSULT PLATFORM", "Operations Centre"];
  }
  if (pathname.startsWith("/intelligence")) {
    return ["KUNSULT PLATFORM", "Intelligence Engine"];
  }
  if (pathname.startsWith("/data-lake")) {
    return ["KUNSULT PLATFORM", "Data Lake"];
  }
  if (pathname.startsWith("/knowledge-lake")) {
    return ["KUNSULT PLATFORM", "Knowledge Lake"];
  }
  if (pathname.startsWith("/qa-centre")) {
    return ["KUNSULT PLATFORM", "QA Centre"];
  }
  if (pathname.startsWith("/apps")) {
    return ["KUNSULT PLATFORM", "Product Apps"];
  }
  return ["KUNSULT PLATFORM"];
}
