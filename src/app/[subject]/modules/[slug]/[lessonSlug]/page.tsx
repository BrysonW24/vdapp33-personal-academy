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

  return (
    <LessonTemplate
      lesson={lesson}
      module={mod}
      subjectSlug={subjectSlug}
      subjectName={subject.name}
    />
  )
}
