import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import { getTopic, getTopicProject } from "@/lib/entities"
import { getSubject } from "@/lib/content"

export default async function TopicProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>
}) {
  const { slug, projectSlug } = await params
  const topic = getTopic(slug)
  const project = getTopicProject(slug, projectSlug)
  if (!topic || !project) notFound()

  const sourceSubject = project.sourceMeta?.sourceSlug
    ? getSubject(project.sourceMeta.sourceSlug)
    : null

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <ProgressTracker
        slug={project.slug}
        subjectSlug={project.sourceMeta?.sourceSlug}
        type="project"
      />

      <Breadcrumbs
        segments={[
          { label: "Topics", href: "/topics" },
          { label: topic.name, href: `/topics/${slug}` },
          { label: "Projects", href: `/topics/${slug}/projects` },
          { label: project.title },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-editorial-amber-soft px-2.5 py-0.5 text-xs font-medium text-editorial-amber">
          Difficulty {project.difficulty}/10
        </span>
        <span className="text-xs text-editorial-muted">~{project.estimatedHours} hours</span>
        {sourceSubject ? (
          <Link
            href={`/${sourceSubject.slug}`}
            className="inline-block rounded-full bg-editorial-blue-soft px-2.5 py-0.5 text-xs font-medium text-editorial-blue"
          >
            From {sourceSubject.name}
          </Link>
        ) : null}
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold text-editorial-ink sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-editorial-muted">{project.description}</p>

      <div className="mt-8 rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-white/80 p-6 shadow-editorial-soft">
        <h2 className="font-serif text-lg font-semibold text-editorial-ink">Why it matters</h2>
        <p className="mt-3 text-editorial-muted">{project.whyItMatters}</p>
      </div>
    </div>
  )
}
