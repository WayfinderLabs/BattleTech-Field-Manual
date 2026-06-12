import { useRewardedAd } from '@/hooks/useRewardedAd';

const RewardedOfferDialog = () => {
  const { offerVisible, closeOffer, showRewardedAd } = useRewardedAd();

  if (!offerVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6"
      onClick={closeOffer}
    >
      <div
        className="w-full max-w-sm bg-card border border-border p-5 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-primary text-sm uppercase tracking-wider mb-3">
          // Incoming Transmission
        </h2>
        <p className="text-foreground text-sm mb-5 leading-relaxed">
          Watch one short ad to go ad-free for the next 3 hours.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => showRewardedAd()}
            className="w-full py-2.5 font-mono uppercase tracking-wider text-sm bg-primary text-primary-foreground active:scale-[0.98] transition-transform"
          >
            Watch Ad — 3 hrs ad-free
          </button>
          <button
            onClick={closeOffer}
            className="w-full py-2.5 font-mono uppercase tracking-wider text-xs text-muted-foreground active:scale-[0.98] transition-transform"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardedOfferDialog;
