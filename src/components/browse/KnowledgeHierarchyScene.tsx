"use client"

import { Html, Line } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Group } from "three"
import { cn } from "@/lib/utils"

type HierarchyLayer = "subject" | "topic" | "role"

type HierarchyNode = {
  label: string
  detail: string
  color: string
}

const LAYERS: Array<{
  kind: HierarchyLayer
  label: string
  description: string
  color: string
  radius: number
  z: number
  speed: number
  nodes: HierarchyNode[]
}> = [
  {
    kind: "subject",
    label: "Subjects",
    description: "Disciplined depth",
    color: "#2C6AA0",
    radius: 1.95,
    z: -0.55,
    speed: 0.1,
    nodes: [
      { label: "Physics", detail: "Reality", color: "#2C6AA0" },
      { label: "Biology", detail: "Life", color: "#2F855A" },
      { label: "Politics", detail: "Power", color: "#9B4D3A" },
      { label: "Software", detail: "Built systems", color: "#6C63FF" },
      { label: "Law", detail: "Institutions", color: "#D38A5C" },
      { label: "Design", detail: "Culture", color: "#E35D9C" },
    ],
  },
  {
    kind: "topic",
    label: "Topics",
    description: "Cross-domain lenses",
    color: "#8A63D2",
    radius: 3.1,
    z: 0,
    speed: -0.07,
    nodes: [
      { label: "Power", detail: "Civilization lens", color: "#8A63D2" },
      { label: "Health", detail: "Human lens", color: "#DA8E32" },
      { label: "Truth", detail: "Knowledge lens", color: "#4A90E2" },
      { label: "Deep Time", detail: "Scale lens", color: "#4D8A77" },
      { label: "Economics", detail: "Incentive lens", color: "#C56C5C" },
      { label: "Meaning", detail: "Inner lens", color: "#A35AD4" },
    ],
  },
  {
    kind: "role",
    label: "Roles",
    description: "Embodied intelligence",
    color: "#F59E0B",
    radius: 4.2,
    z: 0.65,
    speed: 0.05,
    nodes: [
      { label: "Astronaut", detail: "Applied frontier", color: "#F59E0B" },
      { label: "Diplomat", detail: "Applied civilization", color: "#F97316" },
      { label: "Founder", detail: "Applied markets", color: "#F43F5E" },
      { label: "AI Researcher", detail: "Applied frontier", color: "#FB7185" },
      { label: "Pilot", detail: "Applied systems", color: "#FDBA74" },
      { label: "Analyst", detail: "Applied judgment", color: "#FBBF24" },
    ],
  },
]

function ringPoint(radius: number, index: number, total: number, z = 0) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, z] as [number, number, number]
}

function HierarchyOrbitalSystem() {
  const groupRef = useRef<Group | null>(null)
  const layerRefs = useRef<Array<Group | null>>([])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.02
    }

    layerRefs.current.forEach((layer, index) => {
      if (!layer) return
      layer.rotation.z += delta * LAYERS[index].speed
    })
  })

  const connectorPoints = useMemo(() => {
    const core: [number, number, number] = [0, 0, 0]
    return LAYERS.flatMap((layer) =>
      layer.nodes.slice(0, 3).map((_, index) => [core, ringPoint(layer.radius, index, layer.nodes.length, layer.z)] as const)
    )
  }, [])

  return (
    <group ref={groupRef}>
      {connectorPoints.map(([from, to], index) => (
        <Line
          key={`connector-${index}`}
          points={[from, to]}
          color="rgba(44,49,59,0.18)"
          lineWidth={0.9}
          transparent
          opacity={0.35}
        />
      ))}

      {[2.2, 3.35, 4.45].map((radius, index) => (
        <mesh key={radius} position={[0, 0, -0.85 + index * 0.42]}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
          <meshBasicMaterial
            color={LAYERS[index].color}
            transparent
            opacity={0.12}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, -0.05]}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshStandardMaterial color="#1F2937" emissive="#2C6AA0" emissiveIntensity={0.22} roughness={0.28} />
      </mesh>

      <Html center position={[0, 0, 0.92]}>
        <div className="pointer-events-none rounded-full border border-white/40 bg-[rgba(255,255,255,0.92)] px-4 py-2 text-center shadow-[0_18px_55px_rgba(44,49,59,0.16)]">
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Nexus
          </p>
          <p className="font-serif text-base font-semibold text-editorial-ink">
            One map
          </p>
        </div>
      </Html>

      {LAYERS.map((layer, layerIndex) => (
        <group
          key={layer.kind}
          ref={(node) => {
            layerRefs.current[layerIndex] = node
          }}
        >
          {layer.nodes.map((node, nodeIndex) => {
            const position = ringPoint(layer.radius, nodeIndex, layer.nodes.length, layer.z)

            return (
              <group key={`${layer.kind}-${node.label}`} position={position}>
                <mesh>
                  <sphereGeometry args={[0.24, 30, 30]} />
                  <meshStandardMaterial
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={0.18}
                    roughness={0.32}
                    metalness={0.12}
                  />
                </mesh>
                <Html center position={[0, 0.48, 0]}>
                  <div className="pointer-events-none rounded-[16px] border border-white/50 bg-[rgba(255,255,255,0.92)] px-3 py-2 text-center shadow-[0_18px_55px_rgba(44,49,59,0.14)]">
                    <p className="font-medium text-editorial-ink">{node.label}</p>
                    <p className="text-[11px] text-editorial-muted">{node.detail}</p>
                  </div>
                </Html>
              </group>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function KnowledgeHierarchyFallback() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[rgba(44,49,59,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,239,0.94))] p-5 shadow-editorial-soft">
      <div className="pointer-events-none absolute bottom-6 left-9 top-12 w-px bg-[linear-gradient(180deg,rgba(44,49,59,0.08),rgba(44,49,59,0.22),rgba(44,49,59,0.08))]" />

      <div className="space-y-4 pl-6">
        {LAYERS.map((layer, index) => (
          <div key={layer.kind} className="relative">
            <span
              className="absolute -left-[1.7rem] top-4 h-3.5 w-3.5 rounded-full border-4 border-[rgba(255,255,255,0.98)]"
              style={{ backgroundColor: layer.color }}
            />
            <div className="rounded-[20px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                    {layer.label}
                  </p>
                  <h3 className="mt-1 font-serif text-[1.35rem] font-semibold leading-tight text-editorial-ink">
                    {layer.description}
                  </h3>
                </div>
                <span
                  className="mt-1 h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {layer.nodes.map((node) => (
                  <span
                    key={node.label}
                    className="rounded-full border border-[rgba(44,49,59,0.1)] bg-[rgba(255,252,247,0.96)] px-3 py-1.5 text-xs font-medium text-editorial-ink"
                  >
                    {node.label}
                  </span>
                ))}
              </div>

              {index < LAYERS.length - 1 ? (
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-editorial-muted">
                  Feeds into the next layer
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KnowledgeHierarchyScene({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  if (!mounted || isMobile) {
    return (
      <div
        className={cn(
          "academy-hero-shell rounded-[28px] border border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.92)] p-5 shadow-editorial-soft sm:p-6",
          className
        )}
      >
        <KnowledgeHierarchyFallback />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "academy-hero-shell overflow-hidden rounded-[32px] border border-[rgba(44,49,59,0.12)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.97),_rgba(248,243,234,0.95)_60%,_rgba(236,228,214,0.94))] shadow-editorial-soft",
        className
      )}
    >
      <div className="academy-hero-grid absolute inset-0" />
      <div className="relative h-[500px] w-full">
        <Canvas camera={{ position: [0, 0, 11], fov: 40 }}>
          <ambientLight intensity={0.9} />
          <pointLight position={[3, 5, 8]} intensity={18} color="#ffffff" />
          <pointLight position={[-6, -4, 6]} intensity={12} color="#8A63D2" />
          <HierarchyOrbitalSystem />
        </Canvas>
      </div>
    </div>
  )
}
