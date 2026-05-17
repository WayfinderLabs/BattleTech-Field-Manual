import { useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-6695196307784459/3558537445';
const NAV_FLOOR = 8;
const COOLDOWN_MS = 180000;

export const useInterstitial = () => {
  const navCount = useRef(0);
  const lastShown = useRef(0);

  const recordNavigation = async () => {
    if (Capacitor.getPlatform() !== 'android') return;

    navCount.current += 1;

    if (navCount.current < NAV_FLOOR) return;
    if (Date.now() - lastShown.current < COOLDOWN_MS) return;

    try {
      await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_UNIT_ID });
      await AdMob.showInterstitial();
      lastShown.current = Date.now();
      navCount.current = 0;
    } catch {
      // silent — ad failures must never affect navigation
    }
  };

  return { recordNavigation };
};
