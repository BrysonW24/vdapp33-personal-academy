import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllLessons, getModules, getSubject } from "@/lib/content"

const LEVEL_ORDER = ["beginner", "intermediate", "advanced"] as const

const LEVEL_COPY: Record<(typeof LEVEL_ORDER)[number], string> = {
  beginner: "Foundations, orientation, and the ideas you need before the field starts to branch.",
  intermediate: "The working middle where concepts connect and the subject starts to feel usable.",
  advanced: "Specialist terrain, synthesis, and the places the subject becomes demanding.",
}

export default async function BlueprintPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const modules = getModules(slug)
  const lessons = getAllLessons(slug)

  const grouped = LEVEL_ORDER.map((level) => ({
    level,
    modules: modules
      .filter((module) => module.level === level)
      .sort((a, b) => (a.levelNumber ?? a.order) - (b.levelNumber ?? b.order)),
  }))

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Generated blueprint
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Blueprint
        </h1>
        <p className="text-editorial-muted text-lg max-w-3xl">
          A generated map of the subject based on module order, levels, and the
          content that has already landed in this migration.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-sm text-editorial-muted">
          <span>{modules.length} modules</span>
          <span>·</span>
          <span>{lessons.length} lessons</span>
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            No modules have been migrated for {subject.name} yet.
          </p>
        </div>
      ) : (
        grouped.map(({ level, modules: levelModules }) => (
          <section key={level}>
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold text-editorial-ink mb-2 capitalize">
                {level}
              </h2>
              <p className="text-sm text-editorial-muted max-w-3xl">
                {LEVEL_COPY[level]}
              </p>
            </div>

            {levelModules.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.5)] p-5 text-sm text-editorial-muted">
                No {level} modules have been published for this subject yet.
              </div>
            ) : (
              <div className="space-y-3">
                {levelModules.map((module, index) => (
                  <Link
                    key={module.slug}
                    href={`/${slug}/modules/${module.slug}`}
                    className="flex items-start gap-4 rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5 hover:shadow-editorial-soft transition-shadow"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-editorial-green-soft text-editorial-green text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-editorial-ink mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-editorial-muted mb-2">
                        {module.shortSummary}
                      </p>
                      <p className="text-xs text-editorial-muted">
                        {module.lessons.length} lessons · {module.coreConcepts.length} core concepts
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  )
}
