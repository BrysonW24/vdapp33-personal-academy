"use client"

import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  polarPosition,
  withResolvedConnections,
  withResolvedNodes,
  type HeroSceneConnection,
  type HeroSceneNode,
} from "./hero-utils"

export interface HeroSceneProps {
  title: string
  caption?: string
  nodes: HeroSceneNode[]
  connections?: HeroSceneConnection[]
  className?: string
  radius?: number
  centerLabel?: string
  centerCaption?: string
}

function Particle({
  x1,
  y1,
  x2,
  y2,
  delay,
  color,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  delay: number
  color: string
}) {
  return (
    <motion.circle
      r={2.5}
      fill={color}
      fillOpacity={0.48}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx: [x1, x2],
        cy: [y1, y2],
        opacity: [0, 0.9, 0],
      }}
      transition={{
        duration: 3.2,
        delay,
        repeat: Infinity,
        repeatDelay: 2.4,
        ease: "easeInOut",
      }}
    />
  )
}

export function HeroScene({
  title,
  caption,
  nodes,
  connections,
  className,
  radius = 148,
  centerLabel,
  centerCaption,
}: HeroSceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const resolvedNodes = useMemo(() => withResolvedNodes(nodes), [nodes])
  const resolvedConnections = useMemo(
    () => withResolvedConnections(nodes, connections),
    [connections, nodes]
  )

  const centerX = 220
  const centerY = 220
  const label = centerLabel ?? title
  const labelParts = label.split(" ")
  const primaryLabel = labelParts.slice(0, 2).join(" ")
  const secondaryLabel =
    centerCaption ??
    (labelParts.length > 2 ? labelParts.slice(2).join(" ") : caption ?? "Atlas")

  return (
    <div
      className={cn(
        "academy-hero-shell relative aspect-square w-full max-w-[460px] overflow-hidden rounded-[32px] border border-[rgba(44,49,59,0.08)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(250,245,235,0.86)_55%,_rgba(236,228,214,0.9))] p-4 shadow-editorial",
        className
      )}
    >
      <div className="academy-hero-grid absolute inset-0 rounded-[32px]" />
      <svg
        viewBox="0 0 440 440"
        className="relative z-[1] h-full w-full"
        style={{ filter: "drop-shadow(0 20px 40px rgba(87,73,47,0.08))" }}
      >
        <defs>
          <radialGradient id="academyHeroCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#386a58" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#386a58" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          cx={centerX}
          cy={centerY}
          r={204}
          fill="url(#academyHeroCenterGlow)"
          initial={{ scale: 0.92, opacity: 0.1 }}
          animate={{ scale: [0.98, 1.05, 0.98], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {[94, radius, 194].map((ringRadius, index) => (
          <motion.circle
            key={ringRadius}
            cx={centerX}
            cy={centerY}
            r={ringRadius}
            fill="none"
            stroke="rgba(44,49,59,0.07)"
            strokeWidth={1}
            strokeDasharray="4 9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 + index * 0.15 }}
          />
        ))}

        {resolvedConnections.map((connection, index) => {
          const fromNode = resolvedNodes[connection.from]
          const toNode = resolvedNodes[connection.to]

          if (!fromNode || !toNode) {
            return null
          }

          const from = polarPosition(fromNode.angle, radius, centerX, centerY)
          const to = polarPosition(toNode.angle, radius, centerX, centerY)
          const isHighlighted =
            hoveredIndex === connection.from || hoveredIndex === connection.to

          return (
            <g key={`${connection.from}-${connection.to}`}>
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? fromNode.color : "rgba(44,49,59,0.08)"}
                strokeWidth={isHighlighted ? 2 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.35 + index * 0.06 }}
              />
              <Particle
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                delay={0.9 + index * 0.45}
                color={fromNode.color}
              />
            </g>
          )
        })}

        <motion.circle
          cx={centerX}
          cy={centerY}
          r={44}
          fill="white"
          stroke="rgba(44,49,59,0.08)"
          strokeWidth={1}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 190 }}
        />
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={37}
          fill="#386a58"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, type: "spring" }}
        />
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={44}
          fill="none"
          stroke="#386a58"
          strokeWidth={2}
          animate={{ r: [44, 58, 44], opacity: [0.44, 0, 0.44] }}
          transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
        />
        <text
          x={centerX}
          y={centerY - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          fontFamily="Iowan Old Style, Georgia, serif"
        >
          {primaryLabel}
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.72)"
          fontSize="7.4"
          fontWeight="500"
        >
          {secondaryLabel}
        </text>

        {resolvedNodes.map((node, index) => {
          const position = polarPosition(node.angle, radius, centerX, centerY)
          const isHovered = hoveredIndex === index

          return (
            <motion.g
              key={node.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.55,
                delay: 0.25 + index * 0.08,
                type: "spring",
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              <motion.g
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3.8 + index * 0.28,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r={isHovered ? 38 : 32}
                  fill={node.softColor}
                  stroke={node.color}
                  strokeOpacity={isHovered ? 0.52 : 0.22}
                  strokeWidth={isHovered ? 2 : 1}
                  transition={{ duration: 0.2 }}
                />
                <circle cx={position.x} cy={position.y} r={4.3} fill={node.color} fillOpacity={0.45} />
                <text
                  x={position.x}
                  y={position.y - 7}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={node.color}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="Iowan Old Style, Georgia, serif"
                >
                  {node.label}
                </text>
                <text
                  x={position.x}
                  y={position.y + 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={node.color}
                  fontSize="6.8"
                  fontWeight="500"
                  fillOpacity={0.76}
                >
                  {node.description}
                </text>
              </motion.g>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
