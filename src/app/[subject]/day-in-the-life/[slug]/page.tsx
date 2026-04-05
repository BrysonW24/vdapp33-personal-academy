import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { TimelineView } from "@/components/academy/day/TimelineView"
import {
  getDayInLifeScenario,
  getDayInLifeScenarios,
  getSubject,
  getSubjects,
} from "@/lib/content"

export async function generateStaticParams() {
  const subjects = getSubjects()
  const params: { subject: string; slug: string }[] = []

  for (const subject of subjects) {
    const scenarios = getDayInLifeScenarios(subject.slug)
    for (const scenario of scenarios) {
      params.push({ subject: subject.slug, slug: scenario.slug })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject: subjectSlug, slug } = await params
  const subject = getSubject(subjectSlug)
  const scenario = subject ? getDayInLifeScenario(subjectSlug, slug) : null

  if (!subject || !scenario) return { title: "Not Found" }

  return {
    title: `${scenario.title} — Day in the Life`,
    description: scenario.description,
  }
}

export default async function DayInLifeDetailPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject: subjectSlug, slug } = await params
  const subject = getSubject(subjectSlug)
  if (!subject) notFound()

  const scenario = getDayInLifeScenario(subjectSlug, slug)
  if (!scenario) notFound()

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <Breadcrumbs
        segments={[
          { label: subject.name, href: `/${subjectSlug}` },
          { label: "Day in the Life", href: `/${subjectSlug}/day-in-the-life` },
          { label: scenario.title },
        ]}
      />

      <div>
        <Link
          href={`/${subjectSlug}/day-in-the-life`}
          className="inline-flex items-center gap-1.5 text-sm text-editorial-muted hover:text-editorial-ink transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All day-in-the-life stories
        </Link>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{scenario.salary}</Badge>
          <Badge variant="outline">{scenario.companySize}</Badge>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          {scenario.title}
        </h1>
        <p className="text-lg text-editorial-muted leading-relaxed max-w-3xl">
          {scenario.description}
        </p>
      </div>

      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
          Sample day
        </h2>
        <TimelineView scenario={scenario} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Responsibilities
          </h2>
          <ul className="space-y-2 text-sm text-editorial-muted">
            {scenario.responsibilities.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-editorial-green mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Challenges
          </h2>
          <ul className="space-y-2 text-sm text-editorial-muted">
            {scenario.challenges.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-editorial-red mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Rewards
          </h2>
          <ul className="space-y-2 text-sm text-editorial-muted">
            {scenario.rewards.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-editorial-amber mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Career path
          </h2>
          <ul className="space-y-2 text-sm text-editorial-muted">
            {scenario.careerPath.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-editorial-blue mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
