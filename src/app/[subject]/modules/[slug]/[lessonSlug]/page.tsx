import { notFound } from "next/navigation"
import {
  getSubjects,
  getSubject,
  getModules,
  getModule,
  getLessons,
  getLesson,
} from "@/lib/content"
import { LessonTemplate } from "@/components/academy/lesson/LessonTemplate"
import { CloudVisualPrimer } from "@/components/subjects/cloud/CloudVisualPrimer"
import { buildGuideRail } from "@/lib/guide-rail"

function getCloudLessonVisualFocus(lessonSlug: string) {
  switch (lessonSlug) {
    case "what-is-cloud":
    case "cloud-service-models-and-business-shape":
      return "general" as const
    case "aws-azure-gcp-heroku-snowflake":
      return "comparison" as const
    case "working-with-cloud-in-the-real-world":
      return "aws" as const
    case "cloud-cost-risk-and-governance":
      return "responsibility" as const
    default:
      return "full" as const
  }
}

export async function generateStaticParams() {
  return getSubjects().flatMap((s) =>
    getModules(s.slug).flatMap((m) =>
      getLessons(s.slug, m.slug).map((l) => ({
        subject: s.slug,
        slug: m.slug,
        lessonSlug: l.slug,
      }))
    )
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; slug: string; lessonSlug: string }>
}) {
  const { subject, lessonSlug } = await params
  const lesson = getLesson(subject, lessonSlug)
  if (!lesson) return { title: "Not Found" }
  return { title: lesson.title }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; slug: string; lessonSlug: string }>
}) {
  const { subject: subjectSlug, slug: moduleSlug, lessonSlug } = await params
  const subject = getSubject(subjectSlug)
  const mod = getModule(subjectSlug, moduleSlug)
  const lesson = getLesson(subjectSlug, lessonSlug)
  if (!subject || !mod || !lesson) notFound()

  const guideRail = buildGuideRail({
    entity: { kind: "subject", slug: subjectSlug, name: subject.name },
    whyThisMatters: `${lesson.title} is part of ${mod.title}. Use it to sharpen one idea enough that you can retrieve it, explain it simply, and notice it in the world.`,
    nextAction: {
      href: lesson.nextLesson
        ? `/${subjectSlug}/modules/${mod.slug}/${lesson.nextLesson}`
        : `/${subjectSlug}/projects`,
      label: lesson.nextLesson ? "Continue to the next lesson" : "Apply this in a project",
      description: lesson.nextLesson
        ? "Keep momentum while the concept is fresh. Sequencing matters more than collecting isolated insights."
        : "You have reached the edge of this lesson chain, so turn the idea into action through a subject project.",
    },
    applyPrompt: lesson.exercise,
    debatePrompt: `If you had to challenge this lesson, where would you look for edge cases, competing explanations, or limits to the model?`,
    truthPrompt: `Before you internalize this lesson completely, test it against the ${subject.name} truth stack and a real example outside the page.`,
  })

  return (
    <LessonTemplate
      lesson={lesson}
      module={mod}
      subjectSlug={subjectSlug}
      subjectName={subject.name}
      visualPrimer={
        subjectSlug === "cloud" ? (
          <CloudVisualPrimer
            variant="lesson"
            focus={getCloudLessonVisualFocus(lessonSlug)}
          />
        ) : undefined
      }
      guideRail={guideRail}
    />
  )
}
