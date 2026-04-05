import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import { getTopic, getTopicTool } from "@/lib/entities"
import { getSubject } from "@/lib/content"

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default async function TopicToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string; toolSlug: string }>
}) {
  const { slug, toolSlug } = await params
  const topic = getTopic(slug)
  const tool = getTopicTool(slug, toolSlug)
  if (!topic || !tool) notFound()

  const sourceSubject = tool.sourceMeta?.sourceSlug
    ? getSubject(tool.sourceMeta.sourceSlug)
    : null

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <ProgressTracker
        slug={tool.slug}
        subjectSlug={tool.sourceMeta?.sourceSlug}
        type="tool"
      />

      <Breadcrumbs
        segments={[
          { label: "Topics", href: "/topics" },
          { label: topic.name, href: `/topics/${slug}` },
          { label: "Tools", href: `/topics/${slug}/tools` },
          { label: tool.name },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-editorial-green-soft px-2.5 py-0.5 text-xs font-medium text-editorial-green">
          {tool.pricingTier}
        </span>
        <span className="inline-block rounded-full bg-editorial-blue-soft px-2.5 py-0.5 text-xs font-medium text-editorial-blue">
          {humanize(tool.category)}
        </span>
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
        {tool.name}
      </h1>
      <p className="mt-4 text-lg text-editorial-muted">{tool.description}</p>

      <div className="mt-8 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-lg font-semibold text-editorial-ink">Why use it</h2>
        <p className="mt-3 text-editorial-muted">{tool.whyUseIt}</p>
      </div>
    </div>
  )
}
