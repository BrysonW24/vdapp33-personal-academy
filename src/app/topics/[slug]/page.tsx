import { notFound } from "next/navigation"
import { BookOpen, FolderKanban, Library, Wrench } from "lucide-react"
import { EntityStartHere } from "@/components/entities/EntityStartHere"
import {
  getRelatedSubjectsForEntity,
  getTopic,
  getTopicOverview,
  getTopicProjects,
  getTopicSections,
  getTopicStats,
  getTopicTools,
} from "@/lib/entities"

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  const overview = getTopicOverview(slug)
  if (!topic || !overview) notFound()

  const stats = getTopicStats(slug)
  const relatedSubjects = getRelatedSubjectsForEntity("topic", slug)
  const projects = getTopicProjects(slug)
  const tools = getTopicTools(slug)
  const sections = getTopicSections(slug)

  return (
    <EntityStartHere
      entity={topic}
      basePath={`/topics/${slug}`}
      stats={stats}
      intro={{
        title: overview.title,
        summary: overview.whatItIs,
        secondaryTitle: "Why it matters",
        secondaryBody: overview.whyItMatters,
        chips: overview.keyIdeas,
      }}
      sections={[
        {
          href: `/topics/${slug}/modules`,
          label: "Concepts",
          title: "Core concepts",
          description: "Start with the topic’s own concept stack before branching outward.",
          count: sections.length,
          icon: BookOpen,
        },
        {
          href: `/topics/${slug}/projects`,
          label: "Applications",
          title: "Projects",
          description: "See how the topic turns into usable work in the real world.",
          count: stats.projects,
          icon: FolderKanban,
        },
        {
          href: `/topics/${slug}/tools`,
          label: "Ecosystem",
          title: "Tools",
          description: "Explore tools, platforms, and operational surfaces around the topic.",
          count: stats.tools,
          icon: Wrench,
        },
        {
          href: `/topics/${slug}/toolkit`,
          label: "Perspectives",
          title: "Toolkit",
          description: "Open questions, related frameworks, and the broader lens around the topic.",
          count: stats.frameworks + overview.openQuestions.length,
          icon: Library,
        },
      ]}
      relatedSubjects={relatedSubjects}
      featuredProject={projects[0] ?? null}
      featuredTool={tools[0] ?? null}
    />
  )
}
