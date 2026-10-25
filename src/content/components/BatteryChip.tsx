import { BatteryGlyph, BoltIcon } from './icons'
import type { BatteryStatus } from '../hooks/useBatteryStatus'

type BatteryChipProps = {
  battery: BatteryStatus
}

function chipTone(level: number, charging: boolean): string {
  if (charging) {
    return 'charging'
  }

  if (level <= 0.05) {
    return 'danger'
  }

  return level <= 0.2 ? 'warning' : 'idle'
}

export function BatteryChip({ battery }: BatteryChipProps) {
  const percent = Math.round(battery.level * 100)

  return (
    <span
      className={`dsn-battery dsn-battery--${chipTone(battery.level, battery.charging)}`}
      title={`Battery ${percent}%${battery.charging ? ' — charging' : ''}`}
    >
      {battery.charging ? <BoltIcon size={14} /> : <BatteryGlyph level={battery.level} />}
      <span className="dsn-battery-value">{percent}%</span>
    </span>
  )
}
