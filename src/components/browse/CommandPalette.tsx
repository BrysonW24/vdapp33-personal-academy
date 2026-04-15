"use client"

import * as Dialog from "@radix-ui/react-dialog"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { Command, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  BROWSE_BUCKET_LABELS,
  BROWSE_KIND_LABELS,
  BROWSE_STATUS_LABELS,
  BROWSE_TIER_LABELS,
  filterBrowseItems,
  type BrowseItem,
} from "@/components/browse/browse-catalog"
import { BrowseEntityIcon } from "@/components/browse/BrowseEntityIcon"
import { cn } from "@/lib/utils"

interface CommandPaletteProps {
  items: BrowseItem[]
  className?: string
  compact?: boolean
  onBeforeOpen?: () => void
  triggerLabel?: string
}

const MAX_RESULTS = 48

export function CommandPalette({
  items,
  className,
  compact = false,
  onBeforeOpen,
  triggerLabel = "Jump to anything",
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<BrowseItem["kind"] | "all">("all")
  const [bucket, setBucket] = useState<BrowseItem["bucket"] | "all">("all")
  const [tier, setTier] = useState<BrowseItem["tier"] | "all">("all")
  const [status, setStatus] = useState<BrowseItem["status"] | "all">("all")
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 25)
    return () => window.clearTimeout(timeout)
  }, [open])

  const results = useMemo(
    () =>
      filterBrowseItems(items, query, {
        kind,
        bucket,
        tier,
        status,
      }).slice(0, MAX_RESULTS),
    [bucket, items, kind, query, status, tier]
  )

  const openPalette = () => {
    onBeforeOpen?.()
    setOpen(true)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery("")
          setKind("all")
          setBucket("all")
          setTier("all")
          setStatus("all")
        }
      }}
    >
      <button
        type="button"
        onClick={openPalette}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-2 text-sm text-editorial-ink shadow-sm transition-all duration-200 hover:bg-white",
          compact && "h-11 w-11 justify-center px-0 py-0",
          className
        )}
      >
        <Search className="h-4 w-4" />
        {!compact ? <span>{triggerLabel}</span> : null}
        {!compact ? (
          <span className="hidden items-center gap-1 rounded-full border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.9)] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-editorial-muted sm:inline-flex">
            <Command className="h-3 w-3" />
            K
          </span>
        ) : null}
      </button>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[rgba(21,24,30,0.34)] backdrop-blur-[6px]" />
        <Dialog.Content className="fixed left-1/2 top-[52%] z-[90] flex max-h-[85vh] w-[min(960px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.98)] shadow-[0_40px_120px_rgba(44,49,59,0.18)] backdrop-blur-[26px] sm:w-[min(1040px,calc(100vw-56px))]">
          <div className="border-b border-[rgba(44,49,59,0.08)] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/84 px-4 py-3">
              <Search className="h-4.5 w-4.5 text-editorial-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subjects, topics, roles, modules, and signals"
                className="w-full bg-transparent text-sm text-editorial-ink outline-none placeholder:text-editorial-muted"
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <select
                value={kind}
                onChange={(event) =>
                  setKind(event.target.value as BrowseItem["kind"] | "all")
                }
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/88 px-3 py-2 text-sm text-editorial-ink outline-none"
              >
                <option value="all">All kinds</option>
                {Object.entries(BROWSE_KIND_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={bucket}
                onChange={(event) =>
                  setBucket(event.target.value as BrowseItem["bucket"] | "all")
                }
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/88 px-3 py-2 text-sm text-editorial-ink outline-none"
              >
                <option value="all">All buckets</option>
                {Object.entries(BROWSE_BUCKET_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={tier}
                onChange={(event) =>
                  setTier(event.target.value as BrowseItem["tier"] | "all")
                }
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/88 px-3 py-2 text-sm text-editorial-ink outline-none"
              >
                <option value="all">All tiers</option>
                {Object.entries(BROWSE_TIER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as BrowseItem["status"] | "all")
                }
                className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/88 px-3 py-2 text-sm text-editorial-ink outline-none"
              >
                <option value="all">All statuses</option>
                {Object.entries(BROWSE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            {results.length ? (
              <div className="space-y-2">
                {results.map((item) => (
                  <Dialog.Close asChild key={item.id}>
                    <Link
                      href={item.href}
                      className="flex flex-col gap-3 rounded-[20px] border border-[rgba(44,49,59,0.12)] bg-white/92 px-4 py-4 transition-all duration-200 hover:-translate-y-[1px] hover:bg-white hover:shadow-editorial-soft sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        {item.emoji ? (
                          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/92 text-[1.15rem] shadow-sm">
                            {item.emoji}
                          </span>
                        ) : null}
                        <span
                          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
                          style={{
                            backgroundColor: `${item.accentColor}18`,
                            color: item.accentColor,
                          }}
                        >
                          <BrowseEntityIcon iconName={item.icon} className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-medium text-editorial-ink">
                              {item.title}
                            </p>
                            <Badge variant="secondary" className="text-[10px]">
                              {BROWSE_KIND_LABELS[item.kind]}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <Badge variant="secondary" className="text-[10px]">
                          {BROWSE_BUCKET_LABELS[item.bucket]}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {BROWSE_TIER_LABELS[item.tier]}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {BROWSE_STATUS_LABELS[item.status]}
                        </Badge>
                      </div>
                    </Link>
                  </Dialog.Close>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[rgba(44,49,59,0.12)] bg-white/50 px-6 py-14 text-center">
                <p className="font-serif text-2xl font-semibold text-editorial-ink">
                  No matching surfaces
                </p>
                <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
                  Try a broader query or switch one of the filters back to “all”.
                </p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
