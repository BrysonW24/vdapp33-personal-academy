import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { EntityBackButton } from "@/components/academy/layout/EntityBackButton"
import { getTopic, getTopics } from "@/lib/entities"

export async function generateStaticParams() {
  return getTopics().map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) return { title: "Not Found" }

  return {
    title: topic.name,
    description: topic.tagline,
  }
}

export default async function TopicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  return (
    <>
      <EntityBackButton
        entityHref={`/topics/${slug}`}
        entityLabel={topic.name}
        directoryHref="/topics"
        directoryLabel="Topics"
      />
      {children}
    </>
  )
}
