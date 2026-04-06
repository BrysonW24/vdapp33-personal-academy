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
      className="group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.88)] p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
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
        <div className="relative mb-5 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: withAlpha(accent, 0.18),
                backgroundColor: withAlpha(accent, 0.08),
                color: accent,
              }}
            >
              {resolvedEyebrow}
            </span>
            {entity.academyTier ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                {BROWSE_TIER_LABELS[entity.academyTier]}
              </span>
            ) : null}
            {entity.contentStatus ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                {BROWSE_STATUS_LABELS[entity.contentStatus]}
              </span>
            ) : null}
          </div>
          <ArrowRight className="h-4 w-4 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>

        <div className="relative flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]"
            style={{
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
              boxShadow: `inset 0 0 0 1px ${withAlpha(accent, 0.12)}`,
            }}
          >
            <BrowseEntityIcon iconName={entity.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span
              className="mb-4 inline-block h-2.5 w-12 rounded-full"
              style={{ backgroundColor: accent }}
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

      <div className="relative mt-5">
        {statLine ? (
          <p className="mt-4 text-xs leading-relaxed text-editorial-muted">{statLine}</p>
        ) : null}
      </div>
    </Link>
  )
}
