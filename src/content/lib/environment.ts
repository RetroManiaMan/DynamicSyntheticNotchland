/**
 * DSN runs in two places: as a Chrome extension content script, and as a plain
 * web page in the dev preview. Extension-only APIs (`chrome.downloads`,
 * `chrome.runtime` messaging) are missing in the preview, where DSN falls back
 * to a simulated source so the design stays visible.
 */
export function hasRuntimeMessaging(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime && chrome.runtime.id)
}
