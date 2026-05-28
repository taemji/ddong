import { describe, it, expect } from 'vitest'
import {
  moveCharacter, spawnPoop, updatePoops, checkCollision, getDifficulty,
  CANVAS_W, CHAR_HALF_W, CHAR_SPEED,
} from './game-engine'

describe('moveCharacter', () => {
  it('moves left by speed * delta', () => {
    const x = moveCharacter(160, 'left', 0.1)
    expect(x).toBeCloseTo(160 - CHAR_SPEED * 0.1)
  })
  it('moves right by speed * delta', () => {
    const x = moveCharacter(160, 'right', 0.1)
    expect(x).toBeCloseTo(160 + CHAR_SPEED * 0.1)
  })
  it('clamps at left boundary', () => {
    expect(moveCharacter(0, 'left', 1)).toBe(CHAR_HALF_W)
  })
  it('clamps at right boundary', () => {
    expect(moveCharacter(CANVAS_W, 'right', 1)).toBe(CANVAS_W - CHAR_HALF_W)
  })
})

describe('checkCollision', () => {
  it('hits when same X and y above collision zone', () => {
    expect(checkCollision({ id: '1', x: 160, y: 0.85, speed: 0.4, size: 1 }, 160)).toBe(true)
  })
  it('misses when y below collision zone', () => {
    expect(checkCollision({ id: '1', x: 160, y: 0.5, speed: 0.4, size: 1 }, 160)).toBe(false)
  })
  it('misses when X far apart', () => {
    expect(checkCollision({ id: '1', x: 160, y: 0.9, speed: 0.4, size: 1 }, 300)).toBe(false)
  })
  it('hits larger poop at wider X range', () => {
    // size 1.5 → poopHalfW = 18, charHalfW = 8, total = 26
    const hit = checkCollision({ id: '1', x: 160, y: 0.9, speed: 0.4, size: 1.5 }, 180)
    expect(hit).toBe(true)
  })
})

describe('updatePoops', () => {
  it('advances y by speed * delta', () => {
    const poops = [{ id: '1', x: 160, y: 0, speed: 0.5, size: 1 }]
    const updated = updatePoops(poops, 1)
    expect(updated[0].y).toBeCloseTo(0.5)
  })
  it('removes poops past y=1', () => {
    const poops = [{ id: '1', x: 160, y: 0.95, speed: 0.5, size: 1 }]
    expect(updatePoops(poops, 1)).toHaveLength(0)
  })
})

describe('spawnPoop', () => {
  it('spawns within canvas bounds 10 times', () => {
    for (let i = 0; i < 10; i++) {
      const p = spawnPoop(0.5)
      expect(p.x).toBeGreaterThan(0)
      expect(p.x).toBeLessThan(CANVAS_W)
      expect(p.y).toBe(0)
      expect(p.size).toBeGreaterThanOrEqual(0.7)
      expect(p.size).toBeLessThanOrEqual(1.5)
    }
  })
})

describe('getDifficulty', () => {
  it('speed increases over time', () => {
    expect(getDifficulty(0).speed).toBeLessThan(getDifficulty(10000).speed)
  })
  it('maxPoops >= 2 after 20 seconds', () => {
    expect(getDifficulty(20000).maxPoops).toBeGreaterThanOrEqual(2)
  })
  it('maxPoops starts at 2', () => {
    expect(getDifficulty(0).maxPoops).toBe(2)
  })
})
