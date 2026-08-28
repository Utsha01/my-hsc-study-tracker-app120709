# HSC Pinnacle Ultra — Turn This Folder into an Android APK

This project is a standard **Vite + React** app (offline-first, all data in
localStorage). Wrap the production build with **Capacitor** to get a real
Android app.

## 1. Build the web app

```bash
npm install
npm run build
```

This outputs the ready-to-ship web app into the `dist/` folder.

## 2. Add Capacitor (one-time)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "HSC Pinnacle Ultra" com.yourname.hscpinnacle --web-dir=dist
```

## 3. Add the Android platform

```bash
npm install @capacitor/android
npx cap add android
```

This creates an `android/` folder (a full Android Studio project) next to this file.

## 4. Sync your web build into it

```bash
npm run build
npx cap sync
```

## 5. Build the APK

Open the `android/` folder in **Android Studio**, then:

- **Debug APK (for testing on your phone):**
  `Build → Build App Bundle(s) / APK(s) → Build APK(s)`
  → find it at `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK:** `Build → Generate Signed App Bundle / APK` and follow the wizard.

No Android Studio? From a terminal inside the `android/` folder:

```bash
./gradlew assembleDebug
```

## Tips

- The app is a **PWA** too — you can also just host `dist/` anywhere
  (Netlify/Vercel/GitHub Pages) and use "Add to Home Screen" on Android.
- The router uses hash-based routing, so it works offline inside the APK
  with no server config.
- App icon lives at `public/icons/icon-512.png`; Android Studio's
  *Image Asset Studio* can regenerate all mipmap sizes from it.
