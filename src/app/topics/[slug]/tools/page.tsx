import { notFound } from "next/navigation"
import { ToolCard } from "@/components/academy/cards/ToolCard"
import { getTopic, getTopicTools } from "@/lib/entities"

export default async function TopicToolsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const tools = getTopicTools(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {topic.name} · tools
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Tools
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Tools are pulled from the subjects that most concretely express this topic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} basePath={`/topics/${slug}/tools`} />
        ))}
      </div>
    </div>
  )
}
