import { notFound } from "next/navigation"
import { QuestBoard } from "@/components/academy/progress/QuestBoard"
import { getRole, getRoleProjects } from "@/lib/entities"

export default async function RoleProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const projects = getRoleProjects(slug)

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {role.name} · applied practice
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-editorial-muted">
          Quest-style project work makes the role feel real by tying the training to
          concrete outputs.
        </p>
      </div>

      <QuestBoard
        title="Role quest board"
        subtitle="Projects drawn from the most relevant subject packs."
        items={projects.map((project) => ({
          id: project.slug,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          duration: `${project.estimatedHours} hours`,
          tools: project.tools,
          outcomes: project.skillsLearned,
          href: `/roles/${slug}/projects/${project.slug}`,
          ctaLabel: "Open project",
          badge: project.sourceMeta?.sourceSlug,
        }))}
      />
    </div>
  )
}
