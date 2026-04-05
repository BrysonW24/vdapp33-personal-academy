"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FlowStage {
  label: string
  /** Display value (e.g. "10,000" or "Source") */
  value?: string
  description?: string
  color: string
  softColor: string
}

export interface FlowDiagramProps {
  stages: FlowStage[]
  /** "horizontal" renders a left-to-right flow. "vertical" renders a top-to-bottom funnel. Default "vertical". */
  orientation?: "horizontal" | "vertical"
  footerNote?: string
  className?: string
}

function VerticalFunnel({ stages, footerNote }: { stages: FlowStage[]; footerNote?: string }) {
  const maxWidth = 100
  const minWidth = 30
  const step = stages.length > 1 ? (maxWidth - minWidth) / (stages.length - 1) : 0

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => {
        const widthPct = maxWidth - step * index
        return (
          <motion.div
            key={stage.label}
            className="relative overflow-hidden rounded-full border"
            style={{
              width: `${widthPct}%`,
              marginLeft: "auto",
              marginRight: "auto",
              borderColor: stage.color,
              backgroundColor: stage.softColor,
            }}
            initial={{ opacity: 0, scaleX: 0.7 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {stage.value ? (
                  <span className="font-mono text-sm font-semibold" style={{ color: stage.color }}>
                    {stage.value}
                  </span>
                ) : null}
                <span className="text-sm font-medium text-editorial-ink">{stage.label}</span>
              </div>
              {stage.description ? (
                <span className="text-xs text-editorial-muted">{stage.description}</span>
              ) : null}
            </div>

            {/* Shimmer animation */}
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 4 + index * 0.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )
      })}

      {footerNote ? (
        <p className="mt-2 text-center text-xs text-editorial-muted">{footerNote}</p>
      ) : null}
    </div>
  )
}

function HorizontalFlow({ stages, footerNote }: { stages: FlowStage[]; footerNote?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex flex-1 items-center gap-2">
            <motion.div
              className="flex flex-1 flex-col items-center rounded-[18px] border px-3 py-4"
              style={{
                borderColor: `${stage.color}30`,
                backgroundColor: stage.softColor,
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              {stage.value ? (
                <span className="font-mono text-xs font-semibold" style={{ color: stage.color }}>
                  {stage.value}
                </span>
              ) : null}
              <span className="mt-1 text-center text-xs font-medium text-editorial-ink">
                {stage.label}
              </span>
              {stage.description ? (
                <span className="mt-1 text-center text-[10px] text-editorial-muted">
                  {stage.description}
                </span>
              ) : null}
            </motion.div>
            {index < stages.length - 1 ? (
              <div className="h-[2px] w-4 shrink-0 bg-[rgba(44,49,59,0.12)]" />
            ) : null}
          </div>
        ))}
      </div>

      {footerNote ? (
        <p className="text-center text-xs text-editorial-muted">{footerNote}</p>
      ) : null}
    </div>
  )
}

export function FlowDiagram({
  stages,
  orientation = "vertical",
  footerNote,
  className,
}: FlowDiagramProps) {
  return (
    <div className={className}>
      {orientation === "vertical" ? (
        <VerticalFunnel stages={stages} footerNote={footerNote} />
      ) : (
        <HorizontalFlow stages={stages} footerNote={footerNote} />
      )}
    </div>
  )
}
