import type { ReactNode } from 'react'

type IconProps = {
  size?: number
}

function Icon({ size = 14, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className="dsn-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function CheckIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Icon>
  )
}

export function PauseIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M9.5 5v14M14.5 5v14" />
    </Icon>
  )
}

export function PlayIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M7.5 5 18.5 12 7.5 19Z" fill="currentColor" />
    </Icon>
  )
}

export function CloseIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
    </Icon>
  )
}

export function WarningIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M12 4.5 3 20h18L12 4.5Z" />
      <path d="M12 10.5v4" />
      <path d="M12 17.6h.01" />
    </Icon>
  )
}

export function DownloadIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M5 19.5h14" />
    </Icon>
  )
}

export function BoltIcon({ size }: IconProps) {
  return (
    <Icon size={size}>
      <path d="M13.4 3 6.6 13.4H11l-.6 7.6 7-11h-4.4Z" fill="currentColor" />
    </Icon>
  )
}

export function BatteryGlyph({ level }: { level: number }) {
  const fill = Math.min(1, Math.max(0.07, level)) * 12.6

  return (
    <svg
      className="dsn-icon"
      viewBox="0 0 24 24"
      width={17}
      height={17}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7.5" width="17" height="9" rx="2.6" />
      <path d="M21.6 11v2" strokeLinecap="round" />
      <rect x="4.2" y="9.7" width={fill} height="4.6" rx="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
