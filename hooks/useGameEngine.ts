'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { GameState, Lane, Direction } from '@/types/game'
import { moveLane, spawnPoop, updatePoops, checkCollision, getDifficulty } from '@/lib/game-engine'
import { getBestScore, setBestScore, isNewRecord } from '@/lib/best-score-store'

const INITIAL_LANE: Lane = 3

const INITIAL_STATE = (): GameState => ({
  phase: 'idle',
  lane: INITIAL_LANE,
  elapsedMs: 0,
  poops: [],
  bestScore: getBestScore(),
  isNewRecord: false,
})

export function useGameEngine() {
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const [animFrame, setAnimFrame] = useState(0)

  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const lastSpawnRef = useRef<number | null>(null) // null = not yet spawned this session
  const animTickRef = useRef<number>(0)
  const phaseRef = useRef<GameState['phase']>('idle')
  const elapsedRef = useRef<number>(0)
  const poopsRef = useRef<GameState['poops']>([])

  // Separate lane ref so tick always reads the latest value without waiting for setState commit
  const laneRef = useRef<Lane>(INITIAL_LANE)

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const tick = useCallback((timestamp: number) => {
    if (phaseRef.current !== 'playing') return

    const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0
    lastTimeRef.current = timestamp

    const newElapsed = elapsedRef.current + delta * 1000
    elapsedRef.current = newElapsed
    const difficulty = getDifficulty(newElapsed)

    // Spawn poop — delay first spawn by one full interval
    let newPoops = updatePoops(poopsRef.current, delta)
    if (lastSpawnRef.current === null) {
      lastSpawnRef.current = timestamp
    } else {
      const timeSinceSpawn = timestamp - lastSpawnRef.current
      if (timeSinceSpawn >= difficulty.spawnInterval && newPoops.length < difficulty.maxPoops) {
        const randomLane = (Math.floor(Math.random() * 5) + 1) as Lane
        newPoops = [...newPoops, spawnPoop(randomLane, difficulty.speed)]
        lastSpawnRef.current = timestamp
      }
    }
    poopsRef.current = newPoops

    // Collision uses laneRef — always in sync with the latest move()
    const hit = newPoops.some(p => checkCollision(p, laneRef.current))
    if (hit) {
      const newRecord = isNewRecord(newElapsed)
      if (newRecord) setBestScore(newElapsed)
      phaseRef.current = 'gameover'
      setState(prev => ({
        ...prev,
        phase: 'gameover',
        lane: laneRef.current,
        elapsedMs: newElapsed,
        poops: newPoops,
        bestScore: newRecord ? newElapsed : prev.bestScore,
        isNewRecord: newRecord,
      }))
      return
    }

    // Animate character (toggle frame every ~300ms)
    animTickRef.current += delta * 1000
    if (animTickRef.current >= 300) {
      animTickRef.current = 0
      setAnimFrame(f => 1 - f)
    }

    setState(prev => ({
      ...prev,
      lane: laneRef.current,
      elapsedMs: newElapsed,
      poops: newPoops,
    }))

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const startGame = useCallback(() => {
    stopLoop()
    laneRef.current = INITIAL_LANE
    lastTimeRef.current = 0
    lastSpawnRef.current = null
    animTickRef.current = 0
    elapsedRef.current = 0
    poopsRef.current = []
    phaseRef.current = 'playing'
    setState(prev => ({
      ...INITIAL_STATE(),
      bestScore: prev.bestScore,
      phase: 'playing',
    }))
    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop, tick])

  const move = useCallback((direction: Direction) => {
    if (phaseRef.current !== 'playing') return
    const next = moveLane(laneRef.current, direction)
    laneRef.current = next
    setState(prev => ({ ...prev, lane: next }))
  }, [])

  const moveLeft = useCallback(() => move('left'), [move])
  const moveRight = useCallback(() => move('right'), [move])

  // Keyboard handler — stable subscription via ref pattern
  const moveRef = useRef(move)
  useEffect(() => { moveRef.current = move }, [move])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveRef.current('left')
      if (e.key === 'ArrowRight') moveRef.current('right')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => () => stopLoop(), [stopLoop])

  return { state, animFrame, startGame, resetGame: startGame, moveLeft, moveRight }
}
