import { describe, expect, it } from "vitest"
import { migrateProgressState } from "@/lib/progress"

describe("progress migration", () => {
  it("migrates legacy flat progress into the legacy subject bucket", () => {
    const migrated = migrateProgressState({
      completedModules: ["motion"],
      completedLessons: ["lift-and-drag"],
      completedProjects: ["orbital-model"],
      completedFrameworks: ["first-principles"],
      viewedTools: ["jupyter"],
      quizResults: {
        "lift-and-drag": {
          score: 4,
          total: 5,
        },
      },
    })

    expect(migrated.subjects._legacy?.completedModules).toEqual(["motion"])
    expect(migrated.completedLessons).toEqual(["lift-and-drag"])
    expect(migrated.quizResults["lift-and-drag"]).toEqual({
      score: 4,
      total: 5,
    })
  })

  it("preserves already-namespaced subject progress", () => {
    const migrated = migrateProgressState({
      subjects: {
        physics: {
          completedModules: ["motion"],
          completedLessons: ["lift-and-drag"],
          completedProjects: [],
          completedFrameworks: [],
          viewedTools: ["jupyter"],
          quizResults: {},
        },
      },
    })

    expect(migrated.subjects.physics?.completedModules).toEqual(["motion"])
    expect(migrated.viewedTools).toEqual(["jupyter"])
  })
})
