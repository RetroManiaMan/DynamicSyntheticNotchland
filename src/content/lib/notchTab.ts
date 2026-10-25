import type { NotchTab } from '../components/NotchTabs'

export type NotchTabChoice = {
  downloadId: number | null
  tab: NotchTab
}

/**
 * A download opens its own notch tab and the notch falls back to battery once it
 * closes; a tab the user picked by hand sticks for that download.
 */
export function resolveNotchTab(downloadId: number | null, choice: NotchTabChoice): NotchTab {
  if (downloadId === null) {
    return 'battery'
  }

  return choice.downloadId === downloadId ? choice.tab : 'downloads'
}
