<div align="center">

<img src="public/icons/icon-512.png" alt="HSC Pinnacle Ultra icon" width="128" height="128" />

# HSC Pinnacle Ultra

**Offline study tracker for HSC Science students in Bangladesh — React + Vite, shipped as an Android APK.**

Subjects, syllabus chapters, a focus timer, insights and an exam countdown.
No account. No server. No internet needed after install.

[![Build Android APK](https://github.com/Utsha01/my-hsc-study-tracker-app120709/actions/workflows/android.yml/badge.svg)](https://github.com/Utsha01/my-hsc-study-tracker-app120709/actions/workflows/android.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Utsha01/my-hsc-study-tracker-app120709/pulls)
[![Offline first](https://img.shields.io/badge/offline--first-100%25-blue)](#data--privacy)

</div>

---

## What it does

| Screen | Route | You get |
| --- | --- | --- |
| **Home** | `#/` | Time-of-day greeting with your name, big **days-to-exam countdown**, stat tiles (`TODAY` minutes · `STREAK` days · `TASKS OPEN`), and a todo list with add / tick / delete |
| **Subjects** | `#/subjects` | All 7 default subjects with a summary progress ring and per-subject bars; add your own, delete any |
| **Subject detail** | `#/subjects/:id` | Papers (`1st Paper`, `2nd Paper`, or `Full Syllabus`) with every chapter as a checkbox; add or remove chapters |
| **Focus** | `#/timer` | A countdown timer with presets — **Pomodoro 25 · Short 15 · Deep 45 · Hour 60** — pick the subject you're studying; finishing logs a session (and vibrates on Android) |
| **Insights** | `#/insights` | 7-day activity bar chart, subject mastery bars, time distribution, 30-day activity heat strip, recent sessions |
| **Settings** | `#/settings` | Change your name and exam date, **export all data as JSON**, or reset everything |

Ships with Physics, Chemistry, Higher Math, Biology, ICT, English and Bangla — 7 subjects, every paper broken into chapters
(see [`src/data/syllabus.ts`](src/data/syllabus.ts)) — edit that one file to change every chapter in the app.

## Tech stack

Real versions from [`package.json`](package.json):

| Layer | Choice |
| --- | --- |
| Framework | React `19.2.6` + TypeScript `5.9.3` |
| Build | Vite `7.3.2` with `@vitejs/plugin-react` |
| Styling | Tailwind CSS `4.1.17` via `@tailwindcss/vite` (no PostCSS config), dark emerald glass tokens in `src/index.css` |
| State | zustand `5.0.15` with the `persist` middleware |
| Routing | react-router-dom `7.18.2` — **`HashRouter`**, on purpose (see [How the APK works](#how-the-apk-works)) |
| Charts | recharts `3.10.1` |
| Motion / icons | framer-motion, lucide-react |
| Toasts | sonner |
| Packaging | Capacitor 7 → Gradle `assembleDebug`, built in GitHub Actions |

## Quick start

You need **Node `^20.19.0 || >=22.12.0`** — that's Vite 7's own `engines` rule, copied from `package-lock.json`. Nothing else to install to run the web app: no Java, no Android SDK.

```bash
npm install
npm run dev        # local dev server
npm run build      # production build -> dist/index.html (one single file)
npm run preview    # serve the built output to check it
```

The build produces **one self-contained `dist/index.html`**: `vite-plugin-singlefile` inlines all JS and CSS, and `base: "./"` in [`vite.config.ts`](vite.config.ts) keeps every path relative. That single file is what gets wrapped into the APK, and it also means you can double-click `dist/index.html` and it works straight from the filesystem.

## Data & privacy

* Everything lives on the device in `localStorage` under the key **`hsc-pinnacle-storage`** (zustand `persist`, `version: 2`).
* The app makes **no network requests at runtime** — no analytics, no login, no sync. Airplane mode changes nothing.
* `Settings → Export` gives you a portable JSON snapshot (`app`, `exportedAt`, `settings`, `subjects`, `sessions`, `todos`, `dailyLogs`).
* `Settings → Clear cache` restores the built-in defaults. There is **no import button yet** — it's on the list below.

## How the APK works

No build tools are installed on any developer machine. Pushing to `main` is the entire release process:

```
push to main
  └─> .github/workflows/android.yml   (~2-3 min on GitHub's free runners)
        npm ci → vite build → cap init/add/sync → ./gradlew assembleDebug
        └─> app-debug.apk  (≈4.4 MB)  ->  build artifact, plus a Release once the publish step is added
```

<details>
<summary><b>Getting the APK off GitHub (and why the artifact link needs a login)</b></summary>

* **Artifacts** — Actions → open the run → scroll to the bottom → click `app-debug-apk`. GitHub serves artifacts **only to a signed-in browser**, so the link 401s for anyone logged out, and they expire after 90 days. Keep a copy.
* **Releases** — one-click, no login, openable directly in your phone's browser. Needs the `Publish APK to a Release` step plus `permissions: contents: write` in the workflow. Once enabled, the newest build is always at:
  `…/releases/download/latest-apk/app-debug.apk`
* Installing a hand-built APK: tap the file → *Allow from this source* → **Install anyway** when Play Protect warns. That warning appears for every self-built app, not just this one.
* Heads-up on [`APK-GUIDE.md`](APK-GUIDE.md) at the repo root: it says `./gradlew assembleDebug` works without Android Studio. It does not — Gradle still needs the Android SDK and JDK 21. Treat the workflow above as the supported path, and that file as history.

</details>

<details>
<summary><b>The debug signing key trap (read this before your second build)</b></summary>

Each GitHub run gets a brand-new virtual machine, so Android regenerates `~/.android/debug.keystore`. A different key means a new APK **cannot install over** the old one — you'd have to uninstall first and wipe your study data. The fix is to cache `~/.android` under a fixed key:

```yaml
- name: Cache the debug signing key
  uses: actions/cache@v4
  with:
    path: ~/.android
    key: android-debug-keystore-v1
```

</details>

## Project layout

```
.
├── .github/workflows/android.yml   # the whole APK pipeline
├── index.html                      # Vite entry: title, PWA meta, Google Fonts
├── vite.config.ts                  # base "./", react + tailwind + singlefile
├── public/
│   ├── manifest.json               # standalone PWA, portrait, #000000 theme
│   └── icons/icon-512.png          # 512x512 app icon
└── src/
    ├── main.tsx                    # React root
    ├── App.tsx                     # HashRouter, routes, <Toaster>
    ├── index.css                   # Tailwind v4 import + theme tokens
    ├── pages/                      # Home · Subjects · SubjectDetail · Timer · Insights · Settings · NotFound
    ├── components/                 # BottomNav (5 tabs, Focus is the centre button) · ui.tsx
    ├── store/                      # useStudyStore.ts (zustand + persist) · types.ts
    ├── data/syllabus.ts            # default subjects, papers, chapters, DEFAULT_EXAM_DATE
    ├── lib/utils.ts                # date keys, countdown, greeting, clock format
    └── utils/cn.ts                 # clsx + tailwind-merge
```

State shape, if you want to extend it: `Subject { id, name, color, papers[] }` → `Paper { id, name, chapters[] }` → `Chapter { id, name, completed }`, plus `StudySession`, `Todo`, `DailyLog` and `AppSettings { profileName, examDate }`.

## Known limitations

- **Fonts need internet on first paint.** `index.html` pulls Space Grotesk / Inter / Hind Siliguri from Google Fonts; offline they fall back to the system typeface. Bundling the `.woff2` files locally is the obvious first fix.
- **Launcher icon and app name** come from `npx cap init "HSC Study Tracker" com.hscpinnacle.tracker` in the workflow, so Android shows a plain default icon. A real adaptive icon needs either `@capacitor/assets` or a committed `android/` folder.
- `DEFAULT_EXAM_DATE` is hardcoded to `2026-07-01`; users change it in Settings, but a fresh install always starts there.
- Debug builds only. Publishing to Google Play needs a **separate signed keystore** kept out of the repo, `assembleRelease`, and `targetSdk` current.
- Android only. Nothing here is iOS-ready — an `.ipa` needs macOS + Xcode.
- Bengali strings are not in the app yet even though the Bengali-capable font is loaded.

## Contributing

Small and focused works best here:

1. Fork, then `npm install && npm run dev`.
2. One feature per branch; `npm run build` must pass before you open a PR — the APK pipeline runs exactly that command, so a broken build means no APK for anyone.
3. 
