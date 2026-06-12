import { useRewardedAd } from '@/hooks/useRewardedAd';

const TopBar = () => {
  const { rewardActive } = useRewardedAd();
  return (
    <header className="shrink-0 bg-background border-b border-border z-50">
      <div className="max-w-[480px] mx-auto px-4 h-12 flex items-center">
        <h1 className="text-primary text-sm font-mono font-bold tracking-[0.2em] uppercase">
          Field Manual
        </h1>
        {rewardActive && (
          <span className="ml-auto text-primary text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
            Ad-Free
          </span>
        )}
      </div>
    </header>
  );
};

export default TopBar;
