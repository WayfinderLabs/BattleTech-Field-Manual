## versionCode 33 - 23-Jul-26
- [ ] describe change 1
- [ ] describe change 2

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