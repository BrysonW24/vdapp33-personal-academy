import { notFound } from "next/navigation"
import { GroupedModuleIndex } from "@/components/academy/modules/GroupedModuleIndex"
import { getModules, getSubject } from "@/lib/content"

export default async function ModulesPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const modules = getModules(slug)

  return (
    <GroupedModuleIndex
      eyebrow={`${subject.name} · curriculum`}
      title="Modules"
      description={`Structured learning across ${modules.length} modules, grouped so the field reads as a progression instead of a flat catalog.`}
      modules={modules}
      basePath={`/${slug}/modules`}
      subjectSlug={slug}
      themeColor={subject.color}
      emptyState={`No modules have been migrated for ${subject.name} yet.`}
    />
  )
}
