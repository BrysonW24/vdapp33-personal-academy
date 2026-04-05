"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Wrench,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type QuestStatus = "locked" | "available" | "in-progress" | "completed"

export interface QuestBoardItem {
  id: string
  title: string
  description: string
  difficulty: number
  duration: string
  tools?: string[]
  outcomes?: string[]
  href?: string
  ctaLabel?: string
  badge?: string
  status?: QuestStatus
  onSelect?: () => void
}

export interface QuestBoardProps {
  title?: string
  subtitle?: string
  items: QuestBoardItem[]
  className?: string
}

function getDifficultyLabel(difficulty: number) {
  if (difficulty <= 2) return "Novice"
  if (difficulty <= 4) return "Apprentice"
  if (difficulty <= 6) return "Journeyman"
  if (difficulty <= 8) return "Expert"
  if (difficulty <= 9) return "Master"
  return "Legendary"
}

function getDifficultyAccent(difficulty: number) {
  if (difficulty <= 3) {
    return {
      soft: "bg-editorial-green-soft border-editorial-green/20 text-editorial-green",
      solid: "bg-editorial-green",
      icon: Shield,
    }
  }

  if (difficulty <= 6) {
    return {
      soft: "bg-editorial-amber-soft border-editorial-amber/20 text-editorial-amber",
      solid: "bg-editorial-amber",
      icon: Swords,
    }
  }

  if (difficulty <= 9) {
    return {
      soft: "bg-editorial-red-soft border-editorial-red/20 text-editorial-red",
      solid: "bg-editorial-red",
      icon: Trophy,
    }
  }

  return {
    soft: "bg-[rgba(255,242,191,0.75)] border-yellow-500/30 text-yellow-700",
    solid: "bg-yellow-600",
    icon: Crown,
  }
}

function statusLabel(status: QuestStatus) {
  switch (status) {
    case "completed":
      return "Complete"
    case "in-progress":
      return "In Progress"
    case "locked":
      return "Locked"
    default:
      return "Available"
  }
}

function QuestCard({
  item,
  index,
}: {
  item: QuestBoardItem
  index: number
}) {
  const accent = getDifficultyAccent(item.difficulty)
  const DifficultyIcon = accent.icon
  const isCapstone = item.difficulty >= 10
  const status = item.status ?? "available"
  const isCompleted = status === "completed"
  const isInteractive = Boolean(item.href || item.onSelect)
  const offsetY = index % 3 === 0 ? 0 : index % 3 === 1 ? 12 : -8
  const rotate =
    index % 5 === 0
      ? -0.6
      : index % 5 === 1
        ? 0.45
        : index % 5 === 2
          ? -0.35
          : index % 5 === 3
            ? 0.55
            : 0

  const content = (
    <div
      className={cn(
        "academy-paper-panel relative h-full overflow-hidden rounded-[24px] border border-[rgba(44,49,59,0.08)] p-6 transition-all duration-300",
        "bg-[linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(255,250,242,0.95))]",
        isInteractive && "group-hover:-translate-y-1 group-hover:shadow-editorial-hover",
        isCompleted && "border-editorial-green/30 shadow-[0_0_24px_rgba(56,106,88,0.12)]",
        status === "locked" && "opacity-75 saturate-[0.86]",
        isCapstone && "border-yellow-500/30 bg-[linear-gradient(180deg,_rgba(255,253,247,0.92),_rgba(254,249,231,0.96))]"
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="academy-paper-noise absolute inset-0 opacity-70" />

      {isCapstone && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500/80 via-editorial-amber to-yellow-500/80" />
      )}

      {isCompleted && (
        <div className="absolute right-4 top-4 z-[1]">
          <div className="flex items-center gap-1.5 rounded-full border border-editorial-green/20 bg-editorial-green/10 px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-editorial-green" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-editorial-green">
              Complete
            </span>
          </div>
        </div>
      )}

      <div className="relative z-[1] flex h-full flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
              accent.soft
            )}
          >
            <DifficultyIcon className="h-3.5 w-3.5" />
            <span>{item.difficulty}/10</span>
            <span className="opacity-55">-</span>
            <span>{getDifficultyLabel(item.difficulty)}</span>
          </div>

          <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.16em]">
            {statusLabel(status)}
          </Badge>

          {item.badge ? (
            <Badge className="border-transparent bg-editorial-blue-soft text-editorial-blue text-[10px] uppercase tracking-[0.16em]">
              {item.badge}
            </Badge>
          ) : null}
        </div>

        <h3 className={cn("font-serif font-bold leading-tight text-editorial-ink", isCapstone ? "text-2xl" : "text-lg")}>
          {item.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-editorial-muted">
          {item.description}
        </p>

        {item.tools && item.tools.length > 0 ? (
          <div className="mt-5 flex items-start gap-2">
            <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-editorial-muted" />
            <div className="flex flex-wrap gap-1.5">
              {item.tools.slice(0, 5).map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-editorial-canvas px-2 py-0.5 text-[11px] font-medium text-editorial-muted"
                >
                  {tool}
                </span>
              ))}
              {item.tools.length > 5 ? (
                <span className="text-[11px] text-editorial-muted">+{item.tools.length - 5}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {item.outcomes && item.outcomes.length > 0 ? (
          <div className="mt-4 flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-editorial-green" />
            <div className="flex flex-wrap gap-1.5">
              {item.outcomes.slice(0, 3).map((outcome) => (
                <span
                  key={outcome}
                  className="rounded-full bg-editorial-green-soft px-2 py-0.5 text-[11px] font-medium text-editorial-green"
                >
                  {outcome}
                </span>
              ))}
              {item.outcomes.length > 3 ? (
                <span className="text-[11px] text-editorial-muted">
                  +{item.outcomes.length - 3} more
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(44,49,59,0.06)] pt-4">
          <div className="flex items-center gap-1.5 text-xs text-editorial-muted">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{item.duration}</span>
          </div>

          <Button
            variant={isCompleted ? "secondary" : "default"}
            size="sm"
            className={cn(
              "gap-1.5",
              isCapstone && !isCompleted && "bg-yellow-600 shadow-yellow-600/20 hover:bg-yellow-700",
              status === "locked" && "pointer-events-none bg-[rgba(44,49,59,0.08)] text-editorial-muted shadow-none"
            )}
          >
            <span>{item.ctaLabel ?? (item.href ? "Open Quest" : "View Quest")}</span>
            {item.href ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="group block h-full">
        {content}
      </Link>
    )
  }

  if (item.onSelect) {
    return (
      <button
        type="button"
        onClick={item.onSelect}
        className="group block h-full w-full text-left"
      >
        {content}
      </button>
    )
  }

  return content
}

export function QuestBoard({
  title = "Quest Board",
  subtitle,
  items,
  className,
}: QuestBoardProps) {
  const sorted = [...items].sort((left, right) => left.difficulty - right.difficulty)
  const completedCount = sorted.filter((item) => item.status === "completed").length

  return (
    <section className={cn("space-y-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-editorial-green/10">
            <Swords className="h-5 w-5 text-editorial-green" />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-editorial-muted">
              {title}
            </h2>
            <p className="text-xs text-editorial-muted">
              {subtitle ?? `${completedCount}/${sorted.length} quests completed`}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          {sorted.map((item) => (
            <div
              key={item.id}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-[rgba(44,49,59,0.08)] transition-colors",
                item.status === "completed"
                  ? "bg-editorial-green"
                  : item.status === "in-progress"
                    ? "bg-editorial-amber"
                    : "bg-editorial-canvas"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {sorted.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.2, 0.75, 0.2, 1] }}
            style={{ marginTop: index % 3 === 0 ? 0 : index % 3 === 1 ? 12 : -8 }}
            className={cn(item.difficulty >= 10 && "md:col-span-2")}
          >
            <QuestCard item={item} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
