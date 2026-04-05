"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  LearningBlueprint,
  LearningMode,
  PathOptionKind,
  ReviewEntry,
} from "@/types/guidance"

interface AcademyState {
  answers: Record<string, string[]>
  reflections: Record<string, string>
  blueprint: LearningBlueprint | null
  activeMode: LearningMode
  setupCompleted: boolean
  reviews: ReviewEntry[]
  setAnswer: (questionId: string, values: string[]) => void
  setReflection: (questionId: string, value: string) => void
  saveBlueprint: (blueprint: LearningBlueprint) => void
  activatePath: (pathId: PathOptionKind) => void
  setMode: (mode: LearningMode) => void
  addReview: (entry: Omit<ReviewEntry, "id" | "createdAt">) => void
  resetSetup: () => void
}

const INITIAL_STATE = {
  answers: {},
  reflections: {},
  blueprint: null,
  activeMode: "guided" as LearningMode,
  setupCompleted: false,
  reviews: [] as ReviewEntry[],
}

function createReviewId() {
  return `review-${Date.now()}`
}

export const useAcademyState = create<AcademyState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setAnswer: (questionId, values) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: values,
          },
        })),
      setReflection: (questionId, value) =>
        set((state) => ({
          reflections: {
            ...state.reflections,
            [questionId]: value,
          },
        })),
      saveBlueprint: (blueprint) =>
        set({
          blueprint,
          activeMode: blueprint.profile.preferredMode,
          setupCompleted: true,
        }),
      activatePath: (pathId) =>
        set((state) =>
          state.blueprint
            ? {
                blueprint: {
                  ...state.blueprint,
                  activePathId: pathId,
                },
              }
            : {}
        ),
      setMode: (mode) => set({ activeMode: mode }),
      addReview: (entry) =>
        set((state) => ({
          reviews: [
            {
              ...entry,
              id: createReviewId(),
              createdAt: new Date().toISOString(),
            },
            ...state.reviews,
          ],
        })),
      resetSetup: () => set(INITIAL_STATE),
    }),
    {
      name: "personal-academy-state",
      version: 1,
      migrate: (persistedState) => ({
        ...INITIAL_STATE,
        ...(persistedState as Partial<AcademyState>),
      }),
    }
  )
)
