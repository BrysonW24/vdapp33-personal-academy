import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface BreadcrumbSegment {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[]
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  const backTarget = [...segments]
    .slice(0, -1)
    .reverse()
    .find((segment) => segment.href)

  return (
    <div className="space-y-3">
      {backTarget ? (
        <div className="sm:hidden">
          <Link
            href={backTarget.href!}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(44,49,59,0.08)] bg-white/84 px-3 py-1.5 text-[12px] font-medium text-editorial-ink shadow-sm transition-colors hover:bg-editorial-canvas"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to {backTarget.label}
          </Link>
        </div>
      ) : null}

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
