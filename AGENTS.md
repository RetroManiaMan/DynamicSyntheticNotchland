# DSN — Dynamic Synthetic Notchland

## What this is
A Manifest V3 Chrome extension (React + TypeScript + Vite) that injects a shadow-root "notch" UI into pages. There is no backend, database, or external service — it is a pure frontend project.

## Dev preview
`vite dev` serves `index.html` → `src/main.tsx` → `App` → `DSNApp`, rendering the notch UI directly in the browser. This is the preview path; the extension's content-script/background entry points (`src/content/index.tsx`, `src/background/service-worker.ts`) are only used in the production build (`bun run build`).

## Stack
- Runtime: Bun (lockfile is `bun.lock`)
- Framework: React 19 + Vite 8
- No environment variables or secrets required

## Building and linting

Run these inside the compose service — the sandbox host has no Bun/Node:

- `docker compose -f docker-compose.base44.yml exec -T web sh -c "cd /app && bun run build"` — `tsc -b` plus the extension bundle
- `docker compose -f docker-compose.base44.yml exec -T web sh -c "cd /app && bun run lint"` — oxlint

- `docker compose -f docker-compose.base44.yml exec -T web sh -c "cd /app && bun run test"` — vitest + jsdom unit tests (config in `vitest.config.ts`)

`vite dev` (the preview path) does not typecheck, so run the build before shipping.
The four remaining lint warnings are pre-existing ones in the legacy v0.1 files
(`content.js`, `notchtab.js`).

Keep `dist/background.js` and `dist/content.js` free of `import` statements
(`grep -c '^import' dist/background.js dist/content.js` must be 0). Rollup hoists
any runtime module shared by both entries into a hashed chunk, and MV3 content
scripts cannot use ES module imports — so `src/background/service-worker.ts`
imports types only and keeps its protocol strings local.

## Downloads and battery (v0.2.3)

- Content scripts cannot call `chrome.downloads`. The background service worker
  owns it and streams the current download over a runtime port named
  `dsn-downloads`; message shapes and the phase mapping live in
  `src/shared/download.ts`. The manifest needs the `downloads` permission.
- Battery readings come from `navigator.getBattery()` in the extension context.
  In the dev preview (a plain web page, with no extension APIs) both subsystems
  fall back to a simulated source, and the expanded notch shows a “Design
  preview” row whose chips walk through every state — simulated battery levels
  and a simulated download, including an interruption.
- Battery preferences (alerts, warning level, battery saver) currently render in
  the notch's battery panel (`src/content/components/BatteryPanel.tsx`);
  `useBatteryManager` is the single source of truth for them, so the controls can
  move to a settings menu without touching the alert logic.
- `navigator.getBattery()` only exists in a document context, so battery readings
  live in the content script (`useBatteryStatus`), not the service worker. The
  worker owns downloads only, including re-adopting a download when a change
  event wakes it from suspension.
- Dwell timings (2 min after a download finishes, 30 s after the file is opened)
  are constants at the top of `src/content/hooks/useDownloads.ts`.

## Verify it works
- `docker compose -f docker-compose.base44.yml up -d --build`
- Curl `localhost:3000` — should return the Vite-served HTML with the notch UI
- The notch appears as a dark pill at the top-center; click or hover to expand
