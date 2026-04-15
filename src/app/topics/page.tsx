import { FilterableEntityDirectory } from "@/components/browse/FilterableEntityDirectory"
import { getTopicBrowseBucket } from "@/components/browse/browse-catalog"
import { getTopics, getTopicStats } from "@/lib/entities"

export default function TopicsIndexPage() {
  const topics = getTopics()

  const entries = topics.map((topic) => {
    const stats = getTopicStats(topic.slug)

    return {
      entity: topic,
      href: `/topics/${topic.slug}`,
      bucket: getTopicBrowseBucket(topic.slug),
      statLine: `${stats.sections} concepts · ${stats.projects} applications · ${stats.tools} tools`,
    }
  })

  return (
    <FilterableEntityDirectory
      eyebrow="Cross-domain lenses"
      title="Topics"
      description="Topics let Nexus go broad without flattening everything into subjects. They are the curiosity-first layer for larger questions, tensions, worldview frames, and big cross-domain ideas."
      entries={entries}
    />
  )
}
