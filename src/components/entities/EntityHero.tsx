"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HeroScene } from "@/components/academy/hero/HeroScene"
import type {
  HeroSceneNode,
  HeroSceneConnection,
} from "@/components/academy/hero/hero-utils"

export interface EntityHeroStatChip {
  label: string
  value: string | number
}

export type EntityHeroVariant = "orbital" | "gradient" | "minimal"

export interface EntityHeroProps {
  title: string
  subtitle?: string
  entityKind: "subject" | "role" | "topic"
  themeColor: string
  variant?: EntityHeroVariant
  statChips?: EntityHeroStatChip[]
  /** Required for "orbital" variant */
  nodes?: HeroSceneNode[]
  /** Optional for "orbital" variant */
  connections?: HeroSceneConnection[]
  className?: string
}

const KIND_LABELS: Record<string, string> = {
  subject: "Subject",
  role: "Role",
  topic: "Topic",
}

function EntityKindBadge({
  kind,
  color,
}: {
  kind: string
  color: string
}) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{
        borderColor: `${color}30`,
        color,
        backgroundColor: `${color}10`,
      }}
    >
      {KIND_LABELS[kind] ?? kind}
    </span>
  )
}

function StatChips({ chips, color }: { chips: EntityHeroStatChip[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="rounded-[14px] border px-4 py-2.5"
          style={{
            borderColor: "rgba(44,49,59,0.08)",
            backgroundColor: "rgba(255,255,255,0.72)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
            {chip.label}
          </p>
          <p className="mt-1 font-serif text-lg font-semibold" style={{ color }}>
            {chip.value}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── Orbital variant: wraps existing HeroScene ── */

function OrbitalHero({
  title,
  subtitle,
  entityKind,
  themeColor,
  statChips,
  nodes,
  connections,
  className,
}: EntityHeroProps & { nodes: HeroSceneNode[] }) {
  return (
    <div className={cn("flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12", className)}>
      <div className="flex-1 space-y-5 pt-4">
        <EntityKindBadge kind={entityKind} color={themeColor} />
        <h1 className="font-serif text-4xl font-bold text-editorial-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-lg text-base leading-relaxed text-editorial-muted sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {statChips && statChips.length > 0 ? (
          <StatChips chips={statChips} color={themeColor} />
        ) : null}
      </div>
      <div className="w-full max-w-[420px] shrink-0 lg:max-w-[460px]">
        <HeroScene
          title={title}
          nodes={nodes}
          connections={connections}
        />
      </div>
    </div>
  )
}

/* ── Gradient variant: rich gradient background without orbital SVG ── */

function GradientHero({
  title,
  subtitle,
  entityKind,
  themeColor,
  statChips,
  className,
}: EntityHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-[rgba(44,49,59,0.08)] p-8 shadow-editorial sm:p-12",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${themeColor}08, ${themeColor}18 40%, ${themeColor}06 70%, rgba(247,243,234,0.9))`,
      }}
    >
      {/* Subtle animated pulse */}
      <motion.div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${themeColor}40, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-[1] space-y-5">
        <EntityKindBadge kind={entityKind} color={themeColor} />
        <h1 className="max-w-2xl font-serif text-4xl font-bold text-editorial-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-xl text-base leading-relaxed text-editorial-muted sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {statChips && statChips.length > 0 ? (
          <StatChips chips={statChips} color={themeColor} />
        ) : null}
      </div>
    </div>
  )
}

/* ── Minimal variant: clean text-only hero ── */

function MinimalHero({
  title,
  subtitle,
  entityKind,
  themeColor,
  statChips,
  className,
}: EntityHeroProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <EntityKindBadge kind={entityKind} color={themeColor} />
      <h1 className="font-serif text-4xl font-bold text-editorial-ink sm:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-xl text-base leading-relaxed text-editorial-muted sm:text-lg">
          {subtitle}
        </p>
      ) : null}
      {statChips && statChips.length > 0 ? (
        <StatChips chips={statChips} color={themeColor} />
      ) : null}
    </div>
  )
}

/* ── Main entry point ── */

export function EntityHero({
  variant = "gradient",
  nodes,
  ...props
}: EntityHeroProps) {
  switch (variant) {
    case "orbital":
      if (!nodes || nodes.length === 0) {
        return <GradientHero {...props} variant="gradient" />
      }
      return <OrbitalHero {...props} variant="orbital" nodes={nodes} />
    case "gradient":
      return <GradientHero {...props} variant="gradient" />
    case "minimal":
      return <MinimalHero {...props} variant="minimal" />
    default:
      return <GradientHero {...props} variant="gradient" />
  }
}
