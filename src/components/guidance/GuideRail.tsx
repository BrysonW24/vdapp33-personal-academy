"use client"

import Link from "next/link"
import { ArrowRight, Compass, FileSearch, Link2, Newspaper, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getActivePath, getEntityPathReason } from "@/lib/academy-engine"
import { useAcademyState } from "@/lib/academy-state"
import type { SignalDigest, SourcePack } from "@/types/guidance"

export interface GuideRailProps {
  entity: {
    kind: "subject" | "topic" | "role"
    slug: string
    name: string
  }
  whyThisMatters: string
  nextAction?: {
    href: string
    label: string
    description: string
  }
  applyPrompt: string
  debatePrompt: string
  truthPrompt: string
  adjacent?: Array<{
    href: string
    label: string
    description?: string
  }>
  sourcePack?: SourcePack | null
  signalDigest?: SignalDigest | null
}

export function GuideRail({
  entity,
  whyThisMatters,
  nextAction,
  applyPrompt,
  debatePrompt,
  truthPrompt,
  adjacent = [],
  sourcePack,
  signalDigest,
}: GuideRailProps) {
  const blueprint = useAcademyState((state) => state.blueprint)
  const activePath = getActivePath(blueprint)
  const pathReason = getEntityPathReason(activePath, entity)

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Intelligent guide
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
          Keep this page connected to the wider academy
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-editorial-green" />
              <Badge variant="secondary">Guidance</Badge>
            </div>
            <CardTitle>Why this matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-editorial-muted">{whyThisMatters}</p>
            {pathReason ? (
              <div className="rounded-[16px] bg-editorial-green/8 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  Optional lens
                </p>
                <p className="text-sm leading-relaxed text-editorial-ink">{pathReason}</p>
              </div>
            ) : null}

            {nextAction ? (
              <div className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      Next best move
                    </p>
                    <p className="mt-1 font-medium text-editorial-ink">{nextAction.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                      {nextAction.description}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={nextAction.href}>
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-editorial-amber" />
              <Badge variant="secondary">Prompts</Badge>
            </div>
            <CardTitle>Use the page actively</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[16px] bg-[rgba(255,252,247,0.86)] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Apply it
              </p>
              <p className="mt-2 text-sm leading-relaxed text-editorial-ink">{applyPrompt}</p>
            </div>
            <div className="rounded-[16px] bg-white/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Debate it
              </p>
              <p className="mt-2 text-sm leading-relaxed text-editorial-ink">{debatePrompt}</p>
            </div>
            <div className="rounded-[16px] bg-white/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Truth check
              </p>
              <p className="mt-2 text-sm leading-relaxed text-editorial-ink">{truthPrompt}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(sourcePack || signalDigest || adjacent.length > 0) ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {sourcePack ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-editorial-blue" />
                <Badge variant="secondary">Truth stack</Badge>
                </div>
                <CardTitle>{sourcePack.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-editorial-muted">
                  {sourcePack.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sourcePack.starterPack.slice(0, 3).map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {signalDigest ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-editorial-green" />
                <Badge variant="secondary">Signals</Badge>
                </div>
                <CardTitle>{signalDigest.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-editorial-muted">
                  {signalDigest.summary}
                </p>
                <div className="space-y-2">
                  {signalDigest.sections
                    .slice(0, 1)
                    .flatMap((section) => section.items.slice(0, 2))
                    .map((item) => (
                      <div
                        key={item.name}
                        className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/70 p-3"
                      >
                        <p className="font-medium text-editorial-ink">{item.name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                          {item.whyItMatters}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {adjacent.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-editorial-amber" />
                  <Badge variant="secondary">Connect outward</Badge>
                </div>
                <CardTitle>Adjacent surfaces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {adjacent.slice(0, 3).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-3 transition-all duration-200 hover:bg-white"
                  >
                    <p className="font-medium text-editorial-ink">{item.label}</p>
                    {item.description ? (
                      <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                        {item.description}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
