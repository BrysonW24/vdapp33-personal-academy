import { notFound } from "next/navigation"
import {
  getModules,
  getProjects,
  getSubject,
  getSubjectStats,
  getTools,
} from "@/lib/content"
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

  return (
    <SubjectStartHere
      subject={subject}
      stats={stats}
      firstModule={modules[0] ?? null}
      featuredProject={projects[0] ?? null}
      featuredTool={tools[0] ?? null}
    />
  )
}
