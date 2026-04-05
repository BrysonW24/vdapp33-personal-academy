"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ProgressRingProps {
  /** Value from 0-100 */
  value: number
  /** Ring color */
  color: string
  /** Diameter in px. Default 110. */
  size?: number
  /** Stroke width. Default 12. */
  strokeWidth?: number
  /** Main label shown beside the ring */
  label?: string
  /** Secondary text below the label */
  sublabel?: string
  className?: string
}

export function ProgressRing({
  value,
  color,
  size = 110,
  strokeWidth = 12,
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.max(0, Math.min(100, value))
  const offset = circumference * (1 - clampedValue / 100)

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        style={{ width: size, height: size }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(44,49,59,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div>
        <div className="font-serif text-3xl font-bold text-editorial-ink">{clampedValue}</div>
        {label ? (
          <div className="text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
            {label}
          </div>
        ) : null}
        {sublabel ? (
          <p className="mt-2 max-w-[10rem] text-xs leading-relaxed text-editorial-muted">
            {sublabel}
          </p>
        ) : null}
      </div>
    </div>
  )
}
