import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileControls } from './MobileControls'

const noop = vi.fn()

describe('MobileControls', () => {
  it('shows buttons when playing', () => {
    render(<MobileControls phase="playing" onLeft={noop} onRight={noop} />)
    expect(screen.getByText('←')).toBeInTheDocument()
    expect(screen.getByText('→')).toBeInTheDocument()
  })

  it('hides buttons when idle', () => {
    render(<MobileControls phase="idle" onLeft={noop} onRight={noop} />)
    expect(screen.queryByText('←')).not.toBeInTheDocument()
    expect(screen.queryByText('→')).not.toBeInTheDocument()
  })

  it('hides buttons when gameover', () => {
    render(<MobileControls phase="gameover" onLeft={noop} onRight={noop} />)
    expect(screen.queryByText('←')).not.toBeInTheDocument()
    expect(screen.queryByText('→')).not.toBeInTheDocument()
  })
})
