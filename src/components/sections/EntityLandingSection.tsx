"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface EntityLandingSectionProps {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Subtle background tint color (applied at 4% opacity) */
  tintColor?: string
  /** Responsive grid columns for children. Default 1 (no grid). */
  columns?: 1 | 2 | 3
  className?: string
  children: React.ReactNode
}

const COLUMN_MAP = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
} as const

export function EntityLandingSection({
  eyebrow,
  title,
  subtitle,
  tintColor,
  columns = 1,
  className,
  children,
}: EntityLandingSectionProps) {
  return (
    <motion.section
      className={cn("relative py-10 sm:py-14", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={
        tintColor
          ? {
              background: `linear-gradient(180deg, ${tintColor}08, ${tintColor}03 60%, transparent)`,
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-8 max-w-2xl sm:mb-10">
          {eyebrow ? (
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-editorial-muted">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-serif text-2xl font-semibold text-editorial-ink sm:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Content area */}
        {columns > 1 ? (
          <div className={cn("grid gap-5", COLUMN_MAP[columns])}>{children}</div>
        ) : (
          children
        )}
      </div>
    </motion.section>
  )
}
