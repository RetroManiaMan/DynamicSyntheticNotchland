import { formatPercent } from '../lib/format'
import type { Downloads } from '../hooks/useDownloads'
import { ProgressRing } from './ProgressRing'
import { CloseIcon, PauseIcon, PlayIcon, WarningIcon } from './icons'

type DownloadsPanelProps = {
  downloads: Downloads
}

export function DownloadsPanel({ downloads }: DownloadsPanelProps) {
  const { item, progress } = downloads

  if (!item) {
    return null
  }

  if (item.phase === 'error') {
    return (
      <div className="dsn-download-error" role="alert">
        <div className="dsn-alert dsn-alert--danger">
          <span className="dsn-alert-icon">
            <WarningIcon size={14} />
          </span>
          <span className="dsn-alert-text">
            <span className="dsn-alert-title">Unable to finish download</span>
            <span className="dsn-alert-message">
              {item.filename} stopped part way through. Try again when you are back online.
            </span>
          </span>
        </div>
        <div className="dsn-download-actions">
          <button type="button" className="dsn-button" onClick={downloads.retry}>
            Try again
          </button>
          <button
            type="button"
            className="dsn-button dsn-button--ghost"
            aria-label="Dismiss download alert"
            onClick={downloads.cancel}
          >
            <CloseIcon size={13} />
          </button>
        </div>
      </div>
    )
  }

  if (item.phase === 'done') {
    return (
      <div className="dsn-download-done">
        <ProgressRing value={1} done />
        <span className="dsn-download-text">
          <span className="dsn-download-title">Your file is done!</span>
          <span className="dsn-download-file">{item.filename}</span>
        </span>
        <div className="dsn-download-actions">
          <button
            type="button"
            className="dsn-button dsn-button--primary"
            onClick={downloads.openFile}
          >
            Click here to open {item.filename}
          </button>
          <button type="button" className="dsn-button" onClick={downloads.downloadAgain}>
            Download again?
          </button>
        </div>
        <span className="dsn-download-hint">
          This tab closes on its own in a moment, or right after you open the file.
        </span>
      </div>
    )
  }

  const isPaused = item.phase === 'paused'

  return (
    <div className="dsn-download-active">
      <ProgressRing value={progress} />
      <span className="dsn-download-text">
        <span className="dsn-download-title">
          {isPaused ? 'Download paused' : 'File downloading…'}
        </span>
        <span className="dsn-download-file">{item.filename}</span>
      </span>
      <div className="dsn-download-actions">
        <button
          type="button"
          className="dsn-icon-button"
          aria-label={isPaused ? 'Resume download' : 'Pause download'}
          onClick={isPaused ? downloads.resume : downloads.pause}
        >
          {isPaused ? <PlayIcon size={13} /> : <PauseIcon size={13} />}
        </button>
        <button
          type="button"
          className="dsn-icon-button"
          aria-label="Cancel download"
          onClick={downloads.cancel}
        >
          <CloseIcon size={13} />
        </button>
      </div>
      <div className="dsn-progress">
        <span className="dsn-progress-track">
          <span
            className={`dsn-progress-fill ${isPaused ? 'is-paused' : ''}`}
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </span>
        <span className="dsn-progress-value">{formatPercent(progress)}</span>
      </div>
    </div>
  )
}
