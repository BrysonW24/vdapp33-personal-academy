import { notFound } from "next/navigation"
import { SignalDigestView } from "@/components/guidance/SignalDigestView"
import { getSubject } from "@/lib/content"
import { getSignalDigest } from "@/lib/guidance-content"

export default async function SubjectSignalsPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const subject = getSubject(slug)
  if (!subject) notFound()

  const digest = getSignalDigest("subject", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Signals
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {subject.name} Signals
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Use this digest to keep the subject tied to the living world without
          turning the academy into a chaotic feed.
        </p>
      </div>

      <SignalDigestView
        digest={digest}
        emptyTitle={`${subject.name} signals are still being curated`}
        emptyBody="This subject has not received a dedicated signal digest yet."
      />
    </div>
  )
}
