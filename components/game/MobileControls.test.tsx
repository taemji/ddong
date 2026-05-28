import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileControls } from './MobileControls'

const noop = vi.fn()
const props = { onLeftDown: noop, onLeftUp: noop, onRightDown: noop, onRightUp: noop }

describe('MobileControls', () => {
  it('shows buttons when playing', () => {
    render(<MobileControls phase="playing" {...props} />)
    expect(screen.getByLabelText('왼쪽으로 이동')).toBeInTheDocument()
    expect(screen.getByLabelText('오른쪽으로 이동')).toBeInTheDocument()
  })

  it('hides buttons when idle', () => {
    render(<MobileControls phase="idle" {...props} />)
    expect(screen.queryByLabelText('왼쪽으로 이동')).not.toBeInTheDocument()
  })

  it('hides buttons when gameover', () => {
    render(<MobileControls phase="gameover" {...props} />)
    expect(screen.queryByLabelText('왼쪽으로 이동')).not.toBeInTheDocument()
  })
})
