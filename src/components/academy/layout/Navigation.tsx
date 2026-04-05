"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import {
  BookOpen,
  ChevronDown,
  Clock3,
  Compass,
  FolderKanban,
  GraduationCap,
  Library,
  Map,
  Menu,
  Sparkles,
  Wrench,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getNavSections, resolveNavContext } from "@/lib/entity-nav"
import { SUBJECT_GROUP_LABELS, type SubjectManifest } from "@/types/curriculum"
import type { EntityManifest } from "@/types/entity"

interface NavigationProps {
  subjects: SubjectManifest[]
  roles: EntityManifest[]
  topics: EntityManifest[]
}

const ICONS = {
  BookOpen,
  Clock3,
  Compass,
  FolderKanban,
  Library,
  Map,
  Wrench,
} as const

const DIRECTORY_LINKS = [
  { href: "/", label: "Explore" },
  { href: "/roles", label: "Roles" },
  { href: "/topics", label: "Topics" },
] as const

function isDirectoryActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navigation({ subjects, roles, topics }: NavigationProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)
  const subjectSlugs = useMemo(() => subjects.map((subject) => subject.slug), [subjects])
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
      ? subjects.find((subject) => subject.slug === currentContext.slug) ?? null
      : currentCollection.find((entity) => entity.slug === currentContext?.slug) ?? null

  const groupedSubjects = subjects.reduce<Record<string, SubjectManifest[]>>((acc, subject) => {
    if (!acc[subject.group]) acc[subject.group] = []
    acc[subject.group].push(subject)
    return acc
  }, {})

  const navSections = currentContext ? getNavSections(currentContext.kind) : []

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

  return (
    <header className="fixed left-0 right-0 top-0 z-50 rounded-none border-b border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.95)] backdrop-blur-[16px] shadow-editorial-soft sm:left-[18px] sm:right-[18px] sm:top-[18px] sm:rounded-[18px] sm:border">
      <div className="container flex h-14 items-center justify-between gap-2">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-editorial-blue">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="hidden font-serif text-lg font-semibold text-editorial-ink sm:inline">
            Personal Academy
          </span>
        </Link>

        {currentEntity ? (
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCollectionOpen((open) => !open)}
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

        {currentContext ? (
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navSections.map((item) => {
              const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

              return (
                <Link
                  key={item.segment}
                  href={sectionHref(item.segment)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200",
                    isSectionActive(item.segment)
                      ? "border border-[rgba(44,49,59,0.1)] bg-white/80 text-editorial-ink shadow-sm"
                      : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 lg:flex">
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
        )}

        <button
          className="rounded-[10px] p-2 transition-colors hover:bg-white/50 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <nav className="max-h-[70vh] space-y-0.5 overflow-y-auto border-t border-[rgba(44,49,59,0.08)] p-3 lg:hidden">
          {DIRECTORY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
                isDirectoryActive(pathname, item.href)
                  ? "bg-white/74 text-editorial-ink shadow-sm"
                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
              )}
            >
              {item.href === "/topics" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
              {item.label}
            </Link>
          ))}

          {currentContext ? (
            <>
              <div className="mx-3 my-2 h-px bg-[rgba(44,49,59,0.08)]" />
              <p className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                {"name" in (currentEntity ?? {}) ? currentEntity?.name : "Current"}
              </p>
              {navSections.map((item) => {
                const Icon = ICONS[item.iconName as keyof typeof ICONS] ?? Compass

                return (
                  <Link
                    key={item.segment}
                    href={sectionHref(item.segment)}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
                      isSectionActive(item.segment)
                        ? "bg-white/74 text-editorial-ink shadow-sm"
                        : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </>
          ) : null}

          <div className="mx-3 my-2 h-px bg-[rgba(44,49,59,0.08)]" />
          <p className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Subjects
          </p>
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/${subject.slug}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
                pathname.startsWith(`/${subject.slug}`)
                  ? "bg-white/74 text-editorial-ink shadow-sm"
                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
              )}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              {subject.name}
            </Link>
          ))}

          <div className="mx-3 my-2 h-px bg-[rgba(44,49,59,0.08)]" />
          <p className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Roles
          </p>
          {roles.map((role) => (
            <Link
              key={role.slug}
              href={`/roles/${role.slug}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
                pathname.startsWith(`/roles/${role.slug}`)
                  ? "bg-white/74 text-editorial-ink shadow-sm"
                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
              )}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: role.color }}
              />
              {role.name}
            </Link>
          ))}

          <div className="mx-3 my-2 h-px bg-[rgba(44,49,59,0.08)]" />
          <p className="px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Topics
          </p>
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
                pathname.startsWith(`/topics/${topic.slug}`)
                  ? "bg-white/74 text-editorial-ink shadow-sm"
                  : "text-editorial-muted hover:bg-white/50 hover:text-editorial-ink"
              )}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: topic.color }}
              />
              {topic.name}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
