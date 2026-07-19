"use client"

import { useEffect, useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
  /** Heading shown in the always-visible header row. */
  title: string
  /** Small uppercase label above the title. */
  eyebrow?: string
  /** Count chip shown next to the title so the set stays legible while collapsed. */
  count?: number | string
  /** Optional short intro shown at the top of the expanded body. */
  description?: string
  /** Whether the section starts expanded. Defaults to collapsed to save vertical space. */
  defaultOpen?: boolean
  /** Anchor id. When the URL hash matches this id the section auto-expands. */
  id?: string
  /** Optional action (e.g. an "Open all" link) shown at the foot of the expanded body. */
  action?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Compact, tappable collapsible section used to keep long browse surfaces dense
 * on mobile. Collapsed, every section is a single tight row (title + count +
 * chevron) so the whole set stays visible at once; tapping unfolds the content.
 * Follows the UX density doctrine (vdapp34/docs/ux-density-doctrine.md).
 */
export function CollapsibleSection({
  title,
  eyebrow,
  count,
  description,
  defaultOpen = false,
  id,
  action,
  children,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const generatedId = useId()
  const contentId = `${id ?? generatedId}-content`

  // Open automatically when this section is the URL hash target (quick-jump links).
  useEffect(() => {
    if (!id) return
    const syncFromHash = () => {
      if (window.location.hash === `#${id}`) setOpen(true)
    }
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [id])

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "flex w-full items-center gap-3 rounded-[18px] border border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.92)] px-4 py-3 text-left shadow-editorial-soft backdrop-blur-[6px] transition-colors hover:bg-white",
          open && "rounded-b-none border-b-transparent"
        )}
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[1.3rem] font-semibold leading-tight text-editorial-ink sm:text-2xl">
              {title}
            </h2>
            {count !== undefined ? (
              <span className="rounded-full border border-[rgba(44,49,59,0.12)] bg-white/90 px-2 py-0.5 text-[11px] font-medium text-editorial-muted">
                {count}
              </span>
            ) : null}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-editorial-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          id={contentId}
          className="rounded-b-[18px] border border-t-0 border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.55)] px-3 py-4 sm:px-4"
        >
          {description ? (
            <p className="mb-3 max-w-3xl text-[13px] leading-[1.6] text-editorial-muted sm:text-sm">
              {description}
            </p>
          ) : null}
          {children}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      ) : null}
    </section>
  )
}
