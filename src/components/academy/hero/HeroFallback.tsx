"use client"

import { cn } from "@/lib/utils"
import {
  polarPosition,
  withResolvedConnections,
  withResolvedNodes,
  type HeroSceneConnection,
  type HeroSceneNode,
} from "./hero-utils"

export interface HeroFallbackProps {
  title: string
  caption?: string
  nodes: HeroSceneNode[]
  connections?: HeroSceneConnection[]
  className?: string
  radius?: number
}

export function HeroFallback({
  title,
  caption,
  nodes,
  connections,
  className,
  radius = 130,
}: HeroFallbackProps) {
  const resolvedNodes = withResolvedNodes(nodes)
  const resolvedConnections = withResolvedConnections(nodes, connections)
  const centerX = 200
  const centerY = 200
  const centerParts = title.split(" ")

  return (
    <div
      className={cn(
        "academy-hero-shell relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[32px] border border-[rgba(44,49,59,0.08)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_rgba(248,243,234,0.88)_60%,_rgba(237,229,215,0.9))] p-5 shadow-editorial-soft",
        className
      )}
    >
      <div className="academy-hero-grid absolute inset-0 rounded-[32px]" />
      <svg
        viewBox="0 0 400 400"
        className="relative z-[1] h-full w-full max-w-[400px] max-h-[400px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="academyHeroFallbackGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#386a58" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#386a58" stopOpacity="0" />
          </radialGradient>
          {resolvedNodes.map((node) => (
            <radialGradient
              key={`glow-${node.label}`}
              id={`glow-${node.label.replace(/\s+/g, "-").toLowerCase()}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={node.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={node.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <circle cx={centerX} cy={centerY} r={82} fill="url(#academyHeroFallbackGlow)">
          <animate attributeName="r" values="76;86;76" dur="4.8s" repeatCount="indefinite" />
        </circle>

        {resolvedConnections.map((connection, index) => {
          const fromNode = resolvedNodes[connection.from]
          const toNode = resolvedNodes[connection.to]

          if (!fromNode || !toNode) {
            return null
          }

          const from = polarPosition(fromNode.angle, radius, centerX, centerY)
          const to = polarPosition(toNode.angle, radius, centerX, centerY)

          return (
            <line
              key={`${connection.from}-${connection.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={fromNode.color}
              strokeWidth="1.5"
              strokeOpacity="0.18"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.1;0.34;0.1"
                dur="3.8s"
                repeatCount="indefinite"
                begin={`${index * 0.35}s`}
              />
            </line>
          )
        })}

        <circle cx={centerX} cy={centerY} r={36} fill="#386a58" opacity="0.92">
          <animate attributeName="r" values="34;38;34" dur="4.4s" repeatCount="indefinite" />
        </circle>

        <text
          x={centerX}
          y={centerY - 3}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="10.5"
          fontWeight="700"
          fontFamily="Iowan Old Style, Georgia, serif"
        >
          {centerParts.slice(0, 2).join(" ")}
        </text>

        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.68)"
          fontSize="7"
          fontWeight="500"
        >
          {caption ?? "Systems view"}
        </text>

        {resolvedNodes.map((node, index) => {
          const position = polarPosition(node.angle, radius, centerX, centerY)
          const gradientId = `glow-${node.label.replace(/\s+/g, "-").toLowerCase()}`

          return (
            <g key={node.label}>
              <circle cx={position.x} cy={position.y} r={40} fill={`url(#${gradientId})`}>
                <animate
                  attributeName="r"
                  values="35;44;35"
                  dur="3.6s"
                  repeatCount="indefinite"
                  begin={`${index * 0.28}s`}
                />
              </circle>
              <circle cx={position.x} cy={position.y} r={24} fill={node.color} fillOpacity="0.88">
                <animate
                  attributeName="fill-opacity"
                  values="0.78;0.95;0.78"
                  dur="3.4s"
                  repeatCount="indefinite"
                  begin={`${index * 0.25}s`}
                />
              </circle>
              <text
                x={position.x}
                y={position.y - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="7.8"
                fontWeight="600"
                fontFamily="Iowan Old Style, Georgia, serif"
              >
                {node.label}
              </text>
              <text
                x={position.x}
                y={position.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.72)"
                fontSize="5.5"
                fontWeight="500"
              >
                {node.description}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
