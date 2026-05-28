import { describe, it, expect } from 'vitest'
import { moveLane, spawnPoop, updatePoops, checkCollision, getDifficulty } from './game-engine'

describe('moveLane', () => {
  it('moves left from center', () => {
    expect(moveLane(3, 'left')).toBe(2)
  })
  it('clamps at left boundary', () => {
    expect(moveLane(1, 'left')).toBe(1)
  })
  it('moves right from center', () => {
    expect(moveLane(3, 'right')).toBe(4)
  })
  it('clamps at right boundary', () => {
    expect(moveLane(5, 'right')).toBe(5)
  })
})

describe('checkCollision', () => {
  it('hits when same lane and y >= threshold', () => {
    expect(checkCollision({ id: '1', lane: 3, y: 0.85, speed: 0.4 }, 3)).toBe(true)
  })
  it('misses when same lane but y below threshold', () => {
    expect(checkCollision({ id: '1', lane: 3, y: 0.5, speed: 0.4 }, 3)).toBe(false)
  })
  it('misses when different lane even if y is high', () => {
    expect(checkCollision({ id: '1', lane: 2, y: 0.9, speed: 0.4 }, 3)).toBe(false)
  })
})

describe('updatePoops', () => {
  it('advances poop y by speed * deltaSeconds', () => {
    const poops = [{ id: '1', lane: 3 as const, y: 0, speed: 0.5 }]
    const updated = updatePoops(poops, 1)
    expect(updated[0].y).toBeCloseTo(0.5)
  })
  it('removes poops that pass y=1', () => {
    const poops = [{ id: '1', lane: 3 as const, y: 0.95, speed: 0.5 }]
    const updated = updatePoops(poops, 1)
    expect(updated).toHaveLength(0)
  })
  it('keeps poops still within bounds', () => {
    const poops = [{ id: '1', lane: 3 as const, y: 0.5, speed: 0.1 }]
    const updated = updatePoops(poops, 0.5)
    expect(updated).toHaveLength(1)
  })
})

describe('spawnPoop', () => {
  it('creates a poop at y=0 with given lane and speed', () => {
    const poop = spawnPoop(2, 0.5)
    expect(poop.lane).toBe(2)
    expect(poop.y).toBe(0)
    expect(poop.speed).toBe(0.5)
    expect(poop.id).toBeTruthy()
  })
})

describe('getDifficulty', () => {
  it('speed increases over time', () => {
    expect(getDifficulty(0).speed).toBeLessThan(getDifficulty(10000).speed)
  })
  it('maxPoops >= 2 after 20 seconds', () => {
    expect(getDifficulty(20000).maxPoops).toBeGreaterThanOrEqual(2)
  })
  it('maxPoops starts at 1', () => {
    expect(getDifficulty(0).maxPoops).toBe(1)
  })
})
