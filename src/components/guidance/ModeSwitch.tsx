"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LearningMode } from "@/types/guidance"

const MODES: Array<{
  slug: LearningMode
  label: string
  description: string
}> = [
  {
    slug: "guided",
    label: "Guided",
    description: "Follow a steady path with clear next steps.",
  },
  {
    slug: "explorer",
    label: "Explorer",
    description: "Widen the lens and use cross-links more often.",
  },
  {
    slug: "operator",
    label: "Operator",
    description: "Bias toward projects, signals, and practical judgment.",
  },
]

interface ModeSwitchProps {
  value: LearningMode
  onChange: (mode: LearningMode) => void
}

export function ModeSwitch({ value, onChange }: ModeSwitchProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {MODES.map((mode) => (
        <button
          key={mode.slug}
          type="button"
          onClick={() => onChange(mode.slug)}
          className={cn(
            "rounded-[18px] border p-4 text-left transition-all duration-200",
            value === mode.slug
              ? "border-editorial-green bg-editorial-green/8 shadow-editorial-soft"
              : "border-[rgba(44,49,59,0.08)] bg-white/74 hover:border-[rgba(44,49,59,0.14)] hover:bg-white/90"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-lg font-semibold text-editorial-ink">
                {mode.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                {mode.description}
              </p>
            </div>
            {value === mode.slug ? <Button size="sm">Active</Button> : null}
          </div>
        </button>
      ))}
    </div>
  )
}
