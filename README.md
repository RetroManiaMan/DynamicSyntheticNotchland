# DSN! ❇️

Dynamic Synthetic Notchland (DSN) is a Chrome extension that replaces the default new tab with a compact, green-and-black, Base44-inspired dashboard experience.

## 🟡 Version

DSN v0.2.3

## 🔋 What’s new in v0.2.3

- **Battery monitor** — the notch carries a live battery chip (level, charging state and time left), and the expanded notch has a Battery tab with the full readout
- **Battery manager** — alert toggle, low-battery warning level (10% / 20% / 30%), and a battery saver mode that strips glow and blur from the notch
- **Battery alerts** — low, critical and fully-charged notices show up in the notch itself, with the chip turning amber, red or lime
- **Download status** — while a file or image is downloading, the notch shows the file name with a progress bar along its bottom edge
- **Downloads tab** — a notch tab appears with the download (progress, pause/resume, cancel); when the file is done it offers *open* and *download again*, then closes itself; an interrupted download reads “Unable to finish download — Try again”
- Requires the `downloads` permission so DSN can watch browser downloads

## 🧪 Coming next (v0.2.4)

- A second progress bar for reading: a setting to see how much of a long article is left while you read

## 🌟 What’s new in v0.2.1

- Refined new-tab experience with a stronger DSN visual identity
- Expanded search field for a more prominent browser-native layout
- Smooth expandable sidebar interaction with reduced motion stiffness
- Quick Access bookmarks for frequently used websites
- Clean green/black styling inspired by the Base44 aesthetic
- DSN branding integrated into the sidebar state
- Removed the sidebar search action and edge clock from the final layout
- Updated extension packaging to remain compatible with Chrome Manifest V3 requirements

## ✅ Features

- Custom new-tab page override
- Sidebar navigation with expand/collapse behavior
- Search-first layout with a wider focus area
- Fast Quick Access bookmarks
- Minimal browser-native experience with DSN theming
- Lightweight extension structure with no inline runtime script required

## 🗄️ Installation

1. Open Chrome or Edge.
2. Go to chrome://extensions (or edge://extensions).
3. Enable Developer Mode.
4. Click Load unpacked.
5. Select this project folder.
6. Open a new tab to see the DSN interface.

## 🖼️ Pictures
<img width="1470" height="956" alt="Screenshot 2026-09-24 at 10 32 19 AM" src="https://github.com/user-attachments/assets/b384a90d-7516-4cd4-acfd-8b19908b80f4" />
<img width="1429" height="798" alt="Screenshot 2026-09-22 at 5 27 59 PM" src="https://github.com/user-attachments/assets/e8967441-9e72-4d15-9f2f-be0367de67dc" />
<img width="1429" height="798" alt="Screenshot 2026-09-22 at 5 28 11 PM" src="https://github.com/user-attachments/assets/e6e6b401-176b-4548-b7f2-d7ae8d99fbc1" />
<img width="1469" height="834" alt="Screenshot 2026-09-23 at 9 06 50 PM" src="https://github.com/user-attachments/assets/6a73c559-19dc-44ef-95d0-35bf86ad3b8f" />
<img width="1470" height="833" alt="Screenshot 2026-09-23 at 9 06 57 PM" src="https://github.com/user-attachments/assets/9b794a28-1c9a-4286-ba3a-b5998463f167" />
<img width="1470" height="834" alt="Screenshot 2026-09-24 at 10 05 39 AM" src="https://github.com/user-attachments/assets/4e9ae686-a56c-4159-96fe-04b36832fd11" />
<img width="1470" height="956" alt="Screenshot 2026-09-24 at 10 31 45 AM" src="https://github.com/user-attachments/assets/50c9b6e2-9532-4e43-8c35-a3d64d2c0452" />
<img width="1470" height="956" alt="Screenshot 2026-09-24 at 10 31 59 AM" src="https://github.com/user-attachments/assets/661d1ce5-8b99-41f4-96b5-d9a67971ec27" />


## 🏛️ Project structure

- manifest.json — Chrome extension manifest
- notchtab.html — new-tab entry page
- notchtab.css — DSN styling
- notchtab.js — runtime behavior for the page
- asset source files — additional UI/build source under the assets folder

## 🪪 Licensing

- Source code: MIT License — see LICENSE
- Design assets, documentation, screenshots, and other creative files: CC BY-SA 4.0 — see LICENSE-ASSETS

## 📝 Notes

This repository contains both code and design assets. The code is permissively licensed for reuse and modification, while the non-code visual/design content is shared under Creative Commons Attribution-ShareAlike 4.0.

## ⚡️ Status

The extension is currently aligned with the DSN v0.2.1 design direction and is ready for local installation and testing in Chrome-based browsers.
##
# For the best experience, KryptoBoltz suggests enabling vertical tabs (if supported) in your browser.
**Made with ❤️‍🔥 from KryptoBoltz, Base44, Chat, with VSCode!**
