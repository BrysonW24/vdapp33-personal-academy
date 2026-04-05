"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpenText,
  Briefcase,
  Building2,
  Cpu,
  DollarSign,
  FlaskConical,
  GraduationCap,
  Landmark,
  Megaphone,
  Rocket,
  Scale,
  Sigma,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PerspectiveToggleProps {
  perspectives: Record<string, string>
  defaultContent: string
}

type PerspectiveTab = {
  id: string
  label: string
  content: string
  icon: LucideIcon
}

const ICONS: Record<string, LucideIcon> = {
  core: GraduationCap,
  experimentalist: FlaskConical,
  theorist: Sigma,
  engineer: Wrench,
  chiefengineer: Rocket,
  educator: BookOpenText,
  manager: Briefcase,
  cto: Cpu,
  ceo: Building2,
  cfo: DollarSign,
  investor: TrendingUp,
  regulator: Scale,
  politician: Landmark,
  marketer: Megaphone,
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function PerspectiveToggle({
  perspectives,
  defaultContent,
}: PerspectiveToggleProps) {
  const tabs = useMemo<PerspectiveTab[]>(() => {
    const dynamicTabs = Object.entries(perspectives).map(([key, content]) => {
      const normalized = normalizeKey(key)

      return {
        id: key,
        label: formatLabel(key),
        content,
        icon: ICONS[normalized] ?? BookOpenText,
      }
    })

    return [
      {
        id: "core",
        label: "Core",
        content: defaultContent,
        icon: GraduationCap,
      },
      ...dynamicTabs,
    ]
  }, [defaultContent, perspectives])

  const [active, setActive] = useState(tabs[0]?.id ?? "core")
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.78)] backdrop-blur-[16px]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-editorial-green text-white shadow-sm"
                  : "text-editorial-muted hover:text-editorial-ink hover:bg-white/60"
              )}
            >
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground leading-relaxed whitespace-pre-line"
        >
          {activeTab.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
