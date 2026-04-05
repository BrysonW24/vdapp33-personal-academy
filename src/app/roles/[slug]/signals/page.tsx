import { notFound } from "next/navigation"
import { SignalDigestView } from "@/components/guidance/SignalDigestView"
import { getSignalDigest } from "@/lib/guidance-content"
import { getRole } from "@/lib/entities"

export default async function RoleSignalsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) notFound()

  const digest = getSignalDigest("role", slug)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Signals
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-editorial-ink">
          {role.name} Signals
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-editorial-muted">
          Roles become real when you can see the developments, institutions, and
          debates that practitioners actually have to pay attention to.
        </p>
      </div>

      <SignalDigestView
        digest={digest}
        emptyTitle={`${role.name} signals are still being curated`}
        emptyBody="The role is live, but its signal digest has not landed yet."
      />
    </div>
  )
}
