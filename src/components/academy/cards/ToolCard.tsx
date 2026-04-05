"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/lib/progress"
import type { Tool } from "@/types/curriculum"

const PRICING_COLORS: Record<string, string> = {
  free: "bg-editorial-green-soft text-editorial-green",
  freemium: "bg-editorial-blue-soft text-editorial-blue",
  paid: "bg-editorial-amber-soft text-editorial-amber",
  enterprise: "bg-editorial-red-soft text-editorial-red",
}

interface ToolCardProps {
  tool: Tool
  subjectSlug?: string
  basePath?: string
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function ToolCard({
  tool,
  subjectSlug,
  basePath = "/tools",
}: ToolCardProps) {
  const progressSubjectSlug = tool.sourceMeta?.sourceSlug ?? subjectSlug
  const hasViewed = useProgress((state) =>
    progressSubjectSlug
      ? (state.subjects[progressSubjectSlug]?.viewedTools ?? []).includes(tool.slug)
      : state.viewedTools.includes(tool.slug)
  )

  return (
    <Link href={`${basePath}/${tool.slug}`} className="block group">
      <Card className="h-full hover:shadow-editorial-hover hover:-translate-y-[2px] transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {tool.logoUrl ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white border border-[rgba(44,49,59,0.08)] p-1.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tool.logoUrl}
                    alt={`${tool.name} logo`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-editorial-canvas border border-[rgba(44,49,59,0.08)] shrink-0">
                  <span className="text-sm font-serif font-bold text-editorial-muted">
                    {tool.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-base flex items-center gap-1.5">
                  {tool.name}
                  <ArrowRight className="h-3 w-3 text-editorial-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
              </div>
            </div>
            {hasViewed && (
              <Badge className="bg-editorial-green-soft text-editorial-green border-transparent text-[10px]">
                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                Seen
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">
              {humanize(tool.category)}
            </Badge>
            <Badge
              className={`border-transparent text-[10px] ${PRICING_COLORS[tool.pricingTier] ?? ""}`}
            >
              {tool.pricingTier}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-editorial-muted leading-relaxed">
            {tool.description}
          </p>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-editorial-muted mb-1">
              Why use it
            </h4>
            <p className="text-sm text-editorial-ink/80 leading-relaxed">
              {tool.whyUseIt}
            </p>
          </div>

          {tool.aiCapabilities && (
            <div className="rounded-[14px] bg-editorial-green-soft/60 border border-editorial-green/10 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-editorial-green" />
                <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-editorial-green">
                  AI Capabilities
                </h4>
              </div>
              <p className="text-xs text-editorial-ink/70 leading-relaxed">
                {tool.aiCapabilities}
              </p>
            </div>
          )}

          {tool.alternatives.length > 0 && (
            <div>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-editorial-muted mb-1.5">
                Alternatives
              </h4>
              <div className="flex flex-wrap gap-1">
                {tool.alternatives.map((alternative) => (
                  <Badge key={alternative} variant="outline" className="text-[10px]">
                    {alternative}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
