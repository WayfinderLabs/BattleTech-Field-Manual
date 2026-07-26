## versionCode 34 - 26-Jul-26
- Changed: Capacitor 6 to 8 migration - all @capacitor/* packages and @capacitor-community/admob bumped to 8.x
- Changed: targetSdkVersion and compileSdkVersion 35 to 36 - meets Google Play API 36 requirement effective 31-Aug-2026
- Changed: minSdkVersion 22 to 24 per Capacitor 8 minimum - drops Android 5.1 through 6.0
- Changed: Android Gradle Plugin 8.2.1 to 8.13.0, Gradle wrapper 8.2.1 to 8.14.3
- Changed: Gradle jvmargs raised from 1536m to 4096m to prevent OOM at compileSdk 36
- Added: variables.gradle, build.gradle, gradle.properties and gradle-wrapper.properties promoted into android-patches/ - now version controlled and survive android/ regeneration
- Added: four guarded copy blocks in build-android.bat step 9 for the promoted gradle files
- Added: navigation and density to AndroidManifest activity configChanges - prevents WebView reload on resize and restart on bluetooth keyboard connect
- Removed: adjustMarginsForEdgeToEdge from capacitor.config.ts - config key removed entirely in Capacitor 8
- Removed: inert buildOptions minSdkVersion and targetSdkVersion keys from capacitor.config.ts - buildOptions is the signing block and never had SDK keys
- Fix: build-android.bat post-build reminder text corrected from compileSdkVersion=35 to 36
- Note: manual edge-to-edge handling retained in MainActivity.java rather than migrating to the Capacitor 8 System Bars plugin - validated on Android 16
- Note: validated on Samsung S22+ (Android 16 / One UI 8) - splash, icon, all four back navigation routes, edge-to-edge rendering, interstitial and rewarded ads

## versionCode 33 - 23-Jul-26
- Changed: MainActivity.java back handling migrated from onBackPressed override to OnBackPressedDispatcher - onBackPressed is never called at targetSdk 36 on Android 16
- Changed: build-android.bat reconciled after local/GitHub split brain, npm install added as step 3, android-patches restores now guarded, JAVA_HOME corrected
- Note: BackButtonHandler.tsx unchanged - already listens on window backButton event which triggerJSEvent dispatches
- Note: validated on Samsung S20+ - weapon detail back, mech detail back, loadout dirty state prompt, double tap to exit toast

## versionCode 32 — 13-Jun-2026
- Fix: Android long-press text selection toolbar suppressed on Save Loadout inputs

## versionCode 30 — 12-Jun-2026
- Fix: toast positioning — consolidated custom LOADOUT SAVED toast into sonner, upgraded sonner to v2, mobileOffset clears status bar on all devices
- Changed: removed hand-rolled toast system from LoadoutBuilderScreen

## versionCode 30 — 12-Jun-2026
- Fix: Sonner toast CSS override — toasts now clear the Android status bar on all devices (offset prop was ignored on mobile widths)

## versionCode 29 — 12-Jun-2026
- Fix: race condition in useInterstitial — adInFlight guard prevents stacked/layered interstitials
- Changed: premium ad-free indicators — AD-FREE label in TopBar + amber line atop bottom nav
- Removed: amber dot above LOADOUT tab (replaced by the above)

## versionCode 28 — 12-Jun-2026
- Added: rewarded ad opt-in dialog — appears after interstitial dismiss, offers 3 hrs ad-free
- Added: interstitial Dismissed listener in useInterstitial triggers the offer dialog
- Changed: RewardedAdContext extended with offerVisible/openOffer/closeOffer state
- Fix: Toaster offset added for status bar safe area — toasts no longer clipped on S20+

## versionCode 27 — 09-Jun-2026
- Fix: Toast position moved to top-center — no longer obscured by bottom navigation bar on S20+ or S21+

## versionCode 26 — 09-Jun-2026
- Fix: Toaster component added to App.tsx — toast notifications now render on screen
- Fix: Back button toast ("Press back again to exit") should now display correctly on list screens

## versionCode 25 — [today's date]
- Fix: BackButtonHandler swapped to window.addEventListener to match MainActivity.java triggerJSEvent
- Fix: Handler signature changed to () => void, let handle declaration removed