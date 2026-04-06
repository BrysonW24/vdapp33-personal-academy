"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ExposureAxis {
  key: string
  label: string
}

export interface ExposureProfile {
  label: string
  description?: string
  values: Record<string, number>
}

export interface ExposureMapProps {
  axes: ExposureAxis[]
  profiles: ExposureProfile[]
  className?: string
}

function intensityLabel(value: number) {
  if (value >= 5) return "Very high"
  if (value >= 4) return "High"
  if (value >= 3) return "Moderate"
  if (value >= 2) return "Low"
  return "Minimal"
}

function intensityWidth(value: number) {
  return `${Math.max(1, Math.min(5, value)) * 20}%`
}

export function ExposureMap({ axes, profiles, className }: ExposureMapProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft",
        className
      )}
    >
      <div className="mb-5">
        <h3 className="font-serif text-xl font-semibold text-editorial-ink">
          Exposure map
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
          A fast way to see what each role is actually exposed to in practice:
          media, law, bureaucracy, negotiation, and pressure.
        </p>
      </div>

      <div className="space-y-4">
        {profiles.map((profile, profileIndex) => (
          <motion.div
            key={profile.label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, delay: profileIndex * 0.04 }}
            className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)] p-4"
          >
            <div className="mb-4">
              <h4 className="text-base font-semibold text-editorial-ink">
                {profile.label}
              </h4>
              {profile.description ? (
                <p className="mt-1 text-sm text-editorial-muted">
                  {profile.description}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {axes.map((axis) => {
                const value = profile.values[axis.key] ?? 1
                return (
                  <div key={`${profile.label}-${axis.key}`}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-editorial-ink">
                        {axis.label}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-editorial-muted">
                        {intensityLabel(value)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[rgba(44,49,59,0.08)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-editorial-blue via-editorial-green to-editorial-amber"
                        style={{ width: intensityWidth(value) }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
