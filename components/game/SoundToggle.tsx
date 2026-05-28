'use client'

import { useState, useEffect } from 'react'
import { isMuted, setMuted } from '@/lib/sound-engine'

export function SoundToggle() {
  const [muted, setLocalMuted] = useState(false)

  useEffect(() => {
    setLocalMuted(isMuted())
  }, [])

  const toggle = () => {
    const next = !muted
    setMuted(next)
    setLocalMuted(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      className="absolute top-2 right-2 text-white/40 hover:text-white/80 transition-colors text-xs select-none"
      style={{ fontFamily: 'var(--font-pixel-en)', letterSpacing: '0.1em' }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
