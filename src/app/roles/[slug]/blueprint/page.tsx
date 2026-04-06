import Link from "next/link"
import { notFound } from "next/navigation"
import { getRelatedSubjectsForEntity, getRole, getRoleModules } from "@/lib/entities"
import { getSubject } from "@/lib/content"

export default async function RoleBlueprintPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const relatedSubjects = getRelatedSubjectsForEntity("role", slug)
  const modules = getRoleModules(slug)

  const grouped = modules.reduce<Record<string, typeof modules>>((acc, module) => {
    const sourceSlug = module.sourceMeta?.sourceSlug ?? "unknown"
    if (!acc[sourceSlug]) acc[sourceSlug] = []
    acc[sourceSlug].push(module)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · generated blueprint
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Blueprint
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          This blueprint shows where the role training is coming from, whether it lives
          inside the role itself or is pulled from related subjects. It keeps the role
          grounded without pretending every capability comes from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {relatedSubjects.map((subject) => (
          <Link
            key={subject.slug}
            href={`/${subject.slug}`}
            className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-5 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
          >
            <span
              className="mb-4 inline-block h-2.5 w-12 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <h2 className="font-serif text-xl font-semibold text-editorial-ink">
              {subject.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
              {subject.tagline}
            </p>
          </Link>
        ))}
      </div>

      {Object.entries(grouped).map(([sourceSlug, sourceModules]) => {
        const sourceKind = sourceModules[0]?.sourceMeta?.sourceKind
        const subject = sourceKind === "subject" ? getSubject(sourceSlug) : null
        const sourceLabel = subject?.name ?? (sourceKind === "role" ? role.name : sourceSlug)
        const sourceEyebrow = sourceKind === "role" ? "Core role material" : "Source subject"

        return (
          <section key={sourceSlug} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {sourceEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                {sourceLabel}
              </h2>
            </div>

            <div className="space-y-3">
              {sourceModules.map((module, index) => (
                <Link
                  key={module.slug}
                  href={`/roles/${slug}/modules/${module.slug}`}
                  className="flex items-start gap-4 rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5 shadow-editorial-soft transition-shadow hover:shadow-editorial-hover"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-editorial-green-soft text-editorial-green text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-editorial-ink">{module.title}</h3>
                    <p className="mt-1 text-sm text-editorial-muted">
                      {module.shortSummary}
                    </p>
                    <p className="mt-2 text-xs text-editorial-muted">
                      {module.lessons.length} lessons · {module.coreConcepts.length} concepts
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
