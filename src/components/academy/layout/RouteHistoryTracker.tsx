"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const CURRENT_PATH_KEY = "nexus-current-path"
const PREVIOUS_PATH_KEY = "nexus-previous-path"

export function RouteHistoryTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return

    const current = window.sessionStorage.getItem(CURRENT_PATH_KEY)

    if (current && current !== pathname) {
      window.sessionStorage.setItem(PREVIOUS_PATH_KEY, current)
    }

    window.sessionStorage.setItem(CURRENT_PATH_KEY, pathname)
  }, [pathname])

  return null
}

export function readPreviousPath() {
  if (typeof window === "undefined") return null

  const value = window.sessionStorage.getItem(PREVIOUS_PATH_KEY)
  if (!value?.startsWith("/")) return null
  return value
}
