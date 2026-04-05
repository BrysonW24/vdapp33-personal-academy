import { notFound } from "next/navigation"
import { BookOpen, Clock3, FolderKanban, Library, Map, Wrench } from "lucide-react"
import { EntityStartHere } from "@/components/entities/EntityStartHere"
import { buildGuideRail } from "@/lib/guide-rail"
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
  const guideRail = buildGuideRail({
    entity: { kind: "role", slug, name: role.name },
    whyThisMatters: `${role.name} is an embodied synthesis track. It shows what the academy's subjects and topics look like when they become judgment, responsibility, and real-world work.`,
    nextAction: {
      href: stats.modules > 0 ? `/roles/${slug}/modules` : `/roles/${slug}/blueprint`,
      label: stats.modules > 0 ? "Follow the role training path" : "Open the role blueprint",
      description:
        stats.modules > 0
          ? "Use the role lens to pull the most relevant subject modules into one practical path."
          : "This role still has more curation to land, so start with the knowledge stack behind it.",
    },
    applyPrompt: `Ask what this role sees that a casual observer misses, and what kinds of tradeoffs or decisions it has to make under pressure.`,
    debatePrompt: `Which parts of this role are driven by durable principles, and which parts are shaped by industry norms, institutions, or current technology?`,
    truthPrompt: `When you study a role, distinguish the core discipline, the institutional reality, and the media mythology around it.`,
  })

  return (
    <EntityStartHere
      entity={role}
      basePath={`/roles/${slug}`}
      stats={stats}
      intro={{
        title: overview.title,
        summary: overview.summary,
        secondaryTitle: "Core work",
        secondaryBody: overview.coreWork,
        chips: overview.signals,
      }}
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
          description: "Browse the platforms and instruments that show up around the work.",
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
      featuredDayInLifeHref={`/roles/${slug}/day-in-the-life`}
      featuredDayInLifeCount={dayInLife.length}
      guideRail={guideRail}
    />
  )
}
