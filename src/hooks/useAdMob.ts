import { useEffect } from 'react';

declare global {
  interface Window {
    admob?: {
      banner: {
        show: (options: object) => Promise<void>;
      };
    };
  }
}

const BANNER_AD_UNIT_ID = 'ca-app-pub-6177451660679409/7116883398';

export function useAdMob() {
  useEffect(() => {
    const initAdMob = async () => {
      try {
        const { AdMob, BannerAdSize, BannerAdPosition } = await import(
          '@capacitor-community/admob'
        );

        await AdMob.initialize({
          initializeForTesting: false,
        });

        await AdMob.showBanner({
          adId: BANNER_AD_UNIT_ID,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: false,
        });
      } catch (e) {
        // AdMob not available in web/PWA context — fail silently
        console.log('AdMob not available in this context');
      }
    };

    initAdMob();
  }, []);
}
