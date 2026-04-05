"use client"

import { CheckCircle2 } from "lucide-react"
import { useProgress } from "@/lib/progress"
import { Badge } from "@/components/ui/badge"

interface Props {
  lessonSlug: string
  subjectSlug?: string
}

export function LessonCompletionBadge({ lessonSlug, subjectSlug }: Props) {
  const isComplete = useProgress((state) =>
    subjectSlug
      ? (state.subjects[subjectSlug]?.completedLessons ?? []).includes(lessonSlug)
      : state.completedLessons.includes(lessonSlug)
  )

  if (!isComplete) return null

  return (
    <Badge className="bg-editorial-green-soft text-editorial-green border-transparent text-xs ml-2">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      Completed
    </Badge>
  )
}
