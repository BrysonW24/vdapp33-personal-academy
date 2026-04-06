import { notFound } from "next/navigation"
import { GroupedModuleIndex } from "@/components/academy/modules/GroupedModuleIndex"
import { getRole, getRoleDayInLifeScenarios, getRoleModules, getRoleProjects } from "@/lib/entities"

export default async function RoleModulesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const modules = getRoleModules(slug)
  const projects = getRoleProjects(slug)
  const dayInLife = getRoleDayInLifeScenarios(slug)
  const expertCount = projects.length + dayInLife.length

  return (
    <GroupedModuleIndex
      eyebrow={`${role.name} · training modules`}
      title="Training path"
      description={`Move through ${role.name} in stages. Start with beginner foundations, build intermediate fluency, then use advanced modules and expert application surfaces to make the role feel real.`}
      modules={modules}
      basePath={`/roles/${slug}/modules`}
      themeColor={role.color}
      emptyState={`No modules have been curated for ${role.name} yet.`}
      applicationSurface={
        expertCount > 0
          ? {
              label: "Expert application",
              kicker: "Quests + scenarios",
              description: "Use project quests and day-in-the-life scenarios to pressure-test the training in realistic situations.",
              count: expertCount,
              href: projects.length > 0 ? `/roles/${slug}/projects` : `/roles/${slug}/day-in-the-life`,
            }
          : undefined
      }
    />
  )
}
