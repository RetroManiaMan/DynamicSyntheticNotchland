export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatDuration(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) {
    return null
  }

  const minutes = Math.round(seconds / 60)
  if (minutes < 1) {
    return 'less than a minute'
  }

  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) {
    return `${rest} min`
  }

  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}
