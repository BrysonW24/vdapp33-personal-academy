"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CareerLadderStage {
  title: string
  summary: string
  detail?: string
}

export interface CareerLadderProps {
  title: string
  summary?: string
  stages: CareerLadderStage[]
  className?: string
}

export function CareerLadder({
  title,
  summary,
  stages,
  className,
}: CareerLadderProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft",
        className
      )}
    >
      <div className="mb-5">
        <h3 className="font-serif text-xl font-semibold text-editorial-ink">{title}</h3>
        {summary ? (
          <p className="mt-2 text-sm leading-relaxed text-editorial-muted">{summary}</p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {stages.map((stage, index) => (
          <div key={stage.title} className="flex items-stretch gap-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="min-w-0 flex-1 rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)] p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Stage {index + 1}
              </p>
              <h4 className="mt-2 text-base font-semibold text-editorial-ink">
                {stage.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                {stage.summary}
              </p>
              {stage.detail ? (
                <p className="mt-3 text-xs leading-relaxed text-editorial-muted">
                  {stage.detail}
                </p>
              ) : null}
            </motion.div>
            {index < stages.length - 1 ? (
              <div className="hidden items-center md:flex">
                <ArrowRight className="h-4 w-4 text-editorial-muted" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
