"use client"

import { cn } from "@/lib/utils"

type NexusSize = "compact" | "default" | "hero"

interface NexusGlyphProps {
  className?: string
}

interface NexusWordmarkProps extends NexusGlyphProps {
  size?: NexusSize
  showText?: boolean
  textClassName?: string
  dotClassName?: string
}

const SIZE_STYLES: Record<
  NexusSize,
  {
    glyph: string
    text: string
    dot: string
    gap: string
  }
> = {
  compact: {
    glyph: "h-8 w-8",
    text: "text-[1.15rem]",
    dot: "ml-1.5 h-2.5 w-2.5",
    gap: "gap-2",
  },
  default: {
    glyph: "h-10 w-10",
    text: "text-[1.75rem]",
    dot: "ml-2 h-3.5 w-3.5",
    gap: "gap-3",
  },
  hero: {
    glyph: "h-12 w-12 sm:h-16 sm:w-16",
    text: "text-[3.2rem] sm:text-7xl",
    dot: "ml-2 h-4.5 w-4.5 sm:ml-3 sm:h-6 sm:w-6",
    gap: "gap-3 sm:gap-4",
  },
}

export function NexusGlyph({ className }: NexusGlyphProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-[22%]",
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <radialGradient id="nexus-core" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#FFF5D9" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFB347" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#FF7A45" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="24" cy="24" r="10.5" fill="url(#nexus-core)" />

        <path
          d="M13.5 12.8L22 21.4"
          stroke="#1FB9FF"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M13.5 35.2L22 26.6"
          stroke="#0F82FF"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M34.5 12.8L26 21.4"
          stroke="#8B5CF6"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M34.5 35.2L26 26.6"
          stroke="#FF7A45"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        <circle cx="11" cy="11" r="3.5" fill="#1FB9FF" />
        <circle cx="37" cy="11" r="3.5" fill="#FF6A63" />
        <circle cx="11" cy="37" r="3.5" fill="#1492FF" />
        <circle cx="37" cy="37" r="3.5" fill="#FFB347" />
      </svg>
    </span>
  )
}

export function NexusWordmark({
  size = "default",
  showText = true,
  className,
  textClassName,
  dotClassName,
}: NexusWordmarkProps) {
  const styles = SIZE_STYLES[size]

  return (
    <span
      className={cn(
        "inline-flex items-center text-[#1f252d]",
        styles.gap,
        className
      )}
      aria-label="Nexus"
    >
      <NexusGlyph className={styles.glyph} />
      {showText ? (
        <span className="inline-flex items-baseline">
          <span
            className={cn(
              "font-sans font-semibold leading-none tracking-[-0.075em] text-[#1f252d]",
              styles.text,
              textClassName
            )}
          >
            Nexus
          </span>
          <span
            className={cn(
              "inline-block shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE7AB_0%,#FFB347_45%,#FF9147_72%,#E25B2E_100%)] shadow-[0_0_16px_rgba(255,165,71,0.28)]",
              styles.dot,
              dotClassName
            )}
            aria-hidden="true"
          />
        </span>
      ) : null}
    </span>
  )
}
