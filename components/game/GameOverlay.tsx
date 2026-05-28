'use client'

import { PixelButton } from './PixelButton'
import type { GamePhase } from '@/types/game'

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

// Pixel English font (Press Start 2P) + Korean game font (Jua)
const fontEn = 'var(--font-pixel-en)'
const fontKo = 'var(--font-pixel-ko)'

export function GameOverlay({ phase, elapsedMs, bestScore, isNewRecord, onStart, onRestart }: Props) {
  if (phase === 'playing') return null

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(1px)' }}
    >
      {phase === 'idle' && (
        <>
          <div className="text-center">
            <h1
              className="text-5xl text-white leading-none"
              style={{
                fontFamily: fontKo,
                letterSpacing: '0.1em',
                textShadow: '4px 4px 0 rgba(247,200,80,0.4), 8px 8px 0 rgba(0,0,0,0.6)',
              }}
            >
              똥피하기
            </h1>
            <p
              className="text-[10px] tracking-[0.5em] text-white/40 mt-4"
              style={{ fontFamily: fontEn }}
            >
              POOP DODGE
            </p>
          </div>

          {bestScore > 0 && (
            <div className="flex items-center gap-3" style={{ fontFamily: fontKo }}>
              <span className="text-sm text-white/50 tracking-wider">최고기록</span>
              <span className="text-xl text-yellow-300/90">{formatTime(bestScore)}</span>
            </div>
          )}

          <PixelButton onClick={onStart} variant="filled">
            <span style={{ fontFamily: fontKo, letterSpacing: '0.2em' }}>시 작</span>
          </PixelButton>

          <p
            className="text-[9px] text-white/30 tracking-[0.3em] mt-2"
            style={{ fontFamily: fontEn }}
          >
            ← → KEY / TAP
          </p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          {/* Huge GAME OVER — pixel font with offset shadow */}
          <h2
            className="text-white leading-none"
            style={{
              fontFamily: fontEn,
              fontSize: 'clamp(28px, 8vw, 52px)',
              letterSpacing: '0.05em',
              textShadow: '4px 4px 0 #d93030, 8px 8px 0 rgba(0,0,0,0.7)',
            }}
          >
            GAME OVER
          </h2>

          {isNewRecord && (
            <p
              className="text-yellow-300"
              style={{
                fontFamily: fontEn,
                fontSize: '11px',
                letterSpacing: '0.4em',
                textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              ★ NEW RECORD ★
            </p>
          )}

          {/* Score display — pixel number with shadow */}
          <div className="flex items-baseline gap-2">
            <span
              className="text-white tabular-nums leading-none"
              style={{
                fontFamily: fontEn,
                fontSize: 'clamp(40px, 12vw, 72px)',
                textShadow: '4px 4px 0 rgba(0,0,0,0.7)',
              }}
            >
              {(elapsedMs / 1000).toFixed(2)}
            </span>
            <span
              className="text-white/60"
              style={{
                fontFamily: fontEn,
                fontSize: 'clamp(14px, 3vw, 20px)',
                textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
              }}
            >
              s
            </span>
          </div>

          {/* Best score below */}
          <div className="flex items-center gap-3" style={{ fontFamily: fontKo }}>
            <span className="text-xs text-white/40 tracking-wider">
              {isNewRecord ? '✨ 새 최고기록' : '최고기록'}
            </span>
            <span
              className={isNewRecord ? 'text-yellow-300 text-base' : 'text-white/70 text-base'}
              style={{ fontFamily: fontEn, fontSize: '14px' }}
            >
              {(bestScore / 1000).toFixed(2)}
            </span>
          </div>

          <PixelButton onClick={onRestart} variant="outline">
            <span style={{ fontFamily: fontKo, letterSpacing: '0.15em' }}>다시 시작</span>
          </PixelButton>
        </>
      )}
    </div>
  )
}
