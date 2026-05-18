import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

const REWARDED_AD_UNIT_ID = 'ca-app-pub-6695196307784459/3658838704';
const REWARD_DURATION_MS = 10800000; // 3 hours
const STORAGE_KEY = 'rewardedAdLastClaimed';

interface RewardedAdContextValue {
  rewardActive: boolean;
  showRewardedAd: () => Promise<void>;
}

const RewardedAdContext = createContext<RewardedAdContextValue>({
  rewardActive: false,
  showRewardedAd: async () => {},
});

export const RewardedAdProvider = ({ children }: { children: ReactNode }) => {
  const getRewardActive = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    return Date.now() - parseInt(stored, 10) < REWARD_DURATION_MS;
  };

  const [rewardActive, setRewardActive] = useState(getRewardActive);

  useEffect(() => {
    if (!rewardActive) return;
    const remaining = REWARD_DURATION_MS - (Date.now() - parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10));
    const timer = setTimeout(() => setRewardActive(false), remaining);
    return () => clearTimeout(timer);
  }, [rewardActive]);

  const showRewardedAd = async () => {
    if (Capacitor.getPlatform() !== 'android') return;
    try {
      await AdMob.prepareRewardVideoAd({ adId: REWARDED_AD_UNIT_ID });
      await AdMob.showRewardVideoAd();
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setRewardActive(true);
    } catch {
      // silent — ad failure must never affect app state
    }
  };

  return (
    <RewardedAdContext.Provider value={{ rewardActive, showRewardedAd }}>
      {children}
    </RewardedAdContext.Provider>
  );
};

export const useRewardedAdContext = () => useContext(RewardedAdContext);
