import { describe, expect, it } from 'vitest'

import { resolveNotchTab } from './notchTab'

describe('resolveNotchTab', () => {
  it('shows battery while no download is running', () => {
    expect(resolveNotchTab(null, { downloadId: null, tab: 'downloads' })).toBe('battery')
  })

  it('opens the downloads tab for a download the notch has not seen yet', () => {
    expect(resolveNotchTab(7, { downloadId: null, tab: 'battery' })).toBe('downloads')
  })

  it('keeps the tab the user picked for the current download', () => {
    expect(resolveNotchTab(7, { downloadId: 7, tab: 'battery' })).toBe('battery')
  })

  it('forgets a hand-picked tab once a different download starts', () => {
    expect(resolveNotchTab(8, { downloadId: 7, tab: 'battery' })).toBe('downloads')
  })
})
