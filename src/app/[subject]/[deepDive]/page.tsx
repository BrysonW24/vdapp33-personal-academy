import { notFound } from "next/navigation"
import { getSubjects, getSubject } from "@/lib/content"
import { buildGuideRail } from "@/lib/guide-rail"
import { renderSubjectDeepDive } from "@/lib/subject-deep-dives"

export async function generateStaticParams() {
  return getSubjects().flatMap((subject) =>
    subject.deepDivePages.map((page) => ({
      subject: subject.slug,
      deepDive: page.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; deepDive: string }>
}) {
  const { subject: subjectSlug, deepDive } = await params
  const subject = getSubject(subjectSlug)
  const page = subject?.deepDivePages.find((entry) => entry.slug === deepDive)

  if (!subject || !page) return { title: "Not Found" }

  return {
    title: `${subject.name} · ${page.label}`,
    description: `${page.label} inside ${subject.name}`,
  }
}

export default async function SubjectDeepDivePage({
  params,
}: {
  params: Promise<{ subject: string; deepDive: string }>
}) {
  const { subject: subjectSlug, deepDive } = await params
  const subject = getSubject(subjectSlug)
  if (!subject) notFound()

  const page = subject.deepDivePages.find((entry) => entry.slug === deepDive)
  if (!page) notFound()

  const guideRail = buildGuideRail({
    entity: { kind: "subject", slug: subject.slug, name: subject.name },
    whyThisMatters: `${page.label} exists to make ${subject.name} easier to remember before you branch into detail. Start with the map, then choose where to go deeper.`,
    nextAction:
      subject.slug === "politics" && deepDive === "system"
        ? {
            href: "/politics/modules/regimes-and-ideologies",
            label: "Go deeper into regimes and ideologies",
            description:
              "Once the master map is clear, the next best move is to deepen the first major branch rather than opening five tabs at once.",
          }
        : {
            href: `/${subject.slug}/modules`,
            label: "Continue into the modules",
            description:
              "Use the structured curriculum after the overview so the field stays coherent.",
          },
    applyPrompt:
      subject.slug === "politics"
        ? "Pick one current political event and place it on the map: regime logic, institutions involved, policy stage, lawmaking stage, and scrutiny path."
        : `Use this deep-dive surface to locate one live example from ${subject.name} in the world outside the academy.`,
    debatePrompt:
      subject.slug === "politics"
        ? "Where in this map does public perception drift away from how power actually operates?"
        : `Which parts of this system map are settled, and which parts are still interpretive or contested?`,
    truthPrompt:
      subject.slug === "politics"
        ? "Cross-check the map against Parliament, agencies, courts, and serious interpreters before turning it into dogma."
        : "Use the subject truth stack to separate structural reality from commentary.",
  })

  const rendered = renderSubjectDeepDive(subject, deepDive, guideRail)
  if (!rendered) notFound()

  return rendered
}
