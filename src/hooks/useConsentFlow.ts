import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { AdMob, AdmobConsentStatus } from "@capacitor-community/admob";

/**
 * Runs the Google AdMob UMP consent flow on app mount.
 * Only executes in native Android (Capacitor) context — no-op in PWA/browser.
 * All errors are swallowed so consent failures cannot crash the app.
 */
export const useConsentFlow = () => {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;

    (async () => {
      try {
        const consentInfo = await AdMob.requestConsentInfo();

        if (
          consentInfo.isConsentFormAvailable &&
          consentInfo.status === AdmobConsentStatus.REQUIRED
        ) {
          try {
            await AdMob.showConsentForm();
          } catch (_) {
            // ignore – consent form failure
          }
        }

        try {
          await AdMob.initialize({ initializeForTesting: false });
        } catch (_) {
          // ignore – AdMob init failure
        }
      } catch (_) {
        // ignore – consent info failure
      }
    })();
  }, []);
};
