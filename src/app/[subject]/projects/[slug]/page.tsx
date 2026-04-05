import Link from "next/link"
import { notFound } from "next/navigation"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import { getProject, getProjects, getSubject, getSubjects } from "@/lib/content"

export async function generateStaticParams() {
  return getSubjects().flatMap((subject) =>
    getProjects(subject.slug).map((project) => ({
      subject: subject.slug,
      slug: project.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject, slug } = await params
  const project = getProject(subject, slug)
  if (!project) return { title: "Not Found" }
  return { title: project.title }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string }>
}) {
  const { subject: subjectSlug, slug } = await params
  const subject = getSubject(subjectSlug)
  const project = getProject(subjectSlug, slug)
  if (!subject || !project) notFound()

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <ProgressTracker slug={project.slug} subjectSlug={subjectSlug} type="project" />

      <nav className="text-sm text-editorial-muted mb-6">
        <Link href={`/${subjectSlug}`} className="hover:text-editorial-ink">
          {subject.name}
        </Link>
        {" / "}
        <Link href={`/${subjectSlug}/projects`} className="hover:text-editorial-ink">
          Projects
        </Link>
        {" / "}
        <span className="text-editorial-ink">{project.title}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-amber-soft text-editorial-amber">
          Difficulty {project.difficulty}/10
        </span>
        <span className="text-xs text-editorial-muted">
          ~{project.estimatedHours} hours
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-editorial-ink mb-4">
        {project.title}
      </h1>
      <p className="text-editorial-muted text-lg mb-6">{project.description}</p>

      <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] shadow-editorial-soft p-6 mb-8">
        <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-2">
          Why it matters
        </h2>
        <p className="text-editorial-muted">{project.whyItMatters}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Skills learned
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {project.skillsLearned.map((skill) => (
              <span
                key={skill}
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-editorial-green-soft text-editorial-green"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Prerequisites
          </h2>
          {project.prerequisites.length === 0 ? (
            <p className="text-sm text-editorial-muted">None listed.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-editorial-muted">
              {project.prerequisites.map((prerequisite) => (
                <li key={prerequisite} className="flex items-start gap-2">
                  <span className="text-editorial-blue mt-0.5">•</span>
                  {prerequisite}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {project.tools.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Tools used
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-editorial-blue-soft text-editorial-blue"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
          Steps
        </h2>
        <div className="space-y-4">
          {project.steps.map((step, index) => (
            <div
              key={index}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-editorial-green text-white text-xs font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-editorial-ink mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-editorial-muted">{step.description}</p>
                  {step.tips && (
                    <p className="text-sm text-editorial-amber mt-2 italic">
                      Tip: {step.tips}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Deliverables
          </h2>
          <ul className="space-y-1.5">
            {project.deliverables.map((deliverable) => (
              <li
                key={deliverable}
                className="flex items-start gap-2 text-sm text-editorial-muted"
              >
                <span className="text-editorial-green mt-0.5">✓</span>
                {deliverable}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
            Evaluation rubric
          </h2>
          <div className="space-y-3">
            {project.rubric.map((criterion) => (
              <div
                key={criterion.criteria}
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/70 p-4"
              >
                <p className="font-medium text-editorial-ink mb-1">
                  {criterion.criteria}
                </p>
                <p className="text-sm text-editorial-muted">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
