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

const fontEn = 'var(--font-pixel-en)'

const titleShadow = '4px 4px 0 #d93030, 8px 8px 0 rgba(0,0,0,0.7)'
const numberShadow = '4px 4px 0 rgba(0,0,0,0.7)'
const smallShadow = '2px 2px 0 rgba(0,0,0,0.6)'

export function GameOverlay({ phase, elapsedMs, bestScore, isNewRecord, onStart, onRestart }: Props) {
  if (phase === 'playing') return null

  const showTitle = (text: string) => (
    <h2
      className="text-white leading-none"
      style={{
        fontFamily: fontEn,
        fontSize: 'clamp(28px, 8vw, 52px)',
        letterSpacing: '0.05em',
        textShadow: titleShadow,
      }}
    >
      {text}
    </h2>
  )

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-4"
      style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(1px)' }}
    >
      {phase === 'idle' && (
        <>
          {showTitle('POOP DODGE')}

          {bestScore > 0 && (
            <div className="flex items-baseline gap-2" style={{ fontFamily: fontEn }}>
              <span
                className="text-yellow-300"
                style={{ fontSize: '10px', letterSpacing: '0.3em', textShadow: smallShadow }}
              >
                ★ BEST
              </span>
              <span
                className="text-white tabular-nums"
                style={{ fontSize: '18px', textShadow: smallShadow }}
              >
                {(bestScore / 1000).toFixed(2)}
              </span>
              <span className="text-white/60" style={{ fontSize: '12px' }}>s</span>
            </div>
          )}

          <PixelButton onClick={onStart} variant="filled">
            <span style={{ fontFamily: fontEn, fontSize: '13px', letterSpacing: '0.25em' }}>
              START
            </span>
          </PixelButton>

          <p
            className="text-white/35 tracking-[0.35em]"
            style={{ fontFamily: fontEn, fontSize: '9px' }}
          >
            ← → KEYS / TAP
          </p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          {showTitle('GAME OVER')}

          {isNewRecord && (
            <p
              className="text-yellow-300"
              style={{
                fontFamily: fontEn,
                fontSize: '11px',
                letterSpacing: '0.4em',
                textShadow: smallShadow,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              ★ NEW RECORD ★
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <span
              className="text-white tabular-nums leading-none"
              style={{
                fontFamily: fontEn,
                fontSize: 'clamp(40px, 12vw, 72px)',
                textShadow: numberShadow,
              }}
            >
              {(elapsedMs / 1000).toFixed(2)}
            </span>
            <span
              className="text-white/60"
              style={{
                fontFamily: fontEn,
                fontSize: 'clamp(14px, 3vw, 20px)',
                textShadow: smallShadow,
              }}
            >
              s
            </span>
          </div>

          <div className="flex items-baseline gap-2" style={{ fontFamily: fontEn }}>
            <span
              className={isNewRecord ? 'text-yellow-300' : 'text-white/45'}
              style={{ fontSize: '10px', letterSpacing: '0.3em', textShadow: smallShadow }}
            >
              {isNewRecord ? '★ BEST ★' : 'BEST'}
            </span>
            <span
              className={isNewRecord ? 'text-yellow-300 tabular-nums' : 'text-white/75 tabular-nums'}
              style={{ fontSize: '16px', textShadow: smallShadow }}
            >
              {(bestScore / 1000).toFixed(2)}
            </span>
          </div>

          <PixelButton onClick={onRestart} variant="outline">
            <span style={{ fontFamily: fontEn, fontSize: '13px', letterSpacing: '0.25em' }}>
              RESTART
            </span>
          </PixelButton>
        </>
      )}
    </div>
  )
}
