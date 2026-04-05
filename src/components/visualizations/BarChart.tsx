"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface BarChartItem {
  label: string
  value: number
  color: string
}

export interface BarChartProps {
  items: BarChartItem[]
  /** Container height in px. Default 148. */
  height?: number
  className?: string
}

export function BarChart({ items, height = 148, className }: BarChartProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)} style={{ height }}>
      {items.map((item, index) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="text-[10px] font-mono text-editorial-muted">{item.value}</div>
          <div
            className="flex w-full items-end rounded-[18px] bg-[rgba(44,49,59,0.05)] px-2 py-2"
            style={{ height: height - 38 }}
          >
            <motion.div
              className="w-full rounded-[12px]"
              style={{ backgroundColor: item.color }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(0, Math.min(100, item.value))}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            />
          </div>
          <div className="text-center text-[10px] uppercase tracking-[0.14em] text-editorial-muted">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
