import { notFound } from "next/navigation"
import { LessonTemplate } from "@/components/academy/lesson/LessonTemplate"
import { getRole, getRoleLesson, getRoleModule } from "@/lib/entities"
import { buildGuideRail } from "@/lib/guide-rail"

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
  const guideRail = buildGuideRail({
    entity: { kind: "role", slug, name: role.name },
    whyThisMatters: `${lesson.title} is here to help you think like a ${role.name}, not just memorize a concept in isolation.`,
    nextAction: {
      href: lesson.nextLesson
        ? `/roles/${slug}/modules/${roleModule.slug}/${lesson.nextLesson}`
        : `/roles/${slug}/projects`,
      label: lesson.nextLesson ? "Continue the role sequence" : "Apply it in role projects",
      description: lesson.nextLesson
        ? "Stay inside the role track while the context is fresh."
        : "Once the lesson sequence ends, the next move is to test the role lens in practice.",
    },
    applyPrompt: `Explain how a ${role.name} would use this lesson in a real decision, briefing, build, or operating rhythm.`,
    debatePrompt: `What changes when this lesson leaves the classroom and enters institutional, technical, or commercial reality?`,
    truthPrompt: `Judge this lesson through both the role's lived reality and the source subject's deeper truth stack.`,
  })

  return (
    <LessonTemplate
      lesson={lesson}
      module={roleModule}
      progressSubjectSlug={
        lesson.sourceMeta?.sourceKind === "subject"
          ? lesson.sourceMeta.sourceSlug
          : undefined
      }
      basePath={`/roles/${slug}/modules`}
      toolkitHref={`/roles/${slug}/toolkit`}
      breadcrumbs={[
        { label: "Roles", href: "/roles" },
        { label: role.name, href: `/roles/${slug}` },
        { label: "Modules", href: `/roles/${slug}/modules` },
        { label: roleModule.title, href: `/roles/${slug}/modules/${roleModule.slug}` },
        { label: lesson.title },
      ]}
      guideRail={guideRail}
    />
  )
}
