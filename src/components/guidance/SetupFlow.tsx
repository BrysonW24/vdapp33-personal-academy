"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { StageRail } from "@/components/visualizations/StageRail"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateLearningBlueprint } from "@/lib/academy-engine"
import { useAcademyState } from "@/lib/academy-state"
import type {
  AcademyCatalog,
  ArchetypeProfile,
  LearningBlueprint,
  OnboardingQuestion,
  OnboardingQuestionBank,
  OnboardingStep,
} from "@/types/guidance"

interface SetupFlowProps {
  questionBank: OnboardingQuestionBank
  archetypes: ArchetypeProfile[]
  catalog: AcademyCatalog
}

function QuestionInput({
  question,
  value,
  reflection,
  onChange,
  onReflectionChange,
}: {
  question: OnboardingQuestion
  value: string[]
  reflection: string
  onChange: (values: string[]) => void
  onReflectionChange: (value: string) => void
}) {
  if (question.type === "reflection") {
    return (
      <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-5">
        <p className="font-medium text-editorial-ink">{question.prompt}</p>
        <textarea
          value={reflection}
          onChange={(event) => onReflectionChange(event.target.value)}
          placeholder={question.placeholder}
          className="mt-4 min-h-28 w-full rounded-[14px] border border-[rgba(44,49,59,0.12)] bg-white px-4 py-3 text-sm text-editorial-ink outline-none ring-0 placeholder:text-editorial-muted"
        />
      </div>
    )
  }

  const isMulti = question.type === "multi-choice"

  return (
    <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-editorial-ink">{question.prompt}</p>
          <p className="mt-1 text-xs text-editorial-muted">
            {isMulti ? "Choose all that fit." : "Choose one option."}
          </p>
        </div>
        {question.required ? <Badge variant="secondary">Required</Badge> : null}
      </div>

      <div className="mt-4 grid gap-3">
        {question.options?.map((option) => {
          const selected = value.includes(option.id)

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (isMulti) {
                  onChange(
                    selected
                      ? value.filter((entry) => entry !== option.id)
                      : [...value, option.id]
                  )
                  return
                }

                onChange([option.id])
              }}
              className={`rounded-[16px] border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-editorial-green bg-editorial-green/8 shadow-editorial-soft"
                  : "border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.72)] hover:border-[rgba(44,49,59,0.16)] hover:bg-white"
              }`}
            >
              <p className="font-medium text-editorial-ink">{option.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                {option.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepContent({
  step,
}: {
  step: OnboardingStep
}) {
  const answers = useAcademyState((state) => state.answers)
  const reflections = useAcademyState((state) => state.reflections)
  const setAnswer = useAcademyState((state) => state.setAnswer)
  const setReflection = useAcademyState((state) => state.setReflection)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          {step.title}
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
          {step.description}
        </h2>
      </div>

      {step.questions.map((question) => (
        <QuestionInput
          key={question.id}
          question={question}
          value={answers[question.id] ?? []}
          reflection={reflections[question.id] ?? ""}
          onChange={(values) => setAnswer(question.id, values)}
          onReflectionChange={(value) => setReflection(question.id, value)}
        />
      ))}
    </div>
  )
}

function BlueprintPreview({
  blueprint,
  onActivate,
}: {
  blueprint: LearningBlueprint
  onActivate: (pathId: "recommended" | "exploration" | "practical") => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
          Your blueprint
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
          Nexus has a blueprint now
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {blueprint.options.map((option) => (
          <Card key={option.id} className={blueprint.activePathId === option.id ? "border-editorial-green" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{option.label}</CardTitle>
                {blueprint.activePathId === option.id ? (
                  <Badge>Active</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-editorial-muted">{option.summary}</p>
              <div className="space-y-2 text-sm text-editorial-ink">
                <p>
                  <span className="font-medium">Core subject:</span>{" "}
                  {option.assignment.coreSubject.replace(/-/g, " ")}
                </p>
                <p>
                  <span className="font-medium">Supporting topic:</span>{" "}
                  {option.assignment.supportingTopic.replace(/-/g, " ")}
                </p>
                <p>
                  <span className="font-medium">Role lens:</span>{" "}
                  {option.assignment.roleLens.replace(/-/g, " ")}
                </p>
              </div>
              <div className="rounded-[16px] bg-[rgba(255,252,247,0.86)] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                  Milestone
                </p>
                <p className="mt-2 text-sm leading-relaxed text-editorial-ink">
                  {option.assignment.currentMilestone}
                </p>
              </div>
              <Button
                onClick={() => onActivate(option.id)}
                variant={blueprint.activePathId === option.id ? "default" : "secondary"}
                className="w-full"
              >
                {blueprint.activePathId === option.id ? "Current focus" : "Switch to this focus"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SetupFlow({ questionBank, archetypes, catalog }: SetupFlowProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const blueprint = useAcademyState((state) => state.blueprint)
  const answers = useAcademyState((state) => state.answers)
  const reflections = useAcademyState((state) => state.reflections)
  const saveBlueprint = useAcademyState((state) => state.saveBlueprint)
  const activatePath = useAcademyState((state) => state.activatePath)

  const currentStep = questionBank.steps[currentStepIndex]
  const totalSteps = questionBank.steps.length
  const requiredQuestions = useMemo(
    () =>
      questionBank.steps.flatMap((step) =>
        step.questions.filter((question) => question.required && question.type !== "reflection")
      ),
    [questionBank]
  )
  const completionCount = requiredQuestions.filter(
    (question) => (answers[question.id] ?? []).length > 0
  ).length
  const canGenerate = completionCount === requiredQuestions.length

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-editorial-green" />
            <Badge variant="secondary">
              {completionCount}/{requiredQuestions.length} required questions answered
            </Badge>
          </div>
          <CardTitle>Build a personal learning blueprint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <StageRail
            steps={questionBank.steps.map((step, index) => ({
              label: step.title,
              detail: `Step ${index + 1}`,
              active: index <= currentStepIndex,
            }))}
          />

          {currentStep ? <StepContent step={currentStep} /> : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => setCurrentStepIndex((value) => Math.max(0, value - 1))}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex flex-wrap gap-3">
              {currentStepIndex < totalSteps - 1 ? (
                <Button
                  onClick={() =>
                    setCurrentStepIndex((value) => Math.min(totalSteps - 1, value + 1))
                  }
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    startTransition(() => {
                      const generated = generateLearningBlueprint({
                        questionBank,
                        archetypes,
                        answers,
                        reflections,
                        catalog,
                      })
                      saveBlueprint(generated)
                    })
                  }
                  disabled={!canGenerate || isPending}
                >
                  {isPending ? "Generating..." : "Generate Blueprint"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {blueprint ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-editorial-green" />
              <Badge>Ready</Badge>
            </div>
            <CardTitle>Choose how you want to move through the academy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <BlueprintPreview blueprint={blueprint} onActivate={activatePath} />

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/my-path">Open My Path</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">Keep browsing first</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
