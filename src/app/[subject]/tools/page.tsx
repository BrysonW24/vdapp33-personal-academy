import { notFound } from "next/navigation"
import { ToolCard } from "@/components/academy/cards/ToolCard"
import { getSubject, getTools } from "@/lib/content"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const tools = getTools(slug)
  const grouped = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Tooling
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Tools
        </h1>
        <p className="text-editorial-muted text-lg max-w-2xl">
          The software, platforms, and instruments that make the subject usable
          in practice.
        </p>
      </div>

      {tools.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            Tool coverage has not been migrated for {subject.name} yet.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, categoryTools]) => (
          <section key={category} className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
              {humanize(category)}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  subjectSlug={slug}
                  basePath={`/${slug}/tools`}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
