import { CheckIcon, PauseIcon } from './icons'
import { downloadProgress, type DsnDownload } from '../../shared/download'

type DownloadPillProps = {
  item: DsnDownload
}

export function DownloadPill({ item }: DownloadPillProps) {
  const progress = downloadProgress(item)
  const isDone = item.phase === 'done'
  const isPaused = item.phase === 'paused'

  const label = isDone
    ? 'Your file is done downloading!'
    : isPaused
      ? `Download paused — ${item.filename}`
      : `Now downloading ${item.filename}`

  return (
    <span className="dsn-notch-status">
      <span className={`dsn-notch-state dsn-notch-state--${item.phase}`} aria-hidden="true">
        {isDone ? (
          <CheckIcon size={14} />
        ) : isPaused ? (
          <PauseIcon size={12} />
        ) : (
          <span className="dsn-notch-spinner" />
        )}
      </span>
      <span className="dsn-notch-label">{label}</span>
      <span className="dsn-notch-track" aria-hidden="true">
        <span
          className={`dsn-notch-fill dsn-notch-fill--${item.phase}`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </span>
    </span>
  )
}
