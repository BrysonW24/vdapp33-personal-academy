import { notFound } from "next/navigation"
import { FrameworkCard } from "@/components/academy/cards/FrameworkCard"
import { getRole, getRoleFrameworks } from "@/lib/entities"
import { getSubject } from "@/lib/content"

export default async function RoleToolkitPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const frameworks = getRoleFrameworks(slug)
  const grouped = frameworks.reduce<Record<string, typeof frameworks>>((acc, framework) => {
    const sourceSlug = framework.sourceMeta?.sourceSlug ?? "unknown"
    if (!acc[sourceSlug]) acc[sourceSlug] = []
    acc[sourceSlug].push(framework)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · toolkit
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Toolkit
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Frameworks and mental models pulled from the subjects that most matter for this role.
        </p>
      </div>

      {Object.entries(grouped).map(([sourceSlug, items]) => {
        const sourceSubject = getSubject(sourceSlug)

        return (
          <section key={sourceSlug} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                Source subject
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
                {sourceSubject?.name ?? sourceSlug}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((framework, index) => (
                <FrameworkCard
                  key={framework.slug}
                  framework={framework}
                  essential={index < 2}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
