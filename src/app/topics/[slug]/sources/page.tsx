import { notFound } from "next/navigation"
import { SourcePackView } from "@/components/guidance/SourcePackView"
import { getSourcePack } from "@/lib/guidance-content"
import { getTopic } from "@/lib/entities"

export default async function TopicSourcesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const pack = getSourcePack("topic", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Truth stack
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {topic.name} Sources
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Topics move across fields quickly. This stack keeps the curiosity broad
          without making your source quality loose.
        </p>
      </div>

      <SourcePackView
        pack={pack}
        emptyTitle={`${topic.name} truth stack is still being curated`}
        emptyBody="This topic already exists as a live lens, but its source hierarchy has not landed yet."
      />
    </div>
  )
}
