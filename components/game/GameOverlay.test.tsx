import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameOverlay } from './GameOverlay'

const noop = vi.fn()

describe('GameOverlay — idle phase', () => {
  it('shows start button', () => {
    render(<GameOverlay phase="idle" elapsedMs={0} bestScore={0} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByRole('button', { name: /START/i })).toBeInTheDocument()
  })

  it('hides best score row when no record exists', () => {
    render(<GameOverlay phase="idle" elapsedMs={0} bestScore={0} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.queryByText(/BEST/i)).not.toBeInTheDocument()
  })

  it('shows best score when record exists', () => {
    render(<GameOverlay phase="idle" elapsedMs={0} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByText(/BEST/i)).toBeInTheDocument()
    expect(screen.getByText('25.67')).toBeInTheDocument()
  })

  it('shows title POOP DODGE', () => {
    render(<GameOverlay phase="idle" elapsedMs={0} bestScore={0} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByText('POOP DODGE')).toBeInTheDocument()
  })
})

describe('GameOverlay — playing phase', () => {
  it('renders nothing', () => {
    const { container } = render(<GameOverlay phase="playing" elapsedMs={5000} bestScore={0} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(container.firstChild).toBeNull()
  })
})

describe('GameOverlay — gameover phase', () => {
  it('shows GAME OVER text', () => {
    render(<GameOverlay phase="gameover" elapsedMs={12340} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
  })

  it('shows elapsed time as big number with s unit', () => {
    render(<GameOverlay phase="gameover" elapsedMs={12340} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByText('12.34')).toBeInTheDocument()
    expect(screen.getByText('s')).toBeInTheDocument()
  })

  it('shows restart button', () => {
    render(<GameOverlay phase="gameover" elapsedMs={12340} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByRole('button', { name: /RESTART/i })).toBeInTheDocument()
  })

  it('shows new record indicator when isNewRecord', () => {
    render(<GameOverlay phase="gameover" elapsedMs={28450} bestScore={28450} isNewRecord={true} onStart={noop} onRestart={noop} />)
    expect(screen.getByText(/NEW RECORD/i)).toBeInTheDocument()
  })

  it('hides new record indicator when not new record', () => {
    render(<GameOverlay phase="gameover" elapsedMs={12340} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.queryByText(/NEW RECORD/i)).not.toBeInTheDocument()
  })

  it('shows best score line', () => {
    render(<GameOverlay phase="gameover" elapsedMs={12340} bestScore={25670} isNewRecord={false} onStart={noop} onRestart={noop} />)
    expect(screen.getByText(/BEST/i)).toBeInTheDocument()
    expect(screen.getByText('25.67')).toBeInTheDocument()
  })
})
