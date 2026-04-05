import Link from "next/link"
import { notFound } from "next/navigation"
import { getTopic, getTopicSections } from "@/lib/entities"

export default async function TopicModulesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const sections = getTopicSections(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {topic.name} · core concepts
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Concepts
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          These concept pages are the topic’s own learning spine. They sit alongside the
          subject packs rather than replacing them.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, index) => (
          <Link
            key={section.slug}
            href={`/topics/${slug}/modules/${section.slug}`}
            className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              Concept {index + 1}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-editorial-ink">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
              {section.body.slice(0, 220)}...
            </p>
            <p className="mt-4 text-xs text-editorial-muted">
              {section.keyPoints.length} key points · {section.furtherReading.length} further reading links
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
