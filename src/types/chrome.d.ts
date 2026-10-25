type ChromeDownloadState = 'in_progress' | 'interrupted' | 'complete'

type ChromeDownloadItem = {
  id: number
  filename: string
  url: string
  state: ChromeDownloadState
  paused: boolean
  canResume: boolean
  totalBytes: number
  receivedBytes: number
  startTime: number
  error?: string
}

type ChromeDownloadDelta = {
  id: number
  filename?: { current?: string }
  state?: { current?: ChromeDownloadState }
  paused?: { current?: boolean }
  canResume?: { current?: boolean }
  totalBytes?: { current?: number }
  receivedBytes?: { current?: number }
  error?: { current?: string }
}

type ChromePort = {
  name: string
  postMessage: (message: unknown) => void
  disconnect: () => void
  onMessage: {
    addListener: (listener: (message: unknown) => void) => void
  }
  onDisconnect: {
    addListener: (listener: () => void) => void
  }
}

declare const chrome: {
  runtime: {
    id: string
    onInstalled: {
      addListener: (listener: () => void) => void
    }
    onMessage: {
      addListener: (
        listener: (
          message: unknown,
          sender: unknown,
          sendResponse: (response?: unknown) => void,
        ) => boolean | void,
      ) => void
    }
    onConnect: {
      addListener: (listener: (port: ChromePort) => void) => void
    }
    connect: (info?: { name?: string }) => ChromePort
    sendMessage: (message: unknown) => Promise<unknown>
  }
  downloads: {
    search: (query: {
      id?: number
      limit?: number
      orderBy?: string[]
      state?: ChromeDownloadState
    }) => Promise<ChromeDownloadItem[]>
    pause: (id: number) => Promise<void>
    resume: (id: number) => Promise<void>
    cancel: (id: number) => Promise<void>
    open: (id: number) => Promise<void>
    erase: (query: { id: number }) => Promise<number[]>
    download: (options: { url: string }) => Promise<number>
    onCreated: {
      addListener: (listener: (item: ChromeDownloadItem) => void) => void
    }
    onChanged: {
      addListener: (listener: (delta: ChromeDownloadDelta) => void) => void
    }
    onErased: {
      addListener: (listener: (id: number) => void) => void
    }
  }
}
