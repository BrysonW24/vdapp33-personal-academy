import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { EntityBackButton } from "@/components/academy/layout/EntityBackButton"
import { getSubjects, getSubject } from "@/lib/content"

export async function generateStaticParams() {
  return getSubjects().map((s) => ({ subject: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) return { title: "Not Found" }
  return {
    title: subject.name,
    description: subject.tagline,
  }
}

export default async function SubjectLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  return (
    <>
      <EntityBackButton
        entityHref={`/${slug}`}
        entityLabel={subject.name}
        directoryHref="/subjects"
        directoryLabel="Subjects"
      />
      {children}
    </>
  )
}
