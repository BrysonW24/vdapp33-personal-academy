import { notFound } from "next/navigation"
import { SignalDigestView } from "@/components/guidance/SignalDigestView"
import { getSignalDigest } from "@/lib/guidance-content"
import { getTopic } from "@/lib/entities"

export default async function TopicSignalsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const digest = getSignalDigest("topic", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Signals
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {topic.name} Signals
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Topics need a present-tense layer too. These digests keep the lens alive
          without pretending to be a live news terminal.
        </p>
      </div>

      <SignalDigestView
        digest={digest}
        emptyTitle={`${topic.name} signals are still being curated`}
        emptyBody="This topic exists as a live lens, but its signal digest has not landed yet."
      />
    </div>
  )
}
