"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  ChevronDown,
  Clock3,
  Compass,
  FolderKanban,
  Landmark,
  Library,
  Map,
  Menu,
  Sparkles,
  Wrench,
  X,
} from "lucide-react"
import type { BrowseItem } from "@/components/browse/browse-catalog"
import { BrowseEntityIcon } from "@/components/browse/BrowseEntityIcon"
import { CommandPalette } from "@/components/browse/CommandPalette"
import { NexusWordmark } from "@/components/branding/NexusWordmark"
import { cn } from "@/lib/utils"
import { getNavSectionGroups, resolveNavContext } from "@/lib/entity-nav"
import { SUBJECT_GROUP_LABELS, type SubjectManifest } from "@/types/curriculum"
import type { EntityManifest } from "@/types/entity"

interface NavigationProps {
  subjects: SubjectManifest[]
  roles: EntityManifest[]
  topics: EntityManifest[]
  browseItems: BrowseItem[]
}

const ICONS = {
  BookOpen,
  Clock3,
  Compass,
  FolderKanban,
  Library,
  Landmark,
  Map,
  Sparkles,
  Wrench,
} as const

const DIRECTORY_LINKS = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/roles", label: "Roles", icon: Landmark },
  { href: "/topics", label: "Topics", icon: Sparkles },
  { href: "/signals", label: "Signals", icon: Clock3 },
] as const

function isDirectoryActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navigation({
  subjects,
  roles,
  topics,
  browseItems,
}: NavigationProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [contextMoreOpen, setContextMoreOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
    setCollectionOpen(false)
    setContextMoreOpen(false)
  }, [pathname])

  const subjectSlugs = useMemo(
    () => subjects.map((subject) => subject.slug),
    [subjects]
  )
  const currentContext = resolveNavContext(pathname, subjectSlugs)

  const currentCollection =
    currentContext?.kind === "subject"
      ? subjects
      : currentContext?.kind === "role"
        ? roles
        : currentContext?.kind === "topic"
          ? topics
          : []

  const currentEntity =
    currentContext?.kind === "subject"
      ? (subjects.find((subject) => subject.slug === currentContext.slug) ?? null)
      : (currentCollection.find(
          (entity) => entity.slug === currentContext?.slug
        ) ?? null)

  const groupedSubjects = subjects.reduce<Record<string, SubjectManifest[]>>(
    (acc, subject) => {
      if (!acc[subject.group]) acc[subject.group] = []
      acc[subject.group].push(subject)
      return acc
    },
    {}
  )

  const navSectionGroups = currentContext
    ? getNavSectionGroups(
        currentContext.kind,
        currentContext.kind === "subject" &&
          currentEntity &&
          "deepDivePages" in currentEntity
          ? currentEntity
          : null
      )
    : { primary: [], overflow: [] }

  const primaryNavSections = navSectionGroups.primary
  const overflowNavSections = navSectionGroups.overflow

  const sectionHref = (segment: string) =>
    currentContext ? `${currentContext.basePath}${segment}` : "/"

  const isSectionActive = (segment: string) => {
    if (!currentContext) return false
    const href = sectionHref(segment)
    return segment === "" ? pathname === href : pathname.startsWith(href)
  }

  const collectionLabel =
    currentContext?.kind === "subject"
      ? "Subjects"
      : currentContext?.kind === "role"
        ? "Roles"
        : currentContext?.kind === "topic"
          ? "Topics"
          : null

  const quickSubjects = subjects.slice(0, 4)
  const quickRoles = roles.slice(0, 4)
  const quickTopics = topics.slice(0, 4)

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setContextMoreOpen(false)
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 rounded-none border-b border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.95)] backdrop-blur-[16px] shadow-editorial-soft sm:left-[18px] sm:right-[18px] sm:top-[18px] sm:rounded-[18px] sm:border">
      <div className="container flex min-h-12 items-center gap-2 py-2 sm:min-h-16">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <NexusWordmark
            size="compact"
            className="sm:hidden"
            textClassName="text-[1rem]"
          />
          <NexusWordmark
            size="compact"
            className="hidden sm:inline-flex"
            textClassName="text-[1.2rem]"
          />
        </Link>

        {currentEntity ? (
          <div className="relative hidden xl:block">
            <button
              onClick={() => {
                setCollectionOpen((open) => !open)
                setContextMoreOpen(false)
              }}
              className="flex items-center gap-1.5 rounded-full border border-[rgba(44,49,59,0.1)] bg-white/80 px-3 py-1.5 text-sm font-medium text-editorial-ink shadow-sm"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    "color" in currentEntity ? currentEntity.color : "#2C6AA0",
                }}
              />
              {"name" in currentEntity ? currentEntity.name : "Current"}
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  collectionOpen && "rotate-180"
                )}
              />
            </button>

            {collectionOpen ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCollectionOpen(false)}
                />
                <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.95)] p-3 shadow-editorial backdrop-blur-[20px]">
                  {currentContext?.kind === "subject" ? (
                    Object.entries(groupedSubjects).map(([group, groupSubjects]) => (
                      <div key={group} className="mb-3 last:mb-0">
                        <p className="mb-1 px-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                          {SUBJECT_GROUP_LABELS[group] ?? group}
                        </p>
                        <div className="space-y-0.5">
                          {groupSubjects.map((subject) => (
                            <Link
                              key={subject.slug}
                              href={`/${subject.slug}`}
                              onClick={() => setCollectionOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-sm transition-all duration-200",
                                pathname.startsWith(`/${subject.slug}`)
                                  ? "bg-white/80 text-editorial-ink shadow-sm"
                                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                              )}
                            >
                              <span
                                className="inline-block h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: subject.color }}
                              />
                              {subject.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-0.5">
                      <p className="mb-1 px-2 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        {collectionLabel}
                      </p>
                      {currentCollection.map((entity) => (
                        <Link
                          key={entity.slug}
                          href={`/${currentContext?.kind === "role" ? "roles" : "topics"}/${entity.slug}`}
                          onClick={() => setCollectionOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-sm transition-all duration-200",
                            pathname.startsWith(
                              `/${currentContext?.kind === "role" ? "roles" : "topics"}/${entity.slug}`
                            )
                              ? "bg-white/80 text-editorial-ink shadow-sm"
                              : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                          )}
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: entity.color }}
                          />
                          {entity.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <nav className="flex items-center gap-1 rounded-full border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.58)] p-1 shadow-sm">
            {DIRECTORY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-all duration-200",
                  isDirectoryActive(pathname, item.href)
                    ? "border border-[rgba(44,49,59,0.1)] bg-white/80 text-editorial-ink shadow-sm"
                    : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <CommandPalette items={browseItems} className="justify-between min-w-[196px]" />

          {currentContext ? (
            <div className="flex items-center gap-2 rounded-full border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.44)] p-1.5 shadow-sm">
              <span className="px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-editorial-muted">
                Context
              </span>
              <nav className="flex items-center gap-0.5">
                {primaryNavSections.map((item) => {
                  const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

                  return (
                    <Link
                      key={item.segment}
                      href={sectionHref(item.segment)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] transition-all duration-200",
                        isSectionActive(item.segment)
                          ? "border border-[rgba(44,49,59,0.1)] bg-white/90 text-editorial-ink shadow-sm"
                          : "text-editorial-muted hover:bg-white/60 hover:text-editorial-ink"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  )
                })}

                {overflowNavSections.length ? (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setContextMoreOpen((open) => !open)
                        setCollectionOpen(false)
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] transition-all duration-200",
                        overflowNavSections.some((item) => isSectionActive(item.segment))
                          ? "border border-[rgba(44,49,59,0.1)] bg-white/90 text-editorial-ink shadow-sm"
                          : "text-editorial-muted hover:bg-white/60 hover:text-editorial-ink"
                      )}
                    >
                      More
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          contextMoreOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {contextMoreOpen ? (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setContextMoreOpen(false)}
                        />
                        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.98)] p-2 shadow-editorial backdrop-blur-[20px]">
                          <p className="px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                            More
                          </p>
                          <div className="space-y-0.5">
                            {overflowNavSections.map((item) => {
                              const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

                              return (
                                <Link
                                  key={item.segment}
                                  href={sectionHref(item.segment)}
                                  onClick={() => setContextMoreOpen(false)}
                                  className={cn(
                                    "flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-sm transition-all duration-200",
                                    isSectionActive(item.segment)
                                      ? "bg-white/80 text-editorial-ink shadow-sm"
                                      : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                                  )}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {item.label}
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </nav>
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:hidden">
          <CommandPalette items={browseItems} compact />
          <button
            className="rounded-[12px] border border-[rgba(44,49,59,0.08)] bg-white/72 p-2 transition-colors hover:bg-white"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-[rgba(21,24,30,0.24)] backdrop-blur-[4px] lg:hidden"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-x-2.5 bottom-2.5 top-[60px] z-[45] overflow-hidden rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.98)] shadow-[0_40px_120px_rgba(44,49,59,0.18)] backdrop-blur-[24px] lg:hidden sm:top-[96px]">
            <div className="max-h-full overflow-y-auto px-3 py-3">
              <div className="space-y-4">
                <section className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-3.5 shadow-editorial-soft">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                    Explore Nexus
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {DIRECTORY_LINKS.map((item) => {
                      const Icon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "rounded-[16px] border border-[rgba(44,49,59,0.08)] px-3 py-2.5 transition-all duration-200",
                            isDirectoryActive(pathname, item.href)
                              ? "bg-editorial-green text-white shadow-sm"
                              : "bg-white/84 text-editorial-ink"
                          )}
                        >
                          <div className="flex items-center gap-2 text-[13px] font-medium">
                            <Icon className="h-3.5 w-3.5" />
                            {item.label}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  <div className="mt-3">
                    <CommandPalette
                      items={browseItems}
                      onBeforeOpen={closeMobileMenu}
                      triggerLabel="Jump to anything"
                      className="w-full justify-between"
                    />
                  </div>
                </section>

                {currentContext ? (
                  <section className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-3.5 shadow-editorial-soft">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                      Current surface
                    </p>
                    <p className="mt-2 font-serif text-[1.6rem] font-semibold leading-tight text-editorial-ink">
                      {"name" in (currentEntity ?? {}) ? currentEntity?.name : "Context"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {primaryNavSections.map((item) => {
                        const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

                        return (
                          <Link
                            key={item.segment}
                            href={sectionHref(item.segment)}
                            onClick={closeMobileMenu}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-all duration-200",
                              isSectionActive(item.segment)
                                ? "border-transparent bg-editorial-green text-white"
                                : "border-[rgba(44,49,59,0.08)] bg-white/84 text-editorial-ink"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                      {overflowNavSections.map((item) => {
                        const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

                        return (
                          <Link
                            key={item.segment}
                            href={sectionHref(item.segment)}
                            onClick={closeMobileMenu}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-all duration-200",
                              isSectionActive(item.segment)
                                ? "border-transparent bg-editorial-green text-white"
                                : "border-[rgba(44,49,59,0.08)] bg-white/84 text-editorial-ink"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                ) : null}

                <section className="grid gap-4">
                  {[
                    { label: "Subjects", items: quickSubjects, basePath: "" },
                    { label: "Roles", items: quickRoles, basePath: "/roles" },
                    { label: "Topics", items: quickTopics, basePath: "/topics" },
                  ].map((section) => (
                    <div
                      key={section.label}
                      className="rounded-[20px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-3.5 shadow-editorial-soft"
                    >
                      <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                        {section.label}
                      </p>
                      <div className="mt-2.5 space-y-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`${section.basePath}/${item.slug}`.replace("//", "/")}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-[16px] border border-[rgba(44,49,59,0.08)] bg-white/84 px-3 py-2.5 transition-all duration-200"
                          >
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
                              style={{
                                backgroundColor: `${item.color}16`,
                                color: item.color,
                              }}
                            >
                              <BrowseEntityIcon iconName={item.icon} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-editorial-ink">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-[11px] leading-[1.45] text-editorial-muted">
                                {item.tagline}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  )
}
