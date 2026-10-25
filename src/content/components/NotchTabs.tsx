import { CheckIcon } from './icons'
import type { Downloads } from '../hooks/useDownloads'

export type NotchTab = 'battery' | 'downloads'

type NotchTabsProps = {
  activeTab: NotchTab
  onTabChange: (tab: NotchTab) => void
  downloads: Downloads
}

export function NotchTabs({ activeTab, onTabChange, downloads }: NotchTabsProps) {
  const { item, progress } = downloads

  if (!item) {
    return null
  }

  const badge =
    item.phase === 'done' ? (
      <CheckIcon size={11} />
    ) : item.phase === 'error' ? (
      '!'
    ) : (
      `${Math.round(progress * 100)}%`
    )

  return (
    <div className="dsn-tabs" role="tablist" aria-label="Notch panels">
      <button
        type="button"
        role="tab"
        id="dsn-tab-battery"
        aria-controls="dsn-panel-battery"
        aria-selected={activeTab === 'battery'}
        className="dsn-tab"
        onClick={() => onTabChange('battery')}
      >
        Battery
      </button>
      <button
        type="button"
        role="tab"
        id="dsn-tab-downloads"
        aria-controls="dsn-panel-downloads"
        aria-selected={activeTab === 'downloads'}
        className="dsn-tab"
        onClick={() => onTabChange('downloads')}
      >
        Downloads
        <span className="dsn-tab-badge">{badge}</span>
      </button>
    </div>
  )
}
