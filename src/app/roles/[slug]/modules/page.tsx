import { notFound } from "next/navigation"
import { ModuleCard } from "@/components/academy/cards/ModuleCard"
import { getRole, getRoleModules } from "@/lib/entities"

export default async function RoleModulesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const modules = getRoleModules(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · training modules
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Modules
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Curated modules pulled from the subjects that most directly shape this role.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.slug}
            module={module}
            basePath={`/roles/${slug}/modules`}
          />
        ))}
      </div>
    </div>
  )
}
