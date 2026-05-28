import type { Direction, Poop, Difficulty } from '@/types/game'

export const CANVAS_W = 320
export const CANVAS_H = 480
export const CHAR_SPEED = 260   // px/s
export const CHAR_HALF_W = 8    // half of character pixel width
const COLLISION_Y = 0.78
const POOP_BASE_HALF_W = 18    // half of poop pixel width at size 1.0 (9col × 4scale / 2)

export function moveCharacter(x: number, direction: Direction, deltaSeconds: number): number {
  const moved = direction === 'left'
    ? x - CHAR_SPEED * deltaSeconds
    : x + CHAR_SPEED * deltaSeconds
  return Math.max(CHAR_HALF_W, Math.min(CANVAS_W - CHAR_HALF_W, moved))
}

export function spawnPoop(speed: number): Poop {
  const size = 0.7 + Math.random() * 0.8
  const halfW = POOP_BASE_HALF_W * size
  const x = halfW + Math.random() * (CANVAS_W - halfW * 2)
  return { id: crypto.randomUUID(), x, y: 0, speed, size }
}

export function updatePoops(poops: Poop[], deltaSeconds: number): Poop[] {
  return poops
    .map(p => ({ ...p, y: p.y + p.speed * deltaSeconds }))
    .filter(p => p.y < 1)
}

export function checkCollision(poop: Poop, characterX: number): boolean {
  if (poop.y < COLLISION_Y) return false
  const poopHalfW = POOP_BASE_HALF_W * poop.size
  return Math.abs(poop.x - characterX) < CHAR_HALF_W + poopHalfW
}

export function getDifficulty(elapsedMs: number): Difficulty {
  const s = elapsedMs / 1000
  return {
    speed: 0.55 + s * 0.025,
    maxPoops: Math.min(8, Math.floor(1 + s / 6)),
    spawnInterval: Math.max(400, 1200 - s * 40),
  }
}
