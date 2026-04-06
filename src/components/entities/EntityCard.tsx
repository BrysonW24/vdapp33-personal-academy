import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrowseEntityIcon } from "@/components/browse/BrowseEntityIcon"
import {
  BROWSE_STATUS_LABELS,
  BROWSE_TIER_LABELS,
} from "@/components/browse/browse-catalog"
import { Badge } from "@/components/ui/badge"
import type { SubjectManifest } from "@/types/curriculum"
import type { EntityManifest } from "@/types/entity"

interface EntityCardProps {
  entity: SubjectManifest | EntityManifest
  href: string
  eyebrow?: string
  statLine?: string
}

export function EntityCard({
  entity,
  href,
  eyebrow,
  statLine,
}: EntityCardProps) {
  const resolvedEyebrow =
    eyebrow ?? ("kind" in entity && entity.kind ? entity.kind : "subject")

  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.8)] p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:bg-white hover:shadow-editorial-hover"
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            {resolvedEyebrow}
          </span>
          <ArrowRight className="h-4 w-4 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>

        <div className="flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]"
            style={{
              backgroundColor: `${entity.color}16`,
              color: entity.color,
            }}
          >
            <BrowseEntityIcon iconName={entity.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span
              className="mb-4 inline-block h-2.5 w-12 rounded-full"
              style={{ backgroundColor: entity.color }}
            />

            <h3 className="font-serif text-2xl font-semibold text-editorial-ink">
              {entity.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
              {entity.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap gap-2">
          {entity.academyTier ? (
            <Badge variant="secondary" className="text-[10px]">
              {BROWSE_TIER_LABELS[entity.academyTier]}
            </Badge>
          ) : null}
          {entity.contentStatus ? (
            <Badge variant="secondary" className="text-[10px]">
              {BROWSE_STATUS_LABELS[entity.contentStatus]}
            </Badge>
          ) : null}
        </div>

        {statLine ? (
          <p className="mt-4 text-xs leading-relaxed text-editorial-muted">{statLine}</p>
        ) : null}
      </div>
    </Link>
  )
}
