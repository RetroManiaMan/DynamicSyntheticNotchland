export type DownloadPhase = 'downloading' | 'paused' | 'done' | 'error'

export type DsnDownload = {
  id: number
  filename: string
  url: string
  received: number
  total: number
  phase: DownloadPhase
  canResume: boolean
}

export type DownloadAction =
  | 'get'
  | 'pause'
  | 'resume'
  | 'cancel'
  | 'retry'
  | 'open'
  | 'again'

export type DownloadRequest = {
  type: typeof DSN_DOWNLOAD_REQUEST
  action: DownloadAction
}

export type DownloadUpdate = {
  type: typeof DSN_DOWNLOAD_UPDATE
  item: DsnDownload | null
}

export const DSN_DOWNLOAD_PORT = 'dsn-downloads'
export const DSN_DOWNLOAD_REQUEST = 'dsn:download:request'
export const DSN_DOWNLOAD_UPDATE = 'dsn:download:update'

export function fileNameFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url)
    const name = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '')
    return name || 'download'
  } catch {
    return 'download'
  }
}

export function fileNameFor(item: ChromeDownloadItem): string {
  const name = item.filename?.split(/[\\/]/).filter(Boolean).pop()
  return name ?? fileNameFromUrl(item.url)
}

export function downloadPhase(item: ChromeDownloadItem): DownloadPhase {
  if (item.state === 'complete') {
    return 'done'
  }

  if (item.state === 'interrupted') {
    return 'error'
  }

  return item.paused ? 'paused' : 'downloading'
}

export function toDsnDownload(item: ChromeDownloadItem): DsnDownload {
  return {
    id: item.id,
    filename: fileNameFor(item),
    url: item.url,
    received: item.receivedBytes ?? 0,
    total: item.totalBytes ?? 0,
    phase: downloadPhase(item),
    canResume: Boolean(item.canResume),
  }
}

export function downloadProgress(item: DsnDownload): number {
  if (item.total > 0) {
    return Math.min(1, Math.max(0, item.received / item.total))
  }

  return item.phase === 'done' ? 1 : 0
}
