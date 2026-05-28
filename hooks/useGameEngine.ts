'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { GameState, Lane, Direction } from '@/types/game'
import { moveLane, spawnPoop, updatePoops, checkCollision, getDifficulty } from '@/lib/game-engine'
import { getBestScore, setBestScore, isNewRecord } from '@/lib/best-score-store'

const INITIAL_STATE = (): GameState => ({
  phase: 'idle',
  lane: 3,
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
  const lastSpawnRef = useRef<number>(0)
  const animTickRef = useRef<number>(0)

  // Store mutable game state in ref to avoid closure stale reads inside RAF
  const stateRef = useRef<GameState>(state)
  stateRef.current = state

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const tick = useCallback((timestamp: number) => {
    const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0
    lastTimeRef.current = timestamp

    const current = stateRef.current
    if (current.phase !== 'playing') return

    const newElapsed = current.elapsedMs + delta * 1000
    const difficulty = getDifficulty(newElapsed)

    // Spawn poop
    let newPoops = updatePoops(current.poops, delta)
    const timeSinceSpawn = timestamp - lastSpawnRef.current
    if (
      timeSinceSpawn >= difficulty.spawnInterval &&
      newPoops.length < difficulty.maxPoops
    ) {
      const randomLane = (Math.floor(Math.random() * 5) + 1) as Lane
      newPoops = [...newPoops, spawnPoop(randomLane, difficulty.speed)]
      lastSpawnRef.current = timestamp
    }

    // Check collision
    const hit = newPoops.some(p => checkCollision(p, current.lane))
    if (hit) {
      const newRecord = isNewRecord(newElapsed)
      if (newRecord) setBestScore(newElapsed)
      setState(prev => ({
        ...prev,
        phase: 'gameover',
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
      elapsedMs: newElapsed,
      poops: newPoops,
    }))

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const startGame = useCallback(() => {
    stopLoop()
    lastTimeRef.current = 0
    lastSpawnRef.current = 0
    animTickRef.current = 0
    setState(prev => ({
      ...INITIAL_STATE(),
      bestScore: prev.bestScore,
      phase: 'playing',
    }))
    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop, tick])

  const resetGame = useCallback(() => {
    startGame()
  }, [startGame])

  const move = useCallback((direction: Direction) => {
    if (stateRef.current.phase !== 'playing') return
    setState(prev => ({
      ...prev,
      lane: moveLane(prev.lane, direction),
    }))
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

  return { state, animFrame, startGame, resetGame, moveLeft, moveRight }
}
