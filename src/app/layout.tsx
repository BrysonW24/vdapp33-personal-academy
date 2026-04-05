import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navigation } from "@/components/academy/layout/Navigation"
import { Footer } from "@/components/academy/layout/Footer"
import { getSubjects } from "@/lib/content"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Personal Academy",
    template: "%s | Personal Academy",
  },
  description:
    "A unified academy for curiosity-driven learning across politics, commercial property management, physics, quantum, aerospace, robotics, and rocket science.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const subjects = getSubjects()

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col relative z-[1]">
        <Navigation subjects={subjects} />
        <div className="h-[60px] sm:h-[80px]" aria-hidden="true" />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
