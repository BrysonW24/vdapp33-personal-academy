"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Gauge,
  Layers3,
  type LucideIcon,
  Sparkles,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GaugeArc, type GaugeArcProps } from "@/components/visualizations/GaugeArc"
import { BarChart, type BarChartProps } from "@/components/visualizations/BarChart"
import { ProgressRing, type ProgressRingProps } from "@/components/visualizations/ProgressRing"
import { StageRail, type StageRailProps } from "@/components/visualizations/StageRail"
import { ConcentricRings, type ConcentricRingsProps } from "@/components/visualizations/ConcentricRings"

export interface EntitySignalMetric {
  label: string
  value: number
  color?: string
}

export interface EntityReadinessStage {
  label: string
  detail: string
  active?: boolean
}

export interface EntityDependencyNode {
  id: string
  label: string
  shortLabel?: string
  color?: string
  icon?: LucideIcon
  x?: number
  y?: number
}

export interface EntityDependencyConnection {
  from: string
  to: string
}

/* ── Configurable panel system (presentation-layer contracts) ── */

export type SignalPanelType =
  | "gauge"
  | "bar-chart"
  | "progress-ring"
  | "stage-rail"
  | "concentric"
  | "dependency"
  | "metrics"
  | "stat-grid"
  | "readiness"
  | "custom"

export interface SignalPanelBase {
  eyebrow: string
  title: string
  span?: 1 | 2
}

export type SignalPanel =
  | (SignalPanelBase & { type: "gauge"; data: GaugeArcProps })
  | (SignalPanelBase & { type: "bar-chart"; data: BarChartProps })
  | (SignalPanelBase & { type: "progress-ring"; data: ProgressRingProps })
  | (SignalPanelBase & { type: "stage-rail"; data: StageRailProps })
  | (SignalPanelBase & { type: "concentric"; data: ConcentricRingsProps })
  | (SignalPanelBase & { type: "dependency"; data: { title: string; nodes: EntityDependencyNode[]; connections: EntityDependencyConnection[] } })
  | (SignalPanelBase & { type: "metrics"; data: { metrics: EntitySignalMetric[] } })
  | (SignalPanelBase & { type: "stat-grid"; data: { signals: EntitySignalMetric[] } })
  | (SignalPanelBase & { type: "readiness"; data: { stages: EntityReadinessStage[] } })
  | (SignalPanelBase & { type: "custom"; data: { children: React.ReactNode } })

export interface EntitySignalDashboardProps {
  eyebrow?: string
  title: string
  summary: string
  complexityScore: number
  demandMetrics: EntitySignalMetric[]
  operationalSignals: EntitySignalMetric[]
  readinessStages: EntityReadinessStage[]
  dependencyNodes: EntityDependencyNode[]
  dependencyConnections: EntityDependencyConnection[]
  /** When provided, renders a configurable panel grid instead of the fixed layout. */
  panels?: SignalPanel[]
  className?: string
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

function resolvedNodePositions(nodes: EntityDependencyNode[]) {
  const step = 360 / Math.max(nodes.length, 1)

  return nodes.map((node, index) => {
    if (typeof node.x === "number" && typeof node.y === "number") {
      return node
    }

    const position = polarToCartesian(110, 86, 62, step * index - 90)

    return {
      ...node,
      x: position.x,
      y: position.y,
    }
  })
}

function ComplexityGauge({ score }: { score: number }) {
  const startAngle = 150
  const sweep = 240
  const valueAngle = startAngle + (sweep * score) / 100
  const trackPath = describeArc(120, 118, 84, startAngle, startAngle + sweep)
  const valuePath = describeArc(120, 118, 84, startAngle, valueAngle)
  const valuePoint = polarToCartesian(120, 118, 74, valueAngle)

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 240 168" className="w-full max-w-[280px] overflow-visible">
        <defs>
          <linearGradient id="entityComplexityArc" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#2f4f79" />
            <stop offset="55%" stopColor="#386a58" />
            <stop offset="100%" stopColor="#a16a1f" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = startAngle + (sweep * mark) / 100
          const inner = polarToCartesian(120, 118, 91, angle)
          const outer = polarToCartesian(120, 118, 103, angle)
          const label = polarToCartesian(120, 118, 116, angle)

          return (
            <g key={mark}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(44,49,59,0.18)"
                strokeWidth={mark === 0 || mark === 100 ? 2 : 1}
              />
              <text
                x={label.x}
                y={label.y + 3}
                textAnchor="middle"
                fontSize="8"
                fill="rgba(44,49,59,0.55)"
              >
                {mark}
              </text>
            </g>
          )
        })}

        <path
          d={trackPath}
          fill="none"
          stroke="rgba(44,49,59,0.08)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <motion.path
          d={valuePath}
          fill="none"
          stroke="url(#entityComplexityArc)"
          strokeWidth={16}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.line
          x1="120"
          y1="118"
          x2={valuePoint.x}
          y2={valuePoint.y}
          stroke="#161b22"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
        />
        <circle cx="120" cy="118" r="6" fill="#161b22" />
      </svg>

      <div className="absolute inset-x-0 top-[54px] text-center">
        <div className="font-serif text-4xl font-bold leading-none text-editorial-ink">
          {score}
          <span className="ml-1 text-lg text-editorial-muted">/100</span>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
          Complexity Index
        </div>
      </div>
    </div>
  )
}

function DependencySurface({
  title,
  nodes,
  connections,
}: {
  title: string
  nodes: EntityDependencyNode[]
  connections: EntityDependencyConnection[]
}) {
  const positionedNodes = resolvedNodePositions(nodes)
  const nodeLookup = new Map(positionedNodes.map((node) => [node.id, node]))

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 220 172" className="h-[172px] w-full">
        {connections.map((connection) => {
          const from = nodeLookup.get(connection.from)
          const to = nodeLookup.get(connection.to)

          if (!from || !to) {
            return null
          }

          return (
            <line
              key={`${connection.from}-${connection.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(44,49,59,0.12)"
              strokeWidth="1"
            />
          )
        })}

        <circle cx="110" cy="86" r="20" fill="#161b22" />
        <text
          x="110"
          y="83"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="white"
        >
          {title}
        </text>
        <text
          x="110"
          y="95"
          textAnchor="middle"
          fontSize="6"
          fill="rgba(255,255,255,0.68)"
        >
          System
        </text>

        {positionedNodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            {(() => {
              const nodeX = node.x ?? 110
              const nodeY = node.y ?? 86

              return (
                <>
            <circle
              cx={nodeX}
              cy={nodeY}
              r="18"
              fill="white"
              stroke={node.color ?? "#386a58"}
              strokeWidth="1.5"
            />
            <text
              x={nodeX}
              y={nodeY + 1}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              fill={node.color ?? "#386a58"}
            >
              {node.shortLabel ?? node.label}
            </text>
                </>
              )
            })()}
          </motion.g>
        ))}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        {positionedNodes.map((node) => (
          <div
            key={node.id}
            className="rounded-[14px] border border-[rgba(44,49,59,0.08)] bg-white/72 px-3 py-2"
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-editorial-muted">
              Node
            </p>
            <p className="mt-1 text-sm font-medium text-editorial-ink">{node.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MicroPanel({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        "academy-paper-panel h-full rounded-[28px] border border-[rgba(44,49,59,0.08)] p-5 shadow-editorial-soft backdrop-blur-[18px] sm:p-6",
        className
      )}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-serif text-lg font-semibold text-editorial-ink sm:text-xl">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </motion.div>
  )
}

/* ── Panel renderer for configurable mode ── */

function renderPanelContent(panel: SignalPanel) {
  switch (panel.type) {
    case "gauge":
      return <GaugeArc {...panel.data} />
    case "bar-chart":
      return <BarChart {...panel.data} />
    case "progress-ring":
      return <ProgressRing {...panel.data} />
    case "stage-rail":
      return <StageRail {...panel.data} />
    case "concentric":
      return <ConcentricRings {...panel.data} />
    case "dependency":
      return (
        <DependencySurface
          title={panel.data.title}
          nodes={panel.data.nodes}
          connections={panel.data.connections}
        />
      )
    case "metrics":
      return (
        <div className="space-y-3">
          {panel.data.metrics.map((metric) => (
            <div key={metric.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-editorial-muted">
                <span>{metric.label}</span>
                <span>{metric.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[rgba(44,49,59,0.08)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-editorial-blue via-editorial-green to-editorial-amber"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      )
    case "stat-grid":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {panel.data.signals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: signal.color ?? "#386a58" }}
                />
                <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                  {signal.label}
                </p>
              </div>
              <div className="font-serif text-3xl font-semibold text-editorial-ink">
                {signal.value}
                <span className="ml-1 text-sm text-editorial-muted">/100</span>
              </div>
            </div>
          ))}
        </div>
      )
    case "readiness":
      return (
        <div className="space-y-3">
          {panel.data.stages.map((stage, index) => (
            <div key={stage.label} className="flex gap-3">
              <div className="flex w-8 flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full border text-xs font-semibold leading-8 text-center",
                    stage.active
                      ? "border-editorial-green bg-editorial-green text-white"
                      : "border-[rgba(44,49,59,0.12)] bg-white text-editorial-muted"
                  )}
                >
                  {index + 1}
                </div>
                {index < panel.data.stages.length - 1 ? (
                  <div className="mt-2 h-full w-px bg-[rgba(44,49,59,0.1)]" />
                ) : null}
              </div>
              <div className="pb-5">
                <p className="font-medium text-editorial-ink">{stage.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                  {stage.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    case "custom":
      return <>{panel.data.children}</>
  }
}

function ConfigurablePanelGrid({
  eyebrow,
  title,
  summary,
  panels,
  className,
}: {
  eyebrow: string
  title: string
  summary: string
  panels: SignalPanel[]
  className?: string
}) {
  return (
    <section
      className={cn(
        "space-y-6 rounded-[32px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(247,243,234,0.86))] p-6 shadow-editorial",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted">
            {summary}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-editorial-green/15 bg-editorial-green-soft/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-editorial-green">
          <Sparkles className="h-4 w-4" />
          Systems, pressure, and readiness
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {panels.map((panel) => (
          <MicroPanel
            key={`${panel.eyebrow}-${panel.title}`}
            eyebrow={panel.eyebrow}
            title={panel.title}
            className={panel.span === 2 ? "md:col-span-2" : undefined}
          >
            {renderPanelContent(panel)}
          </MicroPanel>
        ))}
      </div>
    </section>
  )
}

/* ── Fixed-layout mode (original, backward compatible) ── */

function FixedLayout({
  eyebrow,
  title,
  summary,
  complexityScore,
  demandMetrics,
  operationalSignals,
  readinessStages,
  dependencyNodes,
  dependencyConnections,
  className,
}: Omit<EntitySignalDashboardProps, "panels">) {
  return (
    <section
      className={cn(
        "space-y-6 rounded-[32px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(247,243,234,0.86))] p-6 shadow-editorial",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-editorial-muted">
            {summary}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-editorial-green/15 bg-editorial-green-soft/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-editorial-green">
          <Sparkles className="h-4 w-4" />
          Systems, pressure, and readiness
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <MicroPanel eyebrow="Complexity" title="How demanding this path is">
          <ComplexityGauge score={complexityScore} />
        </MicroPanel>

        <MicroPanel eyebrow="Human demand" title="What this path asks from you">
          <div className="space-y-3">
            {demandMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-editorial-muted">
                  <span>{metric.label}</span>
                  <span>{metric.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[rgba(44,49,59,0.08)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-editorial-blue via-editorial-green to-editorial-amber"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MicroPanel>

        <MicroPanel eyebrow="Operational stakes" title="Where pressure tends to show up">
          <div className="grid gap-3 sm:grid-cols-2">
            {operationalSignals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: signal.color ?? "#386a58" }}
                  />
                  <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                    {signal.label}
                  </p>
                </div>
                <div className="font-serif text-3xl font-semibold text-editorial-ink">
                  {signal.value}
                  <span className="ml-1 text-sm text-editorial-muted">/100</span>
                </div>
              </div>
            ))}
          </div>
        </MicroPanel>

        <MicroPanel eyebrow="Dependency network" title="How the system fits together">
          <DependencySurface
            title={title.split(" ")[0] ?? title}
            nodes={dependencyNodes}
            connections={dependencyConnections}
          />
        </MicroPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="academy-paper-panel rounded-[28px] border border-[rgba(44,49,59,0.08)] p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-editorial-amber" />
            <p className="text-xs uppercase tracking-[0.18em] text-editorial-muted">
              Readiness curve
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {readinessStages.map((stage, index) => (
              <div key={stage.label} className="flex gap-3">
                <div className="flex w-8 flex-col items-center">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full border text-xs font-semibold leading-8 text-center",
                      stage.active
                        ? "border-editorial-green bg-editorial-green text-white"
                        : "border-[rgba(44,49,59,0.12)] bg-white text-editorial-muted"
                    )}
                  >
                    {index + 1}
                  </div>
                  {index < readinessStages.length - 1 ? (
                    <div className="mt-2 h-full w-px bg-[rgba(44,49,59,0.1)]" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <p className="font-medium text-editorial-ink">{stage.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                    {stage.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="academy-paper-panel rounded-[28px] border border-[rgba(44,49,59,0.08)] p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-editorial-green" />
                <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                  Momentum
                </p>
              </div>
              <p className="font-serif text-3xl font-semibold text-editorial-ink">
                {Math.round(
                  demandMetrics.reduce((total, metric) => total + metric.value, 0) /
                    Math.max(demandMetrics.length, 1)
                )}
              </p>
            </div>

            <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-editorial-blue" />
                <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                  System nodes
                </p>
              </div>
              <p className="font-serif text-3xl font-semibold text-editorial-ink">
                {dependencyNodes.length}
              </p>
            </div>

            <div className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/76 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-editorial-amber" />
                <p className="text-xs uppercase tracking-[0.16em] text-editorial-muted">
                  Active stages
                </p>
              </div>
              <p className="font-serif text-3xl font-semibold text-editorial-ink">
                {readinessStages.filter((stage) => stage.active).length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export function EntitySignalDashboard({
  eyebrow = "Role signal",
  title,
  summary,
  complexityScore,
  demandMetrics,
  operationalSignals,
  readinessStages,
  dependencyNodes,
  dependencyConnections,
  panels,
  className,
}: EntitySignalDashboardProps) {
  if (panels && panels.length > 0) {
    return (
      <ConfigurablePanelGrid
        eyebrow={eyebrow}
        title={title}
        summary={summary}
        panels={panels}
        className={className}
      />
    )
  }

  return (
    <FixedLayout
      eyebrow={eyebrow}
      title={title}
      summary={summary}
      complexityScore={complexityScore}
      demandMetrics={demandMetrics}
      operationalSignals={operationalSignals}
      readinessStages={readinessStages}
      dependencyNodes={dependencyNodes}
      dependencyConnections={dependencyConnections}
      className={className}
    />
  )
}
