'use client'

import { useState, useRef, useEffect } from 'react'
import { getSavedNickname, saveNickname } from '@/lib/nickname-store'

interface Props {
  onSubmit: (nickname: string) => void
  isLoading: boolean
}

const fontEn = 'var(--font-pixel-en)'
const NICKNAME_RE = /^[a-zA-Z0-9가-힣\s]{1,12}$/

export function NicknameInput({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = getSavedNickname()
    if (saved) setValue(saved)
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || !NICKNAME_RE.test(trimmed)) return
    saveNickname(trimmed)
    onSubmit(trimmed)
  }

  const isValid = NICKNAME_RE.test(value.trim()) && value.trim().length > 0

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
      <p
        className="text-white/60 tracking-[0.2em]"
        style={{ fontFamily: fontEn, fontSize: '8px' }}
      >
        ENTER NICKNAME
      </p>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value.slice(0, 12))}
        onKeyDown={e => e.key === 'Enter' && isValid && handleSubmit()}
        maxLength={12}
        placeholder="YOUR NAME"
        className="w-full bg-transparent border-b-2 border-white/40 text-white text-center outline-none
                   placeholder:text-white/20 focus:border-white/80 transition-colors"
        style={{ fontFamily: fontEn, fontSize: '11px', letterSpacing: '0.25em', paddingBottom: '4px' }}
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="px-5 py-2 border-2 border-white/50 text-white/80 disabled:opacity-30
                   hover:border-white hover:text-white transition-colors active:translate-y-px"
        style={{ fontFamily: fontEn, fontSize: '9px', letterSpacing: '0.25em', boxShadow: '3px 3px 0 rgba(255,255,255,0.15)' }}
      >
        {isLoading ? '...' : 'SAVE'}
      </button>
    </div>
  )
}
