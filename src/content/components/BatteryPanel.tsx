import { formatDuration } from '../lib/format'
import { LOW_THRESHOLD_OPTIONS, type BatteryManager } from '../hooks/useBatteryManager'
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
  const { settings, alert } = manager
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
        <div key={alert.key} className={`dsn-alert dsn-alert--${alert.tone}`} role="status">
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

      <div className="dsn-manager">
        <div className="dsn-row">
          <span className="dsn-row-title">Battery alerts</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.alertsEnabled}
            aria-label="Battery alerts"
            className={`dsn-switch ${settings.alertsEnabled ? 'is-on' : ''}`}
            onClick={() => manager.setAlertsEnabled(!settings.alertsEnabled)}
          >
            <span className="dsn-switch-thumb" />
          </button>
        </div>

        <div className="dsn-row">
          <span className="dsn-row-title">Warn me at</span>
          <span className="dsn-segmented" role="group" aria-label="Low battery warning level">
            {LOW_THRESHOLD_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={settings.lowThreshold === option}
                className={`dsn-segment ${settings.lowThreshold === option ? 'is-active' : ''}`}
                onClick={() => manager.setLowThreshold(option)}
              >
                {option}%
              </button>
            ))}
          </span>
        </div>

        <div className="dsn-row">
          <span className="dsn-row-title">Battery saver</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.saverMode}
            aria-label="Battery saver"
            className={`dsn-switch ${settings.saverMode ? 'is-on' : ''}`}
            onClick={() => manager.setSaverMode(!settings.saverMode)}
          >
            <span className="dsn-switch-thumb" />
          </button>
        </div>
      </div>

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
