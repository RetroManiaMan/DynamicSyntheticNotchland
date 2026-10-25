import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  DSN_DOWNLOAD_PORT,
  DSN_DOWNLOAD_REQUEST,
  DSN_DOWNLOAD_UPDATE,
  downloadProgress,
  type DownloadAction,
  type DownloadRequest,
  type DownloadUpdate,
  type DsnDownload,
} from '../../shared/download'
import { hasRuntimeMessaging } from '../lib/environment'

/** The finished tab lingers before the notch returns to idle (notebook: 1–2 min). */
const DONE_DWELL_MS = 120_000
/** Once the file is opened the tab closes sooner (notebook: 15–30 s). */
const OPENED_DWELL_MS = 30_000

const PREVIEW_FILENAME = 'image.png'
const PREVIEW_TOTAL_BYTES = 4_200_000
const PREVIEW_TICK_MS = 250
const PREVIEW_DURATION_MS = 12_000

export type Downloads = {
  isSimulated: boolean
  item: DsnDownload | null
  progress: number
  pause: () => void
  resume: () => void
  cancel: () => void
  retry: () => void
  openFile: () => void
  downloadAgain: () => void
  startPreviewDownload: () => void
  simulateInterruption: () => void
}

function previewDownload(filename = PREVIEW_FILENAME): DsnDownload {
  return {
    id: -1,
    filename,
    url: '',
    received: 0,
    total: PREVIEW_TOTAL_BYTES,
    phase: 'downloading',
    canResume: false,
  }
}

export function useDownloads(): Downloads {
  const isSimulated = useMemo(() => !hasRuntimeMessaging(), [])
  const [item, setItem] = useState<DsnDownload | null>(null)
  const [opened, setOpened] = useState(false)
  const portRef = useRef<ChromePort | null>(null)

  // In the extension the background service worker owns chrome.downloads and
  // streams the current download over a port; content scripts cannot call it.
  useEffect(() => {
    if (isSimulated) {
      return
    }

    const port = chrome.runtime.connect({ name: DSN_DOWNLOAD_PORT })
    portRef.current = port

    port.onMessage.addListener((message) => {
      const update = message as DownloadUpdate
      if (update?.type !== DSN_DOWNLOAD_UPDATE) {
        return
      }

      setItem(update.item)
      if (update.item?.phase !== 'done') {
        setOpened(false)
      }
    })

    port.postMessage({ type: DSN_DOWNLOAD_REQUEST, action: 'get' } satisfies DownloadRequest)

    return () => {
      portRef.current = null
      port.disconnect()
    }
  }, [isSimulated])

  // Dev preview only: advance a simulated download in place of the downloads API.
  useEffect(() => {
    if (!isSimulated || item?.phase !== 'downloading') {
      return
    }

    const step = (item.total * PREVIEW_TICK_MS) / PREVIEW_DURATION_MS
    const timer = window.setInterval(() => {
      setItem((current) => {
        if (!current || current.phase !== 'downloading') {
          return current
        }

        const received = Math.min(current.total, current.received + step)
        return received >= current.total
          ? { ...current, received: current.total, phase: 'done' }
          : { ...current, received }
      })
    }, PREVIEW_TICK_MS)

    return () => window.clearInterval(timer)
  }, [isSimulated, item?.phase, item?.total])

  useEffect(() => {
    if (item?.phase !== 'done') {
      return
    }

    const timer = window.setTimeout(
      () => setItem(null),
      opened ? OPENED_DWELL_MS : DONE_DWELL_MS,
    )

    return () => window.clearTimeout(timer)
  }, [item?.phase, item?.id, opened])

  const send = useCallback((action: DownloadAction) => {
    portRef.current?.postMessage({
      type: DSN_DOWNLOAD_REQUEST,
      action,
    } satisfies DownloadRequest)
  }, [])

  const startPreviewDownload = useCallback(() => {
    setOpened(false)
    setItem((current) => previewDownload(current?.filename))
  }, [])

  const pause = useCallback(() => {
    if (!isSimulated) {
      send('pause')
      return
    }

    setItem((current) =>
      current?.phase === 'downloading' ? { ...current, phase: 'paused' } : current,
    )
  }, [isSimulated, send])

  const resume = useCallback(() => {
    if (!isSimulated) {
      send('resume')
      return
    }

    setItem((current) =>
      current?.phase === 'paused' ? { ...current, phase: 'downloading' } : current,
    )
  }, [isSimulated, send])

  const cancel = useCallback(() => {
    if (!isSimulated) {
      send('cancel')
      return
    }

    setItem(null)
  }, [isSimulated, send])

  const retry = useCallback(() => {
    setOpened(false)

    if (!isSimulated) {
      send('retry')
      return
    }

    setItem((current) => previewDownload(current?.filename))
  }, [isSimulated, send])

  const downloadAgain = useCallback(() => {
    setOpened(false)

    if (!isSimulated) {
      send('again')
      return
    }

    setItem((current) => previewDownload(current?.filename))
  }, [isSimulated, send])

  const openFile = useCallback(() => {
    setOpened(true)

    if (!isSimulated) {
      send('open')
    }
  }, [isSimulated, send])

  const simulateInterruption = useCallback(() => {
    if (!isSimulated) {
      return
    }

    setItem((current) =>
      current ? { ...current, phase: 'error', canResume: false } : current,
    )
  }, [isSimulated])

  return {
    isSimulated,
    item,
    progress: item ? downloadProgress(item) : 0,
    pause,
    resume,
    cancel,
    retry,
    openFile,
    downloadAgain,
    startPreviewDownload,
    simulateInterruption,
  }
}
