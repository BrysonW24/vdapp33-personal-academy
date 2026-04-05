"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface StageRailStep {
  label: string
  detail?: string
  active: boolean
}

export interface StageRailProps {
  steps: StageRailStep[]
  /** "dots" = circles connected by a rail line. "pills" = colored pill segments. */
  variant?: "dots" | "pills"
  className?: string
}

function DotsRail({ steps }: { steps: StageRailStep[] }) {
  return (
    <div className="pt-2">
      <div className="relative">
        <div className="absolute left-4 right-4 top-3 h-[2px] bg-[rgba(44,49,59,0.08)]" />
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((stage, index) => (
            <motion.div
              key={stage.label}
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div
                className={cn(
                  "mx-auto h-6 w-6 rounded-full border-2",
                  stage.active
                    ? "border-editorial-green bg-editorial-green"
                    : "border-[rgba(44,49,59,0.18)] bg-white"
                )}
              />
              <div className="mt-4 text-center">
                <div className="text-xs font-semibold text-editorial-ink">{stage.label}</div>
                {stage.detail ? (
                  <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-editorial-muted">
                    {stage.detail}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PillsRail({ steps }: { steps: StageRailStep[] }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex flex-1 items-center gap-2">
          <motion.div
            className={cn(
              "flex-1 rounded-full px-2 py-2 text-center text-[10px] uppercase tracking-[0.12em]",
              step.active
                ? "bg-editorial-green text-white"
                : "bg-[rgba(44,49,59,0.08)] text-editorial-muted"
            )}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            {step.label}
          </motion.div>
          {index < steps.length - 1 ? (
            <div className="h-[2px] w-4 bg-[rgba(44,49,59,0.08)]" />
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function StageRail({ steps, variant = "dots", className }: StageRailProps) {
  return (
    <div className={className}>
      {variant === "dots" ? <DotsRail steps={steps} /> : <PillsRail steps={steps} />}
    </div>
  )
}
