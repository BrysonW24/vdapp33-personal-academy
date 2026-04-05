import { notFound } from "next/navigation"
import {
  getModules,
  getProjects,
  getSubject,
  getSubjectStats,
  getTools,
} from "@/lib/content"
import { buildGuideRail } from "@/lib/guide-rail"
import { SubjectStartHere } from "@/components/personal/SubjectStartHere"

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const stats = getSubjectStats(slug)
  const modules = getModules(slug)
  const projects = getProjects(slug)
  const tools = getTools(slug)
  const firstModule = modules[0] ?? null

  const guideRail = buildGuideRail({
    entity: { kind: "subject", slug, name: subject.name },
    whyThisMatters: `${subject.name} is one of the academy's canonical foundations. Use it to build durable mental models before you widen back out into topics, roles, projects, and live signals.`,
    nextAction: {
      href: firstModule ? `/${slug}/modules/${firstModule.slug}` : `/${slug}/blueprint`,
      label: firstModule ? `Start ${firstModule.title}` : "Open the subject blueprint",
      description: firstModule
        ? "The fastest way to make this subject useful is to move through one real module instead of skimming the whole surface."
        : "There is no clear first module yet, so use the blueprint to understand the shape of the field.",
    },
    applyPrompt: `Pick one idea from ${subject.name} and locate where it shows up in a real system, institution, company, or decision you care about.`,
    debatePrompt: `Which parts of ${subject.name} feel settled here, and which parts are still interpretive, contested, or model-dependent?`,
    truthPrompt: `Before you lock in a view, separate first principles, primary authorities, mature interpreters, and commentary.`,
  })

  return (
    <SubjectStartHere
      subject={subject}
      stats={stats}
      firstModule={firstModule}
      featuredProject={projects[0] ?? null}
      featuredTool={tools[0] ?? null}
      guideRail={guideRail}
    />
  )
}
