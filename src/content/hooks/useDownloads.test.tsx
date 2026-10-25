import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDownloads } from './useDownloads'

/** Mirrors the dwell constants at the top of `useDownloads`. */
const PREVIEW_DURATION_MS = 12_000
const DONE_DWELL_MS = 120_000
const OPENED_DWELL_MS = 30_000

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('useDownloads dwell times', () => {
  it('keeps the download tab for two minutes after the file finishes', () => {
    const { result } = renderHook(() => useDownloads())

    act(() => result.current.startPreviewDownload())
    expect(result.current.item?.phase).toBe('downloading')

    act(() => vi.advanceTimersByTime(PREVIEW_DURATION_MS))
    expect(result.current.item?.phase).toBe('done')

    act(() => vi.advanceTimersByTime(DONE_DWELL_MS - 1_000))
    expect(result.current.item).not.toBeNull()

    act(() => vi.advanceTimersByTime(1_000))
    expect(result.current.item).toBeNull()
  })

  it('closes the finished download tab sooner once the file is opened', () => {
    const { result } = renderHook(() => useDownloads())

    act(() => result.current.startPreviewDownload())
    act(() => vi.advanceTimersByTime(PREVIEW_DURATION_MS))
    expect(result.current.item?.phase).toBe('done')

    act(() => result.current.openFile())

    act(() => vi.advanceTimersByTime(OPENED_DWELL_MS - 1_000))
    expect(result.current.item).not.toBeNull()

    act(() => vi.advanceTimersByTime(1_000))
    expect(result.current.item).toBeNull()
  })
})
