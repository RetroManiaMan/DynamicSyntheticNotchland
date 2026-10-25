import { formatDuration } from '../lib/format'
import type { BatteryManager } from '../hooks/useBatteryManager'
import type { BatteryReading, BatteryStatus } from '../hooks/useBatteryStatus'
import { PreviewChip, PreviewRow } from './PreviewRow'
import { WarningIcon } from './icons'

type BatteryPanelProps = {
  battery: BatteryStatus
  manager: BatteryManager
}

const PREVIEW_PRESETS: { label: string; reading: BatteryReading }[] = [
  {
    label: '18%',
    reading: { level: 0.18, charging: false, chargingTime: null, dischargingTime: 6_480 },
  },
  {
    label: '4%',
    reading: { level: 0.04, charging: false, chargingTime: null, dischargingTime: 1_440 },
  },
  {
    label: '62% charging',
    reading: { level: 0.62, charging: true, chargingTime: 2_280, dischargingTime: null },
  },
  {
    label: '100% full',
    reading: { level: 1, charging: true, chargingTime: null, dischargingTime: null },
  },
]

function stateLabel(battery: BatteryReading): string {
  if (battery.charging) {
    const remaining = formatDuration(battery.chargingTime)
    if (remaining) {
      return `Charging — ${remaining} to full`
    }

    return 'Plugged in'
  }

  const remaining = formatDuration(battery.dischargingTime)
  return remaining ? `${remaining} left` : 'On battery'
}

export function BatteryPanel({ battery, manager }: BatteryPanelProps) {
  const { alert } = manager
  const percent = Math.round(battery.level * 100)

  return (
    <div className="dsn-battery-panel">
      <div className="dsn-battery-summary">
        <span className="dsn-battery-percent">{percent}%</span>
        <span className="dsn-battery-state">{stateLabel(battery)}</span>
        <span className="dsn-meter" aria-hidden="true">
          <span className="dsn-meter-fill" style={{ width: `${percent}%` }} />
        </span>
      </div>

      {alert ? (
        <div className={`dsn-alert dsn-alert--${alert.tone}`} role="status">
          <span className="dsn-alert-icon">
            <WarningIcon size={14} />
          </span>
          <span className="dsn-alert-text">
            <span className="dsn-alert-title">{alert.title}</span>
            <span className="dsn-alert-message">{alert.message}</span>
          </span>
          <button
            type="button"
            className="dsn-alert-dismiss"
            aria-label="Dismiss battery alert"
            onClick={manager.dismissAlert}
          >
            ✕
          </button>
        </div>
      ) : null}

      {battery.simulated ? (
        <PreviewRow>
          {PREVIEW_PRESETS.map((preset) => (
            <PreviewChip
              key={preset.label}
              label={preset.label}
              onClick={() => battery.setPreview(preset.reading)}
            />
          ))}
        </PreviewRow>
      ) : null}
    </div>
  )
}
