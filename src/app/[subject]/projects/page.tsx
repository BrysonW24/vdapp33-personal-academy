import { notFound } from "next/navigation"
import { ProjectCard } from "@/components/academy/cards/ProjectCard"
import { getProjects, getSubject } from "@/lib/content"

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const projects = getProjects(slug)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted mb-2">
          {subject.name} · Applied practice
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-3">
          Projects
        </h1>
        <p className="text-editorial-muted text-lg max-w-2xl">
          Learn by doing. Build concrete deliverables that make the subject feel
          real.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-12 text-center">
          <p className="text-editorial-muted text-lg">
            This first migration does not include projects for {subject.name} yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              subjectSlug={slug}
              basePath={`/${slug}/projects`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
