import { prisma } from "@/lib/prisma";
import { RatingLevel } from "@prisma/client";
import { recordAudit } from "@/lib/foundation/audit/audit.service";
import { notify } from "@/lib/foundation/notifications/notification.service";

/**
 * Generic rating rollup for the Assurance Engine.
 *
 * Rule: if ANY answer on an assessment carries a CRITICAL rating, the
 * whole assessment's overallRating is forced to CRITICAL regardless of
 * the rest. Otherwise, roll up by worst-rating-wins.
 *
 * This is the one piece of genuine business logic the Assurance Engine
 * owns, and it is template-agnostic — it reads ratings off whatever
 * questions the template defines and never inspects question text,
 * domain names, or product identity. A future Product App (e.g.
 * "Regulation 17 Review") gets this behaviour for free by loading a
 * template; it must never reimplement this function.
 *
 * Critical Override is itself generic Assurance Engine behaviour, not a
 * product-specific rule — so triggering a notification and an audit
 * entry here (rather than in a product's own code) is correct, not a
 * layering violation.
 */

const SEVERITY_ORDER: RatingLevel[] = ["CRITICAL", "RED", "AMBER", "GREEN", "NOT_APPLICABLE"];

export async function recalculateAssessmentRating(tenantId: string, assessmentId: string) {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, tenantId, deletedAt: null },
    include: { engagement: { select: { id: true, name: true } } },
  });
  if (!assessment) throw new Error(`Assessment ${assessmentId} not found for this tenant`);

  const answers = await prisma.assessmentAnswer.findMany({
    where: { assessmentId },
    select: { rating: true },
  });

  if (answers.length === 0) {
    return prisma.assessment.update({
      where: { id: assessmentId },
      data: { overallRating: null, criticalOverride: false },
    });
  }

  const hasCritical = answers.some((a) => a.rating === "CRITICAL");
  const wasCritical = assessment.criticalOverride;

  const worst = answers.reduce((worst, a) => {
    const currentIdx = SEVERITY_ORDER.indexOf(a.rating);
    const worstIdx = SEVERITY_ORDER.indexOf(worst);
    return currentIdx < worstIdx ? a.rating : worst;
  }, "NOT_APPLICABLE" as RatingLevel);

  const updated = await prisma.assessment.update({
    where: { id: assessmentId },
    data: {
      overallRating: hasCritical ? "CRITICAL" : worst,
      criticalOverride: hasCritical,
    },
  });

  await recordAudit({
    tenantId,
    entityType: "Assessment",
    entityId: assessmentId,
    action: "UPDATE",
    after: { overallRating: updated.overallRating, criticalOverride: updated.criticalOverride },
  });

  // Fire only on the transition into Critical Override, not on every
  // recalculation that happens to still be Critical — avoids a
  // notification per answer while an assessor is still working through
  // a template.
  if (hasCritical && !wasCritical) {
    await notify({
      tenantId,
      eventType: "ASSESSMENT_CRITICAL_OVERRIDE",
      title: "Critical rating raised",
      body: `Assessment on engagement "${assessment.engagement.name}" has a Critical Override finding requiring immediate attention.`,
      entityType: "Assessment",
      entityId: assessmentId,
    });
  }

  return updated;
}
