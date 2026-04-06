"use client"

import Link from "next/link"
import { ArrowRight, Compass, Route } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buildPathState } from "@/lib/academy-engine"
import { useAcademyState } from "@/lib/academy-state"
import { useProgress } from "@/lib/progress"
import type { AcademyCatalog } from "@/types/guidance"

interface HomePathPanelProps {
  catalog: AcademyCatalog
}

export function HomePathPanel({ catalog }: HomePathPanelProps) {
  const blueprint = useAcademyState((state) => state.blueprint)
  const mode = useAcademyState((state) => state.activeMode)
  const reviews = useAcademyState((state) => state.reviews)
  const progressSubjects = useProgress((state) => state.subjects)

  if (!blueprint) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-editorial-green" />
            <CardTitle>Set up My Path</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-editorial-muted">
            Turn the academy into a real operating system. A short setup flow will
            choose a core subject, supporting topic, role lens, weekly rhythm, and
            first milestone for you.
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

  const pathState = buildPathState({
    blueprint,
    mode,
    catalog,
    progress: { subjects: progressSubjects },
    reviews,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-editorial-blue" />
          <CardTitle>Continue My Path</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-editorial-muted">
          {pathState.activePath?.summary}
        </p>
        {pathState.todaySession ? (
          <div className="rounded-[18px] bg-[rgba(255,252,247,0.92)] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              Today&apos;s session
            </p>
            <p className="mt-2 font-medium text-editorial-ink">
              {pathState.todaySession.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
              {pathState.todaySession.description}
            </p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/my-path">Open My Path</Link>
          </Button>
          {pathState.todaySession ? (
            <Button asChild variant="secondary">
              <Link href={pathState.todaySession.href}>Do next session</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
