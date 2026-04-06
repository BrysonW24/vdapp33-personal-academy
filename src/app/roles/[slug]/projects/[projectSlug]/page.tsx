import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import { getRole, getRoleProject } from "@/lib/entities"
import { getSubject } from "@/lib/content"

export default async function RoleProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>
}) {
  const { slug, projectSlug } = await params
  const role = getRole(slug)
  const project = getRoleProject(slug, projectSlug)
  if (!role || !project) notFound()

  const sourceSubject =
    project.sourceMeta?.sourceKind === "subject" && project.sourceMeta.sourceSlug
      ? getSubject(project.sourceMeta.sourceSlug)
      : null
  const isRoleCoreProject = project.sourceMeta?.sourceKind === "role"

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <ProgressTracker
        slug={project.slug}
        subjectSlug={
          project.sourceMeta?.sourceKind === "subject"
            ? project.sourceMeta.sourceSlug
            : undefined
        }
        type="project"
      />

      <Breadcrumbs
        segments={[
          { label: "Roles", href: "/roles" },
          { label: role.name, href: `/roles/${slug}` },
          { label: "Projects", href: `/roles/${slug}/projects` },
          { label: project.title },
        ]}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-block rounded-full bg-editorial-amber-soft px-2.5 py-0.5 text-xs font-medium text-editorial-amber">
          Difficulty {project.difficulty}/10
        </span>
        <span className="text-xs text-editorial-muted">~{project.estimatedHours} hours</span>
        {isRoleCoreProject ? (
          <span className="inline-block rounded-full bg-editorial-violet-soft px-2.5 py-0.5 text-xs font-medium text-editorial-violet">
            Core role material
          </span>
        ) : null}
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
        <h2 className="font-serif text-lg font-semibold text-editorial-ink">
          Why it matters
        </h2>
        <p className="mt-3 text-editorial-muted">{project.whyItMatters}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink">Skills learned</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.skillsLearned.map((skill) => (
              <span
                key={skill}
                className="inline-block rounded-full bg-editorial-green-soft px-2.5 py-0.5 text-xs font-medium text-editorial-green"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-editorial-ink">Prerequisites</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-editorial-muted">
            {project.prerequisites.map((prerequisite) => (
              <li key={prerequisite} className="flex items-start gap-2">
                <span className="mt-0.5 text-editorial-blue">•</span>
                {prerequisite}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold text-editorial-ink">Steps</h2>
        <div className="mt-4 space-y-4">
          {project.steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/78 p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-editorial-green text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-editorial-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-editorial-muted">{step.description}</p>
                  {step.tips ? (
                    <p className="mt-2 text-sm italic text-editorial-amber">
                      Tip: {step.tips}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
