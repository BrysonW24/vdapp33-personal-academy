import { Compass } from "lucide-react"
import { EntityCard } from "@/components/entities/EntityCard"
import { getRoles, getRoleStats } from "@/lib/entities"
import { SUBJECT_GROUP_LABELS } from "@/types/curriculum"

export default function RolesIndexPage() {
  const roles = getRoles()

  const grouped = roles.reduce<Record<string, typeof roles>>((acc, role) => {
    if (!acc[role.group]) acc[role.group] = []
    acc[role.group].push(role)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <section className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-8 shadow-editorial-soft">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-editorial-blue text-white">
            <Compass className="h-5 w-5" />
          </span>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Role explorer
          </p>
        </div>
        <h1 className="font-serif text-4xl font-semibold text-editorial-ink sm:text-5xl">
          Roles
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-editorial-muted">
          Role pages turn the old frontier directions into real destinations.
          Each one pulls together the most relevant subject training, projects,
          tools, and day-in-the-life stories into a shareable surface.
        </p>
      </section>

      {Object.entries(grouped).map(([group, groupRoles]) => (
        <section key={group} className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              {SUBJECT_GROUP_LABELS[group] ?? group}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
              Open role destinations
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupRoles.map((role) => {
              const stats = getRoleStats(role.slug)

              return (
                <EntityCard
                  key={role.slug}
                  entity={role}
                  href={`/roles/${role.slug}`}
                  eyebrow="Role"
                  statLine={`${stats.modules} modules · ${stats.projects} projects · ${stats.dayInLife} stories`}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
