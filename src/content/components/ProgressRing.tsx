import { CheckIcon } from './icons'

type ProgressRingProps = {
  value: number
  done?: boolean
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * The circular progress variant from the notebook: the ring fills as the file
 * arrives, then turns into the green check mark once the download finishes.
 */
export function ProgressRing({ value, done = false }: ProgressRingProps) {
  return (
    <span className={`dsn-ring ${done ? 'is-done' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" width={36} height={36}>
        <circle className="dsn-ring-track" cx="20" cy="20" r={RADIUS} />
        <circle
          className="dsn-ring-value"
          cx="20"
          cy="20"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, value)))}
        />
      </svg>
      {done ? (
        <span className="dsn-ring-check">
          <CheckIcon size={15} />
        </span>
      ) : (
        <span className="dsn-ring-value-text">{Math.round(value * 100)}</span>
      )}
    </span>
  )
}
