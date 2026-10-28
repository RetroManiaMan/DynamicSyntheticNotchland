# DSN — Dynamic Synthetic Notchland

**Your browser has a doorway. Welcome to Notchland.**

DSN is a Chromium browser extension that transforms the familiar browser experience with a dynamic, interactive notch and a custom new-tab environment. Built around a distinctive dark interface and vibrant green identity, DSN brings media controls, search, quick actions, customization, and Focus Mode into one cohesive experience.

**Latest release: v0.2.2 — Personal**

<!-- DSN ADVERTISEMENT VIDEO
Upload dsn-ad.mp4 to GitHub and replace the link below with the video URL GitHub generates.
Keep this video in the README; the installation guide belongs on the v0.2.2 release page.
-->

### 🎬 Watch the DSN Advertisement

https://github.com/user-attachments/assets/292872ad-e2c7-4b4f-b8a0-d4ec98a153d8

---

## ✨ Explore DSN

DSN is designed around one idea:

> The notch is the doorway. Notchland is the environment.

The dynamic notch provides quick access to useful tools without turning the browser into a cluttered dashboard. NotchTab extends that experience into a dedicated new-tab environment, while Settings lets you tailor DSN to your preferences.

## 🚀 Features

### Dynamic Notch

- Expandable interface designed to stay compact until you need it.
- Search, commands, and quick actions.
- Live date and time information.
- Flexible positioning: top, bottom, left, right, or a freely positioned notch.
- Keyboard-friendly interactions and reduced-motion support.

### 🎵 Dynamic Media Experience

- A compact media-active notch with artwork and track information when available.
- A hover mini-player and a dedicated expanded Media view.
- Playback controls where supported by the source page.
- Artwork-driven accent colors with smooth transitions and a DSN-green fallback.
- Favorites and a local media library.
- Media information remains available while playback is paused and disappears when the source session ends.

Previous/next controls depend on the media site's registered handlers. DSN does not pretend unsupported controls will work.

### 🔎 Search, Commands, and Quick Access

- Search from the notch.
- Commands for supported browser actions.
- A custom NotchTab page for a more focused starting point.
- Quick access to frequently used destinations.

### 🎯 Focus Mode

- Block websites you choose, including their subdomains.
- Use `/block` and `/unblock` from the notch where supported.
- Optional strict mode removes the “Continue anyway” option.

Focus Mode is a self-management tool, not a tamper-proof restriction.

### 🎨 Make DSN Yours

- Dark, green-accented visual design.
- True-black AMOLED theme.
- Customizable notch placement.
- Settings for general behavior, appearance, search, media, focus, shortcuts, privacy, and account-related options.
- An optional lyrics integration.

### 🎼 Optional Lyrics

DSN can retrieve synchronized lyrics through [LRCLIB](https://lrclib.net). Lyrics are off by default. When enabled, track title, artist, and duration are sent to LRCLIB only when you open lyrics for a track.

### 💬 Feedback

DSN includes an occasional, dismissible feedback prompt. Feedback is saved locally in this version; automatic GitHub issue creation requires a future secure backend.

---

## 📦 Installation

You can install DSN from the packaged release by loading the extension into a Chromium-based browser.

1. Download the **DSN v0.2.2 extension ZIP** from the [Releases](../../releases) page.
2. Extract the ZIP into a folder you can keep on your computer.
3. Open `chrome://extensions` in Chrome, or `edge://extensions` in Microsoft Edge.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Choose the extracted folder containing `manifest.json`.
7. Open a new tab to explore NotchTab, then visit a supported webpage to try the notch.

Keep the extracted folder in place while using the extension. If you download an updated release, extract it into a new folder and load or update the extension as appropriate.

**Note:** DSN requires broad website access to display its notch across pages and detect media sessions. Review the requested permissions before enabling it.

## 🔐 Privacy

Privacy matters. DSN is designed to avoid unnecessary data collection.

- No analytics are included.
- Favorites, library items, and settings are stored locally.
- Media metadata is used to power the media interface.
- Artwork may be fetched by the extension to display artwork and derive its accent color.
- Lyrics requests send track information to LRCLIB only when lyrics are explicitly opened and the feature is enabled.
- Feedback submissions are stored locally in this version.

DSN does not currently provide account synchronization or cloud profiles. Website permissions and external-service behavior should be reviewed before use.

## 🛠️ Development

### Requirements

- Node.js and npm
- A Chromium-based browser for manual testing

### Build from source

```bash
npm install
npm run typecheck
npm run test:unit
npm run build
```

The production extension is generated in `dist/`.

To load a development build, open `chrome://extensions`, enable Developer mode, select **Load unpacked**, and choose the generated `dist/` directory.

### Tests

```bash
npm run test:unit
npm run build:test
npm run test:e2e
```

End-to-end tests require a compatible Chromium binary. Follow the project's test scripts and configuration if your installed browser does not support extension loading through automation.

## 🧭 Current Status

**v0.2.2 — Personal**

This release focuses on the dynamic media experience, customization, Focus Mode, and the foundations of a more personal browser interface.

### Known limitations

- Media detection depends on how the source webpage exposes its media session.
- Previous/next controls work only when the page provides the relevant handlers.
- Media hidden inside certain shadow DOMs or detached audio elements may not be detected.
- Lyrics availability and matching depend on LRCLIB.
- Feedback is stored locally; GitHub issue creation requires a secure backend.
- Accounts and profiles are not implemented yet. They are planned alongside a future DSN AI assistant release.

## 🗺️ What's Next?

DSN is actively evolving. Future release plans will be announced when they are ready.

The long-term goal is to make Notchland a useful, personal browser environment while preserving the clean, focused DSN experience.

## 🙌 Credits

DSN's three-tier media notch, placement options, and Focus Mode were inspired by **Glance**, a cross-browser Dynamic Island extension created by **Akshar Srijan**. Thank you for the inspiration. DSN's implementation and visual design are its own.

- Portfolio: https://akshars07.github.io/
- Support: https://ko-fi.com/aksharsrijan
- LinkedIn: https://www.linkedin.com/in/akshar-srijan-863339250/

## 📄 License

- Source code: see [`LICENSE`](LICENSE).
- Design assets and documentation: see [`LICENSE-ASSETS`](LICENSE-ASSETS).

---

**DSN — Dynamic Synthetic Notchland**  
*Precision in the interface. Freedom in the experience.*
