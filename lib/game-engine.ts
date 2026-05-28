import type { Lane, Direction, Poop, Difficulty } from '@/types/game'

const COLLISION_Y = 0.75

export function moveLane(current: Lane, direction: Direction): Lane {
  if (direction === 'left') return Math.max(1, current - 1) as Lane
  return Math.min(5, current + 1) as Lane
}

export function spawnPoop(lane: Lane, speed: number): Poop {
  return { id: crypto.randomUUID(), lane, y: 0, speed }
}

export function updatePoops(poops: Poop[], deltaSeconds: number): Poop[] {
  return poops
    .map(p => ({ ...p, y: p.y + p.speed * deltaSeconds }))
    .filter(p => p.y <= 1)
}

export function checkCollision(poop: Poop, characterLane: Lane): boolean {
  return poop.lane === characterLane && poop.y >= COLLISION_Y
}

export function getDifficulty(elapsedMs: number): Difficulty {
  const s = elapsedMs / 1000
  return {
    speed: 0.35 + s * 0.02,
    maxPoops: Math.min(5, Math.floor(1 + s / 10)),
    spawnInterval: Math.max(600, 2000 - s * 60),
  }
}
