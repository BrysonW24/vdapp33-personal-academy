import Link from "next/link"
import { getSubjectStats, getSubjects } from "@/lib/content"
import { SUBJECT_GROUP_LABELS } from "@/types/curriculum"

export const metadata = {
  title: "Subjects",
}

export default function SubjectsPage() {
  const subjects = getSubjects()
  const groupedSubjects = subjects.reduce<Record<string, typeof subjects>>((acc, subject) => {
    if (!acc[subject.group]) acc[subject.group] = []
    acc[subject.group].push(subject)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Canonical curriculum
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Subjects
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Subjects are still the backbone of the academy. They hold the deep
          curriculum, while topics and roles pull from them as lenses.
        </p>
      </div>

      {Object.entries(groupedSubjects).map(([group, groupSubjects]) => (
        <section key={group} className="space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            {SUBJECT_GROUP_LABELS[group] ?? group}
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupSubjects.map((subject) => {
              const stats = getSubjectStats(subject.slug)

              return (
                <Link
                  key={subject.slug}
                  href={`/${subject.slug}`}
                  className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/82 p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
                >
                  <span
                    className="mb-4 inline-block h-2.5 w-12 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <h2 className="font-serif text-2xl font-semibold text-editorial-ink">
                    {subject.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {subject.tagline}
                  </p>
                  <p className="mt-4 text-xs text-editorial-muted">
                    {stats.modules} modules · {stats.projects} projects · {stats.tools} tools
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
