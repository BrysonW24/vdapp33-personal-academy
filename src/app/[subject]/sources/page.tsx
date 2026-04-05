import { notFound } from "next/navigation"
import { SourcePackView } from "@/components/guidance/SourcePackView"
import { getSubject } from "@/lib/content"
import { getSourcePack } from "@/lib/guidance-content"

export default async function SubjectSourcesPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const pack = getSourcePack("subject", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Truth stack
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {subject.name} Sources
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Learn who to trust here, and why. These are the principles,
          institutions, interpreters, practitioners, and frontier references that
          best orient the field.
        </p>
      </div>

      <SourcePackView
        pack={pack}
        emptyTitle={`${subject.name} truth stack is still being curated`}
        emptyBody="This subject already has curriculum depth, but its source hierarchy has not landed yet."
      />
    </div>
  )
}
