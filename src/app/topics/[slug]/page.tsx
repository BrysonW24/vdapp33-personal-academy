import { notFound } from "next/navigation"
import { BookOpen, FolderKanban, Library, Wrench } from "lucide-react"
import { EntityStartHere } from "@/components/entities/EntityStartHere"
import { buildGuideRail } from "@/lib/guide-rail"
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
  const guideRail = buildGuideRail({
    entity: { kind: "topic", slug, name: topic.name },
    whyThisMatters: `${topic.name} is a cross-cutting lens. Use it to connect ideas across the academy without losing the deeper subject foundations underneath it.`,
    nextAction: {
      href: `/topics/${slug}/modules`,
      label: "Open the concept stack",
      description:
        "Start with the topic's own concepts first, then branch into projects, tools, signals, and related subjects once the core ideas are stable.",
    },
    applyPrompt: `Map where ${topic.name} shows up in the world today: in institutions, companies, technologies, cultural patterns, or personal decisions.`,
    debatePrompt: `Which claims in ${topic.name} are empirical, which are interpretive, and which are really downstream of values or worldview?`,
    truthPrompt: `Use the truth stack to separate foundational sources from hot takes, trend pieces, and derivative summaries.`,
  })

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
      guideRail={guideRail}
    />
  )
}
