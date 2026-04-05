import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { EntityManifest } from "@/types/entity"

interface EntityCardProps {
  entity: EntityManifest
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
  return (
    <Link
      href={href}
      className="group rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.8)] p-6 shadow-editorial-soft transition-all duration-200 hover:-translate-y-[2px] hover:shadow-editorial-hover"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
          {eyebrow ?? entity.kind}
        </span>
        <ArrowRight className="h-4 w-4 text-editorial-muted transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>

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

      {statLine ? (
        <p className="mt-4 text-xs text-editorial-muted">{statLine}</p>
      ) : null}
    </Link>
  )
}
