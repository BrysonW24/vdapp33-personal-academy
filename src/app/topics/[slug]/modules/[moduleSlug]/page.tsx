import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { getTopic, getTopicSection } from "@/lib/entities"

export default async function TopicConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>
}) {
  const { slug, moduleSlug } = await params
  const topic = getTopic(slug)
  const section = getTopicSection(slug, moduleSlug)
  if (!topic || !section) notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8">
      <Breadcrumbs
        segments={[
          { label: "Topics", href: "/topics" },
          { label: topic.name, href: `/topics/${slug}` },
          { label: "Concepts", href: `/topics/${slug}/modules` },
          { label: section.title },
        ]}
      />

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {topic.name} · concept page
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          {section.title}
        </h1>
      </div>

      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
        <div className="whitespace-pre-line text-base leading-8 text-editorial-muted">
          {section.body}
        </div>
      </section>

      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">Key points</h2>
        <ul className="mt-4 space-y-2">
          {section.keyPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-editorial-muted">
              <span className="mt-0.5 text-editorial-green">•</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-white/84 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">Further reading</h2>
        <ul className="mt-4 space-y-2">
          {section.furtherReading.map((item) => (
            <li key={item} className="flex items-start gap-2 text-editorial-muted">
              <span className="mt-0.5 text-editorial-blue">•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
