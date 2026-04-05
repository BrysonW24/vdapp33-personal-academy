import { notFound } from "next/navigation"
import { QuestBoard } from "@/components/academy/progress/QuestBoard"
import { getTopic, getTopicProjects } from "@/lib/entities"

export default async function TopicProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const projects = getTopicProjects(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {topic.name} · applications
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Application projects show where this topic lands in real systems and real work.
        </p>
      </div>

      <QuestBoard
        title="Application board"
        subtitle="Projects pulled from the subject packs that best express this topic."
        items={projects.map((project) => ({
          id: project.slug,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          duration: `${project.estimatedHours} hours`,
          tools: project.tools,
          outcomes: project.skillsLearned,
          href: `/topics/${slug}/projects/${project.slug}`,
          ctaLabel: "Open application",
          badge: project.sourceMeta?.sourceSlug,
        }))}
      />
    </div>
  )
}
