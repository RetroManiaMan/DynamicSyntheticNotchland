import type { ReactNode } from 'react'

type PreviewRowProps = {
  children: ReactNode
}

type PreviewChipProps = {
  label: string
  onClick: () => void
  active?: boolean
}

/**
 * The dev preview cannot reach the browser download list or a system battery,
 * so DSN shows a labelled design-preview row there to walk through its states.
 */
export function PreviewRow({ children }: PreviewRowProps) {
  return (
    <div className="dsn-preview">
      <span className="dsn-preview-label">Design preview</span>
      {children}
    </div>
  )
}

export function PreviewChip({ label, onClick, active = false }: PreviewChipProps) {
  return (
    <button
      type="button"
      className={`dsn-preview-chip ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
