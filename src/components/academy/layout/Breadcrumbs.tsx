import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbSegment {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[]
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  return (
    <div className="space-y-3">
      <nav className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[13px] text-muted-foreground sm:text-sm">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1

          return (
            <span key={i} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              {isLast || !segment.href ? (
                <span className={isLast ? "truncate text-foreground" : "truncate"}>
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="shrink-0 transition-colors hover:text-foreground"
                >
                  {segment.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>
    </div>
  )
}
