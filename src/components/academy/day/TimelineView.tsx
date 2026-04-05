"use client"

import { motion } from "framer-motion"
import type { DayInLife } from "@/types/curriculum"
import { Badge } from "@/components/ui/badge"

interface TimelineViewProps {
  scenario: DayInLife
}

export function TimelineView({ scenario }: TimelineViewProps) {
  return (
    <div className="relative pl-8 space-y-0">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

      {scenario.schedule.map((entry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative pb-6"
        >
          {/* Dot */}
          <div className="absolute -left-5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />

          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">{entry.time}</p>
            <p className="text-sm">{entry.activity}</p>
            {entry.tools && entry.tools.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {entry.tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
            {entry.note && (
              <p className="text-xs text-muted-foreground italic">{entry.note}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
