'use client'

import { useRef, useEffect } from 'react'
import type { GameState } from '@/types/game'
import { drawBackground, drawLanes, drawCharacter, drawPoop, CHAR_HEIGHT, POOP_HEIGHT } from '@/lib/pixel-art'

const LANE_COUNT = 5

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

    const w = canvas.width
    const h = canvas.height
    const laneW = w / LANE_COUNT

    ctx.clearRect(0, 0, w, h)
    drawBackground(ctx, w, h)
    drawLanes(ctx, w, h, LANE_COUNT)

    // Draw poops
    for (const poop of state.poops) {
      const px = (poop.lane - 0.5) * laneW
      const py = poop.y * h - POOP_HEIGHT
      drawPoop(ctx, px, py)
    }

    // Draw character
    const cx = (state.lane - 0.5) * laneW
    const cy = h - CHAR_HEIGHT - 8
    drawCharacter(ctx, cx, cy, animFrame)
  }, [state, animFrame])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={480}
      className="block mx-auto"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
