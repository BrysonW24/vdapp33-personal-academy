import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navigation } from "@/components/academy/layout/Navigation"
import { Footer } from "@/components/academy/layout/Footer"
import { getBrowseCatalogData } from "@/lib/browse-data"
import { getSubjects } from "@/lib/content"
import { getRoles, getTopics } from "@/lib/entities"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Nexus",
    template: "%s | Nexus",
  },
  description:
    "Nexus is a browse-first knowledge interface for exploring subjects, topics, and roles, with truth stacks, curated signals, and optional local-first guidance.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const subjects = getSubjects()
  const roles = getRoles()
  const topics = getTopics()
  const { items: browseItems } = getBrowseCatalogData()

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative z-[1]">
        <Navigation
          subjects={subjects}
          roles={roles}
          topics={topics}
          browseItems={browseItems}
        />
        <div className="h-[60px] sm:h-[80px]" aria-hidden="true" />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
