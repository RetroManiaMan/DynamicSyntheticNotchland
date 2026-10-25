import { type KeyboardEvent } from 'react'

import { BatteryPanel } from './BatteryPanel'
import { Clock } from './Clock'
import { DownloadsPanel } from './DownloadsPanel'
import { NotchTabs, type NotchTab } from './NotchTabs'
import { PreviewChip, PreviewRow } from './PreviewRow'
import { QuickActions } from './QuickActions'
import { SearchBar } from './SearchBar'
import type { BatteryManager } from '../hooks/useBatteryManager'
import type { BatteryStatus } from '../hooks/useBatteryStatus'
import type { Downloads } from '../hooks/useDownloads'

type NotchExpandedProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (value: string) => void
  onCollapse: () => void
  activeTab: NotchTab
  onTabChange: (tab: NotchTab) => void
  battery: BatteryStatus
  manager: BatteryManager
  downloads: Downloads
}

export function NotchExpanded({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCollapse,
  activeTab,
  onTabChange,
  battery,
  manager,
  downloads,
}: NotchExpandedProps) {
  const { formattedTime, formattedDate } = Clock()
  const showDownloads = activeTab === 'downloads' && downloads.item !== null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onCollapse()
    }
  }

  return (
    <div
      className="dsn-expanded-panel"
      role="dialog"
      aria-modal="false"
      aria-label="Dynamic Synthetic Notchland panel"
      onKeyDown={handleKeyDown}
    >
      <div className="dsn-expanded-topline">
        <div className="dsn-expanded-clock">{formattedTime}</div>
        <div className="dsn-expanded-date">{formattedDate}</div>
      </div>

      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
        onCollapse={onCollapse}
      />

      <NotchTabs activeTab={activeTab} onTabChange={onTabChange} downloads={downloads} />

      <div className="dsn-tabpanel">
        {showDownloads ? (
          <div role="tabpanel" id="dsn-panel-downloads" aria-labelledby="dsn-tab-downloads">
            <DownloadsPanel downloads={downloads} />
          </div>
        ) : (
          <div role="tabpanel" id="dsn-panel-battery" aria-labelledby="dsn-tab-battery">
            <BatteryPanel battery={battery} manager={manager} />
          </div>
        )}
      </div>

      {downloads.isSimulated ? (
        <PreviewRow>
          <PreviewChip label="Simulate a download" onClick={downloads.startPreviewDownload} />
          {downloads.item ? (
            <PreviewChip label="Simulate interruption" onClick={downloads.simulateInterruption} />
          ) : null}
        </PreviewRow>
      ) : null}

      <QuickActions />
    </div>
  )
}
