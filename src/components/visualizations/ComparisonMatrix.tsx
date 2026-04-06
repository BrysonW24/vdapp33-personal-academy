"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ComparisonMatrixCell {
  value: string
  tone?: "neutral" | "positive" | "caution" | "risk"
}

export interface ComparisonMatrixColumn {
  key: string
  label: string
  description?: string
}

export interface ComparisonMatrixRow {
  label: string
  description?: string
  cells: ComparisonMatrixCell[]
}

export interface ComparisonMatrixProps {
  columns: ComparisonMatrixColumn[]
  rows: ComparisonMatrixRow[]
  className?: string
}

const TONE_STYLES: Record<NonNullable<ComparisonMatrixCell["tone"]>, string> = {
  neutral:
    "bg-[rgba(44,49,59,0.06)] text-editorial-ink border-[rgba(44,49,59,0.08)]",
  positive:
    "bg-[rgba(56,106,88,0.12)] text-editorial-green border-[rgba(56,106,88,0.18)]",
  caution:
    "bg-[rgba(161,106,31,0.12)] text-editorial-amber border-[rgba(161,106,31,0.18)]",
  risk:
    "bg-[rgba(161,76,58,0.12)] text-[rgb(127,53,41)] border-[rgba(161,76,58,0.18)]",
}

export function ComparisonMatrix({
  columns,
  rows,
  className,
}: ComparisonMatrixProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] shadow-editorial-soft",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.9)]">
              <th className="min-w-[210px] px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-editorial-muted">
                Comparison lens
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="min-w-[180px] px-4 py-4 text-left align-top"
                >
                  <p className="text-sm font-semibold text-editorial-ink">
                    {column.label}
                  </p>
                  {column.description ? (
                    <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                      {column.description}
                    </p>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <motion.tr
                key={row.label}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: rowIndex * 0.03 }}
                className="border-b border-[rgba(44,49,59,0.06)] last:border-b-0"
              >
                <td className="px-5 py-4 align-top">
                  <p className="text-sm font-semibold text-editorial-ink">{row.label}</p>
                  {row.description ? (
                    <p className="mt-1 text-xs leading-relaxed text-editorial-muted">
                      {row.description}
                    </p>
                  ) : null}
                </td>
                {row.cells.map((cell, cellIndex) => (
                  <td key={`${row.label}-${cellIndex}`} className="px-4 py-4 align-top">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1.5 text-xs font-medium",
                        TONE_STYLES[cell.tone ?? "neutral"]
                      )}
                    >
                      {cell.value}
                    </span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
