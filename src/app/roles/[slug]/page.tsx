import { notFound } from "next/navigation"
import {
  BookOpen,
  Clock3,
  FileSearch,
  FolderKanban,
  Library,
  Map,
  Newspaper,
  Wrench,
} from "lucide-react"
import { RoleAcademyHome } from "@/components/roles/RoleAcademyHome"
import { getSignalDigest, getSourcePack } from "@/lib/guidance-content"
import {
  getRelatedSubjectsForEntity,
  getRole,
  getRoleDayInLifeScenarios,
  getRoleOverview,
  getRoleProjects,
  getRoleStats,
  getRoleTools,
} from "@/lib/entities"

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  const overview = getRoleOverview(slug)
  if (!role || !overview) notFound()

  const stats = getRoleStats(slug)
  const relatedSubjects = getRelatedSubjectsForEntity("role", slug)
  const projects = getRoleProjects(slug)
  const tools = getRoleTools(slug)
  const dayInLife = getRoleDayInLifeScenarios(slug)
  const sourcePack = getSourcePack("role", slug)
  const signalDigest = getSignalDigest("role", slug)

  const sourceCount = sourcePack?.tiers.length ?? 0
  const signalCount =
    signalDigest?.sections.reduce(
      (sum, section) => sum + section.items.length,
      0
    ) ?? 0

  return (
    <RoleAcademyHome
      role={role}
      overview={overview}
      basePath={`/roles/${slug}`}
      stats={stats}
      sections={[
        {
          href: `/roles/${slug}/blueprint`,
          label: "Map",
          title: "Blueprint",
          description: "See the subject tracks that most directly shape this role.",
          count: relatedSubjects.length,
          icon: Map,
        },
        {
          href: `/roles/${slug}/modules`,
          label: "Training",
          title: "Modules",
          description: "Follow the curriculum most relevant to actually doing the work.",
          count: stats.modules,
          icon: BookOpen,
        },
        {
          href: `/roles/${slug}/sources`,
          label: "Truth",
          title: "Sources",
          description: "Open the curated source stack behind the role's judgment and standards.",
          count: sourceCount,
          icon: FileSearch,
        },
        {
          href: `/roles/${slug}/signals`,
          label: "Live",
          title: "Signals",
          description: "See the developments and debates people in the role keep tracking.",
          count: signalCount,
          icon: Newspaper,
        },
        {
          href: `/roles/${slug}/projects`,
          label: "Practice",
          title: "Projects",
          description: "Use project work to make the role feel concrete instead of abstract.",
          count: stats.projects,
          icon: FolderKanban,
        },
        {
          href: `/roles/${slug}/tools`,
          label: "Ecosystem",
          title: "Tools",
          description: "Open the platforms and instruments that show up around the work.",
          count: stats.tools,
          icon: Wrench,
        },
        {
          href: `/roles/${slug}/toolkit`,
          label: "Mental models",
          title: "Toolkit",
          description: "Curated frameworks pulled from the subjects most relevant to this role.",
          count: stats.frameworks,
          icon: Library,
        },
        {
          href: `/roles/${slug}/day-in-the-life`,
          label: "Applied reality",
          title: "Day in the Life",
          description: "Ground the role with realistic schedules, challenges, and rewards.",
          count: stats.dayInLife,
          icon: Clock3,
        },
      ]}
      relatedSubjects={relatedSubjects}
      featuredProject={projects[0] ?? null}
      featuredTool={tools[0] ?? null}
      sourcePack={sourcePack}
      signalDigest={signalDigest}
      featuredDayInLifeHref={`/roles/${slug}/day-in-the-life`}
      featuredDayInLifeCount={dayInLife.length}
    />
  )
}
