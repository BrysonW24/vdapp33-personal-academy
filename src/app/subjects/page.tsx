import { EntityCard } from "@/components/entities/EntityCard"
import {
  getBrowseBucketMeta,
  getSubjectBrowseBucket,
  type BrowseBucket,
} from "@/components/browse/browse-catalog"
import { getSubjectStats, getSubjects } from "@/lib/content"

export const metadata = {
  title: "Subjects",
}

export default function SubjectsPage() {
  const subjects = getSubjects()
  const groupedSubjects = subjects.reduce<Record<string, typeof subjects>>((acc, subject) => {
    const bucket = (subject.macroBucket ??
      getSubjectBrowseBucket(subject.slug)) as BrowseBucket

    if (!acc[bucket]) acc[bucket] = []
    acc[bucket].push(subject)
    return acc
  }, {})

  const orderedBuckets = Object.keys(groupedSubjects) as BrowseBucket[]

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 sm:space-y-10">
      <section className="rounded-[30px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Canonical curriculum
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Subjects
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-editorial-muted">
          Subjects are the durable foundations of Nexus. They hold the deep curriculum,
          the frameworks, the projects, the tools, and the field logic that everything
          else pulls from.
        </p>
      </section>

      {orderedBuckets.map((bucket) => {
        const groupSubjects = groupedSubjects[bucket]
        const bucketMeta = getBrowseBucketMeta(bucket)

        return (
          <section key={bucket} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                {bucketMeta.label}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
                {bucketMeta.label} subjects
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
                {bucketMeta.description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groupSubjects.map((subject) => {
                const stats = getSubjectStats(subject.slug)

                return (
                  <EntityCard
                    key={subject.slug}
                    entity={subject}
                    href={`/${subject.slug}`}
                    eyebrow="Subject"
                    statLine={`${stats.modules} modules · ${stats.projects} projects · ${stats.tools} tools`}
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
