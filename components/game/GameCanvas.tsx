'use client'

import { useRef, useEffect } from 'react'
import type { GameState } from '@/types/game'
import { drawBackground, drawCharacter, drawPoop, CHAR_HEIGHT } from '@/lib/pixel-art'
import { CANVAS_W, CANVAS_H } from '@/lib/game-engine'

interface Props {
  state: GameState
  animFrame: number
}

export function GameCanvas({ state, animFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    drawBackground(ctx, CANVAS_W, CANVAS_H)

    for (const poop of state.poops) {
      const py = poop.y * CANVAS_H
      drawPoop(ctx, poop.x, py, poop.size)
    }

    const cy = CANVAS_H - CHAR_HEIGHT - 8
    drawCharacter(ctx, state.characterX, cy, animFrame)
  }, [state, animFrame])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="block mx-auto"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
