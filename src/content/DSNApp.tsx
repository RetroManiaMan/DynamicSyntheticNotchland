import { useEffect, useRef, useState } from 'react'

import { Clock } from './components/Clock'
import { NotchCollapsed } from './components/NotchCollapsed'
import { NotchExpanded } from './components/NotchExpanded'
import { NotchShell } from './components/NotchShell'
import type { NotchTab } from './components/NotchTabs'
import { resolveNotchTab, type NotchTabChoice } from './lib/notchTab'
import { useBatteryManager } from './hooks/useBatteryManager'
import { useBatteryStatus } from './hooks/useBatteryStatus'
import { useDownloads } from './hooks/useDownloads'

const IDLE_WIDTH = '250px'
const STATUS_WIDTH = 'min(360px, calc(100vw - 32px))'

export function DSNApp() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [tabChoice, setTabChoice] = useState<NotchTabChoice>({
    downloadId: null,
    tab: 'battery',
  })
  const shellRef = useRef<HTMLDivElement | null>(null)
  const expandedRef = useRef(false)
  const { formattedTime } = Clock()

  const battery = useBatteryStatus()
  const manager = useBatteryManager(battery)
  const downloads = useDownloads()

  const downloadId = downloads.item?.id ?? null
  const alert = manager.alert
  const isBusy = downloadId !== null || alert !== null

  const activeTab = resolveNotchTab(downloadId, tabChoice)

  const handleTabChange = (tab: NotchTab) => {
    setTabChoice({ downloadId, tab })
  }

  useEffect(() => {
    expandedRef.current = isExpanded || isHovered
  }, [isExpanded, isHovered])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false)
        return
      }

      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }

      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault()
        if (expandedRef.current) {
          setIsExpanded(false)
          setIsHovered(false)
        } else {
          setIsExpanded(true)
        }
      } else if (event.key === '/' && expandedRef.current) {
        event.preventDefault()
        shellRef.current?.querySelector<HTMLElement>('.dsn-search-input')?.focus()
      } else if (['1', '2', '3'].includes(event.key) && expandedRef.current) {
        event.preventDefault()
        const buttons = shellRef.current?.querySelectorAll<HTMLElement>('.dsn-action')
        buttons?.[Number(event.key) - 1]?.click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!shellRef.current) {
        return
      }

      if (!shellRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleSearchSubmit = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return
    }

    const url = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  return (
    <NotchShell
      ref={shellRef}
      isExpanded={isExpanded || isHovered}
      isSaver={manager.settings.saverMode}
      collapsedWidth={isBusy ? STATUS_WIDTH : IDLE_WIDTH}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      collapsedContent={
        <NotchCollapsed
          time={formattedTime}
          isExpanded={isExpanded || isHovered}
          battery={battery}
          batteryAlert={alert}
          downloads={downloads}
          onToggle={() => setIsExpanded((value) => !value)}
        />
      }
      expandedContent={
        <NotchExpanded
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          onCollapse={() => setIsExpanded(false)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          battery={battery}
          manager={manager}
          downloads={downloads}
        />
      }
    />
  )
}
