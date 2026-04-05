"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MasteryRingDomain {
  key: string
  label: string
  color: string
  /** Progress as a fraction 0-1 */
  progress: number
  total: number
  done: number
}

export interface MasteryRingsProps {
  domains: MasteryRingDomain[]
  /** Outer diameter of the ring visualisation in pixels. Default 240. */
  size?: number
  className?: string
}

export function MasteryRings({ domains, size = 240, className }: MasteryRingsProps) {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)

  const center = size / 2
  const strokeWidth = size * 0.042
  const ringGap = size * 0.038
  const innerRadius = size * 0.14

  const ringData = domains.map((domain, index) => {
    const radius = innerRadius + index * (strokeWidth + ringGap)
    const circumference = 2 * Math.PI * radius
    return { ...domain, radius, circumference }
  })

  const totalModules = domains.reduce((sum, d) => sum + d.total, 0)
  const totalDone = domains.reduce((sum, d) => sum + d.done, 0)
  const overallPct = totalModules > 0 ? Math.round((totalDone / totalModules) * 100) : 0

  const hovered = hoveredDomain ? ringData.find((d) => d.key === hoveredDomain) : null

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`Mastery rings: ${overallPct}% overall completion`}
      >
        {ringData.map((d, index) => (
          <g key={d.key}>
            <circle
              cx={center}
              cy={center}
              r={d.radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              opacity={0.15}
            />
            <motion.circle
              cx={center}
              cy={center}
              r={d.radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={d.circumference}
              initial={{ strokeDashoffset: d.circumference }}
              animate={{ strokeDashoffset: d.circumference * (1 - d.progress) }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 * index }}
              style={{ filter: `drop-shadow(0 0 4px ${d.color}40)` }}
            />
            <circle
              cx={center}
              cy={center}
              r={d.radius}
              fill="none"
              stroke="transparent"
              strokeWidth={strokeWidth + ringGap}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredDomain(d.key)}
              onMouseLeave={() => setHoveredDomain(null)}
            />
          </g>
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {hovered ? (
          <motion.div
            key={hovered.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center px-2 text-center"
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: hovered.color }}
            >
              {hovered.label}
            </span>
            <span className="mt-0.5 text-xs text-editorial-muted">
              {hovered.done} of {hovered.total} modules
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="overall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="font-serif text-2xl font-bold leading-none text-editorial-ink">
              {overallPct}%
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-editorial-muted">
              Mastery
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
