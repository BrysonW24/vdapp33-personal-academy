import { notFound } from "next/navigation"
import { LessonTemplate } from "@/components/academy/lesson/LessonTemplate"
import { getRole, getRoleLesson, getRoleModule } from "@/lib/entities"

export default async function RoleLessonPage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string; lessonSlug: string }>
}) {
  const { slug, moduleSlug, lessonSlug } = await params
  const role = getRole(slug)
  const roleModule = getRoleModule(slug, moduleSlug)
  const lesson = getRoleLesson(slug, lessonSlug)
  if (!role || !roleModule || !lesson) notFound()

  return (
    <LessonTemplate
      lesson={lesson}
      module={roleModule}
      progressSubjectSlug={lesson.sourceMeta?.sourceSlug}
      basePath={`/roles/${slug}/modules`}
      toolkitHref={`/roles/${slug}/toolkit`}
      breadcrumbs={[
        { label: "Roles", href: "/roles" },
        { label: role.name, href: `/roles/${slug}` },
        { label: "Modules", href: `/roles/${slug}/modules` },
        { label: roleModule.title, href: `/roles/${slug}/modules/${roleModule.slug}` },
        { label: lesson.title },
      ]}
    />
  )
}
