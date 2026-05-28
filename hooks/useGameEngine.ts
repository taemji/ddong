'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { GameState } from '@/types/game'
import { moveCharacter, spawnPoop, updatePoops, checkCollision, getDifficulty, CANVAS_W } from '@/lib/game-engine'
import { getBestScore, setBestScore, isNewRecord } from '@/lib/best-score-store'

const INITIAL_X = CANVAS_W / 2

const INITIAL_STATE = (): GameState => ({
  phase: 'idle',
  characterX: INITIAL_X,
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
  const lastSpawnRef = useRef<number | null>(null)
  const animTickRef = useRef<number>(0)

  const phaseRef = useRef<GameState['phase']>('idle')
  const elapsedRef = useRef<number>(0)
  const poopsRef = useRef<GameState['poops']>([])
  const characterXRef = useRef<number>(INITIAL_X)

  // Continuous movement: track which keys/buttons are held
  const leftHeld = useRef(false)
  const rightHeld = useRef(false)

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

    // Smooth character movement from held keys
    let newX = characterXRef.current
    if (leftHeld.current) newX = moveCharacter(newX, 'left', delta)
    if (rightHeld.current) newX = moveCharacter(newX, 'right', delta)
    characterXRef.current = newX

    const newElapsed = elapsedRef.current + delta * 1000
    elapsedRef.current = newElapsed
    const difficulty = getDifficulty(newElapsed)

    // Spawn poop — delay first spawn by one interval
    let newPoops = updatePoops(poopsRef.current, delta)
    if (lastSpawnRef.current === null) {
      lastSpawnRef.current = timestamp
    } else if (
      timestamp - lastSpawnRef.current >= difficulty.spawnInterval &&
      newPoops.length < difficulty.maxPoops
    ) {
      newPoops = [...newPoops, spawnPoop(difficulty.speed)]
      lastSpawnRef.current = timestamp
    }
    poopsRef.current = newPoops

    // Collision check
    const hit = newPoops.some(p => checkCollision(p, newX))
    if (hit) {
      const newRecord = isNewRecord(newElapsed)
      if (newRecord) setBestScore(newElapsed)
      phaseRef.current = 'gameover'
      leftHeld.current = false
      rightHeld.current = false
      setState(prev => ({
        ...prev,
        phase: 'gameover',
        characterX: newX,
        elapsedMs: newElapsed,
        poops: newPoops,
        bestScore: newRecord ? newElapsed : prev.bestScore,
        isNewRecord: newRecord,
      }))
      return
    }

    // Character walk animation
    animTickRef.current += delta * 1000
    if (animTickRef.current >= 300) {
      animTickRef.current = 0
      setAnimFrame(f => 1 - f)
    }

    setState(prev => ({
      ...prev,
      characterX: newX,
      elapsedMs: newElapsed,
      poops: newPoops,
    }))

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const startGame = useCallback(() => {
    stopLoop()
    characterXRef.current = INITIAL_X
    lastTimeRef.current = 0
    lastSpawnRef.current = null
    animTickRef.current = 0
    elapsedRef.current = 0
    poopsRef.current = []
    phaseRef.current = 'playing'
    leftHeld.current = false
    rightHeld.current = false
    setState(prev => ({
      ...INITIAL_STATE(),
      bestScore: prev.bestScore,
      phase: 'playing',
    }))
    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop, tick])

  // Keyboard: keydown/keyup for smooth hold movement
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return
      if (e.key === 'ArrowLeft') leftHeld.current = true
      if (e.key === 'ArrowRight') rightHeld.current = true
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') leftHeld.current = false
      if (e.key === 'ArrowRight') rightHeld.current = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => () => stopLoop(), [stopLoop])

  const holdLeft = useCallback(() => { leftHeld.current = true }, [])
  const releaseLeft = useCallback(() => { leftHeld.current = false }, [])
  const holdRight = useCallback(() => { rightHeld.current = true }, [])
  const releaseRight = useCallback(() => { rightHeld.current = false }, [])

  return { state, animFrame, startGame, resetGame: startGame, holdLeft, releaseLeft, holdRight, releaseRight }
}
