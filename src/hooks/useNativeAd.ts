import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

const NATIVE_AD_UNIT_ID = 'ca-app-pub-6695196307784459/6560334212';

export interface NativeAdAssets {
  headline: string;
  body: string;
  callToAction: string;
  advertiser?: string;
  icon?: string;
}

export const useNativeAd = () => {
  const [adAssets, setAdAssets] = useState<NativeAdAssets | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return;

    const loadAd = async () => {
      setIsLoading(true);
      try {
        const result = await AdMob.requestNativeAd({ adId: NATIVE_AD_UNIT_ID });
        if (result) {
          setAdAssets({
            headline: result.headline ?? 'Sponsored',
            body: result.body ?? '',
            callToAction: result.callToAction ?? 'Learn More',
            advertiser: result.advertiser,
            icon: result.icon?.url,
          });
        }
      } catch {
        // silent — ad failure must never affect list rendering
      } finally {
        setIsLoading(false);
      }
    };

    loadAd();
  }, []);

  return { adAssets, isLoading };
};
