import type { DownloadAction, DownloadRequest, DsnDownload } from '../shared/download'

/**
 * This entry deliberately imports types only. MV3 content scripts cannot use ES
 * module imports, so the built `background.js` and `content.js` must stay
 * self-contained — any runtime module shared by both entries would be hoisted
 * by Rollup into a chunk that both would then `import`.
 */
const DSN_DOWNLOAD_PORT = 'dsn-downloads'
const DSN_DOWNLOAD_REQUEST = 'dsn:download:request'
const DSN_DOWNLOAD_UPDATE = 'dsn:download:update'

/** An interrupted download older than this is not worth surfacing in the notch. */
const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000

let latest: ChromeDownloadItem | null = null
let current: DsnDownload | null = null
const ports = new Set<ChromePort>()

function fileNameFor(item: ChromeDownloadItem): string {
  const name = item.filename?.split(/[\\/]/).filter(Boolean).pop()
  return name ?? 'download'
}

function toDsnDownload(item: ChromeDownloadItem): DsnDownload {
  const phase =
    item.state === 'complete'
      ? 'done'
      : item.state === 'interrupted'
        ? 'error'
        : item.paused
          ? 'paused'
          : 'downloading'

  return {
    id: item.id,
    filename: fileNameFor(item),
    url: item.url,
    received: item.receivedBytes ?? 0,
    total: item.totalBytes ?? 0,
    phase,
    canResume: Boolean(item.canResume),
  }
}

function publish() {
  for (const port of ports) {
    port.postMessage({ type: DSN_DOWNLOAD_UPDATE, item: current })
  }
}

function setLatest(item: ChromeDownloadItem | null) {
  latest = item
  current = item ? toDsnDownload(item) : null
  publish()
}

function applyDelta(delta: ChromeDownloadDelta) {
  if (!latest || latest.id !== delta.id) {
    return
  }

  setLatest({
    ...latest,
    filename: delta.filename?.current ?? latest.filename,
    state: delta.state?.current ?? latest.state,
    paused: delta.paused?.current ?? latest.paused,
    canResume: delta.canResume?.current ?? latest.canResume,
    totalBytes: delta.totalBytes?.current ?? latest.totalBytes,
    receivedBytes: delta.receivedBytes?.current ?? latest.receivedBytes,
    error: delta.error?.current ?? latest.error,
  })
}

/** Recovers the download a fresh panel should show after the worker restarts. */
async function findCurrent(): Promise<ChromeDownloadItem | null> {
  const items = await chrome.downloads.search({ limit: 5, orderBy: ['-startTime'] })
  const cutoff = Date.now() - RECENT_WINDOW_MS

  return (
    items.find(
      (item) =>
        item.state === 'in_progress' ||
        (item.state === 'interrupted' && item.startTime > cutoff),
    ) ?? null
  )
}

async function handleGet() {
  if (!latest || latest.state === 'complete') {
    setLatest(await findCurrent())
    return
  }

  publish()
}

async function handleAction(action: DownloadAction) {
  if (action === 'get') {
    await handleGet()
    return
  }

  const item = latest
  if (!item) {
    return
  }

  switch (action) {
    case 'pause':
      await chrome.downloads.pause(item.id)
      break
    case 'resume':
      await chrome.downloads.resume(item.id)
      break
    case 'cancel':
      await chrome.downloads.cancel(item.id)
      await chrome.downloads.erase({ id: item.id })
      setLatest(null)
      break
    case 'retry':
      if (item.canResume) {
        await chrome.downloads.resume(item.id)
      } else {
        await chrome.downloads.download({ url: item.url })
      }
      break
    case 'open':
      await chrome.downloads.open(item.id)
      break
    case 'again':
      await chrome.downloads.erase({ id: item.id })
      await chrome.downloads.download({ url: item.url })
      break
  }
}

chrome.downloads.onCreated.addListener((item) => {
  setLatest(item)
})

/** A change event can wake a suspended worker with nothing tracked; pick the download back up. */
async function adopt(id: number) {
  const [item] = await chrome.downloads.search({ id })
  if (item?.state === 'in_progress') {
    setLatest(item)
  }
}

chrome.downloads.onChanged.addListener((delta) => {
  if (!latest) {
    adopt(delta.id).catch((error) => {
      console.warn('DSN could not re-adopt download', delta.id, error)
    })
    return
  }

  applyDelta(delta)
})

chrome.downloads.onErased.addListener((id) => {
  if (latest?.id === id) {
    setLatest(null)
  }
})

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== DSN_DOWNLOAD_PORT) {
    return
  }

  ports.add(port)
  port.onMessage.addListener((message) => {
    const request = message as DownloadRequest
    if (request?.type !== DSN_DOWNLOAD_REQUEST) {
      return
    }

    handleAction(request.action).catch((error) => {
      console.warn('DSN download action failed', request.action, error)
    })
  })
  port.onDisconnect.addListener(() => {
    ports.delete(port)
  })
})

chrome.runtime.onInstalled.addListener(() => {
  console.info('DSN installed')
})
