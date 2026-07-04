/**
 * FOUNDATION SEARCH SERVICE
 *
 * Sprint 1 scope: a single helper for the "search this list by text" case
 * every engine's list endpoint needs (organisations by name, engagements
 * by name, evidence by title). Postgres full-text search or an external
 * index (e.g. Meilisearch/Algolia) is a Sprint 2 upgrade behind the same
 * function signature — call sites don't change.
 */

export function buildTextSearchFilter(fields: string[], query: string | null | undefined) {
  if (!query) return {};
  return {
    OR: fields.map((field) => ({ [field]: { contains: query, mode: "insensitive" as const } })),
  };
}
