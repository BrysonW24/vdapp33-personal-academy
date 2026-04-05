"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, BookOpen, CalendarDays, Compass, FileSearch, Lightbulb, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressRing } from "@/components/visualizations/ProgressRing"
import { StageRail } from "@/components/visualizations/StageRail"
import { ModeSwitch } from "@/components/guidance/ModeSwitch"
import { buildPathState } from "@/lib/academy-engine"
import { useAcademyState } from "@/lib/academy-state"
import { useProgress } from "@/lib/progress"
import type { AcademyCatalog, SignalDigest, SourcePack } from "@/types/guidance"

interface MyPathDashboardProps {
  catalog: AcademyCatalog
  sourcePacks: SourcePack[]
  signalDigests: SignalDigest[]
}

function findPack<T extends { kind: "subject" | "role" | "topic"; slug: string }>(
  collection: T[],
  kind: "subject" | "role" | "topic",
  slug: string
) {
  return collection.find((entry) => entry.kind === kind && entry.slug === slug) ?? null
}

export function MyPathDashboard({
  catalog,
  sourcePacks,
  signalDigests,
}: MyPathDashboardProps) {
  const blueprint = useAcademyState((state) => state.blueprint)
  const activeMode = useAcademyState((state) => state.activeMode)
  const reviews = useAcademyState((state) => state.reviews)
  const setMode = useAcademyState((state) => state.setMode)
  const addReview = useAcademyState((state) => state.addReview)
  const progressSubjects = useProgress((state) => state.subjects)
  const [changedModel, setChangedModel] = useState("")
  const [unclear, setUnclear] = useState("")
  const [revisitNext, setRevisitNext] = useState("")

  const pathState = useMemo(
    () =>
      buildPathState({
        blueprint,
        mode: activeMode,
        catalog,
        progress: { subjects: progressSubjects },
        reviews,
      }),
    [activeMode, blueprint, catalog, progressSubjects, reviews]
  )

  if (!blueprint || !pathState.activePath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Path is waiting to be set up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-editorial-muted">
            Setup gives the academy a core subject, supporting topic, role lens,
            study rhythm, and weekly review loop.
          </p>
          <Button asChild>
            <Link href="/setup">
              Start setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const activePath = pathState.activePath
  const coreSourcePack = findPack(
    sourcePacks,
    "subject",
    activePath.assignment.coreSubject
  )
  const signalPack =
    findPack(signalDigests, "subject", activePath.assignment.coreSubject) ??
    findPack(signalDigests, "topic", activePath.assignment.supportingTopic) ??
    findPack(signalDigests, "role", activePath.assignment.roleLens)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-editorial-green" />
              <Badge>{activePath.label}</Badge>
            </div>
            <CardTitle>{activePath.assignment.currentMilestone}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-relaxed text-editorial-muted">
              {activePath.summary}
            </p>

            <StageRail
              variant="pills"
              steps={[
                {
                  label: activePath.assignment.coreSubject.replace(/-/g, " "),
                  detail: "Core",
                  active: true,
                },
                {
                  label: activePath.assignment.supportingTopic.replace(/-/g, " "),
                  detail: "Support",
                  active: true,
                },
                {
                  label: activePath.assignment.roleLens.replace(/-/g, " "),
                  detail: "Role",
                  active: true,
                },
              ]}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <ProgressRing
                value={pathState.depthScore}
                color="#386a58"
                label="Depth"
                sublabel="How far your current core subject has moved."
              />
              <ProgressRing
                value={pathState.breadthScore}
                color="#2c6aa0"
                label="Breadth"
                sublabel="How much of the academy you have genuinely touched."
              />
              <ProgressRing
                value={pathState.synthesisScore}
                color="#b86b2b"
                label="Synthesis"
                sublabel="Projects, frameworks, and tools turned into capability."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-editorial-blue" />
              <Badge variant="secondary">{activeMode}</Badge>
            </div>
            <CardTitle>Today&apos;s session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pathState.todaySession ? (
              <>
                <div className="rounded-[18px] bg-[rgba(255,252,247,0.92)] p-4">
                  <p className="font-medium text-editorial-ink">
                    {pathState.todaySession.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {pathState.todaySession.description}
                  </p>
                </div>
                <Button asChild>
                  <Link href={pathState.todaySession.href}>
                    Open today&apos;s session
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-editorial-muted">
                Complete setup and move through a subject or topic to unlock the
                next-best-action engine.
              </p>
            )}

            <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Rhythm
              </p>
              <p className="mt-2 text-sm leading-relaxed text-editorial-ink">
                {activePath.assignment.weeklyCadence}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                Review rhythm: {activePath.assignment.reviewRhythm}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
            Learning mode
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-editorial-ink">
            Tell the academy how to guide you right now
          </h2>
        </div>
        <ModeSwitch value={activeMode} onChange={setMode} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-editorial-amber" />
              <CardTitle>Next best actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pathState.nextActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="block rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/74 p-4 transition-all duration-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-editorial-ink">{action.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-editorial-muted" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {coreSourcePack ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-editorial-blue" />
                  <CardTitle>{coreSourcePack.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-editorial-muted">
                  {coreSourcePack.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {coreSourcePack.starterPack.slice(0, 3).map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/${activePath.assignment.coreSubject}/sources`}>
                    Open truth stack
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {signalPack ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-editorial-green" />
                  <CardTitle>{signalPack.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-editorial-muted">
                  {signalPack.summary}
                </p>
                <div className="space-y-2">
                  {signalPack.sections
                    .slice(0, 1)
                    .flatMap((section) => section.items.slice(0, 2))
                    .map((item) => (
                      <div
                        key={item.name}
                        className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-3"
                      >
                        <p className="font-medium text-editorial-ink">{item.name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                          {item.whyItMatters}
                        </p>
                      </div>
                    ))}
                </div>
                <Button asChild variant="secondary">
                  <Link href="/signals">Open Signals</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>

      <section id="weekly-review">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-editorial-amber" />
              <CardTitle>Weekly review</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-editorial-muted">
              Capture what changed your model of the world, what still feels unclear,
              and what should carry into next week.
            </p>
            <textarea
              value={changedModel}
              onChange={(event) => setChangedModel(event.target.value)}
              placeholder="What changed your model of the world this week?"
              className="min-h-24 w-full rounded-[14px] border border-[rgba(44,49,59,0.12)] bg-white px-4 py-3 text-sm text-editorial-ink outline-none placeholder:text-editorial-muted"
            />
            <textarea
              value={unclear}
              onChange={(event) => setUnclear(event.target.value)}
              placeholder="What still feels unclear?"
              className="min-h-24 w-full rounded-[14px] border border-[rgba(44,49,59,0.12)] bg-white px-4 py-3 text-sm text-editorial-ink outline-none placeholder:text-editorial-muted"
            />
            <textarea
              value={revisitNext}
              onChange={(event) => setRevisitNext(event.target.value)}
              placeholder="What do you want to revisit next week?"
              className="min-h-24 w-full rounded-[14px] border border-[rgba(44,49,59,0.12)] bg-white px-4 py-3 text-sm text-editorial-ink outline-none placeholder:text-editorial-muted"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  if (!changedModel.trim() || !unclear.trim() || !revisitNext.trim()) return
                  addReview({
                    changedModel: changedModel.trim(),
                    unclear: unclear.trim(),
                    revisitNext: revisitNext.trim(),
                  })
                  setChangedModel("")
                  setUnclear("")
                  setRevisitNext("")
                }}
              >
                Save weekly review
              </Button>
              {pathState.reviewDue ? (
                <Badge variant="outline">Review due</Badge>
              ) : (
                <Badge variant="secondary">Review logged recently</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
