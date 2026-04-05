"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface SimulationMetric {
  label: string
  value: string
}

export interface SimulationCallout {
  label: string
  text: string
  tone?: "tip" | "warning" | "insight"
}

export interface SimulationOption {
  id: string
  label: string
  outcome: string
  quality: "best" | "good" | "okay"
}

export interface SimulationStage {
  id: string
  eyebrow: string
  title: string
  brief: string
  scenario: string
  goal?: string
  metrics?: SimulationMetric[]
  prompts?: string[]
  callouts?: SimulationCallout[]
  options: SimulationOption[]
  synthesis: string
}

export interface SimulationScenario {
  title: string
  strapline: string
  description: string
  metrics?: SimulationMetric[]
  stages: SimulationStage[]
}

export interface SimulationShellProps {
  scenario: SimulationScenario
  className?: string
}

function toneClasses(tone: SimulationCallout["tone"]) {
  switch (tone) {
    case "warning":
      return "border-editorial-red/18 bg-editorial-red-soft/55 text-editorial-red"
    case "insight":
      return "border-editorial-blue/18 bg-editorial-blue-soft/65 text-editorial-blue"
    default:
      return "border-editorial-green/18 bg-editorial-green-soft/55 text-editorial-green"
  }
}

function qualityClasses(quality: SimulationOption["quality"], active: boolean) {
  if (active) {
    if (quality === "best") return "border-editorial-green bg-editorial-green-soft/50"
    if (quality === "good") return "border-editorial-blue bg-editorial-blue-soft/45"
    return "border-editorial-amber bg-editorial-amber-soft/50"
  }

  return "border-[rgba(44,49,59,0.08)] bg-white/70 hover:bg-white/92"
}

export function SimulationShell({
  scenario,
  className,
}: SimulationShellProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const activeStage = scenario.stages[activeStageIndex]
  const selectedOption = activeStage
    ? activeStage.options.find((option) => option.id === selectedOptions[activeStage.id])
    : undefined

  const answeredCount = useMemo(
    () =>
      scenario.stages.filter((stage) => Boolean(selectedOptions[stage.id])).length,
    [scenario.stages, selectedOptions]
  )

  const progressPercent = scenario.stages.length
    ? Math.round((answeredCount / scenario.stages.length) * 100)
    : 0

  return (
    <section className={cn("grid gap-6 lg:grid-cols-[0.95fr_1.55fr]", className)}>
      <Card className="academy-paper-panel overflow-hidden">
        <CardHeader className="relative border-b border-[rgba(44,49,59,0.06)] pb-5">
          <div className="academy-paper-noise absolute inset-0 opacity-60" />
          <div className="relative z-[1] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  Simulation
                </p>
                <CardTitle className="mt-2 text-2xl">{scenario.title}</CardTitle>
                <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
                  {scenario.description}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-editorial-blue text-white shadow-lg shadow-editorial-blue/15">
                <Play className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(scenario.metrics ?? []).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/72 px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                    {metric.label}
                  </p>
                  <p className="mt-1 font-serif text-xl font-semibold text-editorial-ink">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-editorial-muted">
                <span>{scenario.strapline}</span>
                <span>{progressPercent}% complete</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(44,49,59,0.08)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-editorial-green via-editorial-blue to-editorial-amber"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-5">
          {scenario.stages.map((stage, index) => {
            const isActive = index === activeStageIndex
            const isAnswered = Boolean(selectedOptions[stage.id])

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(index)}
                className={cn(
                  "w-full rounded-[18px] border px-4 py-3 text-left transition-all",
                  isActive
                    ? "border-editorial-green/20 bg-editorial-green-soft/45"
                    : "border-[rgba(44,49,59,0.08)] bg-white/72 hover:bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      {stage.eyebrow}
                    </p>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-editorial-ink">
                      {stage.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                      {stage.brief}
                    </p>
                  </div>

                  <div className="mt-1 shrink-0">
                    {isAnswered ? (
                      <CheckCircle2 className="h-4 w-4 text-editorial-green" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-[rgba(44,49,59,0.14)]" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {activeStage ? (
        <Card className="academy-paper-panel overflow-hidden">
          <CardHeader className="relative border-b border-[rgba(44,49,59,0.06)] pb-5">
            <div className="academy-paper-noise absolute inset-0 opacity-60" />
            <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.18em]">
                  {activeStage.eyebrow}
                </Badge>
                <CardTitle className="mt-3 text-3xl">{activeStage.title}</CardTitle>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted">
                  {activeStage.scenario}
                </p>
              </div>

              {activeStage.goal ? (
                <div className="rounded-[18px] border border-editorial-amber/16 bg-editorial-amber-soft/50 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                    Goal
                  </p>
                  <p className="mt-1 text-sm font-medium text-editorial-ink">
                    {activeStage.goal}
                  </p>
                </div>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {activeStage.metrics && activeStage.metrics.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {activeStage.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/72 px-4 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-serif text-xl font-semibold text-editorial-ink">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4">
                {activeStage.prompts && activeStage.prompts.length > 0 ? (
                  <div className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4 text-editorial-blue" />
                      <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                        Questions to Ask
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-editorial-muted">
                      {activeStage.prompts.map((prompt) => (
                        <li key={prompt} className="flex gap-2">
                          <span className="text-editorial-blue">•</span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-editorial-green" />
                    <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                      Decision Paths
                    </p>
                  </div>

                  {activeStage.options.map((option) => {
                    const isSelected = selectedOption?.id === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((current) => ({
                            ...current,
                            [activeStage.id]: option.id,
                          }))
                        }
                        className={cn(
                          "w-full rounded-[20px] border p-5 text-left transition-all",
                          qualityClasses(option.quality, isSelected)
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-editorial-ink">{option.label}</p>
                            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                              {option.outcome}
                            </p>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-editorial-green" />
                          ) : (
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-editorial-muted" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {activeStage.callouts?.map((callout) => (
                  <div
                    key={callout.label}
                    className={cn(
                      "rounded-[20px] border p-5",
                      toneClasses(callout.tone)
                    )}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      {callout.tone === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : callout.tone === "insight" ? (
                        <Lightbulb className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <p className="text-xs uppercase tracking-[0.18em]">
                        {callout.label}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed">{callout.text}</p>
                  </div>
                ))}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedOption?.id ?? `${activeStage.id}-synthesis`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/78 p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-editorial-amber" />
                      <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
                        Synthesis
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-editorial-muted">
                      {selectedOption ? selectedOption.outcome : activeStage.synthesis}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[rgba(44,49,59,0.06)] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() =>
                  setActiveStageIndex((current) => Math.max(0, current - 1))
                }
                disabled={activeStageIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Stage
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setActiveStageIndex(0)
                    setSelectedOptions({})
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>

                <Button
                  className="gap-2"
                  onClick={() =>
                    setActiveStageIndex((current) =>
                      Math.min(scenario.stages.length - 1, current + 1)
                    )
                  }
                  disabled={activeStageIndex === scenario.stages.length - 1}
                >
                  Next Stage
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  )
}
