import { notFound } from "next/navigation"
import { DayInLifeExplorer } from "@/components/personal/DayInLifeExplorer"
import { getDayInLifeScenarios, getSubject } from "@/lib/content"

export default async function DayInLifePage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const scenarios = getDayInLifeScenarios(slug)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Applied reality
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Day in the Life
        </h1>
        <p className="text-editorial-muted text-lg max-w-3xl">
          What the subject feels like when it becomes a job, a practice, or a
          real operating rhythm.
        </p>
      </div>

      {scenarios.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            Day-in-the-life stories have not been migrated for {subject.name} yet.
          </p>
        </div>
      ) : (
        <DayInLifeExplorer scenarios={scenarios} subjectSlug={slug} />
      )}
    </div>
  )
}
