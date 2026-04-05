import { notFound } from "next/navigation"
import { ModuleCard } from "@/components/academy/cards/ModuleCard"
import { getModules, getSubject } from "@/lib/content"

export default async function ModulesPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const modules = getModules(slug)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Curriculum
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Modules
        </h1>
        <p className="text-editorial-muted text-lg max-w-3xl">
          Structured learning across {modules.length} modules, from foundations
          through advanced ideas.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            No modules have been migrated for {subject.name} yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.slug}
              module={module}
              subjectSlug={slug}
              basePath={`/${slug}/modules`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
