"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Framework } from "@/types/curriculum"

interface FrameworkCardProps {
  framework: Framework
  essential?: boolean
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function FrameworkCard({ framework, essential }: FrameworkCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors",
        expanded ? "border-primary/40" : "hover:border-primary/20"
      )}
      onClick={() => setExpanded((current) => !current)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          setExpanded((current) => !current)
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {essential && (
              <Star className="h-4 w-4 text-editorial-amber fill-editorial-amber shrink-0" />
            )}
            <CardTitle className="text-lg">{framework.name}</CardTitle>
            <Badge variant="secondary" className="text-[11px]">
              {humanize(framework.category)}
            </Badge>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{framework.summary}</p>
      </CardHeader>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CardContent className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">When to use it</h4>
                <p className="text-sm text-muted-foreground">{framework.whenToUseIt}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Steps</h4>
                <ol className="space-y-1.5">
                  {framework.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Example</h4>
                <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                  {framework.example}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
