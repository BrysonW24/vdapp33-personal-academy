import type { ReactNode } from "react"
import type { SubjectManifest } from "@/types/curriculum"
import { PoliticsSystemPage } from "@/components/subjects/politics/PoliticsSystemPage"

export interface SubjectDeepDiveCard {
  slug: string
  label: string
  icon: string
  href: string
  description: string
}

function getPoliticsSystemDescription() {
  return "A flagship master map of regimes, Australian institutions, lawmaking, influence, scrutiny, and career paths."
}

export function getSubjectDeepDiveCard(
  subjectSlug: string,
  deepDiveSlug: string,
  label: string,
  icon: string
): SubjectDeepDiveCard | null {
  if (subjectSlug === "politics" && deepDiveSlug === "system") {
    return {
      slug: deepDiveSlug,
      label,
      icon,
      href: `/${subjectSlug}/${deepDiveSlug}`,
      description: getPoliticsSystemDescription(),
    }
  }

  return {
    slug: deepDiveSlug,
    label,
    icon,
    href: `/${subjectSlug}/${deepDiveSlug}`,
    description: `${label} is a deeper visual explainer layered on top of the subject.`,
  }
}

export function getSubjectDeepDiveCards(subject: SubjectManifest) {
  return subject.deepDivePages
    .map((page) =>
      getSubjectDeepDiveCard(subject.slug, page.slug, page.label, page.icon)
    )
    .filter((page): page is SubjectDeepDiveCard => Boolean(page))
}

export function renderSubjectDeepDive(
  subject: SubjectManifest,
  deepDiveSlug: string,
  guideRail?: ReactNode
) {
  if (subject.slug === "politics" && deepDiveSlug === "system") {
    return <PoliticsSystemPage subject={subject} guideRail={guideRail} />
  }

  return null
}
