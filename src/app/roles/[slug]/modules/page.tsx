import { notFound } from "next/navigation"
import { GroupedModuleIndex } from "@/components/academy/modules/GroupedModuleIndex"
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
    <GroupedModuleIndex
      eyebrow={`${role.name} · training modules`}
      title="Modules"
      description={`Curated modules pulled from the subjects that most directly shape ${role.name}, grouped to make the training path easier to scan and sequence.`}
      modules={modules}
      basePath={`/roles/${slug}/modules`}
      themeColor={role.color}
      emptyState={`No modules have been curated for ${role.name} yet.`}
    />
  )
}
