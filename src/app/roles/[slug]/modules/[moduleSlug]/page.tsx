import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import {
  getRole,
  getRoleLessonsForModule,
  getRoleModule,
} from "@/lib/entities"
import { getSubject } from "@/lib/content"
import { buildGuideRail, buildEntityLink } from "@/lib/guide-rail"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default async function RoleModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>
}) {
  const { slug, moduleSlug } = await params
  const role = getRole(slug)
  const roleModule = getRoleModule(slug, moduleSlug)
  if (!role || !roleModule) notFound()

  const lessons = getRoleLessonsForModule(slug, moduleSlug)
  const firstLesson = lessons[0] ?? null
  const sourceSubject = roleModule.sourceMeta?.sourceSlug
    ? getSubject(roleModule.sourceMeta.sourceSlug)
    : null
  const guideRail = buildGuideRail({
    entity: { kind: "role", slug, name: role.name },
    whyThisMatters: `${roleModule.title} matters here because ${role.name} uses this knowledge in live decisions, real systems, and accountable work.`,
    nextAction: {
      href: firstLesson
        ? `/roles/${slug}/modules/${roleModule.slug}/${firstLesson.slug}`
        : `/roles/${slug}/day-in-the-life`,
      label: firstLesson ? `Start ${firstLesson.title}` : "Ground it in a day-in-the-life",
      description: firstLesson
        ? "Move straight into a lesson so the role lens stays active while you learn the concept."
        : "If the lesson chain is thin, use a real-world scenario to keep the role grounded.",
    },
    applyPrompt: `Ask how a ${role.name} would use ${roleModule.title} under real constraints, limited time, and imperfect information.`,
    debatePrompt: `Which parts of this module are universally useful for the role, and which parts depend on sector, institution, or context?`,
    truthPrompt: `Check both the role truth stack and the underlying subject source before deciding what is actually standard practice.`,
    adjacent: sourceSubject
      ? [buildEntityLink("subject", sourceSubject.slug, sourceSubject.name, "See the canonical subject underneath this role module.")]
      : [],
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <ProgressTracker
        slug={roleModule.slug}
        subjectSlug={roleModule.sourceMeta?.sourceSlug}
        type="module"
      />

      <Breadcrumbs
        segments={[
          { label: "Roles", href: "/roles" },
          { label: role.name, href: `/roles/${slug}` },
          { label: "Modules", href: `/roles/${slug}/modules` },
          { label: roleModule.title },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-editorial-green-soft px-2.5 py-0.5 text-xs font-medium text-editorial-green">
          {roleModule.level}
        </span>
        {roleModule.category ? (
          <span className="inline-block rounded-full bg-editorial-blue-soft px-2.5 py-0.5 text-xs font-medium text-editorial-blue">
            {humanize(roleModule.category)}
          </span>
        ) : null}
        {sourceSubject ? (
          <Link
            href={`/${sourceSubject.slug}`}
            className="inline-block rounded-full bg-editorial-amber-soft px-2.5 py-0.5 text-xs font-medium text-editorial-amber"
          >
            From {sourceSubject.name}
          </Link>
        ) : null}
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
        {roleModule.title}
      </h1>
      <p className="mt-4 text-lg text-editorial-muted">{roleModule.shortSummary}</p>

      <div className="mt-8 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">
          Why it matters
        </h2>
        <p className="mt-3 text-editorial-muted">{roleModule.whyItMatters}</p>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">
          Core concepts
        </h2>
        <ul className="mt-4 space-y-2">
          {roleModule.coreConcepts.map((concept) => (
            <li key={concept} className="flex items-start gap-2 text-editorial-muted">
              <span className="mt-0.5 text-editorial-green">•</span>
              {concept}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">
          Lessons
        </h2>
        <div className="mt-4 space-y-3">
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.slug}
              href={`/roles/${slug}/modules/${roleModule.slug}/${lesson.slug}`}
              className="flex items-center gap-3 rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/78 p-4 transition-shadow hover:shadow-editorial-soft"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-editorial-green-soft text-xs font-semibold text-editorial-green">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-editorial-ink">{lesson.title}</p>
                <p className="text-sm text-editorial-muted">{lesson.objective}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {guideRail}
    </div>
  )
}
