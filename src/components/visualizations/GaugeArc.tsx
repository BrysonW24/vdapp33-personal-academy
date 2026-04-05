"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useId } from "react"

export interface GaugeArcProps {
  /** Value from 0-100 */
  value: number
  /** Label shown below the value (e.g. "Complexity Index") */
  label?: string
  /** Secondary label shown below the arc (e.g. "Role Difficulty") */
  sublabel?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Custom gradient stops. Defaults to blue → green → amber editorial gradient. */
  gradientStops?: Array<{ offset: string; color: string }>
  className?: string
}

const SIZE_MAP = {
  sm: { maxWidth: "max-w-[200px]", topOffset: "top-[38px]", valueSize: "text-3xl", labelSize: "text-[9px]" },
  md: { maxWidth: "max-w-[280px]", topOffset: "top-[54px]", valueSize: "text-4xl", labelSize: "text-[10px]" },
  lg: { maxWidth: "max-w-[340px]", topOffset: "top-[66px]", valueSize: "text-5xl", labelSize: "text-[10px]" },
} as const

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

const DEFAULT_GRADIENT_STOPS = [
  { offset: "0%", color: "#2f4f79" },
  { offset: "55%", color: "#386a58" },
  { offset: "100%", color: "#a16a1f" },
]

export function GaugeArc({
  value,
  label = "Complexity Index",
  sublabel,
  size = "md",
  gradientStops = DEFAULT_GRADIENT_STOPS,
  className,
}: GaugeArcProps) {
  const gradientId = useId()
  const sizeConfig = SIZE_MAP[size]

  const startAngle = 150
  const sweep = 240
  const clampedValue = Math.max(0, Math.min(100, value))
  const valueAngle = startAngle + (sweep * clampedValue) / 100
  const trackPath = describeArc(120, 118, 84, startAngle, startAngle + sweep)
  const valuePath = describeArc(120, 118, 84, startAngle, valueAngle)
  const valuePoint = polarToCartesian(120, 118, 74, valueAngle)

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 240 168"
        className={cn("w-full overflow-visible", sizeConfig.maxWidth)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            {gradientStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = startAngle + (sweep * mark) / 100
          const inner = polarToCartesian(120, 118, 91, angle)
          const outer = polarToCartesian(120, 118, 103, angle)
          const labelPos = polarToCartesian(120, 118, 116, angle)

          return (
            <g key={mark}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(44,49,59,0.18)"
                strokeWidth={mark === 0 || mark === 100 ? 2 : 1}
              />
              <text
                x={labelPos.x}
                y={labelPos.y + 3}
                textAnchor="middle"
                fontSize="8"
                fill="rgba(44,49,59,0.55)"
              >
                {mark}
              </text>
            </g>
          )
        })}

        <path
          d={trackPath}
          fill="none"
          stroke="rgba(44,49,59,0.08)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <motion.path
          d={valuePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={16}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.line
          x1="120"
          y1="118"
          x2={valuePoint.x}
          y2={valuePoint.y}
          stroke="#161b22"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
        />
        <circle cx="120" cy="118" r="6" fill="#161b22" />
      </svg>

      <div className={cn("absolute inset-x-0 text-center", sizeConfig.topOffset)}>
        <div className={cn("font-serif font-bold leading-none text-editorial-ink", sizeConfig.valueSize)}>
          {clampedValue}
          <span className="ml-1 text-lg text-editorial-muted">/100</span>
        </div>
        <div className={cn("mt-1 uppercase tracking-[0.16em] text-editorial-muted", sizeConfig.labelSize)}>
          {label}
        </div>
      </div>

      {sublabel ? (
        <p className="mt-3 max-w-[16rem] text-center text-xs leading-relaxed text-editorial-muted">
          {sublabel}
        </p>
      ) : null}
    </div>
  )
}
