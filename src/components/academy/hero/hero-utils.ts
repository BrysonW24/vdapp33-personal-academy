"use client"

export interface HeroSceneNode {
  label: string
  description: string
  color: string
  softColor?: string
  angle?: number
}

export interface HeroSceneConnection {
  from: number
  to: number
}

export interface ResolvedHeroSceneNode extends HeroSceneNode {
  angle: number
  softColor: string
}

export function polarPosition(
  angle: number,
  radius: number,
  centerX: number,
  centerY: number
) {
  const radians = ((angle - 90) * Math.PI) / 180

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  }
}

export function withResolvedNodes(nodes: HeroSceneNode[]) {
  const fallbackStep = 360 / Math.max(nodes.length, 1)

  return nodes.map((node, index) => ({
    ...node,
    angle: node.angle ?? fallbackStep * index,
    softColor: node.softColor ?? `${node.color}18`,
  })) as ResolvedHeroSceneNode[]
}

export function withResolvedConnections(
  nodes: HeroSceneNode[],
  connections?: HeroSceneConnection[]
) {
  if (connections && connections.length > 0) {
    return connections
  }

  if (nodes.length <= 1) {
    return []
  }

  const ringConnections = nodes.map((_, index) => ({
    from: index,
    to: (index + 1) % nodes.length,
  }))

  const skipConnections =
    nodes.length >= 4
      ? nodes.map((_, index) => ({
          from: index,
          to: (index + 2) % nodes.length,
        }))
      : []

  const deduped = new Map<string, HeroSceneConnection>()

  ;[...ringConnections, ...skipConnections].forEach((connection) => {
    const key =
      connection.from < connection.to
        ? `${connection.from}-${connection.to}`
        : `${connection.to}-${connection.from}`
    deduped.set(key, connection)
  })

  return [...deduped.values()]
}
