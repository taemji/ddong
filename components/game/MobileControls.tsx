'use client'

import type { GamePhase } from '@/types/game'

interface Props {
  phase: GamePhase
  onLeftDown: () => void
  onLeftUp: () => void
  onRightDown: () => void
  onRightUp: () => void
}

const pixelBtnStyle = {
  boxShadow: '3px 3px 0 rgba(255,255,255,0.18)',
}

export function MobileControls({ phase, onLeftDown, onLeftUp, onRightDown, onRightUp }: Props) {
  if (phase !== 'playing') return null

  const handleDown = (fn: () => void) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'translate(3px, 3px)'
    fn()
  }
  const handleUp = (fn: () => void) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = pixelBtnStyle.boxShadow
    e.currentTarget.style.transform = ''
    fn()
  }

  return (
    <div className="flex gap-4 mt-4 w-80">
      {([
        { label: '←', ariaLabel: '왼쪽으로 이동', down: onLeftDown, up: onLeftUp },
        { label: '→', ariaLabel: '오른쪽으로 이동', down: onRightDown, up: onRightUp },
      ] as const).map(({ label, ariaLabel, down, up }) => (
        <button
          key={label}
          aria-label={ariaLabel}
          className="flex-1 h-14 text-2xl font-mono font-bold text-white/80 border-2 border-white/40 bg-transparent select-none"
          style={pixelBtnStyle}
          onPointerDown={handleDown(down)}
          onPointerUp={handleUp(up)}
          onPointerLeave={handleUp(up)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
