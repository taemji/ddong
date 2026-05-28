'use client'

import { cn } from '@/lib/utils'

interface Props {
  onClick: () => void
  children: React.ReactNode
  variant?: 'filled' | 'outline'
  className?: string
}

export function PixelButton({ onClick, children, variant = 'outline', className }: Props) {
  const base = [
    'relative px-6 py-3 font-mono font-bold tracking-[0.25em] text-sm uppercase',
    'border-2 transition-none select-none cursor-pointer',
    'active:translate-x-[3px] active:translate-y-[3px]',
  ]

  const variants = {
    filled: 'bg-white text-black border-white hover:bg-white/90',
    outline: 'bg-transparent text-white border-white/70 hover:bg-white/8',
  }

  const shadow = {
    filled: '4px 4px 0 rgba(255,255,255,0.35)',
    outline: '4px 4px 0 rgba(255,255,255,0.18)',
  }

  return (
    <button
      onClick={onClick}
      className={cn(base, variants[variant], className)}
      style={{ boxShadow: shadow[variant] }}
      onPointerDown={e => { e.currentTarget.style.boxShadow = 'none' }}
      onPointerUp={e => { e.currentTarget.style.boxShadow = shadow[variant] }}
      onPointerLeave={e => { e.currentTarget.style.boxShadow = shadow[variant] }}
    >
      {children}
    </button>
  )
}
