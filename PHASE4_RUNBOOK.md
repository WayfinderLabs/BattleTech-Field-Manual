# Phase 4 — Capacitor Android Build Runbook

## Prerequisites
- Node.js LTS installed
- Android Studio Panda installed
- Java JDK 17 installed
- Android SDK API 35 installed via SDK Manager

## Step 1 — Clone the repo
```bash
git clone https://github.com/WayfinderLabs/BattleTech-Field-Manual-Companion.git
cd BattleTech-Field-Manual-Companion
```

## Step 2 — Install dependencies
```bash
npm install
```

## Step 3 — Build the web app
```bash
npm run build
```

## Step 4 — Add Android platform
```bash
npx cap add android
```

## Step 5 — Sync web build into Android project
```bash
npx cap sync android
```

## Step 6 — Deploy app icons
Copy files from BTFM_Icons_Final.zip into:
- android/app/src/main/res/mipmap-mdpi/ic_launcher.png
- android/app/src/main/res/mipmap-hdpi/ic_launcher.png
- android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
- android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
- android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

## Step 7 — Open in Android Studio
```bash
npx cap open android
```

## Step 8 — Generate signed AAB
In Android Studio:
Build → Generate Signed App Bundle → Android App Bundle
Create a new keystore — save the password somewhere safe.
Build type: Release

## Step 9 — Upload to Google Play Console
Upload the .aab file from:
android/app/release/app-release.aab
