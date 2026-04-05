"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScenarioCard } from "@/components/academy/day/ScenarioCard"
import { TimelineView } from "@/components/academy/day/TimelineView"
import type { DayInLife } from "@/types/curriculum"

interface DayInLifeExplorerProps {
  scenarios: DayInLife[]
  subjectSlug?: string
  basePath?: string
}

export function DayInLifeExplorer({
  scenarios,
  subjectSlug,
  basePath,
}: DayInLifeExplorerProps) {
  const [activeSlug, setActiveSlug] = useState(scenarios[0]?.slug ?? "")
  const activeScenario =
    scenarios.find((scenario) => scenario.slug === activeSlug) ?? scenarios[0]
  const resolvedBasePath =
    basePath ?? (subjectSlug ? `/${subjectSlug}/day-in-the-life` : "")

  if (!activeScenario) return null

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.slug}
            scenario={scenario}
            isActive={scenario.slug === activeScenario.slug}
            onClick={() => setActiveSlug(scenario.slug)}
            href={
              resolvedBasePath
                ? `${resolvedBasePath}/${scenario.slug}`
                : undefined
            }
          />
        ))}
      </div>

      <div className="rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft backdrop-blur-[18px] p-6 space-y-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{activeScenario.salary}</Badge>
            <Badge variant="outline">{activeScenario.companySize}</Badge>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-editorial-ink mb-3">
            {activeScenario.title}
          </h2>
          <p className="text-editorial-muted leading-relaxed">
            {activeScenario.description}
          </p>
        </div>

        <div>
          <h3 className="font-serif text-xl font-semibold text-editorial-ink mb-4">
            Sample day
          </h3>
          <TimelineView scenario={activeScenario} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
              Responsibilities
            </h3>
            <ul className="space-y-2 text-sm text-editorial-muted">
              {activeScenario.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-editorial-green mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
              Challenges
            </h3>
            <ul className="space-y-2 text-sm text-editorial-muted">
              {activeScenario.challenges.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-editorial-red mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
              Rewards
            </h3>
            <ul className="space-y-2 text-sm text-editorial-muted">
              {activeScenario.rewards.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-editorial-amber mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-editorial-ink mb-3">
              Career path
            </h3>
            <ul className="space-y-2 text-sm text-editorial-muted">
              {activeScenario.careerPath.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-editorial-blue mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
