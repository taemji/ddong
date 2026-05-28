import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GameOverlay } from './GameOverlay'

const noop = vi.fn()

describe('GameOverlay — idle phase', () => {
  it('shows start button', () => {
    render(
      <GameOverlay
        phase="idle"
        elapsedMs={0}
        bestScore={0}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByRole('button', { name: /시 작/i })).toBeInTheDocument()
  })

  it('shows best score label and 0.00초 when no record', () => {
    render(
      <GameOverlay
        phase="idle"
        elapsedMs={0}
        bestScore={0}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByText('최고기록')).toBeInTheDocument()
    expect(screen.getByText('0.00초')).toBeInTheDocument()
  })

  it('score counter is fixed at 0.00초 (no playing UI)', () => {
    render(
      <GameOverlay
        phase="idle"
        elapsedMs={0}
        bestScore={0}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.queryByText(/생존 시간/i)).not.toBeInTheDocument()
  })
})

describe('GameOverlay — playing phase', () => {
  it('renders nothing', () => {
    const { container } = render(
      <GameOverlay
        phase="playing"
        elapsedMs={5000}
        bestScore={0}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('GameOverlay — gameover phase', () => {
  it('shows GAME OVER text', () => {
    render(
      <GameOverlay
        phase="gameover"
        elapsedMs={12340}
        bestScore={25670}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
  })

  it('shows elapsed time', () => {
    render(
      <GameOverlay
        phase="gameover"
        elapsedMs={12340}
        bestScore={25670}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByText('12.34초')).toBeInTheDocument()
  })

  it('shows restart button', () => {
    render(
      <GameOverlay
        phase="gameover"
        elapsedMs={12340}
        bestScore={25670}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByRole('button', { name: /다시 시작/i })).toBeInTheDocument()
  })

  it('shows 신기록 badge when isNewRecord', () => {
    render(
      <GameOverlay
        phase="gameover"
        elapsedMs={28450}
        bestScore={28450}
        isNewRecord={true}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.getByText(/신기록/)).toBeInTheDocument()
  })

  it('hides 신기록 badge when not new record', () => {
    render(
      <GameOverlay
        phase="gameover"
        elapsedMs={12340}
        bestScore={25670}
        isNewRecord={false}
        onStart={noop}
        onRestart={noop}
      />
    )
    expect(screen.queryByText(/신기록/)).not.toBeInTheDocument()
  })
})
