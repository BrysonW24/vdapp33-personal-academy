"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface ConceptMapNode {
  id: string
  label: string
  color: string
  bgColor: string
  description: string
  /** Extended details shown in the detail panel */
  details?: string
  connections: string[]
  href?: string
  /** Override auto-layout position (degrees, 0 = right, 90 = top) */
  angle?: number
}

export interface ConceptMapProps {
  nodes: ConceptMapNode[]
  centerLabel: string
  centerSublabel?: string
  centerColor?: string
  /** SVG coordinate radius for node placement. Default 34. */
  radius?: number
  className?: string
  onNodeClick?: (nodeId: string) => void
}

function getNodePosition(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: 50 + Math.cos(radians) * radius,
    y: 50 - Math.sin(radians) * radius,
  }
}

export function ConceptMap({
  nodes,
  centerLabel,
  centerSublabel,
  centerColor = "#386a58",
  radius = 34,
  className,
  onNodeClick,
}: ConceptMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const handleHover = useCallback((id: string | null) => setHoveredNode(id), [])
  const handleClick = useCallback(
    (id: string) => {
      setActiveNode((prev) => (prev === id ? null : id))
      onNodeClick?.(id)
    },
    [onNodeClick]
  )
  const handleClose = useCallback(() => setActiveNode(null), [])

  // Assign angles evenly if not provided
  const angleStep = 360 / Math.max(nodes.length, 1)
  const positionedNodes = nodes.map((node, index) => ({
    ...node,
    resolvedAngle: node.angle ?? 90 - angleStep * index,
  }))

  const activeData = positionedNodes.find((n) => n.id === activeNode)

  return (
    <div className={className}>
      {/* Interactive SVG Map */}
      <div className="relative mx-auto w-full max-w-xl" style={{ aspectRatio: "1/1" }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Connection lines */}
          {positionedNodes.flatMap((node) =>
            node.connections
              .filter((cId) => cId > node.id)
              .map((cId) => {
                const from = getNodePosition(node.resolvedAngle, radius)
                const target = positionedNodes.find((n) => n.id === cId)
                if (!target) return null
                const to = getNodePosition(target.resolvedAngle, radius)

                const isHighlighted =
                  hoveredNode === node.id ||
                  hoveredNode === cId ||
                  activeNode === node.id ||
                  activeNode === cId
                const isConnected =
                  activeNode &&
                  (positionedNodes.find((n) => n.id === activeNode)?.connections.includes(node.id) ||
                    positionedNodes.find((n) => n.id === activeNode)?.connections.includes(cId))
                const isDimmed = activeNode && !isHighlighted && !isConnected

                return (
                  <motion.line
                    key={`${node.id}-${cId}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#c4bfb4"
                    strokeWidth={isHighlighted ? 0.4 : 0.2}
                    strokeDasharray={isHighlighted ? "none" : "0.8 0.8"}
                    opacity={isDimmed ? 0.1 : isHighlighted ? 0.7 : 0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                )
              })
          )}

          {/* Center node */}
          <motion.circle
            cx={50}
            cy={50}
            r={6}
            fill={centerColor}
            stroke="white"
            strokeWidth={0.8}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
          />
          <text
            x={50}
            y={centerSublabel ? 49 : 50.5}
            textAnchor="middle"
            fontSize="2.4"
            fontWeight="700"
            fill="white"
          >
            {centerLabel}
          </text>
          {centerSublabel ? (
            <text
              x={50}
              y={52}
              textAnchor="middle"
              fontSize="1.8"
              fill="rgba(255,255,255,0.7)"
            >
              {centerSublabel}
            </text>
          ) : null}

          {/* Nodes */}
          {positionedNodes.map((node, i) => {
            const pos = getNodePosition(node.resolvedAngle, radius)
            const isActive = activeNode === node.id
            const isHovered = hoveredNode === node.id
            const isConnected =
              activeNode &&
              positionedNodes.find((n) => n.id === activeNode)?.connections.includes(node.id)
            const isDimmed = activeNode && !isActive && !isConnected

            return (
              <g
                key={node.id}
                onMouseEnter={() => handleHover(node.id)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => handleClick(node.id)}
                className="cursor-pointer"
              >
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 7.5 : isHovered ? 7 : 6.5}
                  fill={node.bgColor}
                  stroke={isActive || isHovered ? node.color : "rgba(44,49,59,0.08)"}
                  strokeWidth={isActive ? 0.6 : 0.3}
                  opacity={isDimmed ? 0.3 : 1}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: isDimmed ? 0.3 : 1 }}
                  transition={{
                    type: "spring",
                    delay: 0.15 + i * 0.06,
                    opacity: { duration: 0.2 },
                  }}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y - 1.5}
                  r={1}
                  fill={node.color}
                  opacity={isDimmed ? 0.2 : 0.5}
                />
                <text
                  x={pos.x}
                  y={pos.y + 2.5}
                  textAnchor="middle"
                  fontSize="2.2"
                  fontWeight="600"
                  fill={node.color}
                  opacity={isDimmed ? 0.2 : 1}
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeData ? (
          <motion.div
            key={activeData.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="mx-auto max-w-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-[10px]"
                      style={{ backgroundColor: activeData.bgColor }}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: activeData.color }}
                      />
                    </div>
                    <CardTitle className="text-base">{activeData.label}</CardTitle>
                  </div>
                  <button onClick={handleClose} className="rounded-md p-1 hover:bg-accent">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeData.details ?? activeData.description}
                </p>
                <div>
                  <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Connects to
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeData.connections.map((cId) => {
                      const connected = positionedNodes.find((n) => n.id === cId)
                      return connected ? (
                        <Badge
                          key={cId}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-accent"
                          onClick={() => handleClick(cId)}
                        >
                          {connected.label}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
                {activeData.href ? (
                  <a
                    href={activeData.href}
                    className={cn(
                      "inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-editorial-green px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-editorial-green/20 transition-shadow hover:shadow-xl hover:shadow-editorial-green/30"
                    )}
                  >
                    Explore {activeData.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-xl"
          >
            <Card className="border-dashed bg-editorial-canvas/50">
              <CardContent className="p-5 text-center text-sm text-muted-foreground">
                Click any node to see its details and connections.
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node list */}
      <div className="mx-auto mt-8 max-w-xl space-y-2">
        {positionedNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => handleClick(node.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition-all duration-200",
              activeNode === node.id
                ? "border border-[rgba(44,49,59,0.1)] bg-white/80 shadow-sm"
                : "hover:bg-white/50"
            )}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{ backgroundColor: node.bgColor }}
            >
              <div
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: node.color }}
              />
            </div>
            <div>
              <span className="text-sm font-medium text-editorial-ink">{node.label}</span>
              <p className="mt-0.5 text-xs text-editorial-muted line-clamp-1">
                {node.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
