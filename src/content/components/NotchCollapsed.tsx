import { BatteryChip } from './BatteryChip'
import { DownloadPill } from './DownloadPill'
import { CloseIcon, WarningIcon } from './icons'
import type { BatteryAlert } from '../hooks/useBatteryManager'
import type { BatteryStatus } from '../hooks/useBatteryStatus'
import type { Downloads } from '../hooks/useDownloads'

type NotchCollapsedProps = {
  time: string
  isExpanded: boolean
  onToggle: () => void
  battery: BatteryStatus
  batteryAlert: BatteryAlert | null
  downloads: Downloads
}

export function NotchCollapsed({
  time,
  isExpanded,
  onToggle,
  battery,
  batteryAlert,
  downloads,
}: NotchCollapsedProps) {
  const { item } = downloads

  if (item?.phase === 'error') {
    return (
      <div className="dsn-notch dsn-notch--alert" role="alert">
        <span className="dsn-notch-state dsn-notch-state--error" aria-hidden="true">
          <WarningIcon size={14} />
        </span>
        <span className="dsn-notch-label">Unable to finish download</span>
        <button type="button" className="dsn-notch-retry" onClick={downloads.retry}>
          Try again
        </button>
        <button
          type="button"
          className="dsn-notch-dismiss"
          aria-label="Dismiss download alert"
          onClick={downloads.cancel}
        >
          <CloseIcon size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`dsn-notch ${isExpanded ? 'is-expanded' : ''} ${item ? `dsn-notch--${item.phase}` : ''}`}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? 'Collapse DSN' : 'Expand DSN'}
      onClick={onToggle}
    >
      {item ? (
        <DownloadPill item={item} />
      ) : (
        <span className="dsn-notch-status">
          <span
            className={`dsn-notch-indicator ${batteryAlert ? `dsn-notch-indicator--${batteryAlert.tone}` : ''}`}
            aria-hidden="true"
          />
          <span className="dsn-collapsed-time">{batteryAlert ? batteryAlert.title : time}</span>
        </span>
      )}
      <BatteryChip battery={battery} />
    </button>
  )
}
