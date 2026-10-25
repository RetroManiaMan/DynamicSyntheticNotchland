import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NotchTabs } from './NotchTabs'
import type { DsnDownload } from '../../shared/download'
import type { Downloads } from '../hooks/useDownloads'

const activeDownload: DsnDownload = {
  id: 1,
  filename: 'image.png',
  url: 'https://example.com/image.png',
  received: 1_050_000,
  total: 4_200_000,
  phase: 'downloading',
  canResume: false,
}

function downloadsFor(item: DsnDownload | null, progress = 0): Downloads {
  const noop = () => {}

  return {
    isSimulated: true,
    item,
    progress,
    pause: noop,
    resume: noop,
    cancel: noop,
    retry: noop,
    openFile: noop,
    downloadAgain: noop,
    startPreviewDownload: noop,
    simulateInterruption: noop,
  }
}

afterEach(cleanup)

describe('NotchTabs', () => {
  it('stays hidden while the notch shows battery status', () => {
    const { container } = render(
      <NotchTabs activeTab="battery" onTabChange={() => {}} downloads={downloadsFor(null)} />,
    )

    expect(container.querySelector('.dsn-tabs')).toBeNull()
  })

  it('shows download progress beside the Downloads tab once a download starts', () => {
    render(
      <NotchTabs
        activeTab="downloads"
        onTabChange={() => {}}
        downloads={downloadsFor(activeDownload, 0.25)}
      />,
    )

    const downloadsTab = screen.getByRole('tab', { name: /downloads/i })
    expect(downloadsTab.textContent).toContain('25%')
    expect(downloadsTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tab', { name: 'Battery' }).getAttribute('aria-selected')).toBe(
      'false',
    )
  })

  it('marks a finished download with the check badge', () => {
    render(
      <NotchTabs
        activeTab="downloads"
        onTabChange={() => {}}
        downloads={downloadsFor(
          { ...activeDownload, received: activeDownload.total, phase: 'done' },
          1,
        )}
      />,
    )

    expect(document.querySelector('.dsn-tab-badge svg')).not.toBeNull()
  })

  it('marks an interrupted download with the error badge', () => {
    render(
      <NotchTabs
        activeTab="downloads"
        onTabChange={() => {}}
        downloads={downloadsFor({ ...activeDownload, phase: 'error' }, 0.4)}
      />,
    )

    expect(document.querySelector('.dsn-tab-badge')?.textContent).toBe('!')
  })

  it('switches back to the battery tab when the battery tab is picked', () => {
    const onTabChange = vi.fn()

    render(
      <NotchTabs
        activeTab="downloads"
        onTabChange={onTabChange}
        downloads={downloadsFor(activeDownload, 0.5)}
      />,
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Battery' }))

    expect(onTabChange).toHaveBeenCalledWith('battery')
  })
})
