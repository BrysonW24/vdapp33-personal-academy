import { notFound } from "next/navigation"
import { DayInLifeExplorer } from "@/components/personal/DayInLifeExplorer"
import { getRole, getRoleDayInLifeScenarios } from "@/lib/entities"

export default async function RoleDayInLifePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const scenarios = getRoleDayInLifeScenarios(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · applied reality
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Day in the Life
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Realistic schedules, responsibilities, and trade-offs help the role feel like
          a life rather than just a title.
        </p>
      </div>

      <DayInLifeExplorer
        scenarios={scenarios}
        basePath={`/roles/${slug}/day-in-the-life`}
      />
    </div>
  )
}
