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
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground overflow-hidden">
      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1

        return (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {isLast || !segment.href ? (
              <span className={isLast ? "text-foreground truncate" : "truncate"}>
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-foreground transition-colors shrink-0"
              >
                {segment.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
