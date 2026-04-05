"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ConcentricRingData {
  label: string
  /** Diameter in px */
  size: number
  color: string
}

export interface ConcentricRingsProps {
  rings: ConcentricRingData[]
  centerLabel?: string
  centerSublabel?: string
  /** Container size in px. Default 160. */
  containerSize?: number
  showLegend?: boolean
  className?: string
}

export function ConcentricRings({
  rings,
  centerLabel,
  centerSublabel,
  containerSize = 160,
  showLegend = true,
  className,
}: ConcentricRingsProps) {
  // Render outermost ring first (background), innermost last (foreground)
  const sortedRings = [...rings].sort((a, b) => b.size - a.size)

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div
        className="relative flex shrink-0 items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        {sortedRings.map((ring) => (
          <motion.div
            key={ring.label}
            className="absolute rounded-full border"
            style={{
              width: ring.size,
              height: ring.size,
              borderColor: ring.color,
              backgroundColor: `${ring.color}10`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          />
        ))}
        {centerLabel ? (
          <div className="relative text-center">
            <div className="font-serif text-xl font-semibold text-editorial-ink">
              {centerLabel}
            </div>
            {centerSublabel ? (
              <div className="text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
                {centerSublabel}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {showLegend ? (
        <div className="space-y-2 text-xs text-editorial-muted">
          {rings.map((ring) => (
            <div key={ring.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <span>{ring.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
