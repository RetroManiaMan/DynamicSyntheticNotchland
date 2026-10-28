# DSN: Dynamic Synthetic Notchland

A Chromium extension that puts a compact, dark notch on every page and a calm new-tab page behind it.
The notch is the doorway; Notchland is the environment.

**Version 0.2.2, "Personal"**

## Install (unpacked)

```bash
npm install
npm run build          # type-checks, then builds to dist/
```

Open `chrome://extensions`, turn on **Developer mode**, choose **Load unpacked**, and select `dist/`.

## What's in 0.2.2

- **Dynamic media notch.** The notch has three media tiers: a compact pill (artwork, title, equaliser), a hover mini-player, and the full Media view. It appears when a page plays media, stays when media is paused, and goes away when the source tab closes or navigates.
- **Dynamic media accent.** The accent is derived from the artwork (hue histogram, normalised, contrast-checked against the DSN surface) and fades in and out. It only tints media UI; the rest of DSN stays green. Falls back to green when there is no artwork, and to a neutral for greyscale artwork.
- **Real controls only.** Play/pause, seek, mute/volume and repeat-this-track act on the page's media element. Previous/next call the handlers the page registered with the Media Session API, and are disabled when the page registered none. Shuffle is not offered: the browser has no API for it.
- **Lyrics (opt-in).** Synced lyrics from [LRCLIB](https://lrclib.net). Off by default. When on, the track title, artist and length are sent to LRCLIB, and only after you open lyrics for a track.
- **Placement.** Top, bottom, left, right, or free (drag anywhere; arrow keys work on the grip button).
- **True black (AMOLED).** Pure-black surfaces and no accent wash.
- **Focus Mode.** Blocks navigation to sites you list (and their subdomains) with a calm page. Strict mode removes "Continue anyway". `/block` and `/unblock` work from the notch. This is a self-control tool, not a lock.
- **Favorite / Save to library.** Stored locally. Nothing is synced.
- **Settings.** One options page, opened from the extension icon or the NotchTab gear: General, Appearance, Notch, Search, Media, Focus, Shortcuts, Privacy, Account.
- **Feedback prompt.** Occasional and dismissible: never before the third NotchTab visit, never within 30 days of a dismissal. Submissions are saved locally only.

## Architecture

```
src/
  shared/      settings, hosts, colour extraction, LRC parsing, library, message protocol (pure, unit-tested)
  background/  service worker: media hub, artwork + accent, lyrics, Focus Mode rules
  content/     the notch (vanilla TS, one bundle) + media reporter + MAIN-world Media Session bridge
  settings/    Settings page (React)
  blocked/     Focus Mode blocked page
public/        NotchTab + feedback prompt (legacy hand-written JS, not yet ported) and icons
scripts/       build.mjs
tests/         unit/ (node:test) and e2e/ (Playwright driving a real Chromium)
```

Media flow: a page-side reporter (every frame) sends small snapshots on events, not on a timer. The service worker
validates them, fetches artwork once, extracts the accent, and mirrors the sessions into `chrome.storage.session`.
Every tab's notch watches that storage key, so a terminated service worker loses nothing and no tab holds a
connection that could drop. Progress is extrapolated locally from the last sample.

The content script, the MAIN-world bridge and the service worker are each built as a single-file bundle (content
scripts cannot import shared chunks). The React pages are built separately. See `scripts/build.mjs`.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Settings, library, and the media hub (session storage). |
| `declarativeNetRequestWithHostAccess` | Focus Mode redirects. |
| Host access to all sites | Show the notch on pages and notice media. DSN reads media title, artist, artwork and playback state only. |

`blocked.html` and `blocked-assets/*` are web-accessible so a link on another site can be redirected to them. A side
effect is that sites can detect that DSN is installed.

## Privacy

No analytics. Nothing is uploaded unless you turn on lyrics. Artwork is fetched once by the service worker from the
site that is playing the media. The notch's shadow root is closed in production builds, so page scripts cannot read
what you type.

## Develop and test

```bash
npm run typecheck
npm run test:unit
npm run build:test     # builds dist-test/ with an open shadow root and a local lyrics stub
npm run test:e2e       # needs a Chromium that still supports --load-extension (set DSN_CHROMIUM)
```

Branded Chrome 137+ ignores `--load-extension`. Use Chromium, Chrome for Testing, or an ungoogled-chromium build for
the end-to-end tests. `node tests/e2e/run.mjs --prod` smoke-tests the production build.

## Known limitations

- Players that use a detached `new Audio()` (never added to the page) are not detected: their events never reach the
  document. Supporting them would need instrumentation in the page's own JS world.
- Media inside a shadow DOM is not detected.
- Prev/next work only where the site registers Media Session handlers.
- Lyrics depend on LRCLIB having the track; matching uses the title and artist the page reports.
- NotchTab and the feedback prompt are still the hand-written 0.2.1 scripts, with small fixes. Feedback is saved
  locally; creating GitHub issues needs a backend that holds the token.
- Accounts are not implemented; Settings says so.

## Credits

DSN's three-tier media notch, placement options and Focus Mode were inspired by **Glance**, a cross-browser
Dynamic Island extension created by **Akshar Srijan**. Thank you for the ideas. The implementation, code and
visual design here are DSN's own.

- Portfolio: [akshars07.github.io](https://akshars07.github.io/)
- Support his work: [ko-fi.com/aksharsrijan](https://ko-fi.com/aksharsrijan)
- LinkedIn: [Akshar Srijan](https://www.linkedin.com/in/akshar-srijan-863339250/)

See `LICENSE` and `LICENSE-ASSETS`.
