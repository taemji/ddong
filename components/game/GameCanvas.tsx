'use client'

import { useRef, useEffect } from 'react'
import type { GameState } from '@/types/game'
import { drawBackground, drawCharacter, drawPoop, drawHUD, CHAR_HEIGHT, POOP_HEIGHT } from '@/lib/pixel-art'
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

    // Draw all falling poops
    for (const poop of state.poops) {
      drawPoop(ctx, poop.x, poop.y * CANVAS_H, poop.size)
    }

    const cy = CANVAS_H - CHAR_HEIGHT - 8
    drawCharacter(ctx, state.characterX, cy, animFrame)

    // Gameover: draw a poop sitting on the character's head
    if (state.phase === 'gameover') {
      const hitSize = 1.3
      const hitPoopH = POOP_HEIGHT * hitSize
      // bottom of hit-poop aligns with top of character head
      drawPoop(ctx, state.characterX, cy - hitPoopH / 2 + 2, hitSize)
    }

    if (state.phase === 'playing') {
      drawHUD(ctx, state.elapsedMs, CANVAS_W)
    }
  }, [state, animFrame])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
