import { notFound } from "next/navigation"
import { FrameworkCard } from "@/components/academy/cards/FrameworkCard"
import { getTopic, getTopicFrameworks, getTopicOverview } from "@/lib/entities"
import { getSubject } from "@/lib/content"

export default async function TopicToolkitPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  const overview = getTopicOverview(slug)
  if (!topic || !overview) notFound()

  const frameworks = getTopicFrameworks(slug)
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
          {topic.name} · perspectives
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Toolkit
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          The toolkit keeps the topic open-ended by combining cross-subject frameworks
          with the big questions that still make it alive.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-editorial-ink">Open questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {overview.openQuestions.map((question) => (
            <div
              key={question}
              className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-5 shadow-editorial-soft"
            >
              <p className="text-sm leading-relaxed text-editorial-muted">{question}</p>
            </div>
          ))}
        </div>
      </section>

      {Object.entries(grouped).map(([sourceSlug, items]) => {
        const sourceSubject = getSubject(sourceSlug)

        return (
          <section key={sourceSlug} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                Related frameworks
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
