import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-editorial-green/10 text-editorial-green",
        secondary: "border-[rgba(44,49,59,0.08)] bg-white/72 text-editorial-muted",
        outline: "border-[rgba(44,49,59,0.12)] text-editorial-ink",
        beginner: "border-transparent bg-editorial-green-soft text-editorial-green",
        intermediate: "border-transparent bg-editorial-amber-soft text-editorial-amber",
        advanced: "border-transparent bg-editorial-red-soft text-editorial-red",
        "coming-soon": "border-[rgba(44,49,59,0.08)] bg-editorial-canvas text-editorial-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
