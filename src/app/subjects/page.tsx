import { FilterableEntityDirectory } from "@/components/browse/FilterableEntityDirectory"
import { getSubjectBrowseBucket } from "@/components/browse/browse-catalog"
import { getSubjectStats, getSubjects } from "@/lib/content"

export const metadata = {
  title: "Subjects",
}

export default function SubjectsPage() {
  const subjects = getSubjects()

  const entries = subjects.map((subject) => {
    const stats = getSubjectStats(subject.slug)

    return {
      entity: subject,
      href: `/${subject.slug}`,
      bucket: getSubjectBrowseBucket(subject.slug),
      statLine: `${stats.modules} modules · ${stats.frameworks} frameworks · ${stats.projects} projects`,
    }
  })

  return (
    <FilterableEntityDirectory
      eyebrow="Canonical curriculum"
      title="Subjects"
      description="Subjects are the durable foundations of Nexus. They hold the deep curriculum, the frameworks, the projects, the tools, and the field logic that everything else pulls from."
      entries={entries}
    />
  )
}
