import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navigation } from "@/components/academy/layout/Navigation"
import { Footer } from "@/components/academy/layout/Footer"
import { getSubjects } from "@/lib/content"
import { getRoles, getTopics } from "@/lib/entities"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Nexus",
    template: "%s | Nexus",
  },
  description:
    "Nexus is a guided knowledge operating system for curiosity-driven learning across subjects, topics, and roles, with local-first onboarding, My Path, truth stacks, and curated signals.",
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

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative z-[1]">
        <Navigation subjects={subjects} roles={roles} topics={topics} />
        <div className="h-[60px] sm:h-[80px]" aria-hidden="true" />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
