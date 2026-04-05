import { notFound } from "next/navigation"
import { FrameworkCard } from "@/components/academy/cards/FrameworkCard"
import { getFrameworks, getSubject } from "@/lib/content"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default async function ToolkitPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const frameworks = getFrameworks(slug)
  const grouped = frameworks.reduce<Record<string, typeof frameworks>>((acc, framework) => {
    if (!acc[framework.category]) acc[framework.category] = []
    acc[framework.category].push(framework)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Mental models
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Toolkit
        </h1>
        <p className="text-editorial-muted text-lg max-w-3xl">
          Frameworks, heuristics, and reusable structures for thinking inside
          this subject.
        </p>
      </div>

      {frameworks.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            This subject does not have framework coverage in the migration yet.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryFrameworks]) => (
          <section key={category} className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
              {humanize(category)}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {categoryFrameworks.map((framework) => (
                <FrameworkCard key={framework.slug} framework={framework} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
