'use client'

import { Button } from '@/components/ui/button'
import type { GamePhase } from '@/types/game'
import { cn } from '@/lib/utils'

interface Props {
  phase: GamePhase
  elapsedMs: number
  bestScore: number
  isNewRecord: boolean
  onStart: () => void
  onRestart: () => void
}

function formatTime(ms: number) {
  return (ms / 1000).toFixed(2) + '초'
}

export function GameOverlay({ phase, elapsedMs, bestScore, isNewRecord, onStart, onRestart }: Props) {
  if (phase === 'playing') return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/80">
      {phase === 'idle' && (
        <>
          <h1 className="text-3xl font-bold tracking-widest text-foreground">똥피하기</h1>
          <p className="text-xs tracking-widest text-muted-foreground">POOP DODGE</p>

          <div className="flex items-center justify-between w-48 px-4 py-2 border border-border rounded">
            <span className="text-xs text-muted-foreground tracking-wider">최고기록</span>
            <span className="text-lg font-bold">{formatTime(bestScore)}</span>
          </div>

          <Button onClick={onStart} className="w-48 tracking-widest">
            시 작
          </Button>

          <p className="text-xs text-muted-foreground">PC: ← → 방향키 · 모바일: 하단 버튼</p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          <h2 className="text-2xl font-bold tracking-[0.3em] text-foreground">GAME OVER</h2>

          {isNewRecord && (
            <span className="px-4 py-1 border-2 border-foreground text-sm font-bold tracking-widest">
              ★ 신기록! ★
            </span>
          )}

          <div className="text-center">
            <p className="text-xs text-muted-foreground tracking-wider mb-1">생존 시간</p>
            <p className="text-4xl font-bold tracking-wider">{formatTime(elapsedMs)}</p>
          </div>

          <div className={cn(
            'text-center px-6 py-2 rounded',
            isNewRecord ? 'border-2 border-foreground' : 'border border-border'
          )}>
            <p className="text-xs text-muted-foreground tracking-wider mb-1">
              최고기록{isNewRecord ? ' (갱신됨)' : ''}
            </p>
            <p className="text-xl font-bold">{formatTime(bestScore)}</p>
          </div>

          <Button onClick={onRestart} className="w-48 tracking-widest">
            다시 시작
          </Button>
        </>
      )}
    </div>
  )
}
