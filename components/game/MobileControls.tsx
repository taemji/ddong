'use client'

import { Button } from '@/components/ui/button'
import type { GamePhase } from '@/types/game'

interface Props {
  phase: GamePhase
  onLeft: () => void
  onRight: () => void
}

export function MobileControls({ phase, onLeft, onRight }: Props) {
  if (phase !== 'playing') return null

  return (
    <div className="flex gap-4 mt-4 w-80">
      <Button
        variant="outline"
        className="flex-1 h-14 text-2xl"
        onPointerDown={onLeft}
      >
        ←
      </Button>
      <Button
        variant="outline"
        className="flex-1 h-14 text-2xl"
        onPointerDown={onRight}
      >
        →
      </Button>
    </div>
  )
}
