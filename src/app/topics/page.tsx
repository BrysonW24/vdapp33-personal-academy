import { Sparkles } from "lucide-react"
import { EntityCard } from "@/components/entities/EntityCard"
import { getTopics, getTopicStats } from "@/lib/entities"
import { SUBJECT_GROUP_LABELS } from "@/types/curriculum"

export default function TopicsIndexPage() {
  const topics = getTopics()

  const grouped = topics.reduce<Record<string, typeof topics>>((acc, topic) => {
    if (!acc[topic.group]) acc[topic.group] = []
    acc[topic.group].push(topic)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <section className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-8 shadow-editorial-soft">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-editorial-amber text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Topic explorer
          </p>
        </div>
        <h1 className="font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Topics
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-editorial-muted">
          Topics let the academy go broad without flattening everything into subjects.
          They bring together concepts, applications, and tools around a curiosity like
          artificial intelligence, energy, investing, or consciousness.
        </p>
      </section>

      {Object.entries(grouped).map(([group, groupTopics]) => (
        <section key={group} className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              {SUBJECT_GROUP_LABELS[group] ?? group}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
              First-wave topic destinations
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupTopics.map((topic) => {
              const stats = getTopicStats(topic.slug)

              return (
                <EntityCard
                  key={topic.slug}
                  entity={topic}
                  href={`/topics/${topic.slug}`}
                  eyebrow="Topic"
                  statLine={`${stats.sections} concepts · ${stats.projects} applications · ${stats.tools} tools`}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
