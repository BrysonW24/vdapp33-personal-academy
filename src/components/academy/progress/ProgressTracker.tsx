"use client"

import { useEffect } from "react"
import { useProgress } from "@/lib/progress"

interface ProgressTrackerProps {
  slug: string
  subjectSlug?: string
  type: "module" | "lesson" | "tool" | "framework" | "project"
  hasQuiz?: boolean
}

export function ProgressTracker({
  slug,
  subjectSlug,
  type,
  hasQuiz,
}: ProgressTrackerProps) {
  const {
    completeFramework,
    completeLesson,
    completeModule,
    completeProject,
    viewTool,
  } = useProgress()

  useEffect(() => {
    switch (type) {
      case "module":
        subjectSlug ? completeModule(subjectSlug, slug) : completeModule(slug)
        break
      case "lesson":
        if (!hasQuiz) {
          subjectSlug ? completeLesson(subjectSlug, slug) : completeLesson(slug)
        }
        break
      case "project":
        subjectSlug ? completeProject(subjectSlug, slug) : completeProject(slug)
        break
      case "tool":
        subjectSlug ? viewTool(subjectSlug, slug) : viewTool(slug)
        break
      case "framework":
        subjectSlug
          ? completeFramework(subjectSlug, slug)
          : completeFramework(slug)
        break
    }
  }, [
    slug,
    subjectSlug,
    type,
    hasQuiz,
    completeFramework,
    completeLesson,
    completeModule,
    completeProject,
    viewTool,
  ])

  return null
}
