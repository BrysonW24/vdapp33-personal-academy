import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { getRole, getRoles } from "@/lib/entities"

export async function generateStaticParams() {
  return getRoles().map((role) => ({ slug: role.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const role = getRole(slug)
  if (!role) return { title: "Not Found" }

  return {
    title: role.name,
    description: role.tagline,
  }
}

export default async function RoleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!getRole(slug)) notFound()
  return children
}
