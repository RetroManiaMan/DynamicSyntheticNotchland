import { useCallback, useMemo, useState } from 'react'

import type { BatteryReading } from './useBatteryStatus'

export type BatteryAlertTone = 'warning' | 'danger' | 'success'

export type BatteryAlert = {
  key: string
  tone: BatteryAlertTone
  title: string
  message: string
}

export type BatteryManagerSettings = {
  alertsEnabled: boolean
  lowThreshold: number
  saverMode: boolean
}

export type BatteryManager = {
  settings: BatteryManagerSettings
  alert: BatteryAlert | null
  setAlertsEnabled: (enabled: boolean) => void
  setLowThreshold: (percent: number) => void
  setSaverMode: (enabled: boolean) => void
  dismissAlert: () => void
}

export const LOW_THRESHOLD_OPTIONS = [10, 20, 30]

const CRITICAL_LEVEL = 0.05
const FULL_LEVEL = 0.99

export function useBatteryManager(battery: BatteryReading): BatteryManager {
  const [settings, setSettings] = useState<BatteryManagerSettings>({
    alertsEnabled: true,
    lowThreshold: 20,
    saverMode: false,
  })
  const [dismissedKey, setDismissedKey] = useState<string | null>(null)

  const alert = useMemo<BatteryAlert | null>(() => {
    if (!settings.alertsEnabled) {
      return null
    }

    const percent = Math.round(battery.level * 100)

    if (!battery.charging && battery.level <= CRITICAL_LEVEL) {
      return {
        key: 'critical',
        tone: 'danger',
        title: 'Battery critical',
        message: `${percent}% left — plug in now to keep DSN awake.`,
      }
    }

    if (!battery.charging && percent <= settings.lowThreshold) {
      return {
        key: 'low',
        tone: 'warning',
        title: 'Battery low',
        message: `${percent}% left — plug in when you can.`,
      }
    }

    if (battery.charging && battery.level >= FULL_LEVEL) {
      return {
        key: 'full',
        tone: 'success',
        title: 'Battery full',
        message: 'Fully charged — you can unplug.',
      }
    }

    return null
  }, [battery.charging, battery.level, settings.alertsEnabled, settings.lowThreshold])

  const setAlertsEnabled = useCallback((enabled: boolean) => {
    setSettings((current) => ({ ...current, alertsEnabled: enabled }))
  }, [])

  const setLowThreshold = useCallback((percent: number) => {
    setSettings((current) => ({ ...current, lowThreshold: percent }))
  }, [])

  const setSaverMode = useCallback((enabled: boolean) => {
    setSettings((current) => ({ ...current, saverMode: enabled }))
  }, [])

  const dismissAlert = useCallback(() => {
    setDismissedKey(alert?.key ?? null)
  }, [alert?.key])

  return {
    settings,
    alert: alert && alert.key !== dismissedKey ? alert : null,
    setAlertsEnabled,
    setLowThreshold,
    setSaverMode,
    dismissAlert,
  }
}
