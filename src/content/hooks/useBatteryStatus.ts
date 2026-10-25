import { useCallback, useEffect, useMemo, useState } from 'react'

import { hasRuntimeMessaging } from '../lib/environment'

export type BatteryReading = {
  level: number
  charging: boolean
  chargingTime: number | null
  dischargingTime: number | null
}

export type BatteryStatus = BatteryReading & {
  simulated: boolean
  setPreview: (reading: BatteryReading) => void
}

type BatteryManagerLike = {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManagerLike>
}

const BATTERY_EVENTS = [
  'levelchange',
  'chargingchange',
  'chargingtimechange',
  'dischargingtimechange',
]

/** Stand-in reading used by the dev preview, where no system battery is reachable. */
const PREVIEW_READING: BatteryReading = {
  level: 0.24,
  charging: false,
  chargingTime: null,
  dischargingTime: 8_640,
}

function toReading(battery: BatteryManagerLike): BatteryReading {
  const { chargingTime, dischargingTime } = battery

  return {
    level: Math.min(1, Math.max(0, battery.level)),
    charging: battery.charging,
    chargingTime: Number.isFinite(chargingTime) && chargingTime > 0 ? chargingTime : null,
    dischargingTime:
      Number.isFinite(dischargingTime) && dischargingTime > 0 ? dischargingTime : null,
  }
}

export function useBatteryStatus(): BatteryStatus {
  const [reading, setReading] = useState<BatteryReading>(PREVIEW_READING)
  const [simulated, setSimulated] = useState(() => !hasRuntimeMessaging())

  useEffect(() => {
    if (!hasRuntimeMessaging()) {
      return
    }

    const getBattery = (navigator as NavigatorWithBattery).getBattery
    if (typeof getBattery !== 'function') {
      return
    }

    let manager: BatteryManagerLike | null = null
    let cancelled = false

    const sync = () => {
      if (!manager) {
        return
      }

      setSimulated(false)
      setReading(toReading(manager))
    }

    getBattery
      .call(navigator)
      .then((battery) => {
        if (cancelled) {
          return
        }

        manager = battery
        sync()
        for (const event of BATTERY_EVENTS) {
          battery.addEventListener(event, sync)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (!manager) {
        return
      }

      for (const event of BATTERY_EVENTS) {
        manager.removeEventListener(event, sync)
      }
    }
  }, [])

  const setPreview = useCallback((next: BatteryReading) => {
    setSimulated(true)
    setReading({ ...next, level: Math.min(1, Math.max(0, next.level)) })
  }, [])

  return useMemo(
    () => ({ ...reading, simulated, setPreview }),
    [reading, simulated, setPreview],
  )
}
