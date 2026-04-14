import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrowseEntityIcon } from "@/components/browse/BrowseEntityIcon"
import {
  BROWSE_STATUS_LABELS,
  BROWSE_TIER_LABELS,
} from "@/components/browse/browse-catalog"
import { getEntityAccent, mixWithWhite, withAlpha } from "@/lib/entity-accent"
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
  const accent = getEntityAccent(entity)
  const surface = mixWithWhite(accent, 0.9)

  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-[208px] flex-col justify-between overflow-hidden rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.88)] p-4 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover sm:min-h-[228px] sm:rounded-[22px] sm:p-5"
      style={{
        backgroundImage: `linear-gradient(180deg, ${withAlpha(surface, 0.72)}, rgba(255,255,255,0.88))`,
        borderColor: withAlpha(accent, 0.14),
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(accent, 0.1)}, transparent)`,
        }}
      />

      <div>
        <div className="relative mb-3 flex items-start justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className="rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.18em] sm:px-2.5 sm:text-[10px]"
              style={{
                borderColor: withAlpha(accent, 0.18),
                backgroundColor: withAlpha(accent, 0.08),
                color: accent,
              }}
            >
              {resolvedEyebrow}
            </span>
            {entity.academyTier ? (
              <span className="text-[9px] uppercase tracking-[0.18em] text-editorial-muted sm:text-[10px]">
                {BROWSE_TIER_LABELS[entity.academyTier]}
              </span>
            ) : null}
            {entity.contentStatus ? (
              <span className="text-[9px] uppercase tracking-[0.18em] text-editorial-muted sm:text-[10px]">
                {BROWSE_STATUS_LABELS[entity.contentStatus]}
              </span>
            ) : null}
          </div>
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </div>

        <div className="relative flex items-start gap-3 sm:gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] sm:h-11 sm:w-11 sm:rounded-[16px]"
            style={{
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
              boxShadow: `inset 0 0 0 1px ${withAlpha(accent, 0.12)}`,
            }}
          >
            <BrowseEntityIcon iconName={entity.icon} className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0">
            <span
              className="mb-3 inline-block h-2 w-10 rounded-full sm:mb-4 sm:h-2.5 sm:w-12"
              style={{ backgroundColor: accent }}
            />

            <h3 className="font-serif text-[1.35rem] font-semibold leading-tight text-editorial-ink sm:text-[1.6rem]">
              {entity.name}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-editorial-muted sm:mt-2 sm:text-sm sm:leading-relaxed">
              {entity.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-4 sm:mt-5">
        {statLine ? (
          <p className="mt-2 text-[11px] leading-[1.55] text-editorial-muted sm:mt-3 sm:text-xs sm:leading-relaxed">
            {statLine}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
