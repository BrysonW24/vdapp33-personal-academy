"use client"

import Link from "next/link"
import type { DayInLife } from "@/types/curriculum"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, Building2, Laptop, Plane, Rocket, Store, Users } from "lucide-react"

const SETTING_ICONS = {
  building: Building2,
  team: Users,
  field: Store,
  solo: Laptop,
  aerospace: Plane,
  space: Rocket,
} as const

function getSettingIcon(scenario: DayInLife) {
  const haystack = `${scenario.setting} ${scenario.title} ${scenario.companySize}`.toLowerCase()

  if (haystack.includes("space") || haystack.includes("rocket")) {
    return SETTING_ICONS.space
  }

  if (haystack.includes("flight") || haystack.includes("air") || haystack.includes("aerospace")) {
    return SETTING_ICONS.aerospace
  }

  if (haystack.includes("research group") || haystack.includes("team")) {
    return SETTING_ICONS.team
  }

  if (haystack.includes("freelance") || haystack.includes("solo")) {
    return SETTING_ICONS.solo
  }

  if (haystack.includes("office") || haystack.includes("constituency")) {
    return SETTING_ICONS.field
  }

  return SETTING_ICONS.building
}

interface ScenarioCardProps {
  scenario: DayInLife
  isActive: boolean
  onClick: () => void
  href?: string
}

export function ScenarioCard({
  scenario,
  isActive,
  onClick,
  href,
}: ScenarioCardProps) {
  const Icon = getSettingIcon(scenario)

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isActive && "ring-2 ring-primary border-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">{scenario.title}</h3>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {scenario.companySize}
        </p>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs">
            {scenario.salary}
          </Badge>
          {href && (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Full page
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
