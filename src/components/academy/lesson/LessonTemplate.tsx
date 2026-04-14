import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import type { Lesson, Module } from "@/types/curriculum"
import { LessonCompletionBadge } from "./LessonCompletionBadge"
import { PerspectiveToggle } from "./PerspectiveToggle"
import { QuizSection } from "./QuizSection"
import type { BreadcrumbSegment } from "@/components/academy/layout/Breadcrumbs"

interface LessonTemplateProps {
  lesson: Lesson
  module: Module
  subjectSlug?: string
  subjectName?: string
  progressSubjectSlug?: string
  basePath?: string
  toolkitHref?: string
  breadcrumbs?: BreadcrumbSegment[]
  visualPrimer?: ReactNode
  guideRail?: ReactNode
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function LessonTemplate({
  lesson,
  module,
  subjectSlug,
  subjectName,
  progressSubjectSlug,
  basePath,
  toolkitHref,
  breadcrumbs,
  visualPrimer,
  guideRail,
}: LessonTemplateProps) {
  const base = basePath ?? (subjectSlug ? `/${subjectSlug}/modules` : "/modules")
  const hasQuiz = Boolean(lesson.quiz?.length)
  const resolvedSubjectSlug = progressSubjectSlug ?? subjectSlug
  const breadcrumbSegments =
    breadcrumbs ??
    [
      ...(subjectSlug && subjectName
        ? [{ label: subjectName, href: `/${subjectSlug}` }]
        : []),
      { label: "Modules", href: base },
      { label: module.title, href: `${base}/${module.slug}` },
      { label: lesson.title },
    ]

  return (
    <div className="container max-w-4xl py-6 sm:py-10 space-y-10">
      <ProgressTracker
        slug={lesson.slug}
        subjectSlug={resolvedSubjectSlug}
        type="lesson"
        hasQuiz={hasQuiz}
      />

      <Breadcrumbs segments={breadcrumbSegments} />

      <div>
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant={module.level}>{module.level}</Badge>
          <LessonCompletionBadge
            lessonSlug={lesson.slug}
            subjectSlug={resolvedSubjectSlug}
          />
        </div>
        <h1 className="text-3xl font-bold mt-3">{lesson.title}</h1>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-primary mb-1">Objective</p>
            <p className="text-sm">{lesson.objective}</p>
          </div>
        </CardContent>
      </Card>

      {visualPrimer ? visualPrimer : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          What this is
        </h2>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {lesson.beginnerExplanation}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-academy-amber" />
          Why it matters
        </h2>
        <p className="text-muted-foreground leading-relaxed">{module.whyItMatters}</p>
      </section>

      {lesson.teaching?.mentalModel ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Mental model</h2>
          <Card className="bg-secondary/50">
            <CardContent className="space-y-3 p-5">
              <div>
                <h3 className="font-semibold">{lesson.teaching.mentalModel.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {lesson.teaching.mentalModel.summary}
                </p>
              </div>
              <ul className="space-y-2">
                {lesson.teaching.mentalModel.anchors.map((anchor) => (
                  <li key={anchor} className="flex items-start gap-2 text-muted-foreground">
                    <span className="mt-1 shrink-0 text-primary">•</span>
                    {anchor}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {lesson.teaching?.howItWorks ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {lesson.teaching.howItWorks.title ?? "How it works"}
          </h2>
          <ol className="space-y-2">
            {lesson.teaching.howItWorks.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Going deeper</h2>
        {lesson.perspectives ? (
          <PerspectiveToggle
            perspectives={lesson.perspectives}
            defaultContent={lesson.deeperExplanation}
          />
        ) : (
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {lesson.deeperExplanation}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Key Takeaways
        </h2>
        <ol className="space-y-2 list-decimal list-inside">
          {lesson.keyTakeaways.map((takeaway, index) => (
            <li key={index} className="text-muted-foreground leading-relaxed">
              {takeaway}
            </li>
          ))}
        </ol>
      </section>

      <Card className="bg-secondary/50">
        <CardContent className="p-5 space-y-2">
          <h3 className="font-semibold">
            {lesson.teaching?.workedExampleLabel ?? "Real Example"}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {lesson.teaching?.workedExample ?? lesson.example}
          </p>
        </CardContent>
      </Card>

      {(lesson.teaching?.upsides?.length || lesson.teaching?.downsides?.length) && (
        <section className="grid gap-4 md:grid-cols-2">
          {lesson.teaching?.upsides?.length ? (
            <Card className="border-editorial-green/20 bg-editorial-green-soft/20">
              <CardContent className="space-y-2 p-5">
                <h3 className="font-semibold text-editorial-ink">Upsides</h3>
                <ul className="space-y-2">
                  {lesson.teaching.upsides.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 shrink-0 text-editorial-green">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {lesson.teaching?.downsides?.length ? (
            <Card className="border-[rgba(161,76,58,0.18)] bg-[rgba(161,76,58,0.06)]">
              <CardContent className="space-y-2 p-5">
                <h3 className="font-semibold text-editorial-ink">Downsides</h3>
                <ul className="space-y-2">
                  {lesson.teaching.downsides.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 shrink-0 text-[rgb(127,53,41)]">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-academy-rose" />
          Common Mistakes
        </h2>
        <ul className="space-y-2">
          {lesson.commonMistakes.map((mistake, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-muted-foreground"
            >
              <span className="text-academy-rose mt-1 shrink-0">&#x2717;</span>
              {mistake}
            </li>
          ))}
        </ul>
      </section>

      <Card className="border-academy-teal/30 bg-academy-teal/5">
        <CardContent className="p-5 space-y-2">
          <h3 className="font-semibold text-primary">Your Exercise</h3>
          <p className="text-muted-foreground leading-relaxed">{lesson.exercise}</p>
        </CardContent>
      </Card>

      {lesson.teaching?.realWorldApplications?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Where you see this in the real world</h2>
          <ul className="space-y-2">
            {lesson.teaching.realWorldApplications.map((item) => (
              <li key={item} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1 shrink-0 text-editorial-amber">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.teaching?.whoWorksWithThis?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Who works with this</h2>
          <div className="flex flex-wrap gap-2">
            {lesson.teaching.whoWorksWithThis.map((entry) => (
              <Badge key={entry} variant="outline">
                {entry}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.quiz && lesson.quiz.length > 0 && (
          <QuizSection
            quiz={lesson.quiz}
            lessonSlug={lesson.slug}
            subjectSlug={resolvedSubjectSlug}
          />
      )}

      {lesson.frameworks.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">Related Frameworks</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.frameworks.map((framework) => (
              <Link
                key={framework}
                href={toolkitHref ?? (subjectSlug ? `/${subjectSlug}/toolkit` : "/toolkit")}
              >
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {humanize(framework)}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {lesson.teaching?.goDeeper?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold">Go deeper</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {lesson.teaching.goDeeper.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.78)] p-4 hover:shadow-editorial-soft transition-shadow"
              >
                <p className="font-medium text-foreground">{link.label}</p>
                {link.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.nextLesson && (
        <div className="flex justify-end pt-4">
          <Button asChild>
            <Link
              href={`${base}/${lesson.moduleSlug}/${lesson.nextLesson}`}
              className="flex items-center gap-2"
            >
              Next Lesson
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {guideRail ? guideRail : null}
    </div>
  )
}
