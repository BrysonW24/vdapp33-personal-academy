import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressTracker } from "@/components/academy/progress/ProgressTracker"
import type { Lesson, Module } from "@/types/curriculum"
import { LessonCompletionBadge } from "./LessonCompletionBadge"
import { PerspectiveToggle } from "./PerspectiveToggle"
import { QuizSection } from "./QuizSection"

interface LessonTemplateProps {
  lesson: Lesson
  module: Module
  subjectSlug?: string
  subjectName?: string
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
}: LessonTemplateProps) {
  const base = subjectSlug ? `/${subjectSlug}/modules` : "/modules"
  const hasQuiz = Boolean(lesson.quiz?.length)

  return (
    <div className="container max-w-4xl py-6 sm:py-10 space-y-10">
      <ProgressTracker
        slug={lesson.slug}
        subjectSlug={subjectSlug}
        type="lesson"
        hasQuiz={hasQuiz}
      />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-hidden">
        {subjectSlug && subjectName && (
          <>
            <Link
              href={`/${subjectSlug}`}
              className="hover:text-foreground transition-colors shrink-0"
            >
              {subjectName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </>
        )}
        <Link href={base} className="hover:text-foreground transition-colors shrink-0">
          Modules
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link
          href={`${base}/${module.slug}`}
          className="hover:text-foreground transition-colors truncate"
        >
          {module.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-foreground truncate">{lesson.title}</span>
      </nav>

      <div>
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant={module.level}>{module.level}</Badge>
          <LessonCompletionBadge
            lessonSlug={lesson.slug}
            subjectSlug={subjectSlug}
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
          <h3 className="font-semibold">Real Example</h3>
          <p className="text-muted-foreground leading-relaxed">{lesson.example}</p>
        </CardContent>
      </Card>

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

      {lesson.quiz && lesson.quiz.length > 0 && (
        <QuizSection
          quiz={lesson.quiz}
          lessonSlug={lesson.slug}
          subjectSlug={subjectSlug}
        />
      )}

      {lesson.frameworks.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">Related Frameworks</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.frameworks.map((framework) => (
              <Link
                key={framework}
                href={subjectSlug ? `/${subjectSlug}/toolkit` : "/toolkit"}
              >
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {humanize(framework)}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

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
    </div>
  )
}
