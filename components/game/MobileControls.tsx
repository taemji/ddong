'use client'

import { Button } from '@/components/ui/button'
import type { GamePhase } from '@/types/game'

interface Props {
  phase: GamePhase
  onLeftDown: () => void
  onLeftUp: () => void
  onRightDown: () => void
  onRightUp: () => void
}

export function MobileControls({ phase, onLeftDown, onLeftUp, onRightDown, onRightUp }: Props) {
  if (phase !== 'playing') return null

  return (
    <div className="flex gap-4 mt-4 w-80">
      <Button
        variant="outline"
        className="flex-1 h-14 text-2xl select-none"
        aria-label="왼쪽으로 이동"
        onPointerDown={onLeftDown}
        onPointerUp={onLeftUp}
        onPointerLeave={onLeftUp}
      >
        ←
      </Button>
      <Button
        variant="outline"
        className="flex-1 h-14 text-2xl select-none"
        aria-label="오른쪽으로 이동"
        onPointerDown={onRightDown}
        onPointerUp={onRightUp}
        onPointerLeave={onRightUp}
      >
        →
      </Button>
    </div>
  )
}
