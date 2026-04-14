import { EntityCard } from "@/components/entities/EntityCard"
import {
  getBrowseBucketMeta,
  getTopicBrowseBucket,
  type BrowseBucket,
} from "@/components/browse/browse-catalog"
import { getTopics, getTopicStats } from "@/lib/entities"

export default function TopicsIndexPage() {
  const topics = getTopics()

  const groupedTopics = topics.reduce<Record<string, typeof topics>>((acc, topic) => {
    const bucket = (topic.macroBucket ?? getTopicBrowseBucket(topic.slug)) as BrowseBucket
    if (!acc[bucket]) acc[bucket] = []
    acc[bucket].push(topic)
    return acc
  }, {})

  const orderedBuckets = Object.keys(groupedTopics) as BrowseBucket[]

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <section className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-5 shadow-editorial-soft sm:rounded-[30px] sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Cross-domain lenses
        </p>
        <h1 className="mt-2 font-serif text-[2.3rem] font-semibold leading-tight text-editorial-ink sm:text-5xl">
          Topics
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-[1.6] text-editorial-muted sm:mt-4 sm:text-lg sm:leading-relaxed">
          Topics let Nexus go broad without flattening everything into subjects. They
          are the curiosity-first layer for larger questions, tensions, worldview
          frames, and big cross-domain ideas.
        </p>
      </section>

      {orderedBuckets.map((bucket) => {
        const bucketMeta = getBrowseBucketMeta(bucket)

        return (
          <section key={bucket} className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {bucketMeta.label}
              </p>
              <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-tight text-editorial-ink sm:text-3xl">
                {bucketMeta.label} topics
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
                These topics help you move through the map by question, synthesis, and
                worldview rather than by discipline alone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {groupedTopics[bucket].map((topic) => {
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
        )
      })}
    </div>
  )
}
