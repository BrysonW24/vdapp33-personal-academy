import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  BROWSE_STATUS_LABELS,
  BROWSE_TIER_LABELS,
} from "@/components/browse/browse-catalog"
import { resolveEntityEmoji } from "@/lib/entity-emoji"
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
  const surface = mixWithWhite(accent, 0.78)
  const emoji = resolveEntityEmoji(entity)
  const statBits = statLine
    ?.split("·")
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-[148px] flex-col justify-between overflow-hidden rounded-[16px] border border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.94)] p-3 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover sm:min-h-[200px] sm:rounded-[18px] sm:p-4"
      style={{
        backgroundImage: `linear-gradient(180deg, ${withAlpha(surface, 0.9)}, rgba(255,255,255,0.96))`,
        borderColor: withAlpha(accent, 0.2),
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(accent, 0.14)}, transparent)`,
        }}
      />

      <div>
        <div className="relative mb-2 flex items-start justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span
              className="rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.18em] sm:px-2.5 sm:text-[10px]"
              style={{
                borderColor: withAlpha(accent, 0.22),
                backgroundColor: withAlpha(accent, 0.12),
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
              <span className="hidden text-[9px] uppercase tracking-[0.18em] text-editorial-muted md:inline md:text-[10px]">
                {BROWSE_STATUS_LABELS[entity.contentStatus]}
              </span>
            ) : null}
          </div>
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </div>

        <div className="relative flex items-start gap-2.5 sm:gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(44,49,59,0.08)] bg-white/92 text-[1.1rem] shadow-sm sm:h-12 sm:w-12 sm:rounded-[16px] sm:text-[1.2rem]"
            aria-hidden="true"
          >
            {emoji}
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="mb-2 inline-block h-1.5 w-8 rounded-full sm:mb-3 sm:h-2.5 sm:w-12"
              style={{ backgroundColor: accent }}
            />

            <h3 className="font-serif text-[0.94rem] font-semibold leading-[1.15] text-editorial-ink sm:text-[1.55rem]">
              {entity.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.45] text-editorial-muted sm:mt-2 sm:text-sm sm:leading-relaxed">
              {entity.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-3 sm:mt-4">
        {statBits?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {statBits.slice(0, 3).map((bit) => (
              <span
                key={bit}
                className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/94 px-2.5 py-1 text-[10px] leading-none text-editorial-muted sm:text-[11px]"
              >
                {bit}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
