"use client"

import Link from "next/link"
import { Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getActivePath } from "@/lib/academy-engine"
import { useAcademyState } from "@/lib/academy-state"
import type { SignalDigest } from "@/types/guidance"

interface SignalsHubProps {
  digests: SignalDigest[]
}

function getDigestHref(digest: SignalDigest) {
  switch (digest.kind) {
    case "subject":
      return `/${digest.slug}/signals`
    case "role":
      return `/roles/${digest.slug}/signals`
    case "topic":
      return `/topics/${digest.slug}/signals`
  }
}

export function SignalsHub({ digests }: SignalsHubProps) {
  const blueprint = useAcademyState((state) => state.blueprint)
  const activePath = getActivePath(blueprint)

  const highlighted = digests.filter((digest) => {
    if (!activePath) return false
    return (
      (digest.kind === "subject" && digest.slug === activePath.assignment.coreSubject) ||
      (digest.kind === "topic" && digest.slug === activePath.assignment.supportingTopic) ||
      (digest.kind === "role" && digest.slug === activePath.assignment.roleLens)
    )
  })

  return (
    <div className="space-y-8">
      {highlighted.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Current path
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
              Signals tied to what you are studying now
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {highlighted.map((digest) => (
              <Link key={`${digest.kind}-${digest.slug}`} href={getDigestHref(digest)}>
                <Card className="h-full hover:shadow-editorial-hover">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-editorial-green" />
                      <Badge>{digest.kind}</Badge>
                    </div>
                    <CardTitle>{digest.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed text-editorial-muted">
                      {digest.summary}
                    </p>
                    <p className="text-xs text-editorial-ink">
                      {digest.sections.reduce((sum, section) => sum + section.items.length, 0)} curated signals
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Curated digests
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            Follow the world without losing your bearings
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {digests.map((digest) => (
            <Link key={`${digest.kind}-${digest.slug}`} href={getDigestHref(digest)}>
              <Card className="h-full hover:shadow-editorial-hover">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{digest.kind}</Badge>
                  </div>
                  <CardTitle>{digest.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-editorial-muted">
                    {digest.summary}
                  </p>
                  <p className="text-xs text-editorial-ink">
                    {digest.sections.reduce((sum, section) => sum + section.items.length, 0)} curated signals
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
