"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { readPreviousPath } from "@/components/academy/layout/RouteHistoryTracker"
import { cn } from "@/lib/utils"

interface EntityBackButtonProps {
  entityHref: string
  entityLabel: string
  directoryHref: string
  directoryLabel: string
  className?: string
}

export function EntityBackButton({
  entityHref,
  entityLabel,
  directoryHref,
  directoryLabel,
  className,
}: EntityBackButtonProps) {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string | null>(null)

  useEffect(() => {
    const value = readPreviousPath()
    if (value && value !== pathname) {
      setPreviousPath(value)
      return
    }

    setPreviousPath(null)
  }, [pathname])

  const fallback = useMemo(() => {
    const isRootEntityPage = pathname === entityHref

    return {
      href: isRootEntityPage ? directoryHref : entityHref,
      label: isRootEntityPage ? directoryLabel : entityLabel,
    }
  }, [directoryHref, directoryLabel, entityHref, entityLabel, pathname])

  const href = previousPath ?? fallback.href
  const label = previousPath ? "Back" : `Back to ${fallback.label}`

  return (
    <div className={cn("container mx-auto px-4 pt-4 sm:pt-6", className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(44,49,59,0.12)] bg-white/94 px-3.5 py-2 text-sm font-medium text-editorial-ink shadow-sm transition-all duration-200 hover:border-[rgba(44,49,59,0.2)] hover:bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
        {label}
      </Link>
    </div>
  )
}
